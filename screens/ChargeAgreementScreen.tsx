import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Pressable} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import TextWithDot from './EsimScreen/components/TextWithDot';
import ButtonWithPrice from './EsimScreen/components/ButtonWithPrice';
import {API} from '@/redux/api';
import {AccountModelState} from '@/redux/modules/account';
import SelectedProdTitle from './EventBoardScreen/components/SelectedProdTitle';
import AppStyledText from '@/components/AppStyledText';
import {sliderWidth} from '@/constants/SliderEntry.style';
import AppModalContent from '@/components/ModalContent/AppModalContent';
import ScreenHeader from '@/components/ScreenHeader';
import AppModal from '@/components/AppModal';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  chargeProd: {
    borderWidth: 2,
    borderColor: colors.clearBlue,
    borderRadius: 3,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 32,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  sticker: {
    backgroundColor: colors.clearBlue,
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    borderRadius: 100,
    width: 69,
    marginBottom: 16,
  },
  stickerText: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.white,
  },
  title: {
    ...appStyles.bold20Text,
    lineHeight: 24,
    marginBottom: 8,
  },
  expPeriodText: {
    ...appStyles.medium14,
    lineHeight: 22,
    color: colors.redError,
  },
  expPeriodTextBold: {
    ...appStyles.bold14Text,
    lineHeight: 22,
    color: colors.redError,
  },
  notice: {
    backgroundColor: colors.backGrey,
    paddingTop: 41,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  noticeTitle: {
    ...appStyles.bold18Text,
    lineHeight: 22,
  },
  noticeText: {
    ...appStyles.medium14,
    lineHeight: 22,
    color: colors.warmGrey,
  },
  noticeBold: {
    ...appStyles.bold14Text,
    lineHeight: 22,
    color: colors.warmGrey,
  },
  dot: {
    ...appStyles.bold14Text,
    marginHorizontal: 5,
    marginTop: 0,
    color: colors.warmGrey,
  },
  agreement: {
    marginBottom: 12,
    marginHorizontal: 8,
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.white,
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    width: sliderWidth - 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.whiteFive,
    borderRadius: 3,

    elevation: 12,
    shadowColor: 'rgb(166, 168, 172)',
    shadowRadius: 12,
    shadowOpacity: 0.9,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  agreementText: {
    marginRight: 40,
    ...appStyles.semiBold16Text,
    lineHeight: 20,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContent: {
    maginHorizontal: 20,
    width: '90%',
    paddingTop: 25,
    backgroundColor: 'white',
  },
  titleContent: {
    marginHorizontal: 30,
  },
  modalOkText: {
    borderRadius: 3,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 40,
    color: 'white',
    width: 120,
    height: 40,
    marginRight: 18,
  },
  modalText: {
    ...appStyles.semiBold16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.black,
  },
  modalCloseStyle: {color: colors.black, marginRight: 108},
});

type ChargeAgreementScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ChargeAgreement'
>;

type ChargeAgreementScreenProps = {
  navigation: ChargeAgreementScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'ChargeAgreement'>;
  account: AccountModelState;
  action: {
    cart: CartAction;
    modal: ModalAction;
  };
};

const ChargeAgreementScreen: React.FC<ChargeAgreementScreenProps> = ({
  navigation,
  route: {params},
  account,
  action,
}) => {
  const contents = useMemo(() => params.contents, [params.contents]);
  const usagePeriod = params?.usagePeriod;
  const purchaseItems = useMemo(
    () =>
      params?.addOnProd
        ? [
            API.Product.toPurchaseAddOnItem(
              params.mainSubs.key,
              params.addOnProd,
            ),
          ]
        : [API.Product.toPurchaseItem(params?.extensionProd)],
    [params?.addOnProd, params?.extensionProd, params?.mainSubs.key],
  );
  const expPeriod = useMemo(() => moment().add(180, 'day'), []);
  const [isPressed, setIsPressed] = useState(false);
  const [visible, setVisible] = useState<string>('');

  const onPurchase = useCallback(() => {
    if (isPressed) {
      const {balance} = account;
      // 구매 품목을 갱신한다.
      action.cart.purchase({
        purchaseItems,
        balance,
        esimIccid: params.mainSubs.subsIccid,
        mainSubsId: params.mainSubs.nid,
      });

      navigation.navigate('PymMethod', {mode: 'roaming_product'});
    } else {
      action.modal.renderModal(() => (
        <AppModalContent
          type="info"
          onOkClose={() => {
            action.modal.closeModal();
          }}>
          <View style={{marginLeft: 30}}>
            <AppText style={styles.modalText}>
              {i18n.t('esim:charge:agreement:check')}
            </AppText>
          </View>
        </AppModalContent>
      ));
    }
  }, [
    account,
    action.cart,
    action.modal,
    isPressed,
    navigation,
    params.mainSubs,
    purchaseItems,
  ]);

  const onPressBtnPurchase = useCallback(() => {
    onPurchase();
  }, [onPurchase]);

  const renderModal = useCallback(() => {
    const isWarning = visible === 'esim:charge:time:warning';

    const navigateEsim = () => {
      navigation.popToTop();
      navigation.navigate('EsimStack', {screen: 'Esim'});
    };

    return (
      <AppModal
        onCancelClose={() => {
          setVisible('');
          navigateEsim();
        }}
        type={isWarning ? 'normal' : 'info'}
        onOkClose={() => {
          // 결제 이어서 진행하기
          setVisible('');
          if (!isWarning) navigateEsim();
          else {
            onPurchase();
          }
        }}
        contentStyle={styles.modalContent}
        titleStyle={styles.titleContent}
        visible={visible !== ''}
        buttonBackgroundColor={colors.clearBlue}
        cancelButtonTitle={i18n.t('no')}
        cancelButtonStyle={styles.modalCloseStyle}
        okButtonTitle={i18n.t(isWarning ? 'esim:charge:yes' : 'ok')}
        okButtonStyle={styles.modalOkText}>
        <View style={{marginHorizontal: 30}}>
          <AppStyledText
            text={i18n.t(visible)}
            textStyle={[
              appStyles.medium16,
              {color: colors.black, textAlignVertical: 'center'},
            ]}
            format={{
              red: [appStyles.bold16Text, {color: colors.redError}],
              b: appStyles.bold16Text,
            }}
            data={{date: usagePeriod?.period}}
          />
        </View>
      </AppModal>
    );
  }, [navigation, onPurchase, usagePeriod?.period, visible]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={params.title} />
      <View style={{position: 'relative', flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <SelectedProdTitle
            isdaily={params?.mainSubs?.daily === 'daily'}
            prodName={params?.mainSubs?.prodName || ''}
            isAddOn={!!params?.addOnProd}
          />

          <View style={styles.chargeProd}>
            <View style={styles.sticker}>
              <AppText style={styles.stickerText}>
                {i18n.t('esim:charge:selected:prod')}
              </AppText>
            </View>
            <AppText style={styles.title}>{contents.chargeProd}</AppText>
            <AppStyledText
              text={i18n.t(
                `esim:charge:${
                  params?.addOnProd
                    ? params?.status === 'R'
                      ? 'day'
                      : 'duration'
                    : 'expPeriod'
                }`,
              )}
              textStyle={styles.expPeriodText}
              format={{b: styles.expPeriodTextBold}}
              data={{
                period: usagePeriod
                  ? usagePeriod.period
                  : expPeriod.format('YYYY년 MM월 DD일'),
              }}
            />
          </View>
          <View style={styles.notice}>
            <View style={[styles.row, {marginBottom: 13}]}>
              <AppSvgIcon name="cautionRed" style={{marginRight: 8}} />
              <AppText style={styles.noticeTitle}>
                {contents.noticeTitle}
              </AppText>
            </View>
            <View style={{marginRight: 20}}>
              {contents.noticeBody.map((k) => (
                <TextWithDot
                  key={k}
                  text={k}
                  boldStyle={styles.noticeBold}
                  textStyle={styles.noticeText}
                  dotStyle={styles.dot}
                />
              ))}
            </View>
          </View>
        </ScrollView>
        <Pressable
          style={styles.agreement}
          onPress={() => setIsPressed((prev) => !prev)}>
          <AppSvgIcon
            name={isPressed ? 'afterCheck' : 'beforeCheck'}
            style={{marginRight: 12}}
          />
          <AppText style={styles.agreementText}>
            {i18n.t('esim:charge:agreement')}
          </AppText>
        </Pressable>
      </View>
      <View>
        <ButtonWithPrice
          amount={
            params.addOnProd?.price.split(' ')[0] ||
            params.extensionProd?.price.value.toString() ||
            '0'
          }
          currency={i18n.t('esim:charge:addOn:currency')}
          onPress={onPressBtnPurchase}
          disable={!isPressed}
          title={i18n.t('esim:charge:payment:agree')}
        />
      </View>
      {renderModal()}
    </SafeAreaView>
  );
};

export default connect(
  ({account}: RootState) => ({
    account,
  }),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(ChargeAgreementScreen);
