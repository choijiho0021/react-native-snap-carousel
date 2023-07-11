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
  bold14WarmGrey: {
    ...appStyles.bold14Text,
    color: colors.warmGrey,
  },
  warning: {
    ...appStyles.normal14Text,
    textAlign: 'left',
    color: colors.warmGrey,
  },
  warningDot: {
    ...appStyles.normal14Text,
    textAlign: 'left',
    color: colors.warmGrey,
    marginHorizontal: 8,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    paddingVertical: 30,
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
  const [isOverUsed, setIsOverUsed] = useState(false);
  const [quota, setQuota] = useState<number | undefined>(usage?.quota);
  const [used, setUsed] = useState<number | undefined>(usage?.used);
  const isExhausted = useMemo(
    () => (quota || 0) - (used || 0) <= 0,
    [quota, used],
  );
  const circularProgress = useRef();
  const overCircularProgress = useRef();

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

        const progress = used >= 0 ? Math.floor((used / quota) * 100) : 0;
        const overProgress =
          used >= 0 ? Math.floor(((used - quota) / quota) * 100) : 0;

        if (isOverUsed) {
          overCircularProgress.current?.reAnimate(0, overProgress, 3000, null);
        } else {
          circularProgress.current?.reAnimate(0, progress, 3000, null);
        }
      }
    }
    if (esimApp && !cmiStatusCd) {
      console.log('@@ show snackbar');
      showSnackbar();
    }
  }, [cmiStatusCd, isOverUsed, quota, showSnackbar, usage, used]);

  const renderResetTimeRow = useCallback(
    (key: string, rowStyle: ViewStyle = {}) => {
      const tz = key === 'local' ? RNLocalize.getTimeZone() : 'Asia/Seoul';
      // const tz = key === 'local' ? 'America/New_York' : 'Asia/Seoul';

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
    ) : (
      <View style={{height: 20}} />
    );
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
    if (!isOverUsed) {
      return (
        <AnimatedCircularProgress
          ref={circularProgress}
          style={styles.circular}
          size={140}
          width={10}
          fill={0}
          rotation={0}
          backgroundWidth={10}
          tintColor={colors.gray3}
          // onAnimationComplete={() => setIsOverUsed(isExhausted)}
          backgroundColor={colors.clearBlue}>
          {(fill) => {
            if (fill > 100) setIsOverUsed(isExhausted);
            return (
              <View style={{alignItems: 'center'}}>
                <View style={{width: 24, height: 24}}>
                  <Lottie
                    autoPlay={isExhausted}
                    loop
                    source={require('@/assets/images/lottie/lightning.json')}
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
                  {`${toGb(quota - used || 0)}GB`}
                </AppText>
              </View>
            );
          }}
        </AnimatedCircularProgress>
      );
    }
    return (
      <AnimatedCircularProgress
        ref={overCircularProgress}
        style={styles.circular}
        size={140}
        width={10}
        prefill={0}
        fill={0}
        rotation={0}
        backgroundWidth={10}
        tintColor={colors.redError}
        // onAnimationComplete={() => setIsOverUsed(true)}
        backgroundColor={colors.gray3}>
        {(fill) => (
          <View style={{alignItems: 'center'}}>
            <View style={{width: 24, height: 24}}>
              <Lottie
                autoPlay={isExhausted}
                loop
                source={require('@/assets/images/lottie/lightning.json')}
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
              {`${toGb(quota - used || 0)}GB`}
            </AppText>
          </View>
        )}
      </AnimatedCircularProgress>
    );
  }, [isExhausted, isOverUsed, quota, toGb, used]);

  const renderWarning = useCallback(() => {
    return (
      <View style={{width: '100%', marginTop: 16}}>
        {showUsage && (
          <View style={{flexDirection: 'row'}}>
            <AppText style={styles.warningDot}>{i18n.t('centerDot')}</AppText>
            <AppText style={styles.warning}>
              {i18n.t('esim:caution:usage')}
            </AppText>
          </View>
        )}

        <View style={{flexDirection: 'row'}}>
          <AppText style={styles.warningDot}>{i18n.t('centerDot')}</AppText>
          <AppText style={styles.warning}>
            {i18n.t('esim:caution:time')}
          </AppText>
        </View>
      </View>
    );
  }, [showUsage]);

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
                  <View style={{marginTop: 15, marginBottom: 25}}>
                    <AppStyledText
                      text={i18n.t(`esim:${code[v]}Info`)}
                      textStyle={{
                        ...appStyles.normal16Text,
                        textAlign: 'center',
                      }}
                      format={{
                        b: {
                          ...appStyles.bold16Text,
                          textAlign: 'center',
                          color: colors.clearBlue,
                        },
                        r: {
                          ...appStyles.bold16Text,
                          textAlign: 'center',
                          color: colors.redError,
                        },
                      }}
                    />
                  </View>
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
