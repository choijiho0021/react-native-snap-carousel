import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppStyledText from '@/components/AppStyledText';
import i18n from '@/utils/i18n';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import AppButton from '@/components/AppButton';
import {RouteProp} from '@react-navigation/native';
import {goBack, HomeStackParamList} from '@/navigation/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {bindActionCreators, RootState} from 'redux';
import AppBackButton from '@/components/AppBackButton';
import {API} from '@/redux/api';
import AppAlert from '@/components/AppAlert';
import LinearGradient from 'react-native-linear-gradient';
import Lottie from 'lottie-react-native';

const styles = StyleSheet.create({
  modalButtonTitle: {
    ...appStyles.medium18,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },

  buttonContainer: {
    flex: 1.0,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    width: '95%',
    margin: 2,
    borderRadius: 20,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
});

type TalkRewardScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'TalkReward'
>;

type TalkRewardScreenRouteProp = RouteProp<HomeStackParamList, 'TalkReward'>;

type TalkRewardScreenProps = {
  navigation: TalkRewardScreenNavigationProp;
  route: TalkRewardScreenRouteProp;
  account: AccountModelState;

  actions: {
    account: AccountAction;
  };
};

const TalkRewardScreen: React.FC<TalkRewardScreenProps> = ({
  navigation,
  account: {iccid, token, mobile},
  route,
}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flexDirection: 'row',
          height: 56,
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <AppBackButton />
      </View>
      <View style={{paddingHorizontal: 20, flex: 1}}>
        <View
          style={{
            height: 92,
            marginTop: 50,
            width: '100%',
            // backgroundColor: 'red',
            alignItems: 'center',
          }}>
          <AppText style={[appStyles.semiBold16Text]}>
            {i18n.t('talk:reward:header')}
          </AppText>
          {/* <LinearGradient
            colors={['#00d1ff', '#00ed42']}
            start={{x: 0.0, y: 1.0}}
            end={{x: 1.0, y: 1.0}}
            style={styles.grediant}>
          </LinearGradient> */}

          {/* <AppStyledText
            text={i18n.t('talk:reward:title')}
            textStyle={[appStyles.bold22Text, {color: colors.black}]}
            format={{b: {color: colors.redBold}}}
          /> */}

          <View style={{marginTop: 16}}>
            <AppStyledText
              text={i18n.t('talk:reward:body1')}
              textStyle={[appStyles.bold30Text, {color: colors.black}]}
              format={{b: [{color: colors.clearBlue}]}}
            />
          </View>
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 64,
            zIndex: 100,
          }}>
          <Lottie
            style={{
              width: 180,
              height: 160,
            }}
            autoPlay
            loop
            source={require('@/assets/animation/RkbCharacter.json')}
          />
        </View>

        <View
          style={{height: 242, marginHorizontal: -20, position: 'relative'}}>
          <LinearGradient
            colors={['#e5f1f6', '#ffffff']}
            start={{x: 0.0, y: 0.0}}
            end={{x: 0.0, y: 1.0}}
            style={{flex: 1, zIndex: 1}}></LinearGradient>
        </View>
      </View>

      <View style={{paddingHorizontal: 20, gap: 2}}>
        {Array.from({length: 3}, (_, idx) => {
          return <AppText>{i18n.t(`talk:reward:info${idx + 1}`)}</AppText>;
        })}
      </View>
      <View style={{marginTop: 20}}>
        <AppButton
          style={{
            height: 52,
            backgroundColor: colors.clearBlue,
          }}
          type="primary"
          onPress={() => {
            // 첫 리워드 API 호출
            // 특정 코드일 경우 alert 출력
            if (token && mobile) {
              API.TalkApi.patchTalkPoint({
                mobile,
                token,
                sign: 'reward',
              }).then((rsp) => {
                console.log('@@@ rsp : ', rsp);

                if (rsp?.result === 0) {
                  navigation.navigate('RkbTalk');
                } else AppAlert.info(i18n.t('talk:reward:error'));
              });
            }
          }}
          title={i18n.t('talk:reward:btn')}
          titleStyle={[styles.modalButtonTitle]}
        />
        <AppButton
          style={{
            height: 52,
            backgroundColor: colors.white,
          }}
          onPress={() => {
            goBack(navigation, route);
          }}
          title={i18n.t('talk:reward:btn2')}
          titleStyle={[styles.modalButtonTitle, {color: colors.gray02}]}
        />
      </View>
    </SafeAreaView>
  );
};

// export default memo(TalkRewardScreen);

export default connect(
  ({account}: RootState) => ({account}),
  (dispatch) => ({
    actions: {
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(TalkRewardScreen);
