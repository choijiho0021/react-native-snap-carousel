import React, {memo, useCallback, useState, useMemo} from 'react';
import Analytics from 'appcenter-analytics';
import {Pressable, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import {navigate} from '@/navigation/navigation';

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  },
  spaceBetweenBox: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  underlinedClearBlue: {
    color: colors.clearBlue,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
});

const PolicyChecker = ({
  onPress,
  route,
}: {
  onPress?: (v: boolean) => void;
  route: any;
}) => {
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);

  const navParam = useMemo(
    () => ({
      '1': {
        key: 'setting:privacy',
        title: i18n.t('pym:privacy'),
      },
      '2': {
        key: 'pym:agreement',
        title: i18n.t('pym:paymentAgency'),
      },
    }),
    [],
  );

  const move = useCallback(
    (key: '1' | '2') => {
      const param = navParam[key];
      Analytics.trackEvent('Page_View_Count', {page: param.key});
      navigation.navigate('SimpleTextModal', param);

      navigate(navigation, route, 'EsimStack', {
        tab: 'HomeStack',
        screen: 'SimpleTextModal',
        params: {...param},
      });
    },
    [navParam, navigation, route],
  );

  return (
    <View style={{backgroundColor: colors.whiteTwo, paddingBottom: 45}}>
      <Pressable
        style={styles.rowCenter}
        onPress={() => {
          setChecked((prev) => !prev);
          onPress?.(!checked);
        }}>
        <AppIcon name="btnCheck2" checked={checked} size={22} />
        <AppText
          style={[appStyles.bold16Text, {color: colors.black, marginLeft: 12}]}>
          {i18n.t('pym:consentEssential')}
        </AppText>
      </Pressable>
      <Pressable style={styles.spaceBetweenBox} onPress={() => move('1')}>
        <AppText
          style={[
            appStyles.normal14Text,
            {color: colors.warmGrey, lineHeight: 22},
          ]}>
          {i18n.t('pym:privacy')}
        </AppText>
        <AppText style={styles.underlinedClearBlue}>
          {i18n.t('pym:detail')}
        </AppText>
      </Pressable>
      <Pressable style={styles.spaceBetweenBox} onPress={() => move('2')}>
        <AppText
          style={[
            appStyles.normal14Text,
            {color: colors.warmGrey, lineHeight: 22},
          ]}>
          {i18n.t('pym:paymentAgency')}
        </AppText>
        <AppText style={styles.underlinedClearBlue}>
          {i18n.t('pym:detail')}
        </AppText>
      </Pressable>
    </View>
  );
};

export default memo(PolicyChecker);
