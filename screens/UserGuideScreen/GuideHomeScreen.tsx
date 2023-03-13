/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Pressable} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {HomeStackParamList} from '@/navigation/navigation';
import AppBackButton from '@/components/AppBackButton';
import AppSvgIcon from '@/components/AppSvgIcon';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import AppIcon from '@/components/AppIcon';
import AppButton from '@/components/AppButton';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  header: {
    height: 56,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 64,
  },
  headerTitle: {
    height: 56,
    marginRight: 8,
  },
  title: {
    marginBottom: 18,
    paddingHorizontal: 20,
  },
  titleText: {
    ...appStyles.bold24Text,
    lineHeight: 32,
    color: colors.black,
  },
  logo: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  btn: {
    padding: 30,
    borderWidth: 1,
    borderColor: colors.whiteFive,
    marginHorizontal: 20,
    marginTop: 24,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,

    elevation: 12,
    shadowColor: 'rgb(166, 168, 172)',
    shadowRadius: 12,
    shadowOpacity: 0.16,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  btnTitle: {
    ...appStyles.bold18Text,
    lineHeight: 22,
    marginBottom: 4,
    color: colors.black,
  },
  btnBody: {
    ...appStyles.semiBold16Text,
    lineHeight: 24,
    color: colors.warmGrey,
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

type UserGuideScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'GuideHome'
>;

type GuideHomeScreenProps = {
  navigation: UserGuideScreenNavigationProp;
  actions: {
    modal: ModalAction;
  };
};

export type GuideOption = 'esimReg' | 'checkSetting';

export const renderHeader = (onPress: () => void) => (
  <View style={styles.header}>
    <AppBackButton style={styles.headerTitle} />
    <AppSvgIcon
      key="closeModal"
      onPress={onPress}
      name="closeModal"
      style={{marginRight: 16}}
    />
  </View>
);

export const renderTitle = (title: string) => (
  <View style={styles.title}>
    <AppText style={styles.titleText}>{title}</AppText>
  </View>
);

export const renderBtn = (item: string, onPress: () => void, isHome = true) => (
  <Pressable
    key={item}
    style={[
      styles.btn,
      item === 'checkSetting' && {backgroundColor: colors.backGrey},
    ]}
    onPress={onPress}>
    <View>
      <AppText style={styles.btnTitle}>
        {isHome
          ? i18n.t(`userGuide:${item}:title`)
          : i18n.t(`userGuide:selectRegion:${item}`)}
      </AppText>
      {isHome && (
        <AppText style={styles.btnBody}>
          {i18n.t(`userGuide:${item}:body`)}
        </AppText>
      )}
    </View>
    <AppSvgIcon name="rightArrow20" />
  </Pressable>
);

const renderNoticeText = (idx: number) => (
  <View
    key={idx}
    style={[
      styles.noticeTextContainer,
      {
        marginRight: 36,
      },
    ]}>
    <AppText key="centerDot" style={styles.dot}>
      {i18n.t('centerDot')}
    </AppText>

    <AppStyledText
      text={i18n.t(`userGuide:modal:notice:list${idx}`)}
      textStyle={styles.noticeText}
      format={{b: {color: colors.redError, fontWeight: 'bold'}}}
    />
  </View>
);

export const guideModal = (
  actions: {
    modal: ModalAction;
  },
  navigation: UserGuideScreenNavigationProp,
  guideOption,
) => (
  <SafeAreaView style={{flex: 1}}>
    <Pressable
      style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}
      onPress={() => actions.modal.closeModal()}>
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
          <View style={[styles.row, {alignItems: 'center', marginBottom: 10}]}>
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
              actions.modal.closeModal();
              navigation.navigate('UserGuideSelectRegion', {guideOption});
            }}
          />
        </View>
      </Pressable>
    </Pressable>
  </SafeAreaView>
);

const GuideHomeScreen: React.FC<GuideHomeScreenProps> = ({
  navigation,
  actions,
}) => {
  const [guideOption, setGuideOption] = useState<GuideOption>('esimReg');

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader(() => navigation.goBack())}

      {renderTitle(i18n.t('userGuide:home:title'))}
      <AppIcon name="guideHomeLogo" style={styles.logo} />

      {['esimReg', 'checkSetting'].map((v) =>
        renderBtn(
          v,
          () => {
            setGuideOption(v);
            if (v === 'esimReg')
              actions.modal.showModal({
                content: guideModal(actions, navigation, guideOption),
              });
            else {
              navigation.navigate('UserGuideSelectRegion', {guideOption: v});
            }
          },
          true,
        ),
      )}
    </SafeAreaView>
  );
};

export default connect(
  // eslint-disable-next-line no-empty-pattern
  ({}) => ({}),
  (dispatch) => ({
    actions: {
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(GuideHomeScreen);
