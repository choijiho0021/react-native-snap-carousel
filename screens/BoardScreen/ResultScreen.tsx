import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {bindActionCreators} from 'redux';
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {navigate} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import utils from '@/redux/api/utils';
import {actions as boardActions} from '@/redux/modules/board';
import {actions as eventBoardActions} from '@/redux/modules/eventBoard';
import i18n from '@/utils/i18n';
import ImgWithIndicator from './ImgWithIndicator';
import EventStatusBox from './EventStatusBox';
import {RkbBoardBase} from '@/redux/api/boardApi';
import ImageListModal from './ImageListModal';
import {RkbEvent} from '@/redux/api/promotionApi';

const styles = StyleSheet.create({
  date: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.warmGrey,
    marginTop: 24,
  },
  attachBox: {
    flexDirection: 'row',
    marginBottom: 56,
    justifyContent: 'space-between',
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

type ResultScreenProps = {
  pending: boolean;
  issue: RkbBoardBase;
  title: string;
  showStatus: boolean;
  eventList?: RkbEvent[];
  resp?: string;
  action: {
    toast: ToastAction;
  };
};

const ResultScreen: React.FC<ResultScreenProps> = ({
  issue: ip,
  title: tp,
  showStatus: sp,
  eventList: el,
  pending,
  resp,
  action,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [issue, title, showStatus = false, eventList = []] = useMemo(
    () => [
      ip || route.params?.issue,
      tp || route.params?.title,
      sp || route.params?.showStatus,
      el || route.params?.eventList,
    ],
    [el, ip, route.params, sp, tp],
  );
  const [imgIndex, setImgIndex] = useState(0);
  const [modalImgList, setModalImgList] = useState<string[]>([]);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    setIsEnded(!eventList.find((e: RkbEvent) => e.nid === issue?.eventId));
  }, [eventList, issue?.eventId]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={title} />,
    });
  }, [navigation, title]);

  const renderImages = useCallback(
    (images?: string[]) => (
      <View>
        <AppText style={styles.label}>{i18n.t('board:attach')}</AppText>
        <View style={styles.attachBox}>
          {images &&
            images.map((url, i) =>
              url ? (
                <Pressable
                  style={styles.imgFrame}
                  key={i}
                  onPress={() => {
                    setModalImgList(images);
                    setImgIndex(i);
                  }}>
                  <ImgWithIndicator
                    uri={API.default.httpImageUrl(url).toString()}
                  />
                </Pressable>
              ) : null,
            )}
          {images?.length === 2 && <View style={{width: 100}} />}
        </View>
      </View>
    ),
    [],
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
          {linkList.map((l: string, idx: number) => (
            <AppText
              key={l + idx}
              style={[styles.inputBox, idx > 0 && {marginTop: 8}]}
              onPress={() => Linking.openURL(l)}>
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
          {showStatus && issue?.statusCode && (
            <EventStatusBox
              statusCode={issue.statusCode}
              reason={issue?.rejectReason?.concat(issue?.otherReason)}
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

          {issue?.link && renderLink()}

          {issue?.images.length > 0 && renderImages(issue?.images)}

          {resp && (
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
                  <AppText style={styles.reply}>{resp}</AppText>
                </View>
              </View>
              {renderImages(issue?.replyImages)}
            </View>
          )}
        </View>

        <AppActivityIndicator visible={pending} />
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
            style={[
              styles.button,
              isEnded && {backgroundColor: colors.warmGrey},
            ]}
            pressedStyle={
              isEnded
                ? {backgroundColor: colors.warmGrey}
                : {backgroundColor: colors.dodgerBlue}
            }
            title={i18n.t('event:reapply')}
            titleStyle={styles.buttonText}
            type="primary"
            onPress={() => {
              if (isEnded) {
                action.toast.push('event:ended');
              } else {
                [1, 2].forEach(() => navigation.goBack());
                navigate(navigation, route, 'MyPageStack', {
                  tab: 'HomeStack',
                  screen: 'EventBoard',
                  params: {index: 0, issue},
                });
              }
            }}
          />
        )}
      </View>

      <ImageListModal
        visible={modalImgList.length > 0}
        images={modalImgList}
        defaultImgIndex={imgIndex}
        onPress={() => setModalImgList([])}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({status}: RootState) => ({
    pending:
      status.pending[boardActions.getIssueResp.typePrefix] ||
      status.pending[eventBoardActions.getEventIssueResp.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(ResultScreen);
