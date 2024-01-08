import {appStyles} from '@/constants/Styles';
import React from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {StyleSheet} from 'react-native';
import {colors} from '@/constants/Colors';
import AppSvgIcon from '../AppSvgIcon';
import AppStyledText from '../AppStyledText';

const styles = StyleSheet.create({
  hearNotiFrame: {
    alignItems: 'center',
    flexDirection: 'row',
    ...appStyles.normal14Text,
    backgroundColor: colors.noticeBackground,
    borderRadius: 3,
    marginTop: 20,
    padding: 16,
    marginHorizontal: 20,
  },
  headerNotiText: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    margin: 5,
    color: colors.redError,
  },
  headerNotiBoldText: {
    ...appStyles.bold14Text,
    color: colors.redError,
  },
});

type AppNotiBoxProps = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  backgroundColor?: string;
  textColor?: string;
  iconName?: string;
  text?: string;
};

const AppNotiBox: React.FC<AppNotiBoxProps> = ({
  backgroundColor,
  containerStyle = [
    styles.hearNotiFrame,
    {
      backgroundColor,
    },
  ],
  textStyle,
  textColor,
  iconName = 'bannerMark',
  text = '',
}) => {
  return (
    <View style={containerStyle}>
      {
        // 자동 발권 처리 대기 상태는 아이콘 미표시
        <AppSvgIcon name={iconName} style={{marginRight: 9}} />
      }
      <AppStyledText
        text={text}
        textStyle={{
          ...styles.headerNotiText,
          color: textColor,
        }}
        format={{
          b: [
            styles.headerNotiBoldText,
            {
              color: textColor,
            },
          ],
        }}
      />
    </View>
  );
};

export default AppNotiBox;
