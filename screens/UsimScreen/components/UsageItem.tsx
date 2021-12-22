import Analytics from 'appcenter-analytics';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Svg, {Line} from 'react-native-svg';
import {connect} from 'react-redux';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {RkbSubscription, RkbSubsUsage} from '@/redux/api/subscriptionApi';
import {AccountModelState} from '@/redux/modules/account';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';

const styles = StyleSheet.create({
  usageListContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  titleAndStatus: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  activeContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
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
  endDateContainer: {
    paddingHorizontal: 20,
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
    backgroundColor: colors.white,
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
  },
  usageTitleNormal: {
    ...appStyles.normal16Text,
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
    ...appStyles.normal12Text,
    textAlign: 'left',
    color: colors.warmGrey,
    marginHorizontal: 20,
    marginBottom: 20,
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

  account: AccountModelState;
};

const UsageItem: React.FC<UsageItemProps> = ({
  item,
  showSnackbar,
  onPress,
  usage,
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

  const getUsage = useCallback(() => {
    //그래프 테스트 nid = 1616
    if (item.statusCd === 'A') {
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

  const expire = useCallback((item: RkbSubscription) => {
    return (
      <View style={styles.endDateContainer}>
        <AppText style={appStyles.normal12Text}>
          {i18n.t('usim:usingTime')}
        </AppText>
        <AppText style={styles.usagePeriod}>{`${utils.toDateString(
          item.endDate,
        )} ${i18n.t('usim:until')}`}</AppText>
      </View>
    );
  }, []);

  const expireBeforeUse = useCallback((item: RkbSubscription) => {
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
  }, []);

  const toMb = useCallback((kb: number) => {
    if (kb === 0) return 0;
    return utils.numberToCommaString(kb / 1024);
  }, []);

  const toGb = useCallback((kb: number) => {
    if (kb === 0) return 0;
    return (kb / 1024 / 1024).toFixed(2);
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
        <View style={{marginLeft: 20, flex: 1}}>
          <AppText style={styles.normal14WarmGrey}>
            {i18n.t('usim:remainData')}
          </AppText>
          <AppText style={appStyles.bold18Text}>
            {`${toGb(quota - used)}GB ${i18n.t('usim:remain')}`}
          </AppText>
          <AppText style={styles.normal12WarmGrey}>{`(${toMb(
            quota - used,
          )}MB)`}</AppText>
          <AppText style={[styles.normal14WarmGrey, {marginTop: 10}]}>
            {i18n.t('usim:usageAmount')}
          </AppText>
          <AppText style={styles.bold16WarmGrey}>
            {`${toGb(used)}GB ${i18n.t('usim:used')}`}
          </AppText>
          <AppText style={styles.normal12WarmGrey}>{`(${toMb(
            used,
          )}MB)`}</AppText>
        </View>
      </View>
    );
  }, [quota, toGb, toMb, used]);

  const {statusColor = colors.warmGrey, isActive = false} = getStatusColor(
    item.statusCd,
  );
  const isCallProduct = item.type === API.Subscription.CALL_PRODUCT;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.usageListContainer}>
        <View style={{backgroundColor: colors.white}}>
          <View style={styles.titleAndStatus}>
            <AppText
              key={item.key}
              style={[
                styles.usageTitleNormal,
                {fontWeight: isActive ? 'bold' : 'normal'},
              ]}>
              {item.prodName}
            </AppText>
            <AppText
              key={item.nid}
              style={[styles.usageStatus, {color: statusColor}]}>
              {' '}
              • {item.status}
            </AppText>
          </View>
        </View>
        {item.statusCd === 'A' || usage ? (
          <View>
            {!isCallProduct && (
              <View style={styles.topOfActiveContainer}>
                {isShowUsage ? usageRender() : checkUsageButton()}
                <AppText style={styles.warning}>
                  {i18n.t('usim:warning')}
                </AppText>
                <Svg height={2} width="100%">
                  <Line
                    style={{marginLeft: 2}}
                    stroke={colors.warmGrey}
                    strokeWidth="2"
                    strokeDasharray="5, 5"
                    x1="2%"
                    y1="0"
                    x2="98%"
                    y2="0"
                  />
                </Svg>
              </View>
            )}
            <View style={styles.bottomOfActiveContainer}>{expire(item)}</View>
          </View>
        ) : (
          expireBeforeUse(item)
        )}
      </View>
    </TouchableOpacity>
  );
};

export default connect(({account}: RootState) => ({account}))(UsageItem);
