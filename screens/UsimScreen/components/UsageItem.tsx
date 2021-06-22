import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import {AnimatedCircularProgress} from 'react-native-circular-progress';
import _ from 'underscore';
import Analytics from 'appcenter-analytics';
import Svg, {Line} from 'react-native-svg';
import {API} from 'RokebiESIM/submodules/rokebi-utils';
import subsApi from 'RokebiESIM/submodules/rokebi-utils/api/subscriptionApi';
import i18n from '../../../utils/i18n';
import {utils} from '../../../utils/utils';
import {appStyles} from '../../../constants/Styles';
import {colors} from '../../../constants/Colors';
import AppButton from '../../../components/AppButton';
import {isDeviceSize} from '../../../constants/SliderEntry.style';

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

  if (statusCd === subsApi.STATUS_ACTIVE) {
    statusColor = colors.tomato;
    isActive = true;
  } else if (statusCd === subsApi.STATUS_RESERVED) {
    statusColor = colors.clearBlue;
  } else if (statusCd === subsApi.STATUS_INACTIVE) {
    statusColor = colors.black;
  } else {
    statusColor = colors.warmGrey;
  }
  return {statusColor, isActive};
}

class UsageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowUsage: false,
      disableBtn: false,
    };
    this.usageRender = this.usageRender.bind(this);
    this.getUsage = this.getUsage.bind(this);
    this.expire = this.expire.bind(this);
    this.expireBeforeUse = this.expireBeforeUse.bind(this);

    this.circularProgress = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(nextProps.item, this.props.item) ||
      this.state.disableBtn !== nextState.disableBtn
    );
  }

  componentDidUpdate() {
    if (this.state.disableBtn) {
      setTimeout(() => {
        this.setState({
          disableBtn: false,
        });
      }, 5000);
    }
  }

  getUsage() {
    const {item, auth, showSnackBar} = this.props;

    //그래프 테스트 nid = 1616
    if (item.statusCd === 'A') {
      API.Subscription.getSubsUsage(item.nid, auth).then((resp) => {
        this.setState({disableBtn: true});
        if (resp.result === 0) {
          console.log('getSubsUsage progress', resp.objects, item.nid);
          const {quota, used} = resp.objects;
          const progress =
            used > 0 ? 100 - Math.floor((used / quota) * 100) : 0;

          this.setState({quota, used, isShowUsage: true});

          if (this.circularProgress.current)
            this.circularProgress.current.animate(progress, 3000, null);

          Analytics.trackEvent('Page_View_Count', {page: 'Get Detail Data'});
        } else {
          showSnackBar();
          console.log('Get Usage failed', resp);
        }
      });
    }
  }

  expire = (item) => {
    return (
      <View style={styles.endDateContainer}>
        <Text style={appStyles.normal12Text}>{i18n.t('usim:usingTime')}</Text>
        <Text style={styles.usageUntil}>{`${utils.toDateString(
          item.endDate,
        )} ${i18n.t('usim:until')}`}</Text>
      </View>
    );
  };

  expireBeforeUse = (item) => {
    return (
      <View style={styles.inactiveContainer}>
        <Text style={appStyles.normal12Text}>
          {i18n.t('usim:usablePeriod')}
        </Text>
        <Text style={styles.usagePeriod}>{`${utils.toDateString(
          item.purchaseDate,
          'YYYY-MM-DD',
        )} ~ ${item.expireDate}`}</Text>
      </View>
    );
  };

  toMb = (kb) => {
    if (kb === 0) return 0;
    return utils.numberToCommaString(kb / 1024);
  };

  toGb = (kb) => {
    if (kb === 0) return 0;
    return (kb / 1024 / 1024).toFixed(2);
  };

  checkUsageButton() {
    return (
      <View style={styles.checkUsageBtnContainer}>
        <AppButton
          style={styles.checkUsageBtn}
          disabled={this.state.disableBtn}
          onPress={() => this.getUsage()}
          title={i18n.t('usim:checkUsage')}
          titleStyle={styles.checkUsageBtnTitle}
        />
      </View>
    );
  }

  usageRender() {
    const {quota = 0, used = 0} = this.state;

    return (
      <View style={styles.activeContainer}>
        <AnimatedCircularProgress
          ref={this.circularProgress}
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
              <Text style={styles.normal12WarmGrey}>
                {i18n.t('usim:remainAmount')}
              </Text>
              <Text style={styles.bold18ClearBlue}>
                {' '}
                {`${Math.floor(fill)}%`}{' '}
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>
        <View style={{marginLeft: 20, flex: 1}}>
          <Text style={styles.normal14WarmGrey}>
            {i18n.t('usim:remainData')}
          </Text>
          <Text style={appStyles.bold18Text}>
            {`${this.toGb(quota - used)}GB ${i18n.t('usim:remain')}`}
          </Text>
          <Text style={styles.normal12WarmGrey}>{`(${this.toMb(
            quota - used,
          )}MB)`}</Text>
          <Text style={[styles.normal14WarmGrey, {marginTop: 10}]}>
            {i18n.t('usim:usageAmount')}
          </Text>
          <Text style={styles.bold16WarmGrey}>
            {`${this.toGb(used)}GB ${i18n.t('usim:used')}`}
          </Text>
          <Text style={styles.normal12WarmGrey}>{`(${this.toMb(
            used,
          )}MB)`}</Text>
        </View>
      </View>
    );
  }

  render() {
    const {item, onPress} = this.props;
    const {isShowUsage = false} = this.state;
    const {statusColor = colors.warmGrey, isActive = false} = getStatusColor(
      item.statusCd,
    );
    const isCallProduct = item.type === subsApi.CALL_PRODUCT;

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.usageListContainer}>
          <View style={{backgroundColor: colors.white}}>
            <View style={styles.titleAndStatus}>
              <Text
                key={item.key}
                style={[
                  styles.usageTitleNormal,
                  {fontWeight: isActive ? 'bold' : 'normal'},
                ]}>
                {item.prodName}
              </Text>
              <Text
                key={item.nid}
                style={[styles.usageStatus, {color: statusColor}]}>
                {' '}
                • {item.status}
              </Text>
            </View>
          </View>
          {item.statusCd === 'A' ? (
            <View>
              {!isCallProduct && (
                <View style={styles.topOfActiveContainer}>
                  {isShowUsage ? this.usageRender() : this.checkUsageButton()}
                  <Text style={styles.warning}>{i18n.t('usim:warning')}</Text>
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
              <View style={styles.bottomOfActiveContainer}>
                {this.expire(item)}
              </View>
            </View>
          ) : (
            this.expireBeforeUse(item)
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

export default UsageItem;
