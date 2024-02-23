import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React, {memo, useEffect, useMemo, useState} from 'react';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppSvgIcon from '@/components/AppSvgIcon';
import {colors} from '@/constants/Colors';
import {
  isFolderOpen,
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
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: 20,
    zIndex: 100,
  },
  arrowLeft: {
    position: 'absolute',
    alignItems: 'flex-start',
    left: 25,
    zIndex: 1,
    justifyContent: 'center',
  },
  arrowRight: {
    position: 'absolute',
    alignItems: 'flex-end',
    right: 25,
    zIndex: 1,
    justifyContent: 'center',
  },
  modalImg: {
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
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const isFolder = isFolderOpen(dimensions.width);

  const width = useMemo(() => (isFolder ? 400 : sliderWidth), [isFolder]);

  useEffect(() => {
    if (defaultImgIndex !== undefined) {
      setLoading(true);
      setImgIndex(defaultImgIndex);
    }
  }, [defaultImgIndex]);

  return (
    <Modal visible={visible} transparent>
      <SafeAreaView style={styles.imgModalFrame}>
        <View
          style={[
            styles.closeBtn,
            {
              top: (windowHeight - ((width - 40) / 9) * 16) / 2 - 29,
            },
          ]}>
          <AppSvgIcon name="xWhite26" onPress={onPress} />
        </View>
        <View
          style={[
            styles.modalImg,
            {
              width: width - 40,
              height: ((width - 40) / 9) * 16,
            },
          ]}>
          {images?.[imgIndex] ? (
            <Image
              style={styles.imageFile}
              source={{
                uri: API.default.httpImageUrl(images?.[imgIndex]).toString(),
              }}
              onLoadEnd={() => setLoading(false)}
            />
          ) : null}
        </View>
        {images && images.length > 1 && imgIndex > 0 && (
          <Pressable
            style={[
              styles.arrowLeft,
              {
                width: (width - 40) / 2,
                height: ((width - 40) / 9) * 16,
              },
            ]}
            onPress={() => {
              setLoading(true);
              setImgIndex((prev) => prev - 1);
            }}>
            <AppSvgIcon name="arrowLeftWhite" />
          </Pressable>
        )}

        {images && images.length > 1 && imgIndex < images.length - 1 && (
          <Pressable
            style={[
              styles.arrowRight,
              {
                width: (width - 40) / 2,
                height: ((width - 40) / 9) * 16,
              },
            ]}
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
