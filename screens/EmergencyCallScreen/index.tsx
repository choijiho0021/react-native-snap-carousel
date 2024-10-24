import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {bindActionCreators, RootState} from 'redux';
import i18n from '@/utils/i18n';
import {
  actions as talkActions,
  EMG_MEDICAL,
  EMG_MOFA,
  TalkAction,
  TalkModelState,
} from '@/redux/modules/talk';
import {HomeStackParamList} from '@/navigation/navigation';
import {colors} from '@/constants/Colors';
import AppBackButton from '@/components/AppBackButton';
import CallService from './component/CallService';
import TopInfo from './component/TopInfo';

export const emergencyCallNo: Record<string, string> = {
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
  whiteView: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 44,
  },
});

type EmergencyCallScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'EmergencyCall'
>;

type EmergencyCallScreenProps = {
  navigation: EmergencyCallScreenNavigationProp;

  talk: TalkModelState;
  action: {
    talk: TalkAction;
  };
};

const EmergencyCallScreen: React.FC<EmergencyCallScreenProps> = ({
  navigation,
  talk: {emg},
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
  const [mofa, medical] = useMemo(() => {
    return [emg[EMG_MOFA] === '1', emg[EMG_MEDICAL] === '1'];
  }, [emg]);

  useEffect(() => {
    scrollY.addListener(({value}) => {
      if (value >= viewY) setHeaderColor(colors.white);
      else setHeaderColor(colors.aliceBlue);
    });
  }, [scrollY, viewY]);

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

  const onPressCall = useCallback(
    (type: string) => {
      action.talk.updateNumberClicked({
        num: emergencyCallNo[type] || '',
        name: i18n.t(`talk:urgent:call:${type}`),
      });
      navigation.goBack();
    },
    [action.talk, navigation],
  );

  return (
    <View style={{flex: 1}}>
      <View style={{height: insets?.top, backgroundColor: headerColor}} />
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.aliceBlue} />
        <View style={[styles.header, {backgroundColor: headerColor}]}>
          <AppBackButton title={i18n.t('talk:urgent:header')} />
        </View>
        <ScrollView
          style={{backgroundColor: headerColor}}
          onScroll={onScroll}
          scrollEventThrottle={16}>
          <TopInfo />
          <View
            style={styles.whiteView}
            onLayout={(event) => {
              const {layout} = event.nativeEvent;
              setViewY(layout?.y);
            }}>
            {mofa && (
              <CallService
                type="mofa"
                num={3}
                onPressCall={onPressCall}
                onPressKakao={openKakaoUrl}
              />
            )}
            {medical && (
              <CallService
                type="medical"
                num={4}
                needTitle
                onPressCall={onPressCall}
                onPressKakao={openKakaoUrl}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default connect(
  ({talk}: RootState) => ({talk}),
  (dispatch) => ({
    action: {
      talk: bindActionCreators(talkActions, dispatch),
    },
  }),
)(EmergencyCallScreen);
