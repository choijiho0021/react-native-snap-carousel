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
  Pressable,
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
import {contactData, ContactListItem} from '../ContactScreen';
import ChatTalk from './ChatTalk';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
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
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: colors.black,
    marginBottom: 14,
    marginTop: 20,
  },
  stepText: {
    ...appStyles.bold16Text,
    lineHeight: 21,
    color: 'white',
    textAlign: 'center',
    // letterSpacing: -0.5,
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
  tailPageTitle: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 48,
  },
  tailNoticeText: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    color: colors.clearBlue,
  },
  btn: {
    padding: 30,
    borderWidth: 1,
    borderColor: colors.whiteFive,
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    width: Dimensions.get('window').width - 40,
    marginBottom: 48,

    elevation: 12,
    shadowColor: 'rgb(166, 168, 172)',
    shadowRadius: 12,
    shadowOpacity: 0.16,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  btnTitle: {
    ...appStyles.bold18Text,
    lineHeight: 22,
    color: colors.black,
  },
  btnBody: {
    ...appStyles.semiBold16Text,
    lineHeight: 24,
    margionTop: 4,
    color: colors.warmGrey,
  },
  contactFrame: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 64,
    backgroundColor: colors.backGrey,
  },
  contact: {
    width: '100%',
  },
  contactTitle: {
    ...appStyles.bold20Text,
    lineHeight: 28,
    marginBottom: 16,
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
  const [chatTalkClicked, setChatTalkClicked] = useState(false);
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

  const renderHeadPage = useCallback((data: GuideImage) => {
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

  const renderArrowBtn = (
    title: string,
    onPress: () => void,
    body?: string,
  ) => (
    <Pressable key={title} style={styles.btn} onPress={onPress}>
      <View>
        <AppText style={styles.btnTitle}>{i18n.t(title)}</AppText>
        {body && <AppText style={styles.btnBody}>{i18n.t(body)}</AppText>}
      </View>
      <AppSvgIcon name="rightArrow20" />
    </Pressable>
  );

  const renderStepPage = useCallback(
    (data: GuideImage) => {
      const image = getImage(getImageList(guideOption, region), data.key);
      const imageSource = Image.resolveAssetSource(image);
      // console.log('@@@@ data.noticeBox', data.noticeBox);
      // console.log('@@@@ data.noticeBox()', data.noticeBox());
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
          <View style={{alignItems: 'center', marginBottom: 21}}>
            <View style={styles.step}>
              <AppText style={styles.stepText}>{`Step. ${data.step}`}</AppText>
            </View>
            {data.title}
          </View>

          {data.tip ? (
            <View
              style={data.noticeBox ? {marginBottom: 12} : {marginBottom: 21}}>
              {data.tip()}
            </View>
          ) : (
            <View style={{height: 28}} />
          )}

          {data.noticeBox && (
            <View style={{marginBottom: 9}}>{data.noticeBox()}</View>
          )}

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
                  {color: colors.warmGrey, marginBottom: 12, marginTop: 18},
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
        contentContainerStyle={styles.tailPageTitle}>
        <View style={{alignItems: 'center', marginTop: 20, marginBottom: 48}}>
          {data?.title}
        </View>

        <Image
          source={getImage(getImageList(guideOption, region), 'pageLast')}
          resizeMode="contain"
        />
        <View
          style={[
            styles.row,
            {
              marginTop: 56,
              alignSelf: 'flex-start',
              marginHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            },
          ]}>
          <AppSvgIcon
            name="noticeFlag"
            style={{marginRight: 8, marginTop: 2}}
          />
          <AppText style={styles.tailNoticeText}>
            {i18n.t('userGuide:tail:notice')}
          </AppText>
        </View>
        {renderArrowBtn('userGuide:checkSetting:title', () => {
          navigation.goBack();
          navigation.navigate('UserGuide', {
            guideOption: 'checkSetting',
            region,
          });
        })}
        <View style={styles.contactFrame}>
          <AppText style={styles.contactTitle}>
            {i18n.t('userGuide:tail:contact:title')}
          </AppText>
          {contactData.map((item) => (
            <ContactListItem
              key={item.key}
              item={item}
              onPress={() => {
                if (item.key === 'Board') {
                  navigation.navigate('ContactBoard');
                } else {
                  setChatTalkClicked(true);
                }
              }}
              style={styles.contact}
            />
          ))}
        </View>
      </ScrollView>
    ),
    [guideOption, isGalaxy, navigation, region],
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
      <ChatTalk
        isClicked={chatTalkClicked}
        setChatTalkClicked={setChatTalkClicked}
      />
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
