import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, {memo, useCallback, useState, useMemo, useEffect} from 'react';
import {Image, Pressable, View, StyleSheet, Dimensions} from 'react-native';
import AppButton from '@/components/AppButton';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import {RkbPromotion} from '@/redux/api/promotionApi';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {API} from '@/redux/api';
import ProgressiveImage from '@/components/ProgressiveImage';
import AppCarousel from '@/components/AppCarousel';
import {isFolderOpen} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    height: 22,
    width: 54,
    borderRadius: 100,
    backgroundColor: 'rgba(44, 44, 44, 0.64)',
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  paginationText: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.white,
    width: 9,
  },
  divider: {
    height: 12,
    marginHorizontal: 4,
    width: 1.4,
    backgroundColor: colors.white,
  },
});

type NotiModalProps = {
  onOkClose?: (v: string, item: RkbPromotion) => void;
  onCancelClose?: () => void;
  visible: boolean;
  // closeType?: 'redirect' | 'close' | 'exit';
  // popUp?: RkbPromotion;
  popUpList: RkbPromotion[];
};
const NotiModal: React.FC<NotiModalProps> = ({
  popUpList,
  // popUp,
  // closeType,
  visible,
  onOkClose,
  onCancelClose,
}) => {
  const [checked, setChecked] = useState(false);
  const [closeType, setCloseType] = useState<'close' | 'exit' | 'redirect'>(
    'redirect',
  );
  const [imageHeight, setImageHeight] = useState(450);
  const [activeSlide, setActiveSlide] = useState(-1);

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const folderOpened = useMemo(
    () => isFolderOpen(dimensions.width),
    [dimensions.width],
  );

  // 펼치고 접었을 때  modalImageSize 다시 계산하도록 변경
  // TODO : 폴더블일 때 적절한 width 계산식 필요, modalImage가 modalHeight의 0.75 일 때 화면이 적절히 배치됨
  const modalImageSize = useMemo(
    () => (folderOpened ? 420 : dimensions.width - 40),
    [dimensions.width, folderOpened],
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const setPopupDisabled = useCallback(() => {
    if (checked)
      AsyncStorage.setItem(
        'popupDisabled',
        moment().format('YYYY-MM-DD HH:mm'),
      );
  }, [checked]);

  const renderItem = useCallback(
    ({item}: {item: RkbPromotion}) => {
      setCloseType(item.rule ? 'redirect' : 'close');

      const uri = API.default.httpImageUrl(item?.notice?.image?.noti);
      const thumbnail = API.default.httpImageUrl(
        item?.notice?.image?.thumbnail,
      );
      return (
        <View style={{backgroundColor: 'transparent'}}>
          <Pressable
            style={{
              width: modalImageSize,
              height: imageHeight,
              marginBottom: 18,
            }}
            onPress={() => {
              if (closeType === 'redirect') {
                onOkClose?.(closeType, item);
              }
            }}>
            <ProgressiveImage
              style={{width: '100%', height: imageHeight}}
              thumbnailSource={{uri: thumbnail}}
              source={{uri}}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      );
    },
    [closeType, imageHeight, modalImageSize, onOkClose],
  );

  useEffect(() => {
    if (activeSlide < 0) setActiveSlide(popUpList.length - 1);
  }, [activeSlide, popUpList.length]);

  useEffect(() => {
    if (popUpList[0]?.notice?.image?.noti)
      Image.getSize(
        API.default.httpImageUrl(popUpList[0]?.notice?.image?.noti),
        (width, height) => {
          setImageHeight(Math.ceil(height * (modalImageSize / width)));
        },
      );
  }, [modalImageSize, popUpList, dimensions]);

  return (
    <AppModal
      contentStyle={{
        paddingTop: 0,
        marginTop: 0,
        marginHorizontal: 20,
        backgroundColor: colors.white,
        width: '100%',
      }}
      titleViewStyle={{marginTop: 20}}
      okButtonTitle={i18n.t(closeType || 'close')}
      type={closeType === 'redirect' ? closeType : 'close'}
      onOkClose={() => {
        onOkClose?.(closeType, popUpList[activeSlide]);
        setPopupDisabled();
      }}
      onCancelClose={() => {
        onCancelClose?.();
        setPopupDisabled();
      }}
      visible={visible}>
      <AppCarousel
        data={popUpList}
        renderItem={renderItem}
        autoplay={popUpList.length > 1}
        loop={popUpList.length > 1}
        onSnapToItem={setActiveSlide}
        sliderWidth={modalImageSize}
      />
      {popUpList.length > 1 && (
        <View style={[styles.pagination, {top: imageHeight - (22 + 16)}]}>
          <AppText style={styles.paginationText}>{activeSlide + 1}</AppText>
          <View style={styles.divider} />
          <AppText style={[styles.paginationText, {opacity: 0.8}]}>
            {popUpList.length}
          </AppText>
        </View>
      )}

      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 20,
          backgroundColor: 'white',
          height: 24,
        }}
        onPress={() => setChecked((prev) => !prev)}>
        <AppButton
          iconName="btnCheck"
          style={{marginRight: 10}}
          checked={checked}
          onPress={() => setChecked((prev) => !prev)}
        />
        <AppText style={{color: colors.black}}>{i18n.t('close:week')}</AppText>
      </Pressable>
    </AppModal>
  );
};

export default memo(NotiModal);
