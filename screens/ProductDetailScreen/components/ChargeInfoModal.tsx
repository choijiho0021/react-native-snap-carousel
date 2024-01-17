import React, {useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {ScrollView} from 'react-native-gesture-handler';
import AppModal from '@/components/AppModal';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppSvgIcon from '@/components/AppSvgIcon';
import TextWithDot from '@/screens/EsimScreen/components/TextWithDot';

const styles = StyleSheet.create({
  conatainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 20,
    paddingTop: 24,
    width: '100%',
    height: '100%',
  },
  header: {
    paddingBottom: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleText: {
    ...appStyles.bold18Text,
    lineHeight: 24,
    color: colors.black,
  },
  headerBodyText: {
    ...appStyles.semiBold16Text,
    lineHeight: 24,
    color: colors.warmGrey,
  },
  infoHeader: {
    paddingTop: 32,
    paddingBottom: 24,
  },
  infoHeaderText: {
    ...appStyles.bold20Text,
    lineHeight: 30,
    color: colors.black,
  },
  mainImg: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  notice: {
    marginRight: 20,
    marginBottom: 24,
  },
  noticeText: {
    ...appStyles.semiBold14Text,
    lineHeight: 22,
    color: colors.warmGrey,
  },
  dot: {
    ...appStyles.semiBold14Text,
    color: colors.warmGrey,
    marginHorizontal: 5,
    marginTop: 2,
  },
  recommendText: {
    ...appStyles.bold16Text,
    lineHeight: 24,
  },
  box: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: colors.backGrey,
    marginBottom: 4,
  },
  boxText: {
    ...appStyles.semiBold14Text,
    lineHeight: 22,
    letterSpacing: -0.28,
    marginRight: 32,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

type ChargeInfoModalProps = {
  visible: boolean;
  onClose: (s: boolean) => void;
};

const ChargeInfoModal: React.FC<ChargeInfoModalProps> = ({
  visible,
  onClose,
}) => {
  const textWithCheck = useCallback(
    (text: string) => (
      <View style={styles.row} key={text}>
        <AppSvgIcon
          style={{marginRight: 8, alignSelf: 'flex-start', marginTop: 3}}
          name="checkedBlueSmall"
        />
        <AppText style={styles.boxText}>{text}</AppText>
      </View>
    ),
    [],
  );

  const renderInfo = useCallback(
    (type: string) => {
      return (
        <View>
          <View style={styles.infoHeader}>
            <AppText style={styles.infoHeaderText}>
              {i18n.t(`prodDetail:charge:modal:${type}:header:title`)}
            </AppText>
          </View>
          <Image
            style={styles.mainImg}
            source={
              type === 'addOn'
                ? require('@/assets/images/esim/addOnModal.png')
                : require('@/assets/images/esim/extensionModal.png')
            }
            resizeMode="stretch"
          />
          <View style={styles.notice}>
            {type === 'addOn'
              ? [1, 2].map((n) => (
                  <TextWithDot
                    key={n}
                    dotStyle={styles.dot}
                    textStyle={styles.noticeText}
                    text={i18n.t(`esim:charge:type:addOn:modal:notice${n}`)}
                  />
                ))
              : [1, 2, 3].map((n) => (
                  <TextWithDot
                    key={n}
                    dotStyle={styles.dot}
                    textStyle={styles.noticeText}
                    text={i18n.t(`esim:charge:type:extension:modal:notice${n}`)}
                  />
                ))}
          </View>
          <View style={[styles.row, {marginBottom: 10}]}>
            <AppSvgIcon style={{marginRight: 4}} name="fire" />
            <AppText style={styles.recommendText}>
              {i18n.t('esim:charge:recommend')}
            </AppText>
          </View>
          <View style={styles.box}>
            {[1, 2].map((n) =>
              textWithCheck(i18n.t(`esim:charge:type:${type}:modal:box${n}`)),
            )}
          </View>
        </View>
      );
    },
    [textWithCheck],
  );

  return (
    <AppModal
      type="close"
      justifyContent="flex-end"
      contentStyle={styles.conatainer}
      onOkClose={() => onClose(false)}
      onCancelClose={() => onClose(false)}
      visible={visible}
      bottom={() => null}
      maxWidth="100%">
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <AppText style={styles.headerTitleText}>
            {i18n.t('prodDetail:charge:modal:header:title')}
          </AppText>
          <AppSvgIcon name="x26" onPress={() => onClose(false)} />
        </View>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <AppText style={styles.headerBodyText}>
            {i18n.t('prodDetail:charge:modal:header:body')}
          </AppText>
          {[{type: 'addOn'}, {type: 'extension'}].map((i) =>
            renderInfo(i.type),
          )}
        </ScrollView>
      </View>
    </AppModal>
  );
};

export default ChargeInfoModal;
