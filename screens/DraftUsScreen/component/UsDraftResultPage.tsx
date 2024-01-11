import {ScrollView} from 'react-native-gesture-handler';
import {Platform, StyleSheet, View} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import AppButton from '@/components/AppButton';
import AppNotiBox from '@/components/AppNotiBox';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RkbOrder} from '@/redux/api/orderApi';
import {getCountItems} from '@/redux/modules/order';
import ProductDetailList from '@/screens/CancelOrderScreen/component/ProductDetailList';
import i18n from '@/utils/i18n';
import {UsProdDesc} from '..';
import GuideBox from '@/screens/CancelOrderScreen/component/GuideBox';
import FloatCheckButton from '@/screens/CancelOrderScreen/component/FloatCheckButton';
import AppSvgIcon from '@/components/AppSvgIcon';

const styles = StyleSheet.create({
  buttonFrame: {flexDirection: 'row'},
  button: {
    ...appStyles.normal16Text,
    flex: 1,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: colors.white,
  },
  proudctFrame: {
    paddingHorizontal: 0,
  },
  product: {
    marginBottom: 40,
  },
});

interface UsDraftResultPageProps {
  prods: UsProdDesc;
  draftOrder: RkbOrder;
  onClick: () => void;
}

const UsDraftResultPage: React.FC<UsDraftResultPageProps> = ({
  prods,
  draftOrder,
  onClick,
}) => {
  const scrollRef = useRef(null);
  const [checked, setChecked] = useState<boolean>(false);

  const onCheck = useCallback(() => {
    if (!checked) scrollRef?.current.scrollToEnd();

    setChecked((prev) => !prev);
  }, [checked]);

  const renderCheckButton = useCallback(() => {
    return (
      <FloatCheckButton
        onCheck={onCheck}
        checkText={i18n.t('his:draftAgree')}
        checked={checked}
      />
    );
  }, [checked, onCheck]);

  return (
    <>
      <ScrollView ref={scrollRef} style={{paddingHorizontal: 20, flex: 1}}>
        <View style={{marginVertical: 24}}>
          <AppText style={appStyles.bold20Text}>
            {i18n.t('us:result:title')}
          </AppText>
          <View style={styles.proudctFrame}>
            <ProductDetailList
              style={styles.product}
              prods={prods}
              isHeader={false}
              isBody
              bodyComponent={
                <View
                  style={{
                    borderTopWidth: 1,
                    borderColor: colors.whiteFive,
                    paddingVertical: 24,
                  }}>
                  <View style={{gap: 4, flexDirection: 'row'}}>
                    <AppText style={[appStyles.bold16Text, {lineHeight: 24}]}>
                      {i18n.t('us:req')}
                    </AppText>
                    <AppSvgIcon name="star" />
                  </View>
                  <View style={{gap: 6, marginTop: 10}}>
                    <AppText
                      style={[appStyles.extraBold12, {color: colors.greyish}]}>
                      {i18n.t('us:actDate')}
                    </AppText>
                    <AppText
                      style={[
                        appStyles.semiBold16Text,
                        {color: colors.black, lineHeight: 24},
                      ]}>
                      {'2023년 3월 14일'}
                    </AppText>
                  </View>

                  <View style={{marginTop: 16, gap: 6}}>
                    <AppText
                      style={[appStyles.extraBold12, {color: colors.greyish}]}>
                      {i18n.t('us:deviceInfo')}
                    </AppText>
                    <View>
                      <AppText
                        style={[appStyles.bold14Text, {color: colors.greyish}]}>
                        {i18n.t('us:eid')}
                      </AppText>
                      <AppText
                        style={[
                          appStyles.semiBold16Text,
                          {color: colors.black},
                        ]}>
                        {'123124123123213'}
                      </AppText>
                    </View>
                    <View>
                      <AppText
                        style={[appStyles.bold14Text, {color: colors.greyish}]}>
                        {i18n.t('us:imei2')}
                      </AppText>
                      <AppText
                        style={[
                          appStyles.semiBold16Text,
                          {color: colors.black},
                        ]}>
                        {'00 00000 00000 0'}
                      </AppText>
                    </View>
                  </View>
                </View>
              }
            />
          </View>
          <View>
            <GuideBox
              iconName="bannerMark"
              title={i18n.t('us:draftCheckNotiTitle')}
              body={i18n.t('us:draftCheckNotiBody')}
            />
          </View>
        </View>
      </ScrollView>
      <View>{renderCheckButton()}</View>
    </>
  );
};

export default UsDraftResultPage;
