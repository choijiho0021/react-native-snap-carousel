import React, {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppIcon from '@/components/AppIcon';
import moment from 'moment';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppStyledText from '@/components/AppStyledText';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {Fortune} from '@/redux/modules/account';

const styles = StyleSheet.create({
  fortuneBtnContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightBlue,
    borderRadius: 3,
    marginTop: 12,
  },

  fortuneBtn: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
});

type LotteryButtonProps = {
  subsData: RkbSubscription[];
  navigation: any;
  fortune: Fortune;
  lotteryCnt: number;
  checkLottery: any;
};

const LotteryButton: React.FC<LotteryButtonProps> = ({
  subsData,
  navigation,
  lotteryCnt,
  fortune,
  checkLottery,
}) => {
  //   const [lotteryCnt, setLotteryCnt] = useState(0);
  //   const [fortune, setFortune] = useState<Fortune>({text: '', num: 0});

  const isPending = (statusCd: string) => statusCd === 'P';
  const pending = subsData.findIndex((r) => isPending(r.statusCd)) !== -1;

  const navigateLottery = useCallback(() => {
    navigation.navigate('Lottery', {
      count: lotteryCnt,
      fortune,
      onPress: checkLottery,
    });
  }, [checkLottery, fortune, lotteryCnt, navigation]);

  if (lotteryCnt === 0 && fortune) {
    return (
      <Pressable
        style={styles.fortuneBtnContainer}
        onPress={() => {
          navigateLottery();
        }}>
        <View style={styles.fortuneBtn}>
          <AppText
            style={[
              appStyles.bold16Text,
              {color: colors.white, lineHeight: 20},
            ]}>
            {i18n.t('esim:lottery:history')}
          </AppText>

          <AppIcon
            name="fortuneBtnSmall"
            mode="contain"
            imgStyle={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
      </Pressable>
    );
  }

  return (
    lotteryCnt > 0 && (
      <Pressable
        style={[
          styles.fortuneBtnContainer,
          {
            height: pending ? 150 : 70,
          },
        ]}
        onPress={() => {
          navigateLottery();
        }}>
        <View style={styles.fortuneBtn}>
          <AppText
            style={[
              pending ? appStyles.bold18Text : appStyles.bold16Text,
              {color: colors.white, lineHeight: 22},
            ]}>
            {i18n.t(
              pending ? 'esim:lottery:start:pending' : 'esim:lottery:start',
            )}
          </AppText>
          <AppIcon
            name={pending ? 'fortuneBtnBig' : 'fortuneBtnSmall'}
            mode="contain"
            imgStyle={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
      </Pressable>
    )
  );
};

export default connect(({product}: RootState) => ({
  product,
}))(LotteryButton);
