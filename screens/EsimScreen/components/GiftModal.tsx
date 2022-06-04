import React, {memo, useCallback} from 'react';
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import AppModal from '@/components/AppModal';
import AppIcon from '@/components/AppIcon';
import AppButton from '@/components/AppButton';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';
import AppSvgIcon from '@/components/AppSvgIcon';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  bottom: {
    height: 62,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    height: 62,
    flex: 1,
  },
  btnTitle: {
    color: colors.warmGrey,
  },
  btn2: {
    position: 'absolute',
    width: 112,
    height: 40,
    borderRadius: 20,
    top: 168,
    left: 20,
    backgroundColor: '#00245a',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
type GiftModalProps = {
  visible: boolean;
  onOkClose?: () => void;
};
const GiftModal: React.FC<GiftModalProps> = ({visible, onOkClose}) => {
  const navigation = useNavigation();
  const renderBottom = useCallback(
    () => (
      <View style={styles.bottom}>
        <AppButton
          title={i18n.t('closeForever')}
          style={styles.btn}
          titleStyle={{
            ...appStyles.medium14,
            color: colors.warmGrey,
            alignSelf: 'flex-start',
            marginLeft: 20,
          }}
          onPress={() => {
            AsyncStorage.setItem('gift.show.modal', 'false');
            onOkClose?.();
          }}
        />
        <AppButton
          title={i18n.t('close')}
          style={styles.btn}
          titleStyle={{
            ...appStyles.medium14,
            color: colors.black,
            alignSelf: 'flex-end',
            marginRight: 20,
          }}
          onPress={onOkClose}
        />
      </View>
    ),
    [onOkClose],
  );

  return (
    <AppModal
      justifyContent="flex-end"
      contentStyle={{
        marginHorizontal: 0,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}
      bottom={renderBottom}
      visible={visible}>
      <View>
        <AppIcon name="giftModalBg" size={[width, (width * 258) / 375]} />
        <AppText
          key="1"
          style={{
            ...appStyles.bold24Text,
            position: 'absolute',
            top: 40,
            left: 20,
            color: 'white',
          }}>
          {i18n.t('gift:modal1')}
        </AppText>
        <AppText
          key="2"
          style={{
            ...appStyles.normal14Text,
            position: 'absolute',
            top: 108,
            left: 20,
            color: 'white',
          }}>
          {i18n.t('gift:modal2')}
        </AppText>
        <Pressable
          style={styles.btn2}
          onPress={() => {
            onOkClose?.();
            navigation.navigate('GiftGuide');
          }}>
          <AppText style={{...appStyles.medium14, color: 'white'}}>
            {i18n.t('gift:modalBtn')}
          </AppText>
          <AppSvgIcon name="arrowRight" style={{marginLeft: 4}} />
        </Pressable>
      </View>
    </AppModal>
  );
};

export default memo(GiftModal);
