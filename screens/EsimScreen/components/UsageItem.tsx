import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  Fragment,
  memo,
} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Video from 'react-native-video';
import Lottie from 'lottie-react-native';
import moment from 'moment-timezone';
import * as RNLocalize from 'react-native-localize';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import {
  code,
  RkbSubscription,
  UsageObj,
  UsageOptionObj,
} from '@/redux/api/subscriptionApi';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import Env from '@/environment';
import AppIcon from '@/components/AppIcon';
import TextWithDot from './TextWithDot';
import AppSvgIcon from '@/components/AppSvgIcon';
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
    flex: 1,
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
    marginTop: 20,
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
  showSnackbar: () => void;
  usageLoading: Boolean;
  usage?: UsageObj;
  dataStatusCd?: string;
  dataUsageOption?: UsageOptionObj;
  endTime?: string;
};

const UsageItem: React.FC<UsageItemProps> = ({
  item,
  showSnackbar,
  usageLoading,
  usage,
  dataStatusCd,
  dataUsageOption,
  endTime,
}) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const [quota, setQuota] = useState<number>(usage?.quota || 0);
  const [used, setUsed] = useState<number>(usage?.used || 0);
  const [remain, setRemain] = useState<number>(usage?.remain || 0);
  const [totalUsed, setTotalUsed] = useState<number>(usage?.totalUsed || 0);
  const isExhausted = useMemo(() => remain <= 0, [remain]);
  const isLowRemain = useMemo(
    () => quota >= 0 && remain / quota <= 0.2,
    [quota, remain],
  );
  const circularProgress = useRef();

  const isError = useMemo(() => {
    return dataStatusCd === 'E';
  }, [dataStatusCd]);

  const [showStatus, showUsage, showEndTime] = useMemo(
    () => [
      dataUsageOption?.mode?.includes('stu'),
      dataUsageOption?.mode?.includes('usa'),
      dataUsageOption?.mode?.includes('end'),
    ],
    [dataUsageOption?.mode],
  );

  useEffect(() => {
    if (disableBtn) {
      setTimeout(() => setDisableBtn(false), 5000);
    }
  }, [disableBtn]);

  useEffect(() => {
    if (showUsage && dataStatusCd === 'A') {
      if (
        usage?.quota !== undefined &&
        usage?.remain !== undefined &&
        usage?.remain >= 0
      ) {
        setQuota(usage.quota || 0);
        setUsed(usage.used || 0);
        setRemain(usage.remain || 0);
        setTotalUsed(usage.totalUsed || 0);
        const progress =
          quota > 0 ? Math.floor(((quota - remain) / quota) * 100) : 0.1;

        if (progress >= 0) {
          circularProgress.current?.reAnimate(0, progress, 3000, null);
        }
      }
    }
    if (esimApp && !dataStatusCd) {
      console.log('@@ show snackbar');
      showSnackbar();
    }
  }, [dataStatusCd, quota, remain, showSnackbar, showUsage, usage, used]);

  const getResetTime = useCallback(
    (tz: string) => {
      if (dataUsageOption?.ret) return dataUsageOption?.ret;
      if (endTime) return moment(endTime).tz(tz).format('HH:mm:ss');
      return i18n.t('contact:q');
    },
    [dataUsageOption?.ret, endTime],
  );

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
            {getResetTime(tz)}
          </AppText>
        </View>
      );
    },
    [getResetTime],
  );

  const renderCaution = useCallback(() => {
    let key = '';

    if (!showUsage) {
      key = 'notShow';
    } else if (isExhausted) {
      key = `${item.daily}:exhausted`;
    } else if (isLowRemain) {
      key = `${item.daily}:reqCharge`;
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
  }, [isExhausted, isLowRemain, item.daily, showUsage]);

  const renderDailyUsage = useCallback(
    () => (
      <View style={{flexDirection: 'row', marginTop: 8}}>
        <AppText style={{...appStyles.bold14Text, textAlign: 'center'}}>
          {i18n.t('esim:dailyUsageAmount')}
        </AppText>
        <AppText
          style={{
            ...appStyles.bold14Text,
            textAlign: 'center',
            color: colors.redError,
          }}>
          {utils.toDataVolumeString(totalUsed < quota ? quota : totalUsed)}
        </AppText>
      </View>
    ),
    [quota, totalUsed],
  );

  const renderTime = useCallback(() => {
    const localTz = RNLocalize.getTimeZone();
    const isTzDiff = localTz !== 'Asia/Seoul';
    // const nowKr = moment().tz('America/New_York');

    return (
      <View style={styles.timeContainer}>
        {showEndTime && endTime && (
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
        )}

        {item.daily === 'daily' && showUsage && (
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
  }, [endTime, item.daily, renderResetTimeRow, showEndTime, showUsage]);

  const renderAnimatedCircularProgress = useCallback(() => {
    return (
      <AnimatedCircularProgress
        ref={circularProgress}
        size={160}
        width={6}
        fill={0}
        rotation={0}
        backgroundWidth={6}
        tintColor={colors.gray3}
        backgroundColor={colors.clearBlue}>
        {(fill) => {
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
                {utils.toDataVolumeString(remain || 0)}
              </AppText>
            </View>
          );
        }}
      </AnimatedCircularProgress>
    );
  }, [isExhausted, remain]);

  const warningDotTxt = useCallback(() => {
    switch (item?.partner) {
      case 'ht':
        return (
          <View style={{width: '100%'}}>
            <View style={{flexDirection: 'row'}}>
              <AppText style={styles.warningDot}>{i18n.t('centerDot')}</AppText>
              <AppText style={styles.warning}>
                {i18n.t('esim:caution:ht:time1')}
              </AppText>
            </View>
            <View style={{flexDirection: 'row'}}>
              <AppText style={styles.warningDot}>{i18n.t('centerDot')}</AppText>
              <AppText style={styles.warning}>
                {i18n.t('esim:caution:ht:time2')}
              </AppText>
            </View>
          </View>
        );
      default:
        return (
          <View style={{width: '100%'}}>
            <View style={{flexDirection: 'row'}}>
              <AppText style={styles.warningDot}>{i18n.t('centerDot')}</AppText>
              <AppText style={styles.warning}>
                {i18n.t('esim:caution:time')}
              </AppText>
            </View>
          </View>
        );
    }
  }, [item?.partner]);

  const clMtdTxt = useCallback(() => {
    return ['ais', 'dtac', 'mvtotal'].includes(item?.clMtd || '') ? (
      <View style={{width: '100%'}}>
        <View style={{flexDirection: 'row'}}>
          <AppText style={styles.warningDot}>{i18n.t('centerDot')}</AppText>
          <AppText style={styles.warning}>
            {i18n.t(`esim:caution:clMtd:${item.clMtd}`)}
          </AppText>
        </View>
      </View>
    ) : null;
  }, [item?.clMtd]);

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
        {warningDotTxt()}
        {clMtdTxt()}
      </View>
    );
  }, [clMtdTxt, showUsage, warningDotTxt]);

  const usageRender = useCallback(() => {
    return (
      <View style={styles.activeContainer}>
        {showUsage ? (
          renderAnimatedCircularProgress()
        ) : (
          <AppSvgIcon style={{marginBottom: 20}} name="notShowEsimUsage" />
        )}

        {/* {showUsage &&
          isExhausted &&
          item.daily === 'daily' &&
          renderDailyUsage()} */}

        {renderCaution()}

        {renderTime()}

        {renderWarning()}
      </View>
    );
  }, [
    renderAnimatedCircularProgress,
    renderCaution,
    renderTime,
    renderWarning,
    showUsage,
  ]);

  const statusBox = useCallback(
    (statusCd: string) => {
      if (statusCd === 'A')
        return (
          <View>
            <View>
              <AppText key={item.key} style={styles.usageTitleBold}>
                {item.prodName}
              </AppText>
              {item.partner !== 'ht' && (
                <AppText key={item.prodName} style={styles.bold14WarmGrey}>
                  {i18n.t('esim:quota', {
                    quota: utils.toDataVolumeString(quota || 0),
                  })}
                </AppText>
              )}
            </View>
            {usageRender()}
          </View>
        );

      if (isError)
        return (
          <View style={{justifyContent: 'center'}}>
            <AppText key={item.key} style={styles.usageTitleBold}>
              {item.prodName}
            </AppText>
            <AppIcon
              style={{alignItems: 'center', marginBottom: 16}}
              name="usageE"
            />
            <AppText
              key={item.key}
              style={[
                appStyles.bold16Text,
                {color: colors.redError, alignSelf: 'center'},
              ]}>
              {i18n.t('esim:ErrorShowUsage1')}
            </AppText>
            <AppText
              key={item.key}
              style={[
                appStyles.medium16,
                {color: colors.black, alignSelf: 'center'},
              ]}>
              {i18n.t('esim:ErrorShowUsage2')}
            </AppText>
            <AppText
              key={item.key}
              style={[
                appStyles.medium14,
                {
                  color: colors.warmGrey,
                  alignSelf: 'center',
                  marginTop: 12,
                },
              ]}>
              {i18n.t('esim:ErrorShowUsage3')}
            </AppText>
          </View>
        );

      if (['R', 'U'].includes(statusCd))
        return (
          <View>
            <AppIcon style={{alignItems: 'center'}} name={`usage${statusCd}`} />
            <View style={{marginTop: 15, marginBottom: 25}}>
              <AppStyledText
                text={i18n.t(`esim:${code[statusCd]}Info`)}
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
        );

      return null;
    },
    [isError, item.key, item.partner, item.prodName, quota, usageRender],
  );

  const [status, statusCd] = esimApp
    ? [i18n.t(`esim:${dataStatusCd || 'R'}`), dataStatusCd || 'R']
    : [item.status, item.statusCd];

  const {statusColor = colors.warmGrey, statusBackgroundColor} =
    getStatusColor(statusCd);

  return (
    <View>
      <View style={styles.usageListContainer}>
        <View style={styles.titleLine}>
          <AppText key={i18n.t('esim:checkUsage')} style={appStyles.bold18Text}>
            {i18n.t('esim:checkUsage')}
          </AppText>
          {showStatus &&
            !usageLoading &&
            !isError &&
            item?.partner !== 'ht' && (
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
        {usageLoading ? (
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
    </View>
  );
};

export default memo(UsageItem);
