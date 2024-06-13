import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import AppStyledText from '@/components/AppStyledText';
import AppIcon from '@/components/AppIcon';

const styles = StyleSheet.create({
  noticeContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 25,
    marginBottom: 20,
  },
  btnLottery: {
    backgroundColor: colors.blue,
    height: 52,
    borderRadius: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 16,
    justifyContent: 'center',
  },
  btnLotteryText: {
    ...appStyles.medium18,
    color: colors.white,
    letterSpacing: 0,
    lineHeight: 26,
  },
});

type RenderBeforeLotteryProps = {
  count: number;
  onClick: () => void;
};

const RenderBeforeLottery: React.FC<RenderBeforeLotteryProps> = ({
  count,
  onClick,
}) => {
  return (
    <>
      <LinearGradient
        // Background Linear Gradient
        colors={['#ffffff', '#D0E9FF']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '115%',
        }}
      />
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{alignItems: 'center', marginTop: 32}}>
          <AppText
            style={[
              appStyles.bold18Text,
              {color: colors.blue, lineHeight: 26},
            ]}>
            {i18n.t('esim:lottery:title:before')}
          </AppText>
          <AppText
            style={[appStyles.bold36Text, {color: colors.black, marginTop: 6}]}>
            {i18n.t('esim:lottery:title')}
          </AppText>
          <AppStyledText
            text={i18n
              .t('esim:lottery:coupon:count')
              .replace('$count', count.toString())}
            textStyle={[
              appStyles.bold18Text,
              {color: colors.black, lineHeight: 26, marginTop: 16},
            ]}
            format={{
              h: {color: colors.blue},
            }}
            numberOfLines={2}
          />
        </View>

        <AppIcon
          name="mainLucky"
          mode="contain"
          imgStyle={{width: 248, height: 248}}
        />

        <View>
          <View style={styles.noticeContainer}>
            {[1, 2].map((idx) => (
              <View key={idx} style={{flexDirection: 'row'}}>
                <AppText
                  style={[
                    appStyles.bold14Text,
                    {color: colors.paleGray4, lineHeight: 20},
                  ]}>
                  {`${i18n.t('esim:lottery:notice:dot')} `}
                </AppText>
                <AppText
                  style={[
                    appStyles.bold14Text,
                    {color: colors.paleGray4, lineHeight: 20},
                  ]}>
                  {i18n.t(`esim:lottery:notice${idx}`)}
                </AppText>
              </View>
            ))}
          </View>
          <Pressable style={styles.btnLottery} onPress={onClick}>
            <AppText style={styles.btnLotteryText}>
              {i18n.t('esim:lottery:button')}
            </AppText>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default RenderBeforeLottery;
