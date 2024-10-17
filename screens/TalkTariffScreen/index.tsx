// eslint-disable-next-line import/no-extraneous-dependencies
import {StackNavigationProp} from '@react-navigation/stack';
import * as Hangul from 'hangul-js';
import React, {useCallback, useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppSearch from '@/components/AppSearch';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {
  actions as talkActions,
  TalkAction,
  TalkModelState,
  TalkTariff,
} from '@/redux/modules/talk';
import i18n from '@/utils/i18n';
import EmptyResult from '../TalkContact/components/EmptyResult';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
    height: 56,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  row2: {
    flexDirection: 'row',
    width: 98,
    height: 20,
    justifyContent: 'space-evenly',
  },
  sectionHeader: {
    ...appStyles.medium16,
    paddingHorizontal: 20,
    paddingTop: 12,
    color: colors.warmGrey,
  },
  item: {
    height: 56,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  flag: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  tariff: {
    ...appStyles.robotoMedium14Text,
    color: colors.blue,
  },
});

export type TalkTariffNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'TalkTariff'
>;

type TalkTariffScreenProps = {
  navigation: TalkTariffNavigationProp;

  talk: TalkModelState;
  action: {
    talk: TalkAction;
  };
};

type TariffSectionData = Record<string, {title: string; data: TalkTariff[]}>;

const favoriteCountry = ['kr', 'us', 'jp'];

const TalkTariffScreen: React.FC<TalkTariffScreenProps> = ({
  talk,
  action,
  navigation,
}) => {
  const [searchText, setSearchText] = useState('');
  const [colorChange, setColorChange] = useState<string>();

  const tariffData = useMemo(() => {
    const list = Object.values(talk.tariff).reduce((acc, cur) => {
      let key = cur.name[0];
      if (Hangul.isHangul(key)) {
        key = Hangul.disassemble(cur.name[0])?.[0];
      }
      if (acc[key]) {
        acc[key].data = acc[key].data
          .concat(cur)
          .sort((a, b) => a.name.localeCompare(b.name));
      } else {
        acc[key] = {
          title: key,
          data: [cur],
        };
      }
      return acc;
    }, {} as TariffSectionData);

    return Object.values(list).sort((a, b) => a.title.localeCompare(b.title));
  }, [talk.tariff]);

  const fav = useMemo(
    () => [
      {
        title: i18n.t('talk:tariff:favorite'),
        data: favoriteCountry.map((t) => talk.tariff[t]).filter((t) => !!t),
      },
    ],
    [talk.tariff],
  );

  const renderSectionItem = useCallback(
    ({item}: {item: TalkTariff}) => {
      return (
        <Pressable
          style={[
            styles.item,
            item.code === colorChange && {backgroundColor: colors.backGrey},
          ]}
          onPressIn={() => setColorChange(item.code)}
          onPressOut={() => setColorChange('')}
          onPress={() => {
            action.talk.updateCcode(item.code);
            navigation.goBack();
          }}>
          <Image
            style={styles.flag}
            source={{uri: API.default.httpImageUrl(item.flag)}}
          />
          <AppText
            style={[
              appStyles.semiBold16Text,
              {flex: 1},
            ]}>{`${item.name} (${item.code})`}</AppText>
          <View style={styles.row2}>
            <AppText key="wire" style={styles.tariff}>
              {`${item.wireline}P`}
            </AppText>
            <AppText key="mobile" style={styles.tariff}>
              {`${item.mobile}P`}
            </AppText>
          </View>
        </Pressable>
      );
    },
    [action.talk, colorChange, navigation],
  );

  const search = useCallback(
    (
      data: {
        title: string;
        data: TalkTariff[];
      }[],
      text: string,
    ) => {
      return text
        ? data
            .map((d) => {
              const filtered = d.data.filter(
                (a) => a.name.includes(text) || a.chosung.includes(text),
              );
              return _.isEmpty(filtered)
                ? undefined
                : {title: d.title, data: filtered};
            })
            .filter((d) => !!d)
        : fav.concat(data);
    },
    [fav],
  );

  const onChangeText = useCallback((v: string) => {
    setSearchText(v);
  }, []);

  const onCancel = useCallback(() => {
    setSearchText('');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppSearch
          placeholder={i18n.t('talk:tariff:search')}
          onChangeText={onChangeText}
          onCancel={onCancel}
          value={searchText}
          textStyle={{...appStyles.semiBold16Text}}
        />
      </View>
      {!searchText ? (
        <View style={styles.row}>
          <AppText style={appStyles.bold18Text}>
            {i18n.t('talk:tariff:country')}
          </AppText>
          <View>
            <View style={styles.row2}>
              {['wireline', 'mobile'].map((k) => (
                <AppText
                  style={[appStyles.semiBold12Text, {color: colors.blue}]}>
                  {i18n.t(`talk:tariff:${k}`)}
                </AppText>
              ))}
            </View>
            <AppText style={[appStyles.bold12Text, {color: colors.gray2}]}>
              {i18n.t('talk:tariff:desc')}
            </AppText>
          </View>
        </View>
      ) : null}

      <SectionList
        keyExtractor={(item) => item.code}
        sections={search(tariffData, searchText)}
        contentContainerStyle={{flexGrow: 1}}
        renderItem={renderSectionItem}
        renderSectionHeader={({section: {title}}) => (
          <AppText style={styles.sectionHeader}>{title}</AppText>
        )}
        ListEmptyComponent={<EmptyResult />}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({talk}: RootState) => ({
    talk,
  }),
  (dispatch) => ({
    action: {
      talk: bindActionCreators(talkActions, dispatch),
    },
  }),
)(TalkTariffScreen);
