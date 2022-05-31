/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Dimensions, Image, Modal} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import i18n from '@/utils/i18n';
import AppBackButton from '@/components/AppBackButton';
import BoardMsgAdd from '@/components/BoardMsgAdd';
import BoardMsgList from '@/components/BoardMsgList';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {Utils} from '@/redux/api';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {sliderWidth} from '@/constants/SliderEntry.style';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  image: {
    width: '100%',
    // maxWidth: width,
    // maxHeight: height,
    height: '100%',
    alignSelf: 'stretch',
  },
});
type CarouselIndex = 'step1' | 'step2' | 'step3' | 'step4';

const guideImages = {
  step1: require('../assets/images/usim/tutorial/step1/mT1.png'),
  step2: require('../assets/images/usim/tutorial/step2/mT2.png'),
  step3: require('../assets/images/usim/tutorial/step3/mT3.png'),
  step4: require('../assets/images/usim/tutorial/step4/mT4.png'),
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
      headerRight: () => <AppBackButton title={i18n.t('board:title')} />,
    });
  }, [navigation]);

  const renderGuide = useCallback(
    ({item}: {item: CarouselIndex}) => (
      <Image
        style={styles.image}
        source={guideImages[item]}
        resizeMode="cover"
      />
    ),
    [],
  );

  return (
    <Modal style={styles.container}>
      <Image
        style={styles.image}
        source={guideImages.step1}
        resizeMode="cover"
      />
      {/* <Carousel
        // ref={this.carousel}
        data={guideImages}
        renderItem={renderGuide}
        // onSnapToItem={(index) => this.setState({activeSlide: index})}
        autoplay={false}
        // loop
        useScrollView
        lockScrollWhileSnapping
        // resizeMode='stretch'
        // overflow='hidden'
        sliderWidth={sliderWidth}
        itemWidth={sliderWidth}
        // itemHeight={sliderHeight*0.5}
      /> */}
    </Modal>
  );
};

export default UserGuideScreen;
