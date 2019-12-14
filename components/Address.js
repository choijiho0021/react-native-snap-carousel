import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import { colors } from '../constants/Colors';

const styles = StyleSheet.create({
  zip: {
    width: "10%",
    padding: 5
  },
  addr: {
    // width: "90%",
    // marginHorizontal: 20,
     marginVertical: 15,
    //  borderBottomWidth: 1,
    //  borderBottomColor: colors.lightGrey 
  },
  addrValue: {
    ... appStyles.normal14Text,
    lineHeight: 24,
    letterSpacing: 0.23
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 3
  },
  bdTitle: {
    ... appStyles.bold14Text,
    lineHeight: 24,
    letterSpacing: 0.23
  },
  roadBox: {
    width: 50,
    height: 20,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGrey,
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0.23,
    color: colors.warmGrey,
    textAlign: 'center'
  }
});



class Address extends PureComponent {
  render() {
    const {item} = this.props

    return (
      <View style={styles.itemRow, {marginHorizontal:20,      borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey }}>
        <View style={styles.addr}>
          
            <Text style={[styles.bdTitle,styles.itemRow]}>{item.bdNm}</Text>
            <View style={styles.itemRow}>
              <Text style={styles.addrValue}>{item.jibunAddr}</Text>
            </View>
            <View style={styles.itemRow}>
              <View style={{height:20}}>
                <Text style={styles.roadBox}>{i18n.t('addr:road')}</Text>
              </View>  
              <Text style={styles.addrValue}>  {item.roadAddr}</Text>
            </View>

        </View>
      </View>
    )
  }
}

export default Address