import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Image,
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {StackNavigationProp} from '@react-navigation/stack';
import Lottie from 'lottie-react-native';
import {colors} from '@/constants/Colors';
import Env from '@/environment';
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
import AppCarousel, {AppCarouselRef} from '@/components/AppCarousel';
import {ContactListItem} from '../ContactScreen';
import ChatTalk from '@/components/ChatTalk';
import {HomeStackParamList} from '@/navigation/navigation';

const {isIOS} = Env.get();
// const isIOS = false;

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
    backgroundColor: colors.white,
  },
  checkInfo: {
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    // marginTop: isIOS ? 40 : 60,
    width: '100%',
  },
  checkInfoDel: {
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 18,
    width: '100%',
  },
  slideGuide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
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
    ...appStyles.medium14,
    lineHeight: 22,
    color: colors.black,
  },

  step: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: colors.black,
    marginBottom: 2,
    marginTop: 20,
  },
  stepText: {
    ...appStyles.bold16Text,
    lineHeight: 21,
    color: 'white',
    textAlign: 'center',
    // letterSpacing: -0.5,
  },
  slideText: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.black,
    marginLeft: 8,
  },
  tailPageTitle: {
    alignItems: 'center',
    marginBottom: 48,
  },
  tailNoticeText: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    color: colors.warmGrey,
  },
  btn: {
    padding: 30,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: colors.whiteFive,
    borderRadius: 3,
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
    color: colors.warmGrey,
  },
  contactFrame: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 25,
    backgroundColor: colors.white,
  },
  contact: {
    width: '100%',
  },
  contactTitle: {
    ...appStyles.bold20Text,
    lineHeight: 28,
    marginBottom: 16,
  },

  grediant: {
    height: 28,
    width: 78,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 20,
  },
  buttonContainer: {
    flex: 1.0,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    width: '95%',
    margin: 2,
    borderRadius: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: '#4C64FF',
    alignSelf: 'center',
  },
  lottiSize: {
    width: 16,
    height: 16,
  },
});

const dynamicStyle = {
  // guideOption esimReg checkSetting esimDel
  // region korea local us
  headerLogo: (guideOption?: string, region?: string) => {
    if (isIOS) {
      if (guideOption === 'checkSetting')
        return {
          marginTop: 48,
          marginBottom: 42,
        };
      return {
        marginVertical: 64,
      };
    }
    if (!isIOS) {
      if (region === 'us' || guideOption === 'checkSetting')
        return {
          marginTop: 64,
          marginBottom: 34,
        };
      return {
        marginTop: 80,
        marginBottom: 64,
      };
    }
  },
};
type UserGuideScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'UserGuideStep'
>;

const UserGuideScreen = () => {
  const navigation = useNavigation<UserGuideScreenNavigationProp>();
  const route = useRoute<RouteProp<HomeStackParamList, 'UserGuideStep'>>();
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [chatTalkClicked, setChatTalkClicked] = useState(false);
  const [isCheckLocal, setIsCheckLocal] = useState(false);
  const carouselRef = useRef<AppCarouselRef>(null);
  const {guideOption, region} = useMemo(
    () => route?.params || {},
    [route?.params],
  );

  const contactData = useMemo(
    () => [
      {
        key: 'Board',
        title: i18n.t('contact:boardTitle'),
        icon: 'imgBoard',
        page: 'Contact Board',
      },
      {
        key: 'ChatTalk',
        title: i18n.t('contact:chatTalkTitle'),
        icon: 'chatTalk',
        page: 'Open Kakao Talk',
      },
    ],
    [],
  );

  const checkInfo = useMemo(() => {
    if (guideOption === 'esimDel') return [1, 2];

    return region === 'us' ? [1, 2, 3, 4] : [1, 2, 3];
  }, [guideOption, region]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const renderModalHeader = useCallback(
    (index: number) => (
      <View style={styles.modalHeader}>
        <AppText style={[appStyles.bold16Text, {color: colors.clearBlue}]}>
          {index + 1}
          {/* eslint-disable-next-line react-native/no-raw-text */}
          <AppText style={appStyles.bold16Text}>
            /{getGuideImages(guideOption, region).length}
          </AppText>
        </AppText>
        <AppSvgIcon
          key="closeModal"
          onPress={() => navigation.goBack()}
          name="closeModal"
        />
      </View>
    ),
    [guideOption, navigation, region],
  );

  const renderHeadPage = useCallback(
    (data: GuideImage) => {
      const containStyle =
        guideOption !== 'esimDel' && isDeviceSize('large')
          ? undefined
          : {flex: 1};
      return (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[{alignItems: 'center'}, containStyle]}>
          <View style={{alignItems: 'center', marginTop: 20}}>
            {data?.title}
          </View>
          <View style={dynamicStyle.headerLogo(guideOption, region)}>
            <Image
              source={getImage(getImageList(guideOption, region), data.key)}
              resizeMode="contain"
            />
          </View>

          <View
            style={{
              width: '100%',
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            {['esimReg', 'esimDel'].includes(guideOption) && (
              <View
                style={
                  guideOption === 'esimDel'
                    ? styles.checkInfoDel
                    : styles.checkInfo
                }>
                <AppText style={appStyles.bold18Text}>
                  {i18n.t(`userGuide:${guideOption}:checkInfo`)}
                </AppText>
                <View style={{marginTop: 8}}>
                  {checkInfo.map((k) => (
                    <View key={k} style={{flexDirection: 'row'}}>
                      <AppText
                        style={[appStyles.normal16Text, {marginHorizontal: 5}]}>
                        •
                      </AppText>
                      <View style={{flex: 1}}>
                        <AppStyledText
                          textStyle={styles.checkInfoText}
                          text={i18n.t(
                            `userGuide${
                              region === 'us' ? ':us' : ''
                            }:${guideOption}:checkInfo${k}`,
                          )}
                          format={{
                            b: [
                              appStyles.bold14Text,
                              {color: colors.clearBlue},
                            ],
                          }}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {data.isLocalBox && (
              <Pressable
                onPress={() => {
                  setIsCheckLocal(true);
                  carouselRef.current?.snapToNext();
                }}>
                {data.isLocalBox()}
              </Pressable>
            )}
            <View
              style={[
                styles.slideGuide,
                guideOption === 'checkSetting' && {
                  marginTop: 0,
                  marginBottom: isIOS ? 42 : 83,
                },
              ]}>
              <View style={styles.slideGuideBox}>
                <Lottie
                  autoPlay
                  loop
                  source={require('@/assets/images/lottie/arrow.json')}
                  style={styles.lottiSize}
                />
                <AppText style={styles.slideText}>
                  {i18n.t('userGuide:slideLeft')}
                </AppText>
              </View>
            </View>
          </View>
        </ScrollView>
      );
    },
    [checkInfo, guideOption, region],
  );

  const renderArrowBtn = (
    title: string,
    onPress: () => void,
    body?: string,
  ) => (
    <Pressable key={title} style={styles.btn} onPress={onPress}>
      <View>
        <AppText style={styles.btnTitle}>{i18n.t(title)}</AppText>
        {body && (
          <View style={{marginTop: 4}}>
            <AppText style={styles.btnBody}>{i18n.t(body)}</AppText>
          </View>
        )}
      </View>
      <AppSvgIcon name="rightArrow20" />
    </Pressable>
  );

  const renderStepPage = useCallback(
    (data: GuideImage) => {
      let image;
      let imageSource;
      const imageList = getImageList(guideOption, region);

      if (isCheckLocal) {
        image = getImage(imageList, data.key.concat('Local'));
      }
      if (image) {
        imageSource = Image.resolveAssetSource(image);
      } else {
        image = getImage(imageList, data.key);
        imageSource = Image.resolveAssetSource(image);
      }
      if (data.isHeader) return renderHeadPage(data);
      return (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: colors.white,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.stepPage,
            isDeviceSize('large') ? undefined : {flex: 1},
          ]}>
          <View
            style={{
              marginBottom: 12,
              alignItems: 'center',
            }}>
            {data.stepTitle === 'Bonus' ? (
              <>
                <LinearGradient
                  colors={['#2a7ff6', '#b52af6']}
                  start={{x: 0.0, y: 1.0}}
                  end={{x: 1.0, y: 1.0}}
                  style={styles.grediant}>
                  <View
                    style={[
                      styles.buttonContainer,
                      {backgroundColor: 'white'},
                    ]}>
                    <AppText style={[styles.stepText, styles.buttonText]}>
                      {/* eslint-disable-next-line react-native/no-raw-text */}
                      {data.stepTitle ||
                        `${
                          data.stepPreText ? i18n.t(data.stepPreText) : 'Step.'
                        }${data.stepPreText ? '_' : ' '}${data.step}${
                          isCheckLocal ? i18n.t('localNet') : ''
                        }`}
                    </AppText>
                  </View>
                </LinearGradient>
                <View style={{marginVertical: 10}}>
                  {isCheckLocal && data.localTitle
                    ? data.localTitle
                    : data.title}
                </View>
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.step,
                    data.stepPreText === 'korea' && {
                      backgroundColor: colors.dodgerBlue,
                    },
                    data.stepPreText === 'local' && {
                      backgroundColor: colors.purplyBlue,
                    },
                  ]}>
                  <AppText style={styles.stepText}>
                    {/* eslint-disable-next-line react-native/no-raw-text */}
                    {data.stepTitle ||
                      `${
                        data.stepPreText ? i18n.t(data.stepPreText) : 'Step.'
                      }${data.stepPreText ? '_' : ' '}${data.step}${
                        isCheckLocal ? i18n.t('localNet') : ''
                      }`}
                  </AppText>
                </View>
                <View style={{marginTop: 2, paddingVertical: 10}}>
                  {isCheckLocal && data.localTitle
                    ? data.localTitle
                    : data.title}
                </View>
              </>
            )}
          </View>

          {data.tip && (
            <View style={{marginBottom: 12}}>
              {isCheckLocal && data.localTip ? data.localTip() : data.tip()}
            </View>
          )}

          {data.noticeBox && data.noticeBox(isCheckLocal)}

          <View
            style={{
              width: '100%',
              flex: 1,
              // justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 10,
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
    [dimensions.width, guideOption, isCheckLocal, region, renderHeadPage],
  );

  const renderTailPage = useCallback(
    (data: GuideImage) => (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.tailPageTitle,
          isDeviceSize('large') ? undefined : {flex: 1},
        ]}>
        <View style={{alignItems: 'center', marginTop: 20, marginBottom: 48}}>
          {data?.title}
        </View>

        <Image
          source={getImage(getImageList(guideOption, region), 'pageLast')}
          resizeMode="contain"
        />
        {region === 'korea' ? (
          <View>
            <View
              style={[
                styles.row,
                {
                  marginTop: 24,
                  alignSelf: 'flex-start',
                  marginHorizontal: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                },
              ]}>
              <AppSvgIcon
                name="noticeFlagPurple"
                style={{marginRight: 8, marginTop: 2}}
              />
              <AppText style={styles.tailNoticeText}>
                {i18n.t('userGuide:tail:notice')}
              </AppText>
            </View>
            {renderArrowBtn('userGuide:checkSetting:title', () => {
              navigation.goBack();
              navigation.navigate('UserGuideStep', {
                guideOption: 'checkSetting',
                region: 'local',
              });
            })}
          </View>
        ) : (
          <View style={isIOS ? {height: 180} : {height: 120}} />
        )}
        <View style={styles.contactFrame}>
          <AppText style={styles.contactTitle}>
            {i18n.t(
              `userGuide:tail:contact:title${
                guideOption === 'esimReg'
                  ? ''
                  : guideOption === 'esimDel'
                  ? ':esimDel'
                  : ':checkSetting' // default tail title.?
              }`,
            )}
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
              rowStyle={{height: 74}}
            />
          ))}
        </View>
      </ScrollView>
    ),
    [contactData, guideOption, navigation, region],
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
            <ScrollView
              contentContainerStyle={{flex: 1}}
              showsVerticalScrollIndicator={false}>
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

  useEffect(() => {
    if (guideOption === 'checkSetting')
      if (
        (isIOS && carouselIdx < 4 && region === 'korea') ||
        (isIOS && carouselIdx < 1 && region === 'local') ||
        (!isIOS && carouselIdx < 3 && region === 'korea') ||
        (!isIOS && carouselIdx < 1 && region === 'local')
      )
        setIsCheckLocal(false);
  }, [carouselIdx, guideOption, region]);

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: colors.white,
      }}>
      <ChatTalk
        isClicked={chatTalkClicked}
        setChatTalkClicked={setChatTalkClicked}
      />
      <AppCarousel
        data={getGuideImages(guideOption, region)}
        carouselRef={carouselRef}
        renderItem={renderGuide}
        keyExtractor={(item) => item.key}
        onSnapToItem={setCarouselIdx}
        sliderWidth={dimensions.width}
      />
    </SafeAreaView>
  );
};

export default memo(UserGuideScreen);
