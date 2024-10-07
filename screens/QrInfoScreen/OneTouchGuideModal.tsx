import React, {memo, useCallback} from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Modal,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';
import AppIcon from '@/components/AppIcon';
import AppStyledText from '@/components/AppStyledText';
import i18n from '@/utils/i18n';
import {windowWidth} from '@/constants/SliderEntry.style';

const styles = StyleSheet.create({
  title: {
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headMarker: {
    width: 20,
    height: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type OneTouchGuideModalProps = {
  visible: boolean;
  onOkClose: () => void;
};

const OneTouchGuideModal: React.FC<OneTouchGuideModalProps> = ({
  visible,
  onOkClose,
}) => {
  const renderMarker = useCallback(
    (head: string, title: string, info: string, backgroundColor: string) => (
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
        <View style={{...styles.headMarker, backgroundColor, marginRight: 8}}>
          <AppText style={{color: colors.white}}>{head}</AppText>
        </View>
        <View>
          <AppText style={{...appStyles.bold16Text, lineHeight: 24}}>
            {title}
          </AppText>
          <AppText
            style={{
              ...appStyles.normal16Text,
              fontWeight: undefined,
              lineHeight: 24,
              color: colors.warmGrey,
            }}>
            {info}
          </AppText>
        </View>
      </View>
    ),
    [],
  );

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <SafeAreaView style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <Pressable style={{height: 56}} onPress={() => onOkClose()} />
        <View
          style={{
            backgroundColor: colors.white,
            flex: 1,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
          <View style={styles.title}>
            <AppText style={appStyles.bold20Text}>
              {i18n.t('esim:oneTouch:guide')}
            </AppText>
            <Pressable onPress={() => onOkClose()}>
              <AppIcon name="boldCancelBlack" />
            </Pressable>
          </View>
          <ScrollView style={{paddingHorizontal: 20}}>
            <AppStyledText
              text={i18n.t('esim:oneTouch:guide:info1')}
              textStyle={{...appStyles.normal16Text, lineHeight: 24}}
              format={{
                b: {
                  ...appStyles.bold16Text,
                  lineHeight: 24,
                  color: colors.clearBlue,
                },
              }}
            />

            <View style={{marginVertical: 12}}>
              <AppStyledText
                text={i18n.t('esim:oneTouch:guide:info2')}
                textStyle={{
                  ...appStyles.medium14,
                  lineHeight: 22,
                  color: colors.warmGrey,
                }}
                format={{
                  b: {
                    ...appStyles.bold14Text,
                    lineHeight: 22,
                  },
                }}
              />
            </View>

            <View style={{width: '100%'}}>
              <Image
                source={require('@/assets/images/esim/oneTouchGuide.jpg')}
                style={{width: windowWidth - 40, height: windowWidth - 40}}
                resizeMode="cover"
              />
            </View>

            {renderMarker(
              'A',
              i18n.t('esim:oneTouch:guide:marker1:title'),
              i18n.t('esim:oneTouch:guide:marker1:txt'),
              colors.clearBlue,
            )}
            {renderMarker(
              'B',
              i18n.t('esim:oneTouch:guide:marker2:title'),
              i18n.t('esim:oneTouch:guide:marker2:txt'),
              colors.shamrock,
            )}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 12,
                marginBottom: 16,
                alignItems: 'center',
              }}>
              <AppIcon name="question26" style={{marginRight: 8}} />
              <AppText style={appStyles.bold14Text}>
                {i18n.t('esim:oneTouch:guide:question:txt')}
              </AppText>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      <SafeAreaView style={{backgroundColor: colors.white}} />
    </Modal>
  );
};

export default memo(OneTouchGuideModal);
