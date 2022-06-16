import {useNavigation, useRoute} from '@react-navigation/native';
import {RootState} from '@reduxjs/toolkit';
import React, {memo} from 'react';
import {ImageBackground, Pressable, StyleSheet, View} from 'react-native';
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

const {esimApp, esimCurrency} = Env.get();

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
    height: esimApp ? 40 : 30,
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
    height: 108,
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  rechargeText: {
    margin: 27,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rchBtn: {
    marginLeft: 10,
    width: 80,
    height: 40,
    borderRadius: 3,
    backgroundColor: colors.clearBlue,
  },
  rowBtn: {
    flex: 1,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 12.5,
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
      {esimApp && (
        <Pressable
          style={styles.rechargeBox}
          onPress={() => navigation.navigate('Recharge')}>
          <ImageBackground
            source={require('../assets/images/esim/card.png')}
            style={styles.image}>
            <View style={styles.rechargeText}>
              <View style={{flexDirection: 'column', flex: 9}}>
                <AppText style={[appStyles.normal14Text, {paddingBottom: 10}]}>
                  {i18n.t('acc:remain')}
                </AppText>
                <AppText style={[appStyles.bold30Text, {paddingTop: 10}]}>
                  {utils.numberToCommaString(balance || 0)}
                  <AppText
                    style={[appStyles.normal20Text, {fontWeight: 'normal'}]}>
                    {i18n.t(esimCurrency)}
                  </AppText>
                </AppText>
              </View>
              <AppButton
                title={i18n.t('acc:goRecharge')}
                titleStyle={[appStyles.normal14Text, {color: colors.white}]}
                style={styles.rchBtn}
                onPress={() => navigation.navigate('Recharge')}
              />
            </View>
          </ImageBackground>
        </Pressable>
      )}

      <View style={styles.rowBtn}>
        <Pressable
          style={styles.btnContactBoard}
          onPress={() =>
            navigate(navigation, route, 'MyPageStack', {
              tab: 'HomeStack',
              screen: 'ContactBoard',
              params: {index: 1},
            })
          }>
          <AppText style={[appStyles.normal16Text, {textAlign: 'center'}]}>
            {i18n.t('board:mylist')}
          </AppText>
        </Pressable>
        {esimApp && (
          <Pressable
            style={styles.btnIdCheck}
            onPress={() =>
              navigate(navigation, route, 'MyPageStack', {
                tab: 'HomeStack',
                screen: 'Contact',
              })
            }>
            <AppText style={[appStyles.normal16Text, {textAlign: 'center'}]}>
              {i18n.t('contact:title')}
            </AppText>
          </Pressable>
        )}
      </View>
      <AppButton
        iconName="inviteBanner"
        style={styles.btnInvite}
        onPress={() =>
          navigate(navigation, route, 'MyPageStack', {
            tab: 'HomeStack',
            screen: 'Invite',
          })
        }
      />
      <View style={styles.divider} />
      <AppText style={styles.subTitle}>{i18n.t('acc:purchaseHistory')}</AppText>
      <View style={styles.dividerSmall} />
    </View>
  );
};

export default connect(({account}: RootState) => ({account}))(memo(Info));
