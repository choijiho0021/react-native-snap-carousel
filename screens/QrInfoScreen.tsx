import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Platform,
  Pressable,
  Linking,
} from 'react-native';
import {
  RouteProp,
  useFocusEffect,
  useIsFocused,
  useRoute,
} from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';
import {ScrollView} from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';
import _ from 'underscore';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DeviceInfo from 'react-native-device-info';
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
import TabBar from './CountryScreen/TabBar';
import {utils} from '@/utils/utils';
import AppModal from '@/components/AppModal';

const {isIOS} = Env.get();
const Tab = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
  box: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.whiteFive,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 28,
    borderRadius: 3,
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
    ...appStyles.bold20Text,
    lineHeight: 24,
    marginBottom: 16,
    color: colors.black,
  },
  esimManualInputInfo: {
    marginBottom: 24,
  },
  copyBox: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.whiteTwo,
    marginVertical: 5,
    borderRadius: 3,
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
    marginTop: 32,
    marginHorizontal: 20,
  },
  center: {
    marginTop: 35,
    alignSelf: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.clearBlue,
    borderRadius: 2,
    paddingVertical: 13,
    paddingHorizontal: 13,
    marginHorizontal: 20,
  },
  qrText: {
    ...appStyles.normal16Text,
    lineHeight: 22,
    color: colors.black,
  },
  qrTextBold: {
    ...appStyles.normal16Text,
    lineHeight: 22,
    color: colors.clearBlue,
  },
  codeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastSpace: {
    height: 30,
  },
  checkBtn: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    borderRadius: 3,
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
    ...appStyles.normal16Text,
    lineHeight: 22,
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
    backgroundColor: colors.backGrey,
    borderRadius: 3,
    borderColor: colors.whiteFive,
    borderWidth: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'right',
  },
  oneTouchTxt: {
    ...appStyles.semiBold16Text,
    lineHeight: 24,
    letterSpacing: -0.16,
    width: '100%',
    color: colors.white,
    textAlign: 'center',
  },
  oneTouchReg: {
    marginTop: 24,
    backgroundColor: colors.clearBlue,
    paddingVertical: 8,
    borderRadius: 3,
    justifyContent: 'center',
  },
  oneTouchInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 36,
    height: 16,
    borderRadius: 30,
    backgroundColor: colors.purplyBlue,
    marginLeft: 2,
  },
  tabTitle: {
    ...appStyles.medium18,
    lineHeight: 26,
    color: colors.gray2,
  },
  selectedTabTitle: {
    ...appStyles.bold18Text,
    color: colors.black,
  },
  cardCheckDescTxt: {
    ...appStyles.medium14,
    marginRight: 20,
  },
  cardCheckTitleTxt: {
    ...appStyles.bold20Text,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  cardCheckBodyTxt: {
    ...appStyles.semiBold16Text,
    lineHeight: 22,
  },
});

type ParamList = {
  QrInfoScreen: {
    mainSubs: RkbSubscription;
  };
};

const showQR = (subs: RkbSubscription) => (
  <View style={styles.modalBody}>
    <AppText style={styles.title}>{i18n.t('esim:showQR')}</AppText>

    {_.isEmpty(subs.qrCode) ? (
      <View style={styles.center}>
        <AppText>{i18n.t('esim:showQR:nothing')}</AppText>
      </View>
    ) : (
      <View>
        <AppStyledText
          textStyle={styles.qrText}
          text={i18n.t('esim:showQR:body_new')}
          format={{b: styles.qrTextBold}}
        />
        <View style={styles.center}>
          <QRCode value={subs.qrCode} size={149} />
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
      format={{b: styles.qrTextBold}}
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
  const [visible, setVisible] = useState(false);
  const tabList = useMemo(
    () => (isIOS ? ['oneTouch', 'qr', 'manual'] : ['qr', 'manual']),
    [],
  );
  const oneTouchScrollRefs = useRef<ScrollView | null>();
  const qrScrollRefs = useRef<ScrollView | null>();
  const manualScrollRefs = useRef<ScrollView | null>();

  const oneTouchLink = useMemo(
    () =>
      `https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=LPA:1$${params.mainSubs?.smdpAddr}$${params.mainSubs?.actCode}`,
    [params.mainSubs?.actCode, params.mainSubs?.smdpAddr],
  );
  const stateColor = useMemo(() => {
    if (cardState === 'R') return colors.clearBlue;
    if (['E', 'DE'].includes(cardState)) return colors.shamrock;
    if (cardState === 'D') return colors.redError;
  }, [cardState]);
  const canCheckEsim = useMemo(
    () => params.mainSubs.partner?.startsWith('cmi') || false,
    [params.mainSubs.partner],
  );

  const scrollToEnd = (key: string) => {
    if (key === 'oneTouch' && oneTouchScrollRefs.current)
      oneTouchScrollRefs.current.scrollToEnd({animated: true});
    if (key === 'qr' && qrScrollRefs.current)
      qrScrollRefs.current.scrollToEnd({animated: true});
    if (key === 'manual' && manualScrollRefs.current)
      manualScrollRefs.current.scrollToEnd({animated: true});
  };

  const getCardState = useCallback((state: string) => {
    switch (state) {
      case 'Released':
        setCardState('R');
        setIsFail(false);
        break;
      case 'Enable':
        setCardState('E');
        setIsFail(false);
        break;
      case 'Disable':
        setCardState('DE');
        setIsFail(false);
        break;
      case 'Delete':
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
    }, 10000);
  }, [showBtn]);

  const renderManual = useCallback(
    () => (
      <View style={styles.modalBody}>
        <AppText style={styles.title}>{i18n.t('esim:manualInput')}</AppText>
        <View style={styles.esimManualInputInfo}>{esimManualInputInfo()}</View>
        {isIOS ? (
          <View>
            {renderCode(i18n.t('esim:smdp'), params.mainSubs?.smdpAddr || '')}
            {renderCode(i18n.t('esim:actCode'), params.mainSubs?.actCode || '')}
          </View>
        ) : (
          renderCode(i18n.t('esim:actCode'), params.mainSubs?.qrCode || '')
        )}
      </View>
    ),
    [
      params.mainSubs?.actCode,
      params.mainSubs?.qrCode,
      params.mainSubs?.smdpAddr,
      renderCode,
    ],
  );

  const onPressOnetouch = useCallback(() => {
    const osVersion = utils.stringToNumber(DeviceInfo.getSystemVersion()) || 0;
    if (osVersion >= 17.4) {
      Linking.openURL(oneTouchLink);
    } else {
      setVisible(true);
    }
  }, [oneTouchLink]);

  const renderOneTouch = useCallback(
    () => (
      <View style={styles.modalBody}>
        <View style={styles.oneTouchInfo}>
          <View style={{width: 233}}>
            <AppText style={styles.title}>{i18n.t('esim:oneTouch')}</AppText>
            <AppStyledText
              textStyle={styles.qrText}
              text={i18n.t('esim:oneTouch:txt')}
              format={{b: styles.qrTextBold}}
            />
          </View>
          <AppIcon name="oneTouch" />
        </View>

        <Pressable onPress={onPressOnetouch} style={styles.oneTouchReg}>
          <AppText style={styles.oneTouchTxt}>
            {i18n.t('esim:oneTouch:reg')}
          </AppText>
        </Pressable>
      </View>
    ),
    [onPressOnetouch],
  );

  const renderCheckReg = useCallback(
    () => (
      <View style={{...styles.box, paddingHorizontal: 0}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <AppText style={styles.cardCheckTitleTxt}>
            {i18n.t('qrInfo:cardCheck:title')}
          </AppText>
          {['R', 'E', 'DE', 'D'].includes(cardState) && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <AppSvgIcon
                name={
                  cardState === 'R'
                    ? 'blueBang'
                    : cardState === 'D'
                    ? 'redWarning'
                    : 'greenCheck'
                }
                style={{marginRight: 2}}
              />
              <AppText
                style={{
                  ...styles.cardCheckBodyTxt,
                  color: stateColor,
                  marginRight: 20,
                }}>
                {i18n.t(`qrInfo:state:${cardState}`)}
              </AppText>
            </View>
          )}
        </View>

        <View style={styles.cardCheckTxt}>
          <View style={{marginTop: 24}}>
            <AppStyledText
              text={i18n.t(`qrInfo:cardCheck:subTitle:${cardState}`)}
              textStyle={styles.cardCheckSubTitle}
              format={{c: {color: stateColor}}}
            />

            {showBtn || loading ? (
              <Pressable
                onPress={() => checkCmiInstall(params.mainSubs)}
                style={[
                  styles.checkBtn,
                  {
                    backgroundColor: loading
                      ? colors.dodgerBlue
                      : colors.clearBlue,
                  },
                ]}>
                <AppText style={styles.checkBtnTxt}>
                  {i18n.t(
                    loading
                      ? 'qrInfo:cardCheck:wait'
                      : cardState === 'N'
                      ? 'qrInfo:cardCheck'
                      : 'qrInfo:reCardCheck',
                  )}
                </AppText>
              </Pressable>
            ) : (
              <View style={{height: 40}} />
            )}
          </View>
          <AppIcon name={`DeviceReg${cardState}`} style={{marginTop: 24}} />
        </View>
        {(['R', 'E', 'DE', 'D'].includes(cardState) || isFail) && (
          <View style={styles.cardCheckDesc}>
            <AppSvgIcon
              name={isFail || cardState === 'D' ? 'regCardWarn' : 'regCardInfo'}
              style={{marginRight: 4, top: 2}}
            />
            <AppStyledText
              textStyle={styles.cardCheckDescTxt}
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
    ),
    [
      cardState,
      checkCmiInstall,
      isFail,
      loading,
      params.mainSubs,
      showBtn,
      stateColor,
    ],
  );

  const CustomTabTitle = ({k, navigation}) => {
    const isFocused = navigation?.isFocused();

    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <AppText style={isFocused ? styles.selectedTabTitle : styles.tabTitle}>
          {i18n.t(`qrInfo:tab:${k}`)}
        </AppText>
        {k === 'oneTouch' && (
          <View style={styles.badge}>
            <AppText
              style={{
                ...appStyles.semiBold11Text,
                color: colors.white,
              }}>
              {i18n.t('localOp:tag:N')}
            </AppText>
          </View>
        )}
      </View>
    );
  };

  const renderTab = useCallback(
    (key: string) => () => {
      const setScrollRef = (ref, key) => {
        if (ref) {
          if (key === 'oneTouch') oneTouchScrollRefs.current = ref;
          if (key === 'qr') qrScrollRefs.current = ref;
          if (key === 'manual') manualScrollRefs.current = ref;
        }
      };

      return (
        <ScrollView ref={(ref) => setScrollRef(ref, key)}>
          {key === 'manual' && renderManual()}
          {key === 'qr' && showQR(params.mainSubs)}
          {key === 'oneTouch' && renderOneTouch()}
          <View
            style={{
              width: '100%',
              height: 10,
              backgroundColor: colors.whiteTwo,
              marginVertical: 40,
            }}
          />
          {canCheckEsim && renderCheckReg()}
        </ScrollView>
      );
    },
    [
      canCheckEsim,
      params.mainSubs,
      renderCheckReg,
      renderManual,
      renderOneTouch,
    ],
  );

  const renderSelectedPane = useCallback(() => {
    return (
      <Tab.Navigator
        initialRouteName="reg"
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          animationEnabled: false,
          swipeEnabled: false,
        }}
        sceneContainerStyle={{backgroundColor: colors.white}}>
        {tabList.map((k) => (
          <Tab.Screen
            key={k}
            name={k}
            component={renderTab(k)}
            options={({navigation}) => {
              return {
                lazy: true,
                title: <CustomTabTitle k={k} navigation={navigation} />, // Use the custom tab title component
              };
            }}
          />
        ))}
      </Tab.Navigator>
    );
  }, [renderTab, tabList]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={appStyles.header}>
        <AppBackButton title={i18n.t('esim:qrInfo')} />
      </View>
      {renderSelectedPane()}
      <View style={styles.lastSpace} />
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackBar(false)}
        textMessage={i18n.t('esim:copyMsg')}
      />
      <AppModal
        title={i18n.t('esim:oneTouch:needUpdate')}
        type="info"
        onOkClose={() => setVisible(false)}
        visible={visible}
      />
    </SafeAreaView>
  );
};

export default QrInfoScreen;
