// eslint-disable-next-line import/no-extraneous-dependencies
import * as Hangul from 'hangul-js';
import React, {useCallback, useMemo} from 'react';
import {Image, SafeAreaView, SectionList, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {TalkModelState, TalkTariff} from '@/redux/modules/talk';
import i18n from '@/utils/i18n';
import {API} from '@/redux/api';

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
  contentContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    marginHorizontal: 20,
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

type TalkTariffScreenProps = {
  talk: TalkModelState;
};

type TariffSectionData = Record<string, {title: string; data: TalkTariff[]}>;

const sectionData = [
  {
    title: i18n.t('tariff.favorite'),
    data: [],
  },
];

const favoriteCountry = ['kr', 'us', 'jp'];

const TalkTariffScreen: React.FC<TalkTariffScreenProps> = ({talk}) => {
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

    return [
      {
        title: i18n.t('talk:tariff:favorite'),
        data: favoriteCountry.map((t) => talk.tariff[t]).filter((t) => !!t),
      },
    ].concat(
      Object.values(list).sort((a, b) => a.title.localeCompare(b.title)),
    );
  }, [talk.tariff]);

  const renderSectionItem = useCallback(({item}: {item: TalkTariff}) => {
    return (
      <View style={styles.item}>
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
            {item.wireline + 'P'}
          </AppText>
          <AppText key="mobile" style={styles.tariff}>
            {item.mobile + 'P'}
          </AppText>
        </View>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton title="톡포인트" />
      </View>
      <View style={styles.row}>
        <AppText style={appStyles.bold18Text}>
          {i18n.t('talk:tariff:country')}
        </AppText>
        <View>
          <View style={styles.row2}>
            {['wireline', 'mobile'].map((k) => (
              <AppText style={[appStyles.semiBold12Text, {color: colors.blue}]}>
                {i18n.t(`talk:tariff:${k}`)}
              </AppText>
            ))}
          </View>
          <AppText style={[appStyles.bold12Text, {color: colors.gray2}]}>
            {i18n.t('talk:tariff:desc')}
          </AppText>
        </View>
      </View>

      <SectionList
        // ref={sectionRef}
        sections={tariffData}
        contentContainerStyle={
          sectionData.length > 0 ? undefined : styles.contentContainerStyle
        }
        renderItem={renderSectionItem}
        renderSectionHeader={({section: {title}}) => (
          <AppText style={styles.sectionHeader}>{title}</AppText>
        )}
        // stickySectionHeadersEnabled
        // ListEmptyComponent={() => renderEmpty()}
        // onScrollEndDrag={({
        //   nativeEvent: {
        //     contentOffset: {y},
        //   },
        // }) => {
        //   if (isTop.current && y > 178) runAnimation(false);
        //   else if (!isTop.current && y <= 0) runAnimation(true);
        // }}
        // overScrollMode="never"
        // bounces={false}
      />
      {/* <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('cashHistory:snackbar')}
      /> */}

      {/* <AppActivityIndicator visible={pending || false} /> */}
    </SafeAreaView>
  );
};

export default connect(({talk}: RootState) => ({
  talk,
}))(TalkTariffScreen);
