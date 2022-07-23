import {StackNavigationProp} from '@react-navigation/stack';
import React, {memo, PropsWithChildren, useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import i18n from '@/utils/i18n';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import AppButton from '@/components/AppButton';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppTextJoin from '@/components/AppTextJoin';
import {API} from '@/redux/api';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteTwo,
  },
  whiteContainer: {
    backgroundColor: colors.white,
    paddingBottom: 64,
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
    backgroundColor: colors.black,
  },
  text: {
    ...appStyles.semiBold16Text,
    top: 10,
  },
});

type Step0Props = {
  step: string;
  marginTop: number;
};
const Step0: React.FC<PropsWithChildren<Step0Props>> = ({
  step,
  marginTop,
  children,
}) => (
  <View style={{alignItems: 'center'}}>
    <View style={[styles.step, {marginTop}]}>
      <AppText
        style={[
          appStyles.bold16Text,
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
      size={[width, (width * 404) / 375]}
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
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('gift:title')} />,
    });
  }, [navigation]);

  useEffect(() => {
    API.Promotion.getStat().then((rsp) => {
      if (rsp.result === 0 && rsp.objects?.length > 0) {
        setGift(rsp.objects[0].recommenderGift);
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.whiteContainer}>
          <View key="top">
            <AppIcon name="giftGuideTop" size={[width, (width * 440) / 375]} />
            <AppText
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
            </AppText>
          </View>
          <View style={{alignItems: 'center'}}>
            <AppText
              style={[
                appStyles.semiBold24Text,
                {marginTop: 40, textAlign: 'center'},
              ]}>
              {i18n.t('gift:guide2-title')}
            </AppText>
          </View>
          <Step key="1" step="1" marginTop={36}>
            <AppTextJoin
              textStyle={styles.text}
              data={[
                {
                  text: i18n.t('gift:guide2-1-1'),
                },
                {
                  text: i18n.t('gift:guide2-1-2'),
                  viewStyle: appStyles.underline,
                },
                {
                  text: i18n.t('gift:guide2-1-3'),
                },
              ]}
            />
          </Step>
          <Step key="2" step="2" marginTop={31}>
            <AppText style={styles.text}>{i18n.t('gift:guide2-2-1')}</AppText>
            <AppTextJoin
              textStyle={styles.text}
              data={[
                {
                  text: i18n.t('gift:guide2-2-2'),
                  viewStyle: appStyles.underline,
                },
                {
                  text: i18n.t('gift:guide2-2-3'),
                },
              ]}
            />
          </Step>
          <Step key="3" step="3" marginTop={64}>
            <AppTextJoin
              textStyle={styles.text}
              data={[
                {
                  text: i18n.t('gift:guide2-3-1'),
                  viewStyle: appStyles.underline,
                },
                {
                  text: i18n.t('gift:guide2-3-2'),
                },
              ]}
            />
            <AppTextJoin
              textStyle={styles.text}
              data={[
                {
                  text: i18n.t('gift:guide2-3-3'),
                  viewStyle: appStyles.underline,
                },
                {
                  text: i18n.t('gift:guide2-3-4'),
                },
              ]}
            />
          </Step>
        </View>
        <View
          style={{
            backgroundColor: colors.whiteTwo,

            paddingHorizontal: 20,
          }}>
          <View style={styles.tip}>
            <AppText
              style={[
                appStyles.bold16Text,
                {color: 'white', flex: 1, textAlign: 'center'},
              ]}>
              Tip.
            </AppText>
          </View>
          <AppText style={[appStyles.normal20Text, {marginTop: 16}]}>
            {i18n.t('gift:tip-1')}
            <AppText style={appStyles.extraBold20}>
              {i18n.t('gift:tip-2')}
            </AppText>
          </AppText>
          <AppText
            style={[
              appStyles.normal24,
              {
                lineHeight: 40,
                color: colors.clearBlue,
                marginTop: 12,
                textAlignVertical: 'bottom',
              },
            ]}>
            {i18n.t('gift:tip-3')}
            <AppText
              style={[appStyles.robotoBold38, {color: colors.clearBlue}]}>
              {gift}
            </AppText>
            <AppText
              style={[appStyles.semiBold24Text, {color: colors.clearBlue}]}>
              {i18n.t('gift:cash')}
            </AppText>
            <AppText style={{fontWeight: 'normal'}}>
              {i18n.t('gift:tip-4')}
            </AppText>
          </AppText>
          <ImageBackground
            source={require('../assets/images/gift/box.png')}
            style={{
              height: 48,
              width: width - 40,
              flexDirection: 'row',
              alignItems: 'flex-end',
              paddingBottom: 10,
              marginTop: -10,
            }}>
            <AppSvgIcon name="pin" style={{marginLeft: 8, marginRight: 6}} />
            <AppText style={[appStyles.normal14Text, {color: colors.warmGrey}]}>
              {i18n.t('gift:tip-5')}
            </AppText>
          </ImageBackground>
          <AppText style={[appStyles.normal13, {marginTop: 16}]}>
            {i18n.t('gift:tip-6')}
          </AppText>
          <AppButton
            title={i18n.t('gift:btn')}
            titleStyle={appStyles.medium18}
            style={{
              marginTop: 32,
              marginBottom: 40,
              backgroundColor: colors.clearBlue,
              height: 62,
            }}
            type="primary"
            onPress={() => {
              navigation.goBack();
              navigation.navigate('HomeStack', {screen: 'Home'});
            }}
          />
          <AppIcon
            name="giftCoin"
            style={{
              position: 'absolute',
              top: 34,
              right: 20,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(GiftGuideScreen);
