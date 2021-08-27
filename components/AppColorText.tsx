import React, {memo} from 'react';
import {StyleProp, TextStyle} from 'react-native';
import AppText from './AppText';

const re = /<color:'([\da-fA-F#]+)'>((?:(?!<\/color>).)+)<\/color>/;
type AppColorTextProps = {text: string; style: StyleProp<TextStyle>};
const AppColorText: React.FC<AppColorTextProps> = ({text, style}) => {
  const m = text.match(re);
  if (m) {
    return (
      <AppText style={style}>
        <AppText key="front" style={style}>
          {text.substr(0, m.index)}
        </AppText>
        <AppText key="match" style={[style, {color: m[1]}]}>
          {m[2]}
        </AppText>
        <AppColorText
          style={style}
          text={text.substr((m.index || 0) + m[0].length)}
        />
      </AppText>
    );
  }
  return <AppText style={style}>{text}</AppText>;
};
export default memo(AppColorText);
