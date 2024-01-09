import React, {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import AppSvgIcon from '@/components/AppSvgIcon';
import {Currency, RkbProdByCountry} from '@/redux/api/productApi';
import {API} from '@/redux/api';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import i18n from '@/utils/i18n';
import Env from '@/environment';
import AppText from '@/components/AppText';

import {ProductModelState, getDiscountRate} from '@/redux/modules/product';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {LocaleConfig} from 'react-native-calendars';
import AppIcon from '@/components/AppIcon';

const styles = StyleSheet.create({
  DateBoxBtnFrame: {
    padding: 16,
    gap: 8,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

type DraftDateInputPageProps = {
  onClick: (val: boolean) => void;
};

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const DraftDateInputPage: React.FC<DraftDateInputPageProps> = ({onClick}) => {
  return (
    <>
      <View style={{paddingHorizontal: 20, flex: 1}}>
        <View style={{marginVertical: 24, width: '50%'}}>
          <AppText style={appStyles.bold24Text}>
            {i18n.t('us:step1:title')}
          </AppText>
        </View>
        <View style={{gap: 8}}>
          <AppText style={[appStyles.normal14Text, {color: colors.greyish}]}>
            {i18n.t('us:date:text')}
          </AppText>

          <Pressable
            style={styles.DateBoxBtnFrame}
            onPress={() => {
              console.log('@@@ onPress 클릭');
              onClick(true);
              //   setShowPicker(true);
            }}>
            <AppText style={[appStyles.normal16Text, {color: colors.greyish}]}>
              {i18n.t('us:date:placeHolder')}
            </AppText>
            <AppIcon
              style={{alignSelf: 'center', justifyContent: 'center'}}
              name="iconCalendar"
            />
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default connect(({product}: RootState) => ({
  product,
}))(DraftDateInputPage);
