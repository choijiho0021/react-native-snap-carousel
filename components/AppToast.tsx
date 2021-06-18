import React, {PureComponent} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  Easing,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'underscore';
import {RootState} from '../redux';
import * as toastActions from '../redux/modules/toast';
import {appStyles} from '../constants/Styles';
import {colors} from '../constants/Colors';
import {Toast} from '../constants/CustomTypes';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1000,
    bottom: 100,
    left: 0,
    right: 0,
  },
  content: {
    backgroundColor: colors.warmGrey,
    borderRadius: 10,
    padding: 10,
  },
  text: {
    ...appStyles.normal14Text,
    color: colors.white,
    textAlign: 'center',
  },
});

class AppToast extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isShown: false,
      opacity: new Animated.Value(0),
      text: '',
    };

    this.onPress = this.onPress.bind(this);

    this.mounted = null;
    this.timer = null;
    this.isShown = false;
    this.fadeInDuration = 750;
    this.fadeOutDuration = 1000;
    this.duration = 500;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.toastMsgBox.size > 0 &&
      prevProps.toastMsgBox.size === 0 &&
      !this.isShown
    ) {
      this.show();
    }
  }

  componentWillUnmount() {
    this.mounted = null;
    if (this.timer) clearTimeout(this.timer);
  }

  onPress() {
    const {closable} = this.props;

    if (closable) {
      this.close();
    }
  }

  close() {
    const {toastMsgBox} = this.props;
    if (this.timer) clearTimeout(this.timer);

    if (!this.isShown && !this.state.isShown) return;

    Animated.timing(this.state.opacity, {
      toValue: 0,
      easing: Easing.ease,
      duration: this.fadeOutDuration,
      useNativeDriver: false,
    }).start(() => {
      if (this.mounted) this.setState({isShown: false});
      this.isShown = false;

      if (toastMsgBox.size > 0) {
        this.show();
      }
    });
  }

  show({duration} = {}) {
    const {toastMsgBox} = this.props;
    const text = Toast.mapToMessage(toastMsgBox.first());

    if (_.isNumber(duration)) {
      this.duration = Number(duration);
    }

    if (this.mounted) this.setState({isShown: true, text});

    Animated.timing(this.state.opacity, {
      toValue: 1,
      easing: Easing.ease,
      duration: this.fadeInDuration,
      useNativeDriver: false,
    }).start(() => {
      this.isShown = true;
      if (this.timer) clearTimeout(this.timer);
      this.props.action.toast.remove();

      this.timer = setTimeout(() => {
        this.close();
      }, this.duration);
    });
  }

  render() {
    const {styles: st} = this.props;
    const {isShown, text} = this.state;

    return isShown ? (
      <TouchableOpacity
        style={[styles.container, st]}
        activeOpacity={0.5}
        onPress={this.onPress}>
        <Animated.View style={[styles.content]}>
          <Text style={[styles.text]}> {text} </Text>
        </Animated.View>
      </TouchableOpacity>
    ) : null;
  }
}

export default connect(
  ({toast}: RootState) => ({
    toastMsgBox: toast.messages,
  }),
  (dispatch) => ({
    action: {
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(AppToast);
