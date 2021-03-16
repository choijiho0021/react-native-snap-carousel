import React, {Component} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import AppFlatListItem from '../../../components/AppFlatListItem';
import {colors} from '../../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
});

export default class FaqList extends Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.data !== this.props.data;
  }

  renderItem({item}) {
    return (
      <AppFlatListItem
        key={item.key}
        item={item}
        checked={item.title.startsWith(this.props.titleNo)}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList renderItem={this.renderItem} data={this.props.data} />
      </View>
    );
  }
}
