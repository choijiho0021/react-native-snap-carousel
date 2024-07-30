import React, {memo, useMemo, useState} from 'react';
import {StyleSheet, View, Pressable, StyleProp, ViewStyle} from 'react-native';
import AppSvgIcon from '@/components/AppSvgIcon';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  btn: {
    padding: 30,
    borderWidth: 1,
    borderColor: colors.whiteFive,
    borderRadius: 3,
    marginHorizontal: 20,
    marginTop: 24,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,

    elevation: 12,
    shadowColor: 'rgb(166, 168, 172)',
    shadowRadius: 12,
    shadowOpacity: 0.16,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  btnTitle: {
    ...appStyles.bold18Text,
    lineHeight: 22,
    color: colors.black,
  },
  btnBody: {
    ...appStyles.semiBold16Text,
    lineHeight: 24,
    color: colors.warmGrey,
  },
});

const GuideButton = ({
  item,
  isHome = true,
  onPress,
  style,
}: {
  item: string;
  onPress: () => void;
  isHome: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const isBonusButton = useMemo(() => ['us', 'esimDel'].includes(item), [item]);

  return (
    <Pressable
      key={item}
      style={[
        styles.btn,
        {backgroundColor: isPressed ? colors.backGrey : colors.white},
        style,
      ]}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginRight: 40,
          }}>
          {isBonusButton && <AppSvgIcon name="cautionIconClearBlue" />}
          <AppStyledText
            textStyle={styles.btnTitle}
            text={
              isHome
                ? i18n.t(`userGuide:${item}:title`)
                : i18n.t(`userGuide:selectRegion:${item}`)
            }
            format={{
              b: {
                ...appStyles.bold16Text,
                color: colors.clearBlue,
              },

              b14: {
                ...appStyles.bold14Text,
                color: colors.clearBlue,
              },
            }}
          />
        </View>
        {isHome && i18n.t(`userGuide:${item}:body`) !== '' && (
          <View style={{marginTop: 4}}>
            <AppText style={styles.btnBody}>
              {i18n.t(`userGuide:${item}:body`)}
            </AppText>
          </View>
        )}
      </View>
      <AppSvgIcon name={isBonusButton ? 'rightArrowBlue20' : 'rightArrow20'} />
    </Pressable>
  );
};

export default memo(GuideButton);
