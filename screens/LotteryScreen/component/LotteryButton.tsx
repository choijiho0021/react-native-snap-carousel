import React, {useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppIcon from '@/components/AppIcon';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {Fortune, isFortuneHistory} from '@/redux/modules/account';

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
};

const LotteryButton: React.FC<LotteryButtonProps> = ({
  subsData,
  navigation,
  fortune,
}) => {
  const isPending = useCallback((statusCd: string) => statusCd === 'R', []);
  const pending = useMemo(() => {
    return subsData.findIndex((r) => isPending(r.statusCd)) !== -1;
  }, [isPending, subsData]);

  const navigateLottery = useCallback(() => {
    navigation.navigate('Lottery', {
      count: fortune?.count || 0,
      fortune: {count: fortune?.count || 0, fortune}, // fortune
    });
  }, [fortune, navigation]);

  // 운세 문구가 있지만 추첨권이 0개인 경우 다시보기
  if (isFortuneHistory(fortune)) {
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
              width: 128,
            }}
          />
        </View>
      </Pressable>
    );
  }

  return (
    fortune?.count >= 0 && (
      <Pressable
        style={[
          styles.fortuneBtnContainer,
          {
            height: pending ? 106 : 64,
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
