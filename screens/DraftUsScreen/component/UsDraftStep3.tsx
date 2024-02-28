import {ScrollView} from 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import ProductDetailRender from '@/screens/CancelOrderScreen/component/ProductDetailRender';
import i18n from '@/utils/i18n';
import {DeviceDataType} from '..';
import GuideBox from '@/screens/CancelOrderScreen/component/GuideBox';
import FloatCheckButton from '@/screens/CancelOrderScreen/component/FloatCheckButton';
import AppSvgIcon from '@/components/AppSvgIcon';
import moment from 'moment';
import {ProdInfo} from '@/redux/api/productApi';
import {ProductModelState} from '@/redux/modules/product';
import {OrderItemType} from '@/redux/api/orderApi';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  proudctFrame: {
    paddingHorizontal: 0,
  },
  product: {
    marginBottom: 40,
  },
  bodyFrame: {
    borderTopWidth: 1,
    borderColor: colors.whiteFive,
    paddingVertical: 24,
  },
});

interface UsDraftStep3Props {
  actDate: string;
  deviceData: DeviceDataType;
  checked: boolean;
  setChecked: (val: boolean) => void;
  product: ProductModelState;
  orderItems: OrderItemType[];
}

const UsDraftStep3: React.FC<UsDraftStep3Props> = ({
  actDate,
  deviceData,
  checked,
  setChecked,
  orderItems,
  product,
}) => {
  const scrollRef = useRef(null);

  const onCheck = useCallback(() => {
    if (!checked) scrollRef?.current.scrollToEnd();

    setChecked((prev) => !prev);
  }, [checked, setChecked]);

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
      <ScrollView ref={scrollRef} style={styles.container}>
        <View style={{marginVertical: 24}}>
          <AppText style={appStyles.bold20Text}>
            {i18n.t('us:result:title')}
          </AppText>
          <View style={styles.proudctFrame}>
            <ProductDetailRender
              style={styles.product}
              orderItems={orderItems}
              isHeader={false}
              isBody
              bodyComponent={
                <View style={styles.bodyFrame}>
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
                      {moment(actDate).format('YYYY년 MM월 DD일')}
                    </AppText>
                  </View>

                  <View style={{marginTop: 16, gap: 6}}>
                    <AppText
                      style={[appStyles.extraBold12, {color: colors.greyish}]}>
                      {i18n.t('us:deviceInfo')}
                    </AppText>
                    {['eid', 'imei2'].map((r) => (
                      <View>
                        <AppText
                          style={[
                            appStyles.bold14Text,
                            {color: colors.greyish},
                          ]}>
                          {i18n.t(`us:${r}`)}
                        </AppText>
                        <AppText
                          style={[
                            appStyles.semiBold16Text,
                            {color: colors.black},
                          ]}>
                          {r === 'eid' ? deviceData.eid : deviceData.imei2}
                        </AppText>
                      </View>
                    ))}
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

export default UsDraftStep3;
