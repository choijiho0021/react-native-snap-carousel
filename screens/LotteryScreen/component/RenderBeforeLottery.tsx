import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import React, {useCallback} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import AppStyledText from '@/components/AppStyledText';
import AppIcon from '@/components/AppIcon';
import {windowWidth} from '@/constants/SliderEntry.style';

const styles = StyleSheet.create({
  noticeContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 25,
    marginBottom: 20,
    marginTop: 32,
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
  btnLotteryDraft: {
    width: windowWidth - 40,
    // left: 20,
    bottom: 16,
    position: 'absolute',
    paddingHorizontal: 20,
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
  type?: 'history' | 'draft';
};

const RenderBeforeLottery: React.FC<RenderBeforeLotteryProps> = ({
  count,
  onClick,
  type = 'history',
}) => {
  const renderDraft = useCallback(() => {
    return (
      <>
        <ScrollView style={{}}>
          {/* <LinearGradient
            // Background Linear Gradient
            colors={['#ffffff', '#D0E9FF']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: '115%',
            }}
          /> */}
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'space-between',
            }}
            scrollEnabled>
            <View style={{alignItems: 'center', marginTop: 16}}>
              {/* <AppText
              style={[
                appStyles.bold18Text,
                {color: colors.blue, lineHeight: 26},
              ]}>
              {i18n.t('esim:lottery:title:before')}
            </AppText> */}
              <View
                style={{
                  width: 196,
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  borderRadius: 1000,
                  paddingVertical: 16,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginBottom: 32,
                }}>
                <AppIcon name="bell24" />
                <AppText
                  style={[
                    appStyles.semiBold16Text,
                    {
                      lineHeight: 24,
                    },
                  ]}>
                  {'발권 완료되었습니다.'}
                </AppText>
              </View>
              <AppText
                style={[
                  appStyles.semiBold16Text,
                  {
                    lineHeight: 26,
                    height: 52,
                    marginBottom: 6,
                    textAlign: 'center',
                  },
                ]}>
                {'상품을 기다리는 동안 ,\n여행 운세를 점쳐드릴게요 :)'}
              </AppText>
              <AppText
                style={[
                  appStyles.bold36Text,
                  {color: colors.clearBlue, marginTop: 6},
                ]}>
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
              imgStyle={{width: 248, height: 248, marginTop: 32}}
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
            </View>
          </ScrollView>
          <View style={{height: 66}} />
        </ScrollView>
        <Pressable
          style={[styles.btnLottery, styles.btnLotteryDraft]}
          onPress={onClick}>
          <AppText style={styles.btnLotteryText}>
            {i18n.t('esim:lottery:button')}
          </AppText>
        </Pressable>
      </>
    );
  }, [count, onClick]);

  return type === 'draft' ? (
    renderDraft()
  ) : (
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
