import React, {useMemo} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import i18n from '@/utils/i18n';
import Env from '@/environment';
import AppButton from '../AppButton';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';

const {esimGlobal} = Env.get();

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 1,
    height: 62,
    backgroundColor: colors.white,
    borderStyle: 'solid' as const,
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  buttonText: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    color: colors.warmGrey,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

const PymButton = ({
  btnKey,
  icon,
  selected,
  left = true,
  right,
  bottom,
  topColor,
  leftColor,
  onPress,
}: {
  btnKey: string;
  icon?: string;
  selected?: string;
  left?: boolean;
  right?: boolean;
  bottom?: boolean;
  topColor?: boolean;
  leftColor?: boolean;
  onPress?: (k: string) => void;
}) => {
  const sel = useMemo(() => btnKey === selected, [btnKey, selected]);

  return (
    <AppButton
      title={icon || btnKey === 'pym:null' ? undefined : i18n.t(btnKey)}
      style={[
        styles.buttonStyle,
        {
          borderLeftWidth: left ? 1 : 0,
          borderRightWidth: right ? 1 : 0,
          borderBottomWidth: bottom ? 1 : 0,
          borderLeftColor:
            sel || leftColor ? colors.clearBlue : colors.lightGrey,
          borderTopColor: sel || topColor ? colors.clearBlue : colors.lightGrey,
          borderRightColor: right && sel ? colors.clearBlue : colors.lightGrey,
          borderBottomColor:
            bottom && sel ? colors.clearBlue : colors.lightGrey,
        },
      ]}
      titleStyle={styles.buttonText}
      iconName={icon}
      onPress={() => onPress?.(btnKey)}
    />
  );
};

type PymButtonListParams = {
  selected: string;
  onPress: (k: string) => void;
};
const PymButtonList: React.FC<PymButtonListParams> = ({selected, onPress}) => {
  const pay = useMemo(
    () => (Platform.OS === 'android' ? 'samsung' : 'applepay'),
    [],
  );

  if (esimGlobal)
    return (
      <View style={styles.buttonRow}>
        <PymButton
          selected={selected}
          btnKey="pym:ccard"
          bottom
          onPress={onPress}
        />
        <PymButton
          selected={selected}
          btnKey="pym:paypal"
          icon="paypal"
          right
          bottom
          onPress={onPress}
          leftColor={selected === 'pym:ccard'}
        />
      </View>
    );

  return (
    <View>
      <View key="row1" style={styles.buttonRow}>
        <PymButton
          icon="kakao"
          btnKey="pym:kakao"
          selected={selected}
          onPress={onPress}
        />
        <PymButton
          icon="naver"
          btnKey="pym:naver"
          selected={selected}
          leftColor={selected === 'pym:kakao'}
          onPress={onPress}
        />
        <PymButton
          icon={pay}
          btnKey={pay}
          selected={selected}
          onPress={onPress}
          leftColor={selected === 'pym:naver'}
          right
        />
      </View>
      <View key="row2" style={styles.buttonRow}>
        <PymButton
          icon="payco"
          btnKey="pym:payco"
          selected={selected}
          topColor={selected === 'pym:kakao'}
          onPress={onPress}
        />
        <PymButton
          icon="toss"
          btnKey="pym:toss"
          selected={selected}
          topColor={selected === 'pym:naver'}
          onPress={onPress}
          leftColor={selected === 'pym:payco'}
        />
        <PymButton
          icon="ssgpay"
          btnKey="pym:ssgpay"
          selected={selected}
          topColor={selected === pay}
          onPress={onPress}
          leftColor={selected === 'pym:toss'}
          right
        />
      </View>
      <View key="row3" style={styles.buttonRow}>
        <PymButton
          icon="lpay"
          btnKey="pym:lpay"
          selected={selected}
          topColor={selected === 'pym:payco'}
          onPress={onPress}
          bottom
        />
        <PymButton
          btnKey="pym:null"
          topColor={selected === 'pym:toss'}
          leftColor={selected === 'pym:lpay'}
        />
        <PymButton
          btnKey="pym:null"
          topColor={selected === 'pym:ssgpay'}
          left={false}
        />
      </View>
    </View>
  );
};

export {PymButton};
export default PymButtonList;
