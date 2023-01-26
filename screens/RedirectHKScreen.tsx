import Clipboard from '@react-native-community/clipboard';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  Linking,
  Dimensions,
  Pressable,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {bindActionCreators, RootState} from 'redux';
import {connect} from 'react-redux';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {navigate} from '@/navigation/navigation';
import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import {sliderWidth, MAX_WIDTH} from '@/constants/SliderEntry.style';
import AppSnackBar from '@/components/AppSnackBar';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppStyledText from '@/components/AppStyledText';
import {getImage} from '@/utils/utils';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import {AccountModelState} from '@/redux/modules/account';
import {API} from '@/redux/api';
import HkStatusLottie from './EsimScreen/components/HkStatusLottie';
import AppModal from '@/components/AppModal';

const {width} = Dimensions.get('window');

const dir = '../assets/images/guide_HK';
const guideImage: Record<string, any[]> = {
  step1: [require(`${dir}/guideHK1.png`), require(`${dir}/en.guideHK1.png`)],
  step2: [require(`${dir}/guideHK2.png`), require(`${dir}/en.guideHK2.png`)],
  step3: [require(`${dir}/guideHK3.png`), require(`${dir}/en.guideHK3.png`)],
  step4: [require(`${dir}/guideHK4.png`), require(`${dir}/en.guideHK4.png`)],
  step5: [require(`${dir}/guideHK5.png`), require(`${dir}/en.guideHK5.png`)],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnCopy: {
    backgroundColor: colors.white,
    width: 62,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    marginLeft: 20,
    borderColor: colors.lightGrey,
  },
  keyTitle: {
    ...appStyles.normal16Text,
    marginBottom: 10,
    color: colors.warmGrey,
  },
  guide: {
    ...appStyles.bold18Text,
    marginBottom: 16,
  },
  copyBox: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteTwo,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  textUnderLine: {
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
  },
  guideContainer: {
    backgroundColor: colors.whiteSix,
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  dotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.black,
  },
  inactiveDotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cccccc',
  },
  confirm: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    color: colors.white,
    textAlign: 'center',
  },
  confirmTitle: {
    ...appStyles.normal18Text,
    color: colors.white,
    textAlign: 'center',
    margin: 5,
  },
  image: {
    width: '100%',
    maxWidth: width - 40,
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
  },
  hkCheckBox: {
    marginTop: 2,
    marginHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderColor: colors.whiteFive,
    borderWidth: 1,
    borderRadius: 3,
    height: 184,

    shadowColor: 'rgb(52, 62, 95)',
    elevation: 10,
    shadowRadius: 3,
    shadowOpacity: 0.1,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    backgroundColor: colors.white,
  },
  hkCheckBoxBtn: {
    marginTop: 24,
    backgroundColor: colors.clearBlue,
    width: 120,
    height: 40,
    borderRadius: 3,
  },
  hkCheckDisBtn: {
    backgroundColor: colors.clearBlue,
    opacity: 0.6,
  },
  hkCheckIcon: {
    alignSelf: 'flex-end',
  },
  registingInfo: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 32,
    marginTop: 8,
  },
  modalContent: {
    marginHorizontal: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 20,
    paddingTop: 24,
    maxWidth: MAX_WIDTH,
    width: '100%',
  },
  modalTitleText: {
    ...appStyles.bold18Text,
    lineHeight: 24,
    color: colors.redError,
    marginLeft: 8,
  },
  modalBodyText: {
    ...appStyles.medium16,
    lineHeight: 24,
    color: colors.black,
    marginBottom: 36,
  },
  hkInfoText: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    letterSpacing: 0,
  },
  hkCheckTextSmall: {
    ...appStyles.medium14,
    lineHeight: 24,
    color: colors.black,
  },
  hkCheckTextSmallBold: {
    ...appStyles.bold14Text,
    lineHeight: 24,
    color: colors.black,
  },
  hkCheckTextEmphasis: {
    ...appStyles.medium16,
    lineHeight: 22,
    color: colors.clearBlue,
  },
  hkCheckTextEmphasisBold: {
    ...appStyles.bold16Text,
    lineHeight: 22,
    color: colors.clearBlue,
  },
  hkCheckText: {
    ...appStyles.medium16,
    lineHeight: 22,
    color: colors.black,
  },
  hkCheckTextRed: {
    ...appStyles.medium16,
    lineHeight: 22,
    color: colors.redError,
  },
  hkCheckTextSemiBold: {
    ...appStyles.semiBold16Text,
    lineHeight: 22,
    color: colors.black,
  },
  hkCheckBoxBtnText: {
    ...appStyles.medium16,
    lineHeight: 40,
    color: colors.white,
  },
  hkCheckTextSmallSmall: {
    ...appStyles.medium14,
    lineHeight: 28,
    color: colors.black,
  },
  registingInfoText: {
    marginLeft: 8,
    ...appStyles.medium16,
    lineHeight: 20,
    color: colors.redError,
  },
});

type CarouselIndex = 'step1' | 'step2' | 'step3' | 'step4';

type ParamList = {
  RedirectHKScreen: {
    iccid: string;
    orderNo: string;
    uuid: string;
    imsi: string;
  };
};

type RedirectHKScreenProps = {
  account: AccountModelState;
  action: {
    order: OrderAction;
  };
};

type hkRegStatusType =
  | 'hkCheck'
  | 'hkUnregistered'
  | 'hkRegistering'
  | 'hkRegistered';

const RedirectHKScreen: React.FC<RedirectHKScreenProps> = ({
  account,
  action,
}) => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'RedirectHKScreen'>>();

  const [activeSlide, setActiveSlide] = useState(0);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [copyString, setCopyString] = useState('');
  const [hkRegStatus, sethkRegStatus] = useState<hkRegStatusType>('hkCheck');
  const [reCheckCount, setReCheckCount] = useState(0);
  const [reCheckable, setReCheckable] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const images = useMemo(() => Object.keys(guideImage), []);
  const params = useMemo(() => route?.params, [route?.params]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('redirectHK')} />,
      headerRight: () => (
        <AppSvgIcon
          name="btnCnter"
          style={styles.btnCnter}
          onPress={() =>
            navigate(navigation, route, 'EsimStack', {
              tab: 'HomeStack',
              screen: 'Contact',
            })
          }
        />
      ),
    });
  }, [navigation, route]);

  const copyToClipboard = useCallback(
    (value?: string) => () => {
      if (value) {
        Clipboard.setString(value);
        setShowSnackBar(true);
        setCopyString(value);
      }
    },
    [],
  );

  const renderGuideHK = useCallback(
    ({item}: {item: CarouselIndex}) => (
      <Image
        style={styles.image}
        source={getImage(guideImage, item)}
        resizeMode="contain"
      />
    ),
    [],
  );

  const updateTag = useCallback(
    (tag: string) => {
      const {token} = account;

      action.order.updateSubsAndOrderTag({
        uuid: params.uuid,
        tag,
        token: token || '',
      });
    },
    [account, action.order, params.uuid],
  );

  const checkAndUpdateTag = useCallback(async () => {
    let isRegsiting = false;
    const rsp = await API.Subscription.getHkRegStatus({
      iccid: params.iccid,
      imsi: params.imsi,
    });

    // 테스트용 -> 실패
    // const rsp = await API.Subscription.getHkRegStatus({
    //   iccid: '89852340003831754297',
    //   imsi: '454120383175429',
    // });

    // 테스트용 -> 성공
    // const rsp = await API.Subscription.getHkRegStatus({
    //   iccid: '89852340003831753265',
    //   imsi: '454120383175326',
    // });

    if (rsp.result === 0 && rsp.objects) {
      const hkRegStatusCode = rsp.objects[0].hkRegStatus;
      switch (hkRegStatusCode) {
        case '2':
          isRegsiting = true;
          sethkRegStatus('hkRegistering');
          setReCheckable(false);
          break;
        case '3':
          sethkRegStatus('hkRegistered');
          updateTag('HA');
          break;
        default:
          sethkRegStatus('hkUnregistered');
          updateTag('HF');
          break;
      }
    }

    setTimeout(() => {
      if (isRegsiting) {
        const temp = reCheckCount + 1;
        setReCheckCount(temp);
        if (temp < 3) {
          setReCheckable(true);
        } else {
          sethkRegStatus('hkCheck');
          setReCheckCount(0);
        }
      } else {
        sethkRegStatus('hkCheck');
      }
    }, 20000);
  }, [reCheckCount, params.iccid, params.imsi, updateTag]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <View style={{margin: 20}}>
          <AppStyledText
            textStyle={styles.hkInfoText}
            text={i18n.t('redirectHK:info1')}
            format={{b: {color: colors.blue}}}
          />
          <AppText style={[appStyles.bold14Text, {marginTop: 20}]}>
            {i18n.t('redirectHK:info3')}
          </AppText>
        </View>

        <View style={styles.guideContainer}>
          <AppText style={styles.guide}>{i18n.t('redirectHK:guide')}</AppText>
          <Carousel
            data={images}
            renderItem={renderGuideHK}
            onSnapToItem={(index) => setActiveSlide(index)}
            autoplay={false}
            useScrollView
            lockScrollWhileSnapping
            resizeMode="contain"
            overflow="hidden"
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
          />

          <Pagination
            dotsLength={images.length}
            activeDotIndex={activeSlide}
            dotContainerStyle={{width: 2, height: 15}}
            dotStyle={styles.dotStyle}
            inactiveDotStyle={styles.inactiveDotStyle}
            inactiveDotOpacity={0.4}
            inactiveDotScale={1.0}
            containerStyle={{paddingTop: 16, paddingBottom: 0}}
          />
        </View>
        <View style={{paddingHorizontal: 20, marginBottom: 32, marginTop: 24}}>
          {['iccid', 'orderNo'].map((elm) => (
            <View style={styles.copyBox}>
              <View style={{flex: 9}}>
                <AppText style={styles.keyTitle}>
                  {i18n.t(`redirectHK:${elm}`)}
                </AppText>
                <View style={styles.textUnderLine}>
                  <AppText style={appStyles.bold16Text}>{params[elm]}</AppText>
                </View>
              </View>
              <AppButton
                title={i18n.t('copy')}
                titleStyle={[
                  appStyles.normal14Text,
                  {
                    color:
                      copyString === params[elm]
                        ? colors.clearBlue
                        : colors.black,
                  },
                ]}
                style={[
                  styles.btnCopy,
                  {
                    borderColor:
                      copyString === params[elm]
                        ? colors.clearBlue
                        : colors.lightGrey,
                  },
                ]}
                onPress={copyToClipboard(params[elm])}
              />
            </View>
          ))}
        </View>

        <View style={[styles.hkCheckBox, styles.row]}>
          <View>
            <AppStyledText
              text={i18n.t(`redirectHK:hkRegStatus:${hkRegStatus}`)}
              textStyle={styles.hkCheckText}
              format={{
                e: styles.hkCheckTextEmphasis,
                smb: styles.hkCheckTextSemiBold,
                eb: styles.hkCheckTextEmphasisBold,
                s: styles.hkCheckTextSmall,
                sb: styles.hkCheckTextSmallBold,
                r: styles.hkCheckTextRed,
                ss: styles.hkCheckTextSmallSmall,
              }}
            />
            {(hkRegStatus === 'hkCheck' || hkRegStatus === 'hkRegistering') && (
              <AppButton
                style={styles.hkCheckBoxBtn}
                onPress={checkAndUpdateTag}
                title={i18n.t(
                  `redirectHK:hkRegStatus:btn:${
                    hkRegStatus === 'hkRegistering' && reCheckable
                      ? 'reCheck'
                      : hkRegStatus
                  }`,
                )}
                titleStyle={styles.hkCheckBoxBtnText}
                disabled={hkRegStatus === 'hkRegistering' && !reCheckable}
                disableStyle={styles.hkCheckDisBtn}
              />
            )}
          </View>
          <View style={styles.hkCheckIcon}>
            {hkRegStatus === 'hkCheck' ? (
              <AppSvgIcon name={`${hkRegStatus}`} />
            ) : (
              <HkStatusLottie hkRegStatus={hkRegStatus} />
            )}
          </View>
        </View>

        {hkRegStatus === 'hkRegistering' ? (
          <Pressable
            style={[styles.row, styles.registingInfo]}
            onPress={() => {
              setShowModal(true);
            }}>
            <View style={[styles.row, {justifyContent: 'flex-start'}]}>
              <AppSvgIcon name="cautionIcon" />
              <AppText style={styles.registingInfoText}>
                {i18n.t('redirectHK:hkRegStatus:registingInfo')}
              </AppText>
            </View>

            <AppSvgIcon name="rightArrow" style={{right: 0}} />
          </Pressable>
        ) : (
          <View style={{height: 50}} />
        )}

        <AppButton
          style={styles.confirm}
          titleStyle={styles.confirmTitle}
          title={i18n.t('esim:redirectHKRegister')}
          onPress={async () => {
            // 홍콩 실명인증 웹 페이지
            updateTag('HQ');
            await Linking.openURL(
              'https://global.cmlink.com/store/realname?LT=en',
            );
          }}
        />
      </ScrollView>

      <AppModal
        type="close"
        justifyContent="flex-end"
        titleViewStyle={{justifyContent: 'flex-start'}}
        contentStyle={styles.modalContent}
        onOkClose={() => setShowModal(false)}
        visible={showModal}>
        <View
          style={[
            styles.row,
            {justifyContent: 'flex-start', marginBottom: 16},
          ]}>
          <AppSvgIcon name="cautionIcon" />
          <AppText style={styles.modalTitleText}>
            {i18n.t('redirectHK:hkRegStatus:registingInfo')}
          </AppText>
        </View>
        <AppText style={styles.modalBodyText}>
          {i18n.t('redirectHK:hkRegStatus:registingInfo:ment')}
        </AppText>
      </AppModal>

      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackBar(false)}
        textMessage={i18n.t('redirectHK:copySuccess')}
        bottom={90}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({account, order}: RootState) => ({
    account,
    order,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(RedirectHKScreen);
