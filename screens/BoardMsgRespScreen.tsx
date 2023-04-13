import {RouteProp, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import moment from 'moment';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList, navigate} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import utils from '@/redux/api/utils';
import {
  actions as boardActions,
  BoardAction,
  BoardModelState,
} from '@/redux/modules/board';
import {
  actions as eventBoardActions,
  EventBoardAction,
} from '@/redux/modules/eventBoard';
import i18n from '@/utils/i18n';
import {AccountModelState} from '@/redux/modules/account';
import ImgWithIndicator from './MyPageScreen/components/ImgWithIndicator';
import EventStatusBox from './MyPageScreen/components/EventStatusBox';

const styles = StyleSheet.create({
  date: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.warmGrey,
    marginTop: 24,
  },
  attachBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 56,
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
    ...appStyles.medium16,
    borderRadius: 3,
    backgroundColor: colors.whiteTwo,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    color: colors.black,
    lineHeight: 24,
    padding: 16,
  },
  resp: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'flex-start',
  },
  respBox: {
    marginTop: 28,
    marginBottom: 36,
    padding: 15,
    paddingBottom: 20,
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
    flex: 1,
  },
  buttonText: {
    ...appStyles.medium18,
    lineHeight: 26,
    color: colors.white,
  },
  imgModalFrame: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forModalClose: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalImg: {
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  imgFrame: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 3,
  },
  label: {
    marginTop: 32,
    ...appStyles.semiBold14Text,
    lineHeight: 20,
    marginBottom: 6,
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
  eventBoard: BoardModelState;
  pending: boolean;
  pendingEvent: boolean;

  account: AccountModelState;

  action: {
    board: BoardAction;
    eventBoard: EventBoardAction;
  };
};

const BoardMsgRespScreen: React.FC<BoardMsgRespScreenProps> = ({
  route: {params},
  navigation,
  board,
  eventBoard,
  account,
  pending,
  pendingEvent,
  action,
}) => {
  const {isEvent = false} = params;
  const [idx, setIdx] = useState<number>();
  const [showImgModal, setShowImgModal] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const issue = useMemo(() => {
    if (isEvent)
      return idx !== undefined && idx >= 0 ? eventBoard?.list[idx] : undefined;
    return idx !== undefined && idx >= 0 ? board?.list[idx] : undefined;
  }, [board?.list, eventBoard?.list, idx, isEvent]);
  const resp = useMemo(() => board?.comment?.[0] || {}, [board?.comment]);
  const {width} = Dimensions.get('window');
  const [height, setHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const route = useRoute();

  useEffect(() => {
    const {uuid, status} = params || {};

    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          title={i18n.t(`${isEvent ? 'event:list' : 'board:title'}`)}
        />
      ),
    });

    if (uuid) {
      // issue list를 아직 가져오지 않은 경우에는, 먼저 가져와서 처리한다.

      if (isEvent) {
        action.eventBoard.getIssueList(false).then(() => {
          setIdx(eventBoard.list.findIndex((item) => item.uuid === uuid));

          if (status === 'Closed') {
            const {token} = account;
            action.eventBoard.getEventIssueResp({uuid, token});
          } else {
            action.eventBoard.resetIssueComment();
          }
        });
      } else {
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
    }
  }, [
    account,
    action.board,
    action.eventBoard,
    board.list,
    eventBoard.list,
    isEvent,
    navigation,
    params,
  ]);

  const renderImages = useCallback(
    (images?: string[]) => (
      <View>
        <AppText style={styles.label}>{i18n.t('board:attach')}</AppText>
        <View style={styles.attachBox}>
          {images &&
            images
              .filter((item) => !_.isEmpty(item))
              .map((url, i) => (
                <Pressable
                  style={styles.imgFrame}
                  key={utils.generateKey(`${url}${i}`)}
                  onPress={() => {
                    setShowImgModal(true);
                    setLoading(true);
                    setImgUrl(url);
                    Image.getSize(
                      API.default.httpImageUrl(url).toString(),
                      (w, h) => {
                        setHeight(h * ((width * 0.8) / w));
                      },
                    );
                  }}>
                  <ImgWithIndicator
                    uri={API.default.httpImageUrl(url).toString()}
                  />
                </Pressable>
              ))}
        </View>
      </View>
    ),
    [width],
  );

  const renderTime = useCallback(() => {
    const date = moment(issue?.created, moment.ISO_8601);

    const formattedDate = date
      .format('YYYY년 MM월DD일 A hh:mm')
      .replace('AM', '오전')
      .replace('PM', '오후');
    return <AppText style={styles.date}>{formattedDate}</AppText>;
  }, [issue?.created]);

  const renderLink = useCallback(() => {
    const linkList = issue?.link || [];
    if (linkList.length > 0) {
      return (
        <View>
          <AppText style={styles.label}>{i18n.t('link')}</AppText>
          {linkList.map((l, idx) => (
            <AppText style={[styles.inputBox, idx > 0 && {marginTop: 8}]}>
              {l}
            </AppText>
          ))}
        </View>
      );
    }
    return null;
  }, [issue?.link]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {isEvent && issue?.statusCode && (
            <EventStatusBox
              statusCode={issue.statusCode}
              rejectReason={issue.rejectReason}
              otherReason={issue.otherReason}
            />
          )}
          {issue?.created && renderTime()}

          <AppText style={[styles.inputBox, {marginTop: 8}]}>
            {issue?.title}
          </AppText>
          <AppText
            style={[
              styles.inputBox,
              {marginTop: 8, padding: 16, minHeight: 120},
            ]}>
            {utils.htmlToString(issue?.msg)}
          </AppText>

          {isEvent && issue?.link && renderLink()}

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
                  <AppText style={styles.reply}>{resp.body}</AppText>
                </View>
              </View>
              {renderImages(issue?.replyImages)}
            </View>
          )}
        </View>

        <AppActivityIndicator visible={pending || pendingEvent} />
      </ScrollView>

      <View style={{flexDirection: 'row'}}>
        <AppButton
          style={[
            styles.button,
            issue?.statusCode === 'f' && {
              backgroundColor: colors.white,
              borderTopWidth: 1,
              borderTopColor: colors.line,
            },
          ]}
          title={i18n.t('ok')}
          titleStyle={[
            styles.buttonText,
            issue?.statusCode === 'f' && {color: colors.black},
          ]}
          type={issue?.statusCode === 'f' ? 'secondary' : 'primary'}
          onPress={() => navigation.goBack()}
        />
        {issue?.statusCode === 'f' && (
          <AppButton
            style={styles.button}
            title={i18n.t('event:reapply')}
            titleStyle={styles.buttonText}
            type="primary"
            onPress={() => {
              [1, 2].forEach(() => navigation.goBack());
              navigate(navigation, route, 'MyPageStack', {
                tab: 'HomeStack',
                screen: 'EventBoard',
                params: {index: 0, issue},
              });
            }}
          />
        )}
      </View>

      <Modal visible={showImgModal} transparent>
        <SafeAreaView style={styles.imgModalFrame}>
          <AppActivityIndicator visible={loading} />
          <Pressable
            style={styles.forModalClose}
            onPress={() => {
              setShowImgModal(false);
            }}
          />
          <Image
            style={styles.modalImg}
            source={{
              uri: API.default.httpImageUrl(imgUrl).toString(),
              height,
            }}
            onLoadEnd={() => {
              setLoading(false);
            }}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default connect(
  ({eventBoard, board, account, status}: RootState) => ({
    eventBoard,
    board,
    account,
    pending: status.pending[boardActions.getIssueResp.typePrefix] || false,
    pendingEvent:
      status.pending[eventBoardActions.getEventIssueResp.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
      eventBoard: bindActionCreators(eventBoardActions, dispatch),
    },
  }),
)(BoardMsgRespScreen);
