import React, {memo, PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import SnackBar from 'react-native-snackbar-component';
import {colors} from '@/constants/Colors';
import {timer} from '@/constants/Timer';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import AppSvgIcon from './AppSvgIcon';

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 3,
    height: 55,
    marginHorizontal: 20,
  },
});

type AppSnackBarProps = {
  textMessage: string;
  visible: boolean;
  backgroundColor?: string;
  messageColor?: string;
  bottom?: number;
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
      <View>
        <SnackBar
          ref={this.snackRef}
          visible={this.props.visible}
          backgroundColor={this.props.backgroundColor || colors.greyishBrown}
          messageColor={this.props.messageColor || colors.white}
          position="bottom"
          bottom={this.props.bottom || 50}
          containerStyle={styles.containerStyle}
          actionStyle={{paddingHorizontal: 20}}
          accentColor={colors.white}
          autoHidingTime={timer.snackBarHidingTime}
          onClose={this.props.onClose}
          actionHandler={() => {
            this.snackRef.current?.hideSnackbar();
          }}
          textMessage={() => (
            <View
              style={{
                marginHorizontal: 17,
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <AppText style={[appStyles.normal14Text, {color: colors.white}]}>
                {this.props.textMessage}
              </AppText>
              <AppSvgIcon
                name="closeSnackBar"
                onPress={() => this.props.onClose()}
              />
            </View>
          )}
        />
      </View>
    );
  }
}

export default memo(AppSnackBar);
