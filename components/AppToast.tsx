import React, {PureComponent} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {
  actions as toastActions,
  ToastAction,
  Toast,
  ToastParam,
  ToastIconType,
} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import AppText from './AppText';
import AppIcon from './AppIcon';

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
    backgroundColor: colors.black92,

    padding: 16,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    flex: 1,
    ...appStyles.normal14Text,
    color: colors.white,
    lineHeight: 20,
    textAlign: 'left',
  },
});

type AppToastProps = {
  toastMsgBox: ToastParam[];
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
  toastIcon?: ToastIconType;
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
    const text = toastMsgBox[0].msg;

    const {toastIcon} = toastMsgBox[0];
    if (text) {
      if (_.isNumber(duration)) {
        this.duration = Number(duration);
      }

      if (this.mounted)
        this.setState({
          isShown: true,
          toastIcon,
          text: i18n.t(text),
        });

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
    const {isShown, text, toastIcon} = this.state;

    return isShown ? (
      <TouchableOpacity
        style={[styles.container, style]}
        activeOpacity={0.5}
        onPress={this.onPress}>
        <Animated.View style={[styles.content, {alignContent: 'center'}]}>
          {toastIcon && <AppIcon name={toastIcon} />}
          <AppText style={styles.text}>{text}</AppText>
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
