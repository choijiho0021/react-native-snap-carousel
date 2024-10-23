import moment from 'moment';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {SessionState} from 'sip.js';
import {useSelector} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
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
import TalkToolTip from '../TalkToolTip';
import Keypad, {KeyType} from '../Keypad';
import {emergencyCallNo} from '@/screens/EmergencyCallScreen';
import {appStyles} from '@/constants/Styles';

const small = isDeviceSize('medium') || isDeviceSize('small');
const pointPos = small ? 25 : 0;
const buttonSize = small ? 68 : 80;

const styles = StyleSheet.create({
  keypad: {
    justifyContent: 'flex-start',
  },
  emergency: {
    width: 55,
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
    marginLeft: small ? 6 : 12,
    marginRight: small ? 3 : 8,
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
  emergencyCallText: {
    ...appStyles.bold30Text,
    lineHeight: 44,
    color: colors.redError,
    marginLeft: 8,
  },
  emergencyView: {
    flexDirection: 'row',
    height: 44,
    marginTop: small ? 5 : 16,
    justifyContent: 'center',
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
  dtmf: string | undefined;
  min: number | undefined;
  tooltip: boolean;
  showEmg: boolean;
  updateTooltip: (t: boolean) => void;
};

const TalkMain: React.FC<TalkMainProps> = ({
  navigation,
  sessionState,
  point,
  time,
  dtmf,
  onPressKeypad,
  onChange,
  min,
  showWarning,
  tooltip,
  showEmg,
  updateTooltip,
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
  const emgType = useMemo(
    () => Object.entries(emergencyCallNo).find(([k, v]) => v === called)?.[0],
    [called],
  );

  const minInfo = useMemo(() => {
    if (emgType) {
      return i18n.t(`talk:free`);
    }
    if (min) return i18n.t(`talk:remain`, {min});
    return '';
  }, [emgType, min]);

  const ccInfo = useMemo(
    () => (ccode && (initial || calling) ? tariff[ccode] : undefined),
    [calling, ccode, initial, tariff],
  );
  const [localtime, setLocalTime] = useState<string>();

  useFocusEffect(
    React.useCallback(() => {
      const updateLocalTime = () => {
        const lt = moment.tz(ccInfo?.tz ?? 'Asia/Seoul').format('HH:mm');
        // moment.zone('+09:00').format('HH:mm');
        setLocalTime(lt);
      };

      const intervalId = setInterval(updateLocalTime, 1000);

      return () => clearInterval(intervalId);
    }, [ccInfo?.tz]),
  );

  useEffect(() => {
    if (tooltip && navigation.isFocused()) {
      setTimeout(() => {
        updateTooltip(false);
      }, 15000);
    }
  }, [navigation, tooltip, updateTooltip]);

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
              style={[{marginRight: 6}, {marginLeft: 16}]}
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
            <AppSvgIcon
              style={{marginRight: 16}}
              key="rightArrow10"
              name="rightArrow10"
            />
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

  const renderDestination = useCallback(() => {
    if (dtmf) {
      return (
        <View style={[styles.input, {height: 44, marginTop: 16}]}>
          <AppText style={styles.dest} numberOfLines={1} ellipsizeMode="head">
            {dtmf}
          </AppText>
        </View>
      );
    }
    if (emgType?.length > 0 && called) {
      return (
        <View style={[styles.input, styles.emergencyView]}>
          <AppSvgIcon name="sos" />
          <AppText
            style={styles.emergencyCallText}
            numberOfLines={1}
            ellipsizeMode="head">
            {i18n.t(`talk:urgent:call:${emgType}`)}
          </AppText>
        </View>
      );
    }
    return (
      <View style={[styles.input, {height: 44, marginTop: 16}]}>
        <AppText style={styles.dest} numberOfLines={1} ellipsizeMode="head">
          <AppText style={[styles.dest, {color: colors.clearBlue}]}>
            {ccode || ''}
          </AppText>
          {ccode ? called?.substring(ccode.length) : called}
        </AppText>
      </View>
    );
  }, [called, ccode, dtmf, emgType]);

  const callTimePos = useMemo(() => (initial ? pointPos : -5), [initial]);

  return (
    <>
      <View style={styles.topView}>
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
        {initial && showEmg ? (
          <AppButton
            style={{backgroundColor: colors.white}}
            titleStyle={styles.emergency}
            title={initial ? i18n.t('talk:emergencyCall') : ''}
            onPress={() => navigation.navigate('EmergencyCall')}
          />
        ) : (
          <View style={{width: 55}} />
        )}
      </View>
      {ccInfo && getLocalTime()}

      <TalkToolTip
        visible={tooltip}
        text={i18n.t('talk:emergencyText')}
        icon="bell"
        iconStyle={{marginRight: 8}}
        updateTooltip={updateTooltip}
      />

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
            {minInfo}
          </AppText>
        </View>
      )}
      {renderDestination()}
      <View style={{flex: 1, marginTop: callTimePos}}>{info()}</View>
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
