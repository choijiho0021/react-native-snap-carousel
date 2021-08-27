import {colors} from '@/constants/Colors';
import {attachmentSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {RkbImage} from '@/redux/api/accountApi';
import {RkbIssue} from '@/redux/api/boardApi';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import {actions as boardActions, BoardAction} from '@/redux/modules/board';
import i18n from '@/utils/i18n';
import validationUtil, {
  ValidationResult,
  ValidationRule,
} from '@/utils/validationUtil';
import {List} from 'immutable';
import React, {Component} from 'react';
import {
  findNodeHandle,
  Image,
  InputAccessoryView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import ImagePicker, {Image as CropImage} from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  check,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppActivityIndicator from './AppActivityIndicator';
import AppAlert from './AppAlert';
import AppButton from './AppButton';
import AppIcon from './AppIcon';
import AppText from './AppText';
import AppTextInput from './AppTextInput';

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

type BoardMsgAddProps = {
  account: AccountModelState;
  success: boolean;
  pending: boolean;

  onSubmit?: () => void;
  jumpTo: (v: string) => void;

  action: {
    board: BoardAction;
  };
};

type BoardMsgAddState = {
  name?: string;
  mobile: string;
  title?: string;
  msg?: string;
  disable: boolean;
  checkMobile: boolean;
  checkEmail: boolean;
  errors?: ValidationResult;
  pin?: string;
  attachment: List<CropImage>;
  extraHeight: number;
  hasPhotoPermission: boolean;
};

const validationRule: ValidationRule = {
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

const initialState: BoardMsgAddState = {
  name: undefined,
  mobile: '',
  title: undefined,
  msg: undefined,
  disable: false,
  checkMobile: false,
  checkEmail: false,
  errors: {},
  pin: undefined,
  attachment: List<CropImage>(),
  extraHeight: 80,
  hasPhotoPermission: false,
};

class BoardMsgAdd extends Component<BoardMsgAddProps, BoardMsgAddState> {
  keybd: React.RefObject<TextInput>;

  scrollRef: React.LegacyRef<KeyboardAwareScrollView>;

  constructor(props: BoardMsgAddProps) {
    super(props);

    this.state = initialState;

    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.validate = this.validate.bind(this);
    this.error = this.error.bind(this);
    this.addAttachment = this.addAttachment.bind(this);
    this.rmAttachment = this.rmAttachment.bind(this);
    this.renderAttachment = this.renderAttachment.bind(this);
    this.renderContact = this.renderContact.bind(this);

    this.keybd = React.createRef<TextInput>();
    this.scrollRef = null;
  }

  async componentDidMount() {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    const result = await check(permission);
    const {mobile} = this.props.account;
    const number = utils.toPhoneNumber(mobile);

    this.setState({
      hasPhotoPermission: result === RESULTS.GRANTED,
      mobile: number,
    });

    const errors = validationUtil.validate('mobile', number);
    if (errors) {
      this.setState({
        errors,
      });
    }
  }

  componentDidUpdate(prevProps: BoardMsgAddProps) {
    if (this.props.success && this.props.success !== prevProps.success) {
      // post가 완료되면 list 텝으로 전환한다.
      this.props.jumpTo('list');
    }
  }

  validate = (key: string, value: string) => {
    let {errors} = this.state;
    const valid = validationUtil.validate(key, value, validationRule);

    if (!errors) errors = {};
    errors[key] = valid ? valid[key] : [''];
    this.setState({
      errors,
    });
  };

  onSubmit = async () => {
    const {title, msg, mobile, attachment, pin} = this.state;
    if (!title || !msg) {
      console.log('@@@ invalid issue', title, msg);
      return;
    }

    const issue = {
      title,
      msg,
      mobile,
      pin,
      images: attachment
        .map(
          ({mime, size, width, height, data}) =>
            ({
              mime,
              size,
              width,
              height,
              data,
            } as RkbImage),
        )
        .toArray(),
    } as RkbIssue;

    const rsp = await this.props.action.board.postAndGetList(issue);
    console.log('@@@ rsp', rsp);
    this.setState((state) => ({
      msg: undefined,
      title: undefined,
      pin: undefined,
      attachment: state.attachment.clear(),
    }));
  };

  onCancel = () => {
    const {onSubmit} = this.props;
    if (onSubmit) onSubmit();
  };

  onChangeText = (key: keyof BoardMsgAddState) => (value: string) => {
    this.setState({
      [key]: value,
    });

    this.validate(key, value);
  };

  error(key: string) {
    const {errors} = this.state;
    return errors && errors[key] ? errors[key][0] : '';
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
      if (ImagePicker) {
        try {
          const image = await ImagePicker.openPicker({
            width: 750,
            height: 1334, // iphone 8 size
            cropping: true,
            includeBase64: true,
            writeTempFile: false,
            mediaType: 'photo',
            forceJpb: true,
            cropperChooseText: i18n.t('select'),
            cropperCancelText: i18n.t('cancel'),
          });

          this.setState((state) => ({
            attachment: state.attachment.push(image),
          }));
        } catch (err) {
          console.log('failed to select', err);
        }
      }
    } else {
      // 사진 앨범 조회 권한을 요청한다.
      AppAlert.confirm(i18n.t('settings'), i18n.t('acc:permPhoto'), {
        ok: () => openSettings(),
      });
    }
  }

  rmAttachment(idx: number) {
    this.setState((state) => ({
      attachment: state.attachment.delete(idx),
    }));
  }

  renderPass() {
    const {pin} = this.state;
    return (
      <View style={styles.passwordBox}>
        <AppText
          style={[
            appStyles.normal14Text,
            {color: colors.tomato, marginRight: 5, textAlignVertical: 'center'},
          ]}>
          *
        </AppText>
        <AppText
          style={[appStyles.normal14Text, {textAlignVertical: 'center'}]}>
          {i18n.t('board:pass')}
        </AppText>
        <AppTextInput
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
        <AppText style={styles.attachTitle}>{i18n.t('board:attach')}</AppText>
        <View style={styles.attachBox}>
          {attachment.map((image, idx) => (
            <Pressable
              // eslint-disable-next-line react/no-array-index-key
              key={image.filename}
              style={[styles.attach, idx < 2 && {marginRight: 33}]}
              onPress={() => this.rmAttachment(idx)}>
              <Image
                style={styles.imgSize}
                source={{uri: `data:${image.mime};base64,${image.data}`}}
              />
              <AppIcon name="btnBoxCancel" style={styles.attachCancel} />
            </Pressable>
          ))}
          {attachment.size < 3 && (
            <Pressable
              key="add"
              style={[styles.attach, styles.plusButton]}
              onPress={this.addAttachment}>
              <AppIcon name="btnPhotoPlus" />
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  renderContact() {
    const {disable, mobile} = this.state;

    return (
      <View>
        <AppText style={styles.label}>{i18n.t('board:contact')}</AppText>
        <AppTextInput
          style={styles.button}
          placeholder={i18n.t('board:noMobile')}
          placeholderTextColor={colors.greyish}
          keyboardType="numeric"
          returnKeyType="next"
          enablesReturnKeyAutomatically
          maxLength={13}
          editable={!disable}
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
    const {
      account: {loggedIn},
    } = this.props;
    const inputAccessoryViewID = 'doneKbd';
    // errors object의 모든 value 값들이 undefined인지 확인한다.
    const hasError =
      Object.values(errors).findIndex((val) => !_.isEmpty(val)) >= 0 ||
      (!loggedIn && _.isEmpty(pin)) ||
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
          {loggedIn ? (
            <View style={styles.notiView}>
              <AppText style={styles.noti}>{i18n.t('board:noti')}</AppText>
            </View>
          ) : (
            this.renderContact()
          )}
          <View style={{flex: 1}}>
            <AppTextInput
              style={[
                styles.inputBox,
                title ? {borderColor: colors.black} : undefined,
              ]}
              placeholder={i18n.t('title')}
              placeholderTextColor={colors.greyish}
              returnKeyType="next"
              enablesReturnKeyAutomatically
              clearTextOnFocus={false}
              editable={!disable}
              maxLength={25}
              onChangeText={this.onChangeText('title')}
              onFocus={() => this.setState({extraHeight: 20})}
              error={this.error('title')}
              autoCapitalize="none"
              autoCorrect={false}
              value={title}
            />

            <AppTextInput
              style={[
                styles.inputBox,
                {height: 208, paddingTop: 5, textAlignVertical: 'top'},
                msg ? {borderColor: colors.black} : undefined,
              ]}
              ref={this.keybd}
              placeholder={i18n.t('content')}
              placeholderTextColor={colors.greyish}
              multiline
              numberOfLines={8}
              inputAccessoryViewID={inputAccessoryViewID}
              enablesReturnKeyAutomatically
              clearTextOnFocus={false}
              editable={!disable}
              maxLength={2000}
              onChangeText={this.onChangeText('msg')}
              onFocus={() => this.setState({extraHeight: 80})}
              error={this.error('msg')}
              autoCapitalize="none"
              autoCorrect={false}
              onContentSizeChange={({target}) =>
                this.scrollRef?.props?.scrollToFocusedInput(
                  findNodeHandle(target),
                )
              }
              value={msg}
            />

            {loggedIn ? this.renderAttachment() : this.renderPass()}
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
              onPress={() => this.keybd.current?.blur()}
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
  ({account, status}: RootState) => ({
    account,
    success: status.fulfilled[boardActions.postIssue.typePrefix],
    pending:
      status.pending[boardActions.postIssue.typePrefix] ||
      status.pending[boardActions.postAttach.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
    },
  }),
)(BoardMsgAdd);
