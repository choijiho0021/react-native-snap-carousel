import React, {memo, PureComponent} from 'react';
import {StyleSheet} from 'react-native';
import _ from 'underscore';
import {colors} from '@/constants/Colors';
import SnackBar from 'react-native-snackbar-component';
import {timer} from '@/constants/Timer';

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 3,
    height: 48,
    marginHorizontal: 20,
  },
});

type AppSnackBarProps = {
  textMessage: string;
  visible: boolean;
  backgroundColor?: string;
  messageColor?: string;
  onClose: () => void;
};

class AppSnackBar extends PureComponent<AppSnackBarProps> {
  snackRef: React.RefObject<SnackBar>;

  constructor(props: AppSnackBarProps) {
    super(props);

    this.snackRef = React.createRef();
  }

  componentDidUpdate() {
    if (this.props.visible) {
      setTimeout(() => {
        this.props.onClose();
      }, 3000);
    }
  }

  render() {
    return (
      <SnackBar
        ref={this.snackRef}
        visible={this.props.visible}
        backgroundColor={this.props.backgroundColor || colors.black}
        messageColor={this.props.messageColor || colors.white}
        position="bottom"
        bottom={100}
        containerStyle={styles.containerStyle}
        actionText="X"
        actionStyle={{paddingHorizontal: 20}}
        accentColor={colors.white}
        autoHidingTime={timer.snackBarHidingTime}
        onClose={this.props.onClose}
        actionHandler={() => {
          this.snackRef.current?.hideSnackbar();
        }}
        textMessage={this.props.textMessage}
      />
    );
  }
}

export default memo(AppSnackBar);
