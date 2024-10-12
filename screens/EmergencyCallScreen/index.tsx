import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Linking,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppBackButton from '@/components/AppBackButton';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {actions as talkActions, TalkAction} from '@/redux/modules/talk';
import i18n from '@/utils/i18n';

const emergencyCallNo: Record<string, string> = {
  mofa: '82232100404',
  '119': '82443200119',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.aliceBlue,
    alignItems: 'center',
    height: 56,
  },
  iconView: {
    alignItems: 'center',
    marginTop: 40,
  },
  titleText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 26,
  },
  titleBold: {
    ...appStyles.bold24Text,
    lineHeight: 28,
    textAlign: 'center',
    color: colors.clearBlue,
    marginTop: 6,
  },
  rokebiIcon: {
    marginTop: 32,
  },
  blueView: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    flex: 1,
    flexWrap: 'wrap',
  },
  detailText: {
    flex: 1,
    flexWrap: 'wrap',
    ...appStyles.normal12Text,
    textAlign: 'left',
    lineHeight: 16,
    color: colors.warmGrey,
  },
  whiteView: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 44,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grayBox: {
    backgroundColor: colors.backGrey,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  numberText: {
    ...appStyles.bold18Text,
    lineHeight: 26,
    color: colors.gray20,
  },
  bannerClock: {
    marginLeft: 12,
    marginRight: 8,
  },
  grayText: {
    ...appStyles.normal14Text,
    lineHeight: 22,
    color: colors.warmGrey,
  },
  detailTitle: {
    ...appStyles.bold14Text,
    lineHeight: 22,
    color: colors.darkBlue,
    marginBottom: 6,
  },
  callBtn: {
    flex: 1,
    backgroundColor: colors.clearBlue,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  kakaoBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.clearBlue,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  callText: {
    ...appStyles.normal18Text,
    lineHeight: 26,
    color: colors.white,
    marginLeft: 8,
  },
  kakaoText: {
    ...appStyles.normal18Text,
    lineHeight: 26,
    color: colors.clearBlue,
    marginLeft: 8,
  },
});

type EmergencyCallScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'EmergencyCall'
>;

type EmergencyCallScreenProps = {
  navigation: EmergencyCallScreenNavigationProp;

  action: {
    talk: TalkAction;
  };
};

const EmergencyCallScreen: React.FC<EmergencyCallScreenProps> = ({
  navigation,
  action,
}) => {
  const insets = useSafeAreaInsets();
  const [headerColor, setHeaderColor] = useState(colors.aliceBlue);
  const [viewY, setViewY] = useState(100);
  const scrollY = useRef(new Animated.Value(0)).current; // Scroll position tracking
  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {useNativeDriver: false},
  );

  useEffect(() => {
    scrollY.addListener(({value}) => {
      if (value >= viewY) setHeaderColor(colors.white);
      else setHeaderColor(colors.aliceBlue);
    });
  }, [scrollY, viewY]);

  const usageDetail = useCallback(
    (type: string, num: number, needTitle: boolean = false) => {
      return (
        <View style={styles.grayBox}>
          {needTitle && (
            <AppText style={styles.detailTitle}>
              {i18n.t(`talk:urgent:${type}:usage:title`)}
            </AppText>
          )}
          {Array.from({length: num}, (v, i) => i + 1).map((a, i) => {
            return (
              <View
                key={a.toString()}
                style={[styles.rowCenter, i < num - 1 && {marginBottom: 9}]}>
                <AppSvgIcon style={{marginRight: 8}} name="checkBlueSmall" />
                <AppText>
                  {i18n.t(`talk:urgent:${type}:usage:${i + 1}`)}
                </AppText>
              </View>
            );
          })}
        </View>
      );
    },
    [],
  );
  const openKakaoUrl = useCallback(async (type: string) => {
    const url =
      type === 'mofa'
        ? 'https://pf.kakao.com/_sxjTxcT'
        : 'https://pf.kakao.com/_aHMYxb';

    // 카카오톡 앱을 통해 열기
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        Linking.openURL(url);
      } else {
        // 브라우저에서 열기
        Linking.openURL(url);
      }
    } catch (error) {
      console.error('카카오 채널 연결 중 오류 발생', error);
    }
  }, []);

  const callService = useCallback(
    (type: string, num: number, needTitle: boolean = false) => {
      return (
        <>
          <AppText style={{...appStyles.bold20Text, color: colors.clearBlue}}>
            {i18n.t(`talk:urgent:${type}:title`)}
          </AppText>
          <View style={[styles.grayBox, {marginTop: 8, marginBottom: 6}]}>
            <AppText style={styles.numberText}>
              {i18n.t(`talk:urgent:${type}:callNumber`)}
            </AppText>
          </View>
          <View style={[styles.rowCenter, {marginBottom: 24}]}>
            <AppSvgIcon style={styles.bannerClock} name="bannerClock" />
            <AppText style={styles.grayText}>
              {i18n.t(`talk:urgent:serviceTime`)}
            </AppText>
          </View>
          <View style={[styles.rowCenter, {marginBottom: 12}]}>
            <AppSvgIcon style={{marginRight: 4}} name="questionMark" />
            <AppText style={{...appStyles.bold16Text, lineHeight: 24}}>
              {i18n.t(`talk:urgent:whenToUse`)}
            </AppText>
          </View>

          {usageDetail(type, num, needTitle)}

          <Pressable
            style={styles.callBtn}
            onPress={() => {
              action.talk.updateCalledPty(emergencyCallNo[type] || '');
              navigation.goBack();
            }}>
            <AppSvgIcon name="iconCall" />
            <AppText style={styles.callText}>
              {i18n.t(`talk:urgent:${type}:call`)}
            </AppText>
          </Pressable>
          <Pressable style={styles.kakaoBtn} onPress={() => openKakaoUrl(type)}>
            <AppSvgIcon name="loginImgKakao" />
            <AppText style={styles.kakaoText}>
              {i18n.t(`talk:urgent:${type}:kakao`)}
            </AppText>
          </Pressable>
        </>
      );
    },
    [action.talk, navigation, openKakaoUrl, usageDetail],
  );

  return (
    <View style={{flex: 1}}>
      <View style={{height: insets?.top, backgroundColor: headerColor}} />
      <SafeAreaView style={[styles.container, {backgroundColor: headerColor}]}>
        <StatusBar
          backgroundColor={colors.aliceBlue}
          // barStyle="dark-content" // default
        />
        <View style={[styles.header, {backgroundColor: headerColor}]}>
          <AppBackButton title={i18n.t('talk:urgent:header')} />
        </View>
        <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
          {/* style={{backgroundColor: colors.aliceBlue}}> */}
          <View style={{backgroundColor: colors.aliceBlue}}>
            <View style={styles.iconView}>
              <AppText style={styles.titleText}>
                {i18n.t('talk:urgent:title')}
              </AppText>
              <AppText style={styles.titleBold}>
                {i18n.t('talk:urgent:titleBold')}
              </AppText>
              <AppSvgIcon style={styles.rokebiIcon} name="rokebiEmergencyImg" />
            </View>

            <View style={styles.blueView}>
              <View style={styles.infoBox}>
                <AppSvgIcon name="sos" style={{marginRight: 8}} />
                <>
                  <AppText style={styles.infoText}>
                    {i18n.t('talk:urgent:info')}
                    <AppText style={{fontWeight: 'bold'}}>
                      {i18n.t('talk:urgent:infoBold')}
                    </AppText>
                  </AppText>
                </>
              </View>

              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <AppText style={{marginHorizontal: 4}}>
                  {i18n.t('talk:urgent:point')}
                </AppText>
                <AppText style={styles.detailText}>
                  {i18n.t('talk:urgent:detail1')}
                </AppText>
              </View>

              <View style={{flexDirection: 'row'}}>
                <AppText style={{marginHorizontal: 4}}>
                  {i18n.t('talk:urgent:point')}
                </AppText>
                <AppText style={styles.detailText}>
                  {i18n.t('talk:urgent:detail2')}
                </AppText>
              </View>
            </View>
          </View>

          <View
            style={styles.whiteView}
            onLayout={(event) => {
              const {layout} = event.nativeEvent;
              setViewY(layout?.y);
            }}>
            {callService('mofa', 3)}
            <View style={{height: 36}} />
            {callService('119', 4, true)}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default connect(
  () => ({}),
  (dispatch) => ({
    action: {
      talk: bindActionCreators(talkActions, dispatch),
    },
  }),
)(EmergencyCallScreen);
