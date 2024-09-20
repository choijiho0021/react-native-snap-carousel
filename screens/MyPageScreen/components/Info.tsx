import {useNavigation, useRoute} from '@react-navigation/native';
import {RootState} from '@reduxjs/toolkit';
import React, {memo, useCallback} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import Profile from '@/components/Profile';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {AccountModelState} from '@/redux/modules/account';
import i18n from '@/utils/i18n';
import {HomeStackParamList, navigate} from '@/navigation/navigation';
import AppIcon from '@/components/AppIcon';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppStyledText from '@/components/AppStyledText';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppPrice from '@/components/AppPrice';

const {esimCurrency, esimGlobal} = Env.get();

const styles = StyleSheet.create({
  dividerSmall: {
    borderBottomWidth: 1,
    margin: 20,
    marginBottom: 0,
    borderBottomColor: colors.black,
  },
  divider: {
    height: 10,
    marginTop: 20,
    backgroundColor: colors.whiteTwo,
  },
  subTitle: {
    ...appStyles.bold18Text,
    fontSize: isDeviceSize('medium') ? 18 : 20,
    marginTop: 40,
    marginLeft: 20,
    color: colors.black,
  },
  btnContactBoard: {
    marginHorizontal: 7.5,
    flex: 1,
    height: 72,
    justifyContent: 'center',
  },
  btnInvite: {
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: colors.clearBlue,
    overflow: 'hidden',
    borderRadius: 3,
  },
  rechargeBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: colors.clearBlue,
    height: 94,
    borderRadius: 3,
  },
  rechargeText: {
    margin: 27,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
  },
  rchBtn: {
    marginLeft: 10,
    width: 80,
    height: 40,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  rowBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 12.5,
  },
  inviteText: {
    ...appStyles.normal17,
    color: 'white',
  },
  currency: {
    // fontFamily: 'AppleSDGothicNeo',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'right',
    color: 'white',
    marginRight: 4,
  },
  currencyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  balanceStyle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    color: 'white',
    marginRight: 0,
  },
  btnStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const btnList = [
  {
    icon: 'mycoupon',
    title: 'mypage:coupon',
    tab: 'MyPageStack',
    screen: 'Coupon',
  },
  {
    icon: 'contact121',
    title: 'contact:board',
    tab: 'HomeStack',
    screen: 'ContactBoard',
  },
  {
    icon: 'iconGift',
    title: 'contact:event',
    tab: 'HomeStack',
    screen: 'EventBoard',
  },
];

type InfoNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'MyEventList'
>;

type InfoProps = {
  account: AccountModelState;
  onChangePhoto: () => void;
};

const Info: React.FC<InfoProps> = ({
  account: {balance, coupon},
  onChangePhoto,
}) => {
  const navigation = useNavigation<InfoNavigationProp>();
  const route = useRoute();

  const btnListTitle = useCallback(
    (icon: string, title: any) => {
      return coupon?.length && icon === 'mycoupon' ? (
        <>
          <AppText style={{...appStyles.bold16Text, marginRight: 4}}>
            {i18n.t(title)}
          </AppText>
          {coupon?.length > 0 && (
            <AppText style={{...appStyles.bold16Text, color: colors.redError}}>
              {` ${coupon?.length}`}
            </AppText>
          )}
        </>
      ) : (
        i18n.t(title)
      );
    },
    [coupon?.length],
  );

  return (
    <View style={{marginBottom: 10}}>
      <Profile onChangePhoto={onChangePhoto} />
      <Pressable
        style={styles.rechargeBox}
        onPress={() =>
          navigation.navigate(esimGlobal ? 'Recharge' : 'CashHistory')
        }>
        <View style={styles.rechargeText}>
          <View>
            <AppText style={[appStyles.normal14Text, {color: 'white'}]}>
              {i18n.t('acc:remain')}
            </AppText>
            <View style={styles.currencyBox}>
              <AppPrice
                price={{value: balance || 0, currency: esimCurrency}}
                balanceStyle={styles.balanceStyle}
                currencyStyle={styles.currency}
              />
              <AppSvgIcon name="arrowRight" />
            </View>
          </View>
          <AppButton
            title={i18n.t('acc:goRecharge')}
            titleStyle={[appStyles.normal14Text, {color: colors.black}]}
            style={styles.rchBtn}
            onPress={() => navigation.navigate('Recharge')}
            type="primary"
          />
        </View>
      </Pressable>

      <View style={styles.rowBtn}>
        {btnList.map(({icon, title, tab, screen}) => (
          <AppButton
            key={title}
            iconName={icon}
            title={btnListTitle(icon, title)}
            style={styles.btnContactBoard}
            titleStyle={[appStyles.bold16Text, {marginTop: 8}]}
            viewStyle={styles.btnStyle}
            type="secondary"
            onPress={() =>
              navigate(navigation, route, 'MyPageStack', {
                tab,
                screen,
                params: {index: 1},
              })
            }
          />
        ))}
      </View>
      <View style={styles.divider} />
      {!esimGlobal && (
        <Pressable
          style={styles.btnInvite}
          onPress={() =>
            navigation.navigate('MyPageStack', {screen: 'Invite'})
          }>
          <AppIcon name="inviteBanner" />
          <View style={{position: 'absolute', left: 16, bottom: 20}}>
            <AppText
              style={{...appStyles.medium13, color: 'white', marginBottom: 3}}>
              {i18n.t('invite:btn-1')}
            </AppText>
            <AppStyledText
              textStyle={styles.inviteText}
              text={i18n.t('invite:btn-2')}
              format={{b: {fontWeight: 'bold'}}}
            />
          </View>
        </Pressable>
      )}
      <AppText style={styles.subTitle}>{i18n.t('acc:purchaseHistory')}</AppText>
      <View style={styles.dividerSmall} />
    </View>
  );
};

export default connect(({account}: RootState) => ({account}))(memo(Info));
