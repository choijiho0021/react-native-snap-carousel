import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import {sliderWidth} from '@/constants/SliderEntry.style';
import {actions as modalActions} from '@/redux/modules/modal';
import AppSvgIcon from '@/components/AppSvgIcon';
import ChargeTypeModal from '@/screens/HomeScreen/component/ChargeTypeModal';
import ChargeBottomButton from './ChargeBottomButton';

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frame: {
    width: sliderWidth - 40,
    marginTop: 26,
    marginHorizontal: 20,
    borderRadius: 3,
    padding: 30,
    borderWidth: 1,
    borderColor: colors.whiteFive,

    elevation: 12,
    shadowColor: 'rgb(166, 168, 172)',
    shadowRadius: 12,
    shadowOpacity: 0.16,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  detailText: {
    ...appStyles.bold18Text,
    lineHeight: 26,
    marginTop: 8,
  },
});

const ChargeTypeButton = ({
  type,
  onPress,
  disabled = false,
}: {
  type: string;
  onPress: () => void;
  disabled: boolean;
}) => {
  const dispatch = useDispatch();

  const onPressInfo = useCallback(() => {
    dispatch(
      modalActions.renderModal(() => (
        <ChargeTypeModal type={type} onPress={onPress} disabled={disabled} />
      )),
    );
  }, [disabled, dispatch, onPress, type]);

  return (
    <View style={styles.frame}>
      <View style={styles.row}>
        <AppSvgIcon
          style={{opacity: disabled ? 0.64 : 1}}
          name={`${type}Type`}
        />
        <AppSvgIcon name="info" onPress={onPressInfo} />
      </View>
      <AppText style={[styles.detailText, {opacity: disabled ? 0.64 : 1}]}>
        {i18n.t(`esim:charge:type:${type}:detail`)}
      </AppText>
      <ChargeBottomButton type={type} onPress={onPress} disabled={disabled} />
    </View>
  );
};

export default memo(ChargeTypeButton);
