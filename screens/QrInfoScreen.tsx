import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import AppStyledText from '@/components/AppStyledText';
import AppSnackBar from '@/components/AppSnackBar';
import AppCopyBtn from '@/components/AppCopyBtn';
import {API} from '@/redux/api';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppIcon from '@/components/AppIcon';

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
    paddingHorizontal: 20,
    paddingTop: 28,
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
  checkBtn: {
    width: 120,
    height: 40,
    backgroundColor: colors.clearBlue,
    justifyContent: 'center',
  },
  checkBtnTxt: {
    ...appStyles.semiBold16Text,
    color: colors.white,
    alignSelf: 'center',
  },
  cardCheckDesc: {
    borderTopColor: colors.whiteFive,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
  },
  cardCheckTxt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  cardCheckSubTitle: {
    ...appStyles.robotoSemiBold16Text,
    marginTop: 24,
    marginBottom: 16,
  },
  scrollTxt1: {
    ...appStyles.bold16Text,
    color: colors.black,
  },
  scrollTxt2: {
    ...appStyles.bold14Text,
    color: colors.clearBlue,
  },
  rowCenter: {
    flex: 1,
  },
  scrollBtn: {
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteFive,
    borderRadius: 3,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'right',
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

type CardState = 'N' | 'R' | 'E' | 'DE' | 'D';

const QrInfoScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'QrInfoScreen'>>();
  const params = useMemo(() => route?.params, [route?.params]);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBtn, setShowBtn] = useState(true);
  const [cardState, setCardState] = useState<CardState>('N');
  const [isFail, setIsFail] = useState(false);

  const scrollRef = useRef<ScrollView>();
  const navigation = useNavigation();

  const getCardState = useCallback((state: string) => {
    switch (state) {
      case 'Released':
        setCardState('R');
        setIsFail(false);
        break;
      case 'Enabled':
        setCardState('E');
        setIsFail(false);
        break;
      case 'Disabled':
        setCardState('DE');
        setIsFail(false);
        break;
      case 'Deleted':
        setCardState('D');
        setIsFail(false);
        break;

      default:
        setIsFail(true);
    }
  }, []);

  const checkCmiInstall = useCallback(
    async (item: RkbSubscription) => {
      setLoading(true);
      setShowBtn(false);
      if (item?.subsIccid) {
        const {result, objects} = await API.Subscription.getCmiCardInfo({
          iccid: item?.subsIccid,
        });

        if (result?.code === 0) {
          // release : 설치 전, enable : 설치 후 회선 on , disable : 설치 후 회선 off, delete : 삭제 후
          getCardState(objects?.data.state);
        } else {
          setIsFail(true);
        }
      }
      setLoading(false);
      return {};
    },
    [getCardState],
  );

  const renderInfo = useCallback(
    (scrollRef) => (
      <Pressable
        style={styles.scrollBtn}
        onPress={() => scrollRef?.current.scrollToEnd()}>
        <AppSvgIcon name="qrInfoQuestion" style={{marginRight: 8}} />
        <View style={styles.rowCenter}>
          <AppText style={styles.scrollTxt1}>
            {i18n.t('qrinfo:scrollTxt1')}
          </AppText>
          <AppText style={styles.scrollTxt2}>
            {i18n.t('qrinfo:scrollTxt2')}
          </AppText>
        </View>
        <View style={styles.rowRight}>
          <AppIcon name="lower" />
        </View>
      </Pressable>
    ),
    [],
  );

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
      if (!showBtn) {
        setShowBtn(true);
      }
    }, 20000);
  }, [showBtn]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={appStyles.header}>
        <AppBackButton title={i18n.t('esim:qrInfo')} />
      </View>
      <ScrollView style={styles.container} ref={scrollRef}>
        <View style={styles.guideBanner}>{renderInfo(scrollRef)}</View>
        <View style={{...styles.box, paddingBottom: 38}}>
          <AppText style={styles.title}>{i18n.t('esim:qr')}</AppText>
          {showQR(params.mainSubs)}
        </View>
        <View style={{...styles.box, paddingBottom: 38}}>
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

        {params.mainSubs.partner?.startsWith('cmi') && (
          <View style={{...styles.box, paddingHorizontal: 0}}>
            <AppText
              style={[
                appStyles.bold20Text,
                {marginTop: 4, paddingHorizontal: 20},
              ]}>
              {i18n.t('qrInfo:cardCheck:title')}
            </AppText>

            <View style={styles.cardCheckTxt}>
              <View>
                <AppStyledText
                  text={i18n.t(`qrInfo:cardCheck:subTitle:${cardState}`)}
                  textStyle={styles.cardCheckSubTitle}
                  format={{c: {color: colors.clearBlue}}}
                />

                {(showBtn || loading) && (
                  <Pressable
                    onPress={() => checkCmiInstall(params.mainSubs)}
                    style={styles.checkBtn}>
                    <AppText style={styles.checkBtnTxt}>
                      {i18n.t(
                        loading ? 'qrInfo:cardCheck:wait' : 'qrInfo:cardCheck',
                      )}
                    </AppText>
                  </Pressable>
                )}
              </View>
              <AppIcon name={`DeviceReg${cardState}`} />
            </View>
            {(['R', 'E', 'DE', 'D'].includes(cardState) || isFail) && (
              <View style={styles.cardCheckDesc}>
                <AppSvgIcon
                  name="regCardInfo"
                  style={{marginRight: 4, top: 2}}
                />
                <AppStyledText
                  textStyle={appStyles.medium14}
                  text={i18n.t(
                    isFail
                      ? 'qrInfo:cardCheck:desc:fail'
                      : `qrInfo:cardCheck:desc:${cardState}`,
                  )}
                  format={{b: {color: colors.redError}}}
                />
              </View>
            )}
          </View>
        )}
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
