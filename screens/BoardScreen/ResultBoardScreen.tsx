import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import moment, {Moment} from 'moment';
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
import AppSnackBar from '@/components/AppSnackBar';
import {statusCode2Color} from '@/components/BoardMsg';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  date: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.warmGrey,
  },
  attachBox: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 4,
  },
  reply: {
    ...appStyles.normal16Text,
    color: colors.black,
    lineHeight: 24,
    letterSpacing: -0.16,
  },
  titleView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  replyTitle: {
    ...appStyles.bold16Text,
    textAlign: 'left',
    marginBottom: 10,
    color: colors.clearBlue,
    lineHeight: 24,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  inputBox: {
    ...appStyles.medium16,
    lineHeight: 20,
    padding: 16,
    borderStyle: 'solid',
    borderColor: colors.lightGrey,
    color: colors.black,
  },
  respContainer: {
    backgroundColor: colors.gray4,
    marginBottom: 12,
  },
  respEmptyContainer: {
    backgroundColor: colors.gray4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 340,
    gap: 16,
  },
  resp: {
    marginVertical: 32,
    marginHorizontal: 20,
    justifyContent: 'flex-start',
  },
  msgText: {
    ...appStyles.normal16Text,
    lineHeight: 24,
    letterSpacing: -0.16,
    marginTop: 12,
    color: colors.warmGrey,
  },
  button: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
    flex: 1,
  },
  status: {
    ...appStyles.semiBold14Text,
    lineHeight: 20,
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
  btnMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
});

type ResultBoardScreenProps = {
  pending: boolean;
  issue?: RkbBoardBase;
  title: string;
  showStatus: boolean;
  eventList?: RkbEvent[];
  resp?: string;
};

const ResultBoardScreen: React.FC<ResultBoardScreenProps> = ({
  issue: ip,
  title: tp,
  showStatus: sp,
  eventList: el,
  pending,
  resp,
}) => {
  const [showSnackBar, setShowSnackbar] = useState(false);
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

  const [currentLine, setCurrentLine] = useState(0);
  const [maxLine, setMaxLine] = useState(7);

  useEffect(() => {
    setIsEnded(!eventList.find((e: RkbEvent) => e.nid === issue?.eventId));
  }, [eventList, issue?.eventId]);

  const renderImages = useCallback(
    (images?: string[]) => (
      <View>
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
                    maxImageCnt={5}
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

  const renderTime = useCallback((time: Moment) => {
    const date = moment(time, moment.ISO_8601);

    const formattedDate = date
      .format('YYYY.MM.DD A hh:mm')
      .replace('AM', '오전')
      .replace('PM', '오후');
    return <AppText style={styles.date}>{formattedDate}</AppText>;
  }, []);

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

  const renderRespEmpty = useCallback(() => {
    return (
      <View style={styles.respEmptyContainer}>
        <Image source={require('@/assets/images/esim/boardCheck.png')} />

        <AppStyledText
          text={i18n.t('board:resp:empty')}
          textStyle={{...appStyles.normal16Text, textAlign: 'center'}}
          format={{b: {fontWeight: 'bold', color: colors.black}}}
        />
      </View>
    );
  }, []);

  const renderResp = useCallback(() => {
    return (
      <View style={styles.respContainer}>
        <View style={styles.resp}>
          <View style={{flexDirection: 'row', gap: 4}}>
            <AppIcon
              name="iconSupport"
              style={{justifyContent: 'flex-start'}}
            />
            <AppText style={styles.replyTitle}>{i18n.t('board:resp')}</AppText>
          </View>
          <View>
            <AppText style={styles.reply}>{resp}</AppText>
          </View>
          {renderImages(issue?.replyImages)}
          {renderTime(issue?.changed)}
        </View>
      </View>
    );
  }, [issue?.changed, issue?.replyImages, renderImages, renderTime, resp]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={appStyles.header}>
        <AppBackButton title={title} />
      </View>
      <ScrollView style={styles.container}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            backgroundColor: colors.white,
          }}>
          {showStatus && issue?.statusCode && (
            <EventStatusBox
              statusCode={issue.statusCode}
              reason={issue?.rejectReason?.concat(issue?.otherReason)}
            />
          )}
          <View style={styles.titleView}>
            {issue?.created && renderTime(issue?.created)}

            <AppText
              key="status"
              style={[
                styles.status,
                {
                  color: statusCode2Color[issue?.statusCode] || colors.warmGrey,
                },
              ]}>
              {issue?.statusCode === 'r' ? i18n.t('event:o') : issue?.status}
            </AppText>
          </View>

          <AppText style={[appStyles.semiBold16Text, {marginTop: 2}]}>
            {issue?.title}
          </AppText>
          <AppText
            onTextLayout={(e) => {
              setCurrentLine(e.nativeEvent.lines.length);
            }}
            numberOfLines={maxLine}
            ellipsizeMode="tail"
            style={styles?.msgText}>
            {utils.htmlToString(issue?.msg)}
          </AppText>

          {currentLine > 7 && maxLine === 7 && (
            <Pressable style={styles.btnMore} onPress={() => setMaxLine(99)}>
              <AppText style={[appStyles.bold14Text, {lineHeight: 24}]}>
                {i18n.t('board:more')}
              </AppText>
              <AppSvgIcon name="btnBottomArrow" />
            </Pressable>
          )}
          {issue?.link && renderLink()}

          {issue?.images.length > 0 && renderImages(issue?.images)}
        </View>

        {resp ? renderResp() : renderRespEmpty()}

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
                setShowSnackbar(true);
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

      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('event:ended')}
        bottom={72}
        hideCancel
      />

      <ImageListModal
        visible={modalImgList.length > 0}
        images={modalImgList}
        defaultImgIndex={imgIndex}
        onPress={() => setModalImgList([])}
      />
    </SafeAreaView>
  );
};

export default connect(({status}: RootState) => ({
  pending:
    status.pending[boardActions.getIssueResp.typePrefix] ||
    status.pending[eventBoardActions.getEventIssueResp.typePrefix] ||
    false,
}))(ResultBoardScreen);
