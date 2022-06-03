/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {useCallback, useEffect} from 'react';
import {StyleSheet, Image, Modal, Pressable, SafeAreaView} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import {sliderWidth} from '@/constants/SliderEntry.style';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    alignSelf: 'stretch',
  },
});
type CarouselIndex =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'step6'
  | 'step7'
  | 'step8'
  | 'step9'
  | 'step10'
  | 'step11';

const guideImages = {
  step1: require('../assets/images/esim/userGuide/eSIMUserGuide1.png'),
  step2: require('../assets/images/esim/userGuide/eSIMUserGuide2.png'),
  step3: require('../assets/images/esim/userGuide/eSIMUserGuide3.png'),
  step4: require('../assets/images/esim/userGuide/eSIMUserGuide4.png'),
  step5: require('../assets/images/esim/userGuide/eSIMUserGuide5.png'),
  step6: require('../assets/images/esim/userGuide/eSIMUserGuide6.png'),
  step7: require('../assets/images/esim/userGuide/eSIMUserGuide7.png'),
  step8: require('../assets/images/esim/userGuide/eSIMUserGuide8.png'),
  step9: require('../assets/images/esim/userGuide/eSIMUserGuide9.png'),
  step10: require('../assets/images/esim/userGuide/eSIMUserGuide10.png'),
  step11: require('../assets/images/esim/userGuide/eSIMUserGuide11.png'),
};

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
  // const [email, setEmail] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerShown: false,
      // headerRight: () => <AppBackButton title={i18n.t('board:title')} />,
    });
  }, [navigation]);

  const renderGuide = useCallback(
    ({item}: {item: CarouselIndex}) => (
      <Image
        style={styles.image}
        source={guideImages[item]}
        resizeMode="stretch"
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Carousel
        data={Object.keys(guideImages)}
        renderItem={renderGuide}
        // onSnapToItem={(index) => this.setState({activeSlide: index})}
        autoplay={false}
        useScrollView
        lockScrollWhileSnapping
        sliderWidth={sliderWidth}
        itemWidth={sliderWidth}
      />
      {/* close 영역만 지정 */}
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          width: 60,
          height: 60,
          top: 50,
          right: 0,
        }}
      />
    </SafeAreaView>
  );
};

export default UserGuideScreen;
