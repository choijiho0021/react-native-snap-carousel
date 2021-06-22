import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import _ from 'underscore';
import {appStyles} from '../constants/Styles';
import {colors} from '../constants/Colors';
import utils from '@/submodules/rokebi-utils/utils';

const styles = StyleSheet.create({
  list: {
    height: 74,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: colors.whiteTwo,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...appStyles.normal16Text,
    color: colors.black,
    marginBottom: 12,
  },
  date: {
    ...appStyles.normal12Text,
    color: colors.warmGrey,
    textAlign: 'left',
  },
  status: {
    ...appStyles.normal14Text,
  },
});

class BoardMsg extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.item.uuid !== nextProps.item.uuid ||
      this.props.item.statusCode !== nextProps.item.statusCode
    );
  }

  render() {
    const {title, created, status, statusCode, uuid, mobile} = this.props.item;
    const date = utils.toDateString(created);
    const titleOrMobile = this.props.uid
      ? title
      : `${mobile.substr(0, 3)}-****-${mobile.substr(7)}`;

    return (
      <TouchableOpacity onPress={() => this.props.onPress(uuid, statusCode)}>
        <View style={styles.list} key="info">
          <View style={{flex: 1}}>
            <Text
              key="title"
              ellipsizeMode="tail"
              numberOfLines={2}
              style={styles.title}>
              {titleOrMobile || ''}
            </Text>
            <Text key="date" style={styles.date}>
              {date}
            </Text>
          </View>
          <View style={{width: '30%', alignItems: 'flex-end'}}>
            <Text
              key="status"
              style={[
                styles.status,
                {
                  color:
                    statusCode === 'Closed'
                      ? colors.clearBlue
                      : colors.warmGrey,
                },
              ]}>
              {status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default BoardMsg;
