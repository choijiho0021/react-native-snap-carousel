import {StackNavigationProp} from '@react-navigation/stack';
import React, {memo, useCallback, useEffect} from 'react';
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

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: colors.black,
  },
});

type GiftScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Gift'>;
type GiftGuideProps = {
  navigation: GiftScreenNavigationProp;
};

const GiftGuideScreen: React.FC<GiftGuideProps> = ({navigation}) => {
  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('gift:title')} />,
    });
  }, [navigation]);

  const renderStep = useCallback(
    (step: string) => (
      <View style={{alignItems: 'center'}}>
        <View style={[styles.step, {marginTop: 36}]}>
          <AppText
            style={[
              appStyles.bold16Text,
              {
                flex: 1,
                color: 'white',
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
              },
            ]}>
            {`Step. ${step}`}
          </AppText>
        </View>
        <AppText
          style={[
            appStyles.semiBold16Text,
            {marginTop: 12, textAlign: 'center'},
          ]}>
          {i18n.t(`gift:guide2-${step}`)}
        </AppText>
        <AppIcon
          name={`giftGuideStep${step}`}
          style={{marginTop: 22}}
          size={[width, (width * 404) / 375]}
        />
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View key="1">
          <AppIcon name="giftGuideTop" size={[width, (width * 440) / 375]} />
          <AppText
            style={{
              ...appStyles.bold16Text,
              color: 'white',
              position: 'absolute',
              top: 291,
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
        {renderStep('1')}
        {renderStep('2')}
        {renderStep('3')}
        <View
          style={{
            backgroundColor: colors.whiteTwo,
            marginTop: 64,
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
              {lineHeight: 40, color: colors.clearBlue, marginTop: 12},
            ]}>
            {i18n.t('gift:tip-3')}
            <AppText
              style={[appStyles.robotoBold38, {color: colors.clearBlue}]}>
              500
              <AppText
                style={[appStyles.semiBold24Text, {color: colors.clearBlue}]}>
                {i18n.t('gift:cash')}
                <AppText
                  style={[appStyles.normal24, {color: colors.clearBlue}]}>
                  {i18n.t('gift:tip-4')}
                </AppText>
              </AppText>
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
              backgroundColor: colors.clearBlue,
              height: 62,
            }}
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
