/* eslint-disable no-nested-ternary */
import React, {MutableRefObject, useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, View, FlatList} from 'react-native';
import {connect} from 'react-redux';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import {RootState} from '@/redux';
import {ProductModelState} from '../../../redux/modules/product';
import {RkbOrder} from '@/redux/api/orderApi';
import moment from 'moment';

const styles = StyleSheet.create({
  draftButtonFrame: {
    marginHorizontal: 20,
  },
  usageListContainer: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: colors.gray3,
  },
  infoRadiusBorder: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  draftButton: {
    flex: 1,
    flexDirection: 'row',
    height: 52,
    backgroundColor: '#4d377b',
    borderColor: colors.whiteThree,
    borderRadius: 12,
  },
  prodTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  inactiveContainer: {
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  normal14Gray: {
    ...appStyles.normal14Text,
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
  },
  moreInfoContentDraft: {
    backgroundColor: colors.gray03,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopColor: '#eeeeee',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  topInfo: {
    marginTop: 24,
  },
  draftDateText: {
    marginBottom: 6,
    ...appStyles.normal14Text,
    alignSelf: 'flex-start',
    color: colors.warmGrey,
  },
  draftTitleMainText: {
    ...appStyles.bold16Text,
  },
  draftTitleSubText: {
    ...appStyles.normal16Text,
  },
});

const EsimSubs = ({
  mainSubs,
  chargedSubs,
  onClick,
}: {
  mainSubs: RkbOrder;
  expired: boolean;
  onClick: (subs: RkbOrder) => void;

  product: ProductModelState;
}) => {
  // 발권 생성 7일 지난게 오늘보다 전이라면? 발권기한이 지났다.
  const expiredDate = moment(mainSubs.orderDate).add(7, 'day');

  const titleDraft = useCallback(() => {
    // ko 파일로 빼기
    const time = `${utils.toDateString(mainSubs.orderDate, 'YYYY-MM-DD')} 구매`;

    return (
      <Pressable style={styles.prodTitle} onPress={() => {}}>
        <View>
          <AppText style={styles.draftDateText}>{time}</AppText>
          <View style={{flexDirection: 'row'}}>
            <AppText style={styles.draftTitleMainText}>
              {`${mainSubs.orderItems[0].title} `}
            </AppText>
            {mainSubs.orderItems?.length > 1 && (
              <AppText style={styles.draftTitleSubText}>
                {i18n
                  .t('esim:etcCnt')
                  .replace('%%', mainSubs?.orderItems?.length)}
              </AppText>
            )}
          </View>
        </View>
      </Pressable>
    );
  }, [mainSubs]);

  const topInfoDraft = useCallback(() => {
    return (
      <View style={[styles.topInfo, {marginTop: 28}]}>
        {mainSubs.type !== API.Subscription.CALL_PRODUCT && (
          <View style={styles.inactiveContainer}>
            <AppText style={styles.normal14Gray}>
              {i18n.t('esim:orderNo')}
            </AppText>
            <AppText style={styles.normal14Gray}>{mainSubs.orderNo}</AppText>
          </View>
        )}
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14Gray}>
            {i18n.t('esim:draftExpire')}
          </AppText>
          <AppText style={styles.normal14Gray}>{`${utils.toDateString(
            expiredDate,
            'YYYY.MM.DD HH:MM:SS',
          )}`}</AppText>
        </View>

        <View
          style={{
            backgroundColor: colors.black,
            height: 28,
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <AppText style={{alignSelf: 'center', color: colors.white}}>
            {i18n.t('esim:draftNotice')}
          </AppText>
        </View>
      </View>
    );
  }, [expiredDate, mainSubs.orderNo, mainSubs.type]);

  const renderDraftBtn = useCallback(() => {
    return (
      <View key={utils.generateKey(0)} style={styles.btnFrame}>
        <View
          key={utils.generateKey(1)}
          style={[styles.btnMove, {marginRight: 0}, {position: 'relative'}]}>
          <AppButton
            title={i18n.t('esim:draft')}
            titleStyle={styles.colorWhite}
            style={styles.draftButton}
            onPress={() => onClick(mainSubs)}
          />
        </View>
      </View>
    );
  }, [mainSubs, onClick]);

  const renderDraft = useCallback(() => {
    return (
      <View style={styles.usageListContainer}>
        <View style={styles.infoRadiusBorder}>{titleDraft()}</View>
        <View style={styles.moreInfoContentDraft}>{topInfoDraft()}</View>
      </View>
    );
  }, [titleDraft, topInfoDraft]);

  return (
    <View>
      {renderDraft()}
      <View style={styles.draftButtonFrame}>{renderDraftBtn()}</View>
    </View>
  );
};

// export default memo(EsimSubs);

export default connect(({product}: RootState) => ({
  product,
}))(EsimSubs);
