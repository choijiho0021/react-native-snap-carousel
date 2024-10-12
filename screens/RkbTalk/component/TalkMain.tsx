import moment from 'moment';
import React, {useCallback, useMemo} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {SessionState} from 'sip.js';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import i18n from '@/utils/i18n';
import CallToolTip from '../CallToolTip';
import AppSvgIcon from '@/components/AppSvgIcon';
import Keypad, {KeypadRef, KeyType} from '../Keypad';
import AppPrice from '@/components/AppPrice';
import {utils} from '@/utils/utils';
import {RkbTalkNavigationProp} from '..';

const buttonSize = isDeviceSize('medium', true) ? 68 : 80;

const styles = StyleSheet.create({
  keypad: {
    justifyContent: 'flex-start',
  },
  emergency: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: -0.16,
    color: colors.clearBlue,
  },
  myPoint: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.16,
  },
  pointBold: {
    marginLeft: 12,
    marginRight: 8,
    color: colors.clearBlue,
    fontWeight: 'bold',
  },
  dest: {
    height: buttonSize / 2,
    fontSize: 36,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: buttonSize / 2,
    letterSpacing: -0.28,
    color: colors.black,
    textAlignVertical: 'bottom',
  },
  input: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  talkBtn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  talkBtnView: {
    justifyContent: 'center',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginHorizontal: 92,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  timer: {
    height: 22,
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.clearBlue,
    marginTop: 24,
  },
  connecting: {
    color: colors.warmGrey,
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 40,
    height: 40,
    marginTop: 24,
    letterSpacing: -0.16,
    textAlign: 'center',
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    height: 40,
    alignItems: 'center',
  },
  topRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 20,
  },
  flagIcon: {
    flex: 1,
    width: 9.4,
    // backgroundColor: colors.darkBlue,
    flexDirection: 'column',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
  },
  nation: {
    flex: 1,
    // marginLeft: 6,
    justifyContent: 'flex-start',
    color: colors.black,
    textAlign: 'left',
  },
  connectedView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type TalkMainProps = {
  navigation: RkbTalkNavigationProp;
  onPressKeypad?: (k: KeyType, d?: string) => void;
  onChange: (d?: string) => void;
  keypadRef?: React.MutableRefObject<KeypadRef | null>;
  sessionState?: SessionState;
  showWarning: boolean;
  digit: string;
  point: number;
  time: string;
  min: number | undefined;
};

const TalkMain: React.FC<TalkMainProps> = ({
  navigation,
  sessionState,
  digit,
  point,
  time,
  keypadRef,
  onPressKeypad,
  onChange,
  min,
  showWarning,
}) => {
  const [initial, calling, connected] = useMemo(
    () => [
      !sessionState ||
        [SessionState.Initial, SessionState.Terminated].includes(sessionState),
      SessionState.Establishing === sessionState,
      SessionState.Established === sessionState,
    ],
    [sessionState],
  );
  const splitCC = useMemo(
    () =>
      ['82', '20'].includes(digit?.slice(0, 2))
        ? [digit?.slice(0, 2), digit?.slice(2)]
        : [],
    [digit],
  );

  const printCCInfo = useMemo(
    () => splitCC?.length > 0 && (initial || calling),
    [calling, initial, splitCC?.length],
  );

  // talkpoint 가져오지 못할 경우 0 처리
  const talkPointBtn = useCallback(() => {
    return (
      <>
        <Pressable
          style={styles.talkBtn}
          onPress={() => navigation.navigate('TalkPoint')}>
          <View style={styles.talkBtnView}>
            <AppSvgIcon
              key="talkPoint"
              name="talkPoint"
              style={{marginRight: 6}}
            />
            <AppText style={styles.myPoint}>{i18n.t('talk:mypoint')}</AppText>
            <AppPrice
              price={utils.toCurrency(point || 0, 'P')}
              balanceStyle={[
                styles.myPoint,
                styles.pointBold,
                {marginRight: 0},
              ]}
              currencyStyle={[
                styles.myPoint,
                styles.pointBold,
                {marginLeft: 0},
              ]}
            />
            <AppSvgIcon key="rightArrow10" name="rightArrow10" />
          </View>
        </Pressable>
        <View style={{flex: 1}} />
      </>
    );
  }, [navigation, point]);

  const info = useCallback(() => {
    if (initial) return talkPointBtn();
    if (connected) return <AppText style={styles.timer}>{time}</AppText>;
    return (
      <AppText style={styles.connecting}>{i18n.t('talk:connecting')}</AppText>
    );
  }, [connected, initial, talkPointBtn, time]);

  return (
    <>
      <View style={styles.topView}>
        <View style={styles.topRow}>
          <View style={{flex: 1}} />
          {/* <AppText  style={{marginLeft: 10}}>{`Session: ${sessionState}`}</AppText> */}
          {printCCInfo && (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* <Image
                resizeMode="contain"
                style={[styles.flagIcon, {flex: 1}]}
                source={
                  require(`../../assets/images/flag/34_ES.png`)
                  // (focused || checked) && source.length > 1 ? source[1] : source[0]
                }
              /> */}
              {/* <AppSvgIcon style={styles.flagIcon} name="KR" /> */}
              <AppText style={[styles.emergency, styles.nation]}>
                대한민국
              </AppText>
            </View>
          )}
          <AppButton
            style={{backgroundColor: colors.white}}
            titleStyle={styles.emergency}
            title={initial ? i18n.t('talk:emergencyCall') : ''}
            onPress={() => navigation.navigate('EmergencyCall')}
          />
        </View>
      </View>
      {printCCInfo && (
        <AppText style={{textAlign: 'center', color: colors.warmGrey}}>
          {i18n.t(`talk:localTime`, {
            time: moment().tz('Asia/Seoul').format('HH:mm'),
          })}
        </AppText>
      )}
      <CallToolTip text={i18n.t('talk:emergencyText')} icon="bell" />
      {connected && (
        <View style={styles.connectedView}>
          {showWarning && (
            <AppSvgIcon
              style={{justifyContent: 'center', alignItems: 'center'}}
              name="callWarning"
            />
          )}
          <AppText
            style={[
              {
                textAlign: 'center',
                color: colors.warmGrey,
              },
              showWarning && {color: colors.redError, marginLeft: 6},
            ]}>
            {min ? i18n.t(`talk:remain`, {min}) : ''}
          </AppText>
        </View>
      )}

      {/* <AppText style={{marginLeft: 10}}>{`Session: ${sessionState}`}</AppText>
    <AppText style={{marginLeft: 10}}>{time}</AppText> */}
      <View style={[styles.input, {height: 44, marginTop: 16}]}>
        <AppText style={styles.dest} numberOfLines={1} ellipsizeMode="head">
          <AppText style={[styles.dest, {color: colors.clearBlue}]}>
            {splitCC?.length > 0 ? splitCC[0] : ''}
          </AppText>
          {splitCC?.length > 0 ? splitCC[1] : digit}
        </AppText>
      </View>
      <View style={{flex: 1}}>{info()}</View>
      <View>
        <Keypad
          navigation={navigation}
          style={styles.keypad}
          keypadRef={keypadRef}
          onPress={onPressKeypad}
          onChange={onChange}
          state={sessionState}
          showWarning={showWarning}
        />
        <View style={{height: 40}} />
      </View>
    </>
  );
};

export default TalkMain;
