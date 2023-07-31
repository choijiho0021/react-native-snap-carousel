/* eslint-disable no-nested-ternary */
import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import {RootState} from '@/redux';
import {RkbOrder} from '@/redux/api/orderApi';
import AppSvgIcon from '@/components/AppSvgIcon';

const styles = StyleSheet.create({
  draftButtonFrame: {},
  usageListContainer: {
    marginHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: colors.white,
    borderColor: colors.whiteFive,
  },

  draftExpireText: {
    ...appStyles.bold14Text,
    color: colors.clearBlue,
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  draftButton: {
    flex: 1,
    flexDirection: 'row',
    height: 52,
    backgroundColor: 'transparent',
    borderColor: colors.whiteThree,
    borderRadius: 12,
  },
  prodTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expiredDateFrame: {
    marginBottom: 12,
  },
  inactiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  inactiveDetailContainer: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'space-between',
  },
  inactiveDetailTextView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  normal14Gray: {
    ...appStyles.normal14Text,
    color: '#777777',
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  roboto14Gray: {
    ...appStyles.roboto14Text,
    color: '#777777',
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  colorWhite: {
    ...appStyles.bold16Text,
    color: colors.white,
  },
  btnMove: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFrame: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 16,
  },
  topGradient: {
    width: '100%',
    height: 40,
    borderRadius: 3,
  },
  ticket: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  topInfo: {
    marginTop: 16,
  },
  draftTitleMainText: {
    ...appStyles.bold16Text,
  },
  draftTitleSubText: {
    ...appStyles.normal16Text,
  },
  arrow: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const EsimDraftSubs = ({
  mainSubs,
  onClick,
  showDetail,
}: {
  mainSubs: RkbOrder;
  expired: boolean;
  onClick: (subs: RkbOrder) => void;
  showDetail: boolean;
}) => {
  const [showMoreInfo, setShowMoreInfo] = useState(showDetail);

  // 발권 생성 7일 지난게 오늘보다 전이라면? 발권기한이 지났다.
  const expiredDate = moment(mainSubs.orderDate).add(7, 'day');

  const titleDraft = useCallback(() => {
    return (
      <Pressable
        style={styles.prodTitle}
        onPress={() => {
          console.log('hellow');
          setShowMoreInfo((prev) => !prev);
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppSvgIcon name="ticket" style={styles.ticket} />
            <AppText
              style={styles.draftTitleMainText}
              numberOfLines={2}
              ellipsizeMode="tail">
              {`${mainSubs.orderItems[0].title} `}
            </AppText>
            {mainSubs.orderItems?.length > 1 && (
              <AppText style={styles.draftTitleSubText}>
                {i18n
                  .t('esim:etcCnt')
                  .replace('%%', mainSubs?.orderItems?.length - 1)}
              </AppText>
            )}
          </View>
        </View>
        <View style={styles.arrow}>
          <AppSvgIcon name={showMoreInfo ? 'topArrow' : 'bottomArrow'} />
        </View>
      </Pressable>
    );
  }, [mainSubs.orderItems, showMoreInfo]);

  const topInfoDraft = useCallback(() => {
    const time = `${utils.toDateString(mainSubs.orderDate, 'YYYY-MM-DD')} 구매`;

    return (
      <View style={[styles.topInfo]}>
        {mainSubs.type !== API.Subscription.CALL_PRODUCT && (
          <View style={styles.inactiveDetailContainer}>
            <View style={[styles.inactiveDetailTextView, {marginBottom: 6}]}>
              <AppText style={styles.normal14Gray}>
                {i18n.t('esim:orderNo')}
              </AppText>
              <AppText style={styles.roboto14Gray}>{mainSubs.orderNo}</AppText>
            </View>
            <View style={styles.inactiveDetailTextView}>
              <AppText style={styles.normal14Gray}>
                {i18n.t('esim:orderDate')}
              </AppText>
              <AppText style={styles.roboto14Gray}>{time}</AppText>
            </View>
          </View>
        )}
      </View>
    );
  }, [mainSubs.orderDate, mainSubs.orderNo, mainSubs.type]);

  const renderDraftBtn = useCallback(() => {
    return (
      <View key={utils.generateKey(0)} style={styles.btnFrame}>
        <View
          key={utils.generateKey(1)}
          style={[styles.btnMove, {marginRight: 0}, {position: 'relative'}]}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={[colors.clearBlue, colors.purplyBlue]}
            style={styles.topGradient}>
            <AppButton
              title={`${i18n
                .t('esim:draft')
                .replace('%', mainSubs?.orderItems?.length)}`}
              titleStyle={styles.colorWhite}
              style={styles.draftButton}
              onPress={() => onClick(mainSubs)}
            />
          </LinearGradient>
        </View>
      </View>
    );
  }, [mainSubs, onClick]);

  const renderExpiredDate = useCallback(() => {
    return (
      <View style={styles.expiredDateFrame}>
        <View style={styles.inactiveContainer}>
          <AppText style={styles.draftExpireText}>
            {`${i18n.t('esim:draftExpire')} | ${utils.toDateString(
              expiredDate,
              'YYYY.MM.DD HH:MM:SS',
            )}`}
          </AppText>
        </View>
      </View>
    );
  }, [expiredDate]);

  const renderDraft = useCallback(() => {
    return (
      <View style={[styles.usageListContainer, {borderBottomWidth: 1}]}>
        <View>{renderExpiredDate()}</View>
        <View>{titleDraft()}</View>
        {showMoreInfo && <View>{topInfoDraft()}</View>}
        <View style={styles.draftButtonFrame}>{renderDraftBtn()}</View>
      </View>
    );
  }, [
    renderDraftBtn,
    renderExpiredDate,
    showMoreInfo,
    titleDraft,
    topInfoDraft,
  ]);

  return <View>{renderDraft()}</View>;
};

export default EsimDraftSubs;
