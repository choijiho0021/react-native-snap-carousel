import React, {memo, useCallback} from 'react';
import {Pressable, SafeAreaView, StyleSheet, View, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import {actions as modalActions} from '@/redux/modules/modal';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import TextWithDot from '@/screens/EsimScreen/components/TextWithDot';
import AppSvgIcon from '@/components/AppSvgIcon';
import ChargeBottomButton from '@/screens/EsimScreen/components/ChargeBottomButton';
import {ChargeDisReason} from '@/screens/EsimScreen/components/ChargeTypeButton';

const styles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    paddingTop: 32,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...appStyles.bold20Text,
    lineHeight: 30,
  },
  mainImg: {
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  notice: {
    marginRight: 20,
    marginBottom: 24,
  },
  noticeText: {
    ...appStyles.semiBold14Text,
    lineHeight: 22,
    color: colors.warmGrey,
  },
  dot: {
    ...appStyles.semiBold14Text,
    color: colors.warmGrey,
    marginHorizontal: 5,
    marginTop: 2,
  },
  recommendText: {
    ...appStyles.bold16Text,
    lineHeight: 24,
  },
  box: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: colors.backGrey,
    marginBottom: 4,
  },
  boxText: {
    ...appStyles.semiBold14Text,
    lineHeight: 22,
    letterSpacing: -0.28,
  },
});

type ChargeTypeModalProps = {
  type: string;
  onPress: (type: string) => void;
  disabled: boolean;
  disReason?: ChargeDisReason;
};

const ChargeTypeModal: React.FC<ChargeTypeModalProps> = ({
  type,
  onPress,
  disabled,
  disReason,
}) => {
  const dispatch = useDispatch();

  const textWithCheck = useCallback(
    (text: string) => (
      <View style={styles.row} key={text}>
        <AppSvgIcon style={{marginRight: 8}} name="checkedBlueSmall" />
        <AppText style={styles.boxText}>{text}</AppText>
      </View>
    ),
    [],
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
            {i18n.t(`esim:charge:type:${type}`)}
          </AppText>
          <Image
            style={styles.mainImg}
            source={
              type === 'addOn'
                ? require('@/assets/images/esim/addOnModal.png')
                : require('@/assets/images/esim/extensionModal.png')
            }
            resizeMode="stretch"
          />
          <View style={styles.notice}>
            {type === 'addOn'
              ? [1, 2].map((n) => (
                  <TextWithDot
                    key={n}
                    dotStyle={styles.dot}
                    textStyle={styles.noticeText}
                    text={i18n.t(`esim:charge:type:addOn:modal:notice${n}`)}
                  />
                ))
              : [1, 2, 3].map((n) => (
                  <TextWithDot
                    key={n}
                    dotStyle={styles.dot}
                    textStyle={styles.noticeText}
                    text={i18n.t(`esim:charge:type:extension:modal:notice${n}`)}
                  />
                ))}
          </View>
          <View style={[styles.row, {marginBottom: 10}]}>
            <AppSvgIcon style={{marginRight: 4}} name="fire" />
            <AppText style={styles.recommendText}>
              {i18n.t('esim:charge:recommend')}
            </AppText>
          </View>
          <View style={styles.box}>
            {[1, 2].map((n) =>
              textWithCheck(i18n.t(`esim:charge:type:${type}:modal:box${n}`)),
            )}
          </View>
          <ChargeBottomButton
            type={type}
            onPress={() => {
              dispatch(modalActions.closeModal());
              if (!disabled) onPress(type);
            }}
            disabled={disabled}
            title={
              disabled
                ? i18n.t(
                    `esim:charge:disReason:${
                      type === 'addOn' ? 'addOn' : 'extension'
                    }:${
                      type === 'addOn' ? disReason?.addOn : disReason?.extension
                    }`,
                  )
                : undefined
            }
          />
          <View style={{height: 20}} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(ChargeTypeModal);
