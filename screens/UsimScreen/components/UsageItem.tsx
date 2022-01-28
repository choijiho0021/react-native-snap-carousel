import Analytics from 'appcenter-analytics';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {connect} from 'react-redux';
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
  endDateContainer: {
    paddingVertical: 20,
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
});

const {esimApp} = Env.get();

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
  usage?: RkbSubsUsage;
  cmiStatusCd?: string;
  endTime?: string;

  account: AccountModelState;
};

const UsageItem: React.FC<UsageItemProps> = ({
  item,
  showSnackbar,
  onPress,
  usage,

  cmiStatusCd,
  endTime,
  account: {token},
}) => {
  const [isShowUsage, setIsShowUsage] = useState(!!usage);
  const [disableBtn, setDisableBtn] = useState(false);
  const [quota, setQuota] = useState<number>(usage?.quota || 0);
  const [used, setUsed] = useState<number>(usage?.used || 0);
  const circularProgress = useRef();

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

        const progress = used > 0 ? 100 - Math.floor((used / quota) * 100) : 0;
        circularProgress.current?.animate(progress, 3000, null);
      }
    }
    if (esimApp && !cmiStatusCd) {
      console.log('@@ show snackbar');
      showSnackbar();
    }
  }, [cmiStatusCd, quota, showSnackbar, usage, used]);

  const getUsage = useCallback(() => {
    // 그래프 테스트 nid = 1616
    if (!esimApp && item.statusCd === 'A') {
      API.Subscription.getSubsUsage({id: item.nid, token}).then((resp) => {
        setDisableBtn(true);
        if (resp.result === 0) {
          console.log('getSubsUsage progress', resp.objects, item.nid);
          const {quota, used} = resp.objects[0];
          const progress =
            used > 0 ? 100 - Math.floor((used / quota) * 100) : 0;

          setQuota(quota);
          setUsed(used);
          setIsShowUsage(true);

          circularProgress.current?.animate(progress, 3000, null);

          Analytics.trackEvent('Page_View_Count', {page: 'Get Detail Data'});
        } else {
          showSnackbar();
          console.log('Get Usage failed', resp);
        }
      });
    }
  }, [item.nid, item.statusCd, showSnackbar, token]);

  const expire = useCallback(() => {
    return (
      <View style={styles.endDateContainer}>
        <AppText style={styles.normal14WarmGrey}>
          {i18n.t('usim:usingTime')}
        </AppText>
        <AppText style={appStyles.normal14Text}>{`${
          esimApp
            ? endTime?.replace(/-/gi, '.')
            : utils.toDateString(item.endDate)
        } ${i18n.t(`sim:${'until'}`)}`}</AppText>
      </View>
    );
  }, [endTime, item.endDate]);

  const expireBeforeUse = useCallback(() => {
    return (
      <View style={styles.inactiveContainer}>
        <AppText style={appStyles.normal12Text}>
          {i18n.t('usim:usablePeriod')}
        </AppText>
        <AppText style={styles.usagePeriod}>{`${utils.toDateString(
          item.purchaseDate,
          'YYYY-MM-DD',
        )} ~ ${item.expireDate}`}</AppText>
      </View>
    );
  }, [item.expireDate, item.purchaseDate]);

  const toMb = useCallback((kb: number) => {
    if (kb === 0) return 0;
    return utils.numberToCommaString(kb / 1024);
  }, []);

  const toGb = useCallback((kb: number) => {
    if (kb === 0) return 0;
    return (kb / 1024 / 1024).toFixed(2);
  }, []);

  const fromMbToGb = useCallback((mb: number) => {
    if (mb === 0) return 0;
    return (mb / 1024).toFixed(2);
  }, []);

  const checkUsageButton = useCallback(() => {
    return (
      <View style={styles.checkUsageBtnContainer}>
        <AppButton
          style={styles.checkUsageBtn}
          disabled={disableBtn}
          onPress={() => getUsage()}
          title={i18n.t('usim:checkUsage')}
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
              <AppText style={styles.normal12WarmGrey}>
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
            {`${
              esimApp ? fromMbToGb(quota - used) : toGb(quota - used)
            }GB ${i18n.t('usim:remain')}`}
          </AppText>
          <AppText style={styles.normal14WarmGrey}>{`(${
            esimApp ? (quota - used).toFixed(2) : toMb(quota - used)
          }MB)`}</AppText>
          <AppText style={[styles.normal14WarmGrey, {marginTop: 15}]}>
            {i18n.t('usim:usageAmount')}
          </AppText>
          <AppText style={styles.bold16WarmGrey}>
            {`${esimApp ? fromMbToGb(used) : toGb(used)}GB ${i18n.t(
              'usim:used',
            )}`}
          </AppText>
          <AppText style={styles.normal14WarmGrey}>{`(${
            esimApp ? used.toFixed(2) : toMb(used)
          }MB)`}</AppText>
        </View>
      </View>
    );
  }, [fromMbToGb, quota, toGb, toMb, used]);

  const [status, statusCd] = esimApp
    ? [i18n.t(`esim:${cmiStatusCd || 'R'}`), cmiStatusCd]
    : [item.status, item.statusCd];

  const {statusColor = colors.warmGrey, isActive = false} =
    getStatusColor(statusCd);
  const isCallProduct = item.type === API.Subscription.CALL_PRODUCT;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.usageListContainer}>
        <View style={styles.titleLine}>
          <AppText key={i18n.t('usim:checkUsage')} style={appStyles.bold18Text}>
            {i18n.t('usim:checkUsage')}
          </AppText>
          <AppText
            key={item.nid}
            style={[styles.usageStatus, {color: statusColor}]}>
            {' '}
            • {status}
          </AppText>
        </View>

        {
          statusCd === 'A' && (
            // || usage
            <View>
              <View style={styles.titleAndStatus}>
                <AppText
                  key={item.key}
                  style={[
                    styles.usageTitleBold,
                    // {fontWeight: isActive ? 'bold' : 'normal'},
                  ]}>
                  {item.prodName}
                </AppText>
              </View>
              {!isCallProduct && (
                <View style={styles.topOfActiveContainer}>
                  {isShowUsage ? usageRender() : checkUsageButton()}
                  <AppText style={styles.warning}>
                    {i18n.t('usim:warning')}
                  </AppText>
                  <View style={styles.divider} />
                </View>
              )}
              <View style={styles.bottomOfActiveContainer}>{expire()}</View>
            </View>
          )
          // : (
          //   expireBeforeUse()
          // )
        }
        {['R', 'U'].map((v) => {
          return (
            statusCd === v && (
              <View key={v}>
                <AppIcon name={`usage${v}`} />
                <AppText style={styles.inactiveIcon}>
                  {i18n.t(`esim:${code[v]}Info`)}
                </AppText>
              </View>
            )
          );
        })}
      </View>
    </TouchableOpacity>
  );
};

export default connect(({account}: RootState) => ({account}))(UsageItem);
