import React, {memo, useCallback, useMemo} from 'react';
import {TextStyle} from 'react-native';
import {formatText} from '@/constants/Styles';
import {StyledText} from './AppTextJoin';
import AppText from './AppText';

const AppStyledText = ({
  text,
  textStyle,
  format,
  data,
}: {
  text: string;
  textStyle: TextStyle;
  format: Record<string, TextStyle>;
  data?: Record<string, string>;
}) => {
  const replaceData = useCallback(
    (txt: string) =>
      data
        ? Object.entries(data).reduce(
            (acc, cur) => acc.replace(new RegExp(`{${cur[0]}}`, 'g'), cur[1]),
            txt,
          )
        : txt,
    [data],
  );

  const render = useCallback(
    (list: StyledText[], fmt: [string, TextStyle][]) => {
      if (list.length > 0) {
        const str = replaceData(list[0].text);
        return (
          <AppText style={list[0].textStyle || textStyle}>
            {fmt.length > 0 && str.includes(`<${fmt[0][0]}>`) ? (
              <AppStyledText
                text={str}
                textStyle={textStyle}
                format={Object.fromEntries(fmt)}
                data={data}
              />
            ) : (
              str
            )}
            {render(list.slice(1), fmt)}
          </AppText>
        );
      }
      return null;
    },
    [data, replaceData, textStyle],
  );

  const fmt = useMemo(() => Object.entries(format), [format]);

  if (fmt.length > 0) {
    const list = fmt.reduce((acc: string | StyledText[], cur) => {
      const [key, style] = cur;
      if (typeof acc === 'string') {
        return text.includes(`<${key}>`)
          ? formatText(key, {text, textStyle: style})
          : acc;
      }
      return acc
        .map((a) =>
          a.text.includes(`<${key}>`)
            ? formatText(key, {text: a.text, textStyle: style})
            : a,
        )
        .reduce((a, c) => a.concat(c), []);
    }, text);

    if (typeof list === 'object') return render(list, fmt);
  }

  return <AppText style={textStyle}>{text}</AppText>;
};
export default memo(AppStyledText);
