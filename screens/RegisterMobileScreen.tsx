import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Map as ImmutableMap} from 'immutable';
import React, {Component, memo} from 'react';
import {
  Appearance,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import InputEmail, {InputEmailRef} from '@/components/InputEmail';
import InputMobile from '@/components/InputMobile';
import InputPinInTime from '@/components/InputPinInTime';
import Profile from '@/components/Profile';
import SocialLogin from '@/components/SocialLogin';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {ApiResult} from '@/redux/api/api';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import validationUtil from '@/utils/validationUtil';
import {RkbImage} from '@/redux/api/accountApi';

const {esimGlobal, isProduction} = Env.get();
// const esimGlobal = false;

const styles = StyleSheet.create({
  helpText: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    marginTop: 13,
    marginLeft: 30,
  },
  title: {
    ...appStyles.bold30Text,
    paddingHorizontal: 20,
    paddingTop: 50,
    lineHeight: 40,
  },
  mobileAuth: {
    ...appStyles.h1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  confirmList: {
    flexDirection: 'row',
    height: 46,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 0.5,
    paddingHorizontal: 20,
  },
  confirm: {
    width: '100%',
    height: 52,
    backgroundColor: colors.clearBlue,
    justifyContent: 'flex-end',
  },
  divider: {
    marginTop: 30,
    width: '100%',
    height: 10,
    backgroundColor: '#f5f5f5',
  },
  field: {
    width: '100%',
  },
  button: {
    width: '70%',
  },
  text: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.white,
  },
  container: {
    paddingTop: 20,
    flex: 1,
    alignContent: 'stretch',
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  smsButtonText: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    color: colors.white,
  },
  inputStyle: {
    flex: 1,
    marginRight: 10,
    paddingBottom: 9,
  },
  emptyInput: {
    borderBottomColor: colors.lightGrey,
  },
  confirmItem: {
    ...appStyles.normal14Text,
    textAlignVertical: 'bottom',
    lineHeight: 19,
  },
  rowStyle: {
    flexDirection: 'row',
    flex: 1,
  },
  id: {
    ...appStyles.normal22Text,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  flexStyle: {
    flex: 1,
  },
});

type ConfirmItem = {
  key: string;
  list: {color: string; text: string}[];
  navi: {
    route: string;
    param: {key: string; title: string};
  };
};

const RegisterMobileListItem0 = ({
  item,
  confirm,
  onPress,
  onMove,
}: {
  item: ConfirmItem;
  onPress: (k: string) => void;
  onMove: (
    k: string,
    route: string,
    param: {key: string; title: string},
  ) => () => void;
  confirm: ImmutableMap<string, boolean>;
}) => {
  const confirmed = confirm.get(item.key);
  const navi = item.navi || {};

  return (
    <View style={styles.confirmList}>
      <TouchableOpacity
        onPress={() => onPress(item.key)}
        activeOpacity={1}
        style={{paddingVertical: 13}}>
        <AppIcon
          style={{marginRight: 10}}
          name="btnCheck2"
          checked={confirmed}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onMove(item.key, navi.route, navi.param)}
        activeOpacity={1}
        style={[styles.rowStyle, {paddingVertical: 13}]}>
        <View style={styles.rowStyle}>
          {item.list.map((elm, idx) => (
            <AppText
              key={`${idx}`}
              style={[styles.confirmItem, {color: elm.color}]}>
              {elm.text}
            </AppText>
          ))}
        </View>
        <AppIcon
          style={{marginRight: 10, marginTop: 5}}
          name="iconArrowRight"
        />
      </TouchableOpacity>
    </View>
  );
};

const RegisterMobileListItem = memo(RegisterMobileListItem0);

type RegisterMobileScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'RegisterMobile'
>;

type RegisterMobileScreenRouteProp = RouteProp<
  HomeStackParamList,
  'RegisterMobile'
>;

type RegisterMobileScreenProps = {
  account: AccountModelState;
  pending: boolean;
  focused: boolean;
  onSubmit: () => void;

  navigation: RegisterMobileScreenNavigationProp;
  route: RegisterMobileScreenRouteProp;

  actions: {
    account: AccountAction;
    cart: CartAction;
  };
};

type RegisterMobileScreenState = {
  loading: boolean;
  pin?: string;
  mobile?: string;
  authorized?: boolean;
  authNoti: boolean;
  timeout: boolean;
  confirm: ImmutableMap<string, boolean>;
  newUser: boolean;
  emailValidation: {
    isValid: boolean;
    error: any;
  };
  darkMode: boolean;
  socialLogin: boolean;
  email?: string;
  profileImageUrl?: string;
  isFocused?: boolean;
};

const initialState: RegisterMobileScreenState = {
  loading: false,
  pin: undefined,
  mobile: undefined,
  authorized: undefined,
  authNoti: false,
  timeout: false,
  confirm: ImmutableMap({
    0: false,
    1: false,
    2: false,
  }),
  newUser: false,
  emailValidation: {
    isValid: false,
    error: undefined,
  },
  darkMode: Appearance.getColorScheme() === 'dark',
  socialLogin: false,
  isFocused: true,
};

class RegisterMobileScreen extends Component<
  RegisterMobileScreenProps,
  RegisterMobileScreenState
> {
  email: React.RefObject<InputEmailRef>;

  authInputRef: React.RefObject<TextInput>;

  mounted: boolean;

  controller: AbortController;

  confirmList: ConfirmItem[];

  constructor(props: RegisterMobileScreenProps) {
    super(props);

    this.state = initialState;

    this.email = React.createRef();

    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onAuth = this.onAuth.bind(this);

    this.authInputRef = React.createRef();
    this.mounted = false;
    this.controller = new AbortController();
    this.confirmList = [
      ['contract', 'mandatory', 'setting:contract'],
      ['personalInfo', 'mandatory', 'setting:privacy'],
    ]
      .concat(
        (!esimGlobal && [['marketing', 'optional', 'mkt:agreement']]) || [],
      )
      .map((v, i) => ({
        key: `${i}`,
        list: [
          {
            color: colors.warmGrey,
            text: i18n.t(`cfm:${v[0]}`),
          },
          {
            color: v[1] === 'mandatory' ? colors.clearBlue : colors.warmGrey,
            text: i18n.t(`cfm:${v[1]}`),
          },
        ],
        navi: {
          route: 'SimpleTextForAuth',
          param: {key: v[2], title: i18n.t(`cfm:${v[0]}`)},
        },
      }));
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentDidUpdate(
    prevProps: RegisterMobileScreenProps,
    prevState: RegisterMobileScreenState,
  ) {
    if (this.props.account !== prevProps.account) {
      if (this.props.account.loggedIn) {
        this.props.navigation.navigate('Main');
      }
    }

    if (!this.props.pending && this.props.pending !== prevProps.pending) {
      if (this.props.account.loggedIn) {
        if (this.mounted) {
          this.setState({authorized: true});
        }
        this.props.navigation.navigate('Main', {
          screen: 'MyPageStack',
          params: {
            screen: 'MyPage',
          },
        });
      } else {
        AppAlert.error(i18n.t('reg:failedToLogIn'));
      }
    }
    if (prevState.isFocused !== this.state.isFocused) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({isFocused: true});
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.controller.abort();
  }

  onSubmit = async () => {
    const {email, domain} = this.email.current?.getValue() || {};
    const {pin, mobile, confirm, loading} = this.state;

    const error = validationUtil.validate('email', `${email}@${domain}`);
    let isValid = true;

    if (loading || this.props.pending) return;

    this.setState({loading: true});

    try {
      if (!_.isEmpty(error)) {
        isValid = false;
        this.setState({emailValidation: {isValid, error: error?.email[0]}});
      } else {
        const resp = await API.User.confirmEmail({email: `${email}@${domain}`});

        if (!this.mounted) return;

        isValid = resp.result === 0;
        if (resp.result !== 0) {
          // duplicated email error
          if (
            resp.result !== API.default.E_RESOURCE_NOT_FOUND ||
            !resp.message?.includes('Duplicate')
          ) {
            // dulicated email 이외의 에러인 경우, throw error
            console.log('confirm email failed', resp);
            throw new Error('failed to confirm email');
          }
        }
        console.log('@@@ confirm email', resp);

        // 정상이거나, duplicated email 인 경우는 화면 상태 갱신 필요
        this.setState({
          emailValidation: {
            isValid,
            error: isValid ? undefined : i18n.t('acc:duplicatedEmail'),
          },
        });
      }

      if (isValid && this.mounted) {
        const resp = await API.User.signUp({
          user: mobile,
          pass: pin,
          email: `${email}@${domain}`,
          mktgOptIn: confirm.get('2'),
        });

        if (resp.result === 0 && !_.isEmpty(resp.objects)) {
          this.signIn({mobile, pin});
        } else {
          console.log('sign up failed', resp);
          throw new Error('failed to login');
        }
      }
    } catch (err) {
      console.log('sign up failed', err);
      AppAlert.error(i18n.t('reg:fail'));
    }

    if (this.mounted) {
      this.setState({loading: false});
    }
  };

  onCancel = () => {
    this.props.onSubmit();
  };

  onChangeText = (key: keyof RegisterMobileScreenState) => (value: string) => {
    const {authorized} = this.state;

    const val = {
      [key]: value,
    };

    if (key === 'mobile') {
      const error = validationUtil.validate('mobileSms', `${value}`);
      if (authorized) return;

      if (!_.isEmpty(error)) {
        AppAlert.error(
          i18n.t('reg:invalidTelephone'),
          i18n.t('reg:unableToSendSms'),
        );
      } else {
        this.setState({
          pin: undefined,
          authorized: undefined,
          timeout: true,
        });

        API.User.sendSms({user: value, abortController: this.controller})
          .then((resp) => {
            // bhtak
            // temporary
            if (resp.result === 0 || !isProduction) {
              this.setState({
                authNoti: true,
                timeout: false,
              });
              this.authInputRef.current?.focus();
            } else {
              console.log('send sms failed', resp);
              throw new Error('failed to send sms');
            }
          })
          .catch((err) => {
            console.log('send sms failed', err);
            AppAlert.error(
              i18n.t('reg:failedToSendSms'),
              i18n.t('reg:unableToSendSms'),
            );
          });
      }
    }

    this.setState(val);
  };

  onPressPin = (value: string) => {
    const {mobile, authorized} = this.state;
    const pin = value;
    // PIN이 맞는지 먼저 확인한다.

    console.log('@@@ press pin', mobile, value);

    if (!isProduction) {
      // bhtak, temporary
      this.signIn({mobile, pin}).then((resp) => {
        if (resp.result < 0) {
          this.setState({newUser: true, authorized: true});
        }
      });
      return;
    }

    if (authorized) return;

    this.setState({loading: true});

    API.User.confirmSmsCode({
      user: mobile,
      pass: pin,
      abortController: this.controller,
    })
      .then((resp) => {
        if (this.mounted) {
          this.setState({loading: false});
        }

        if (resp.result === 0 && this.mounted) {
          this.setState({
            authorized: _.isEmpty(resp.objects) ? true : undefined,
            newUser: _.isEmpty(resp.objects),
            pin,
          });

          if (!_.isEmpty(resp.objects)) {
            this.signIn({mobile, pin});
          } else {
            this.email.current?.focus();
          }
        } else {
          console.log('sms confirmation failed', resp);
          throw new Error('failed to send sms');
        }
      })
      .catch((err) => {
        console.log('sms confirmation failed', err);

        if (!this.mounted) return;

        this.setState({
          authorized: false,
        });
      });
  };

  onPress = (key: string) => {
    const {confirm} = this.state;

    this.setState({
      confirm: confirm.update(key, (value) => !value),
    });
  };

  onMove = (key: string, route: string, param: object) => () => {
    if (!_.isEmpty(route)) {
      this.props.navigation.navigate(route, param);
    }
  };

  onAuth = async ({
    authorized,
    user,
    pass,
    email,
    mobile,
    profileImageUrl,
  }: {
    authorized: boolean;
    user: string;
    pass: string;
    email?: string;
    mobile?: string;
    profileImageUrl?: string;
  }) => {
    this.setState({loading: true});

    const resp = await API.User.socialLogin({
      user,
      pass,
      kind: 'ios',
      mobile,
    });

    this.setState({loading: false});

    if (resp.result === 0) {
      const {mobile: drupalId, newUser} = resp.objects[0];

      this.setState({
        newUser,
        mobile: drupalId,
        pin: pass,
        authorized,
        email,
        socialLogin: true,
        profileImageUrl,
      });

      if (newUser) {
        // new login
        // create account
        this.email.current?.focus();
      } else {
        // account exist. try login
        this.signIn({mobile: drupalId, pin: pass});
      }
    }
  };

  signIn = async ({
    mobile,
    pin,
  }: {
    mobile?: string;
    pin?: string;
  }): Promise<ApiResult<any>> => {
    const {payload: resp} = await this.props.actions.account.logInAndGetAccount(
      {
        mobile,
        pin,
      },
    );

    console.log('@@@ login', resp);
    if (resp.result === 0) {
      const profileImage: RkbImage = await utils.convertURLtoRkbImage(
        this.state.profileImageUrl!,
      );
      if (profileImage) {
        this.props.actions.account.uploadAndChangePicture(profileImage);
      }
      this.props.actions.cart.cartFetch();
    }
    return resp;
  };

  onTimeout = () => {
    this.setState({
      timeout: true,
    });
  };

  renderItem({item}: {item: ConfirmItem}) {
    return (
      <RegisterMobileListItem
        key={item.key}
        item={item}
        confirm={this.state.confirm}
        onPress={this.onPress}
        onMove={this.onMove}
      />
    );
  }

  renderTitle = () => (
    <AppText style={styles.title}>{i18n.t('mobile:title')}</AppText>
  );

  renderProfile = (
    email?: string,
    mobile?: string,
    profileImageUrl?: string,
  ) => (
    <View style={{marginTop: 30}}>
      <Profile email={email} mobile={mobile} userPictureUrl={profileImageUrl} />
    </View>
  );

  renderInput = () => {
    const {mobile, timeout, isFocused, authNoti, authorized, loading} =
      this.state;
    const editablePin = !!mobile && authNoti && !authorized && !loading;

    return (
      <View key="mobile">
        <AppText style={styles.mobileAuth}>
          {i18n.t('mobile:easyLogin')}
        </AppText>
        {isFocused && (
          <InputMobile
            style={{marginTop: 30, paddingHorizontal: 20}}
            onPress={this.onChangeText('mobile')}
            authNoti={authNoti}
            disabled={(authNoti && authorized) || loading}
            authorized={authorized}
          />
        )}

        {isFocused && (
          <InputPinInTime
            style={{marginTop: 20, paddingHorizontal: 20}}
            forwardRef={this.authInputRef}
            editable={editablePin}
            // clickable={editablePin && !timeout}
            clickable
            authorized={mobile ? authorized : undefined}
            countdown={authNoti && !authorized && !timeout}
            onTimeout={this.onTimeout}
            onPress={this.onPressPin}
            duration={180}
          />
        )}
      </View>
    );
  };

  renderLogin = () => {
    const {newUser} = this.state;
    return (
      <View style={{flex: 1}}>
        {this.renderTitle()}
        {!esimGlobal && this.renderInput()}
        {!newUser && (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <SocialLogin onAuth={this.onAuth} />
          </View>
        )}
        {esimGlobal && (
          <View
            key="imgRokebi"
            style={{justifyContent: 'flex-end', paddingBottom: 52}}>
            <AppIcon name="textLogo" />
          </View>
        )}
      </View>
    );
  };

  render() {
    const {
      mobile,
      authorized,
      confirm,
      newUser,
      emailValidation,
      loading,
      darkMode,
      email,
      socialLogin,
      profileImageUrl,
    } = this.state;
    const {isValid, error} = emailValidation || {};
    const disableButton =
      !authorized || (newUser && !(confirm.get('0') && confirm.get('1')));

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={darkMode ? 'dark-content' : 'light-content'} />

        <AppBackButton
          title={i18n.t('mobile:header')}
          onPress={() => {
            this.setState({
              ...initialState,
              isFocused: false,
            });
            if (!socialLogin) this.props.navigation.goBack();
          }}
        />
        <KeyboardAwareScrollView
          contentContainerStyle={[
            {
              flexDirection: 'column',
              alignContent: 'stretch',
            },
            !socialLogin && !newUser && styles.flexStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          resetScrollToCoords={{x: 0, y: 0}}>
          {socialLogin
            ? this.renderProfile(email, mobile, profileImageUrl)
            : this.renderLogin()}

          {newUser && authorized && (
            <View>
              <InputEmail
                email={email}
                style={{
                  marginTop: socialLogin ? 20 : 38,
                  paddingHorizontal: 20,
                }}
                inputRef={this.email}
              />

              <AppText
                style={[styles.helpText, {color: colors.errorBackground}]}>
                {isValid ? null : error}
              </AppText>
              <View key="divider" style={styles.divider} />

              {this.confirmList.map((item) => this.renderItem({item}))}
            </View>
          )}
        </KeyboardAwareScrollView>
        {newUser && authorized && (
          <AppButton
            style={styles.confirm}
            title={i18n.t('ok')}
            titleStyle={styles.text}
            disabled={disableButton}
            disableColor={colors.black}
            disableBackgroundColor={colors.lightGrey}
            onPress={this.onSubmit}
          />
        )}

        <AppActivityIndicator visible={this.props.pending || loading} />
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, status}: RootState) => ({
    account,
    pending:
      status.pending[accountActions.logInAndGetAccount.typePrefix] || false,
  }),
  (dispatch) => ({
    actions: {
      account: bindActionCreators(accountActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
    },
  }),
)(RegisterMobileScreen);
