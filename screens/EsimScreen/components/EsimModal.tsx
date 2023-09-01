import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import _ from 'underscore';
import AppModal from '@/components/AppModal';
import {colors} from '@/constants/Colors';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import i18n from '@/utils/i18n';
import UsageItem from '@/screens/EsimScreen/components/UsageItem';
import AppSnackBar from '@/components/AppSnackBar';
import {MAX_WIDTH} from '@/constants/SliderEntry.style';
import AppButton from '@/components/AppButton';
import {appStyles} from '@/constants/Styles';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {isBillionConnect} from '@/redux/modules/order';

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 20,
    marginBottom: 10,
    color: colors.black,
  },
  blueBtn: {
    height: 52,
    flex: 1,
    backgroundColor: colors.clearBlue,
  },
  blueBtnTitle: {
    ...appStyles.bold18Text,
    color: colors.white,
  },
  whiteBtn: {
    height: 52,
    width: 120,
    marginRight: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  whiteBtnTitle: {
    ...appStyles.medium18,
    color: colors.black,
  },
  bubbleIcon: {
    position: 'absolute',
    top: -14,
    zIndex: 20,
    alignSelf: 'center',
  },
  bubbleText: {
    flexDirection: 'row',
    position: 'absolute',
    top: -13,
    zIndex: 30,
    alignSelf: 'center',
  },
});

type EsimModalProps = {
  visible: boolean;
  subs?: RkbSubscription;
  onOkClose?: () => void;
  onCancelClose?: () => void;
  cmiUsage: any;
  cmiStatus: any;
  cmiPending: boolean;
};
const EsimModal: React.FC<EsimModalProps> = ({
  visible,
  subs,
  onOkClose,
  onCancelClose,
  cmiUsage,
  cmiStatus,
  cmiPending,
}) => {
  const [showSnackBar, setShowSnackbar] = useState(false);

  const modalBody = useCallback(() => {
    if (!subs) return null;
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
          showSnackbar={() => {}}
          cmiPending={cmiPending}
          usage={{quota, used}}
          cmiStatusCd={statusCd}
          endTime={cmiStatus?.endTime}
        />
      )
    );
  }, [cmiPending, cmiStatus, cmiUsage, subs]);

  const renderBottom = useCallback(() => {
    const quota = Number(cmiUsage?.quota || 0);
    const used = Number(cmiUsage?.used || 0);

    // BC 상품은 충전 불가 추가
    const isChargeable =
      onOkClose && cmiStatus.statusCd === 'A' && !isBillionConnect(subs);

    return (
      <View style={{flexDirection: 'row'}}>
        <AppButton
          style={isChargeable ? styles.whiteBtn : styles.blueBtn}
          type="primary"
          onPress={onCancelClose}
          title={isChargeable ? i18n.t('close') : i18n.t('ok')}
          titleStyle={isChargeable ? styles.whiteBtnTitle : styles.blueBtnTitle}
        />
        {isChargeable && (
          <View style={{flex: 1, position: 'relative'}}>
            {_.isNumber(quota) &&
              _.isNumber(used) &&
              quota > 0 &&
              used / quota > 0.8 && (
                <>
                  <AppSvgIcon name="speechBubble2" style={styles.bubbleIcon} />
                  <View style={styles.bubbleText}>
                    <AppSvgIcon name="lightning" />
                    <AppText
                      style={{
                        ...appStyles.bold12Text,
                        lineHeight: 16,
                        color: colors.white,
                      }}>
                      {i18n.t('esim:charge:speechBubble')}
                    </AppText>
                  </View>
                </>
              )}
            <AppButton
              style={styles.blueBtn}
              type="primary"
              onPress={onOkClose}
              title={i18n.t('esim:charge')}
              titleStyle={styles.blueBtnTitle}
            />
          </View>
        )}
      </View>
    );
  }, [
    cmiStatus.statusCd,
    cmiUsage?.quota,
    cmiUsage?.used,
    onCancelClose,
    onOkClose,
  ]);

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
      visible={visible}
      bottom={renderBottom}>
      {modalBody()}
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('esim:copyMsg')}
      />
    </AppModal>
  );
};

export default memo(EsimModal);
