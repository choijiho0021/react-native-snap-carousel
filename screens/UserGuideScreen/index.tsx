/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import {ScrollView} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepPage: {
    flex: 1,
    alignItems: 'center',
    marginBottom: isDeviceSize('medium') ? 16 : 32,
  },
  image: {
    // width: '100%',
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    height: 56,
  },
  logo: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  checkInfo: {
    flex: 3,
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginTop: 77,
  },
  slideGuide: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginRight: 20,
    marginVertical: 40,
  },
  slideGuideBox: {
    flexDirection: 'row',
    width: 141,
    height: 39,
    borderRadius: 20,
    borderColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  checkInfoText: {
    ...appStyles.normal16Text,
    fontSize: isDeviceSize('medium') ? 14 : 16,
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
  const [carouselIdx, setCarouselIdx] = useState(0);
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

          <View style={{flex: 2, alignItems: 'center', marginTop: 46}}>
            {data?.title.map((elm) => (
              <AppTextJoin data={elm} />
            ))}
          </View>

          <View style={{flex: 4, marginTop: 40}}>
            <Image
              source={require('../assets/images/esim/userGuide/userGuide1_1.png')}
              resizeMode="contain"
            />
          </View>

          <View style={styles.checkInfo}>
            <AppText style={appStyles.bold18Text}>
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
                    style={[appStyles.normal16Text, {marginHorizontal: 5}]}>
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
          </View>
          <View style={styles.slideGuide}>
            <View style={styles.slideGuideBox}>
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
      <View style={styles.stepPage}>
        <View style={{alignItems: 'center'}}>
          <View style={[styles.step, {marginTop: 40}]}>
            <AppText style={styles.stepText}>{`Step. ${data.step}`}</AppText>
          </View>

          {data?.title.map((elm, idx) => (
            <AppTextJoin data={elm} style={{bottom: idx === 0 ? 0 : 10}} />
          ))}
        </View>

        <View
          style={{
            marginTop: 22,
          }}>
          {data.tip && data.tip()}
        </View>

        {index === 3 && (
          <AppText
            style={{
              color: colors.warmGrey,
              marginBottom: 8,
            }}>
            {i18n.t('userGuide:tipPage4_3')}
          </AppText>
        )}

        <View
          style={{
            width: '100%',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          <Image
            style={[styles.image, !isDeviceSize('medium') && {height: '90%'}]}
            source={data.image}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  }, []);

  const renderTailPage = useCallback((data, index) => {
    const image1 = require('../assets/images/esim/userGuide/eSIMUserGuide11_1.png');
    const image2 = require('../assets/images/esim/userGuide/eSIMUserGuide11_2.png');
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <View style={[styles.step, {marginTop: 40}]}>
            <AppText style={styles.stepText}>{`Step. ${data.step}`}</AppText>
          </View>

          {data?.title.map((elm, idx) => (
            <AppTextJoin data={elm} style={{bottom: idx === 0 ? 0 : 10}} />
          ))}
        </View>

        <View style={{flex: 1, top: 20}}>{data.tip && data.tip()}</View>

        <View style={{flex: 1}}>
          <Image source={image1} resizeMode="contain" />
        </View>
        <View style={{flex: 2, justifyContent: 'center'}}>
          <Image source={image2} resizeMode="contain" />
        </View>
      </View>
    );
  }, []);

  const renderBody = useCallback(
    (item: CarouselIndex, index: number) => {
      if (index === 0) return renderHeadPage(guideImages[item]);
      if (index !== Object.keys(guideImages).length - 1)
        return renderStepPage(guideImages[item], index);
      return renderTailPage(guideImages[item], index);
    },
    [renderHeadPage, renderStepPage, renderTailPage],
  );

  const renderGuide = useCallback(
    ({item, index}: {item: CarouselIndex; index: number}) => (
      <View style={styles.container}>
        {renderModalHeader(index)}

        {isDeviceSize('medium') ? (
          <ScrollView>{renderBody(item, index)}</ScrollView>
        ) : (
          renderBody(item, index)
        )}
      </View>
    ),
    [renderBody, renderModalHeader],
  );

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: carouselIdx === 0 ? colors.white : colors.paleGreyTwo,
      }}>
      <Carousel
        data={Object.keys(guideImages)}
        renderItem={renderGuide}
        onSnapToItem={(index) => setCarouselIdx(index)}
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
