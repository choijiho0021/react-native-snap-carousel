import React, {memo, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RkbBoard} from '@/redux/api/boardApi';
import utils from '@/redux/api/utils';
import AppText from './AppText';
import {RkbEventBoard} from '@/redux/api/eventBoardApi';
import i18n from '@/utils/i18n';
import AppStyledText from './AppStyledText';

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
    ...appStyles.semiBold14Text,
  },
  reopenText: {
    ...appStyles.bold16Text,
    lineHeight: 20,
    color: colors.boldBlue,
    marginRight: 3,
  },
});

export const statusCode2Color: Record<string, string> = {
  f: colors.redError,
  s: colors.shamrock,
  Closed: colors.clearBlue,
};

type BoardMsgProps = {
  item: RkbBoard | RkbEventBoard;
  uid: number;
  onPress: (uuid: string, status: string) => void;
};
const BoardMsg: React.FC<BoardMsgProps> = ({item, uid, onPress}) => {
  const {title, created, status, statusCode, uuid, mobile, prevId} = item;
  const date = useMemo(() => utils.toDateString(created), [created]);
  const titleOrMobile = useMemo(
    () =>
      uid
        ? title
        : mobile
        ? `${mobile.substr(0, 3)}-****-${mobile.substr(7)}`
        : '',
    [mobile, title, uid],
  );

  return (
    <Pressable onPress={() => onPress(uuid, statusCode)}>
      <View style={styles.list} key="info">
        <View style={{flex: 1}}>
          <AppText key="date" style={styles.date}>
            {date}
          </AppText>
          <AppStyledText
            text={prevId ? i18n.t('event:reOpenTitle') : titleOrMobile}
            textStyle={styles.title}
            format={{b: styles.reopenText}}
            data={{title: titleOrMobile}}
            numberOfLines={2}
          />
        </View>
        <View style={{width: '30%', alignItems: 'flex-end'}}>
          <AppText
            key="status"
            style={[
              styles.status,
              {
                color: statusCode2Color[statusCode] || colors.warmGrey,
              },
            ]}>
            {statusCode === 'r' ? i18n.t('event:o') : status}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
};

export default memo(BoardMsg);
