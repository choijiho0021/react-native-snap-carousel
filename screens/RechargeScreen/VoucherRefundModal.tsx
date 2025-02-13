import React, {memo, useCallback, useEffect, useMemo} from 'react';
import {Image, StyleSheet, View} from 'react-native';

import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppBottomModal from '@/screens/DraftUsScreen/component/AppBottomModal';
import AppStyledText from '@/components/AppStyledText';
import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import RenderChargeAmount from './RenderChargeAmount';
import AppSvgIcon from '@/components/AppSvgIcon';
import {VoucherModalType} from './VoucherTab';
import {VoucherRefundInfo} from '@/redux/api/voucherApi';
import moment from 'moment';
import {utils} from '@/utils/utils';
import VoucherRefundInfoBox from './VoucherRefundInfoBox';

const styles = StyleSheet.create({
  confirm: {
    ...appStyles.confirm,
    bottom: 0,
    marginTop: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  topNotiView: {gap: 4, marginBottom: 24},
  topNotiTitleText: {...appStyles.bold16Text, lineHeight: 24},
  topNotiText: {...appStyles.medium16, lineHeight: 24},
  topNotiBoldText: {...appStyles.bold16Text, lineHeight: 24},

  titleContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  refundBoxTitleView: {marginBottom: 10},
  refundBoxTitleRow: {flexDirection: 'row', gap: 4},
  refundBoxTitleText: {...appStyles.bold18Text, lineHeight: 26},
  refundBoxInfoView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  swapIconView: {
    marginHorizontal: -15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  refundAvailableView: {
    borderTopWidth: 1,
    borderColor: colors.whiteFive,
    paddingTop: 20,
  },

  refundAvailableTitleView: {
    ...appStyles.medium16,
    lineHeight: 20,
  },

  refundAvailableAmountView: {flexDirection: 'row', alignItems: 'center'},
  refundAvailableAmountText: {
    ...appStyles.robotoBold22Text,
    color: colors.clearBlue,
    lineHeight: 24,
  },
  refundAvailableCurrenyText: {
    ...appStyles.bold22Text,
    color: colors.clearBlue,
    lineHeight: 24,
    paddingBottom: 2,
  },

  notiView: {marginTop: 20, flexDirection: 'row', gap: 10},
  notiAvailableBox: {
    ...appStyles.extraBold12,
    backgroundColor: colors.veryLightPink,
    paddingVertical: 2,
    paddingHorizontal: 6,
    color: colors.tomato,
    lineHeight: 16,
  },

  notiText: {
    ...appStyles.medium14,
    color: colors.warmGrey,
    lineHeight: 20,
  },
  notiBoldText: {
    ...appStyles.bold14Text,
    color: colors.warmGrey,
    lineHeight: 20,
  },

  grabber: {
    width: 46,
    height: 10,
    marginVertical: 10,
  },
  voucherTitleText: {
    ...appStyles.bold18Text,
    lineHeight: 26,
    marginTop: 16,
  },

  bodyContainer: {paddingHorizontal: 20, marginBottom: 20},

  bodyText: {
    ...appStyles.medium14,
    color: colors.warmGrey,
    lineHeight: 20,
    letterSpacing: 0,
  },

  amountContainer: {
    borderTopWidth: 1,
    paddingTop: 20,
    borderColor: colors.whiteFive,
  },
});

type VoucherRefundModalProps = {
  visible: boolean;
  setVisible: (val: VoucherModalType) => void;
  onClickButton: () => void;
  refundInfo: VoucherRefundInfo;
};

const VoucherRefundModal: React.FC<VoucherRefundModalProps> = ({
  setVisible,
  visible,
  onClickButton,
  refundInfo,
}) => {
  const title = useMemo(() => {
    return (
      <View style={styles.titleContainer}>
        <AppText style={styles.voucherTitleText}>{'상품권 잔액 환불'}</AppText>
        <AppSvgIcon
          onPress={() => setVisible('')}
          name="cancelButton"
          style={{paddingTop: 10}}
        />
      </View>
    );
  }, []);

  const checkRefundAvailable = useCallback((total, used) => {
    const per = used / total;
    const threshold = total > 10000 ? 0.6 : 0.8;

    return per > threshold;
  }, []);

  const renderRefundBox = useCallback(
    (totalNum: number, used: number, last_date: string, per: number) => {
      return (
        <>
          <View style={styles.refundBoxTitleView}>
            <View style={styles.refundBoxTitleRow}>
              <AppSvgIcon name="lightningCashIcon20" style={{marginTop: 2}} />
              <AppText style={styles.refundBoxTitleText}>
                {'최종 충전 후'}
              </AppText>
            </View>
          </View>
          <View style={styles.refundBoxInfoView}>
            <VoucherRefundInfoBox
              title={'합계 잔액'}
              amount={utils.currencyString(totalNum)}
              subText={`(${moment(last_date).format('YYYY.MM.DD')}기준)`}
            />
            <AppSvgIcon name="swapIcon" style={styles.swapIconView} />
            <VoucherRefundInfoBox
              title={'사용 금액'}
              amount={utils.currencyString(used)}
              subText={`(사용률 <b>${(per * 100).toFixed(0)}%</b>)`}
              textColor={colors.redError}
            />
          </View>
        </>
      );
    },
    [],
  );

  const renderAvailableBox = useCallback((isAvailable, totalNum, used) => {
    return (
      <>
        <View style={styles.refundAvailableView}>
          <View style={styles.row}>
            <View style={{flexDirection: 'row', gap: 4}}>
              <AppSvgIcon name="cashIcon" />
              <AppText
                style={
                  styles.refundAvailableTitleView
                }>{`환불 가능 금액`}</AppText>
            </View>
            <View style={styles.refundAvailableAmountView}>
              {isAvailable && (
                <AppText style={styles.refundAvailableAmountText}>
                  {`${utils.currencyString(totalNum - used)}`}
                </AppText>
              )}
              <AppText style={styles.refundAvailableCurrenyText}>
                {isAvailable ? '원' : '없음'}
              </AppText>
            </View>
          </View>

          <View style={styles.notiView}>
            <AppText style={styles.notiAvailableBox}>
              {isAvailable ? '환불 가능' : '환불 불가'}
            </AppText>

            <AppStyledText
              text={'최종 충전 후 <b>60% 이상 사용</b>해야 합니다.'}
              textStyle={styles.notiText}
              format={{
                b: styles.notiBoldText,
              }}
            />
          </View>
        </View>
      </>
    );
  }, []);

  const body = useMemo(() => {
    const {last_date, sum_diff, total} = refundInfo;

    const used = parseInt(sum_diff, 10) * -1;
    const totalNum = parseInt(total, 10);

    // 사용률
    const per = used / totalNum;
    const isAvailable = checkRefundAvailable(totalNum, used);

    const notiText = isAvailable
      ? `최종 충전 후 ${
          totalNum > 10000 ? '60%' : '80%'
        } 이상 사용하였으므로, 잔액 환불 가능합니다.`
      : `최종 충전 후 ${
          totalNum > 10000 ? '60%' : '80%'
        } 이상 사용된 경우에만 환불 가능 합니다.`;

    console.log('@@@@ per : ', per);

    return (
      <>
        <View style={styles.bodyContainer}>
          <View>
            <View style={styles.topNotiView}>
              <AppText style={styles.topNotiTitleText}>
                {'환불 정책 안내'}
              </AppText>

              <AppStyledText
                text={
                  '환불은 최종 충전 후 <b>합계 잔액이 1만원 이하인 경우 80% 이상, 1만원 초과인 경우 60% 이상 사용</b>된 경우에만 가능합니다.'
                }
                textStyle={styles.topNotiText}
                format={{b: styles.topNotiBoldText}}
              />
            </View>

            {renderRefundBox(totalNum, used, last_date, per)}
            {renderAvailableBox(isAvailable, totalNum, used)}
          </View>
        </View>
        <AppButton
          style={styles.confirm}
          title={isAvailable ? '고객센터에 환불 신청하기' : '확인'}
          onPress={() => {
            onClickButton();
            setVisible('');
          }}
        />
      </>
    );
  }, [onClickButton, setVisible]);

  return (
    <AppBottomModal
      visible={visible}
      isCloseBtn={false}
      onClose={() => {
        setVisible('');
      }}
      title={title}
      titleType="component"
      body={body}
      boxStyle={{paddingTop: 0, paddingBottom: 20}}
    />
  );
};

export default memo(VoucherRefundModal);
