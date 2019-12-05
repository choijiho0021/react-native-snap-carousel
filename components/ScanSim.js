import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import i18n from '../utils/i18n';
import { appStyles } from '../constants/Styles';
import { colors } from '../constants/Colors';

class ScanSim extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      cameraOn: false,
      hasCameraPermission: null,
      flashOn: false,
      scanned: false
    }

    this._onPress = this._onPress.bind(this)
  }

  componentDidUpdate( prevProps) {
    if ( this.props.scan != prevProps.scan) {
      this.setState({
        cameraOn : this.props.scan
      })
    }
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({ hasCameraPermission: status === 'granted' });
  }

  _onPress() {
    const flashOn = ! this.state.flashOn
    this.setState({
      flashOn
    })
  }

  render() {
    const { hasCameraPermission, cameraOn, flashOn, scanned } = this.state;

    if ( ! cameraOn || hasCameraPermission === null ) {
      return (
        <View style={styles.box}>
          <Image style={{position:'absolute'}} source={require('../assets/images/main/imgCard.png')}/>
          <Text style={styles.boxTitle}>{i18n.t('reg:card')}</Text>
        </View>
        )
    } 
    
    if (hasCameraPermission === false) {
      return (
        <View style={styles.box}>
          <Image style={{position:'absolute'}} source={require('../assets/images/main/imgCard.png')}/>
          <Text style={styles.boxTitle}>{i18n.t('reg:noPerm')}</Text>
        </View>
      )
    } 

    //const flashMode = flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off

    return (
      <View style={styles.camera}>
        <BarCodeScanner style={{ flex: 1 }} onBarCodeScanned={this.props.onScan} >
        {
          /*
          flashMode={flashMode} 
          <View style={styles.cameraOuter}>
            <TouchableOpacity style={styles.flashButton} onPress={this._onPress}>
              <Ionicons key="flash" name={flashOn ? "ios-flash-off" : "ios-flash"} size={32} />
            </TouchableOpacity>
          </View>
          */
        }
        </BarCodeScanner>
      </View>
    )

  }

}


const styles = StyleSheet.create({
  boxTitle: {
    ... appStyles.normal16Text,
    color: colors.clearBlue,
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  camera: {
    flex:1
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
  }
});

export default ScanSim