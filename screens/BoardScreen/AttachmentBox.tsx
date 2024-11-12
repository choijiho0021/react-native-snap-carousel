import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, Platform, Pressable, StyleSheet, View} from 'react-native';
import {PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import ImagePicker, {Image as CropImage} from 'react-native-image-crop-picker';
import _ from 'underscore';
import {List} from 'immutable';
import {useDispatch} from 'react-redux';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';
import {attachmentSize} from '@/constants/SliderEntry.style';
import utils from '@/redux/api/utils';
import {RkbEvent} from '@/redux/api/promotionApi';
import {EventParamImagesType} from '../EventBoardScreen/ApplyEvent';
import AppIcon from '@/components/AppIcon';
import ImgWithIndicator from './ImgWithIndicator';
import {API} from '@/redux/api';
import {actions as modalActions} from '@/redux/modules/modal';
import PreviewImageModal from './PreviewImagesModal';
import {checkPhotoPermissionAlert} from '@/utils/utils';

const styles = StyleSheet.create({
  container: {
    marginBottom: 56,
  },
  attachTitle: {
    marginTop: 32,
    marginBottom: 8,
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attachTitleText: {
    ...appStyles.semiBold14Text,
    lineHeight: 20,
  },
  attachImageNotiText: {
    ...appStyles.bold12Text,
    color: colors.warmGrey,
    lineHeight: 20,
  },
  essentialText: {
    ...appStyles.bold12Text,
    color: colors.redError,
    lineHeight: 20,
    marginLeft: 3,
  },
  attachBox: {
    marginHorizontal: 20,
    flexDirection: 'row',
  },
  attach: {
    overflow: 'hidden',
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  attachCancel: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  imgSize: {
    borderRadius: 2,
  },
  plusButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type AttachmentBoxProps = {
  selectedEvent?: RkbEvent;
  paramImages?: EventParamImagesType[];
  setParamImages?: (v: EventParamImagesType[]) => void;
  attachment: List<CropImage>;
  setAttachment: (v: List<CropImage>) => void;
  imageQuality?: number;
  onPress?: () => void;
  type: 'board' | 'event';
};

const AttachmentBox: React.FC<AttachmentBoxProps> = ({
  selectedEvent,
  paramImages,
  setParamImages,
  attachment,
  setAttachment,
  imageQuality,
  onPress,
  type = 'event',
}) => {
  const [hasPhotoPermission, setHasPhotoPermission] = useState(false);
  const dispatch = useDispatch();

  const maxImageCnt = useMemo(() => {
    return type === 'board' ? 5 : 3;
  }, [type]);

  useEffect(() => {
    const checkPermission = async () => {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
      const result = await check(permission);
      setHasPhotoPermission(result === RESULTS.GRANTED);
    };

    checkPermission();
  }, []);

  const addAttachment = useCallback(async () => {
    let checkNewPermission = false;

    if (onPress) onPress();

    if (!hasPhotoPermission) {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
      const result = await check(permission);

      checkNewPermission = result === RESULTS.GRANTED;
    }

    if (hasPhotoPermission || checkNewPermission) {
      if (ImagePicker) {
        try {
          const image = await ImagePicker.openPicker({
            includeBase64: true,
            writeTempFile: false,
            mediaType: 'photo',
            forceJpb: true,
            compressImageQuality: imageQuality || 0.1,
          });

          setAttachment((a) => a.push(image));
        } catch (err) {
          console.log('failed to select', err);
        }
      }
    } else {
      // 사진 앨범 조회 권한을 요청한다.
      checkPhotoPermissionAlert();
    }
  }, [hasPhotoPermission, imageQuality, onPress, setAttachment]);

  const renderModal = useCallback(
    ({imgUrl, att}: {imgUrl?: string; att?: CropImage}) => {
      dispatch(
        modalActions.renderModal(() => (
          <PreviewImageModal imgUrl={imgUrl} attachment={att} />
        )),
      );
    },
    [dispatch],
  );

  return (
    <View style={styles.container}>
      <View style={styles.attachTitle}>
        <AppText style={styles.attachTitleText}>
          {i18n.t('board:attach')}
        </AppText>
        {type === 'board' && (
          <AppText style={styles.attachImageNotiText}>
            {i18n.t('board:attach:maxImageNoti')}
          </AppText>
        )}
        {selectedEvent?.rule?.image && (
          <AppText style={styles.essentialText}>
            {i18n.t('event:essential')}
          </AppText>
        )}
      </View>
      <View style={styles.attachBox}>
        {paramImages &&
          paramImages.length > 0 &&
          paramImages
            .filter((item) => !_.isEmpty(item))
            .map((image, i) => (
              <Pressable
                style={[
                  styles.attach,
                  {
                    width: attachmentSize(maxImageCnt),
                    height: attachmentSize(maxImageCnt),
                  },
                  i < maxImageCnt - 1 ? {marginRight: 11.5} : undefined,
                ]}
                key={utils.generateKey(`${image.url}${i}`)}
                onPress={() => renderModal({imgUrl: image.url})}>
                <Pressable
                  style={styles.attachCancel}
                  onPress={() => {
                    if (setParamImages)
                      setParamImages(
                        paramImages.filter((p) => p.url !== image.url),
                      );
                  }}>
                  <AppIcon name="btnBoxCancel" />
                </Pressable>
                <ImgWithIndicator
                  maxImageCnt={maxImageCnt}
                  uri={API.default.httpImageUrl(image.url).toString()}
                />
              </Pressable>
            ))}
        {attachment.map((image, idx) => (
          <Pressable
            key={image.filename}
            style={[
              styles.attach,
              {
                width: attachmentSize(maxImageCnt) - 2,
                height: attachmentSize(maxImageCnt),
              },
              idx < maxImageCnt - 1 ? {marginRight: 11.5} : undefined,
            ]}
            onPress={() => renderModal({att: image})}>
            <Image
              style={[
                styles.imgSize,
                {
                  width: attachmentSize(maxImageCnt) - 2,
                  height: attachmentSize(maxImageCnt),
                },
              ]}
              source={{uri: `data:${image.mime};base64,${image.data}`}}
            />
            <Pressable
              style={styles.attachCancel}
              onPress={() => setAttachment((a) => a.delete(idx))}>
              <AppIcon name="btnBoxCancel" />
            </Pressable>
          </Pressable>
        ))}
        {(paramImages ? paramImages.length : 0) + attachment.size <
          maxImageCnt && (
          <Pressable
            key="add"
            style={[
              styles.attach,
              {
                width: attachmentSize(maxImageCnt),
                height: attachmentSize(maxImageCnt),
              },
              styles.plusButton,
            ]}
            onPress={addAttachment}>
            <AppIcon name="btnPhotoPlus" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default AttachmentBox;
