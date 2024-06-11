import {StyleSheet, View} from 'react-native';
import React, {useCallback} from 'react';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import AppIcon from '@/components/AppIcon';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
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
    width: '94%',
    height: '94%',
    position: 'absolute',
    top: 8,
    left: 8,
  },
  appIcon: {
    width: 248,
    height: 248,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

type RenderLoadingLotteryProps = {};

const RenderLoadingLottery: React.FC<RenderLoadingLotteryProps> = ({}) => {
  const loadingMotion = useCallback(() => {
    return (
      <View style={styles.motionContainer}>
        <View style={styles.overlayContainer}>
          <LottieView
            autoPlay
            loop
            style={styles.lottieView}
            source={require('@/assets/animation/lucky.json')}
            resizeMode="cover"
          />
          <AppIcon
            imgStyle={styles.appIcon}
            name="loadingLucky"
            mode="contain"
          />
        </View>
      </View>
    );
  }, []);

  return (
    <>
      <LinearGradient
        // Background Linear Gradient
        colors={['#ffffff', '#D0E9FF']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '115%',
        }}
      />
      <View style={{flex: 1, alignItems: 'center'}}>
        <View
          style={{
            justifyContent: 'center',
            marginTop: 60,
          }}>
          <View
            style={{
              justifyContent: 'center',
              paddingHorizontal: 20,
            }}>
            <AppText
              style={[
                appStyles.bold36Text,
                {textAlign: 'center', lineHeight: 38},
              ]}>
              {i18n.t('esim:lottery:loading')}
            </AppText>
          </View>
          <View style={{marginTop: 104}}>{loadingMotion()}</View>
        </View>
      </View>
    </>
  );
};

export default RenderLoadingLottery;
