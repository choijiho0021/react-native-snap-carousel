import {useNavigation, useRoute} from '@react-navigation/native';
import React, {memo, useCallback, useState} from 'react';
import {
  ImageStyle,
  Pressable,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {goBack} from '@/navigation/navigation';
import {colors} from '@/constants/Colors';
import AppButton from './AppButton';
import AppSvgIcon from './AppSvgIcon';
import AppTextInput from './AppTextInput';

const AppSearch = ({
  title,
  titleStyle,
  disabled = false,
  showIcon = true,
  onPress,
  style,
  imageStyle,
  textProps,
  disable,
  value,
  onChangeText,
  onCancel,
}: {
  title?: string;
  titleStyle?: TextStyle;
  disabled?: boolean;
  showIcon?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textProps?: TextProps;
  disable?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
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
    <Pressable
      style={{
        justifyContent: 'center',

        flex: 1,
        ...style,
      }}
      onPress={goback}
      disabled={disabled}>
      <View
        key="btn"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
        {showIcon ? (
          <View key="icon" style={{marginLeft: 20, ...imageStyle}}>
            <AppSvgIcon name="btnBack" />
          </View>
        ) : (
          <View key="empty" style={{marginLeft: 15}} />
        )}

        <View
          style={{
            marginVertical: 15,
            marginHorizontal: 20,
            flexDirection: 'row',
            height: 55,
            flex: 1,
            alignItems: 'center',
            borderBottomColor: focus ? colors.clearBlue : colors.lightGrey,
            borderBottomWidth: 1,
          }}>
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
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onChangeText={onChangeText}
            placeholder="이름, 전화번호를 입력하세요"
            // style={styles.textInput}
            returnKeyType="done"
            enablesReturnKeyAutomatically
            // onChangeText={onChangeText}
            // maxLength={maxLength}
            // keyboardType={keyboardType}
            value={value}
          />
          {value?.length > 0 && (
            <AppButton
              style={{
                justifyContent: 'flex-end',
                marginLeft: 10,
              }}
              iconName="searchCancelBtn"
              onPress={onCancel}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default memo(AppSearch);
