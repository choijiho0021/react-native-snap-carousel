import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  findNodeHandle,
  TextInput,
  TouchableOpacity,
  Image,
  InputAccessoryView,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import {List} from 'immutable';
import {
  openSettings,
  check,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import {actions as accountActions} from '@/redux/modules/account';
import {actions as boardActions} from '@/redux/modules/board';
import utils from '@/submodules/rokebi-utils/utils';
import validationUtil from '@/utils/validationUtil';
import {colors} from '@/constants/Colors';
import {attachmentSize} from '@/constants/SliderEntry.style';
import {RootState} from '@/redux';
import AppActivityIndicator from './AppActivityIndicator';
import AppButton from './AppButton';
import AppAlert from './AppAlert';
import AppIcon from './AppIcon';

const ImagePicker = require('react-native-image-crop-picker').default;

const styles = StyleSheet.create({
  passwordInput: {
    borderBottomColor: colors.warmGrey,
    borderBottomWidth: 1,
    marginLeft: 15,
    paddingBottom: 10,
    color: colors.black,
    flex: 1,
  },
  passwordBox: {
    flexDirection: 'row',
    marginTop: 30,
    marginHorizontal: 20,
  },
  inputAccessoryText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    margin: 5,
  },
  inputAccessory: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: colors.lightGrey,
    padding: 5,
  },
  plusButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachCancel: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  attachBox: {
    marginHorizontal: 20,
    flexDirection: 'row',
  },
  attachTitle: {
    ...appStyles.normal14Text,
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  imgSize: {
    width: attachmentSize,
    height: attachmentSize,
  },
  attach: {
    width: attachmentSize,
    height: attachmentSize,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  confirm: {
    ...appStyles.normal18Text,
    ...appStyles.confirm,
    marginTop: 30,
  },
  inputBox: {
    ...appStyles.normal14Text,
    marginTop: 30,
    marginHorizontal: 20,
    height: 50,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    color: colors.black,
    paddingHorizontal: 10,
  },
  notiView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.whiteTwo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noti: {
    ...appStyles.normal12Text,
    textAlign: 'left',
  },
  container: {
    flex: 1,
  },
  label: {
    ...appStyles.normal14Text,
    marginLeft: 20,
    marginTop: 20,
  },
  button: {
    ...appStyles.normal16Text,
    height: 40,
    marginTop: 10,
    marginHorizontal: 20,
    color: colors.black,
    borderBottomColor: colors.warmGrey,
    borderBottomWidth: 1,
  },

  modalInner: {
    justifyContent: 'space-between',
    flexGrow: 1,
  },
});

class BoardMsgAdd extends Component {
  static validation = {
    title: {
      presence: {
        message: i18n.t('board:noTitle'),
      },
    },
    msg: {
      presence: {
        message: i18n.t('board:noMsg'),
      },
    },
  };

  constructor(props) {
    super(props);

    this.initialState = {
      name: undefined,
      mobile: '',
      email: undefined,
      title: undefined,
      msg: undefined,
      disable: false,
      checkMobile: false,
      checkEmail: false,
      errors: {},
      pin: undefined,
      attachment: List(),
    };

    this.state = {
      ...this.initialState,
      extraHeight: 80,
      hasPhotoPermission: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.validate = this.validate.bind(this);
    this.error = this.error.bind(this);
    this.scroll = this.scroll.bind(this);
    this.addAttachment = this.addAttachment.bind(this);
    this.rmAttachment = this.rmAttachment.bind(this);
    this.renderAttachment = this.renderAttachment.bind(this);
    this.renderContact = this.renderContact.bind(this);

    this.keybd = React.createRef();
    this.scrollRef = null;
  }

  async componentDidMount() {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    const result = await check(permission);
    const {mobile, email} = this.props.account;
    const number = utils.toPhoneNumber(mobile);

    this.setState({
      hasPhotoPermission: result === RESULTS.GRANTED,
      mobile: number,
      email,
    });

    const errors = validationUtil.validateAll(
      {mobile: number},
      BoardMsgAdd.validation,
    );
    if (errors) {
      this.setState({
        errors,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.success && this.props.success !== prevProps.success) {
      // post가 완료되면 list 텝으로 전환한다.
      this.props.jumpTo('list');
    }
  }

  validate = (key, value) => {
    const {errors} = this.state;
    const valid = validationUtil.validate(key, value, {
      [key]: BoardMsgAdd.validation[key],
    });

    errors[key] = _.isEmpty(valid) ? undefined : valid[key];
    this.setState({
      errors,
    });
  };

  onSubmit = () => {
    const {title, msg, mobile, attachment, pin} = this.state;
    const issue = {
      title,
      msg,
      mobile,
      pin,
    };

    // reset data
    setTimeout(() => {
      this.setState((state) => ({
        msg: undefined,
        title: undefined,
        pin: undefined,
        attachment: state.attachment.clear(),
      }));
    }, 1000);

    this.props.action.board.postAndGetList(issue, attachment.toJS());
  };

  onCancel = () => {
    this.props.onSubmit();
  };

  onChangeText = (key) => (value) => {
    this.setState({
      [key]: value,
    });

    this.validate(key, value);
  };

  scroll = (event) => {
    this.scrollRef?.props?.scrollToFocusedInput(findNodeHandle(event.target));
  };

  error(key) {
    const {errors} = this.state;
    return !_.isEmpty(errors) && errors[key] ? errors[key][0] : '';
  }

  async addAttachment() {
    let checkNewPermission = false;

    if (!this.state.hasPhotoPermission) {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      const result = await check(permission);

      checkNewPermission = result === RESULTS.GRANTED;
    }

    if (this.state.hasPhotoPermission || checkNewPermission) {
      if (ImagePicker)
        ImagePicker.openPicker({
          width: 750,
          height: 1334, // iphone 8 size
          cropping: true,
          includeBase64: true,
          writeTempFile: false,
          mediaType: 'photo',
          forceJpb: true,
          cropperChooseText: i18n.t('select'),
          cropperCancelText: i18n.t('cancel'),
        })
          .then((image) => {
            this.setState((state) => ({
              attachment: state.attachment.push(image),
            }));
          })
          .catch((err) => {
            console.log('failed to select', err);
          });
    } else {
      // 사진 앨범 조회 권한을 요청한다.
      AppAlert.confirm(i18n.t('settings'), i18n.t('acc:permPhoto'), {
        ok: () => openSettings(),
      });
    }
  }

  rmAttachment(idx) {
    this.setState((state) => ({
      attachment: state.attachment.delete(idx),
    }));
  }

  renderPass() {
    const {pin} = this.state;
    return (
      <View style={styles.passwordBox}>
        <Text
          style={[
            appStyles.normal14Text,
            {color: colors.tomato, marginRight: 5, textAlignVertical: 'center'},
          ]}>
          *
        </Text>
        <Text style={[appStyles.normal14Text, {textAlignVertical: 'center'}]}>
          {i18n.t('board:pass')}
        </Text>
        <TextInput
          style={styles.passwordInput}
          placeholder={i18n.t('board:inputPass')}
          placeholderTextColor={colors.greyish}
          keyboardType="numeric"
          returnKeyType="done"
          enablesReturnKeyAutomatically
          maxLength={4}
          secureTextEntry
          onChangeText={this.onChangeText('pin')}
          value={pin}
          onFocus={() => this.setState({extraHeight: 20})}
        />
      </View>
    );
  }

  renderAttachment() {
    const {attachment} = this.state;
    return (
      <View>
        <Text style={styles.attachTitle}>{i18n.t('board:attach')}</Text>
        <View style={styles.attachBox}>
          {attachment.map((image, idx) => (
            <TouchableOpacity
              // eslint-disable-next-line react/no-array-index-key
              key={image.filename + idx}
              style={[styles.attach, idx < 2 && {marginRight: 33}]}
              onPress={() => this.rmAttachment(idx)}>
              <Image
                style={styles.imgSize}
                source={{uri: `data:${image.mime};base64,${image.data}`}}
              />
              <AppIcon name="btnBoxCancel" style={styles.attachCancel} />
            </TouchableOpacity>
          ))}
          {attachment.size < 3 && (
            <TouchableOpacity
              key="add"
              style={[styles.attach, styles.plusButton]}
              onPress={this.addAttachment}>
              <AppIcon name="btnPhotoPlus" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  renderContact() {
    const {disable, mobile} = this.state;

    return (
      <View>
        <Text style={styles.label}>{i18n.t('board:contact')}</Text>
        <TextInput
          style={styles.button}
          placeholder={i18n.t('board:noMobile')}
          placeholderTextColor={colors.greyish}
          keyboardType="numeric"
          returnKeyType="next"
          enablesReturnKeyAutomatically
          maxLength={13}
          disabled={disable}
          onChangeText={(value) =>
            this.onChangeText('mobile')(utils.toPhoneNumber(value))
          }
          onFocus={() => this.setState({extraHeight: 20})}
          error={this.error('mobile')}
          value={mobile}
        />
      </View>
    );
  }

  render() {
    const {
      disable,
      title,
      msg,
      extraHeight,
      pin,
      mobile,
      errors = {},
    } = this.state;
    const inputAccessoryViewID = 'doneKbd';
    // errors object의 모든 value 값들이 undefined인지 확인한다.
    const hasError =
      Object.values(errors).findIndex((val) => !_.isEmpty(val)) >= 0 ||
      (!this.props.isLoggedIn && _.isEmpty(pin)) ||
      _.isEmpty(msg) ||
      _.isEmpty(title) ||
      _.isEmpty(mobile);

    return (
      <SafeAreaView style={styles.container}>
        <AppActivityIndicator visible={this.props.pending} />

        <KeyboardAwareScrollView
          resetScrollToCoords={{x: 0, y: 0}}
          contentContainerStyle={styles.modalInner}
          extraScrollHeight={extraHeight}
          enableOnAndroid
          innerRef={(ref) => {
            this.scrollRef = ref;
          }}>
          {this.props.isLoggedIn === false && this.renderContact()}
          <View style={styles.notiView}>
            <Text style={styles.noti}>{i18n.t('board:noti')}</Text>
          </View>

          <View style={{flex: 1}}>
            <TextInput
              style={[styles.inputBox, title && {borderColor: colors.black}]}
              placeholder={i18n.t('title')}
              placeholderTextColor={colors.greyish}
              returnKeyType="next"
              enablesReturnKeyAutomatically
              clearTextOnFocus={false}
              disabled={disable}
              maxLength={25}
              onChangeText={this.onChangeText('title')}
              onFocus={() => this.setState({extraHeight: 20})}
              error={this.error('title')}
              autoCapitalize="none"
              autoCorrect={false}
              value={title}
            />

            <TextInput
              style={[
                styles.inputBox,
                {height: 208, paddingTop: 5, textAlignVertical: 'top'},
                msg && {borderColor: colors.black},
              ]}
              ref={this.keybd}
              placeholder={i18n.t('content')}
              placeholderTextColor={colors.greyish}
              multiline
              numberOfLines={8}
              inputAccessoryViewID={inputAccessoryViewID}
              enablesReturnKeyAutomatically
              clearTextOnFocus={false}
              disabled={disable}
              maxLength={2000}
              onChangeText={this.onChangeText('msg')}
              onFocus={() => this.setState({extraHeight: 80})}
              error={this.error('msg')}
              autoCapitalize="none"
              autoCorrect={false}
              onContentSizeChange={this.scroll}
              value={msg}
            />

            {this.props.isLoggedIn
              ? this.renderAttachment()
              : this.renderPass()}
          </View>
        </KeyboardAwareScrollView>

        {Platform.OS === 'ios' ? (
          <InputAccessoryView nativeID={inputAccessoryViewID}>
            <AppButton
              style={styles.inputAccessory}
              title={i18n.t('done')}
              titleStyle={[
                styles.inputAccessoryText,
                {color: _.isEmpty(this.state.msg) ? colors.white : colors.blue},
              ]}
              onPress={() => this.keybd.current.blur()}
            />
          </InputAccessoryView>
        ) : null}

        <AppButton
          style={styles.confirm}
          title={i18n.t('board:new')}
          disabled={hasError}
          onPress={this.onSubmit}
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, pender}: RootState) => ({
    account,
    auth: accountActions.auth(account),
    isLoggedIn: account.loggedIn || false,
    success: pender.success[boardActions.POST_ISSUE],
    pending:
      pender.pending[boardActions.POST_ISSUE] ||
      pender.pending[boardActions.POST_ATTACH] ||
      false,
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
    },
  }),
)(BoardMsgAdd);
