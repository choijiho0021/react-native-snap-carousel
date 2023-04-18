import React, {memo} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import AppSvgIcon from '@/components/AppSvgIcon';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';

const styles = StyleSheet.create({
  btn: {
    padding: 30,
    borderWidth: 1,
    borderColor: colors.whiteFive,
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
}: {
  item: string;
  onPress: () => void;
  isHome: boolean;
}) => (
  <Pressable
    key={item}
    style={[
      styles.btn,
      item === 'checkSetting' && {backgroundColor: colors.backGrey},
    ]}
    onPress={onPress}>
    <View>
      <AppText style={styles.btnTitle}>
        {isHome
          ? i18n.t(`userGuide:${item}:title`)
          : i18n.t(`userGuide:selectRegion:${item}`)}
      </AppText>
      {isHome && (
        <View style={{marginTop: 4}}>
          <AppText style={styles.btnBody}>
            {i18n.t(`userGuide:${item}:body`)}
          </AppText>
        </View>
      )}
    </View>
    <AppSvgIcon name="rightArrow20" />
  </Pressable>
);

export default memo(GuideButton);
