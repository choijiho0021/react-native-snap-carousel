import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import _ from 'underscore';
import Analytics from 'appcenter-analytics';
import i18n from '../../../utils/i18n';
import utils from '../../../utils/utils';
import {appStyles} from '../../../constants/Styles';
import {colors} from '../../../constants/Colors';
import AppButton from '../../../components/AppButton';
import LabelText from '../../../components/LabelText';

const styles = StyleSheet.create({
  headerBox: {
    backgroundColor: colors.clearBlue,
    paddingHorizontal: 20,
  },
  changeBorder: {
    borderWidth: 1,
    borderColor: colors.white,
    paddingRight: 9,
    paddingLeft: 7,
    borderRadius: 11.5,
    height: 25,
  },
  box: {
    marginBottom: 5,
  },
  normal14White: {
    ...appStyles.normal14Text,
    color: colors.white,
  },
  normal12White: {
    ...appStyles.normal12Text,
    color: colors.white,
  },
  rechargeBtn: {
    width: 160,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    marginBottom: 40,
    marginTop: 25,
  },
  rechargeBtnTitle: {
    ...appStyles.bold16Text,
    textAlign: 'center',
    color: colors.clearBlue,
  },
});

class CardInfo extends Component {
  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {iccid, balance} = nextProps;

    return iccid !== this.props.iccid || balance !== this.props.balance;
  }

  onPress() {
    Analytics.trackEvent('Page_View_Count', {page: 'Change Usim'});
    this.props.navigation.navigate('RegisterSim');
  }

  render() {
    const {iccid, balance, expDate} = this.props;

    return (
      <View>
        <View style={styles.headerBox}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 30,
              marginBottom: 10,
              justifyContent: 'space-between',
            }}>
            <Text
              style={[
                appStyles.bold16Text,
                {color: colors.white, height: 16, alignSelf: 'center'},
              ]}>
              {i18n.t('acc:balance')}
            </Text>
            <AppButton
              title={i18n.t('menu:change')}
              titleStyle={[appStyles.normal12Text, {color: colors.white}]}
              style={styles.changeBorder}
              onPress={this.onPress}
              iconName="iconRefresh"
              direction="row"
              size={16}
              iconStyle={{margin: 3}}
            />
          </View>
          {iccid && (
            <View>
              <View style={{flexDirection: 'row', marginBottom: 25}}>
                <Text style={[appStyles.bold30Text, {color: colors.white}]}>
                  {utils.numberToCommaString(balance)}
                </Text>
                <Text style={[appStyles.normal22Text, {color: colors.white}]}>
                  {i18n.t('won')}
                </Text>
              </View>

              <LabelText
                key="iccid"
                style={styles.box}
                format="shortDistance"
                label="ICCID"
                labelStyle={[
                  styles.normal14White,
                  {fontWeight: 'bold', marginRight: 10},
                ]}
                value={iccid ? utils.toICCID(iccid) : i18n.t('reg:card')}
                valueStyle={styles.normal14White}
              />

              <LabelText
                key="expDate"
                style={styles.box}
                format="shortDistance"
                label={i18n.t('acc:expDate')}
                labelStyle={[
                  styles.normal12White,
                  {fontWeight: 'bold', marginRight: 10},
                ]}
                value={expDate}
                valueStyle={styles.normal12White}
              />
            </View>
          )}
          <AppButton
            style={styles.rechargeBtn}
            onPress={() => this.props.navigation.navigate('Recharge')}
            title={i18n.t('recharge')}
            titleStyle={styles.rechargeBtnTitle}
          />
        </View>
        <View
          style={{backgroundColor: colors.whiteTwo, margin: 20, marginTop: 30}}>
          <Text style={{...appStyles.bold18Text}}>
            {i18n.t('usim:dataUsageList')}
          </Text>
        </View>
      </View>
    );
  }
}

export default CardInfo;
