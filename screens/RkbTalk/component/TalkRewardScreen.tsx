import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import AppIcon from '@/components/AppIcon';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import {utils} from '@/utils/utils';
import {TalkModelState} from '@/redux/modules/talk';
import api from '@/redux/api/api';

const BG_WIDTH = 972 + 318; // 972 이미지 너비, 318 margin 총합

const styles = StyleSheet.create({
  modalButtonTitle: {
    ...appStyles.normal18Text,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
    lineHeight: 26,
  },
  modalSubButtonTitle: {
    ...appStyles.semiBold16Text,
    color: colors.black,
    textAlign: 'center',
    width: '100%',
    lineHeight: 24,
  },
  lottieView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  linearGradient: {
    width: '100%',
    flex: 1,
    height: 200,
    zIndex: 1,
  },

  boxContainer: {
    marginTop: 64,
    backgroundColor: 'white',
    height: 80,
    marginHorizontal: 20,
    padding: 16,
    zIndex: 1000,
    elevation: 12,
    shadowColor: 'rgb(166, 168, 172)',
    shadowRadius: 12,
    shadowOpacity: 0.16,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  animatedView: {
    marginHorizontal: -20,
    bottom: 300,
    position: 'relative',
    width: BG_WIDTH,
  },

  titleContainer: {
    height: 100,
    marginTop: 50,
    width: '100%',
    zIndex: 1000,
    alignItems: 'center',
  },
  smallBoxContainer: {
    backgroundColor: 'white',
    height: 58,
    marginHorizontal: 20,
    elevation: 12,
    padding: 16,
    shadowColor: 'rgb(166, 168, 172)',
    shadowRadius: 12,
    shadowOpacity: 0.16,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  gradientBg: {
    height: 200,
    bottom: 300,
    marginHorizontal: -20,
    position: 'relative',
  },
  boxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  changeIcon: {
    width: 34,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBoxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  talk: TalkModelState;

  actions: {
    account: AccountAction;
    toast: ToastAction;
  };
};

const TalkRewardScreen: React.FC<TalkRewardScreenProps> = ({
  navigation,
  account: {iccid, token},
  talk: {reward},
  route,
  actions,
}) => {
  const translateX = useRef(new Animated.Value(0)).current; // 시작 위치
  const images = [
    require('@/assets/images/rkbtalk/rewardBg1.png'),
    require('@/assets/images/rkbtalk/rewardBg2.png'),
    require('@/assets/images/rkbtalk/rewardBg3.png'),
    require('@/assets/images/rkbtalk/rewardBg4.png'),
    require('@/assets/images/rkbtalk/rewardBg5.png'),
    require('@/assets/images/rkbtalk/rewardBg6.png'),
  ];

  const isSetAnimated = useRef(false);

  useEffect(() => {
    if (!isSetAnimated.current) {
      isSetAnimated.current = true;
      const animate = () => {
        translateX.setValue(-BG_WIDTH);
        Animated.timing(translateX, {
          toValue: 0,
          duration: 16000,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start(() => {
          // 다른 화면 이동 시 재귀호출 멈추도록 처리
          if (isSetAnimated.current) {
            animate();
          }
        });
      };

      animate();
    }

    return () => {
      // 다른 화면 이동 시 재귀호출 멈추도록 처리
      console.log('@@@ stop ');
      translateX.stopAnimation();
      isSetAnimated.current = false;
    };
  }, [translateX]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        <View style={styles.header}>
          <AppBackButton />
        </View>
        <View style={{paddingHorizontal: 20, flex: 1}}>
          <View style={styles.titleContainer}>
            <AppText style={[appStyles.semiBold16Text, {lineHeight: 24}]}>
              {i18n.t('talk:reward:header')}
            </AppText>

            <View style={{marginTop: 16}}>
              <AppStyledText
                text={i18n.t('talk:reward:body1')}
                textStyle={[appStyles.bold30Text, {color: colors.black}]}
                format={{b: [{color: colors.clearBlue}]}}
              />
            </View>
          </View>

          <View style={styles.lottieView}>
            <Lottie
              style={{
                width: '60%',
              }}
              autoPlay
              loop
              source={require('@/assets/animation/RkbCharacter.json')}
            />
          </View>

          <View style={{height: 160, marginBottom: 40}}>
            <Animated.View
              style={{
                ...styles.animatedView,
                transform: [{translateX}], // translateX 값을 숫자로 전달
              }}>
              <View style={{flexDirection: 'row', zIndex: -1}}>
                {[...images, ...images].map((source, index) => (
                  <Image
                    key={index}
                    style={{
                      alignSelf: 'flex-end',
                      marginRight: 53,
                    }}
                    source={source}
                    resizeMode="contain"
                  />
                ))}
              </View>
            </Animated.View>

            <View style={styles.gradientBg}>
              <LinearGradient
                colors={['#e5f1f6', '#ffffff']}
                start={{x: 0.0, y: 0.0}}
                end={{x: 0.0, y: 1.0}}
                style={styles.linearGradient}>
                <View style={styles.boxContainer}>
                  <View>
                    <AppText
                      style={{...appStyles.bold14Text, color: colors.warmGrey}}>
                      {i18n.t('talk:reward:reward')}
                    </AppText>
                    <View style={styles.boxContent}>
                      <AppIcon
                        name="talkPointCoin"
                        style={{width: 20, height: 20}}
                      />
                      <AppText style={appStyles.robotoBold28Text}>
                        {`${i18n.t('talk:reward:talkPoint', {
                          amount: reward?.rewardAmount || '600',
                        })}`}
                      </AppText>
                    </View>
                  </View>
                </View>

                <View style={{alignItems: 'center', zIndex: 1000}}>
                  <AppIcon name="talkPointChange" style={styles.changeIcon} />
                </View>
                <View style={styles.smallBoxContainer}>
                  <View style={styles.smallBoxContent}>
                    <AppIcon name="freeCallText" />

                    <AppText
                      style={[appStyles.semiBold14Text, {lineHeight: 20}]}>
                      {i18n.t('talk:reward:korea')}
                    </AppText>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>

        <View style={{paddingHorizontal: 20, gap: 2}}>
          {Array.from({length: 3}, (_, idx) => {
            return (
              <AppText
                style={{
                  ...appStyles.normal14Text,
                  lineHeight: 22,
                  color: colors.warmGrey,
                }}>
                {idx === 0
                  ? i18n.t(`talk:reward:info${idx + 1}`, {
                      date: utils.toDateString(
                        reward?.rewardStart,
                        'YYYY.MM.DD',
                      ),
                    })
                  : i18n.t(`talk:reward:info${idx + 1}`)}
              </AppText>
            );
          })}
        </View>
      </ScrollView>
      <View style={{marginTop: 20}}>
        <AppButton
          style={{
            height: 52,
            backgroundColor: colors.white,
          }}
          onPress={() => {
            goBack(navigation, route);
          }}
          title={i18n.t('talk:reward:btn2')}
          titleStyle={styles.modalSubButtonTitle}
        />
        <AppButton
          style={{
            height: 52,
            backgroundColor: colors.clearBlue,
            marginHorizontal: 20,
          }}
          type="primary"
          onPress={() => {
            // 첫 리워드 API 호출
            // 특정 코드일 경우 alert 출력

            if (token && iccid) {
              API.TalkApi.patchTalkPoint({
                iccid,
                token,
                sign: 'reward',
              }).then((rsp) => {
                if (rsp?.result === 0) {
                  navigation.popToTop();
                  actions.toast.push({
                    msg: 'talk:reward:success',
                  });
                  navigation.navigate('TalkStack', {
                    screen: 'RkbTalk',
                  });
                } else if (rsp?.result === api.E_NETWORK_FAILED) {
                  navigation.goBack();
                } else {
                  AppAlert.info(i18n.t('talk:reward:error'), '', () =>
                    navigation.goBack(),
                  );
                }
              });
            }
          }}
          title={i18n.t('talk:reward:btn')}
          titleStyle={[styles.modalButtonTitle]}
        />
      </View>
    </SafeAreaView>
  );
};

// export default memo(TalkRewardScreen);

export default connect(
  ({account, talk}: RootState) => ({account, talk}),
  (dispatch) => ({
    actions: {
      account: bindActionCreators(accountActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(TalkRewardScreen);
