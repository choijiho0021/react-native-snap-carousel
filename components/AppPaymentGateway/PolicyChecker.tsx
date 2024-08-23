import React, {memo, useCallback, useState, useMemo} from 'react';
import Analytics from 'appcenter-analytics';
import {Pressable, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import {HomeStackParamList} from '@/navigation/navigation';

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  },
  spaceBetweenBox: {
    marginHorizontal: 20,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  underlinedClearBlue: {
    color: colors.clearBlue,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
});

type PolicyCheckerNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'PolicyChecker'
>;

const PolicyChecker = ({onPress}: {onPress?: (v: boolean) => void}) => {
  const navigation = useNavigation<PolicyCheckerNavigationProp>();
  const [checked, setChecked] = useState(false);

  const commonParam = useMemo(
    () => ({
      showIcon: false,
      showCloseModal: true,
      btnStyle: {marginHorizontal: 20},
    }),
    [],
  );

  const navParam = useMemo(
    () => ({
      '1': {
        key: 'setting:privacy',
        title: i18n.t('pym:contract:1'),
        ...commonParam,
      },
      '2': {
        key: 'pym:agreement',
        title: i18n.t('pym:contract:2'),
        ...commonParam,
      },
    }),
    [commonParam],
  );

  const move = useCallback(
    (key: '1' | '2') => {
      const param = navParam[key];
      Analytics.trackEvent('Page_View_Count', {page: param.key});
      navigation.navigate('SimpleTextModal', param);
    },
    [navParam, navigation],
  );

  return (
    <View style={{backgroundColor: colors.whiteTwo, paddingBottom: 64}}>
      <Pressable
        style={styles.rowCenter}
        onPress={() => {
          setChecked((prev) => !prev);
          onPress?.(!checked);
        }}>
        <AppIcon name="btnCheck3" checked={checked} size={22} />
        <AppText style={[appStyles.bold14Text, {marginLeft: 8}]}>
          {i18n.t('pym:consentEssential')}
        </AppText>
      </Pressable>
      {(['1', '2'] as const).map((k) => (
        <Pressable
          key={k}
          style={styles.spaceBetweenBox}
          onPress={() => move(k)}>
          <AppText
            style={[
              appStyles.medium14,
              {color: colors.warmGrey, lineHeight: 22},
            ]}>
            {i18n.t(`pym:contract:${k}`)}
          </AppText>
          <AppText style={styles.underlinedClearBlue}>
            {i18n.t('pym:detail')}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
};

export default memo(PolicyChecker);
