import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import i18n from '../utils/i18n';
import {appStyles} from '../constants/Styles';
import {colors} from '../constants/Colors';
import {windowWidth} from '../constants/SliderEntry.style';

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    //width: windowWidth - 40,
    //height: 200
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
    //padding: 2,
  },
  cameraOuter: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  flashButton: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
});

class ScanSim extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cameraOn: false,
      hasCameraPermission: false,
      flashOn: false,
    };

    this.onPress = this.onPress.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.scan !== prevProps.scan ||
      this.props.hasCameraPermission !== prevProps.hasCameraPermission
    ) {
      this.setState({
        cameraOn: this.props.scan,
        hasCameraPermission: this.props.hasCameraPermission,
      });
    }
  }

  // async componentDidMount() {
  //   const permission = Platform.OS == 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
  //   const result = await check(permission)

  //   this.setState({ hasCameraPermission: result === 'granted' });
  // }

  onPress() {
    this.setState((state) => ({
      flashOn: !state.flashOn,
    }));
  }

  render() {
    const {hasCameraPermission, cameraOn} = this.state;

    if (!cameraOn || hasCameraPermission === null) {
      return (
        <View style={styles.box}>
          <Image
            style={styles.image}
            source={require('../assets/images/main/imgCard.png')}
            resizeMode="stretch"
          />
          <Text style={styles.boxTitle}>{i18n.t('reg:cardScan')}</Text>
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
          <Text style={styles.boxTitle}>{i18n.t('reg:noPerm')}</Text>
        </View>
      );
    }

    //const flashMode = flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off

    return (
      <View style={styles.box}>
        <RNCamera
          style={styles.image}
          captureAudio={false}
          type={RNCamera.Constants.Type.back}
          onBarCodeRead={this.props.onScan}>
          <BarcodeMask
            edgeColor={colors.white}
            width={windowWidth - 60}
            height={180}
          />
        </RNCamera>
      </View>
    );
  }
}

export default ScanSim;
