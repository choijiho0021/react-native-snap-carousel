/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Image,
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import {isDeviceSize, isFolderOpen} from '@/constants/SliderEntry.style';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import AppSvgIcon from '@/components/AppSvgIcon';
import i18n from '@/utils/i18n';
import {guideImages, imageList} from './model';
import AppStyledText from '@/components/AppStyledText';
import {getImage} from '@/utils/utils';
import AppCarousel from '@/components/AppCarousel';

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
    width: '100%',
    height: '100%',
    // flex: 1,
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

// type CarouselIndex = keyof typeof guideImages;

type UserGuideScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ContactBoard'
>;

type UserGuideScreenProps = {
  navigation: UserGuideScreenNavigationProp;
};

const UserGuideScreen: React.FC<UserGuideScreenProps> = ({navigation}) => {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

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
    (index) => (
      <View style={styles.modalHeader}>
        <AppText style={[appStyles.bold16Text, {color: colors.clearBlue}]}>
          {index + 1}
          <AppText style={appStyles.bold16Text}>/{guideImages.length}</AppText>
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

  const renderHeadPage = useCallback((data) => {
    return (
      <View style={[styles.container, {alignItems: 'center'}]}>
        <AppSvgIcon key="esimLogo" style={styles.logo} name="esimLogo" />

        <View style={{flex: 2, alignItems: 'center', marginTop: 46}}>
          {data?.title}
        </View>

        <View style={{flex: 4, marginTop: 40}}>
          <Image source={getImage(imageList, data.key)} resizeMode="contain" />
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
            {[1, 2, 3].map((k) => (
              <View key={k} style={{flexDirection: 'row'}}>
                <AppText
                  style={[appStyles.normal16Text, {marginHorizontal: 5}]}>
                  •
                </AppText>
                <AppStyledText
                  textStyle={styles.checkInfoText}
                  text={i18n.t(`userGuide:checkInfo${k}`)}
                  format={{b: {color: colors.clearBlue}}}
                />
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
  }, []);

  const renderStepPage = useCallback((data) => {
    return (
      <View style={styles.stepPage}>
        <View style={{alignItems: 'center'}}>
          <View style={[styles.step, {marginTop: 40}]}>
            <AppText style={styles.stepText}>{`Step. ${data.step}`}</AppText>
          </View>
          {data.title}
        </View>

        <View style={{marginTop: 22}}>{data.tip && data.tip()}</View>

        <View
          style={{
            width: '100%',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          <Image
            style={[styles.image, !isDeviceSize('medium') && {height: '90%'}]}
            source={getImage(imageList, data.key)}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }, []);

  const renderTailPage = useCallback(
    (data) => (
      <View style={{flex: 1, alignItems: 'center'}}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <View style={[styles.step, {marginTop: 40}]}>
            <AppText style={styles.stepText}>{`Step. ${data.step}`}</AppText>
          </View>
          {data?.title}
        </View>

        <View style={{flex: 1, top: 20}}>{data.tip && data.tip()}</View>

        <View style={{flex: 1}}>
          <Image source={getImage(imageList, 'page11')} resizeMode="contain" />
        </View>
        <View style={{flex: 2, justifyContent: 'center'}}>
          <Image
            source={getImage(imageList, 'page11_2')}
            resizeMode="contain"
          />
        </View>
      </View>
    ),
    [],
  );

  const renderBody = useCallback(
    (item, index: number) => {
      if (index === 0) return renderHeadPage(item);
      if (index < guideImages.length - 1) return renderStepPage(item);
      return renderTailPage(item);
    },
    [renderHeadPage, renderStepPage, renderTailPage],
  );

  const renderGuide = useCallback(
    ({item, index}) => (
      <View style={[styles.container, {alignItems: 'center'}]}>
        {renderModalHeader(index)}

        <View style={{flex: 1, maxWidth: 414}}>
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
        data={guideImages}
        renderItem={renderGuide}
        keyExtractor={(item) => item.key}
        onSnapToItem={setCarouselIdx}
        sliderWidth={dimensions.width}
        optimize={false}
      />
    </SafeAreaView>
  );
};

export default UserGuideScreen;
