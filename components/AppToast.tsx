import React, {PureComponent} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  Easing,
  ViewStyle,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'underscore';
import {RootState} from '@/redux';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';

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

type AppToastProps = {
  toastMsgBox: string[];
  closable?: boolean;
  style?: ViewStyle;
  action: {
    toast: ToastAction;
  };
};

type AppToastState = {
  isShown: boolean;
  opacity: Animated.Value;
  text?: string;
};

class AppToast extends PureComponent<AppToastProps, AppToastState> {
  isShown: boolean;

  mounted: boolean;

  timer: NodeJS.Timeout | undefined;

  fadeInDuration: number;

  fadeOutDuration: number;

  duration: number;

  constructor(props: AppToastProps) {
    super(props);

    this.state = {
      isShown: false,
      opacity: new Animated.Value(0),
      text: '',
    };

    this.onPress = this.onPress.bind(this);

    this.isShown = false;
    this.mounted = false;
    this.timer = undefined;
    this.fadeInDuration = 750;
    this.fadeOutDuration = 1000;
    this.duration = 500;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentDidUpdate(prevProps: AppToastProps) {
    if (
      this.props.toastMsgBox.length > 0 &&
      prevProps.toastMsgBox.length === 0 &&
      !this.state.isShown
    ) {
      this.show();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.timer) clearTimeout(this.timer);
  }

  onPress() {
    const {closable} = this.props;

    if (closable) {
      this.close();
    }
  }

  close() {
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
      this.show();
    });
  }

  show({duration}: {duration?: number} = {}) {
    const {toastMsgBox} = this.props;
    const text = toastMsgBox[0];
    if (text) {
      if (_.isNumber(duration)) {
        this.duration = Number(duration);
      }

      if (this.mounted) this.setState({isShown: true, text: i18n.t(text)});

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
  }

  render() {
    const {style} = this.props;
    const {isShown, text} = this.state;

    return isShown ? (
      <TouchableOpacity
        style={[styles.container, style]}
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
