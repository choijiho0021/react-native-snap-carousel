import {StackNavigationProp} from '@react-navigation/stack';
import React, {memo, useCallback, useEffect, useMemo} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import AppBackButton from '@/components/AppBackButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import i18n from '@/utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  row: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomColor: colors.whiteTwo,
    borderBottomWidth: 1,
  },
  itemTitle: {
    ...appStyles.normal16Text,
    color: colors.black,
  },
  itemDesc: {
    ...appStyles.normal12Text,
    color: colors.warmGrey,
  },
});

type SettingsItem = {
  key: string;
  value: string;
  toggle?: boolean;
  route?: string;
  desc?: string;
};

const SettingsListItem0 = ({
  item,
  onPress,
}: {
  item: SettingsItem;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.row}>
        <AppText style={styles.itemTitle}>{item.value}</AppText>
        {item.desc ? (
          <AppText style={styles.itemDesc}>{item.desc}</AppText>
        ) : (
          <AppIcon style={{alignSelf: 'center'}} name="iconArrowRight" />
        )}
      </View>
    </Pressable>
  );
};

const SettingsListItem = memo(SettingsListItem0);

type AccountSettingsScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Settings'
>;

type AccountSettingsScreenProps = {
  navigation: AccountSettingsScreenNavigationProp;
  loggedIn?: boolean;
};

const AccountSettingsScreen: React.FC<AccountSettingsScreenProps> = ({
  navigation,
  loggedIn,
}) => {
  const data = useMemo(
    () => [
      {
        key: 'setting:changeMail',
        value: i18n.t('set:changeMail'),
        route: 'ChangeEmail',
      },
      {
        key: 'setting:resign',
        value: i18n.t('resign'),
        route: 'Resign',
      },
    ],
    [],
  );

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('set:accountSettings')} />,
    });

    if (!loggedIn) {
      navigation.navigate('Auth');
    }
  }, [loggedIn, navigation]);

  const onPress = useCallback(
    (item: SettingsItem) => {
      navigation.navigate(item.route);
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({item}: {item: SettingsItem}) => {
      return <SettingsListItem item={item} onPress={() => onPress(item)} />;
    },
    [onPress],
  );

  return (
    <View style={styles.container}>
      <FlatList data={data} renderItem={renderItem} />
    </View>
  );
};

export default connect(({account}: RootState) => ({
  loggedIn: account.loggedIn,
}))(AccountSettingsScreen);
