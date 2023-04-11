import React, {Component} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RkbBoard} from '@/redux/api/boardApi';
import utils from '@/redux/api/utils';
import AppText from './AppText';
import {RkbEventBoard} from '@/redux/api/eventBoardApi';

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomColor: colors.whiteTwo,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...appStyles.semiBold16Text,
    lineHeight: 20,
    color: colors.black,
  },
  date: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.warmGrey,
    marginBottom: 8,
  },
  status: {
    ...appStyles.normal14Text,
  },
});

type BoardMsgProps = {
  item: RkbBoard | RkbEventBoard;
  uid: number;
  onPress: (uuid: string, status: string) => void;
};
class BoardMsg extends Component<BoardMsgProps> {
  shouldComponentUpdate(nextProps: BoardMsgProps) {
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
      <Pressable onPress={() => this.props.onPress(uuid, statusCode)}>
        <View style={styles.list} key="info">
          <View style={{flex: 1}}>
            <AppText key="date" style={styles.date}>
              {date}
            </AppText>
            <AppText
              key="title"
              ellipsizeMode="tail"
              numberOfLines={2}
              style={styles.title}>
              {titleOrMobile || ''}
            </AppText>
          </View>
          <View style={{width: '30%', alignItems: 'flex-end'}}>
            <AppText
              key="status"
              style={[
                styles.status,
                {
                  color:
                    statusCode === 'Fail'
                      ? colors.redError
                      : statusCode === 'Success'
                      ? colors.shamrock
                      : statusCode === 'Closed'
                      ? colors.clearBlue
                      : colors.warmGrey,
                },
              ]}>
              {status}
            </AppText>
          </View>
        </View>
      </Pressable>
    );
  }
}

export default BoardMsg;
