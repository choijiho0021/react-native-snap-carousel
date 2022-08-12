import Clipboard from '@react-native-community/clipboard';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  Linking,
  Dimensions,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {navigate} from '@/navigation/navigation';
import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import {sliderWidth} from '@/constants/SliderEntry.style';
import AppSnackBar from '@/components/AppSnackBar';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppStyledText from '@/components/AppStyledText';
import {getImage} from '@/utils/utils';

const {width} = Dimensions.get('window');

const dir = '../assets/images/guide_HK';
const guideImage: Record<string, any[]> = {
  step1: [require(`${dir}/guideHK1.png`), require(`${dir}/en.guideHK1.png`)],
  step2: [require(`${dir}/guideHK2.png`), require(`${dir}/en.guideHK2.png`)],
  step3: [require(`${dir}/guideHK3.png`), require(`${dir}/en.guideHK3.png`)],
  step4: [require(`${dir}/guideHK4.png`), require(`${dir}/en.guideHK4.png`)],
  step5: [require(`${dir}/guideHK5.png`), require(`${dir}/en.guideHK5.png`)],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  btnCopy: {
    backgroundColor: colors.white,
    width: 62,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    marginLeft: 20,
    borderColor: colors.lightGrey,
  },
  keyTitle: {
    ...appStyles.normal16Text,
    marginBottom: 10,
    color: colors.warmGrey,
  },
  guide: {
    ...appStyles.bold18Text,
    marginBottom: 16,
  },
  copyBox: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteTwo,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  textUnderLine: {
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
  },
  guideContainer: {
    backgroundColor: colors.whiteSix,
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  dotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.black,
  },
  inactiveDotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cccccc',
  },
  confirm: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    color: colors.white,
    textAlign: 'center',
  },
  confirmTitle: {
    ...appStyles.normal18Text,
    color: colors.white,
    textAlign: 'center',
    margin: 5,
  },
  image: {
    width: '100%',
    maxWidth: width - 40,
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
  },
});

type CarouselIndex = 'step1' | 'step2' | 'step3' | 'step4';

type ParamList = {
  RedirectHKScreen: {
    iccid: string;
    orderNo: string;
  };
};

const RedirectHKScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'RedirectHKScreen'>>();

  const [activeSlide, setActiveSlide] = useState(0);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [copyString, setCopyString] = useState('');
  const images = useMemo(() => Object.keys(guideImage), []);
  const params = useMemo(() => route?.params, [route?.params]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('redirectHK')} />,
      headerRight: () => (
        <AppSvgIcon
          name="btnCnter"
          style={styles.btnCnter}
          onPress={() =>
            navigate(navigation, route, 'EsimStack', {
              tab: 'HomeStack',
              screen: 'Contact',
            })
          }
        />
      ),
    });
  }, [navigation, route]);

  const copyToClipboard = useCallback(
    (value?: string) => () => {
      if (value) {
        Clipboard.setString(value);
        setShowSnackBar(true);
        setCopyString(value);
      }
    },
    [],
  );

  const renderGuideHK = useCallback(
    ({item}: {item: CarouselIndex}) => (
      <Image
        style={styles.image}
        source={getImage(guideImage, item)}
        resizeMode="contain"
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <View style={{margin: 20}}>
          <AppStyledText
            textStyle={{
              ...appStyles.normal14Text,
              lineHeight: 20,
              letterSpacing: 0,
            }}
            text={i18n.t('redirectHK:info1')}
            format={{b: {color: colors.blue}}}
          />
          <AppText style={[appStyles.bold14Text, {marginTop: 20}]}>
            {i18n.t('redirectHK:info3')}
          </AppText>
        </View>

        <View style={styles.guideContainer}>
          <AppText style={styles.guide}>{i18n.t('redirectHK:guide')}</AppText>
          <Carousel
            data={images}
            renderItem={renderGuideHK}
            onSnapToItem={(index) => setActiveSlide(index)}
            autoplay={false}
            useScrollView
            lockScrollWhileSnapping
            resizeMode="contain"
            overflow="hidden"
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
          />

          <Pagination
            dotsLength={images.length}
            activeDotIndex={activeSlide}
            dotContainerStyle={{width: 2, height: 15}}
            dotStyle={styles.dotStyle}
            inactiveDotStyle={styles.inactiveDotStyle}
            inactiveDotOpacity={0.4}
            inactiveDotScale={1.0}
            containerStyle={{paddingTop: 16, paddingBottom: 0}}
          />
        </View>
        <View style={{paddingHorizontal: 20, marginBottom: 32, marginTop: 24}}>
          {['iccid', 'orderNo'].map((elm) => (
            <View style={styles.copyBox}>
              <View style={{flex: 9}}>
                <AppText style={styles.keyTitle}>
                  {i18n.t(`redirectHK:${elm}`)}
                </AppText>
                <View style={styles.textUnderLine}>
                  <AppText style={[appStyles.bold16Text]}>
                    {params[elm]}
                  </AppText>
                </View>
              </View>
              <AppButton
                title={i18n.t('copy')}
                titleStyle={[
                  appStyles.normal14Text,
                  {
                    color:
                      copyString === params[elm]
                        ? colors.clearBlue
                        : colors.black,
                  },
                ]}
                style={[
                  styles.btnCopy,
                  {
                    borderColor:
                      copyString === params[elm]
                        ? colors.clearBlue
                        : colors.lightGrey,
                  },
                ]}
                onPress={copyToClipboard(params[elm])}
              />
            </View>
          ))}
        </View>
        <AppButton
          style={styles.confirm}
          titleStyle={styles.confirmTitle}
          title={i18n.t('esim:redirectHKRegister')}
          onPress={async () => {
            // 홍콩 실명인증 웹 페이지
            await Linking.openURL(
              'https://global.cmlink.com/store/realname?LT=en',
            );
          }}
        />
      </ScrollView>
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackBar(false)}
        textMessage={i18n.t('redirectHK:copySuccess')}
        bottom={90}
      />
    </SafeAreaView>
  );
};

export default RedirectHKScreen;
