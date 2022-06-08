import {useNavigation} from '@react-navigation/native';
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
    marginTop: 40,
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
    marginHorizontal: 7.5,
    backgroundColor: colors.blue,
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
  btnArrow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  newMark: {
    ...appStyles.bold14Text,
    color: colors.clearBlue,
    marginRight: 8,
  },
  rowBtn: {
    flex: 1,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  column: {
    flex: 1,
    marginHorizontal: 12.5,
    flexDirection: 'column',
  },
});

type InfoProps = {
  account: AccountModelState;
  onChangePhoto: () => void;
  onPress: (v: 'id' | 'email') => void;
};

const Info: React.FC<InfoProps> = ({
  account: {balance, userId},
  onChangePhoto,
  onPress,
}) => {
  const navigation = useNavigation();

  return (
    <View style={{marginBottom: 10}}>
      <Profile
        onChangePhoto={onChangePhoto}
        onPress={onPress}
        // icon="iconArrowRight"
      />
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

      <View style={styles.column}>
        <View style={styles.rowBtn}>
          {esimApp && (
            <Pressable style={styles.btnIdCheck} onPress={() => onPress('id')}>
              <AppText style={[appStyles.normal16Text, {textAlign: 'center'}]}>
                {/* {i18n.t('mypage:idCheckTitle')} */}
                {i18n.t('contact:faq')}
              </AppText>
            </Pressable>
          )}
          <Pressable
            style={styles.btnContactBoard}
            onPress={() => navigation.navigate('ContactBoard', {index: 1})}>
            <AppText style={[appStyles.normal16Text, {textAlign: 'center'}]}>
              {i18n.t('board:mylist')}
            </AppText>
          </Pressable>
        </View>
        <AppButton
          iconName="inviteBanner"
          style={styles.btnInvite}
          onPress={() => navigation.navigate('Invite')}
        />
      </View>
      <View style={styles.divider} />
      <AppText style={styles.subTitle}>{i18n.t('acc:purchaseHistory')}</AppText>
      <View style={styles.dividerSmall} />
    </View>
  );
};

export default connect(({account}: RootState) => ({account}))(memo(Info));
