import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import utils from '../utils/utils';
import moment from 'moment-with-locales-es6'
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import LabelText from '../components/LabelText';

class UsageDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('his:detail')} />
  })

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    moment.locale(i18n.locale)

    const detail = this.props.navigation.getParam('detail')
    this.setState(detail)
  }

  render() {
    const {prodName, activationDate, termDate, expireDate, purchaseDate} = this.state || {}

    return (
      <View style={styles.container}>
        <Text style={styles.notice}>{i18n.t('his:timeStd')}</Text>
        <Text style={styles.title}>{prodName}</Text>
        <View style={styles.divider} />
        <LabelText style={styles.info} 
          label={i18n.t('his:purchaseDate')} value={moment(purchaseDate).format('LLL')} />
        <LabelText style={styles.info} 
          label={i18n.t('his:activationDate')} value={moment(activationDate).format('LLL')} />
        <LabelText style={styles.info} 
          label={i18n.t('his:termDate')} value={moment(termDate).format('LLL')} />
        <LabelText style={styles.info} 
          label={i18n.t('his:expireDate')} value={moment(expireDate).format('LL')} />
      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  notice: {
    ... appStyles.normal14Text,
    marginTop: 40,
    marginLeft: 20,
    color: colors.warmGrey
  },
  title: {
    ... appStyles.normal20Text,
    marginTop: 10,
    marginHorizontal: 20
  },
  divider: {
    marginTop: 40,
    marginBottom: 40,
    height: 10,
    backgroundColor: colors.whiteTwo
  },
  value: {
    ... appStyles.normal16Text,
    color: colors.black,
  },
  label: {
    ... appStyles.normal14Text,
    color: colors.warmGrey
  },
  info: {
    height: 36,
    marginHorizontal: 20
  }
});

export default UsageDetailScreen