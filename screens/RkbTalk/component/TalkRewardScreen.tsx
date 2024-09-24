import React, {useCallback, useMemo, useState} from 'react';
import {Image, Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
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
import Env from '@/environment';
import AppButton from '@/components/AppButton';
import {RouteProp} from '@react-navigation/native';
import {goBack, HomeStackParamList} from '@/navigation/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {bindActionCreators, RootState} from 'redux';
import AppBackButton from '@/components/AppBackButton';
import {API} from '@/redux/api';
import AppAlert from '@/components/AppAlert';

const {isIOS} = Env.get();

const styles = StyleSheet.create({
  bodyBox: {
    position: 'absolute',
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderColor: colors.line,
    shadowColor: colors.black8,
    height: 272,
    bottom: 0,
    width: '100%',
  },
  storeBox: {
    position: 'absolute',
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderColor: colors.line,
    shadowColor: colors.black8,
    height: 480,
    bottom: 0,
    width: '100%',
  },
  modalClose: {
    justifyContent: 'center',
    // height: 56,
    alignItems: 'flex-end',
    width: 26,
    height: 26,
  },
  head: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 6,
  },
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
  const [isFirstReword, setIsFirstReward] = useState(0);

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
            text={'로깨비톡 런칭 기념\n<b>0,000 톡포인트</b>가 도착했어요.'}
            textStyle={[appStyles.bold22Text, {color: colors.black}]}
            format={{b: {color: colors.redBold}}}
          />

          <View style={{marginTop: 30}}>
            <AppStyledText
              text={
                '해외 여행 중에도 <b>30분간 무료 통화</b>에요!\n(한국 발신 기준)'
              }
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
                } else AppAlert.info('리워드 지급 대상이 아닙니다.');
              });
            }
          }}
          title={'지금 바로 톡포인트 받기'}
          titleStyle={[styles.modalButtonTitle]}
        />
        <AppButton
          style={{
            height: 52,
            backgroundColor: colors.white,
          }}
          onPress={() => {
            goBack(navgiation, route);
          }}
          title={'다음에 받기'}
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
