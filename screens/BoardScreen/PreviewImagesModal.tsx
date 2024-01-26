import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions, Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {Image as CropImage} from 'react-native-image-crop-picker';
import {useDispatch} from 'react-redux';
import {API} from '@/redux/api';
import AppSvgIcon from '@/components/AppSvgIcon';
import {colors} from '@/constants/Colors';
import {
  isFolderOpen,
  sliderWidth,
  windowHeight,
  windowWidth,
} from '@/constants/SliderEntry.style';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import {actions as modalActions} from '@/redux/modules/modal';

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

type PreviewImageModalModalProps = {
  imgUrl?: string;
  attachment?: CropImage;
};

const PreviewImageModal: React.FC<PreviewImageModalModalProps> = ({
  imgUrl,
  attachment,
}) => {
  const [height, setHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
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
    console.log('@@@@ PreviewImageModal');

    console.log('imgUrl : ', imgUrl);
    if (imgUrl)
      Image.getSize(API.default.httpImageUrl(imgUrl).toString(), (w, h) => {
        console.log('@@@@ w : ', w);

        setHeight(h * ((windowWidth * 0.8) / (isFolder ? 420 : w)));
      });
    else
      Image.getSize(
        `data:${attachment?.mime};base64,${attachment?.data}`,
        (w, h) => {
          setHeight(h * ((windowWidth * 0.8) / (isFolder ? 420 : w)));
        },
      );
  }, [attachment, imgUrl, isFolder]);

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={styles.imgModalFrame}>
      <View
        style={[
          styles.closeBtn,
          {
            top: (windowHeight - ((width - 40) / 9) * 16) / 2 - 29,
          },
        ]}>
        <AppSvgIcon
          name="xWhite26"
          onPress={() => dispatch(modalActions.closeModal())}
        />
      </View>
      <View
        style={[
          styles.modalImg,
          {
            width: width - 40,
            height: ((width - 40) / 9) * 16,
          },
        ]}>
        {imgUrl ? (
          <Image
            style={styles.imageFile}
            source={{
              uri: API.default.httpImageUrl(imgUrl).toString(),
              height,
            }}
            onLoadEnd={() => setLoading(false)}
          />
        ) : (
          <Image
            style={styles.imageFile}
            source={{
              uri: `data:${attachment?.mime};base64,${attachment?.data}`,
            }}
            onLoadEnd={() => setLoading(false)}
          />
        )}
      </View>
      <AppActivityIndicator visible={loading} />
    </SafeAreaView>
  );
};

export default PreviewImageModal;
