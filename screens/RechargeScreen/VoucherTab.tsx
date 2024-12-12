import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppPrice from '@/components/AppPrice';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import utils from '@/redux/api/utils';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {AccountModelState} from '@/redux/modules/account';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TabBar from '../CountryScreen/TabBar';
import {API} from '@/redux/api';
import AppTextInput from '@/components/AppTextInput';
import AppAlert from '@/components/AppAlert';
import VoucherBottomAlert from './VoucherBottomAlert';
import RenderChargeAmount from './RenderChargeAmount';
import AppSvgIcon from '@/components/AppSvgIcon';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';

import {
  actions as toastActions,
  ToastAction,
  Toast,
} from '@/redux/modules/toast';
import AppModalContent from '@/components/ModalContent/AppModalContent';
import AppStyledText from '@/components/AppStyledText';

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
  textContainer: {
    position: 'relative',
    ...appStyles.medium18,
    height: 52,
    marginTop: 20,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    ...appStyles.roboto16Text,
    letterSpacing: -0.16,
  },
  input: {
    opacity: 0,
    height: 0,
  },
});

type RechargeTabType = 'cash' | 'voucher';

type VoucherTabProps = {
  account: AccountModelState;

  amount: number;
  setShowAlert: (val: boolean) => void;
  setVoucherType: (val: string) => void;

  action: {
    order: OrderAction;
    cart: CartAction;
    toast: ToastAction;
    modal: ModalAction;
  };
};

const {esimCurrency} = Env.get();
const rechargeChoice =
  esimCurrency === 'KRW'
    ? [
        [5000, 10000],
        [15000, 20000],
        [25000, 30000],
        [50000, 100000],
      ]
    : [
        [5, 10],
        [15, 20],
        [25, 30],
        [40, 50],
      ];

const TEST_OPTION = false;

const VoucherTab: React.FC<VoucherTabProps> = ({
  navigation,
  amount,
  account: {iccid, token, balance = 0},
  action,
  setShowAlert,
}) => {
  // recharge 상품의 SKU는 'rch-{amount}' 형식을 갖는다.
  // const [amount, setAmount] = useState(rechargeChoice[0][0]);
  const inputRef = useRef(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [voucherType, setVoucherType] = useState({
    title: '',
    amount: 0,
    expireDesc: '',
  });

  useEffect(() => {
    return () => {
      if (iccid && token) {
        action.order.getSubs({iccid, token});
      }
    };
  }, [action.order, iccid, token]);

  const handleFocus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onSubmit = useCallback(() => {
    if (iccid && token) {
      API.Account.getVoucherType({iccid, code: voucherCode}).then((rsp) => {
        if (rsp?.result === 0) {
          const {title, amount, expire_desc} = rsp?.objects;

          setShowAlert(true);
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
  }, [action.modal, iccid, token, voucherCode]);
  const getMaskedPlaceholder = useCallback(
    (type: 'placeholder' | 'text') => {
      const code = voucherCode + '●●●●●●●●●●●●●●●●'.slice(voucherCode.length);
      const formattedCodeWithSpaces = code.replace(/.{4}/g, '$&  ');
      const text = formattedCodeWithSpaces.replace(/●/g, '').trim();

      if (type === 'placeholder') {
        return formattedCodeWithSpaces.replace(/[0-9]/g, '').trim();
      }

      if ((text.length % 6) - 4 === 0) {
        return `${text}  `;
      }

      return text;
    },
    [voucherCode],
  );

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          marginHorizontal: 20,
        }}>
        <View style={{flexDirection: 'row', marginTop: 32, gap: 6}}>
          <AppSvgIcon name="voucherIcon" />
          <AppText style={[appStyles.normal16Text]}>
            {i18n.t('mypage:voucher:code')}
          </AppText>
        </View>
        <Pressable onPress={handleFocus} style={styles.textContainer}>
          <AppText style={styles.placeholder}>
            <AppText style={{color: colors.black}}>
              {getMaskedPlaceholder('text')}
            </AppText>
            <AppText style={{color: colors.greyish}}>
              {getMaskedPlaceholder('placeholder')}
            </AppText>
          </AppText>
        </Pressable>
        <View style={{flexDirection: 'row', gap: 6, marginTop: 6}}>
          <AppText
            style={[
              appStyles.bold14Text,
              {lineHeight: 20, color: colors.clearBlue},
            ]}>
            TIP
          </AppText>
          <AppText
            style={[
              appStyles.medium14,
              {lineHeight: 20, color: colors.warmGrey},
            ]}>
            {i18n.t('mypage:voucher:noti')}
          </AppText>
        </View>
        <AppTextInput
          ref={inputRef}
          style={styles.input}
          value={voucherCode}
          onChangeText={(val: string) => {
            setVoucherCode(val);
          }}
          keyboardType="numeric"
          maxLength={16}
        />
      </ScrollView>
      <AppButton
        title={i18n.t('mypage:voucher:use')}
        titleStyle={[appStyles.medium18, {color: colors.white}]}
        disabled={voucherCode.length !== 16}
        onPress={() => onSubmit()}
        style={styles.confirm}
        type="primary"
      />
    </>
  );
};

export default connect(
  ({account}: RootState) => ({account}),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(VoucherTab);
