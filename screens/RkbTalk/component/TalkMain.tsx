import {useFocusEffect} from '@react-navigation/native';
import {RootState} from '@reduxjs/toolkit';
import moment from 'moment';
import React, {memo, useCallback, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {SessionState} from 'sip.js';
import AppButton from '@/components/AppButton';
import AppPrice from '@/components/AppPrice';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {API} from '@/redux/api';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import {RkbTalkNavigationProp} from '..';
import CallToolTip from '../CallToolTip';
import Keypad, {KeyType} from '../Keypad';

const buttonSize = isDeviceSize('medium', true) ? 68 : 80;

const styles = StyleSheet.create({
  keypad: {
    justifyContent: 'flex-start',
  },
  emergency: {
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
    marginTop: 8,
    height: 40,
    alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'flex-end',
  },
  flagIcon: {
    width: 32,
    height: 32,
    marginRight: 6,
  },
  nation: {
    color: colors.black,
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
  onChange?: (d?: string) => void;
  sessionState?: SessionState;
  showWarning: boolean;
  point: number;
  time: string;
  min: number | undefined;
};

const TalkMain: React.FC<TalkMainProps> = ({
  navigation,
  sessionState,
  point,
  time,
  onPressKeypad,
  onChange,
  min,
  showWarning,
}) => {
  const {called, ccode, tariff} = useSelector((state: RootState) => state.talk);
  const [initial, calling, connected] = useMemo(
    () => [
      !sessionState ||
        [SessionState.Initial, SessionState.Terminated].includes(sessionState),
      SessionState.Establishing === sessionState,
      SessionState.Established === sessionState,
    ],
    [sessionState],
  );

  const ccInfo = useMemo(
    () => (ccode && (initial || calling) ? tariff[ccode] : undefined),
    [calling, ccode, initial, tariff],
  );
  const [localtime, setLocalTime] = useState<string>();

  useFocusEffect(
    React.useCallback(() => {
      const updateLocalTime = () => {
        const lt = moment.tz('Asia/Seoul').format('HH:mm');
        setLocalTime(lt);
      };

      const intervalId = setInterval(updateLocalTime, 1000);

      return () => clearInterval(intervalId);
    }, []),
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

  const getLocalTime = useCallback(() => {
    return (
      <AppText style={{textAlign: 'center', color: colors.warmGrey}}>
        {i18n.t(`talk:localTime`, {
          time: localtime,
        })}
      </AppText>
    );
  }, [localtime]);

  return (
    <>
      <View style={styles.topView}>
        {/* <View style={{width: 10, height: 10, backgroundColor: 'red'}} /> */}
        {/* <AppText  style={{marginLeft: 10}}>{`Session: ${sessionState}`}</AppText> */}
        {ccInfo && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 55,
            }}>
            <Image
              resizeMode="contain"
              style={styles.flagIcon}
              source={{uri: API.default.httpImageUrl(ccInfo.flag)}}
            />
            <AppText style={[styles.emergency, styles.nation]}>
              {ccInfo.name}
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
      {ccInfo && getLocalTime()}
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
            {ccode || ''}
          </AppText>
          {ccode ? called?.substring(ccode.length) : called}
        </AppText>
      </View>
      <View style={{flex: 1}}>{info()}</View>
      <View>
        <Keypad
          navigation={navigation}
          style={styles.keypad}
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

export default memo(TalkMain);
