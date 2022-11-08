import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Platform} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';
import {ScrollView} from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';
import _ from 'underscore';
import {colors} from '@/constants/Colors';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import {renderInfo} from './EsimScreen';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import AppButton from '@/components/AppButton';
import AppStyledText from '@/components/AppStyledText';
import AppSnackBar from '@/components/AppSnackBar';

const {isIOS} = Env.get();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  guideBanner: {
    marginTop: 24,
    marginBottom: 4,
  },
  box: {
    marginHorizontal: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.whiteFive,
    backgroundColor: colors.white,
    padding: 20,
    paddingTop: 28,
    paddingBottom: 38,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(52, 62, 95)',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    ...appStyles.semiBold20Text,
    lineHeight: 24,
    color: colors.black,
  },
  esimManualInputInfo: {
    marginTop: 8,
    marginBottom: 29,
  },
  copyBox: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.whiteTwo,
    marginVertical: 5,
  },
  copyBoxTitle: {
    ...appStyles.normal16Text,
    lineHeight: 24,
    letterSpacing: 0.26,
    color: 'rgb(119, 119, 119)',
    marginBottom: 6,
  },
  btnCopy: {
    backgroundColor: colors.white,
    marginLeft: 10,
    width: 62,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  content: {
    ...appStyles.robotoBold16Text,
    flex: 1,
    color: colors.black,
  },
  modalBody: {
    marginTop: 8,
  },
  center: {
    marginTop: 35,
    alignSelf: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.clearBlue,
    paddingVertical: 13,
    paddingHorizontal: 13,
  },
  qrText: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    color: colors.black,
  },
  codeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 30,
  },
});

type ParamList = {
  QrInfoScreen: {
    mainSubs: RkbSubscription;
  };
};

const showQR = (subs: RkbSubscription) => (
  <View style={styles.modalBody}>
    {_.isEmpty(subs.qrCode) ? (
      <View style={styles.center}>
        <AppText>{i18n.t('esim:showQR:nothing')}</AppText>
      </View>
    ) : (
      <View>
        <AppStyledText
          textStyle={styles.qrText}
          text={i18n.t('esim:showQR:body_new')}
          format={{b: {fontWeight: 'bold'}}}
        />
        <View style={styles.center}>
          <QRCode value={subs.qrCode} />
        </View>
      </View>
    )}
  </View>
);

const esimManualInputInfo = () => (
  <View>
    <AppStyledText
      textStyle={styles.qrText}
      text={i18n.t('esim:manualInput:body_new')}
      format={{b: {fontWeight: 'bold', color: colors.black}}}
    />
  </View>
);

const QrInfoScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'QrInfoScreen'>>();
  const params = useMemo(() => route?.params, [route?.params]);
  const [copyString, setCopyString] = useState('');
  const [showSnackBar, setShowSnackBar] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('esim:qrInfo')} />,
    });
  }, [navigation]);

  const copyToClipboard = useCallback((value?: string) => {
    if (value) {
      Clipboard.setString(value);
      setCopyString(value);
    }
  }, []);

  const renderCode = useCallback(
    (title: string, content: string) => {
      const selected = copyString === content;
      return (
        <View style={styles.copyBox}>
          <AppText style={styles.copyBoxTitle}>{title}</AppText>
          <View style={styles.codeContent}>
            <AppText style={styles.content}>{content}</AppText>
            <AppButton
              title={i18n.t('copy')}
              titleStyle={[
                appStyles.normal14Text,
                {color: selected ? colors.clearBlue : colors.black},
              ]}
              style={[
                styles.btnCopy,
                {
                  borderColor: selected ? colors.clearBlue : colors.lightGrey,
                  borderRadius: 3,
                },
              ]}
              onPress={() => {
                copyToClipboard(content);
                setShowSnackBar(true);
              }}
            />
          </View>
        </View>
      );
    },
    [copyString, copyToClipboard],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView style={styles.container}>
        <View style={styles.guideBanner}>{renderInfo(navigation)}</View>
        <View style={styles.box}>
          <AppText style={styles.title}>{i18n.t('esim:qr')}</AppText>
          {showQR(params.mainSubs)}
        </View>
        <View style={styles.box}>
          <AppText style={styles.title}>{i18n.t('esim:manualInput')}</AppText>
          <View style={styles.esimManualInputInfo}>
            {esimManualInputInfo()}
          </View>
          {isIOS ? (
            <View>
              {renderCode(i18n.t('esim:smdp'), params.mainSubs?.smdpAddr || '')}
              {renderCode(
                i18n.t('esim:actCode'),
                params.mainSubs?.actCode || '',
              )}
            </View>
          ) : (
            renderCode(i18n.t('esim:actCode'), params.mainSubs?.qrCode || '')
          )}
        </View>
        <View style={styles.divider} />
      </ScrollView>
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackBar(false)}
        textMessage={i18n.t('esim:copyMsg')}
      />
    </SafeAreaView>
  );
};

export default QrInfoScreen;
