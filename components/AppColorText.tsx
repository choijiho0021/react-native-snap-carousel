import React, {memo} from 'react';
import {StyleProp, Text, TextStyle, View} from 'react-native';

const re = /<color:'([\da-fA-F#]+)'>((?:(?!<\/color>).)+)<\/color>/;
type AppColorTextProps = {text: string; style: StyleProp<TextStyle>};
const AppColorText: React.FC<AppColorTextProps> = ({text, style}) => {
  const m = text.match(re);
  if (m) {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text key="front" style={style}>
          {text.substr(0, m.index)}
        </Text>
        <Text key="match" style={[style, {color: m[1]}]}>
          {m[2]}
        </Text>
        <Text key="rest" style={style}>
          {text.substr((m.index || 0) + m[0].length)}
        </Text>
      </View>
    );
  }
  return <Text style={style}>{text}</Text>;
};
export default memo(AppColorText);
