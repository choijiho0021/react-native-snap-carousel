import Clipboard from '@react-native-community/clipboard';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {
  actions as toastActions,
  Toast,
  ToastAction,
} from '@/redux/modules/toast';
import {bindActionCreators} from 'redux';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {
  PromotionAction,
  PromotionModelState,
  actions as promotionActions,
} from '@/redux/modules/promotion';
import {AccountModelState} from '@/redux/modules/account';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import AppIcon from '@/components/AppIcon';

const styles = StyleSheet.create({
  copy: {
    height: 62,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  // 여기부터
  blueBg: {
    height: 435,
    paddingTop: 52,
    paddingHorizontal: 20,
    backgroundColor: colors.clearBlue,
  },
  shareBg: {
    marginVertical: 40,
    marginHorizontal: 20,
  },
  blueBgDetailText: {
    ...appStyles.normal16Text,
    color: colors.white,
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 22,
  },
  bold24WhiteText: {
    ...appStyles.bold24Text,
    color: colors.white,
    // lineHeight: 42,
  },
  bold36whiteText: {
    ...appStyles.robotoBold36Text,
    color: colors.white,
  },
  bold23Text: {
    ...appStyles.bold18Text,
    fontSize: 23,
    lineHeight: 38,
  },
  text: {
    ...appStyles.normal18Text,
    lineHeight: 20,
    color: colors.black,
  },
  highlighter: {
    ...appStyles.bold18Text,
    lineHeight: 20,
    color: colors.blue,
  },
  cashText: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  share: {
    height: 62,
    marginBottom: 16,
    backgroundColor: colors.clearBlue,
  },
  rowCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bold23Highlight: {
    ...appStyles.bold24Text,
    fontSize: 23,
    color: colors.clearBlue,
  },
  highLightRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 0,
  },
  cashBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    marginLeft: 10,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: colors.clearBlue,
    backgroundColor: colors.white,
  },
  cashBg: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    backgroundColor: colors.whiteTwo,
  },
  titleWithRokebi: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  benefitBox: {
    flex: 1,
    flexDirection: 'row',
    height: 125,
  },
  leftBox: {
    width: '37%',
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.paleBlue,
  },
  rightBox: {
    flex: 1,
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,
    backgroundColor: colors.paleGrey2,
  },
  statTitle: {
    ...appStyles.bold24Text,
    marginTop: 5,
    marginBottom: 15,
  },
  withdrawal: {
    ...appStyles.normal12Text,
    flex: 1,
    textAlign: 'left',
    marginTop: 15,
    marginBottom: 20,
    color: colors.warmGrey,
  },
});

type InviteScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Invite'
>;

type InviteScreenRouteProp = RouteProp<HomeStackParamList, 'Invite'>;

type InviteScreenProps = {
  navigation: InviteScreenNavigationProp;
  route: InviteScreenRouteProp;

  promotion: PromotionModelState;
  account: AccountModelState;

  pending: boolean;

  action: {
    promotion: PromotionAction;
    toast: ToastAction;
  };
};

type InviteScreenState = {};

class InviteScreen extends Component<InviteScreenProps, InviteScreenState> {
  constructor(props: InviteScreenProps) {
    super(props);

    this.state = {};

    this.mountWithLogin = this.mountWithLogin.bind(this);
    this.sendLink = this.sendLink.bind(this);
    this.statBox = this.statBox.bind(this);
  }

  componentDidMount() {
    const {navigation, account} = this.props;

    if (!account.loggedIn && navigation.isFocused()) {
      this.props.navigation.navigate('Auth', {
        screen: 'RegisterMobile',
        params: {
          screen: 'Invite',
        },
      });
    } else {
      this.mountWithLogin();
    }
  }

  shouldComponentUpdate(nextProps: InviteScreenProps) {
    return (
      this.props.account.loggedIn !== nextProps.account.loggedIn ||
      this.props.promotion.stat !== nextProps.promotion.stat
    );
  }

  componentDidUpdate(prevProps: InviteScreenProps) {
    const {navigation, account} = this.props;

    if (prevProps.account.loggedIn !== account.loggedIn) {
      if (account.loggedIn && navigation.isFocused()) {
        this.mountWithLogin();
      }
    }
  }

  cashText = (text: string, cash: string) => {
    return (
      <View key={text} style={styles.cashText}>
        {text.split('*').map((v, idx) => {
          return (
            <AppText style={styles.bold24WhiteText}>
              {idx === 1 && (
                <AppText style={styles.bold36whiteText}>{cash}</AppText>
              )}
              <AppText style={styles.bold24WhiteText}>{v}</AppText>
            </AppText>
          );
        })}
      </View>
    );
  };

  highLightCash = (
    highlight: string,
    text: string,
    isLast: boolean,
    cash: string,
  ) => {
    return (
      <View style={[isLast ? styles.highLightRow : {marginBottom: 20}]}>
        <View style={{flexDirection: 'column'}}>
          <AppText style={[appStyles.normal18Text, {flexDirection: 'row'}]}>
            <AppText style={styles.highlighter}>{highlight}</AppText>
            {text}
          </AppText>

          <View style={[styles.rowCenter, !isLast && {marginTop: 8}]}>
            <AppText style={appStyles.normal16Text}>
              {i18n.t('inv:lower4')}
            </AppText>

            <View style={styles.cashBox}>
              <AppText
                style={[
                  appStyles.bold24Text,
                  {marginRight: 20, color: colors.clearBlue},
                ]}>
                {isLast
                  ? utils.numberToCommaString(cash * 10)
                  : utils.numberToCommaString(cash)}
              </AppText>
              <AppText
                style={[appStyles.normal14Text, {color: colors.warmGrey}]}>
                {i18n.t('inv:lower5')}
              </AppText>
            </View>
          </View>
        </View>
        {isLast && <AppIcon name="coin" />}
      </View>
    );
  };

  mountWithLogin() {
    this.props.action.promotion.getPromotionStat();

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('inv:title')} />,
    });
  }

  async sendLink(method: string) {
    const {
      promotion: {invite, stat},
      account: {userId},
    } = this.props;

    if (userId && invite?.notice?.rule) {
      switch (method) {
        case 'copy': {
          API.Promotion.buildLink({
            recommender: userId,
            cash: stat.signupGift,
            imageUrl: invite.notice.rule?.share,
          }).then((url) => {
            if (url) {
              Clipboard.setString(url);
              this.props.action.toast.push(Toast.COPY_SUCCESS);
            }
          });
          break;
        }
        default:
          // share
          await API.Promotion.invite(
            userId,
            stat.signupGift,
            invite.notice.rule,
          );
          break;
      }
    }
  }

  statBox() {
    const {stat} = this.props.promotion;
    return (
      <View style={styles.benefitBox}>
        {Object.keys(stat)?.map((v, idx) => {
          return (
            !v.includes('Gift') && (
              <View key={v} style={[idx ? styles.rightBox : styles.leftBox]}>
                <AppText style={appStyles.normal14Text}>
                  {i18n.t(`inv:${v}`)}
                </AppText>
                <AppText style={appStyles.robotoBold32Text}>
                  {utils.numberToCommaString(stat[v] || 0)}
                  <AppText
                    style={[appStyles.bold24Text, {color: colors.clearBlue}]}>
                    {i18n.t(`inv:${v}Unit`)}
                  </AppText>
                </AppText>
              </View>
            )
          );
        })}
      </View>
    );
  }

  render() {
    const {signupGift, recommenderGift} = this.props.promotion.stat;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.blueBg}>
            <AppText style={[appStyles.normal20Text, {color: colors.white}]}>
              {i18n.t('inv:upper1')}
            </AppText>
            {this.cashText(
              i18n.t('inv:upper2'),
              utils.numberToCommaString(recommenderGift),
            )}
            {this.cashText(
              i18n.t('inv:upper3'),
              utils.numberToCommaString(signupGift),
            )}
            <AppText style={styles.blueBgDetailText}>
              {i18n.t('inv:upper4')}
            </AppText>
            <AppIcon name="inviteRokebi1" />
          </View>

          <View style={styles.shareBg}>
            {['share', 'copy'].map((v, idx) => {
              const iconName = `icon${v[0].toUpperCase()}${v.substr(1)}`;
              return (
                <AppButton
                  iconName={iconName}
                  iconStyle={{marginRight: 10}}
                  key={v}
                  title={i18n.t(`inv:${v}`)}
                  titleStyle={[
                    appStyles.confirmText,
                    !!idx && {color: colors.black},
                  ]}
                  onPress={() => this.sendLink(v)}
                  viewStyle={styles.rowCenter}
                  style={styles[v]}
                />
              );
            })}
          </View>

          <View style={styles.cashBg}>
            <AppText style={[appStyles.bold24Text, {marginBottom: 30}]}>
              {i18n.t('inv:lower1')}
            </AppText>
            {[i18n.t('inv:lower2'), i18n.t('inv:lower3')].map((v, idx) => {
              const str = v.split('*');
              return this.highLightCash(
                str[0],
                str[1],
                idx === 1,
                recommenderGift,
              );
            })}
          </View>

          <View style={{marginVertical: 80, marginHorizontal: 20}}>
            <View style={styles.titleWithRokebi}>
              <View>
                <AppText
                  style={{...appStyles.bold16Text, color: colors.clearBlue}}>
                  {i18n.t('inv:statDesc')}
                </AppText>
                <AppText style={styles.statTitle}>
                  {i18n.t('inv:statInv')}
                </AppText>
              </View>
              <AppIcon name="inviteRokebi2" />
            </View>
            {this.statBox()}
            <AppText style={styles.withdrawal}>
              {i18n.t('inv:withdrawalInfo')}
            </AppText>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, promotion}: RootState) => ({
    account,
    promotion,
  }),
  (dispatch) => ({
    action: {
      promotion: bindActionCreators(promotionActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(InviteScreen);
