import React, {memo, useCallback, useEffect, useState} from 'react';
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import AppModal from '@/components/AppModal';
import AppIcon from '@/components/AppIcon';
import AppButton from '@/components/AppButton';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';
import AppSvgIcon from '@/components/AppSvgIcon';
import {navigate} from '@/navigation/navigation';
import {MAX_WIDTH} from '@/constants/SliderEntry.style';

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
  const route = useRoute();
  const [iconWidth, setIconWidth] = useState(
    Math.min(MAX_WIDTH, Dimensions.get('window').width),
  );
  const renderBottom = useCallback(
    () => (
      <View style={styles.bottom}>
        <AppButton
          title={i18n.t('close:week')}
          style={styles.btn}
          titleStyle={{
            ...appStyles.medium14,
            color: colors.warmGrey,
            alignSelf: 'flex-start',
            marginLeft: 20,
          }}
          onPress={() => {
            AsyncStorage.setItem(
              'gift.show.modal',
              moment().format('YYYY-MM-DD HH:mm:ss'),
            );
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

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setIconWidth(Math.min(MAX_WIDTH, window.width));
    });
    return () => subscription?.remove();
  }, []);

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
        <AppIcon
          name="giftModalBg"
          size={[iconWidth, (iconWidth * 258) / 375]}
        />
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
            top: 120,
            left: 20,
            color: 'white',
          }}>
          {i18n.t('gift:modal2')}
        </AppText>
        <Pressable
          style={styles.btn2}
          onPress={() => {
            onOkClose?.();
            navigate(navigation, route, 'EsimStack', {
              tab: 'HomeStack',
              screen: 'GiftGuide',
            });
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
