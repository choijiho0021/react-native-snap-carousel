import {ScrollView} from 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RkbOrder} from '@/redux/api/orderApi';
import ProductDetailList from '@/screens/CancelOrderScreen/component/ProductDetailList';
import i18n from '@/utils/i18n';
import {DeviceDataType, UsProdDesc} from '..';
import GuideBox from '@/screens/CancelOrderScreen/component/GuideBox';
import FloatCheckButton from '@/screens/CancelOrderScreen/component/FloatCheckButton';
import AppSvgIcon from '@/components/AppSvgIcon';
import moment from 'moment';

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

interface UsDraftResultPageProps {
  prods: UsProdDesc;
  draftOrder: RkbOrder;
  onClick: () => void;
  actDate: string;
  deviceData: DeviceDataType;
}

const UsDraftResultPage: React.FC<UsDraftResultPageProps> = ({
  prods,
  draftOrder,
  onClick,
  actDate,
  deviceData,
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
      <ScrollView ref={scrollRef} style={styles.container}>
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
                      {moment(actDate).format('YYYY년 MM월 MM일')}
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

export default UsDraftResultPage;
