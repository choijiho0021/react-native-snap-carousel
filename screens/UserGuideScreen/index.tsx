/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  StyleSheet,
  Image,
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import {
  isDeviceSize,
  isFolderOpen,
  MAX_WIDTH,
  sliderWidth,
} from '@/constants/SliderEntry.style';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import AppSvgIcon from '@/components/AppSvgIcon';
import i18n from '@/utils/i18n';
import {getImageList, GuideImage, getGuideImages} from './model';
import AppStyledText from '@/components/AppStyledText';
import {getImage} from '@/utils/utils';
import AppCarousel from '@/components/AppCarousel';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepPage: {
    alignItems: 'center',
    paddingBottom: 16,
    width: '100%',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 56,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  checkInfo: {
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 40,
    width: '100%',
  },
  slideGuide: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 42,
  },
  slideGuideBox: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderColor: colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
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
  koreaFlag: {
    marginVertical: 64,
  },
  slideText: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.black,
    marginLeft: 8,
  },
});

// type CarouselIndex = keyof typeof guideImages;

type UserGuideScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ContactBoard',
  'GuideHome'
>;

type UserGuideScreenProps = {
  navigation: UserGuideScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'GuideHome'>;
};

const UserGuideScreen: React.FC<UserGuideScreenProps> = ({
  navigation,
  route: {params},
}) => {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  // const deviceModel = useMemo(() => DeviceInfo.getModel(), []);
  const isGalaxy = useMemo(() => DeviceInfo.getModel().startsWith('SM'), []);
  const guideOption = useMemo(() => params?.guideOption, [params?.guideOption]);
  const region = useMemo(() => params?.region, [params?.region]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerShown: false,
      // headerRight: () => <AppBackButton title={i18n.t('board:title')} />,
    });
  }, [navigation]);

  const renderModalHeader = useCallback(
    (index: number) => (
      <View
        style={[
          styles.modalHeader,
          {
            backgroundColor:
              isGalaxy && index !== 1 ? colors.whiteSeven : colors.white,
          },
        ]}>
        <AppText style={[appStyles.bold16Text, {color: colors.clearBlue}]}>
          {index + 1}
          <AppText style={appStyles.bold16Text}>
            /{getGuideImages(guideOption, region).length}
          </AppText>
        </AppText>
        <AppSvgIcon
          key="closeModal"
          onPress={() => [1, 2, 3].forEach(() => navigation.goBack())}
          name="closeModal"
        />
      </View>
    ),
    [guideOption, isGalaxy, navigation, region],
  );

  const renderRegKorea = useCallback((data: GuideImage) => {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{alignItems: 'center'}}>
        <View style={{alignItems: 'center', marginTop: 40}}>{data?.title}</View>
        <AppSvgIcon key="koreaFlag" style={styles.koreaFlag} name="koreaFlag" />

        <View style={styles.checkInfo}>
          <AppText style={appStyles.bold18Text}>
            {i18n.t('userGuide:checkInfo')}
          </AppText>
          <View style={{marginTop: 8}}>
            {[1, 2, 3].map((k) => (
              <View key={k} style={{flexDirection: 'row'}}>
                <AppText
                  style={[appStyles.normal16Text, {marginHorizontal: 5}]}>
                  •
                </AppText>
                <View style={{flex: 1}}>
                  <AppStyledText
                    textStyle={styles.checkInfoText}
                    text={i18n.t(`userGuide:checkInfo${k}`)}
                    format={{b: {color: colors.clearBlue}}}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.slideGuide}>
          <View style={styles.slideGuideBox}>
            <AppSvgIcon key="threeArrows" name="threeArrows" />
            <AppText style={styles.slideText}>
              {i18n.t('userGuide:slideLeft')}
            </AppText>
          </View>
        </View>
      </ScrollView>
    );
  }, []);

  const renderHeadPage = useCallback(
    (data: GuideImage) => {
      if (guideOption === 'esimReg' && region === 'korea')
        return renderRegKorea(data);
      return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{alignItems: 'center'}}>
          <AppSvgIcon key="esimLogo" style={styles.logo} name="esimLogo" />

          <View style={{alignItems: 'center', marginTop: 23}}>
            {data?.title}
            <AppText style={[appStyles.medium14, {marginTop: 20}]}>
              {
                // eslint-disable-next-line no-nested-ternary
                Platform.OS === 'android'
                  ? i18n.t(
                      `userGuide:stepsTitle0:${isGalaxy ? 'galaxy' : 'pixel'}`,
                    )
                  : Platform.Version >= '16.0' && i18n.locale === 'ko'
                  ? 'iOS 16 ver.'
                  : ''
              }
            </AppText>
          </View>

          <View style={{marginTop: 20}}>
            <Image
              source={getImage(getImageList(guideOption, region), data.key)}
              resizeMode="contain"
            />
          </View>

          <View style={styles.checkInfo}>
            <AppText style={appStyles.bold18Text}>
              {i18n.t('userGuide:checkInfo')}
            </AppText>
            <View style={{marginTop: 8}}>
              {[1, 2, 3].map((k) => (
                <View key={k} style={{flexDirection: 'row'}}>
                  <AppText
                    style={[appStyles.normal16Text, {marginHorizontal: 5}]}>
                    •
                  </AppText>
                  <View style={{flex: 1}}>
                    <AppStyledText
                      textStyle={styles.checkInfoText}
                      text={i18n.t(`userGuide:checkInfo${k}`)}
                      format={{b: {color: colors.clearBlue}}}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.slideGuide}>
            <View style={styles.slideGuideBox}>
              <AppSvgIcon key="leftArrow" name="leftArrow" />
              <AppText style={{marginLeft: 8}}>
                {i18n.t('userGuide:slideLeft')}
              </AppText>
            </View>
          </View>
        </ScrollView>
      );
    },
    [guideOption, isGalaxy, region, renderRegKorea],
  );

  const renderStepPage = useCallback(
    (data: GuideImage) => {
      const image = getImage(getImageList(guideOption, region), data.key);
      const imageSource = Image.resolveAssetSource(image);

      return (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: isGalaxy ? colors.whiteSeven : colors.white,
          }}
          contentContainerStyle={[
            styles.stepPage,
            isDeviceSize('large') ? undefined : {flex: 1},
          ]}>
          <View style={{alignItems: 'center'}}>
            <View style={[styles.step, {marginTop: 20}]}>
              <AppText style={styles.stepText}>{`Step. ${data.step}`}</AppText>
            </View>
            {data.title}
          </View>

          <View style={{marginVertical: 22}}>{data.tip && data.tip()}</View>

          <View
            style={{
              width: '100%',
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            {data.caption ? (
              <AppText
                style={[
                  appStyles.semiBold13Text,
                  {color: colors.warmGrey, marginBottom: 12},
                ]}>
                {data.caption}
              </AppText>
            ) : null}
            <Image
              style={{
                width: dimensions.width,
                height: Math.ceil(
                  imageSource.height * (dimensions.width / imageSource.width),
                ),
              }}
              source={image}
              resizeMode="cover"
            />
          </View>
        </ScrollView>
      );
    },
    [dimensions.width, guideOption, isGalaxy, region],
  );

  const renderTailPage = useCallback(
    (data: GuideImage) => (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: isGalaxy ? colors.whiteSeven : colors.white,
        }}
        contentContainerStyle={{alignItems: 'center'}}>
        <View style={{alignItems: 'center'}}>
          <View style={[styles.step, {marginTop: 20}]}>
            <AppText style={styles.stepText}>{`Step. ${data.step}`}</AppText>
          </View>
          {data?.title}
        </View>

        <View style={{marginTop: 22, marginBottom: 10}}>
          {data.tip && data.tip()}
        </View>

        <View
          style={{
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <Image
            source={getImage(getImageList(guideOption, region), 'pageLast')}
            resizeMode="contain"
          />
          <Image
            source={getImage(getImageList(guideOption, region), 'pageLast2')}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    ),
    [guideOption, isGalaxy, region],
  );

  const renderBody = useCallback(
    (item: GuideImage, index: number) => {
      if (index === 0) return renderHeadPage(item);
      if (index < getGuideImages(guideOption, region).length - 1)
        return renderStepPage(item);
      return renderTailPage(item);
    },
    [guideOption, region, renderHeadPage, renderStepPage, renderTailPage],
  );

  const renderGuide = useCallback(
    ({item, index}: {item: GuideImage; index: number}) => (
      <View
        style={[
          styles.container,
          {alignItems: 'center', width: sliderWidth, backgroundColor: 'white'},
        ]}>
        {renderModalHeader(index)}

        <View style={{flex: 1, maxWidth: MAX_WIDTH, width: '100%'}}>
          {isDeviceSize('medium') || isFolderOpen(dimensions.width) ? (
            <ScrollView contentContainerStyle={{flex: 1}}>
              {renderBody(item, index)}
            </ScrollView>
          ) : (
            renderBody(item, index)
          )}
        </View>
      </View>
    ),
    [dimensions.width, renderBody, renderModalHeader],
  );

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: carouselIdx === 0 ? colors.white : colors.paleGreyTwo,
      }}>
      <AppCarousel
        data={getGuideImages(guideOption, region)}
        renderItem={renderGuide}
        keyExtractor={(item) => item.key}
        onSnapToItem={setCarouselIdx}
        sliderWidth={dimensions.width}
      />
    </SafeAreaView>
  );
};

export default UserGuideScreen;
