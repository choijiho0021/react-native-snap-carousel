import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {
  AccountAction,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {actions as notiActions, NotiAction} from '@/redux/modules/noti';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import AppTextInput from '@/components/AppTextInput';
import AppButton from '@/components/AppButton';
import validationUtil, {ValidationResult} from '@/utils/validationUtil';

const styles = StyleSheet.create({
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  cancelButton: {
    width: 20,
    height: 20,
    backgroundColor: colors.white,
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  textInput: {
    ...appStyles.normal16Text,
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  label: {
    ...appStyles.normal14Text,
    marginTop: 14,
    color: colors.clearBlue,
  },
  error: {
    ...appStyles.normal14Text,
    color: colors.tomato,
    marginHorizontal: 30,
    marginTop: 10,
  },
  button: (isValid) => ({
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: isValid ? colors.clearBlue : colors.lightGrey,
    color: isValid ? colors.white : colors.warmGrey,
    textAlign: 'center',
    color: '#ffffff',
  }),
  buttonTitle: (isValid) => ({
    ...appStyles.normal18Text,
    textAlign: 'center',
    margin: 5,
    color: isValid ? colors.white : colors.warmGrey,
  }),
});

type ChangeEmailScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Settings'
>;

type ChangeEmailScreenRouteProp = RouteProp<HomeStackParamList, 'SimpleText'>;

type ChangeEmailScreenProps = {
  navigation: ChangeEmailScreenNavigationProp;
  route: ChangeEmailScreenRouteProp;

  isPushNotiEnabled?: boolean;
  loggedIn?: boolean;
  email?: string;

  pending: boolean;
  action: {
    cart: CartAction;
    order: OrderAction;
    account: AccountAction;
    noti: NotiAction;
  };
};

type ChangeEmailScreenState = {
  newEmail: string;
  inValid?: ValidationResult;
};

class ChangeEmailScreen extends Component<
  ChangeEmailScreenProps,
  ChangeEmailScreenState
> {
  constructor(props: ChangeEmailScreenProps) {
    super(props);

    this.state = {
      newEmail: '',
    };
    this.onChangeText = this.onChangeText.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
  }

  componentDidMount = async () => {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('set:changeMail')} />,
    });
  };

  componentDidUpdate() {}

  onChangeText = (v: string) => {
    this.setState({
      newEmail: v,
      inValid: validationUtil.validate('email', v),
    });
  };

  changeEmail() {
    const {newEmail} = this.state;
    const {email, navigation} = this.props;

    if (newEmail && email !== newEmail) {
      this.props.action.account.changeEmail(newEmail);
    }

    navigation.goBack();
  }

  render() {
    const {newEmail, inValid} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={{padding: 20, flex: 1}}>
          <AppText style={appStyles.normal14Text}>
            {i18n.t('changeEmail:using')}
          </AppText>
          <AppText
            style={{
              height: 46,
              marginTop: 4,
              marginBottom: 32,
              backgroundColor: colors.whiteTwo,
              paddingHorizontal: 15,
              paddingVertical: 12,
            }}>
            {this.props.email}
          </AppText>
          <AppText style={appStyles.normal14Text}>
            {i18n.t('changeEmail:new')}
          </AppText>
          <View style={styles.inputBox}>
            <AppTextInput
              style={styles.textInput}
              returnKeyType="done"
              enablesReturnKeyAutomatically
              onChangeText={this.onChangeText}
              maxLength={25}
              placeholder={i18n.t('changeEmail:placeholder')}
              value={newEmail}
            />
            <AppButton
              style={styles.cancelButton}
              iconName="btnCancel"
              onPress={() => this.onChangeText('')}
            />
          </View>
          <AppText style={styles.label}>{i18n.t('changeEmail:info')}</AppText>
          {inValid && (
            <AppText style={styles.label}>{inValid.email[0]}</AppText>
          )}
        </View>
        <AppButton
          style={styles.button(!inValid)}
          titleStyle={styles.buttonTitle(!inValid)}
          disabled={!!inValid}
          title={i18n.t('changeEmail:save')}
          onPress={this.changeEmail}
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, status}: RootState) => ({
    loggedIn: account.loggedIn,
    email: account.email,
    isPushNotiEnabled: account.isPushNotiEnabled,
    pending: status.pending[accountActions.logout.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
    },
  }),
)(ChangeEmailScreen);
