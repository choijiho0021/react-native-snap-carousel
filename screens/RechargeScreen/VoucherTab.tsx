import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import {ScrollView} from 'react-native-gesture-handler';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {AccountModelState} from '@/redux/modules/account';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import {API} from '@/redux/api';
import AppTextInput from '@/components/AppTextInput';
import AppSvgIcon from '@/components/AppSvgIcon';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import Env from '@/environment';
import AppModalContent from '@/components/ModalContent/AppModalContent';
import AppStyledText from '@/components/AppStyledText';
import {VoucherType} from './VoucherBottomAlert';
import api from '@/redux/api/api';
import voucherApi, {VoucherRefundInfo} from '@/redux/api/voucherApi';
import {utils} from '@/utils/utils';

const {isIOS} = Env.get();
const styles = StyleSheet.create({
  confirm: {
    ...appStyles.confirm,
  },
  modalText: {
    ...appStyles.normal16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.warmGrey,
  },
  modalBoldText: {
    ...appStyles.semiBold16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.black,
  },

  textInput: {
    ...appStyles.medium18,
    letterSpacing: -0.1,
    paddingVertical: 16,
    marginTop: 20,
    flex: 1,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  voucherNotiBold: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.clearBlue,
  },
  voucherNoti: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.warmGrey,
  },

  voucherNotiContainer: {
    flexDirection: 'row',
    marginTop: 32,
    justifyContent: 'space-between',
  },
  voucherNotiRow: {
    flexDirection: 'row',
    gap: 6,
  },
  voucherNotiTitle: {
    ...appStyles.normal16Text,
    textAlignVertical: 'center',
    paddingTop: 2,
  },
  voucherBox: {
    marginTop: 32,
    borderWidth: 1,
    height: 120,
    borderColor: colors.whiteFive,
  },
  voucherView: {
    height: 60,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voucherTitle: {
    ...appStyles.bold18Text,
    lineHeight: 26,
  },
  voucherRefundView: {flexDirection: 'row', alignItems: 'center'},
  voucherRefundBtnText: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    paddingTop: 2,
    lineHeight: 20,
  },
  voucherBalanceView: {
    height: 58,
    backgroundColor: colors.backGrey,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voucherBalanceText: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    color: colors.warmGrey,
  },
  voucherBalanceAmountText: {...appStyles.robotoBold18Text, lineHeight: 26},
});

export type VoucherModalType = '' | 'use' | 'refund';

type VoucherTabProps = {
  account: AccountModelState;

  amount: number;
  setShowAlert: (val: VoucherModalType) => void;
  setVoucherType: (val: VoucherType) => void;
  setRefundInfo: (val: VoucherRefundInfo) => void;
  refundInfo: VoucherRefundInfo;
  setVoucherCode: (val: string) => void;
  voucherCode: string;
  action: {
    order: OrderAction;
    modal: ModalAction;
  };
};

const VoucherTab: React.FC<VoucherTabProps> = ({
  account: {iccid, token, balance = 0},
  action,
  setShowAlert,
  setVoucherType,
  setVoucherCode,
  setRefundInfo,
  voucherCode,
}) => {
  const inputRef = useRef(null);
  const [text, setText] = useState('');
  const [voucherBalacne, setVoucherBalacne] = useState();

  useEffect(() => {
    if (iccid) {
      voucherApi.getVoucherRefundInfo({iccid}).then((rsp) => {
        if (rsp?.result === 0) {
          const {objects} = rsp;

          // 마지막 시간도 서버에서 줘야한다
          setRefundInfo({
            sum_diff: objects?.sum_diff,
            last_date: objects?.last_date,
            total: objects?.total,
          });
        }
      });
      // 상품권 잔액 환불 데이터를 가져오는 api 호출하기
    }
  }, [iccid, setRefundInfo]);

  useEffect(() => {
    if (iccid) {
      // action.order.getSubs({iccid, token});
      voucherApi.getVoucherPoint({iccid}).then((rsp) => {
        if (rsp?.result === 0) {
          const {objects} = rsp;
          setVoucherBalacne(parseInt(objects?.vPoint, 10));
          // setVoucherBalacne(parseInt(objects?.vPoint, 10));
        }
      });
    }
  }, [action.order, iccid, token]);

  const onSubmit = useCallback(() => {
    if (iccid && token) {
      console.log('@@@ voucherCode : ', voucherCode);
      Keyboard.dismiss();
      API.Account.getVoucherType({iccid, code: voucherCode}).then((rsp) => {
        console.log('@@@ rsp : ', rsp);
        if (rsp?.result === api.E_NETWORK_FAILED) {
          // 네트워크 오류 - 팝업 미출력
          return;
        }
        if (rsp?.result === 0) {
          const {title, amount, expire_desc} = rsp?.objects;

          setShowAlert('use');
          setVoucherType({
            title,
            amount: parseInt(amount, 10),
            expireDesc: expire_desc,
          });
        } else {
          action.modal.renderModal(() => (
            <AppModalContent
              type="info2"
              buttonBoxStyle={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              okButtonStyle={{marginBottom: 1}}
              onOkClose={() => {
                action.modal.closeModal();
              }}>
              <View style={{marginLeft: 30}}>
                <AppStyledText
                  text={i18n.t(`esim:recharge:voucher:regist:fail`)}
                  textStyle={styles.modalText}
                  format={{b: styles.modalBoldText}}
                />
              </View>
            </AppModalContent>
          ));
        }
      });
    }
  }, [action.modal, iccid, setShowAlert, setVoucherType, token, voucherCode]);

  const onClickRefund = useCallback(() => {
    if (iccid) {
      setShowAlert('refund');
    }
  }, [iccid, setShowAlert]);

  const getCodeWithSpace = useCallback((cur: string) => {
    return cur.trim().replace(/.{4}/g, '$&  ');
  }, []);

  const renderVoucherRegisterRender = useCallback(() => {
    return (
      <View style={{marginHorizontal: 20}}>
        <View style={styles.voucherNotiContainer}>
          <View style={styles.voucherNotiRow}>
            <AppSvgIcon name="voucherIcon" />
            <AppText style={styles.voucherNotiTitle}>
              {i18n.t('mypage:voucher:code')}
            </AppText>
          </View>
        </View>

        <AppTextInput
          style={styles.textInput}
          ref={inputRef}
          enablesReturnKeyAutomatically
          keyboardType="numeric"
          onChangeText={(val: string) => {
            const cur = val.replace(/[^0-9]/g, '').replace(/\s+/g, '');
            if (cur.length > 16) return;
            setText(cur.slice(0, 16));
            setVoucherCode(cur.slice(0, 16));
          }}
          placeholder="●●●●  ●●●●  ●●●●  ●●●●"
          placeholderTextColor={colors.greyish}
          clearTextOnFocus={false}
          onFocus={() => {
            setText(text.replace(/[^0-9]/g, '').replace(/\s+/g, ''));
          }}
          onBlur={() => {
            setText(getCodeWithSpace(text));
          }}
          value={text.trimEnd()}
          maxLength={22}
        />
        <View
          style={{
            flexDirection: 'row',
            gap: 6,
            marginTop: 6,
          }}>
          <AppStyledText
            text={i18n.t(`mypage:voucher:noti`)}
            textStyle={styles.voucherNoti}
            format={{b: styles.voucherNotiBold}}
          />
        </View>
      </View>
    );
  }, [getCodeWithSpace, setVoucherCode, text]);

  const divider = useCallback(() => {
    return (
      <View
        style={{height: 10, backgroundColor: colors.whiteTwo, marginTop: 32}}
      />
    );
  }, []);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      keyboardVerticalOffset={200}
      behavior={isIOS ? 'padding' : undefined}>
      <ScrollView>
        {renderVoucherRegisterRender()}
        {divider()}

        <View style={{marginHorizontal: 20}}>
          <View style={styles.voucherBox}>
            <View style={styles.voucherView}>
              <AppText style={styles.voucherTitle}>{'등록 상품권'}</AppText>
              <Pressable
                style={styles.voucherRefundView}
                onPress={() => {
                  console.log('@@@@ 하단 모달 (환불확인 띄우기)');
                  onClickRefund();
                }}>
                <AppText style={styles.voucherRefundBtnText}>
                  {'잔액 환불'}
                </AppText>
                <AppSvgIcon style={{paddingTop: 1}} name="rightArrowBlue10" />
              </Pressable>
            </View>
            <View style={styles.voucherBalanceView}>
              <AppText style={styles.voucherBalanceText}>
                {'상품권 잔액'}
              </AppText>
              <AppText style={styles.voucherBalanceAmountText}>
                {!voucherBalacne
                  ? '없음'
                  : `${utils.currencyString(voucherBalacne)}${i18n.t('KRW')}`}
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>
      <AppButton
        title={i18n.t('mypage:voucher:use')}
        titleStyle={[appStyles.medium18, {color: colors.white}]}
        disabled={voucherCode.length !== 16}
        onPress={() => onSubmit()}
        style={styles.confirm}
        type="primary"
      />
    </KeyboardAvoidingView>
  );
};

export default connect(
  ({account}: RootState) => ({account}),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(VoucherTab);
