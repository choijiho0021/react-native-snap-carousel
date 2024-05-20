import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Platform,
  Pressable,
} from 'react-native';
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
import AppStyledText from '@/components/AppStyledText';
import AppSnackBar from '@/components/AppSnackBar';
import AppCopyBtn from '@/components/AppCopyBtn';
import {API} from '@/redux/api';

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
          format={{b: {fontWeight: 'bold', color: colors.black}}}
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
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [cardState, setCardState] = useState('wait');
  const [cardInfo, setCardInfo] = useState<String>('test');

  const navigation = useNavigation();

  const checkCmiInstall = useCallback(async (item: RkbSubscription) => {
    if (item?.subsIccid) {
      const {result, objects} = await API.Subscription.getCmiCardInfo({
        iccid: item?.subsIccid,
      });

      setCardInfo(JSON.stringify(objects?.data || ''));
      setCardState(objects?.data.state);
      // if (result?.code === 0) return objects[0];
    }
    return {};
  }, []);

  const copyToClipboard = useCallback((value?: string) => {
    if (value) Clipboard.setString(value);
  }, []);

  const renderCode = useCallback(
    (title: string, content: string) => {
      return (
        <View style={styles.copyBox}>
          <AppText style={styles.copyBoxTitle}>{title}</AppText>
          <View style={styles.codeContent}>
            <AppText style={styles.content}>{content}</AppText>
            <AppCopyBtn
              title={i18n.t('copy')}
              onPress={() => {
                copyToClipboard(content);
                setShowSnackBar(true);
              }}
            />
          </View>
        </View>
      );
    },
    [copyToClipboard],
  );

  useEffect(() => {
    setTimeout(() => {
      if (cardState !== 'wait') {
        setCardInfo('test');
        setCardState('wait');
      }
    }, 3000);
  }, [cardState]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={appStyles.header}>
        <AppBackButton title={i18n.t('esim:qrInfo')} />
      </View>
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

        {params.mainSubs.partner?.startsWith('cmi') && (
          <>
            <Pressable
              onPress={() => checkCmiInstall(params.mainSubs)}
              style={{
                marginHorizontal: 20,
                marginBottom: 30,
                backgroundColor: colors.clearBlue,
              }}>
              <AppText>get card info button --- state : {cardState}</AppText>
            </Pressable>
            <View style={{marginHorizontal: 20}}>
              {cardInfo.split(',').map((elm) => (
                <AppText>{elm}</AppText>
              ))}
            </View>
          </>
        )}
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
