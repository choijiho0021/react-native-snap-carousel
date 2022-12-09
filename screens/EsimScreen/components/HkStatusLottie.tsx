import React from 'react';
import Lottie from 'lottie-react-native';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  lottiSize: {
    width: 96,
    height: 110,
  },
});

const HkStatusLottie = ({hkRegStatus}: {hkRegStatus: string}) => {
  switch (hkRegStatus) {
    case 'hkRegistering':
      return (
        <Lottie
          source={require('@/assets/images/lottie/hkRegistering.json')}
          autoPlay
          loop
          style={styles.lottiSize}
        />
      );
      break;
    case 'hkRegistered':
      return (
        <Lottie
          autoPlay
          loop
          source={require('@/assets/images/lottie/hkRegistered.json')}
          style={styles.lottiSize}
        />
      );
      break;
    case 'hkUnregistered':
      return (
        <Lottie
          autoPlay
          loop
          source={require('@/assets/images/lottie/hkUnregistered.json')}
          style={styles.lottiSize}
        />
      );
      break;
    default:
      break;
  }
  return <></>;
};

export default HkStatusLottie;
