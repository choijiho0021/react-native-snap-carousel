import React,{ PureComponent } from 'react';
import {
  FlatList,
  RefreshControl
} from 'react-native';
import { colors } from '../constants/Colors';

class AppFlatList extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {refreshing = false, onRefresh = null, tintColor = colors.clearBlue  } = this.props

    return (
      <FlatList  
        {... this.props}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[tintColor]} //android 전용
            tintColor={tintColor} //ios 전용
          />
        }
      />
    )
  }
}

export default AppFlatList