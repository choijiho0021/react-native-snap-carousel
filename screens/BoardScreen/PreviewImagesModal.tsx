import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {Image as CropImage} from 'react-native-image-crop-picker';
import {useDispatch} from 'react-redux';
import {API} from '@/redux/api';
import AppSvgIcon from '@/components/AppSvgIcon';
import {colors} from '@/constants/Colors';
import {
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
    top: (windowHeight - ((sliderWidth - 40) / 9) * 16) / 2 - 29,
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: 20,
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

  useEffect(() => {
    if (imgUrl)
      Image.getSize(API.default.httpImageUrl(imgUrl).toString(), (w, h) => {
        setHeight(h * ((windowWidth * 0.8) / w));
      });
  }, [attachment, imgUrl]);

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={styles.imgModalFrame}>
      <View style={styles.closeBtn}>
        <AppSvgIcon
          name="xWhite26"
          onPress={() => dispatch(modalActions.closeModal())}
        />
      </View>
      <View style={styles.modalImg}>
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
