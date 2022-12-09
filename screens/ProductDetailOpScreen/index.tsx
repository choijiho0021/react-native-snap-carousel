/* eslint-disable no-param-reassign */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import AppTextInput from '@/components/AppTextInput';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import i18n from '@/utils/i18n';
import AppIcon from '@/components/AppIcon';

import AppSnackBar from '@/components/AppSnackBar';
import AppSvgIcon from '@/components/AppSvgIcon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    ...appStyles.normal18Text,
    lineHeight: 22,
    fontWeight: '600',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 4,
  },
  subTitle: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  divider: {
    height: 10,
    marginBottom: 8,
    backgroundColor: colors.whiteTwo,
  },
  showSearchBar: {
    marginBottom: 48,
    marginHorizontal: 20,
    height: 43,
    alignItems: 'center',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: colors.black,
    flexDirection: 'row',
  },
  row: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomColor: colors.whiteTwo,
    borderBottomWidth: 1,
  },
  country: {
    ...appStyles.normal16Text,
    color: colors.black,
  },
  operator: {
    ...appStyles.bold16Text,
    fontWeight: '600',
    lineHeight: 22,
    marginRight: 16,
  },
  apn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 32,
    backgroundColor: colors.whiteTwo,
    justifyContent: 'space-between',
  },
  btnCopy: {
    backgroundColor: colors.white,
    width: 62,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  apnTitle: {
    ...appStyles.normal16Text,
    color: colors.warmGrey,
  },
  apnValue: {
    marginTop: 2,
    paddingBottom: 2,
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
  },
  textInput: {
    ...appStyles.normal16Text,
    flex: 1,
    paddingLeft: 15,
  },
  nolist: {
    marginVertical: 60,
    textAlign: 'center',
  },
  searchDivider: {
    backgroundColor: colors.lightGrey,
    width: 2,
    height: '40%',
    marginHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
  },
});

type ProductDetailOpScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ProductDetailOp'
>;

type ProductDetailOpScreenRouteProp = RouteProp<
  HomeStackParamList,
  'ProductDetailOp'
>;

type ProductDetailOpScreenProps = {
  navigation: ProductDetailOpScreenNavigationProp;
  route: ProductDetailOpScreenRouteProp;
};

type detailOp = {country: string; operator: string; apn?: string[]};

const ProductDetailOpScreen: React.FC<ProductDetailOpScreenProps> = ({
  navigation,
  route,
}) => {
  const [copyBtnKey, setCopyBtnKey] = useState('');
  const [data, setData] = useState<detailOp[]>([]);
  const [searchWord, setSearchWord] = useState<string>('');
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [toggledList, setToggledList] = useState<Set<number>>(new Set([]));

  useEffect(() => {
    if (route?.params?.apn) {
      const dataFormat = route?.params?.apn
        .split(',')
        .map((elm) => elm.split('/'))
        .map((elm2) => ({
          country: elm2[0],
          operator: elm2[1].replace('&amp;', '&'),
          apn: elm2[2] ? elm2[2].split('&amp;') : [],
        }))
        .sort((a, b) => a.country.localeCompare(b.country));

      setData(
        searchWord
          ? dataFormat.filter((elm) =>
              new RegExp(searchWord, 'gi').test(elm.country),
            )
          : dataFormat,
      );
    }
  }, [navigation, route.params.apn, route.params?.title, searchWord]);

  const copyToClipboard = useCallback(
    (value?: string, key?: string) => () => {
      if (value) {
        Clipboard.setString(value);
        setCopyBtnKey(value + key);
        setShowSnackBar(true);
        setTimeout(() => {
          setShowSnackBar(false);
        }, 3000);
      }
    },
    [],
  );

  const toggleIndex = useCallback(
    (value: number) => {
      if (toggledList.has(value)) {
        toggledList.delete(value);
        setToggledList(new Set(Array.from(toggledList)));
      } else {
        toggledList.add(value);
        setToggledList(new Set(Array.from(toggledList)));
      }
    },
    [toggledList],
  );

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: {country: string; operator: string; apn?: string[]};
      index: number;
    }) => {
      const isToggled = toggledList.has(index);

      return (
        <Pressable onPress={() => toggleIndex(index)}>
          <View style={styles.row}>
            <AppText style={styles.country}>{item.country}</AppText>

            <View style={{flexDirection: 'row'}}>
              <AppText
                style={[
                  styles.operator,
                  {color: isToggled ? colors.clearBlue : colors.warmGrey},
                ]}>
                {item.operator}
              </AppText>
              <AppIcon
                style={{alignSelf: 'center'}}
                name={isToggled ? 'iconArrowUp' : 'iconArrowDown'}
              />
            </View>
          </View>

          {isToggled &&
            item.apn?.map((elm, idx, arr) => {
              const seleced = copyBtnKey === elm + item.country + item.operator;

              return (
                <View
                  style={[
                    styles.apn,
                    {paddingBottom: arr.length - 1 === idx ? 32 : 0},
                  ]}
                  key={elm}>
                  <View>
                    <AppText style={styles.apnTitle}>{i18n.t('apn')}</AppText>
                    <View style={styles.apnValue}>
                      <AppText style={appStyles.bold16Text}>{elm}</AppText>
                    </View>
                  </View>
                  <AppButton
                    key={elm + item.country + item.operator}
                    title={i18n.t('copy')}
                    titleStyle={[
                      appStyles.normal14Text,
                      {
                        color: seleced ? colors.clearBlue : colors.black,
                      },
                    ]}
                    style={[
                      styles.btnCopy,
                      {
                        borderColor: seleced
                          ? colors.clearBlue
                          : colors.lightGrey,
                      },
                    ]}
                    onPress={copyToClipboard(elm, item.country + item.operator)}
                    type="secondary"
                  />
                </View>
              );
            })}
        </Pressable>
      );
    },
    [copyBtnKey, copyToClipboard, toggleIndex, toggledList],
  );

  const empty = useCallback(
    () => (
      <AppText style={styles.nolist}>{i18n.t('prodDetailOp:empty')}</AppText>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton
          title={route.params?.title}
          style={{width: '70%', height: 56}}
        />
      </View>

      <AppText style={styles.title}>{i18n.t('prodDetailOp:title')}</AppText>
      <AppText style={styles.subTitle}>
        {i18n.t('prodDetailOp:subTitle')}
      </AppText>

      <View style={styles.showSearchBar}>
        <AppTextInput
          style={styles.textInput}
          clearButtonMode="while-editing"
          placeholder={i18n.t('prodDetailOp:search')}
          onChangeText={(val: string) => {
            setSearchWord(val);
          }}
          value={searchWord}
        />
        {searchWord !== '' && (
          <Fragment>
            <AppSvgIcon name="clear" onPress={() => setSearchWord('')} />
            <View style={styles.searchDivider} />
          </Fragment>
        )}
        <AppIcon
          name="btnSearchOn"
          style={{
            marginRight: 15,
          }}
        />
      </View>

      <View style={styles.divider} />

      <FlatList
        data={data}
        renderItem={renderItem}
        extraData={[toggleIndex, searchWord]}
        ListEmptyComponent={empty}
      />
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackBar(false)}
        textMessage={i18n.t('prodDetailOp:copyApn')}
      />
    </SafeAreaView>
  );
};

export default ProductDetailOpScreen;
