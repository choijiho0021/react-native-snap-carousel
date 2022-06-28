/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {useCallback, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  View,
} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '../../constants/Styles';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import {isDeviceSize} from '@/constants/SliderEntry.style';

const styles = StyleSheet.create({
  underLine: {
    borderStyle: 'solid',
    borderBottomWidth: 10,
    borderBottomColor: colors.babyBlue,
  },
  noneLine: {
    borderStyle: 'solid',
    borderBottomWidth: 10,
    borderBottomColor: colors.white,
    top: 0,
  },
  titleText: {
    ...appStyles.bold22Text,
    top: 10,
  },
  step: {
    width: 25,
    height: 20,
    borderRadius: 20,
    backgroundColor: colors.black,
    marginTop: 8,
    marginRight: 8,
  },
  stepText: {
    ...appStyles.bold14Text,
    flex: 1,
    color: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tipText: {
    ...appStyles.normal15Text,
    fontSize: isDeviceSize('medium') ? 13 : 15,
  },
  tipBoldText: {
    ...appStyles.bold15Text,
    fontSize: isDeviceSize('medium') ? 13 : 15,
  },
  tipContainer: {
    alignItems: 'center',
    width: '100%',
  },
  tipTextContainer: {
    flexDirection: 'row',
    marginHorizontal: 40,
    marginBottom: 5,
  },
});

const renderTips = () => (
  <AppText
    style={{
      ...appStyles.bold16Text,
      fontSize: isDeviceSize('medium') ? 14 : 16,
      color: colors.clearBlue,
      marginBottom: 4,
    }}>
    {i18n.t('userGuide:tip')}
  </AppText>
);
const stepsTitle = {
  step0: [
    [
      {
        text: i18n.t('userGuide:stepsTitle0_1'),
        viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
    ],
    [
      {
        text: i18n.t('userGuide:stepsTitle0_2'),
        viewStyle: styles.noneLine,
        textStyle: styles.titleText,
      },
    ],
  ],
  step1: [
    [
      {
        text: '설정 > 셀룰러 > 셀룰러 요금제 추가',
        viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
    ],
    [
      {
        text: '버튼을 눌러주세요.',
        viewStyle: styles.noneLine,
        textStyle: styles.titleText,
      },
    ],
  ],
  step2: [
    [
      {
        text: 'QR코드 ',
        viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
      {
        text: '혹은',
        viewStyle: styles.noneLine,
        textStyle: {...appStyles.bold22Text, top: 12},
      },
      {
        text: '세부사항  직접 입력',
        viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
      {
        text: '을',
        viewStyle: styles.noneLine,
        textStyle: {...appStyles.bold22Text, top: 12},
      },
    ],
    [
      {
        text: '이용하여 요금제를 추가해주세요.',
        viewStyle: styles.noneLine,
        textStyle: styles.titleText,
      },
    ],
  ],
  step3: [
    [
      {
        text: '셀룰러 요금제 레이블',
        viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
      {
        text: '을',
        viewStyle: styles.noneLine,
        textStyle: styles.titleText,
      },
    ],
    [
      {
        text: '지정해주세요.',
        viewStyle: styles.noneLine,
        textStyle: styles.titleText,
      },
    ],
  ],
  step4: [
    [
      {
        text: '아래그림처럼',
        viewStyle: styles.noneLine,
        textStyle: styles.titleText,
      },
    ],
    [
      {
        text: '사용 회선을 설정',
        viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
      {
        text: '해주세요.',
        viewStyle: styles.noneLine,
        textStyle: styles.titleText,
      },
    ],
  ],
  step5: [
    [
      {
        text: '아래그림처럼',
        viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
    ],
    [
      {
        text: '잘 설정되었는지 확인',
        viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
      {
        text: '해주세요.',
        viewStyle: styles.noneLine,
        textStyle: styles.titleText,
      },
    ],
  ],
  step6: [
    [
      {
        text: '2개의 통신사 수신호',
        viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
      {
        text: '가',
        viewStyle: styles.noneLine,
        textStyle: styles.titleText,
      },
    ],
    [
      {
        text: '잘 잡히는지 확인해주세요',
        viewStyle: styles.noneLine,
        textStyle: styles.titleText,
      },
    ],
  ],
};
export const guideImages = {
  page1: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide1.png'),
    title: stepsTitle.step0,
    step: 0,
    tip: () => null,
  },
  page2: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide2.png'),
    title: stepsTitle.step1,
    step: 1,
    tip: () =>
      isDeviceSize('medium') && <View style={{height: 39, width: '100%'}} />,
  },
  page3: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide3.png'),
    title: stepsTitle.step2,
    step: 2,
    tip: () => (
      <View style={styles.tipContainer}>
        {renderTips()}
        <View style={styles.tipTextContainer}>
          <View style={styles.step}>
            <AppText style={styles.stepText}>1</AppText>
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
            <AppText style={styles.tipText}>
              {i18n.t('userGuide:tipPage3_1')}
              <AppText style={styles.tipBoldText}>
                {i18n.t('userGuide:tipPage3_2')}
              </AppText>
              {i18n.t('userGuide:tipPage3_3')}
            </AppText>
          </View>
        </View>
        <View style={styles.tipTextContainer}>
          <View style={styles.step}>
            <AppText style={styles.stepText}>2</AppText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginBottom: isDeviceSize('medium') ? 44 : 65,
            }}>
            <AppText style={styles.tipText}>
              {i18n.t('userGuide:tipPage3_4')}
              <AppText style={styles.tipBoldText}>
                {i18n.t('userGuide:tipPage3_5')}
              </AppText>
              {i18n.t('userGuide:tipPage3_6')}
            </AppText>
          </View>
        </View>
      </View>
    ),
  },
  page4: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide4.png'),
    title: stepsTitle.step2,
    step: 2,
    tip: () => (
      <View style={styles.tipContainer}>
        {renderTips()}
        <View style={styles.tipTextContainer}>
          <AppText style={[styles.tipText, {marginHorizontal: 5}]}>
            {i18n.t('centerDot')}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginBottom: isDeviceSize('medium') ? 62 : 0,
            }}>
            <AppText style={styles.tipBoldText}>
              {i18n.t('userGuide:tipPage4_1')}
              <AppText style={styles.tipText}>
                {i18n.t('userGuide:tipPage4_2')}
              </AppText>
            </AppText>
          </View>
        </View>
      </View>
    ),
  },
  page5: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide5.png'),
    title: stepsTitle.step3,
    step: 3,
    tip: () => (
      <View style={styles.tipContainer}>
        {renderTips()}
        <View style={styles.tipTextContainer}>
          <AppText style={[styles.tipText, {marginRight: 5}]}>
            {i18n.t('centerDot')}
          </AppText>
          <View style={{flexDirection: 'row', flex: 1}}>
            <AppText style={styles.tipText}>
              {i18n.t('userGuide:tipPage5_1')}
            </AppText>
          </View>
        </View>
        <View style={styles.tipTextContainer}>
          <AppText style={[styles.tipText, {marginRight: 5}]}>
            {i18n.t('centerDot')}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginBottom: isDeviceSize('medium') ? 46 : 0,
            }}>
            <AppText style={styles.tipBoldText}>
              {i18n.t('userGuide:tipPage5_2')}
            </AppText>
          </View>
        </View>
      </View>
    ),
  },
  page6: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide6.png'),
    title: stepsTitle.step4,
    step: 4,
    tip: () => (
      <View style={{height: isDeviceSize('medium') ? 75 : 0, width: '100%'}} />
    ),
  },
  page7: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide7.png'),
    title: stepsTitle.step4,
    step: 4,
    tip: () => (
      <View style={{height: isDeviceSize('medium') ? 75 : 0, width: '100%'}} />
    ),
  },
  page8: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide8.png'),
    title: stepsTitle.step4,
    step: 4,
    tip: () => (
      <View style={styles.tipContainer}>
        {renderTips()}
        <View style={styles.tipTextContainer}>
          <AppText style={[styles.tipText, {marginHorizontal: 5}]}>
            {i18n.t('centerDot')}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginBottom: isDeviceSize('medium') ? 36 : 0,
            }}>
            <AppText style={styles.tipBoldText}>
              {i18n.t('userGuide:tipPage8_1')}
              <AppText style={[styles.tipBoldText, {color: colors.tomato}]}>
                {i18n.t('userGuide:tipPage8_2')}
              </AppText>
            </AppText>
          </View>
        </View>
      </View>
    ),
  },
  page9: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide9.png'),
    title: stepsTitle.step5,
    step: 5,
    tip: () => (
      <View style={{height: isDeviceSize('medium') ? 75 : 0, width: '100%'}} />
    ),
  },
  page10: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide10.png'),
    title: stepsTitle.step5,
    step: 5,
    tip: () => (
      <View style={styles.tipContainer}>
        {renderTips()}
        <View style={styles.tipTextContainer}>
          <AppText style={[styles.tipText, {marginHorizontal: 5}]}>
            {i18n.t('centerDot')}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginBottom: isDeviceSize('medium') ? 59 : 0,
            }}>
            <AppText style={styles.tipText}>
              {i18n.t('userGuide:tipPage9_1')}
              <AppText style={styles.tipBoldText}>
                {i18n.t('userGuide:tipPage9_2')}
              </AppText>
              {i18n.t('userGuide:tipPage9_3')}
            </AppText>
          </View>
        </View>
      </View>
    ),
  },
  page11: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide11_1.png'),
    title: stepsTitle.step6,
    step: 6,
    tip: () => (
      <View style={styles.tipContainer}>
        {renderTips()}
        <View style={styles.tipTextContainer}>
          <AppText style={[styles.tipText, {marginHorizontal: 5}]}>
            {i18n.t('centerDot')}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginBottom: isDeviceSize('medium') ? 32 : 0,
            }}>
            <AppText style={styles.tipBoldText}>
              {i18n.t('userGuide:tipPage11_1')}
              <AppText style={styles.tipText}>
                {i18n.t('userGuide:tipPage11_2')}
              </AppText>
            </AppText>
          </View>
        </View>
      </View>
    ),
  },
};
