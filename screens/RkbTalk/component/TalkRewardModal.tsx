import React, {useCallback} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppStyledText from '@/components/AppStyledText';

import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
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
  modalContent: {
    width: '90%',
    height: '85%',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayContainer: {
    width: 245,
    height: 245,
    position: 'relative',
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    height: 92,
    width: '100%',
  },
  lottieView: {
    width: '95%',
    aspectRatio: 1,
    position: 'absolute',
    top: 4,
    left: 4,
  },
  modalText: {
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: -0.16,
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

  const loadingMotion = useCallback(() => {
    return (
      <View style={styles.motionContainer}>
        <View style={styles.overlayContainer}>
          <LottieView
            hardwareAccelerationAndroid
            autoPlay
            loop
            style={styles.lottieView}
            source={require('@/assets/animation/RkbTalkGift.json')}
            resizeMode="cover"
            renderMode="HARDWARE"
          />
        </View>
      </View>
    );
  }, []);

  return (
    <AppModal
      type={'division'}
      safeAreaColor="rgba(0,0,0,0.8)"
      topClose={
        <View style={{width: '90%', marginBottom: 60}}>
          <View
            style={{
              marginHorizontal: -10,
              paddingTop: 40,
              alignSelf: 'flex-end',
            }}>
            <Pressable
              onPress={() => {
                onClick();
              }}>
              <AppIcon name="btnCancel26" />
            </Pressable>
          </View>
        </View>
      }
      contentStyle={styles.modalContent}
      bottom={() => (
        <View style={styles.bottomContainer}>
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
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppStyledText
          text={i18n.t('talk:reward:modal:body1').replace('%v', '600')}
          textStyle={[appStyles.semiBold24Text, {color: colors.white}]}
          format={{b: {...appStyles.semiBold24Text, color: colors.gold}}}
        />

        <View style={{marginTop: 16, flex: 1}}>
          <AppStyledText
            text={i18n.t('talk:reward:modal:body2')}
            textStyle={[appStyles.normal16Text, styles.modalText]}
            format={{
              b: [appStyles.bold16Text, styles.modalText],
            }}
          />

          <View style={{marginTop: 36}}>{loadingMotion()}</View>
        </View>
      </View>
    </AppModal>
  );
};

// export default memo(TalkRewardModal);

export default TalkRewardModal;
