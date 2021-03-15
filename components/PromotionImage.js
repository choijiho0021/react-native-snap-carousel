import React, {PureComponent} from 'react';
import {StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {API} from '../submodules/rokebi-utils';
import {windowHeight} from '../constants/SliderEntry.style';

const size =
  windowHeight > 810
    ? {
        userInfoHeight: 110,
        userInfoMarginTop: 30,
        userPic: 60,
        carouselHeight: 225,
        carouselMargin: 0,
      }
    : {
        userInfoHeight: 96,
        userInfoMarginTop: 20,
        userPic: 50,
        carouselHeight: 190,
        carouselMargin: 20,
      };

const styles = StyleSheet.create({
  overlay: {
    marginLeft: size.carouselMargin,
  },
});

export default class PromotionImage extends PureComponent {
  render() {
    const {item} = this.props;
    return (
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => this.props.onPress(item)}>
        {_.isEmpty(item.imageUrl) ? (
          <Text style={styles.text}>{item.title}</Text>
        ) : (
          <Image
            source={{uri: API.default.httpImageUrl(item.imageUrl)}}
            style={{height: size.carouselHeight}}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    );
  }
}
