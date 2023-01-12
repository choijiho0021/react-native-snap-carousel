import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, {memo, useCallback, useState, useEffect, useMemo} from 'react';
import {Image, Pressable, View, Dimensions} from 'react-native';
import AppButton from '@/components/AppButton';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import {RkbPromotion} from '@/redux/api/promotionApi';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {API} from '@/redux/api';
import ProgressiveImage from '../../../components/ProgressiveImage';

type NotiModalProps = {
  onOkClose?: () => void;
  onCancelClose?: () => void;
  visible: boolean;
  closeType?: 'redirect' | 'close' | 'exit';
  popUp?: RkbPromotion;
};
const NotiModal: React.FC<NotiModalProps> = ({
  popUp,
  closeType,
  visible,
  onOkClose,
  onCancelClose,
}) => {
  const dimensions = useMemo(() => Dimensions.get('window'), []);
  const [checked, setChecked] = useState(false);
  const [iamgeHight, setImageHeight] = useState(450);
  const setPopupDisabled = useCallback(() => {
    if (checked)
      AsyncStorage.setItem(
        'popupDisabled',
        moment().format('YYYY-MM-DD HH:mm'),
      );
  }, [checked]);

  useEffect(() => {
    if (popUp?.notice?.image?.noti)
      Image.getSize(
        API.default.httpImageUrl(popUp?.notice?.image?.noti),
        (width, height) => {
          setImageHeight(Math.ceil(height * ((dimensions.width - 40) / width)));
        },
      );
  }, [dimensions.width, popUp?.notice?.image?.noti]);

  return (
    <AppModal
      // titleStyle={styles.infoModalTitle}
      // title={popUp?.title}
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
        onOkClose?.();
        setPopupDisabled();
      }}
      onCancelClose={() => {
        onCancelClose?.();
        setPopupDisabled();
      }}
      visible={visible}>
      <View style={{backgroundColor: 'transparent'}}>
        <Pressable
          style={{width: '100%', height: iamgeHight, marginBottom: 18}}
          onPress={() => {
            if (closeType === 'redirect') {
              onOkClose?.();
            }
          }}>
          <ProgressiveImage
            style={{width: '100%', height: iamgeHight}}
            thumbnailSource={{
              uri: API.default.httpImageUrl(popUp?.notice?.image?.thumbnail),
            }}
            source={{uri: API.default.httpImageUrl(popUp?.notice?.image?.noti)}}
            resizeMode="contain"
          />
        </Pressable>

        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 20,
            backgroundColor: 'white',
          }}
          onPress={() => setChecked((prev) => !prev)}>
          <AppButton
            iconName="btnCheck"
            style={{marginRight: 10}}
            checked={checked}
            onPress={() => setChecked((prev) => !prev)}
          />
          <AppText>{i18n.t('close:week')}</AppText>
        </Pressable>
      </View>
    </AppModal>
  );
};

export default memo(NotiModal);
