import Analytics from 'appcenter-analytics';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  Fragment,
} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {connect} from 'react-redux';
import Video from 'react-native-video';
import _ from 'underscore';
import moment from 'moment-timezone';
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
  titleAndStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeContainer: {
    flexDirection: 'row',
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
    ...appStyles.bold16Text,
    fontSize: isDeviceSize('small') ? 14 : 16,
    maxWidth: '70%',
  },
  usageStatus: {
    ...appStyles.bold14Text,
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
  bold16WarmGrey: {
    ...appStyles.bold16Text,
    color: colors.warmGrey,
  },
  bold18ClearBlue: {
    ...appStyles.bold18Text,
    color: colors.clearBlue,
  },
  warning: {
    ...appStyles.normal14Text,
    textAlign: 'left',
    color: colors.warmGrey,
    marginBottom: 20,
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
});

const {esimApp} = Env.get();
const loadingImg = require('../../../assets/images/loading_1.mp4');

function getStatusColor(statusCd) {
  let statusColor = colors.warmGrey;
  let isActive = false;

  if (statusCd === API.Subscription.STATUS_ACTIVE) {
    statusColor = colors.tomato;
    isActive = true;
  } else if (statusCd === API.Subscription.STATUS_RESERVED) {
    statusColor = colors.clearBlue;
  } else if (statusCd === API.Subscription.STATUS_INACTIVE) {
    statusColor = colors.black;
  } else {
    statusColor = colors.warmGrey;
  }
  return {statusColor, isActive};
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
  const [isShowUsage, setIsShowUsage] = useState(!!usage);
  const [disableBtn, setDisableBtn] = useState(false);
  const [quota, setQuota] = useState<number | undefined>(usage?.quota);
  const [used, setUsed] = useState<number | undefined>(usage?.used);
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
        circularProgress.current?.animate(progress, 3000, null);
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
          setIsShowUsage(true);

          circularProgress.current?.animate(progress, 3000, null);

          Analytics.trackEvent('Page_View_Count', {page: 'Get Detail Data'});
        } else {
          showSnackbar();
        }
      });
    }
  }, [item.nid, item.statusCd, showSnackbar, token]);

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

  const checkUsageButton = useCallback(() => {
    return (
      <View style={styles.checkUsageBtnContainer}>
        <AppButton
          style={styles.checkUsageBtn}
          disabled={disableBtn}
          onPress={() => getUsage()}
          title={i18n.t('esim:checkUsage')}
          titleStyle={styles.checkUsageBtnTitle}
        />
      </View>
    );
  }, [disableBtn, getUsage]);

  const usageRender = useCallback(() => {
    return (
      <View style={styles.activeContainer}>
        <AnimatedCircularProgress
          ref={circularProgress}
          style={styles.circular}
          size={130}
          width={25}
          fill={0}
          rotation={0}
          backgroundWidth={25}
          tintColor={colors.clearBlue}
          // onAnimationComplete={() => console.log('onAnimationComplete')}
          backgroundColor={colors.whiteTwo}>
          {(fill) => (
            <View style={{alignItems: 'center'}}>
              <AppText style={[styles.normal12WarmGrey, {textAlign: 'center'}]}>
                {i18n.t('usim:remainAmount')}
              </AppText>
              <AppText style={styles.bold18ClearBlue}>
                {' '}
                {`${Math.floor(fill)}%`}{' '}
              </AppText>
            </View>
          )}
        </AnimatedCircularProgress>
        <View style={{flex: 1}}>
          <AppText style={styles.normal14WarmGrey}>
            {i18n.t('usim:remainData')}
          </AppText>
          <AppText style={appStyles.bold18Text}>
            {!_.isUndefined(quota) && !_.isUndefined(used)
              ? `${toGb(quota - used)}GB ${i18n.t('usim:remain')}`
              : i18n.t('usim:usageErrorInfo1')}
          </AppText>
          <AppText style={styles.normal14WarmGrey}>
            {!_.isUndefined(quota) && !_.isUndefined(used)
              ? `(${toMb(quota - used)}MB)`
              : i18n.t('usim:usageErrorInfo2')}
          </AppText>
          <AppText style={[styles.normal14WarmGrey, {marginTop: 15}]}>
            {i18n.t('usim:usageAmount')}
          </AppText>
          <AppText style={styles.bold16WarmGrey}>
            {!_.isUndefined(used)
              ? `${toGb(used)}GB ${i18n.t('usim:used')}`
              : i18n.t('usim:usageErrorInfo1')}
          </AppText>
          <AppText style={styles.normal14WarmGrey}>
            {!_.isUndefined(used)
              ? `(${esimApp ? used?.toFixed(2) : toMb(used)}MB)`
              : i18n.t('usim:usageErrorInfo2')}
          </AppText>
        </View>
      </View>
    );
  }, [quota, toGb, toMb, used]);

  const statusBox = useCallback(
    (statusCd: string) => {
      const isCallProduct = item.type === API.Subscription.CALL_PRODUCT;
      return (
        <View>
          {statusCd === 'A' && (
            <View>
              <View style={styles.titleAndStatus}>
                <AppText key={item.key} style={styles.usageTitleBold}>
                  {item.prodName}
                </AppText>
              </View>
              {!isCallProduct && showUsage ? (
                <View style={styles.topOfActiveContainer}>
                  {isShowUsage ? usageRender() : checkUsageButton()}
                  <AppText style={styles.warning}>
                    {i18n.t('usim:warning')}
                  </AppText>
                  <View style={styles.divider} />
                </View>
              ) : (
                <Fragment>
                  <View style={styles.notShowUsage}>
                    <AppText
                      style={{...appStyles.medium16, color: colors.warmGrey}}>
                      {i18n.t('esim:notShowUsage')}
                    </AppText>
                  </View>
                  <View style={styles.divider} />
                </Fragment>
              )}
              {showExpire ? (
                <View style={styles.bottomOfActiveContainer}>{expire()}</View>
              ) : (
                <View>
                  <AppText
                    style={{
                      ...appStyles.medium14,
                      color: colors.clearBlue,
                      marginTop: 15,
                    }}>
                    <AppText style={appStyles.medium14}>
                      {i18n.t(`centerDot`)}
                    </AppText>
                    {i18n.t(`quadcell:usageInfo2`)}
                  </AppText>
                </View>
              )}
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
    [
      checkUsageButton,
      expire,
      isShowUsage,
      item.key,
      item.partner,
      item.prodName,
      item.type,
      showExpire,
      showUsage,
      usageRender,
    ],
  );

  const [status, statusCd] = esimApp
    ? [i18n.t(`esim:${cmiStatusCd || 'R'}`), cmiStatusCd || 'R']
    : [item.status, item.statusCd];

  const {statusColor = colors.warmGrey} = getStatusColor(statusCd);

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
              style={[styles.usageStatus, {color: statusColor}]}>
              • {status}
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
