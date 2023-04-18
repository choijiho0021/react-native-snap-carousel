import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React, {memo, useState} from 'react';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppSvgIcon from '@/components/AppSvgIcon';
import {colors} from '@/constants/Colors';
import {sliderWidth, windowHeight} from '@/constants/SliderEntry.style';
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
  height,
}: {
  visible: boolean;
  height: number;
  images?: string[];
  defaultImgIndex?: number;
  onPress: () => void;
}) => {
  const [imgUrl, setImgUrl] = useState('');
  const [imgIndex, setImgIndex] = useState(defaultImgIndex || 0);
  const [loading, setLoading] = useState(false);

  return (
    <Modal visible={visible} transparent>
      <SafeAreaView style={styles.imgModalFrame}>
        <View style={styles.closeBtn}>
          <AppSvgIcon name="xWhite26" onPress={onPress} />
        </View>
        <View style={styles.modalImg}>
          <Image
            style={styles.imageFile}
            source={{
              uri: API.default.httpImageUrl(imgUrl).toString(),
              height,
            }}
            onLoadEnd={() => setLoading(false)}
          />
        </View>
        {images && images.length > 1 && (
          <Pressable
            style={styles.arrowLeft}
            onPress={() => {
              if (imgIndex > -1) {
                setLoading(true);
                setImgUrl(images[imgIndex - 1]);
                setImgIndex(imgIndex - 1);
              }
            }}>
            <AppSvgIcon name="arrowLeftWhite" />
          </Pressable>
        )}

        {images && images.length > 1 && (
          <Pressable
            style={styles.arrowRight}
            onPress={() => {
              if (imgIndex < images.length - 1) {
                setLoading(true);
                setImgUrl(images[imgIndex + 1]);
                setImgIndex(imgIndex + 1);
              }
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
