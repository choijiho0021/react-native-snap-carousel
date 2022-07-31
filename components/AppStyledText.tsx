import React, {memo, useCallback} from 'react';
import {TextStyle} from 'react-native';
import {formatText} from '@/constants/Styles';
import {StyledText} from './AppTextJoin';
import AppText from './AppText';

const AppStyledText = ({
  text,
  textStyle,
  format,
}: {
  text: string;
  textStyle: TextStyle;
  format: Record<string, TextStyle>;
}) => {
  const render = useCallback(
    (data: StyledText[]) =>
      data[0] ? (
        <AppText style={data[0].textStyle || textStyle}>
          {data[0].text}
          {render(data.slice(1))}
        </AppText>
      ) : null,
    [textStyle],
  );

  return Object.keys(format).map((k) =>
    render(
      formatText(k, {
        text,
        textStyle: format[k],
      }),
    ),
  );
};
export default memo(AppStyledText);
