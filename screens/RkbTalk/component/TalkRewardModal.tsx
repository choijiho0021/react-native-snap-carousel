import React, {useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppStyledText from '@/components/AppStyledText';

import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import {useNavigation} from '@react-navigation/native';
import AppModal from '@/components/AppModal';
import AppIcon from '@/components/AppIcon';

const styles = StyleSheet.create({
  modalButtonTitle: {
    ...appStyles.medium18,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },
  motionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    width: 248,
    height: 248,
    position: 'relative',
  },

  lottieView: {
    width: '95%',
    aspectRatio: 1,
    position: 'absolute',
    top: 4,
    left: 4,
  },
  appIcon: {
    width: 248,
    height: 248,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

type TalkRewardModalProps = {
  visible: boolean;
  onClick: () => void;
};

const TalkRewardModal: React.FC<TalkRewardModalProps> = ({
  visible,
  onClick,
}) => {
  const navigation = useNavigation();

  // const loadingMotion = useCallback(() => {
  //   return (
  //     <View style={styles.motionContainer}>
  //       <View style={styles.overlayContainer}>
  //         <LottieView
  //           hardwareAccelerationAndroid
  //           autoPlay
  //           loop
  //           style={styles.lottieView}
  //           source={require('@/assets/animation/lucky.json')}
  //           resizeMode="cover"
  //           renderMode="HARDWARE"
  //         />
  //         <AppIcon
  //           imgStyle={styles.appIcon}
  //           name="loadingLucky"
  //           mode="contain"
  //         />
  //       </View>
  //     </View>
  //   );
  // }, []);

  return (
    <AppModal
      type={'division'}
      safeAreaColor="rgba(0,0,0,0.8)"
      topClose={
        <View style={{width: '90%', marginBottom: 24}}>
          <View
            style={{
              marginHorizontal: -10,
              paddingTop: 40,
              alignSelf: 'flex-end',
            }}>
            <Pressable
              onPress={() => {
                onClick();
              }}
              style={{
                borderColor: colors.white,
                borderWidth: 2,
                borderRadius: 100,
              }}>
              <AppIcon name="boldCancel" />
            </Pressable>
          </View>
        </View>
      }
      contentStyle={{
        // marginHorizontal: 20,
        width: '80%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 120, // close btn area
      }}
      bottom={() => (
        <View
          style={{
            height: 92,
            marginTop: 50,
            width: '100%',
          }}>
          <AppButton
            style={{
              height: 52,
              backgroundColor: colors.clearBlue,
            }}
            type="primary"
            onPress={() => {
              navigation.navigate('TalkReward');
              onClick();
            }}
            title={i18n.t('talk:reward:modal:btn')}
            titleStyle={[styles.modalButtonTitle]}
          />
        </View>
      )}
      onOkClose={async () => {
        console.log('@@@@@@ ');
      }}
      onCancelClose={() => {
        console.log('@@@@@@');
      }}
      visible={visible}>
      <View>
        <AppStyledText
          text={i18n.t('talk:reward:modal:body1')}
          textStyle={[appStyles.bold22Text, {color: colors.white}]}
          format={{b: {color: colors.redBold}}}
        />

        <View style={{marginTop: 30}}>
          <AppStyledText
            text={i18n.t('talk:reward:modal:body2')}
            textStyle={[appStyles.normal16Text, {color: colors.white}]}
            format={{b: [appStyles.bold16Text, {color: colors.redBold}]}}
          />
          <AppText style={{backgroundColor: 'red', marginTop: 30}}>
            아이콘 위치
          </AppText>
        </View>
      </View>
    </AppModal>
  );
};

// export default memo(TalkRewardModal);

export default TalkRewardModal;
