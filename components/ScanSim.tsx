import {colors} from '@/constants/Colors';
import {windowWidth} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import AppText from './AppText';

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  boxTitle: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

const ScanSim = ({
  scan,
  hasCameraPermission,
  onScan,
}: {
  scan: boolean;
  hasCameraPermission: boolean;
  onScan: (event: BarCodeReadEvent) => void;
}) => {
  // const [cameraOn, setCameraOn] = useState(false);
  // const [flashOn, setFlashOn] = useState(false);

  /*
  onPress() {
    this.setState((state) => ({
      flashOn: !state.flashOn,
    }));
  }
  */

  if (!scan || hasCameraPermission === null) {
    return (
      <View style={styles.box}>
        <Image
          style={styles.image}
          source={require('../assets/images/main/imgCard.png')}
          resizeMode="stretch"
        />
        <AppText style={styles.boxTitle}>{i18n.t('reg:cardScan')}</AppText>
      </View>
    );
  }

  if (hasCameraPermission === false) {
    // 카메라 권한을 요청한다.
    // AppAlert.confirm( i18n.t('settings'), i18n.t('acc:permCamera'), {
    //   ok: () => openSettings()
    // })

    return (
      <View style={styles.box}>
        <Image
          style={styles.image}
          source={require('../assets/images/main/imgCard.png')}
          resizeMode="stretch"
        />
        <AppText style={styles.boxTitle}>{i18n.t('reg:noPerm')}</AppText>
      </View>
    );
  }

  // const flashMode = flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off

  return (
    <View style={styles.box}>
      <RNCamera
        style={styles.image}
        captureAudio={false}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={onScan}>
        <BarcodeMask
          edgeColor={colors.white}
          width={windowWidth - 60}
          height={180}
        />
      </RNCamera>
    </View>
  );
};

export default memo(ScanSim);
