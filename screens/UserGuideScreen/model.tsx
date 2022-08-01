/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React from 'react';
import {StyleSheet, TextStyle, View} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles, formatText} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppTextJoin from '@/components/AppTextJoin';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  titleText: {
    ...appStyles.bold22Text,
    top: 10,
    alignItems: 'center',
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

const renderOneText = (text: string, idx: number) => {
  return (
    <AppTextJoin
      key={idx}
      textStyle={styles.titleText}
      data={formatText('b', {
        text,
        viewStyle: appStyles.underline,
      })}
    />
  );
};

const renderText = (key: string) => {
  const text = i18n.t(key).split('\n');
  if (text.length > 0)
    return (
      <View style={{alignItems: 'center'}}>{text.map(renderOneText)}</View>
    );
  return renderOneText(text[0], 0);
};

const renderTipText = (key: string, style = styles.tipText) => (
  <AppStyledText
    text={i18n.t(key)}
    textStyle={style}
    format={{b: styles.tipBoldText, s: {color: colors.tomato}}}
  />
);

const renderTip = ({
  id,
  marginBottom,
  style,
}: {
  id: string;
  marginBottom?: number;
  style?: TextStyle;
}) => (
  <View style={styles.tipTextContainer}>
    <AppText style={[styles.tipText, {marginRight: 5}]}>
      {i18n.t('centerDot')}
    </AppText>
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        marginBottom,
      }}>
      {renderTipText(id, style)}
    </View>
  </View>
);

export const guideImages = [
  {
    key: 'page1',
    image: require('../assets/images/esim/userGuide/eSIMUserGuide1.png'),
    title: renderText('userGuide:stepsTitle0_1'),
    step: 0,
    tip: () => null,
  },
  {
    key: 'page2',
    image: require('../assets/images/esim/userGuide/eSIMUserGuide2.png'),
    title: renderText('userGuide:stepsTitle1_1'),
    step: 1,
    tip: () =>
      isDeviceSize('medium') && <View style={{height: 39, width: '100%'}} />,
  },
  {
    key: 'page3',
    image: require('../assets/images/esim/userGuide/eSIMUserGuide3.png'),
    title: renderText('userGuide:stepsTitle2_1'),
    step: 2,
    tip: () => (
      <View style={styles.tipContainer}>
        {renderTips()}
        {[1, 2].map((k) => (
          <View key={k} style={styles.tipTextContainer}>
            <View style={styles.step}>
              <AppText style={styles.stepText}>{k}</AppText>
            </View>
            {renderTipText(`userGuide:tipPage3_${k}`)}
          </View>
        ))}
      </View>
    ),
  },
  {
    key: 'page4',
    image: require('../assets/images/esim/userGuide/eSIMUserGuide4.png'),
    title: renderText('userGuide:stepsTitle2_1'),
    step: 2,
    tip: () => (
      <View style={styles.tipContainer}>
        {renderTips()}
        <View style={styles.tipTextContainer}>
          <AppText style={[styles.tipText, {marginHorizontal: 5}]}>
            {i18n.t('centerDot')}
          </AppText>
          {renderTipText('userGuide:tipPage4_1')}
        </View>
        {renderTipText('userGuide:tipPage4_3')}
      </View>
    ),
  },
  {
    key: 'page5',
    image: require('../assets/images/esim/userGuide/eSIMUserGuide5.png'),
    title: renderText('userGuide:stepsTitle3_1'),
    step: 3,
    tip: () => (
      <View style={styles.tipContainer}>
        {renderTips()}
        {renderTip({id: 'userGuide:tipPage5_1'})}
        {renderTip({
          id: 'userGuide:tipPage5_2',
          marginBottom: isDeviceSize('medium') ? 46 : 0,
          style: styles.tipBoldText,
        })}
      </View>
    ),
  },
  {
    key: 'page6',
    image: require('../assets/images/esim/userGuide/eSIMUserGuide6.png'),
    title: renderText('userGuide:stepsTitle4_1'),
    step: 4,
    tip: () => (
      <View style={{height: isDeviceSize('medium') ? 75 : 0, width: '100%'}} />
    ),
  },
  {
    key: 'page7',
    image: require('../assets/images/esim/userGuide/eSIMUserGuide7.png'),
    title: renderText('userGuide:stepsTitle4_1'),
    step: 4,
    tip: () => (
      <View style={{height: isDeviceSize('medium') ? 75 : 0, width: '100%'}} />
    ),
  },
  {
    key: 'page8',
    image: require('../assets/images/esim/userGuide/eSIMUserGuide8.png'),
    title: renderText('userGuide:stepsTitle4_1'),
    step: 4,
    tip: () => (
      <View style={styles.tipContainer}>
        {renderTips()}
        {renderTip({
          id: 'userGuide:tipPage8_1',
          marginBottom: isDeviceSize('medium') ? 36 : 0,
        })}
      </View>
    ),
  },
  {
    key: 'page9',
    image: require('../assets/images/esim/userGuide/eSIMUserGuide9.png'),
    title: renderText('userGuide:stepsTitle5_1'),
    step: 5,
    tip: () => (
      <View style={{height: isDeviceSize('medium') ? 75 : 0, width: '100%'}} />
    ),
  },
  {
    key: 'page10',
    image: require('../assets/images/esim/userGuide/eSIMUserGuide10.png'),
    title: renderText('userGuide:stepsTitle5_1'),
    step: 5,
    tip: () => (
      <View style={styles.tipContainer}>
        {renderTips()}
        {renderTip({
          id: 'userGuide:tipPage9_1',
          marginBottom: isDeviceSize('medium') ? 59 : 0,
        })}
      </View>
    ),
  },
  {
    key: 'page11',
    image: require('../assets/images/esim/userGuide/eSIMUserGuide11_1.png'),
    title: renderText('userGuide:stepsTitle6_1'),
    step: 6,
    tip: () => (
      <View style={styles.tipContainer}>
        {renderTips()}
        {renderTip({
          id: 'userGuide:tipPage11_1',
          marginBottom: isDeviceSize('medium') ? 32 : 0,
        })}
      </View>
    ),
  },
];
