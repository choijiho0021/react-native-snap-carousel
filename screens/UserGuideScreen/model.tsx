/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {colors} from '@/constants/Colors';
import {appStyles, formatText} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppTextJoin from '@/components/AppTextJoin';
import AppStyledText from '@/components/AppStyledText';
import Env from '@/environment';
import {GuideOption} from './GuideHomeScreen';
import {GuideRegion} from './GuideSelectRegionScreen';
import AppSvgIcon from '@/components/AppSvgIcon';

const {isIOS} = Env.get();

const dir = '../../assets/images/esim/userGuide';

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleBoldText: {
    ...appStyles.bold24Text,
    lineHeight: 32,
  },
  titleText: {
    ...appStyles.semiBold22Text,
    lineHeight: 28,
    letterSpacing: -0.44,
  },
  step: {
    borderRadius: 20,
    backgroundColor: colors.black,
    marginRight: 8,
    width: 25,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  stepText: {
    ...appStyles.bold13Text,
    lineHeight: 15,
    color: 'white',
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
    letterSpacing: !isIOS ? -1 : 0,
  },
  noticeBox: {
    backgroundColor: colors.veryLightBlue,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 40,
  },
  noticeBoxTitle: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.clearBlue,
  },
  noticeBoxBody: {
    ...appStyles.medium14,
    lineHeight: 18,
    letterSpacing: -0.28,
    color: colors.deepDarkBlue,
  },
  isLocalBox: {
    paddingVertical: 26,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: colors.whiteFive,
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    width: Dimensions.get('window').width - 40,

    elevation: 12,
    shadowColor: 'rgb(166, 168, 172)',
    shadowRadius: 12,
    shadowOpacity: 0.16,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  isLocalBoxTitle: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    color: colors.clearBlue,
  },
  isLocalBoxBody: {
    ...appStyles.semiBold14Text,
    lineHeight: 20,
    color: colors.black,
  },
});

const renderTips = () => (
  <AppText
    style={{
      ...appStyles.semiBold14Text,
      fontSize: isDeviceSize('medium') ? 14 : 16,
      color: colors.clearBlue,
      marginBottom: 4,
    }}>
    {i18n.t('userGuide:tip')}
  </AppText>
);

const renderOneText = (text: string, idx: number, isBold = false) => {
  return (
    <AppTextJoin
      key={idx}
      textStyle={isBold ? styles.titleBoldText : styles.titleText}
      data={formatText('b', {
        text,
        textStyle: styles.blueText,
      })}
    />
  );
};

const renderText = (key: string, isBold = false) => {
  const text = i18n.t(key).split('\n');
  if (text.length > 0)
    return (
      <View style={{alignItems: 'center'}}>
        {text.map((t, i) => renderOneText(t, i, isBold))}
      </View>
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

const tipView = (params: RenderTipParams, renderTitle = true) => (
  <View style={styles.tipContainer}>
    {renderTitle && renderTips()}
    {renderTip(params)}
    {!renderTitle && <View style={{marginBottom: 36}} />}
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
            <AppText style={[styles.tipBoldText, {marginRight: 5}]}>
              {i18n.t('centerDot')}
            </AppText>
          )}
          {renderTipText(`${id}_${k}`)}
        </View>
      ))}
    </View>
  </View>
);

const renderNoticeBox = (title: string, body: string) => (
  <View style={styles.noticeBox}>
    <AppText style={styles.noticeBoxTitle}>{i18n.t(title)}</AppText>
    <AppStyledText
      text={i18n.t(body)}
      textStyle={styles.noticeBoxBody}
      format={{b: {fontWeight: '600'}}}
    />
  </View>
);

const renderIsLocalBox = () => (
  <View style={styles.isLocalBox}>
    <AppText style={styles.isLocalBoxTitle}>
      {i18n.t('userGuide:isLocal')}
    </AppText>
    <View style={styles.row}>
      <AppText style={styles.isLocalBoxBody}>
        {i18n.t('userGuide:checkSetting:title')}
      </AppText>
      <AppSvgIcon name="rightArrow20" />
    </View>
  </View>
);

export const getImageList = (
  guideOption: GuideOption,
  region: GuideRegion,
): Record<string, any[]> => {
  let imageList: Record<string, any[]> = {};

  if (isIOS) {
    if (guideOption === 'esimReg') {
      if (region === 'korea') {
        imageList = {
          page1: [require(`${dir}/ios/esimReg/korea/img_0.png`)],
          page2: [
            require(`${dir}/ios/esimReg/korea/img_1.png`),
            require(`${dir}/ios/esimReg/korea/en/img_1.png`),
          ],
          page3: [
            require(`${dir}/ios/esimReg/korea/img_2.png`),
            require(`${dir}/ios/esimReg/korea/en/img_2.png`),
          ],
          page4: [
            require(`${dir}/ios/esimReg/korea/img_3.png`),
            require(`${dir}/ios/esimReg/korea/en/img_3.png`),
          ],
          page5: [
            require(`${dir}/ios/esimReg/korea/img_4.png`),
            require(`${dir}/ios/esimReg/korea/en/img_4.png`),
          ],
          page6: [
            require(`${dir}/ios/esimReg/korea/img_5.png`),
            require(`${dir}/ios/esimReg/korea/en/img_5.png`),
          ],
          page7: [
            require(`${dir}/ios/esimReg/korea/img_6.png`),
            require(`${dir}/ios/esimReg/korea/en/img_6.png`),
          ],
          page8: [
            require(`${dir}/ios/esimReg/korea/img_7.png`),
            require(`${dir}/ios/esimReg/korea/en/img_7.png`),
          ],
          page9: [
            require(`${dir}/ios/esimReg/korea/img_8.png`),
            require(`${dir}/ios/esimReg/korea/en/img_8.png`),
          ],
          page10: [
            require(`${dir}/ios/esimReg/korea/img_9.png`),
            require(`${dir}/ios/esimReg/korea/en/img_9.png`),
          ],
          page11: [
            require(`${dir}/ios/esimReg/korea/img_10.png`),
            require(`${dir}/ios/esimReg/korea/en/img_10.png`),
          ],
          pageLast: [
            require(`${dir}/ios/esimReg/korea/img_11.png`),
            require(`${dir}/ios/esimReg/korea/en/img_11.png`),
          ],
        };
      } else {
        imageList = {
          page1: [require(`${dir}/ios/esimReg/local/img_0.png`)],
          page2: [
            require(`${dir}/ios/esimReg/local/img_1.png`),
            require(`${dir}/ios/esimReg/local/en/img_1.png`),
          ],
          page3: [
            require(`${dir}/ios/esimReg/local/img_2.png`),
            require(`${dir}/ios/esimReg/local/en/img_2.png`),
          ],
          page4: [
            require(`${dir}/ios/esimReg/local/img_3.png`),
            require(`${dir}/ios/esimReg/local/en/img_3.png`),
          ],
          page5: [
            require(`${dir}/ios/esimReg/local/img_4.png`),
            require(`${dir}/ios/esimReg/local/en/img_4.png`),
          ],
          page6: [
            require(`${dir}/ios/esimReg/local/img_5.png`),
            require(`${dir}/ios/esimReg/local/en/img_5.png`),
          ],
          page7: [
            require(`${dir}/ios/esimReg/local/img_6.png`),
            require(`${dir}/ios/esimReg/local/en/img_6.png`),
          ],
          page8: [
            require(`${dir}/ios/esimReg/local/img_7.png`),
            require(`${dir}/ios/esimReg/local/en/img_7.png`),
          ],
          page9: [
            require(`${dir}/ios/esimReg/local/img_8.png`),
            require(`${dir}/ios/esimReg/local/en/img_8.png`),
          ],
          page10: [
            require(`${dir}/ios/esimReg/local/img_9.png`),
            require(`${dir}/ios/esimReg/local/en/img_9.png`),
          ],
          page11: [
            require(`${dir}/ios/esimReg/local/img_10.png`),
            require(`${dir}/ios/esimReg/local/en/img_10.png`),
          ],
          pageLast: [
            require(`${dir}/ios/esimReg/local/img_11.png`),
            require(`${dir}/ios/esimReg/local/en/img_11.png`),
          ],
        };
      }
    } else if (region === 'korea') {
      imageList = {
        page1: [require(`${dir}/ios/checkSetting/korea/img_0.png`)],
        page2: [
          require(`${dir}/ios/checkSetting/korea/img_1.png`),
          require(`${dir}/ios/checkSetting/korea/en/img_1.png`),
        ],
        page3: [
          require(`${dir}/ios/checkSetting/korea/img_2.png`),
          require(`${dir}/ios/checkSetting/korea/en/img_2.png`),
        ],
        page4: [
          require(`${dir}/ios/checkSetting/korea/img_3.png`),
          require(`${dir}/ios/checkSetting/korea/en/img_3.png`),
        ],
        page5: [
          require(`${dir}/ios/checkSetting/korea/img_4.png`),
          require(`${dir}/ios/checkSetting/korea/en/img_4.png`),
        ],
        page5Local: [
          require(`${dir}/ios/checkSetting/korea/localNet/img_4.png`),
          require(`${dir}/ios/checkSetting/korea/localNet/en/img_4.png`),
        ],
        page6: [
          require(`${dir}/ios/checkSetting/korea/img_5.png`),
          require(`${dir}/ios/checkSetting/korea/en/img_5.png`),
        ],
        page7: [
          require(`${dir}/ios/checkSetting/korea/img_6.png`),
          require(`${dir}/ios/checkSetting/korea/en/img_6.png`),
        ],
        page8: [
          require(`${dir}/ios/checkSetting/korea/img_7.png`),
          require(`${dir}/ios/checkSetting/korea/en/img_7.png`),
        ],
        pageLast: [
          require(`${dir}/ios/checkSetting/korea/img_8.png`),
          require(`${dir}/ios/checkSetting/korea/en/img_8.png`),
        ],
      };
    } else {
      imageList = {
        page1: [require(`${dir}/ios/checkSetting/local/img_0.png`)],
        page2: [
          require(`${dir}/ios/checkSetting/local/img_1.png`),
          require(`${dir}/ios/checkSetting/local/en/img_1.png`),
        ],
        page3: [
          require(`${dir}/ios/checkSetting/local/img_2.png`),
          require(`${dir}/ios/checkSetting/local/en/img_2.png`),
        ],
        page4: [
          require(`${dir}/ios/checkSetting/local/img_3.png`),
          require(`${dir}/ios/checkSetting/local/en/img_3.png`),
        ],
        page5: [
          require(`${dir}/ios/checkSetting/local/img_4.png`),
          require(`${dir}/ios/checkSetting/local/en/img_4.png`),
        ],

        pageLast: [
          require(`${dir}/ios/checkSetting/local/img_5.png`),
          require(`${dir}/ios/checkSetting/local/en/img_5.png`),
        ],
      };
    }
  } else if (guideOption === 'esimReg') {
    if (region === 'korea') {
      imageList = {
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
      };
    } else {
      imageList = {
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
      };
    }
  } else if (region === 'korea') {
    imageList = {
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
    };
  } else {
    imageList = {
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
    };
  }
  return imageList;
};

export type GuideImage = {
  key: string;
  title: JSX.Element;
  step: number;
  isHeader?: boolean;
  stepPreText?: string;
  tip?: () => JSX.Element | null;
  noticeBox?: () => JSX.Element | null;
  isLocalBox?: () => JSX.Element | null;
  caption?: string;
  localTitle?: JSX.Element;
};

export const getGuideImages = (
  guideOption: GuideOption,
  region: GuideRegion,
): GuideImage[] => {
  let guideImages: GuideImage[] = [];

  if (isIOS) {
    if (guideOption === 'esimReg') {
      if (region === 'korea') {
        guideImages = [
          {
            key: 'page1',
            title: renderText(
              `userGuide:ios:${guideOption}:${region}:stepTitle0`,
              true,
            ),
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
            tip: () => tipView({id: 'userGuide:tipPage7_1'}, false),
          },
          {
            key: 'page8',
            title: renderText('userGuide:stepsTitle8:ios'),
            tip: () => tipView({id: 'userGuide:tipPage7_1'}, false),
            step: 6,
          },
          {
            key: 'page9',
            title: renderText('userGuide:stepsTitle9:ios'),
            step: 7,
            tip: () => renderTipList('userGuide:tipPage9', 'dot'),
          },
          {
            key: 'page10',
            title: renderText('userGuide:stepsTitle10:ios'),
            step: 8,
            tip: () => tipView({id: 'userGuide:tipPage10_1'}),
            noticeBox: () =>
              renderNoticeBox(
                'userGuide:noticeBox:local:title',
                'userGuide:noticeBox:local:body1',
              ),
          },
          {
            key: 'page11',
            title: renderText('userGuide:stepsTitle11:ios'),
            step: 9,
            tip: () => tipView({id: 'userGuide:tipPage11_1'}),
            noticeBox: () =>
              renderNoticeBox(
                'userGuide:noticeBox:local:title',
                'userGuide:noticeBox:local:body2',
              ),
          },
          {
            key: 'page12',
            title: renderText('userGuide:stepsTitle12:ios'),
            step: 99,
          },
        ];
      } else {
        guideImages = [
          {
            key: 'page1',
            title: renderText(
              `userGuide:ios:${guideOption}:${region}:stepTitle0`,
              true,
            ),
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
            tip: () => tipView({id: 'userGuide:tipPage7_1'}, false),
          },
          {
            key: 'page8',
            title: renderText('userGuide:stepsTitle8:ios'),
            tip: () => tipView({id: 'userGuide:tipPage7_1'}, false),
            step: 6,
          },
          {
            key: 'page9',
            title: renderText('userGuide:stepsTitle9:ios'),
            step: 7,
            tip: () => renderTipList('userGuide:tipPage9', 'dot'),
          },
          {
            key: 'page10',
            title: renderText('userGuide:stepsTitle10:ios'),
            step: 8,
            tip: () => tipView({id: 'userGuide:tipPage10_1'}),
          },
          {
            key: 'page11',
            title: renderText('userGuide:stepsTitle11:ios:local'),
            step: 9,
            noticeBox: () =>
              renderNoticeBox(
                'userGuide:noticeBox:local:title',
                'userGuide:noticeBox:local:body3',
              ),
          },
          {
            key: 'page12',
            title: renderText('userGuide:stepsTitle12:ios:local'),
            step: 99,
          },
        ];
      }
    } else if (region === 'korea') {
      guideImages = [
        {
          key: 'page1',
          title: renderText('userGuide:ios:checkSetting:korea:stepTitle0'),
          step: 0,
        },
        {
          key: 'page2',
          title: renderText('userGuide:stepsTitle1:ios:checkSetting'),
          step: 1,
          stepPreText: 'korea',
        },
        {
          key: 'page3',
          title: renderText('userGuide:stepsTitle2:ios:checkSetting'),
          step: 2,
          stepPreText: 'korea',
        },
        {
          key: 'page4',
          title: renderText('userGuide:stepsTitle3:ios:checkSetting'),
          step: 2,
          isHeader: true,
          isLocalBox: () => renderIsLocalBox(),
        },
        {
          key: 'page5',
          title: renderText('userGuide:stepsTitle4:ios:checkSetting'),
          localTitle: renderText(
            'userGuide:stepsTitle4:ios:checkSetting:local',
          ),
          step: 1,
          stepPreText: 'local',
        },
        {
          key: 'page6',
          title: renderText('userGuide:stepsTitle5:ios:checkSetting'),
          step: 2,
          stepPreText: 'local',
        },
        {
          key: 'page7',
          title: renderText('userGuide:stepsTitle6:ios:checkSetting'),
          step: 3,
          stepPreText: 'local',
        },
        {
          key: 'page8',
          title: renderText('userGuide:stepsTitle7:ios:checkSetting'),
          step: 4,
          stepPreText: 'local',
        },
        {
          key: 'page9',
          title: renderText('userGuide:stepsTitle8:ios:checkSetting'),
          step: 99,
        },
      ];
    } else {
      guideImages = [
        {
          key: 'page1',
          title: renderText('userGuide:ios:checkSetting:local:stepTitle0'),
          step: 0,
        },
        {
          key: 'page2',
          title: renderText('userGuide:stepsTitle4:ios:checkSetting:local'),
          step: 1,
          stepPreText: 'local',
        },
        {
          key: 'page3',
          title: renderText('userGuide:stepsTitle5:ios:checkSetting'),
          step: 2,
          stepPreText: 'local',
        },
        {
          key: 'page4',
          title: renderText('userGuide:stepsTitle6:ios:checkSetting'),
          step: 3,
          stepPreText: 'local',
        },
        {
          key: 'page5',
          title: renderText('userGuide:stepsTitle7:ios:checkSetting'),
          step: 4,
          stepPreText: 'local',
        },
        {
          key: 'page6',
          title: renderText('userGuide:stepsTitle8:ios:checkSetting'),
          step: 99,
        },
      ];
    }
  } else if (guideOption === 'esimReg') {
    if (region === 'korea') {
      guideImages = [
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
          tip: () => renderTipList('userGuide:tipPage5:galaxy', 'dot'),
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
      ];
    } else {
      guideImages = [
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
          tip: () => renderTipList('userGuide:tipPage5:galaxy', 'dot'),
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
      ];
    }
  } else if (region === 'korea') {
    guideImages = [
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
        tip: () => renderTipList('userGuide:tipPage5:galaxy', 'dot'),
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
    ];
  } else {
    guideImages = [
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
        tip: () => renderTipList('userGuide:tipPage5:galaxy', 'dot'),
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
    ];
  }

  return guideImages;
};
