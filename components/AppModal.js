import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, Modal, TextInput} from 'react-native';
import _ from 'underscore';
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import {colors} from '../constants/Colors';
import AppButton from './AppButton';
import validationUtil from '../utils/validationUtil';
import AppIcon from './AppIcon';

const styles = StyleSheet.create({
  error: {
    ...appStyles.normal14Text,
    color: colors.tomato,
    marginHorizontal: 30,
    marginTop: 10,
  },
  cancelButton: {
    width: 20,
    height: 20,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.white,
    width: 65,
    height: 36,
  },
  closeButton: {
    width: '100%',
    height: 50,
    backgroundColor: colors.clearBlue,
  },
  closeButtonTitle: {
    ...appStyles.normal18Text,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },
  buttonTitle: {
    ...appStyles.normal18Text,
    textAlign: 'right',
    width: '100%',
  },
  row: {
    marginTop: 40,
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginTop: 30,
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  textInput: {
    ...appStyles.normal16Text,
    flex: 1,
    paddingVertical: 12,
  },
  title: {
    ...appStyles.normal18Text,
    marginHorizontal: 30,
  },
  blueCenter: {
    ...appStyles.normal18Text,
    marginHorizontal: 30,
    color: colors.clearBlue,
    alignSelf: 'center',
  },
  inner: {
    ...appStyles.modalInner,
    paddingVertical: 25,
  },
  icon: {
    marginVertical: 15,
    marginHorizontal: 20,
  },
});

function renderBody(body) {
  if (typeof body === 'string') return <Text style={styles.body}>{body}</Text>;
  if (typeof body === 'function') return body();
  return null;
}

class AppModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: props.default,
      error: undefined,
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && this.props.visible !== prevProps.visible) {
      this.setState({
        value: this.props.default,
      });
    }
  }

  onChangeText = (key) => (value) => {
    const val = {
      [key]: value,
    };
    const error = validationUtil.validateAll(val);

    this.setState({
      ...val,
      error,
    });
  };

  async onSubmit() {
    const {value} = this.state;
    const validated =
      (this.props.validate && this.props.validate(value)) ||
      (this.props.validateAsync && (await this.props.validateAsync(value)));

    console.log('validated', validated);

    if (_.isUndefined(validated)) {
      this.props.onOkClose(value);
    } else {
      this.setState({
        error: validated,
      });
    }
  }

  onCancelClose() {
    this.props.onCancelClose();
    this.setState({error: undefined});
  }

  renderError() {
    const {error} = this.state;

    if (this.props.mode === 'edit') {
      if (_.isArray(error))
        return (
          <View>
            {error.map((err, idx) => (
              <Text key={`${idx}`} style={styles.error}>
                {err}
              </Text>
            ))}
          </View>
        );

      if (!_.isEmpty(error)) return <Text style={styles.error}>{error}</Text>;
    }
    return null;
  }

  render() {
    const {value, error} = this.state;
    const {
      title,
      titleStyle,
      titleIcon,
      body,
      type = 'normal',
      maxLength = undefined,
      keyboardType = 'default',
      toRokebiCash = undefined,
      closeButtonTitle = i18n.t('close'),
    } = this.props;

    return (
      <Modal animationType="fade" transparent visible={this.props.visible}>
        <View style={appStyles.modal}>
          <View style={styles.inner}>
            {titleIcon && <AppIcon name={titleIcon} style={styles.icon} />}
            {title && <Text style={titleStyle || styles.title}>{title}</Text>}
            {!_.isUndefined(toRokebiCash) && (
              <View style={{marginTop: 30}}>
                <Text style={styles.blueCenter}>
                  {i18n.t('usim:toRokebiCash')}
                </Text>
                <Text style={styles.blueCenter}>
                  {toRokebiCash} {i18n.t('usim:balance')}
                </Text>
              </View>
            )}
            {renderBody(body)}
            {this.props.mode === 'edit' && (
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  returnKeyType="done"
                  enablesReturnKeyAutomatically
                  onChangeText={this.onChangeText('value')}
                  maxLength={maxLength}
                  keyboardType={keyboardType}
                  value={value}
                />

                <AppButton
                  style={styles.cancelButton}
                  iconName="btnCancel"
                  onPress={() => this.onChangeText('value')('')}
                />
              </View>
            )}
            {this.renderError()}

            {type === 'close' && (
              <View style={{marginHorizontal: 20}}>
                <AppButton
                  style={styles.closeButton}
                  onPress={this.onSubmit}
                  title={closeButtonTitle}
                  titleStyle={styles.closeButtonTitle}
                />
              </View>
            )}

            {['normal', 'info'].includes(type) && (
              <View style={styles.row}>
                {type === 'normal' && (
                  <AppButton
                    style={styles.button}
                    onPress={() => this.onCancelClose()}
                    title={i18n.t('cancel')}
                    titleStyle={styles.buttonTitle}
                  />
                )}
                <AppButton
                  style={styles.button}
                  disabled={!_.isEmpty(error)}
                  onPress={this.onSubmit}
                  title={i18n.t('ok')}
                  disableBackgroundColor={colors.white}
                  disableColor={colors.warmGrey}
                  titleStyle={{
                    ...styles.buttonTitle,
                    color: _.isEmpty(error)
                      ? colors.clearBlue
                      : colors.warmGrey,
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

export default AppModal;
