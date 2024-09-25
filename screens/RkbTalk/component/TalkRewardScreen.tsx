import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
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

const styles = StyleSheet.create({
  modalButtonTitle: {
    ...appStyles.medium18,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
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
        <AppBackButton title={i18n.t('talk:authGateway:title')} />
      </View>
      <View style={{paddingHorizontal: 20, flex: 1}}>
        <View
          style={{
            height: 92,
            marginTop: 50,
            width: '100%',
          }}>
          <AppStyledText
            text={i18n.t('talk:reward:title')}
            textStyle={[appStyles.bold22Text, {color: colors.black}]}
            format={{b: {color: colors.redBold}}}
          />

          <View style={{marginTop: 30}}>
            <AppStyledText
              text={i18n.t('talk:reward:body')}
              textStyle={[appStyles.normal16Text, {color: colors.black}]}
              format={{b: [appStyles.bold16Text, {color: colors.redBold}]}}
            />
          </View>
        </View>

        <AppText
          style={{
            backgroundColor: 'red',
            marginTop: 100,
            alignContent: 'center',
          }}>
          아이콘 위치
        </AppText>
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
