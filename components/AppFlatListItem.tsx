import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import _ from 'underscore';
import utils from '@/submodules/rokebi-utils/utils';
import AppIcon from './AppIcon';
import {colors} from '../constants/Colors';
import {appStyles} from '../constants/Styles';

const styles = StyleSheet.create({
  row: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.whiteTwo,
  },
  title: {
    ...appStyles.normal16Text,
    flex: 1,
    marginLeft: 20,
  },
  body: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    backgroundColor: colors.whiteTwo,
    padding: 20,
  },
  button: {
    paddingHorizontal: 20,
  },
});

export default class AppFlatListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: this.props.checked || false,
    };

    this.onPress = this.onPress.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.checked !== this.state.checked;
  }

  onPress() {
    this.setState((state) => ({
      checked: !state.checked,
    }));
  }

  render() {
    const {item} = this.props;
    const {checked} = this.state;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <View>
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <AppIcon
              style={styles.button}
              name={checked ? 'iconArrowUp' : 'iconArrowDown'}
            />
          </View>
          {checked && (
            <Text style={styles.body}>{utils.htmlToString(item.body)}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}
