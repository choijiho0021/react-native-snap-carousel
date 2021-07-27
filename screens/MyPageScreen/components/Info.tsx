import utils from '@/redux/api/utils';
import React, {memo} from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';
import AppButton from '@/components/AppButton';
import AppUserPic from '@/components/AppUserPic';
import LabelTextTouchable from '@/components/LabelTextTouchable';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {AccountModelState} from '@/redux/modules/account';
import AppIcon from '@/components/AppIcon';
import {useNavigation} from '@react-navigation/native';
import Env from '@/environment';

const {esimApp, esimGlobal} = Env.get();

const styles = StyleSheet.create({
  label: {
    ...appStyles.normal14Text,
    marginHorizontal: 20,
    color: colors.warmGrey,
  },
  value: {
    ...appStyles.roboto16Text,
    marginLeft: 20,
    maxWidth: '100%',
    lineHeight: 40,
    color: colors.black,
  },
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
    marginRight: 20,
    marginLeft: esimApp ? 3 : 20,
    flex: 1,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 3,
    height: esimApp ? 40 : 30,
    justifyContent: 'center',
  },
  btnIdCheck: {
    marginLeft: 20,
    marginRight: 3,
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
    height: 130,
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
    width: 80,
    height: 40,
    borderRadius: 3,
    backgroundColor: colors.clearBlue,
  },
});

type InfoProps = {
  account: AccountModelState;
  onChangePhoto: () => void;
  onPress: (v: 'id' | 'email') => void;
};

const Info: React.FC<InfoProps> = ({
  account: {mobile, email, userPictureUrl, balance},
  onChangePhoto,
  onPress,
}) => {
  const navigation = useNavigation();
  const userPicture = {
    width: 76,
    height: 76,
    borderRadius: 76 / 2,
  };

  return (
    <View style={{marginBottom: 10}}>
      <View
        style={{
          marginTop: 35,
          flex: 1,
          flexDirection: 'row',
          marginLeft: 20,
          height: 76,
          marginBottom: 30,
        }}>
        <Pressable
          style={{flex: 1, alignSelf: 'center'}}
          onPress={onChangePhoto}>
          <AppUserPic
            url={userPictureUrl}
            icon="imgPeopleL"
            style={userPicture}
            onPress={onChangePhoto}
          />
          <AppIcon
            name="imgPeoplePlus"
            style={{bottom: 20, right: -29, alignSelf: 'center'}}
          />
        </Pressable>
        <View style={{flex: 3, justifyContent: 'center'}}>
          <Text style={styles.label}>{utils.toPhoneNumber(mobile)}</Text>
          <LabelTextTouchable
            key="email"
            label={email}
            labelStyle={styles.value}
            value=""
            arrowStyle={{paddingRight: 20}}
            onPress={() => onPress('email')}
            arrow="iconArrowRight"
          />
        </View>
      </View>
      {esimApp && (
        <Pressable
          style={styles.rechargeBox}
          onPress={() => navigation.navigate('Recharge')}>
          <ImageBackground
            source={require('../assets/images/esim/card.png')}
            style={styles.image}>
            <View style={styles.rechargeText}>
              <View style={{flexDirection: 'column'}}>
                <Text style={[appStyles.normal14Text, {marginBottom: 10}]}>
                  {i18n.t('acc:remain')}
                </Text>
                <Text style={appStyles.bold30Text}>
                  {utils.price(
                    utils.toCurrency(balance || 0, esimGlobal ? 'USD' : 'KRW'),
                  )}
                </Text>
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

      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        {esimApp && (
          <Pressable style={styles.btnIdCheck} onPress={() => onPress('id')}>
            <Text style={[appStyles.normal16Text, {textAlign: 'center'}]}>
              {i18n.t('mypage:idCheckTitle')}
            </Text>
          </Pressable>
        )}
        <Pressable
          style={styles.btnContactBoard}
          onPress={() => navigation.navigate('ContactBoard', {index: 1})}>
          <Text style={[appStyles.normal16Text, {textAlign: 'center'}]}>
            {i18n.t('board:mylist')}
          </Text>
        </Pressable>
      </View>
      <View style={styles.divider} />
      <Text style={styles.subTitle}>{i18n.t('acc:purchaseHistory')}</Text>
      <View style={styles.dividerSmall} />
    </View>
  );
};

export default connect(({account}: RootState) => ({account}))(memo(Info));
