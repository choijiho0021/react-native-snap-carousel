import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback} from 'react';
import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {actions as modalActions} from '@/redux/modules/modal';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import AppStyledText from '@/components/AppStyledText';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppButton from '@/components/AppButton';
import {GuideOption} from './GuideHomeScreen';

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  okBtnContainer: {
    backgroundColor: colors.white,
    marginBottom: 16,
    marginTop: 12,
  },
  okButton: {
    ...appStyles.medium18,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },
  modalTitleText: {
    ...appStyles.bold24Text,
    lineHeight: 32,
    color: colors.black,
    marginBottom: 32,
  },
  modalBodyText: {
    ...appStyles.bold18Text,
    lineHeight: 24,
    letterSpacing: -0.36,
    color: colors.black,
    textAlign: 'left',
  },
  noticeBox: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 3,
  },
  noticeTitle: {
    marginLeft: 4,
    ...appStyles.bold16Text,
    lineHeight: 24,
    color: colors.black,
  },
  noticeBody: {
    ...appStyles.medium16,
    lineHeight: 24,
    color: colors.black,
  },
  listBox: {
    marginTop: 12,
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: colors.backGrey,
    borderRadius: 3,
  },
  noticeTextContainer: {
    flexDirection: 'row',
  },
  dot: {
    ...appStyles.bold18Text,
    lineHeight: 22,
    color: colors.black,
    marginHorizontal: 8,
  },
  noticeText: {
    ...appStyles.medium14,
    lineHeight: 22,
    color: colors.black,
  },
});

const GuideModal = ({
  guideOption,
  isHome = true,
}: {
  guideOption: GuideOption;
  isHome: boolean;
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const renderNoticeText = useCallback(
    (idx: number) => (
      <View key={idx} style={[styles.noticeTextContainer, {marginRight: 36}]}>
        <AppText key="centerDot" style={styles.dot}>
          {i18n.t('centerDot')}
        </AppText>

        <AppStyledText
          text={i18n.t(`userGuide:modal:notice:list${idx}`)}
          textStyle={styles.noticeText}
          format={{b: {color: colors.redError, fontWeight: 'bold'}}}
        />
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <Pressable
        style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}
        onPress={() => dispatch(modalActions.closeModal())}>
        <Pressable
          onPress={() => {}}
          style={{
            marginTop: 'auto',
            paddingTop: 32,
            paddingHorizontal: 20,
            backgroundColor: 'white',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
          <AppIcon
            name="guideModalIcon"
            style={{alignSelf: 'flex-start', marginBottom: 6}}
          />
          <AppText style={styles.modalTitleText}>
            {i18n.t('userGuide:modal:title')}
          </AppText>

          <AppStyledText
            text={i18n.t('userGuide:modal:body')}
            textStyle={styles.modalBodyText}
            format={{
              b: {color: colors.clearBlue},
              s: {fontWeight: '500', color: colors.black},
            }}
          />

          <View style={styles.noticeBox}>
            <View
              style={[styles.row, {alignItems: 'center', marginBottom: 10}]}>
              <AppSvgIcon name="notice" />
              <AppText style={styles.noticeTitle}>
                {i18n.t('userGuide:modal:notice:title')}
              </AppText>
            </View>
            <AppText style={styles.noticeBody}>
              {i18n.t('userGuide:modal:notice:body')}
            </AppText>
            <View style={styles.listBox}>
              {[1, 2].map((v) => renderNoticeText(v))}
            </View>
          </View>
          <View style={styles.okBtnContainer}>
            <AppButton
              style={styles.okButton}
              title={i18n.t('local:ok')}
              type="primary"
              onPress={() => {
                dispatch(modalActions.closeModal());
                if (isHome && navigation)
                  navigation.navigate('UserGuideSelectRegion', {guideOption});
              }}
            />
          </View>
        </Pressable>
      </Pressable>
    </SafeAreaView>
  );
};

export default memo(GuideModal);
