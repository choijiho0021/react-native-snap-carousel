import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Clipboard} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {ScrollView} from 'react-native-gesture-handler';
import {colors} from '@/constants/Colors';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import {renderInfo} from './EsimScreen';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {esimManualInputInfo, showQR} from './EsimScreen/components/EsimModal';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import AppButton from '@/components/AppButton';

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
    margin: 20,
    borderWidth: 1,
    borderColor: colors.whiteFive,
    padding: 20,
  },
  title: {
    ...appStyles.semiBold20Text,
    color: colors.black,
  },
  esimManualInputInfo: {
    marginVertical: 20,
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
});

type ParamList = {
  QrInfoScreen: {
    item: RkbSubscription;
  };
};

const QrInfoScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'QrInfoScreen'>>();
  const params = useMemo(() => route?.params, [route?.params]);
  const [copyString, setCopyString] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('esim:qrInfo')} />,
    });
  }, [navigation]);

  const copyToClipboard = useCallback(
    (value?: string) => () => {
      if (value) {
        Clipboard.setString(value);
        setCopyString(value);
      }
    },
    [],
  );

  const renderCode = useCallback(
    (title: string, content: string) => {
      const selected = copyString === content;
      return (
        <View style={styles.copyBox}>
          <AppText style={styles.copyBoxTitle}>{title}</AppText>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <AppText style={{flex: 1}}>{content}</AppText>
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
              onPress={copyToClipboard(content)}
            />
          </View>
        </View>
      );
    },
    [copyString, copyToClipboard],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.guideBanner}>{renderInfo(navigation)}</View>
        <View style={styles.box}>
          <AppText style={styles.title}>{i18n.t('esim:qr')}</AppText>
          {showQR(params.item)}
        </View>
        <View style={styles.box}>
          <AppText style={styles.title}>{i18n.t('esim:manualInput')}</AppText>
          <View style={styles.esimManualInputInfo}>
            {esimManualInputInfo()}
          </View>
          {isIOS ? (
            <View>
              {renderCode(i18n.t('esim:smdp'), params.item.smdpAddr)}
              {renderCode(i18n.t('esim:actCode'), params.item.actCode)}
            </View>
          ) : (
            renderCode(i18n.t('esim:actCode'), params.item.qrCode)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QrInfoScreen;
