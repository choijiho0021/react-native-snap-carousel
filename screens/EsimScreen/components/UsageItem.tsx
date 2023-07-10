import Analytics from 'appcenter-analytics';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  Fragment,
} from 'react';
import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {connect} from 'react-redux';
import Video from 'react-native-video';
import _ from 'underscore';
import Lottie from 'lottie-react-native';
import moment from 'moment-timezone';
import * as RNLocalize from 'react-native-localize';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {code, RkbSubscription, RkbSubsUsage} from '@/redux/api/subscriptionApi';
import {AccountModelState} from '@/redux/modules/account';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import Env from '@/environment';
import AppIcon from '@/components/AppIcon';
import TextWithDot from './TextWithDot';
import AppSvgIcon from '@/components/AppSvgIcon';
// import moment from 'moment';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  usageListContainer: {
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  titleLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 33,
  },
  activeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  inactiveContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '100%',
    justifyContent: 'space-between',
  },
  inactiveIcon: {
    ...appStyles.normal14Text,
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
  },
  endInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '100%',
    justifyContent: 'space-between',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  topOfActiveContainer: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  bottomOfActiveContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  circular: {
    marginLeft: 12,
    marginRight: 40,
  },
  usageTitleBold: {
    ...appStyles.bold20Text,
    fontSize: isDeviceSize('small') ? 18 : 20,
    marginBottom: 2,
  },
  usageStatus: {
    ...appStyles.bold14Text,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  usagePeriod: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  normal12WarmGrey: {
    ...appStyles.normal12Text,
    color: colors.warmGrey,
    textAlign: 'left',
  },
  normal14WarmGrey: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
  },
  bold14WarmGrey: {
    ...appStyles.bold14Text,
    color: colors.warmGrey,
  },
  bold16WarmGrey: {
    ...appStyles.bold16Text,
    color: colors.warmGrey,
  },
  warning: {
    ...appStyles.normal14Text,
    textAlign: 'left',
    color: colors.warmGrey,
  },
  divider: {
    height: 1,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  checkUsageBtn: {
    width: 160,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.clearBlue,
    borderRadius: 24,
  },
  checkUsageBtnTitle: {
    ...appStyles.bold16Text,
    textAlign: 'center',
    color: colors.white,
  },
  checkUsageBtnContainer: {
    marginBottom: 30,
    alignContent: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    paddingVertical: 30,
  },
  notShowUsage: {
    width: '100%',
    height: 100,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noticeText: {
    ...appStyles.normal14Text,
    lineHeight: 18,
    color: colors.warmGrey,
    marginRight: 20,
  },
  cautionContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  cautionText: {
    ...appStyles.bold14Text,
    marginLeft: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.backGrey,
  },
  timeItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
  },
  timeDivider: {
    marginHorizontal: 4,
    width: 1,
    height: '50%',
    backgroundColor: colors.lightGrey,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const {esimApp} = Env.get();
const loadingImg = require('../../../assets/images/loading_1.mp4');

function getStatusColor(statusCd: string) {
  let statusColor = colors.warmGrey;
  let statusBackgroundColor = colors.black;
  let isActive = false;

  if (statusCd === API.Subscription.STATUS_ACTIVE) {
    statusColor = colors.tomato;
    statusBackgroundColor = colors.veryLightPink;
    isActive = true;
  } else if (statusCd === API.Subscription.STATUS_RESERVED) {
    statusColor = colors.clearBlue;
    statusBackgroundColor = colors.veryLightBlue;
  } else if (statusCd === API.Subscription.STATUS_INACTIVE) {
    statusColor = colors.black;
    statusBackgroundColor = colors.white;
  } else {
    statusColor = colors.warmGrey;
    statusBackgroundColor = colors.whiteFive;
  }
  return {statusColor, isActive, statusBackgroundColor};
}

type UsageItemProps = {
  item: RkbSubscription;
  onPress: () => void;
  showSnackbar: () => void;
  cmiPending: Boolean;
  usage?: RkbSubsUsage;
  cmiStatusCd?: string;
  endTime?: string;

  account: AccountModelState;
};

const UsageItem: React.FC<UsageItemProps> = ({
  item,
  showSnackbar,
  onPress,
  cmiPending,
  usage,
  cmiStatusCd,
  endTime,
  account: {token},
}) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const [quota, setQuota] = useState<number | undefined>(usage?.quota);
  const [used, setUsed] = useState<number | undefined>(usage?.used);
  const isExhausted = useMemo(
    () => (quota || 0) - (used || 0) <= 0,
    [quota, used],
  );
  const circularProgress = useRef();

  const showExpire = useMemo(() => item.partner !== undefined, [item.partner]); // partner별로 만료기하니 정해지지 않았을 때 조정 필요
  // const showUsage = useMemo(
  //   () =>
  //     item.partner !== 'billionconnect' ||
  //     !(
  //       (item.country?.includes('JP') && item.daily === 'daily') ||
  //       (item.country?.includes('TH') && item.daily === 'total')
  //     ),
  //   [item.country, item.daily, item.partner],
  // );

  const showUsage = useMemo(
    () => item.partner !== 'billionconnect',
    [item.partner],
  );

  useEffect(() => {
    if (disableBtn) {
      setTimeout(() => setDisableBtn(false), 5000);
    }
  }, [disableBtn]);

  useEffect(() => {
    if (cmiStatusCd === 'A') {
      if (usage) {
        setQuota(usage.quota);
        setUsed(usage.used);

        const progress = used >= 0 ? 100 - Math.floor((used / quota) * 100) : 0;
        circularProgress.current?.animate(40, 3000, null);
      }
    }
    if (esimApp && !cmiStatusCd) {
      console.log('@@ show snackbar');
      showSnackbar();
    }
  }, [cmiStatusCd, quota, showSnackbar, usage, used]);

  const getUsage = useCallback(() => {
    if (!esimApp && item.statusCd === 'A') {
      API.Subscription.getSubsUsage({id: item.nid, token}).then((resp) => {
        setDisableBtn(true);
        if (resp.result === 0) {
          const {quota: subsQuota, used: subsUsed} = resp.objects[0];
          const progress =
            subsUsed >= 0 ? 100 - Math.floor((subsUsed / subsQuota) * 100) : 0;

          setQuota(subsQuota);
          setUsed(subsUsed);

          circularProgress.current?.animate(progress, 3000, null);

          Analytics.trackEvent('Page_View_Count', {page: 'Get Detail Data'});
        } else {
          showSnackbar();
        }
      });
    }
  }, [item.nid, item.statusCd, showSnackbar, token]);

  const renderResetTimeRow = useCallback(
    (key: string, rowStyle: ViewStyle = {}) => {
      // const tz = key === 'local' ? RNLocalize.getTimeZone() : 'Asia/Seoul';
      const tz = key === 'local' ? 'America/New_York' : 'Asia/Seoul';

      return (
        <View style={rowStyle}>
          <AppText style={{...appStyles.medium14, color: colors.warmGrey}}>
            {i18n.t(`esim:time:${key}`)}
          </AppText>
          <AppText style={{...appStyles.bold16Text, color: colors.black}}>
            {item.partner === 'cmi'
              ? moment(endTime).tz(tz).format('HH:mm:ss') || i18n.t('contact:q')
              : moment('2023-01-01T01:00:00+0900').tz(tz).format('HH:mm:ss')}
          </AppText>
        </View>
      );
    },
    [endTime, item.partner],
  );

  const expire = useCallback(() => {
    const isDaily = item.daily === 'daily';
    return (
      <Fragment>
        {isDaily && ['cmi', 'quadcell'].includes(item.partner || '') && (
          <View
            style={[
              styles.endInfoContainer,
              {marginTop: 20, marginBottom: 10},
            ]}>
            <AppText style={styles.normal14WarmGrey}>
              {i18n.t('esim:chargeHistory:resetTime')}
            </AppText>
            <AppText style={appStyles.normal14Text}>
              {item.partner === 'cmi'
                ? moment(endTime).tz('Asia/Seoul').format('HH:mm:ss')
                : '01:00:00'}
            </AppText>
          </View>
        )}
        <View
          style={[
            styles.endInfoContainer,
            {marginBottom: isDaily ? 20 : 0, marginTop: isDaily ? 0 : 20},
          ]}>
          <AppText style={styles.normal14WarmGrey}>
            {i18n.t('usim:usingTime')}
          </AppText>
          <AppText style={appStyles.normal14Text}>{`${
            esimApp
              ? moment(endTime).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
              : utils.toDateString(item.endDate)
          } ${i18n.t(`sim:${'until'}`)}`}</AppText>
        </View>
      </Fragment>
    );
  }, [endTime, item.daily, item.endDate, item.partner]);

  // data는 esim:Mb usim:kb 단위
  const toMb = useCallback((data: number) => {
    if (data === 0) return 0;
    return esimApp ? data?.toFixed(2) : utils.numberToCommaString(data / 1024);
  }, []);

  // data는 esim:Mb usim:kb 단위
  const toGb = useCallback((data: number) => {
    if (data === 0) return 0;
    return (esimApp ? data / 1024 : data / 1024 / 1024)?.toFixed(2);
  }, []);

  const renderCaution = useCallback(() => {
    let key = '';
    if (isExhausted) {
      key = 'exhausted';
    } else if (used && quota && Math.floor((used / quota) * 100) >= 80) {
      key = 'reqCharge';
    } else if (!showUsage) {
      key = 'notShow';
    }

    const isNotShow = key === 'notShow';

    return key !== '' ? (
      <View
        style={{
          ...styles.cautionContainer,
          backgroundColor: isNotShow ? colors.backRed : colors.violetbg,
        }}>
        <AppSvgIcon
          name={isNotShow ? 'cautionUsageIcon' : 'checkUsageIcon'}
          style={{marginRight: 10}}
        />
        <AppStyledText
          text={i18n.t(`esim:caution:${key}`)}
          textStyle={{
            ...appStyles.normal14Text,
            color: isNotShow ? colors.redError : colors.violet500,
          }}
          format={{
            b: {
              ...appStyles.bold14Text,
              color: isNotShow ? colors.redError : colors.violet500,
            },
          }}
        />
      </View>
    ) : null;
  }, [isExhausted, quota, showUsage, used]);

  const renderDailyUsage = useCallback(
    () => (
      <View style={{flexDirection: 'row', marginTop: 8, marginBottom: 20}}>
        <AppText style={{...appStyles.bold14Text, textAlign: 'center'}}>
          {i18n.t('esim:dailyUsageAmount')}
        </AppText>
        <AppText
          style={{
            ...appStyles.bold14Text,
            textAlign: 'center',
            color: colors.redError,
          }}>
          {` ${toGb(used || 0)}GB`}
        </AppText>
      </View>
    ),
    [toGb, used],
  );

  const renderTime = useCallback(() => {
    const localTz = RNLocalize.getTimeZone();
    const isTzDiff = localTz !== 'Asia/Seoul';
    // const nowKr = moment().tz('Asia/Seoul');
    // const nowKr = moment().tz('America/New_York');

    return (
      <View style={styles.timeContainer}>
        <View style={styles.timeItem}>
          <AppText
            style={{
              ...appStyles.bold12Text,
              color: colors.black,
              marginBottom: 6,
            }}>
            {i18n.t('esim:time:usable')}
          </AppText>
          <AppText style={{...appStyles.bold16Text, color: colors.clearBlue}}>
            {utils.toDateString(endTime, 'YYYY년 MM월 DD일 HH:mm:ss까지')}
          </AppText>
        </View>

        {item.daily === 'daily' && (
          <Fragment>
            <View style={styles.timeDivider} />

            <View style={styles.timeItem}>
              <AppText
                style={{
                  ...appStyles.bold12Text,
                  color: colors.black,
                  marginBottom: 6,
                }}>
                {i18n.t('esim:time:dataReset')}
              </AppText>

              {isTzDiff ? (
                <View>
                  {renderResetTimeRow('korea', styles.rowBetween)}
                  {renderResetTimeRow('local', styles.rowBetween)}
                </View>
              ) : (
                <View>{renderResetTimeRow('korea')}</View>
              )}
            </View>
          </Fragment>
        )}
      </View>
    );
  }, [endTime, item.daily, renderResetTimeRow]);

  const renderAnimatedCircularProgress = useCallback(() => {
    return (
      <AnimatedCircularProgress
        ref={circularProgress}
        style={styles.circular}
        size={140}
        width={10}
        fill={0}
        rotation={0}
        backgroundWidth={10}
        tintColor={isExhausted ? colors.redError : colors.gray3}
        // onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor={isExhausted ? colors.gray3 : colors.clearBlue}>
        {(fill) => (
          <View style={{alignItems: 'center'}}>
            <View style={{width: 24, height: 24}}>
              <Lottie
                autoPlay={isExhausted}
                loop
                source={require('@/assets/images/lottie/blink.json')}
              />
            </View>
            <AppText style={{...appStyles.bold14Text, textAlign: 'center'}}>
              {i18n.t('esim:remainAmount')}
            </AppText>
            <AppText
              style={{
                ...appStyles.bold24Text,
                color: isExhausted ? colors.redError : colors.clearBlue,
              }}>
              {`${toGb(quota || 0)}GB`}
            </AppText>
          </View>
        )}
      </AnimatedCircularProgress>
    );
  }, [isExhausted, quota, toGb]);

  const renderWarning = useCallback(() => {
    return (
      <View style={{width: '100%', marginTop: 16}}>
        <View style={{flexDirection: 'row'}}>
          <AppText style={styles.warning}>{i18n.t('centerDot')}</AppText>
          <AppText style={styles.warning}>
            {i18n.t('esim:caution:usage')}
          </AppText>
        </View>

        <View style={{flexDirection: 'row'}}>
          <AppText style={styles.warning}>{i18n.t('centerDot')}</AppText>
          <AppText style={styles.warning}>
            {i18n.t('esim:caution:time')}
          </AppText>
        </View>
      </View>
    );
  }, []);

  const usageRender = useCallback(() => {
    return (
      <View style={styles.activeContainer}>
        {showUsage && renderAnimatedCircularProgress()}

        {showUsage &&
          isExhausted &&
          item.daily === 'daily' &&
          renderDailyUsage()}

        {!showUsage && (
          <AppSvgIcon style={{marginBottom: 20}} name="notShowEsimUsage" />
        )}

        {renderCaution()}

        {renderTime()}

        {renderWarning()}
      </View>
    );
  }, [
    isExhausted,
    item.daily,
    renderAnimatedCircularProgress,
    renderCaution,
    renderDailyUsage,
    renderTime,
    renderWarning,
    showUsage,
  ]);

  const statusBox = useCallback(
    (statusCd: string) => {
      return (
        <View>
          {statusCd === 'A' && (
            <View>
              <View>
                <AppText key={item.key} style={styles.usageTitleBold}>
                  {item.prodName}
                </AppText>
                <AppText key={item.prodName} style={styles.bold14WarmGrey}>
                  {i18n.t('esim:quota', {quota: toGb(quota || 0)})}
                </AppText>
              </View>

              {usageRender()}
            </View>
          )}
          {['R', 'U'].map((v) => {
            return (
              statusCd === v && (
                <View key={v}>
                  <AppIcon style={{alignItems: 'center'}} name={`usage${v}`} />
                  <AppText style={styles.inactiveIcon}>
                    {i18n.t(`esim:${code[v]}Info`)}
                  </AppText>
                  {item.partner === 'billionconnect' && (
                    <TextWithDot
                      text={i18n.t('quadcell:usageInfo')}
                      textStyle={styles.noticeText}
                    />
                  )}
                </View>
              )
            );
          })}
        </View>
      );
    },
    [item.key, item.partner, item.prodName, quota, toGb, usageRender],
  );

  const [status, statusCd] = esimApp
    ? [i18n.t(`esim:${cmiStatusCd || 'R'}`), cmiStatusCd || 'R']
    : [item.status, item.statusCd];

  const {statusColor = colors.warmGrey, statusBackgroundColor} =
    getStatusColor(statusCd);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.usageListContainer}>
        <View style={styles.titleLine}>
          <AppText key={i18n.t('esim:checkUsage')} style={appStyles.bold18Text}>
            {i18n.t('esim:checkUsage')}
          </AppText>
          {!cmiPending && (
            <AppText
              key={item.nid}
              style={[
                styles.usageStatus,
                {color: statusColor, backgroundColor: statusBackgroundColor},
              ]}>
              {status}
            </AppText>
          )}
        </View>
        {cmiPending ? (
          <View style={{paddingVertical: 30, height: 170}}>
            <Video
              source={loadingImg}
              resizeMode="cover"
              repeat
              style={styles.backgroundVideo}
              mixWithOthers="mix"
            />
          </View>
        ) : (
          statusBox(statusCd)
        )}
      </View>
    </TouchableOpacity>
  );
};

export default connect(({account}: RootState) => ({account}))(UsageItem);
