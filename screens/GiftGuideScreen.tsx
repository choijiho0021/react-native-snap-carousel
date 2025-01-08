import {StackNavigationProp} from '@react-navigation/stack';
import React, {
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import i18n from '@/utils/i18n';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {appStyles, formatText} from '@/constants/Styles';
import AppButton from '@/components/AppButton';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppTextJoin from '@/components/AppTextJoin';
import {API} from '@/redux/api';
import AppStyledText from '@/components/AppStyledText';
import ScreenHeader from '@/components/ScreenHeader';

const {width} = Dimensions.get('window');

const SAMLL_BOX_WIDTH = 350;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  whiteContainer: {
    backgroundColor: colors.white,
  },
  step: {
    width: 76,
    height: 25,
    borderRadius: 20,
    backgroundColor: colors.black,
  },
  tip: {
    marginTop: 55,
    width: 57,
    height: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.white,
    opacity: 0.7,
  },
  text: {
    ...appStyles.semiBold18Text,
    top: 10,
  },
});

type Step0Props = {
  step: string;
  style?: ViewStyle;
};
const Step0: React.FC<PropsWithChildren<Step0Props>> = ({
  step,
  children,
  style,
}) => (
  <View style={[{alignItems: 'center'}, style]}>
    <View style={styles.step}>
      <AppText
        style={[
          appStyles.normal16Text,
          {
            flex: 1,
            color: 'white',
            justifyContent: 'center',
            alignSelf: 'center',
            textAlign: 'center',
            letterSpacing: -0.5,
          },
        ]}>
        {`Step. ${step}`}
      </AppText>
    </View>
    {children}
    <AppIcon
      name={`giftGuideStep${step}`}
      style={{marginTop: 22}}
      size={[width, (width * 444) / 375]}
    />
  </View>
);
const Step = memo(Step0);

type GiftScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Gift'>;
type GiftGuideProps = {
  navigation: GiftScreenNavigationProp;
};

const GiftGuideScreen: React.FC<GiftGuideProps> = ({navigation}) => {
  const [gift, setGift] = useState('');

  useEffect(() => {
    API.Promotion.getStat().then((rsp) => {
      if (rsp.result === 0 && rsp.objects?.length > 0) {
        setGift(rsp.objects[0].recommenderGift);
      }
    });
  }, []);

  const renderText = useCallback(
    (key: string) => (
      <AppTextJoin
        textStyle={styles.text}
        data={formatText('b', {
          text: i18n.t(key),
          textStyle: {...appStyles.bold18Text, color: colors.clearBlue},
        })}
      />
    ),
    [],
  );

  const boxImage =
    width <= SAMLL_BOX_WIDTH
      ? require('../assets/images/gift/box_320.png')
      : require('../assets/images/gift/box.png');

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={i18n.t('gift:title')} />
      <ScrollView>
        <View style={styles.whiteContainer}>
          <View key="top">
            <AppIcon name="giftGuideTop" size={[width, (width * 440) / 375]} />
            {/* <AppText
              style={{
                ...appStyles.bold16Text,
                color: 'white',
                position: 'absolute',
                bottom: 125,
                left: 0,
                right: 0,
                textAlign: 'center',
              }}>
              {i18n.t('gift:guide1')}
            </AppText>
            <AppText
              style={{
                ...appStyles.bold32Text,
                position: 'absolute',
                bottom: 32,
                color: 'white',
                left: 0,
                right: 0,
                textAlign: 'center',
              }}>
              {i18n.t('gift:guide1-1')}
            </AppText> */}
          </View>
          <View style={{alignItems: 'center'}}>
            <AppText
              style={[
                appStyles.semiBold24Text,
                {marginTop: 40, textAlign: 'center', color: colors.black},
              ]}>
              {i18n.t('gift:guide2-title')}
            </AppText>
          </View>
          <Step key="1" step="1" style={{paddingVertical: 32}}>
            {renderText('gift:guide2-1')}
          </Step>
          <Step
            key="2"
            step="2"
            style={{backgroundColor: colors.giftGuideBg, paddingVertical: 32}}>
            {renderText('gift:guide2-2-1')}
            {renderText('gift:guide2-2-2')}
          </Step>
          <Step key="3" step="3" style={{paddingVertical: 32}}>
            {renderText('gift:guide2-3-1')}
            {renderText('gift:guide2-3-2')}
          </Step>
          <Step
            key="4"
            step="4"
            style={{backgroundColor: colors.giftGuideBg, paddingVertical: 32}}>
            {renderText('gift:guide2-4-1')}
            {renderText('gift:guide2-4-2')}
          </Step>
        </View>

        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={['#112D6E', '#02050C']}
          style={{paddingHorizontal: 20}}>
          <View style={styles.tip}>
            <AppText
              style={[
                appStyles.bold16Text,
                {color: 'white', flex: 1, textAlign: 'center'},
              ]}>
              Tip.
            </AppText>
          </View>
          <AppStyledText
            textStyle={{
              ...appStyles.normal20Text,
              marginTop: 16,
              color: colors.white,
            }}
            text={i18n.t('gift:tip-1')}
            format={{b: appStyles.extraBold20, n: appStyles.normal20Text}}
          />
          <AppStyledText
            textStyle={{
              ...appStyles.normal24,
              lineHeight: 45,
              color: colors.white,
              marginTop: 12,
              textAlignVertical: 'bottom',
            }}
            text={i18n.t('gift:tip-3')}
            format={{
              cash: {...appStyles.robotoBold38, color: colors.white},
              b: {...appStyles.semiBold24Text, color: colors.white},
              n: {fontWeight: 'normal'},
            }}
            data={{cash: gift}}
          />
          <ImageBackground
            source={boxImage}
            resizeMode="stretch"
            style={{
              height: width <= SAMLL_BOX_WIDTH ? 65 : 48,
              width: width - 40,
              flexDirection: 'row',
              alignItems: 'flex-end',
              paddingTop: 10,
              marginTop: 0,
              paddingBottom: 11,
            }}>
            <AppSvgIcon
              name="pin"
              style={
                width <= SAMLL_BOX_WIDTH
                  ? {
                      marginLeft: 8,
                      marginRight: 6,
                      alignSelf: 'center',
                      paddingTop: 5,
                    }
                  : {marginLeft: 8, marginRight: 6}
              }
            />
            <View style={{flex: 1}}>
              <AppText
                style={[
                  appStyles.normal14Text,
                  {
                    color: colors.white,
                    letterSpacing: -0.56,
                    alignItems: 'center',
                    // backgroundColor: 'red',
                    lineHeight: 18,
                  },
                ]}>
                {i18n.t('gift:tip-5')}
              </AppText>
            </View>
          </ImageBackground>
          <AppButton
            title={i18n.t('gift:btn')}
            titleStyle={[appStyles.bold18Text, {color: colors.clearBlue}]}
            style={{
              marginVertical: 32,
              backgroundColor: colors.white,
              height: 62,
              borderRadius: 1000,
            }}
            type="primary"
            onPress={() => {
              navigation.goBack();
              navigation.navigate('HomeStack', {screen: 'Home'});
            }}
          />
          <View style={{flexDirection: 'row'}}>
            <AppText style={{color: colors.white}}>
              {i18n.t('middleDot')}
            </AppText>
            <AppText
              style={[
                appStyles.normal13,
                {color: colors.white, opacity: 0.7, flexWrap: 'wrap'},
              ]}>
              {i18n.t('gift:tip-6')}
            </AppText>
          </View>
          <View style={{flexDirection: 'row'}}>
            <AppText style={{color: colors.white}}>
              {i18n.t('middleDot')}
            </AppText>
            <AppText
              style={[
                appStyles.normal13,
                {
                  marginBottom: 40,
                  color: colors.white,
                  opacity: 0.7,
                  flexWrap: 'wrap',
                },
              ]}>
              {i18n.t('gift:tip-7')}
            </AppText>
          </View>
          {/* <AppText
            style={[
              appStyles.normal13,
              {marginBottom: 40, color: colors.white, opacity: 0.7},
            ]}>
            {i18n.t('gift:tip-6')}
          </AppText> */}

          <AppIcon
            name="gift"
            style={{
              position: 'absolute',
              top: 34,
              right: 20,
            }}
          />
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(GiftGuideScreen);
