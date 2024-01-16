import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList, navigate} from '@/navigation/navigation';
import {AccountModelState} from '@/redux/modules/account';
import i18n from '@/utils/i18n';
import {OrderAction} from '@/redux/modules/order';
import {ProductModelState} from '@/redux/modules/product';
import AppIcon from '@/components/AppIcon';
import BackbuttonHandler from '@/components/BackbuttonHandler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  button: {
    ...appStyles.normal16Text,
    flex: 1,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: colors.white,
  },
  titleText: {
    ...appStyles.bold24Text,
    marginBottom: 16,
  },

  bodyText: {
    ...appStyles.normal16Text,
    lineHeight: 24,
  },
});

type DraftResultScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'DraftResult'
>;

type DraftResultScreenRouteProp = RouteProp<HomeStackParamList, 'DraftResult'>;

type DraftResultScreenProps = {
  navigation: DraftResultScreenNavigationProp;
  route: DraftResultScreenRouteProp;

  account: AccountModelState;
  product: ProductModelState;

  pending: boolean;

  action: {
    order: OrderAction;
  };
};

const DraftResultScreen: React.FC<DraftResultScreenProps> = ({
  navigation,
  route,
}) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // 완료창에서 뒤로가기 시 확인과 똑같이 처리한다.
  BackbuttonHandler({
    navigation,
    onBack: () => {
      // MyPage 재 클릭시 결과 창으로 복귀 방지
      navigation.popToTop();
      navigate(navigation, route, 'MyPageStack', {
        tab: 'EsimStack',
        screen: 'Esim',
      });
      return true;
    },
  });

  useEffect(() => {
    setIsSuccess(route?.params?.isSuccess);
  }, [route?.params]);

  const renderContent = useCallback(
    () => (
      <View>
        {isSuccess ? (
          <View>
            <AppText style={styles.titleText}>
              {i18n.t('his:draftSuccessTitle')}
            </AppText>
            <AppText style={styles.bodyText}>
              {i18n.t('his:draftSuccessText1')}
            </AppText>
            <AppText style={styles.bodyText}>
              {i18n.t('his:draftSuccessText2')}
            </AppText>
          </View>
        ) : (
          <View>
            <AppText style={styles.titleText}>
              {i18n.t('his:draftFailTitle')}
            </AppText>
            <AppText style={styles.bodyText}>
              {i18n.t('his:draftFailText')}
            </AppText>
          </View>
        )}
      </View>
    ),
    [isSuccess],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginHorizontal: 20, flex: 1}}>
        {renderContent()}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 100,
          }}>
          {isSuccess ? (
            <AppIcon name="goods" size={252} />
          ) : (
            <AppIcon name="goodsError" size={252} />
          )}
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <AppButton
          style={styles.button}
          type="primary"
          title={i18n.t(
            isSuccess ? 'his:draftSuccessButton' : 'his:draftFailButton',
          )}
          onPress={() => {
            // MyPage 재 클릭시 결과 창으로 복귀 방지
            navigation.popToTop();
            navigate(navigation, route, 'MyPageStack', {
              tab: 'EsimStack',
              screen: 'Esim',
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default DraftResultScreen;
