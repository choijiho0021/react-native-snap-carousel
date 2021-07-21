import React, {Component, memo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  Appearance,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import _ from 'underscore';
import {Map as ImmutableMap} from 'immutable';
import {bindActionCreators} from 'redux';
import {API} from '@/submodules/rokebi-utils';

import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppButton from '@/components/AppButton';
import AppBackButton from '@/components/AppBackButton';
import AppAlert from '@/components/AppAlert';
import AppIcon from '@/components/AppIcon';
import InputMobile from '@/components/InputMobile';
import InputEmail from '@/components/InputEmail';
import {colors} from '@/constants/Colors';
import validationUtil from '@/utils/validationUtil';
import InputPinInTime from '@/components/InputPinInTime';
import {RootState} from '@/redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigation/navigation';
import {RouteProp} from '@react-navigation/native';

const styles = StyleSheet.create({
  helpText: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    marginTop: 13,
    marginLeft: 30,
  },
  title: {
    ...appStyles.h1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  confirmList: {
    flexDirection: 'row',
    height: 46,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 0.5,
    // paddingVertical: 13,
  },
  confirm: {
    width: '100%',
    height: 52,
    backgroundColor: colors.clearBlue,
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
    justifyContent: 'flex-start',
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
});

type ConfirmItem = {
  key: string;
  list: {color: string; text: string}[];
  navi: {
    route: string;
    param: {key: string; title: string};
  };
};

const confirmList: ConfirmItem[] = [
  {
    key: '0',
    list: [
      {color: colors.warmGrey, text: i18n.t('cfm:contract')},
      {color: colors.clearBlue, text: i18n.t('cfm:mandatory')},
    ],
    navi: {
      route: 'SimpleTextForAuth',
      param: {key: 'setting:contract', title: i18n.t('cfm:contract')},
    },
  },
  {
    key: '1',
    list: [
      {color: colors.warmGrey, text: i18n.t('cfm:personalInfo')},
      {color: colors.clearBlue, text: i18n.t('cfm:mandatory')},
    ],
    navi: {
      route: 'SimpleTextForAuth',
      param: {key: 'setting:privacy', title: i18n.t('cfm:personalInfo')},
    },
  },
  {
    key: '2',
    list: [
      {color: colors.warmGrey, text: i18n.t('cfm:marketing')},
      {color: colors.warmGrey, text: i18n.t('cfm:optional')},
    ],
    navi: {
      route: 'SimpleTextForAuth',
      param: {key: 'mkt:agreement', title: i18n.t('cfm:marketing')},
    },
  },
];

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
            <Text
              key={`${idx}`}
              style={[styles.confirmItem, {color: elm.color}]}>
              {elm.text}
            </Text>
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
};

class RegisterMobileScreen extends Component<
  RegisterMobileScreenProps,
  RegisterMobileScreenState
> {
  email: React.RefObject<TextInput>;

  authInputRef: React.RefObject<TextInput>;

  mounted: boolean;

  controller: AbortController;

  constructor(props: RegisterMobileScreenProps) {
    super(props);

    this.state = initialState;

    this.email = React.createRef();

    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.focusAuthInput = this.focusAuthInput.bind(this);
    this.focusEmailInput = this.focusEmailInput.bind(this);
    this.onPress = this.onPress.bind(this);

    this.authInputRef = React.createRef();
    this.mounted = false;
    this.controller = new AbortController();
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('mobile:header')} />,
    });

    this.mounted = true;
  }

  componentDidUpdate(prevProps: RegisterMobileScreenProps) {
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
        this.props.navigation.navigate('Main');
      } else {
        AppAlert.error(i18n.t('reg:failedToLogIn'));
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.controller.abort();
  }

  onSubmit = async () => {
    const {email, domain} = this.email.current?.state;
    const {pin, mobile, confirm, loading} = this.state;

    const error = validationUtil.validate('email', `${email}@${domain}`);
    let isValid = true;

    if (loading || this.props.pending) return;

    this.setState({loading: true});

    try {
      if (!_.isEmpty(error)) {
        isValid = false;
        this.setState({emailValidation: {isValid, error: error.email[0]}});
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
            // bhtak, temporary
            // if (resp.result === 0) {
            this.setState({
              authNoti: true,
              timeout: false,
            });

            this.focusAuthInput();
            // } else {
            //   console.log('send sms failed', resp);
            //   throw new Error('failed to send sms');
            // }
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

    // bhtak, temporary
    this.signIn({mobile, pin});
    return;

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
            this.focusEmailInput();
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

  signIn = ({mobile, pin}: {mobile: string; pin: string}) => {
    this.props.actions.account
      .logInAndGetAccount({mobile, pin})
      .then((_) => this.props.actions.cart.cartFetch());
  };

  onTimeout = () => {
    this.setState({
      timeout: true,
    });
  };

  focusAuthInput() {
    this.authInputRef.current?.focus();
  }

  focusEmailInput() {
    this.email.current?.focusInput();
  }

  renderItem({item}: {item: ConfirmItem}) {
    return (
      <RegisterMobileListItem
        item={item}
        confirm={this.state.confirm}
        onPress={this.onPress}
        onMove={this.onMove}
      />
    );
  }

  render() {
    const {
      mobile,
      authorized,
      confirm,
      authNoti,
      newUser,
      timeout,
      emailValidation,
      loading,
      darkMode,
    } = this.state;
    const {isValid, error} = emailValidation || {};
    const disableButton =
      !authorized || (newUser && !(confirm.get('0') && confirm.get('1')));
    const editablePin = mobile && authNoti && !authorized && !loading;

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'never', bottom: 'always'}}>
        <StatusBar barStyle={darkMode ? 'dark-content' : 'light-content'} />
        <Text style={styles.title}>{i18n.t('mobile:title')}</Text>

        <InputMobile
          style={{marginTop: 30, paddingHorizontal: 20}}
          onPress={this.onChangeText('mobile')}
          authNoti={authNoti}
          disabled={(authNoti && authorized) || loading}
          authorized={authorized}
          timeout={timeout}
        />

        <InputPinInTime
          style={{marginTop: 26, paddingHorizontal: 20}}
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

        <View style={{flex: 1}}>
          {newUser && authorized && (
            <View style={{flex: 1}}>
              <InputEmail
                style={{marginTop: 38, paddingHorizontal: 20}}
                ref={this.email}
              />

              <Text style={[styles.helpText, {color: colors.errorBackground}]}>
                {isValid ? null : error}
              </Text>

              <View key="divider" style={styles.divider} />

              <View key="list" style={{paddingHorizontal: 20, flex: 1}}>
                <FlatList
                  data={confirmList}
                  renderItem={this.renderItem}
                  extraData={confirm}
                />
              </View>

              <View key="button">
                <AppButton
                  style={styles.confirm}
                  title={i18n.t('ok')}
                  titleStyle={styles.text}
                  disabled={disableButton}
                  disableColor={colors.black}
                  disableBackgroundColor={colors.lightGrey}
                  onPress={this.onSubmit}
                />
              </View>
            </View>
          )}
        </View>

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
