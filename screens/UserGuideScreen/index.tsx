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
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import {isDeviceSize, sliderWidth} from '@/constants/SliderEntry.style';
import AppText from '@/components/AppText';
import {appStyles} from '../constants/Styles';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppTextJoin, {StyledText} from '@/components/AppTextJoin';
import AppIcon from '@/components/AppIcon';
import i18n from '@/utils/i18n';
import {guideImages} from './model';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.paleGreyTwo,
    flex: 1,
  },
  image: {
    width: '100%',
    // height: '100%',
    // alignSelf: 'stretch',
    // marginTop: 50,
    // flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    height: 56,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 18,
  },
  checkInfo: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
    marginHorizontal: 20,
  },
  slideGuide: {
    flexDirection: 'row',
    width: 141,
    height: 39,
    borderRadius: 20,
    borderColor: colors.black,
    borderWidth: 1,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginRight: 20,
    marginTop: 55,
    marginBottom: 24,
  },
  checkInfoText: {
    ...appStyles.normal14Text,
    lineHeight: 22,
  },
  step: {
    width: 76,
    height: 25,
    borderRadius: 20,
    backgroundColor: colors.black,
    marginBottom: 4,
  },
  stepText: {
    ...appStyles.bold16Text,
    flex: 1,
    color: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tailImages: {
    justifyContent: 'space-between',
    paddingBottom: 64,
    flex: 1,
  },
});
type CarouselIndex =
  | 'page1'
  | 'page2'
  | 'page3'
  | 'page4'
  | 'page5'
  | 'page6'
  | 'page7'
  | 'page8'
  | 'page9'
  | 'page10'
  | 'page11';

type UserGuideScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ContactBoard'
>;

type UserGuideScreenRouteProp = RouteProp<HomeStackParamList, 'ContactBoard'>;

type UserGuideScreenProps = {
  navigation: UserGuideScreenNavigationProp;
  route: UserGuideScreenRouteProp;
};

const UserGuideScreen: React.FC<UserGuideScreenProps> = ({
  route: {params},
  navigation,
}) => {
  // const [email, setEmail] = useState('');
  const checkInfoList = useMemo(
    () => [
      [
        {
          text: i18n.t('userGuide:checkInfo1_1'),
          textStyle: styles.checkInfoText,
        },
        {
          text: i18n.t('userGuide:checkInfo1_2'),
          textStyle: [styles.checkInfoText, {color: colors.clearBlue}],
        },
        {
          text: i18n.t('userGuide:checkInfo1_3'),
          textStyle: styles.checkInfoText,
        },
      ],
      [
        {
          text: i18n.t('userGuide:checkInfo2_1'),
          textStyle: styles.checkInfoText,
        },
        {
          text: i18n.t('userGuide:checkInfo2_2'),
          textStyle: [styles.checkInfoText, {color: colors.clearBlue}],
        },
        {
          text: i18n.t('userGuide:checkInfo2_3'),
          textStyle: styles.checkInfoText,
        },
        {
          text: i18n.t('userGuide:checkInfo2_4'),
          textStyle: [styles.checkInfoText, {color: colors.clearBlue}],
        },
        {
          text: i18n.t('userGuide:checkInfo2_5'),
          textStyle: styles.checkInfoText,
        },
      ],
      [
        {
          text: i18n.t('userGuide:checkInfo3'),
          textStyle: styles.checkInfoText,
        },
      ],
    ],
    [],
  );

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerShown: false,
      // headerRight: () => <AppBackButton title={i18n.t('board:title')} />,
    });
  }, [navigation]);

  const renderModalHeader = useCallback(
    (index) => (
      <View style={styles.modalHeader}>
        <AppText style={[appStyles.bold16Text, {color: colors.clearBlue}]}>
          {index + 1}
          <AppText style={appStyles.bold16Text}>/11</AppText>
        </AppText>
        <AppSvgIcon
          key="closeModal"
          onPress={() => {
            navigation.goBack();
          }}
          name="closeModal"
        />
      </View>
    ),
    [navigation],
  );

  const renderHeadPage = useCallback(
    (data) => {
      return (
        <View style={[styles.container, {alignItems: 'center'}]}>
          <AppSvgIcon key="esimLogo" style={styles.logo} name="esimLogo" />

          {data?.title.map((elm) => (
            <AppTextJoin data={elm} />
          ))}

          <Image
            style={{marginTop: 34}}
            source={require('../assets/images/esim/userGuide/userGuide1_1.png')}
            resizeMode="contain"
          />
          <View style={styles.checkInfo}>
            <AppText style={appStyles.bold16Text}>
              {i18n.t('userGuide:checkInfo')}
            </AppText>
            <View
              style={{
                marginTop: 8,
                paddingRight: 20,
              }}>
              {checkInfoList.map((elm) => (
                <View style={{flexDirection: 'row'}}>
                  <AppText
                    style={[appStyles.normal14Text, {marginHorizontal: 5}]}>
                    •
                  </AppText>
                  <AppText>
                    {elm.map((elm2) => (
                      <AppText key={elm2.text} style={elm2.textStyle}>
                        {elm2.text}
                      </AppText>
                    ))}
                  </AppText>
                </View>
              ))}
            </View>

            <View style={styles.slideGuide}>
              <AppSvgIcon key="leftArrow" name="leftArrow" />
              <AppText>{i18n.t('userGuide:slideLeft')}</AppText>
            </View>
          </View>
        </View>
      );
    },
    [checkInfoList],
  );

  const renderStepPage = useCallback((data, index) => {
    return (
      <View style={[styles.container, {alignItems: 'center'}]}>
        <View
          style={[styles.step, {marginTop: isDeviceSize('medium') ? 0 : 32}]}>
          <AppText style={styles.stepText}>{`Step. ${data.step}`}</AppText>
        </View>

        {data?.title.map((elm, idx) => (
          <AppTextJoin data={elm} style={{bottom: idx === 0 ? 0 : 10}} />
        ))}

        <View style={{flex: 1, marginTop: isDeviceSize('medium') ? 12 : 42}}>
          {data.tip && data.tip()}
        </View>

        {index === 3 && (
          <AppText style={{marginBottom: 8, color: colors.warmGrey}}>
            {i18n.t('userGuide:tipPage4_3')}
          </AppText>
        )}
        <Image style={styles.image} source={data.image} resizeMode="contain" />
      </View>
    );
  }, []);

  const renderTailPage = useCallback((data, index) => {
    const image1 = require('../assets/images/esim/userGuide/eSIMUserGuide11_1.png');
    const image2 = require('../assets/images/esim/userGuide/eSIMUserGuide11_2.png');
    return (
      <View style={[styles.container, {alignItems: 'center'}]}>
        <View
          style={[styles.step, {marginTop: isDeviceSize('small') ? 8 : 32}]}>
          <AppText style={styles.stepText}>{`Step. ${data.step}`}</AppText>
        </View>

        {data?.title.map((elm) => (
          <AppTextJoin data={elm} />
        ))}

        <View style={{marginTop: isDeviceSize('medium') ? 12 : 42}}>
          {data.tip && data.tip()}
        </View>
        <View style={styles.tailImages}>
          <Image style={{marginTop: 50}} source={image1} resizeMode="contain" />

          <Image source={image2} resizeMode="contain" />
        </View>
      </View>
    );
  }, []);

  const renderGuide = useCallback(
    ({item, index}: {item: CarouselIndex; index: number}) => (
      <View style={styles.container}>
        {renderModalHeader(index)}
        {index === 0 && renderHeadPage(guideImages[item])}
        {index > 0 &&
          index !== Object.keys(guideImages).length - 1 &&
          renderStepPage(guideImages[item], index)}
        {index === Object.keys(guideImages).length - 1 &&
          renderTailPage(guideImages[item], index)}
      </View>
    ),
    [renderHeadPage, renderModalHeader, renderStepPage, renderTailPage],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Carousel
        data={Object.keys(guideImages)}
        renderItem={renderGuide}
        // onSnapToItem={(index) => this.setState({activeSlide: index})}
        autoplay={false}
        useScrollView
        lockScrollWhileSnapping
        sliderWidth={sliderWidth}
        itemWidth={sliderWidth}
      />
    </SafeAreaView>
  );
};

export default UserGuideScreen;
