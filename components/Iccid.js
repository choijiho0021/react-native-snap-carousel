import React, {PureComponent} from 'react';
import {bindActionCreators} from 'redux';
import {StyleSheet, View, Platform} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import {TextField} from 'react-native-material-textfield';
import * as simActions from '../redux/modules/sim';
import * as accountActions from '../redux/modules/account';
import i18n from '../utils/i18n';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'left',
  },
  field: {
    marginHorizontal: 3,
    padding: 5,
    height: 32,
    width: '85%',
  },
  button: {
    padding: 10,
    borderRadius: 4,
    height: 32,
    alignSelf: 'flex-end',
    backgroundColor: 'skyblue',
  },
});

class Iccid extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      iccid: (props.iccid || '').padEnd(20, ' '),
      cameraOn: false,
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.camera = this.camera.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.scan !== prevProps.scan) {
      this.setState({
        cameraOn: this.props.scan,
      });
    }

    if (this.props.iccid !== prevProps.iccid) {
      this.setState({
        iccid: this.props.iccid,
      });
    }
  }

  onChangeText(text) {
    const iccid = text.replace(/ /gi, '');
    if (iccid.length <= 20) {
      this.setState({
        iccid,
      });
    }
  }

  onSubmit(text) {
    const {iccid} = this.state;

    if (this.props.onSubmit) this.props.onSubmit(iccid);
  }

  onFocus() {
    this.setState({
      errors: {
        iccid: undefined,
      },
    });
  }

  onPress() {
    const cameraOn = !this.state.cameraOn;
    this.setState((state) => ({
      cameraOn: !state.cameraOn,
    }));

    if (this.props.onCamera) this.props.onCamera(cameraOn);
  }

  camera() {
    const {cameraOn} = this.state;
    return (
      <Icon
        key="scan"
        name={cameraOn ? 'camera-off' : 'camera'}
        style={styles.scan}
        size={24}
        onPress={this.onPress}
        color={TextField.defaultProps.baseColor}
      />
    );
  }

  render() {
    const idstr = [];
    const {iccid, cameraOn, errors = {}} = this.state;
    const delimiter = Platform.OS === 'web' ? '' : ' ';

    for (let i = 0; i < iccid.length; i += 5) {
      idstr.push(iccid.slice(i, i + 5));
    }

    return (
      <View style={styles.container}>
        <TextField
          containerStyle={styles.field}
          label="ICCID"
          title={i18n.t('mysim:title')}
          keyboardType="numeric"
          returnKeyType="done"
          enablesReturnKeyAutomatically
          maxLength={23}
          clearTextOnFocus
          extraData={cameraOn}
          error={errors.iccid}
          onChangeText={this.onChangeText}
          onFocus={this.onFocus}
          onSubmitEditing={this.onSubmit}
          renderAccessory={this.camera}
          value={idstr.join(delimiter)}
        />
      </View>
    );
  }
}

export default connect(
  (state) => ({
    iccid: state.sim.get('iccid'),
  }),
  (dispatch) => ({
    SimActions: bindActionCreators(simActions, dispatch),
    AccountActions: bindActionCreators(accountActions, dispatch),
  }),
)(Iccid);
