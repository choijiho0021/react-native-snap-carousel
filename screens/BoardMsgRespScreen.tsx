import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {attachmentSize, windowWidth} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import utils from '@/redux/api/utils';
import {
  actions as boardActions,
  BoardAction,
  BoardModelState,
} from '@/redux/modules/board';
import i18n from '@/utils/i18n';
import {AccountModelState} from '@/redux/modules/account';

const styles = StyleSheet.create({
  attachBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: windowWidth - 20,
    marginTop: 10,
    marginHorizontal: 20,
  },
  attach: {
    // flex: 1,
    marginRight: 20,
    width: attachmentSize,
    height: attachmentSize,
  },
  reply: {
    ...appStyles.normal14Text,
    color: colors.black,
  },
  replyTitle: {
    ...appStyles.normal12Text,
    textAlign: 'left',
    marginBottom: 10,
    color: colors.warmGrey,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  inputBox: {
    ...appStyles.normal14Text,
    marginHorizontal: 20,
    borderRadius: 3,
    backgroundColor: colors.whiteTwo,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    color: colors.greyish,
    padding: 15,
  },
  resp: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'flex-start',
  },
  respBox: {
    marginTop: 18,
    marginBottom: 36,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: 'flex-start',
  },
  button: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },
});

type BoardMsgRespScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'BoardMsgResp'
>;

type BoardMsgRespScreenRouteProp = RouteProp<
  HomeStackParamList,
  'BoardMsgResp'
>;

type BoardMsgRespScreenProps = {
  navigation: BoardMsgRespScreenNavigationProp;
  route: BoardMsgRespScreenRouteProp;

  board: BoardModelState;
  pending: boolean;

  account: AccountModelState;

  action: {
    board: BoardAction;
  };
};

const BoardMsgRespScreen: React.FC<BoardMsgRespScreenProps> = ({
  route: {params},
  navigation,
  board,
  account,
  pending,
  action,
}) => {
  const [idx, setIdx] = useState<number>();
  const issue = useMemo(
    () => (idx !== undefined && idx >= 0 ? board?.list[idx] : undefined),
    [board?.list, idx],
  );
  const resp = useMemo(() => board?.comment?.[0] || {}, [board?.comment]);

  useEffect(() => {
    const {uuid, status} = params || {};

    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('board:title')} />,
    });

    if (uuid) {
      // issue list를 아직 가져오지 않은 경우에는, 먼저 가져와서 처리한다.
      action.board.getIssueList(false).then(() => {
        setIdx(board.list.findIndex((item) => item.uuid === uuid));

        if (status === 'Closed') {
          const {token} = account;
          action.board.getIssueResp({uuid, token});
        } else {
          action.board.resetIssueComment();
        }
      });
    }
  }, [account, action.board, board.list, navigation, params]);

  const renderImages = useCallback(
    (images?: string[]) => (
      <View style={styles.attachBox}>
        {images &&
          images
            .filter((item) => !_.isEmpty(item))
            .map((url, i) => (
              <Image
                key={`${url}${i}`}
                source={{uri: API.default.httpImageUrl(url).toString()}}
                style={styles.attach}
              />
            ))}
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={{flex: 1}}>
          <AppText style={[styles.inputBox, {marginTop: 30}]}>
            {issue?.title}
          </AppText>
          <AppText
            style={[styles.inputBox, {marginTop: 15, paddingBottom: 72}]}>
            {utils.htmlToString(issue?.msg)}
          </AppText>
          {renderImages(issue?.images)}

          {!_.isEmpty(resp) && (
            <View style={styles.respBox}>
              <View style={styles.resp}>
                <AppIcon
                  name="btnReply"
                  style={{justifyContent: 'flex-start'}}
                />
                <View style={{marginLeft: 10, marginRight: 30}}>
                  <AppText style={styles.replyTitle}>
                    {i18n.t('board:resp')}
                  </AppText>
                  <AppText style={styles.reply}>
                    {resp.body
                      ?.replace(/&amp;/gi, '&')
                      .replace(/&lt;/gi, '<')
                      .replace(/&gt;/gi, '>')}
                  </AppText>
                </View>
              </View>
              {renderImages(issue?.replyImages)}
            </View>
          )}
        </View>

        <AppActivityIndicator visible={pending} />
      </ScrollView>

      <AppButton
        style={styles.button}
        title={i18n.t('ok')}
        type="primary"
        onPress={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({board, account, status}: RootState) => ({
    board,
    account,
    pending: status.pending[boardActions.getIssueResp.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
    },
  }),
)(BoardMsgRespScreen);
