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
    borderBottomColor: '#b8d1f5',
  },
  titleText: {
    ...appStyles.bold22Text,
    top: 10,
  },
  step: {
    width: 25,
    height: 18,
    borderRadius: 20,
    backgroundColor: colors.black,
    marginTop: 8,
    marginBottom: 4,
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
        // viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
      {
        text: '세부사항  직접 입력',
        viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
      {
        text: '을',
        // viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
    ],
    [
      {
        text: '이용하여 요금제를 추가해주세요.',
        textStyle: styles.titleText,
      },
    ],
  ],
  step3: [
    [
      {
        text: '셀룰러 ',
        // viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
      {
        text: '요금제 레이블을 지정',
        viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
      {
        text: '해주세요.',
        // viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
    ],
  ],
  step4: [
    [
      {
        text: '아래그림처럼',
        // viewStyle: styles.underLine,
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
        textStyle: styles.titleText,
      },
    ],
  ],
  step5: [
    [
      {
        text: '아래그림처럼',
        // viewStyle: styles.underLine,
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
        // viewStyle: styles.underLine,
        textStyle: styles.titleText,
      },
    ],
    [
      {
        text: '잘 잡히는지 확인해주세요',
        // viewStyle: styles.underLine,
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
      <View style={{alignItems: 'center', marginHorizontal: 40}}>
        <AppText style={{...appStyles.bold14Text, color: colors.clearBlue}}>
          {i18n.t('userGuide:tip')}
        </AppText>
        <View style={{flexDirection: 'row', marginHorizontal: 40}}>
          <View style={styles.step}>
            <AppText style={styles.stepText}>1</AppText>
          </View>
          <AppText style={appStyles.normal13}>
            {i18n.t('userGuide:tipPage3_1')}
            <AppText style={appStyles.bold14Text}>
              {i18n.t('userGuide:tipPage3_2')}
            </AppText>
            {i18n.t('userGuide:tipPage3_3')}
          </AppText>
        </View>
        <View style={{flexDirection: 'row', marginHorizontal: 40}}>
          <View style={styles.step}>
            <AppText style={styles.stepText}>2</AppText>
          </View>
          <AppText style={appStyles.normal13}>
            {i18n.t('userGuide:tipPage3_4')}
            <AppText style={appStyles.bold14Text}>
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
    tip: () => null,
  },
  page5: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide5.png'),
    title: stepsTitle.step3,
    step: 3,
    tip: () => null,
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
    tip: () => null,
  },
  page9: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide9.png'),
    title: stepsTitle.step5,
    step: 5,
    tip: () => null,
  },
  page10: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide10.png'),
    title: stepsTitle.step5,
    step: 5,
    tip: () => null,
  },
  page11: {
    image: require('../assets/images/esim/userGuide/eSIMUserGuide11.png'),
    title: stepsTitle.step6,
    step: 6,
    tip: () => null,
  },
};
