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
});

const renderTips = () => (
  <AppText style={{...appStyles.bold14Text, color: colors.clearBlue}}>
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
        text: '셀룰러 ',
        viewStyle: styles.noneLine,
        textStyle: styles.titleText,
      },
      {
        text: '요금제 레이블을 지정',
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
    tip: () => null,
  },
  page3: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide3.png'),
    title: stepsTitle.step2,
    step: 2,
    tip: () => (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {renderTips()}
        <View
          style={{
            flexDirection: 'row',
            marginRight: 20,
            width: '70%',
            marginBottom: 5,
          }}>
          <View style={styles.step}>
            <AppText style={styles.stepText}>1</AppText>
          </View>
          <AppText style={[appStyles.normal13, {lineHeight: 0}]}>
            {i18n.t('userGuide:tipPage3_1')}
            <AppText style={appStyles.bold13Text}>
              {i18n.t('userGuide:tipPage3_2')}
            </AppText>
            {i18n.t('userGuide:tipPage3_3')}
          </AppText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '70%',
            marginRight: 20,
          }}>
          <View style={styles.step}>
            <AppText style={styles.stepText}>2</AppText>
          </View>
          <AppText style={[appStyles.normal13, {lineHeight: 0}]}>
            {i18n.t('userGuide:tipPage3_4')}
            <AppText style={appStyles.bold13Text}>
              {i18n.t('userGuide:tipPage3_5')}
            </AppText>
            {i18n.t('userGuide:tipPage3_6')}
          </AppText>
        </View>
      </View>
    ),
  },
  page4: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide4.png'),
    title: stepsTitle.step2,
    step: 2,
    tip: () => (
      <View style={{alignItems: 'center', marginHorizontal: 40}}>
        {renderTips()}
        <View style={{flexDirection: 'row', marginHorizontal: 20}}>
          <AppText style={[appStyles.normal14Text, {marginHorizontal: 5}]}>
            •
          </AppText>
          <AppText style={appStyles.bold13Text}>
            {i18n.t('userGuide:tipPage4_1')}
            <AppText style={appStyles.normal13}>
              {i18n.t('userGuide:tipPage4_2')}
            </AppText>
          </AppText>
        </View>
      </View>
    ),
  },
  page5: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide5.png'),
    title: stepsTitle.step3,
    step: 3,
    tip: () => (
      <View style={{alignItems: 'center', marginHorizontal: 40}}>
        {renderTips()}
        <View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 20,
            }}>
            <AppText style={[appStyles.normal14Text, {marginRight: 5}]}>
              •
            </AppText>
            <AppText style={appStyles.medium13}>
              {i18n.t('userGuide:tipPage5_1')}
            </AppText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 20,
            }}>
            <AppText style={[appStyles.normal14Text, {marginRight: 5}]}>
              •
            </AppText>
            <AppText style={appStyles.bold13Text}>
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
    tip: () => null,
  },
  page7: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide7.png'),
    title: stepsTitle.step4,
    step: 4,
    tip: () => null,
  },
  page8: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide8.png'),
    title: stepsTitle.step4,
    step: 4,
    tip: () => (
      <View style={{alignItems: 'center', marginHorizontal: 40}}>
        {renderTips()}
        <View style={{flexDirection: 'row', marginHorizontal: 20}}>
          <AppText style={[appStyles.normal14Text, {marginHorizontal: 5}]}>
            •
          </AppText>
          <AppText style={appStyles.normal13}>
            {i18n.t('userGuide:tipPage8_1')}
            <AppText style={appStyles.bold13Text}>
              {i18n.t('userGuide:tipPage8_2')}
            </AppText>
            <AppText style={[appStyles.bold13Text, {color: colors.tomato}]}>
              {i18n.t('userGuide:tipPage8_3')}
            </AppText>
          </AppText>
        </View>
      </View>
    ),
  },
  page9: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide9.png'),
    title: stepsTitle.step5,
    step: 5,
    tip: null,
  },
  page10: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide10.png'),
    title: stepsTitle.step5,
    step: 5,
    tip: () => (
      <View
        style={{
          alignItems: 'center',
          marginHorizontal: 40,
        }}>
        {renderTips()}
        <View style={{flexDirection: 'row', marginHorizontal: 20}}>
          <AppText style={[appStyles.normal14Text, {marginHorizontal: 5}]}>
            •
          </AppText>
          <AppText style={appStyles.normal13}>
            {i18n.t('userGuide:tipPage9_1')}
            <AppText style={appStyles.bold13Text}>
              {i18n.t('userGuide:tipPage9_2')}
            </AppText>
            {i18n.t('userGuide:tipPage9_3')}
          </AppText>
        </View>
      </View>
    ),
  },
  page11: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide11_1.png'),
    title: stepsTitle.step6,
    step: 6,
    tip: () => null,
  },
};
