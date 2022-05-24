import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Platform,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import ShortcutBadge from 'react-native-app-badge';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {actions as notiActions, NotiAction} from '@/redux/modules/noti';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import {API} from '@/redux/api';
import AppTextInput from '@/components/AppTextInput';
import AppModal from '@/components/AppModal';

const radioButtons = [
  {id: 'resign:reason1'},
  {id: 'resign:reason2'},
  {id: 'resign:reason3'},
  {id: 'resign:reason4'},
  {id: 'resign:reason5'},
  {id: 'resign:reason6'},
];

const styles = StyleSheet.create({
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  blueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 243,
    backgroundColor: colors.clearBlue,
  },
  radioBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 24,
    top: 156,
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  resignTitle: {
    ...appStyles.bold24Text,
    // color: colors.white,
    marginTop: 72,
    marginLeft: 20,
  },
  resignWhy: {
    ...appStyles.bold16Text,
    marginBottom: 4,
  },
  image: {
    marginTop: 52,
    marginRight: 32,
    justifyContent: 'flex-end',
  },
  confirmResign: {
    backgroundColor: colors.whiteTwo,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 48,
    marginTop: 480,
  },
  divider: {
    marginTop: 16,
    height: 2,
    marginBottom: 8,
    backgroundColor: colors.whiteTwo,
  },
  textInput: (editable) => ({
    paddingHorizontal: 16,
    paddingTop: 16,
    height: 88,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: editable ? colors.black : colors.lightGrey,
    backgroundColor: editable ? colors.white : colors.whiteTwo,
  }),
  button: (isConfirm) => ({
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: isConfirm ? colors.clearBlue : colors.lightGrey,
    color: isConfirm ? colors.white : colors.warmGrey,
    textAlign: 'center',
    color: '#ffffff',
  }),
  buttonTitle: (isConfirm) => ({
    ...appStyles.normal18Text,
    color: colors.white,
    textAlign: 'center',
    margin: 5,
    color: isConfirm ? colors.white : colors.warmGrey,
  }),
});

type ResignScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Settings'
>;

type ResignScreenRouteProp = RouteProp<HomeStackParamList, 'SimpleText'>;

type ResignScreenProps = {
  navigation: ResignScreenNavigationProp;
  route: ResignScreenRouteProp;
  account: AccountModelState;
  action: {
    account: AccountAction;
    cart: CartAction;
    order: OrderAction;
    noti: NotiAction;
  };
};

type ResignScreenState = {
  reasonIdx: number;
  otherReason: string;
  isConfirm: boolean;
  showModal: boolean;
};

class ResignScreen extends Component<ResignScreenProps, ResignScreenState> {
  constructor(props: ResignScreenProps) {
    super(props);

    this.state = {
      reasonIdx: 0,
      otherReason: '',
      isConfirm: false,
      showModal: false,
    };
    this.onPress = this.onPress.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount = async () => {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('resign')} />,
    });
  };

  async onPress() {
    const {uid, token} = this.props.account;
    const {reasonIdx, isConfirm, otherReason} = this.state;

    if (isConfirm) {
      await API.User.resign(
        {uid, token},
        reasonIdx === radioButtons.length - 1
          ? otherReason
          : i18n.t(radioButtons[this.state.reasonIdx].id),
      );

      this.setState({showModal: true});
    }
  }

  logout() {
    Promise.all([
      this.props.action.cart.reset(),
      this.props.action.order.reset(),
      this.props.action.noti.init({mobile: undefined}),
      this.props.action.account.logout(),
    ]).then(async () => {
      const isSignedin = await GoogleSignin.isSignedIn();
      if (Platform.OS === 'ios')
        PushNotificationIOS.setApplicationIconBadgeNumber(0);
      else {
        ShortcutBadge.setCount(0);
        if (isSignedin) {
          try {
            GoogleSignin.signOut();
          } catch (e) {
            console.error(e);
          }
        }
      }
      this.setState({showModal: false});
    });
  }

  render() {
    const {reasonIdx, otherReason, isConfirm, showModal} = this.state;
    const editable = reasonIdx === radioButtons.length - 1;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <AppActivityIndicator visible={this.props.pending} />
          <View style={styles.blueContainer}>
            <AppText style={[styles.resignTitle, {color: colors.white}]}>
              {i18n.t('resign:title')}
            </AppText>
            <Image
              style={{
                marginTop: 52,
                marginRight: 32,
                justifyContent: 'flex-end',
              }}
              source={require('../assets/images/esim/imgResignDokebi.png')}
              resizeMode="stretch"
            />
          </View>
          <View style={styles.radioBtnContainer}>
            <View style={{width: '100%'}}>
              <AppText style={styles.resignWhy}>{i18n.t('resign:why')}</AppText>
              <AppText style={appStyles.normal14Text}>
                {i18n.t('resign:info')}
              </AppText>
              <View style={styles.divider} />
              {radioButtons.map(({id}, idx) => (
                <Pressable
                  style={{flexDirection: 'row', paddingVertical: 16}}
                  key={id}
                  hitSlop={10}
                  onPress={() => this.setState({reasonIdx: idx})}>
                  <AppIcon
                    style={{marginRight: 6}}
                    name="radioBtn"
                    focused={idx === reasonIdx}
                  />
                  <AppText style={appStyles.normal16Text}>
                    {i18n.t(radioButtons[idx].id)}
                  </AppText>
                </Pressable>
              ))}
              <AppTextInput
                style={styles.textInput(editable)}
                multiline
                onChangeText={(v) => {
                  this.setState({otherReason: v});
                }}
                placeholder={i18n.t('resign:placeholder')}
                placeholderTextColor={colors.greyish}
                editable={editable}
                value={otherReason}
                // returnKeyType="done"
                // enablesReturnKeyAutomatically

                // maxLength={maxLength}
                // keyboardType={keyboardType}
                // value={value}
              />
            </View>
          </View>

          <View style={styles.confirmResign}>
            <AppText style={[appStyles.bold14Text, {marginBottom: 10}]}>
              {i18n.t('resign:why')}
            </AppText>
            {['1', '2', '3'].map((elm) => (
              <View style={{flexDirection: 'row', paddingRight: 20}}>
                <AppText
                  style={[
                    appStyles.normal14Text,
                    {width: 20, textAlign: 'center'},
                  ]}>
                  *
                </AppText>
                <AppText style={appStyles.normal14Text}>
                  {i18n.t(`resign:confirm${elm}`)}
                </AppText>
              </View>
            ))}

            <Pressable
              style={{flexDirection: 'row', paddingVertical: 16}}
              key={1}
              hitSlop={10}
              onPress={() =>
                this.setState((prevState) => ({
                  isConfirm: !prevState.isConfirm,
                }))
              }>
              <AppIcon
                style={{marginRight: 6}}
                name="btnCheck2"
                focused={isConfirm}
              />
              <AppText style={appStyles.normal16Text}>
                {i18n.t(`resign:isConfirm`)}
              </AppText>
            </Pressable>
          </View>

          <AppButton
            style={styles.button(isConfirm)}
            titleStyle={styles.buttonTitle(isConfirm)}
            disabled={!isConfirm}
            title={i18n.t('resign')}
            onPress={this.onPress}
          />
          <AppModal
            title={i18n.t('resign:finished')}
            type="info"
            onOkClose={this.logout}
            visible={showModal}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, status}: RootState) => ({
    account,
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
)(ResignScreen);
