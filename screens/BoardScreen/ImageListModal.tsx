import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppSvgIcon from '@/components/AppSvgIcon';
import {colors} from '@/constants/Colors';
import {
  sliderWidth,
  windowHeight,
  windowWidth,
} from '@/constants/SliderEntry.style';
import {API} from '@/redux/api';

const styles = StyleSheet.create({
  imgModalFrame: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: (windowHeight - ((sliderWidth - 40) / 9) * 16) / 2 - 29,
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  arrowLeft: {
    position: 'absolute',
    width: (sliderWidth - 40) / 2,
    height: ((sliderWidth - 40) / 9) * 16,
    alignItems: 'flex-start',
    left: 25,
    zIndex: 1,
    justifyContent: 'center',
  },
  arrowRight: {
    position: 'absolute',
    width: (sliderWidth - 40) / 2,
    height: ((sliderWidth - 40) / 9) * 16,
    alignItems: 'flex-end',
    right: 25,
    zIndex: 1,
    justifyContent: 'center',
  },
  modalImg: {
    width: sliderWidth - 40,
    height: ((sliderWidth - 40) / 9) * 16,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFile: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

const ImageListModal = ({
  visible,
  onPress,
  images,
  defaultImgIndex,
}: {
  visible: boolean;
  images?: string[];
  defaultImgIndex?: number;
  onPress: () => void;
}) => {
  const [imgIndex, setImgIndex] = useState(defaultImgIndex || 0);
  const [loading, setLoading] = useState(true);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (defaultImgIndex !== undefined) {
      setLoading(true);
      setImgIndex(defaultImgIndex);
    }
  }, [defaultImgIndex]);

  useEffect(() => {
    if (images) {
      const url = images[imgIndex];
      if (url) {
        Image.getSize(API.default.httpImageUrl(url).toString(), (w, h) => {
          setHeight(h * ((windowWidth * 0.8) / w));
        });
      }
    }
  }, [images, imgIndex]);

  return (
    <Modal visible={visible} transparent>
      <SafeAreaView style={styles.imgModalFrame}>
        <View style={styles.closeBtn}>
          <AppSvgIcon name="xWhite26" onPress={onPress} />
        </View>
        <View style={styles.modalImg}>
          {images?.[imgIndex] ? (
            <Image
              style={styles.imageFile}
              source={{
                uri: API.default.httpImageUrl(images?.[imgIndex]).toString(),
                height,
              }}
              onLoadEnd={() => setLoading(false)}
            />
          ) : null}
        </View>
        {images && images.length > 1 && imgIndex > 0 && (
          <Pressable
            style={styles.arrowLeft}
            onPress={() => {
              setLoading(true);
              setImgIndex((prev) => prev - 1);
            }}>
            <AppSvgIcon name="arrowLeftWhite" />
          </Pressable>
        )}

        {images && images.length > 1 && imgIndex < images.length - 1 && (
          <Pressable
            style={styles.arrowRight}
            onPress={() => {
              setLoading(true);
              setImgIndex((prev) => prev + 1);
            }}>
            <AppSvgIcon name="arrowRightWhite" />
          </Pressable>
        )}

        <AppActivityIndicator visible={loading} />
      </SafeAreaView>
    </Modal>
  );
};

export default memo(ImageListModal);
