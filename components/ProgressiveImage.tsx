import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ImageStyle,
  ImageProps,
  ImageURISource,
} from 'react-native';

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    backgroundColor: '#e1e4e8',
  },
});

const ProgressiveImage = ({
  thumbnailSource,
  source,
  style,
  props,
}: {
  thumbnailSource: ImageURISource;
  source: ImageURISource;
  style?: ImageStyle;
  props?: ImageProps;
}) => {
  const [isRender, setIsRender] = useState(false);
  const thumbnailAnimated = useRef(new Animated.Value(0)).current;
  const imageAnimated = useRef(new Animated.Value(0)).current;

  const handleThumbnailLoad = useCallback(() => {
    Animated.timing(thumbnailAnimated, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setIsRender(true);
  }, [thumbnailAnimated]);

  const onImageLoad = useCallback(() => {
    Animated.timing(imageAnimated, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [imageAnimated]);

  useEffect(() => {
    if (!thumbnailSource.uri) setIsRender(true);
  }, [thumbnailSource.uri]);

  return (
    <View style={styles.container}>
      <Animated.Image
        {...props}
        source={thumbnailSource}
        style={[style, {opacity: thumbnailAnimated}]}
        onLoad={handleThumbnailLoad}
        blurRadius={1}
      />
      {isRender && (
        <Animated.Image
          {...props}
          source={source}
          style={[styles.imageOverlay, {opacity: imageAnimated}, style]}
          onLoad={onImageLoad}
        />
      )}
    </View>
  );
};

export default ProgressiveImage;
