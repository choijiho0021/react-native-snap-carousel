import {useNavigation, useRoute} from '@react-navigation/native';
import React, {memo, useCallback, useState} from 'react';
import {ImageStyle, StyleSheet, TextStyle, View} from 'react-native';
import {goBack} from '@/navigation/navigation';
import {colors} from '@/constants/Colors';
import AppSvgIcon from './AppSvgIcon';
import AppTextInput from './AppTextInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    marginVertical: 15,
    marginHorizontal: 20,
    flexDirection: 'row',
    height: 55,
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
});

const AppSearch = ({
  onPress,
  textStyle,
  imageStyle,
  disable,
  value,
  placeholder,
  onChangeText,
  onCancel,
  focusColor,
}: {
  onPress?: () => void;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
  disable?: boolean;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  focusColor?: string;
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [focus, setFocus] = useState(false);

  const goback = useCallback(() => {
    if (disable) return;
    if (onPress) onPress();
    else goBack(navigation, route);
  }, [disable, navigation, onPress, route]);

  return (
    <View style={styles.container}>
      <View key="icon" style={{marginLeft: 20, ...imageStyle}}>
        <AppSvgIcon name="btnBack" onPress={goback} />
      </View>
      <View
        key="input"
        style={[
          styles.input,
          {
            borderBottomColor:
              focus && focusColor ? focusColor : colors.lightGrey,
          },
        ]}>
        {!focus && (
          <AppSvgIcon
            style={{justifyContent: 'center', marginRight: 8}}
            name="btnSearchBold"
          />
        )}
        <AppTextInput
          style={{
            flex: 1,
            textAlignVertical: 'center',
            // height: 55,
            fontSize: 16,
            marginBottom: 2,
            fontWeight: '600',
            lineHeight: 24,
            color: colors.black,
            ...textStyle,
          }}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChangeText={onChangeText}
          placeholderTextColor={colors.greyish}
          placeholder={placeholder}
          returnKeyType="done"
          enablesReturnKeyAutomatically
          // maxLength={maxLength}
          // keyboardType={keyboardType}
          value={value}
          showCancel
          onCancel={onCancel}
        />
      </View>
    </View>
  );
};

export default memo(AppSearch);
