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
import {useNavigation, useRoute} from '@react-navigation/native';
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

const {isIOS} = Env.get();

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
    marginTop: isIOS ? 40 : 60,
    width: '100%',
  },
  slideGuide: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: isIOS ? 42 : 72,
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
  headerLogo: {
    marginVertical: isIOS ? 64 : 80,
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

const UserGuideScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
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
      return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{alignItems: 'center'}}>
          <View style={{alignItems: 'center', marginTop: 40}}>
            {data?.title}
          </View>
          <View
            style={[
              styles.headerLogo,
              guideOption === 'checkSetting' && {
                marginTop: isIOS ? 48 : 80,
                marginBottom: isIOS ? 42 : 64,
              },
            ]}>
            <Image
              source={getImage(getImageList(guideOption, region), data.key)}
              resizeMode="contain"
            />
          </View>

          {guideOption === 'esimReg' && (
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
              <AppSvgIcon key="threeArrows" name="threeArrows" />
              <AppText style={styles.slideText}>
                {i18n.t('userGuide:slideLeft')}
              </AppText>
            </View>
          </View>

          {data.isLocalBox && (
            <Pressable
              style={{marginTop: 34}}
              onPress={() => {
                setIsCheckLocal(true);
                carouselRef.current?.snapToNext();
              }}>
              {data.isLocalBox()}
            </Pressable>
          )}
        </ScrollView>
      );
    },
    [guideOption, region],
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
          contentContainerStyle={[
            styles.stepPage,
            isDeviceSize('large') ? undefined : {flex: 1},
          ]}>
          <View style={{alignItems: 'center', marginBottom: 21}}>
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
                {`${data.stepPreText ? i18n.t(data.stepPreText) : 'Step.'}${
                  data.stepPreText ? '_' : ' '
                }${data.step}${isCheckLocal ? i18n.t('localNet') : ''}`}
              </AppText>
            </View>
            {isCheckLocal && data.localTitle ? data.localTitle : data.title}
          </View>

          {data.tip ? (
            <View
              style={
                data.noticeBox
                  ? {marginBottom: 12}
                  : {marginBottom: isIOS ? 21 : 38}
              }>
              {isCheckLocal && data.localTip ? data.localTip() : data.tip()}
            </View>
          ) : !isIOS ? (
            <View style={{height: 23}} />
          ) : (
            guideOption === 'checkSetting' && <View style={{height: 79}} />
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
    [dimensions.width, guideOption, isCheckLocal, region, renderHeadPage],
  );

  const renderTailPage = useCallback(
    (data: GuideImage) => (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
        contentContainerStyle={styles.tailPageTitle}>
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
              navigation.navigate('UserGuideStep', {
                guideOption: 'checkSetting',
                region: 'local',
              });
            })}
          </View>
        ) : (
          <View style={isIOS ? {height: 80} : {height: 166}} />
        )}
        <View style={styles.contactFrame}>
          <AppText style={styles.contactTitle}>
            {i18n.t(
              `userGuide:tail:contact:title${
                guideOption === 'esimReg' ? '' : ':checkSetting'
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
        backgroundColor: carouselIdx === 0 ? colors.white : colors.paleGreyTwo,
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
