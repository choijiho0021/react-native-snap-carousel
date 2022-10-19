import React, {memo, useCallback, useState} from 'react';
import {View} from 'react-native';
import {appStyles} from '@/constants/Styles';
import AppText from './AppText';

const SplitText = ({...props}) => {
  const [isLoad, setIsLoad] = useState(false);
  const [splitedText, setSplitedText] = useState<string[]>([]);

  const onTextLayout = useCallback((e) => {
    setSplitedText(e.nativeEvent.lines.map((elm) => elm.text));
    setIsLoad(true);
  }, []);

  return (
    <View style={appStyles.container}>
      {isLoad && splitedText ? (
        splitedText.map((elm, idx) => (
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <AppText key={elm} {...props} numberOfLines={1}>
              {elm}
            </AppText>
            {idx === splitedText.length - 1 && props.renderExpend()}
          </View>
        ))
      ) : (
        <AppText {...props} onTextLayout={onTextLayout}>
          {props.children}
        </AppText>
      )}
    </View>
  );
};

export default memo(SplitText);
