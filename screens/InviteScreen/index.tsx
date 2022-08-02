import Clipboard from '@react-native-community/clipboard';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
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
import AppSnackBar from '@/components/AppSnackBar';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
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
  highlighter: {
    ...appStyles.bold18Text,
    lineHeight: 20,
    color: colors.blue,
  },
  cashText: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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

type InviteScreenProps = {
  navigation: InviteScreenNavigationProp;

  promotion: PromotionModelState;
  account: AccountModelState;

  action: {
    promotion: PromotionAction;
  };
};

const InviteScreen: React.FC<InviteScreenProps> = ({
  navigation,
  promotion,
  account,
  action,
}) => {
  const [showSnackBar, setShowSnackbar] = useState(false);

  const mountWithLogin = useCallback(() => {
    action.promotion.getPromotionStat();

    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('inv:title')} />,
    });
  }, [action.promotion, navigation]);

  useEffect(() => {
    if (!account.loggedIn && navigation.isFocused()) {
      navigation.navigate('Auth', {
        screen: 'RegisterMobile',
        params: {
          screen: 'Invite',
        },
      });
    } else {
      mountWithLogin();
    }
  }, [account.loggedIn, mountWithLogin, navigation]);

  useEffect(() => {
    if (account.loggedIn && navigation.isFocused()) {
      mountWithLogin();
    }
  }, [account.loggedIn, mountWithLogin, navigation]);

  const cashText = useCallback(
    (text: string, cash: string) => (
      <AppStyledText
        text={text}
        textStyle={styles.bold24WhiteText}
        format={{b: styles.bold36whiteText}}
        data={{cash}}
      />
    ),
    [],
  );

  const highLightCash = useCallback(
    (v: string, isLast: boolean, gift: string) => {
      const cash = utils.stringToNumber(gift) || 0;
      return (
        <View
          key={v}
          style={[isLast ? styles.highLightRow : {marginBottom: 20}]}>
          <View style={{flexDirection: 'column'}}>
            <AppStyledText
              text={v}
              textStyle={appStyles.normal18Text}
              format={{b: styles.highlighter}}
            />

            <View style={[styles.rowCenter, !isLast && {marginTop: 8}]}>
              <AppText style={appStyles.normal16Text}>
                {i18n.t('inv:lower4')}
              </AppText>

              <View style={styles.cashBox}>
                <AppText
                  key="1"
                  style={[
                    appStyles.bold24Text,
                    {marginRight: 20, color: colors.clearBlue},
                  ]}>
                  {isLast
                    ? utils.numberToCommaString(cash * 10)
                    : utils.numberToCommaString(cash)}
                </AppText>
                <AppText
                  key="2"
                  style={[appStyles.normal14Text, {color: colors.warmGrey}]}>
                  {i18n.t('inv:lower5')}
                </AppText>
              </View>
            </View>
          </View>
          {isLast && <AppIcon name="coin" />}
        </View>
      );
    },
    [],
  );

  const sendLink = useCallback(
    async (method: string) => {
      const {invite, stat} = promotion;
      const {userId} = account;

      if (userId && invite?.rule) {
        switch (method) {
          case 'copy': {
            API.Promotion.buildLink({
              recommender: userId,
              cash: stat.signupGift,
              imageUrl: invite.rule?.share,
            }).then((url) => {
              if (url) {
                Clipboard.setString(url);
                setShowSnackbar(true);
              }
            });
            break;
          }
          default:
            // share
            await API.Promotion.invite(userId, stat.signupGift, invite.rule);
            break;
        }
      }
    },
    [account, promotion],
  );

  const statBox = useCallback(() => {
    const {stat} = promotion;
    return (
      <View style={styles.benefitBox}>
        {Object.keys(stat)?.map(
          (v, idx) =>
            !v.includes('Gift') && (
              <View
                key={v}
                style={[idx ? styles.rightBox : styles.leftBox, {flex: 1}]}>
                <AppText key="1" style={appStyles.normal14Text}>
                  {i18n.t(`inv:${v}`)}
                </AppText>
                <AppText key="2" style={appStyles.robotoBold32Text}>
                  {utils.numberToCommaString(stat[v] || 0)}
                  <AppText
                    style={[appStyles.bold24Text, {color: colors.clearBlue}]}>
                    {i18n.t(`inv:${v}Unit`)}
                  </AppText>
                </AppText>
              </View>
            ),
        )}
      </View>
    );
  }, [promotion]);

  const {signupGift, recommenderGift} = promotion.stat;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.blueBg}>
          <AppText style={[appStyles.normal20Text, {color: colors.white}]}>
            {i18n.t('inv:upper1')}
          </AppText>
          {cashText(
            i18n.t('inv:upper2'),
            utils.numberToCommaString(recommenderGift),
          )}
          {cashText(
            i18n.t('inv:upper3'),
            utils.numberToCommaString(signupGift),
          )}
          <AppText style={styles.blueBgDetailText}>
            {i18n.t('inv:upper4')}
          </AppText>
          <AppIcon name="inviteRokebi1" />
        </View>

        <View style={styles.shareBg}>
          <AppButton
            iconName="iconShare"
            iconStyle={{marginRight: 10}}
            title={i18n.t('inv:share')}
            titleStyle={appStyles.medium18}
            type="primary"
            onPress={() => sendLink('share')}
            viewStyle={styles.rowCenter}
            style={{
              height: 62,
              marginBottom: 16,
              backgroundColor: colors.clearBlue,
            }}
          />
          <AppButton
            iconName="iconCopy"
            iconStyle={{marginRight: 10}}
            title={i18n.t('inv:copy')}
            titleStyle={[appStyles.medium18, {color: colors.black}]}
            type="secondary"
            onPress={() => sendLink('copy')}
            viewStyle={styles.rowCenter}
            style={{height: 62, borderWidth: 1, borderColor: colors.lightGrey}}
          />
        </View>

        <View style={styles.cashBg}>
          <AppText style={[appStyles.bold24Text, {marginBottom: 30}]}>
            {i18n.t('inv:lower1')}
          </AppText>
          {['inv:lower2', 'inv:lower3'].map((k, idx) =>
            highLightCash(i18n.t(k), idx === 1, recommenderGift),
          )}
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
          {statBox()}
          <AppText style={styles.withdrawal}>
            {i18n.t('inv:withdrawalInfo')}
          </AppText>
        </View>
      </ScrollView>
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('inv:copyMsg')}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({account, promotion}: RootState) => ({
    account,
    promotion,
  }),
  (dispatch) => ({
    action: {
      promotion: bindActionCreators(promotionActions, dispatch),
    },
  }),
)(InviteScreen);
