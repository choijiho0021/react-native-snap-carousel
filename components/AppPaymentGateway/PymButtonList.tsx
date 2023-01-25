import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import i18n from '@/utils/i18n';
import AppButton from '../AppButton';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 1,
    height: 62,
    backgroundColor: colors.white,
    borderStyle: 'solid' as const,
    borderColor: colors.lightGrey,
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
  right,
  bottom,
  topColor,
  leftColor,
  onPress,
}: {
  btnKey: string;
  icon?: string;
  selected: string;
  right?: boolean;
  bottom?: boolean;
  topColor?: boolean;
  leftColor?: boolean;
  onPress: (k: string) => void;
}) => {
  const sel = useMemo(() => btnKey === selected, [btnKey, selected]);

  return (
    <AppButton
      title={icon ? undefined : i18n.t(btnKey)}
      style={[
        styles.buttonStyle,
        {
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
      onPress={() => onPress(btnKey)}
    />
  );
};

type PymButtonListParams = {
  selected: string;
  onPress: (k: string) => void;
};
const PymButtonList: React.FC<PymButtonListParams> = ({selected, onPress}) => {
  return (
    <View>
      <PymButton
        selected={selected}
        btnKey="pym:ccard"
        right
        onPress={onPress}
      />
      <View key="row1" style={styles.buttonRow}>
        <PymButton
          icon="kakao"
          btnKey="pym:kakao"
          selected={selected}
          topColor={selected === 'pym:ccard'}
          onPress={onPress}
        />
        <PymButton
          icon="toss"
          btnKey="pym:toss"
          selected={selected}
          topColor={selected === 'pym:ccard'}
          onPress={onPress}
          leftColor={selected === 'pym:kakao'}
        />
        <PymButton
          icon="payco"
          btnKey="pym:payco"
          selected={selected}
          topColor={selected === 'pym:ccard'}
          leftColor={selected === 'pym:toss'}
          onPress={onPress}
          right
        />
      </View>
      <View key="row2" style={styles.buttonRow}>
        <PymButton
          icon="naver"
          btnKey="pym:naver"
          selected={selected}
          bottom
          topColor={selected === 'pym:kakao'}
          onPress={onPress}
        />
        <PymButton
          icon="ssgpay"
          btnKey="pym:ssgpay"
          selected={selected}
          bottom
          topColor={selected === 'pym:toss'}
          onPress={onPress}
          leftColor={selected === 'pym:naver'}
        />
        <PymButton
          icon="lpay"
          btnKey="pym:lpay"
          selected={selected}
          topColor={selected === 'pym:payco'}
          leftColor={selected === 'pym:ssgpay'}
          onPress={onPress}
          bottom
          right
        />
      </View>
    </View>
  );
};

export default PymButtonList;
