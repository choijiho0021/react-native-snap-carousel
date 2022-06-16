import React, {memo} from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {colors} from '@/constants/Colors';
import AppText from './AppText';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

interface HightlightText {
  text: string;
  highlight?: boolean;
}

const splitText = (text: string, key: string[]): HightlightText[] => {
  const splitText0 = (text0: string, k0: string) =>
    text0
      .split(k0)
      .map((v, idx, arr) =>
        idx < arr.length - 1
          ? splitText(v, key).concat([{text: k0, highlight: true}])
          : splitText(v, key),
      )
      .reduce((acc, cur) => acc.concat(cur), []);

  const checkDigits = (text0: string, k0: string): string | undefined => {
    for (let i = 1; i < k0.length; i++) {
      const s1 = k0.substring(0, i);
      const s2 = k0.substring(i);
      const comp = `${s1}-${s2}`;
      if (text0.includes(comp)) return comp;

      if (text0.startsWith(`${s1}-`)) {
        const y = checkDigits(text0.substring(i + 1), s2);
        if (y) return `${s1}-${y}`;
      }
    }
    return undefined;
  };

  const k = key.shift();
  if (k) {
    if (text.includes(k)) {
      return splitText0(text, k);
    }

    if (/^\d+$/.test(k)) {
      // 번호인 경우
      const k1 = checkDigits(text, k);
      if (k1) return splitText0(text, k1);
    }
  }

  return text === '' ? [] : [{text}];
};

interface SegmentedTextProps {
  style?: ViewStyle;
  textStyle?: TextStyle | TextStyle[];
  text: string;
  highlight?: string;
  highlightColor?: string;
  numberOfLines?: number;
}
const SegmentedText: React.FC<SegmentedTextProps> = ({
  style,
  textStyle,
  text,
  highlight,
  highlightColor = colors.clearBlue,
  numberOfLines,
}) => {
  if (highlight) {
    const list = splitText(text, highlight.split(' '));
    return (
      <View style={[styles.row, style]}>
        {list.map((v, idx) => (
          <AppText
            numberOfLines={numberOfLines || 0}
            key={`${idx}:${v.text}`}
            style={[textStyle, v.highlight && {color: highlightColor}]}>
            {v.text}
          </AppText>
        ))}
      </View>
    );
  }

  return (
    <View style={style}>
      <AppText numberOfLines={numberOfLines || 0} style={textStyle}>
        {text}
      </AppText>
    </View>
  );
};

export default memo(SegmentedText);
