import {useNavigation, useRoute} from '@react-navigation/native';
import {RootState} from '@reduxjs/toolkit';
import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import Profile from '@/components/Profile';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import i18n from '@/utils/i18n';
import {navigate} from '@/navigation/navigation';
import AppIcon from '@/components/AppIcon';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppStyledText from '@/components/AppStyledText';
import AppSvgIcon from '@/components/AppSvgIcon';

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
    marginTop: 32,
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
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 3,
    height: 40,
    justifyContent: 'center',
  },
  btnInvite: {
    marginTop: 15,
    marginHorizontal: 20,
    backgroundColor: colors.clearBlue,
    overflow: 'hidden',
    borderRadius: 3,
  },
  btnIdCheck: {
    marginHorizontal: 7.5,
    flex: 1,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 3,
    height: 40,
    justifyContent: 'center',
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
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 12.5,
  },
  inviteText: {
    ...appStyles.normal17,
    color: 'white',
  },
  currenty: {
    // fontFamily: 'AppleSDGothicNeo',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'right',
    color: 'white',
  },
  currencyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
});

type InfoProps = {
  account: AccountModelState;
  onChangePhoto: () => void;
};

const Info: React.FC<InfoProps> = ({account: {balance}, onChangePhoto}) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={{marginBottom: 10}}>
      <Profile onChangePhoto={onChangePhoto} />
      <Pressable
        style={styles.rechargeBox}
        onPress={() =>
          esimGlobal
            ? navigation.navigate('Recharge')
            : navigation.navigate('CashHistory')
        }>
        <View style={styles.rechargeText}>
          <View>
            <AppText style={[appStyles.normal14Text, {color: 'white'}]}>
              {i18n.t('acc:remain')}
            </AppText>
            <View style={styles.currencyBox}>
              <AppText
                style={[
                  appStyles.robotoSemiBold22Text,
                  {color: 'white', letterSpacing: 0, marginRight: 4},
                ]}>
                {utils.numberToCommaString(balance || 0)}
                <AppText style={styles.currenty}>
                  {i18n.t(esimCurrency)}
                </AppText>
              </AppText>
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
        <AppButton
          title={i18n.t('contact:board')}
          style={styles.btnContactBoard}
          titleStyle={appStyles.normal16Text}
          type="secondary"
          onPress={() =>
            navigate(navigation, route, 'MyPageStack', {
              tab: 'HomeStack',
              screen: 'ContactBoard',
              params: {index: 1},
            })
          }
        />
        <AppButton
          style={styles.btnIdCheck}
          onPress={() =>
            navigate(navigation, route, 'MyPageStack', {
              tab: 'HomeStack',
              screen: 'Contact',
            })
          }
          titleStyle={appStyles.normal16Text}
          title={i18n.t('contact:title')}
          type="secondary"
        />
      </View>
      {!esimGlobal && (
        <Pressable
          style={styles.btnInvite}
          onPress={() =>
            navigate(navigation, route, 'MyPageStack', {
              tab: 'HomeStack',
              screen: 'Invite',
            })
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
      <View style={styles.divider} />
      <AppText style={styles.subTitle}>{i18n.t('acc:purchaseHistory')}</AppText>
      <View style={styles.dividerSmall} />
    </View>
  );
};

export default connect(({account}: RootState) => ({account}))(memo(Info));
