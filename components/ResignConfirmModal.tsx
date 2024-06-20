import React, {useCallback, useMemo} from 'react';
import {Image, Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {actions as modalActions} from '@/redux/modules/modal';
import AppText from './AppText';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppStyledText from './AppStyledText';
import {colors} from '@/constants/Colors';
import AppButton from './AppButton';

const styles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    paddingTop: 32,
    paddingBottom: 24,
    ...appStyles.bold24Text,
    lineHeight: 34,
  },
  bodyText: {
    ...appStyles.medium16,
    lineHeight: 24,
    letterSpacing: -0.16,
    color: colors.black,
  },
  bodyTextBold: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    letterSpacing: -0.16,
    color: colors.clearBlue,
  },
  img: {
    alignItems: 'center',
    paddingTop: 42,
    paddingBottom: 32,
  },
  buttonArea: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    height: 52,
    paddingVertical: 13,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
  },
  buttonText: {
    ...appStyles.medium18,
    lineHeight: 26,
  },
});

type ResignConfirmModalProps = {
  onCancelClose: () => void;
  onOkClose: () => void;
  purchaseCnt: number;
};

const ResignConfirmModal: React.FC<ResignConfirmModalProps> = ({
  onCancelClose,
  onOkClose,
  purchaseCnt,
}) => {
  const dispatch = useDispatch();
  const hasOrder = useMemo(() => purchaseCnt > 0, [purchaseCnt]);

  const renderButton = useCallback(
    (kind: string) => {
      const isCancel = kind === 'cancel';
      return (
        <AppButton
          style={[
            styles.button,
            isCancel
              ? {
                  borderColor: colors.clearBlue,
                  backgroundColor: colors.clearBlue,
                }
              : {borderColor: colors.lightGrey},
          ]}
          key={kind}
          title={i18n.t(`resign:confirmModal:${kind}`)}
          titleStyle={{
            ...styles.buttonText,
            color: isCancel ? colors.white : colors.black,
          }}
          onPress={isCancel ? onOkClose : onCancelClose}
        />
      );
    },
    [onCancelClose, onOkClose],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
        <Pressable
          style={{flex: 1}}
          onPress={() => dispatch(modalActions.closeModal())}
        />
        <View style={styles.container}>
          <AppText style={styles.title}>
            {i18n.t('resign:confirmModal:title')}
          </AppText>
          <AppStyledText
            text={i18n.t(`resign:${hasOrder ? 'cntInfo' : 'noCnt'}`)}
            textStyle={styles.bodyText}
            format={{b: styles.bodyTextBold}}
            data={{count: purchaseCnt.toString()}}
          />
          <View style={styles.img}>
            <Image source={require('@/assets/images/esim/airplane.png')} />
          </View>
          <View style={styles.buttonArea}>
            {['resign', 'cancel'].map((k) => renderButton(k))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResignConfirmModal;
