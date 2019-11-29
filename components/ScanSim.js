import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

class ScanSim extends Component {
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
      return <View style={styles.box}/>
    } 
    
    if (hasCameraPermission === false) {
      return (
        <View style={styles.box}>
          <Text>No access to camera</Text>;
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
  box: {
    flex: 1,
    backgroundColor: 'skyblue',
    borderRadius: 8
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