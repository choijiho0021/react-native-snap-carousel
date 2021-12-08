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

const styles = StyleSheet.create({
  copy: {
    ...appStyles.confirm,
    marginTop: 10,
    borderRadius: 3,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  // 여기부터
  bold23Text: {
    ...appStyles.bold18Text,
    fontSize: 23,
    lineHeight: 38,
  },
  text: {
    ...appStyles.normal16Text,
    lineHeight: 20,
    marginTop: 20,
    color: colors.warmGrey,
    textAlign: 'center',
  },
  highlighter: {
    ...appStyles.bold16Text,
    lineHeight: 20,
    color: colors.blue,
  },
  benefitBox: {
    flex: 1,
    flexDirection: 'row',
    height: 130,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boxDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.blue,
  },
  withdrawal: {
    flex: 1,
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 20,
    fontSize: 12,
  },
  statTitle: {
    ...appStyles.bold18Text,
    marginTop: 40,
    marginBottom: 20,
  },
  share: {
    borderRadius: 3,
    height: 52,
    borderWidth: 1,
    borderColor: colors.warmGrey,
  },
  bold23Highlight: {
    ...appStyles.bold18Text,
    color: colors.clearBlue,
    textAlign: 'center',
    fontSize: 23,
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
          API.Promotion.buildLink(
            userId,
            stat.signupGift,
            invite.notice.rule?.share,
          ).then((url) => {
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
              <View key={v} style={[styles.box, !idx && styles.boxDivider]}>
                <AppText style={appStyles.bold16Text}>
                  {i18n.t(`inv:${v}`)}
                </AppText>
                <AppText
                  style={[
                    appStyles.bold18Text,
                    {color: colors.clearBlue, fontSize: 26},
                  ]}>
                  {`${utils.numberToCommaString(stat[v] || 0)} ${i18n.t(
                    `inv:${v}Unit`,
                  )}`}
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{paddingHorizontal: 20}}>
          <AppText style={[styles.bold23Text, {marginTop: 20}]}>
            {[recommenderGift, signupGift].reduce((arr, cur) => {
              return arr.replace('*', utils.numberToCommaString(cur));
            }, i18n.t('inv:upper1'))}
          </AppText>
          <AppText style={styles.text}>
            {i18n.t('inv:upper2')}
            <AppText style={styles.highlighter}>{i18n.t('inv:upper3')}</AppText>
            {i18n.t('inv:upper4')}
          </AppText>

          <View style={{marginTop: 30}}>
            {['share', 'copy'].map((v, idx) => {
              return (
                <AppButton
                  key={v}
                  title={i18n.t(`inv:${v}`)}
                  titleStyle={[
                    appStyles.confirmText,
                    !idx && {color: colors.clearBlue},
                  ]}
                  onPress={() => this.sendLink(v)}
                  style={styles[v]}
                />
              );
            })}
          </View>

          <AppText style={[styles.text, {marginTop: 25, marginBottom: 30}]}>
            <AppText style={styles.highlighter}>{i18n.t('inv:lower1')}</AppText>
            {[recommenderGift, recommenderGift * 10].reduce((arr, cur) => {
              return arr.replace('*', utils.numberToCommaString(cur));
            }, i18n.t('inv:lower2'))}
          </AppText>

          <AppText style={styles.bold23Highlight}>
            {i18n.t('inv:lower3')}
          </AppText>

          <AppText style={styles.statTitle}>{i18n.t('inv:statInv')}</AppText>
          {this.statBox()}
          <AppText style={[styles.text, styles.withdrawal]}>
            {i18n.t('inv:withdrawalInfo')}
          </AppText>
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
