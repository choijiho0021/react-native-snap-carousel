/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React from 'react';
import {Platform, StyleSheet, TextStyle, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {colors} from '@/constants/Colors';
import {appStyles, formatText} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppTextJoin from '@/components/AppTextJoin';
import AppStyledText from '@/components/AppStyledText';
import Env from '@/environment';

const {isIOS} = Env.get();

const styles = StyleSheet.create({
  titleText: {
    ...appStyles.bold22Text,
    top: isIOS ? 10 : 0,
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
  blueText: {
    color: colors.clearBlue,
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
      data={formatText(
        'b',
        {
          text,
          viewStyle: isIOS ? appStyles.underline : undefined,
          textStyle: isIOS ? undefined : styles.blueText,
        },
        isIOS ? {paddingBottom: 10} : undefined,
      )}
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

const renderTipText = (key: string, style: TextStyle = styles.tipText) => (
  <AppStyledText
    text={i18n.t(key)}
    textStyle={style}
    format={{
      b: styles.tipBoldText,
      s: {...styles.tipBoldText, color: colors.tomato},
    }}
  />
);

type RenderTipParams = {
  id: string;
  marginBottom?: number;
  style?: TextStyle;
};
const renderTip = ({id, marginBottom, style}: RenderTipParams) => (
  <View style={styles.tipTextContainer}>
    <AppText style={[appStyles.normal16Text, {marginRight: 5}]}>
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

const tipView = (params: RenderTipParams) => (
  <View style={styles.tipContainer}>
    {renderTips()}
    {renderTip(params)}
  </View>
);

const renderTipList = (id: string, list: 'dot' | 'num' = 'num') => (
  <View style={styles.tipContainer}>
    {renderTips()}
    <View style={{alignItems: 'flex-start'}}>
      {[1, 2].map((k) => (
        <View key={k} style={styles.tipTextContainer}>
          {list === 'num' ? (
            <View style={styles.step}>
              <AppText style={styles.stepText}>{k}</AppText>
            </View>
          ) : (
            <AppText style={[styles.tipText, {marginRight: 5}]}>
              {i18n.t('centerDot')}
            </AppText>
          )}
          {renderTipText(`${id}_${k}`)}
        </View>
      ))}
    </View>
  </View>
);

const dir = '../../assets/images/esim/userGuide';
const deviceModel = DeviceInfo.getModel();

export const imageList: Record<string, any[]> =
  // eslint-disable-next-line no-nested-ternary
  !isIOS
    ? deviceModel.startsWith('SM')
      ? {
          page1: [require(`${dir}/guide1.png`)],
          page2: [
            require(`${dir}/galaxy/img_1.png`),
            require(`${dir}/galaxy/en/img_1.png`),
          ],
          page3: [
            require(`${dir}/galaxy/img_2.png`),
            require(`${dir}/galaxy/en/img_2.png`),
          ],
          page4: [
            require(`${dir}/galaxy/img_3.png`),
            require(`${dir}/galaxy/en/img_3.png`),
          ],
          page5: [
            require(`${dir}/galaxy/img_4.png`),
            require(`${dir}/galaxy/en/img_4.png`),
          ],
          page6: [
            require(`${dir}/galaxy/img_5.png`),
            require(`${dir}/galaxy/en/img_5.png`),
          ],
          page7: [
            require(`${dir}/galaxy/img_6.png`),
            require(`${dir}/galaxy/en/img_6.png`),
          ],
          pageLast: [
            require(`${dir}/galaxy/img_7.png`),
            require(`${dir}/galaxy/en/img_7.png`),
          ],
          pageLast2: [
            require(`${dir}/img_12.png`),
            require(`${dir}/en/img_12.png`),
          ],
        }
      : {
          page1: [require(`${dir}/guide1.png`)],
          page2: [
            require(`${dir}/aos/img_1.png`),
            require(`${dir}/aos/en/img_1.png`),
          ],
          page3: [
            require(`${dir}/aos/img_3.png`),
            require(`${dir}/aos/en/img_2.png`),
          ],
          page4: [
            require(`${dir}/aos/img_4.png`),
            require(`${dir}/aos/en/img_3.png`),
          ],
          page5: [
            require(`${dir}/aos/img_5.png`),
            require(`${dir}/aos/en/img_4.png`),
          ],
          page6: [
            require(`${dir}/aos/img_6.png`),
            require(`${dir}/aos/en/img_5.png`),
          ],
          page7: [
            require(`${dir}/aos/img_7.png`),
            require(`${dir}/aos/en/img_6.png`),
          ],
          page8: [
            require(`${dir}/aos/img_8.png`),
            require(`${dir}/aos/en/img_7.png`),
          ],
          pageLast: [
            require(`${dir}/aos/img_9.png`),
            require(`${dir}/aos/en/img_8.png`),
          ],
          pageLast2: [
            require(`${dir}/img_12.png`),
            require(`${dir}/en/img_12.png`),
          ],
        }
    : Platform.Version >= '16.0'
    ? {
        page1: [require(`${dir}/guide1.png`)],
        page2: [require(`${dir}/img_1.png`), require(`${dir}/en/img_1.png`)],
        page3: [require(`${dir}/img_2.png`), require(`${dir}/en/img_2.png`)],
        page4: [require(`${dir}/img_3.png`), require(`${dir}/en/img_3.png`)],
        page5: [require(`${dir}/img_4.png`), require(`${dir}/en/img_4.png`)],
        page6: [require(`${dir}/img_5.png`), require(`${dir}/en/img_5.png`)],
        page7: [require(`${dir}/img_6.png`), require(`${dir}/en/img_6.png`)],
        page8: [require(`${dir}/img_7.png`), require(`${dir}/en/img_7.png`)],
        page9: [require(`${dir}/img_8.png`), require(`${dir}/en/img_8.png`)],
        page10: [require(`${dir}/img_9.png`), require(`${dir}/en/img_9.png`)],
        page11: [require(`${dir}/img_10.png`), require(`${dir}/en/img_10.png`)],
        pageLast: [
          require(`${dir}/img_11.png`),
          require(`${dir}/en/img_11.png`),
        ],
        pageLast2: [
          require(`${dir}/img_12.png`),
          require(`${dir}/en/img_12.png`),
        ],
      }
    : {
        page1: [require(`${dir}/guide1.png`)],
        page2: [
          require(`${dir}/ios15/guide2.png`),
          require(`${dir}/en.guide2.png`),
        ],
        page3: [
          require(`${dir}/ios15/guide3.png`),
          require(`${dir}/en.guide3.png`),
        ],
        page4: [require(`${dir}/img_3.png`), require(`${dir}/en.guide4.png`)],
        page5: [require(`${dir}/img_5.png`), require(`${dir}/en.guide5.png`)],
        page6: [require(`${dir}/img_6.png`), require(`${dir}/en.guide6.png`)],
        page7: [require(`${dir}/img_7.png`), require(`${dir}/en.guide7.png`)],
        page8: [require(`${dir}/img_8.png`), require(`${dir}/en.guide8.png`)],
        page9: [require(`${dir}/img_9.png`), require(`${dir}/en.guide9.png`)],
        page10: [
          require(`${dir}/img_10.png`),
          require(`${dir}/en.guide10.png`),
        ],
        pageLast: [
          require(`${dir}/img_11.png`),
          require(`${dir}/en.guide11_1.png`),
        ],
        pageLast2: [
          require(`${dir}/img_12.png`),
          require(`${dir}/en/img_12.png`),
        ],
      };

export type GuideImage = {
  key: string;
  title: JSX.Element;
  step: number;
  tip?: () => JSX.Element | null;
  caption?: string;
};

export const guideImages: GuideImage[] =
  // eslint-disable-next-line no-nested-ternary
  !isIOS
    ? deviceModel.startsWith('SM')
      ? [
          {
            key: 'page1',
            title: renderText('userGuide:stepsTitle0'),
            step: 0,
          },
          {
            key: 'page2',
            title: renderText(`userGuide:stepsTitle1:galaxy`),
            step: 1,
          },
          {
            key: 'page3',
            title: renderText(`userGuide:stepsTitle2:galaxy`),
            step: 2,
            tip: () => renderTipList('userGuide:tipPage2:galaxy'),
          },
          {
            key: 'page4',
            title: renderText(`userGuide:stepsTitle3:galaxy`),
            step: 2,
            tip: () => tipView({id: 'userGuide:tipPage3:galaxy'}),
          },
          {
            key: 'page5',
            title: renderText(`userGuide:stepsTitle4:galaxy`),
            step: 3,
          },
          {
            key: 'page6',
            title: renderText(`userGuide:stepsTitle5:galaxy`),
            step: 4,
            tip: () => renderTipList('userGuide:tipPage5:galaxy'),
          },
          {
            key: 'page7',
            title: renderText(`userGuide:stepsTitle6:galaxy`),
            step: 5,
          },
          {
            key: 'page8',
            title: renderText(`userGuide:stepsTitle7:galaxy`),
            step: 6,
            tip: () => renderTipList('userGuide:tipPageLast', 'dot'),
          },
        ]
      : [
          {
            key: 'page1',
            title: renderText('userGuide:stepsTitle0'),
            step: 0,
          },
          {
            key: 'page2',
            title: renderText(`userGuide:stepsTitle1:android`),
            step: 1,
          },
          {
            key: 'page3',
            title: renderText(`userGuide:stepsTitle3:android`),
            step: 2,
          },
          {
            key: 'page4',
            title: renderText(`userGuide:stepsTitle4:android`),
            step: 3,
            tip: () => renderTipList('userGuide:tipPage4:android'),
          },
          {
            key: 'page5',
            title: renderText(`userGuide:stepsTitle5:android`),
            step: 3,
            tip: () => tipView({id: 'userGuide:tipPage5:android'}),
          },
          {
            key: 'page6',
            title: renderText(`userGuide:stepsTitle6:android`),
            step: 4,
          },
          {
            key: 'page7',
            title: renderText(`userGuide:stepsTitle7:android`),
            step: 5,
            tip: () => tipView({id: 'userGuide:tipPage8:android'}),
          },
          {
            key: 'page8',
            title: renderText(`userGuide:stepsTitle8:android`),
            step: 6,
            tip: () => renderTipList('userGuide:tipPage9:android', 'dot'),
          },
          {
            key: 'page9',
            title: renderText(`userGuide:stepsTitle9:android`),
            step: 7,
            tip: () => renderTipList('userGuide:tipPageLast', 'dot'),
          },
        ]
    : Platform.Version >= '16.0'
    ? [
        {
          key: 'page1',
          title: renderText('userGuide:stepsTitle0'),
          step: 0,
        },
        {
          key: 'page2',
          title: renderText(`userGuide:stepsTitle1:ios`),
          step: 1,
        },
        {
          key: 'page3',
          title: renderText(`userGuide:stepsTitle2:ios`),
          step: 2,
          tip: () => renderTipList('userGuide:tipPage3'),
        },
        {
          key: 'page4',
          title: renderText('userGuide:stepsTitle3:ios'),
          step: 2,
          tip: () => tipView({id: 'userGuide:tipPage4_1'}),
          caption: i18n.t('userGuide:step3:caption'),
        },
        {
          key: 'page5',
          title: renderText('userGuide:stepsTitle4:ios'),
          step: 3,
        },
        {
          key: 'page6',
          title: renderText('userGuide:stepsTitle5:ios'),
          step: 4,
          tip: () => renderTipList('userGuide:tipPage5', 'dot'),
        },
        {
          key: 'page7',
          title: renderText('userGuide:stepsTitle6:ios'),
          step: 5,
        },
        {
          key: 'page8',
          title: renderText('userGuide:stepsTitle6:ios'),
          step: 5,
        },
        {
          key: 'page9',
          title: renderText('userGuide:stepsTitle6:ios'),
          step: 5,
          tip: () => tipView({id: 'userGuide:tipPage9_1'}),
        },
        {
          key: 'page10',
          title: renderText('userGuide:stepsTitle10:ios'),
          step: 6,
          tip: () => tipView({id: 'userGuide:tipPage10_1'}),
        },
        {
          key: 'page11',
          title: renderText('userGuide:stepsTitle10:ios'),
          step: 6,
          tip: () => tipView({id: 'userGuide:tipPage11_1'}),
        },
        {
          key: 'page12',
          title: renderText('userGuide:stepsTitle12:ios'),
          step: 7,
          tip: () => renderTipList('userGuide:tipPageLast', 'dot'),
        },
      ]
    : [
        {
          key: 'page1',
          title: renderText('userGuide:stepsTitle0'),
          step: 0,
        },
        {
          key: 'page2',
          title: renderText(`userGuide:stepsTitle1:ios15`),
          step: 1,
        },
        {
          key: 'page3',
          title: renderText(`userGuide:stepsTitle2:ios`),
          step: 2,
          tip: () => renderTipList('userGuide:tipPage3'),
        },
        {
          key: 'page4',
          title: renderText('userGuide:stepsTitle3:ios'),
          step: 2,
          tip: () => tipView({id: 'userGuide:tipPage4_1'}),
          caption: i18n.t('userGuide:step3:caption'),
        },
        {
          key: 'page5',
          title: renderText('userGuide:stepsTitle5:ios'),
          step: 3,
          tip: () => renderTipList('userGuide:tipPage5', 'dot'),
        },
        {
          key: 'page6',
          title: renderText('userGuide:stepsTitle6:ios'),
          step: 4,
        },
        {
          key: 'page7',
          title: renderText('userGuide:stepsTitle6:ios'),
          step: 4,
        },
        {
          key: 'page8',
          title: renderText('userGuide:stepsTitle6:ios'),
          step: 4,
          tip: () => tipView({id: 'userGuide:tipPage9_1'}),
        },
        {
          key: 'page9',
          title: renderText('userGuide:stepsTitle10:ios'),
          step: 5,
        },
        {
          key: 'page10',
          title: renderText('userGuide:stepsTitle10:ios'),
          step: 5,
          tip: () => tipView({id: 'userGuide:tipPage11_1'}),
        },
        {
          key: 'page11',
          title: renderText('userGuide:stepsTitle12:ios'),
          step: 6,
          tip: () => renderTipList('userGuide:tipPageLast', 'dot'),
        },
      ];
