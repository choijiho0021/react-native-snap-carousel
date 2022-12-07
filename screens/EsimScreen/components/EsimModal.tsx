import {bindActionCreators} from 'redux';
import React, {memo, useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import _ from 'underscore';
import AppModal from '@/components/AppModal';
import {colors} from '@/constants/Colors';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {} from '@/redux/api/productApi';
import i18n from '@/utils/i18n';
import UsageItem from '@/screens/EsimScreen/components/UsageItem';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import AppSnackBar from '@/components/AppSnackBar';
import {MAX_WIDTH} from '@/constants/SliderEntry.style';
import {
  actions as productActions,
  ProductAction,
} from '@/redux/modules/product';

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 20,
    marginBottom: 10,
    color: colors.black,
  },
});

type EsimModalProps = {
  visible: boolean;
  subs?: RkbSubscription;
  onOkClose?: () => void;
  cmiUsage: any;
  cmiStatus: any;
  cmiPending: boolean;
  action: {
    toast: ToastAction;
    product: ProductAction;
  };
};
const EsimModal: React.FC<EsimModalProps> = ({
  visible,
  subs,
  onOkClose,
  cmiUsage,
  cmiStatus,
  cmiPending,
}) => {
  const [showSnackBar, setShowSnackbar] = useState(false);

  const modalBody = useCallback(() => {
    if (!subs) return null;
    // const cmiUsage = {
    //   subscriberQuota: {
    //     qtavalue: '512000',
    //     qtabalance: '73042',
    //     qtaconsumption: '438958',
    //   },
    //   // 여기가 []면 미사용
    //   historyQuota: [
    //     {time: '20211222', qtaconsumption: '376.44', mcc: '452'},
    //     {time: '20211221', qtaconsumption: '1454.78', mcc: '452'},
    //   ],
    //   result: {code: 0},
    //   // 여기가 []면 미사용
    //   trajectoriesList: [
    //     {
    //       mcc: '452',
    //       country: 'Vietnam',
    //       beginTime: '20211221',
    //       useTime: '20220120',
    //       himsi: '454120382118109',
    //     },
    //   ],
    // };

    const quota = cmiUsage?.quota;
    const used = cmiUsage?.used;
    const statusCd =
      _.isEmpty(quota) && !_.isEmpty(used) ? 'U' : cmiStatus?.statusCd;

    // usage
    return (
      cmiStatus &&
      cmiUsage && (
        <UsageItem
          item={subs}
          onPress={() => {}}
          showSnackbar={() => {}}
          cmiPending={cmiPending}
          usage={{quota, used}}
          cmiStatusCd={statusCd}
          endTime={cmiStatus?.endTime}
        />
      )
    );
  }, [cmiPending, cmiStatus, cmiUsage, subs]);

  return (
    <AppModal
      type="close"
      justifyContent="flex-end"
      titleStyle={styles.titleStyle}
      titleViewStyle={{justifyContent: 'flex-start'}}
      contentStyle={{
        marginHorizontal: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        padding: 20,
        maxWidth: MAX_WIDTH,
        width: '100%',
      }}
      onOkClose={onOkClose}
      visible={visible}>
      {modalBody()}
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('esim:copyMsg')}
      />
    </AppModal>
  );
};

export default connect((dispatch) => ({
  action: {
    toast: bindActionCreators(toastActions, dispatch),
    product: bindActionCreators(productActions, dispatch),
  },
}))(memo(EsimModal));
