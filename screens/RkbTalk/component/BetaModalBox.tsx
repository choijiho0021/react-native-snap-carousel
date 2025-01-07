import {useNavigation} from '@react-navigation/native';
import {RootState} from '@reduxjs/toolkit';
import React, {useCallback} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';

const smallDevice = isDeviceSize('medium') || isDeviceSize('small');

const styles = StyleSheet.create({
  storeBox: {
    position: 'absolute',
    paddingTop: 20,
    paddingBottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderColor: colors.line,
    shadowColor: colors.black8,
    height: '100%',
    bottom: 0,
    width: '100%',
    alignItems: 'flex-end',
  },
  modalMargin: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 32,
    paddingBottom: 19,
  },
  headView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 24,
  },
  headTitle: {
    ...appStyles.bold24Text,
    lineHeight: 34,
    textAlignVertical: 'center',
    marginLeft: 8,
  },
  title1: {
    ...appStyles.normal18Text,
    lineHeight: 26,
    color: colors.black,
  },
  title2: {
    ...appStyles.bold18Text,
    lineHeight: 26,
    color: colors.clearBlue,
  },
  modalIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  pointView: {
    flexDirection: 'column',
    height: 80,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backGrey,
  },
  pointGreenText: {
    ...appStyles.normal16Text,
    color: colors.shamrock,
    fontWeight: 'bold',
    lineHeight: 24,
    marginLeft: 2,
  },
  iconBox: {
    flex: 1,
    justifyContent: 'center',
  },
  subBoldText: {
    ...appStyles.bold14Text,
    color: colors.warmGrey,
    lineHeight: 20,
  },
  subText: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    lineHeight: 20,
  },
  content: {
    justifyContent: 'flex-end',
    height: 130,
    marginBottom: 15,
  },
  okButton: {
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.blue,
  },
  linear: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    height: 30,
    width: '100%',
  },
});

type BetaModalBoxProps = {
  onPress: () => void;
  amount: number;
};

const BetaModalBox: React.FC<BetaModalBoxProps> = ({onPress, amount}) => {
  const head = useCallback(() => {
    return (
      <View style={styles.headView}>
        <AppIcon name="iconEmojiCelebration" />
        <AppText style={styles.headTitle}>
          {i18n.t('talk:beta:modal:title')}
        </AppText>
      </View>
    );
  }, []);

  const title = useCallback(() => {
    return (
      <View>
        <AppText style={styles.title1}>
          {i18n.t('talk:beta:modal:title1')}
        </AppText>
        <AppText style={styles.title2}>
          {i18n.t('talk:beta:modal:title2')}
        </AppText>
      </View>
    );
  }, []);

  const pointBox = useCallback(() => {
    return (
      <View style={styles.pointView}>
        <AppText style={{...appStyles.normal16Text, lineHeight: 24}}>
          {i18n.t('talk:beta:modal:sub1')}
        </AppText>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppIcon name="iconPoint" />
          <AppText style={styles.pointGreenText}>
            {amount} {i18n.t('talk:beta:modal:sub2')}
            <AppText style={{color: colors.black, fontWeight: 'normal'}}>
              {i18n.t('talk:beta:modal:sub3')}
            </AppText>
            {i18n.t('talk:beta:modal:sub4')}
            <AppText style={{color: colors.black, fontWeight: 'normal'}}>
              {i18n.t('talk:beta:modal:sub5')}
            </AppText>
          </AppText>
        </View>
      </View>
    );
  }, [amount]);

  const content = useCallback(() => {
    return (
      <View style={styles.content}>
        <AppText style={styles.subBoldText}>
          {i18n.t('talk:beta:modal:sub6')}
          <AppText style={styles.subText}>
            {i18n.t('talk:beta:modal:sub7')}
          </AppText>
        </AppText>
      </View>
    );
  }, []);

  const gradientView = useCallback(() => {
    return (
      <View style={styles.linear}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.5)', colors.white]}
          style={styles.gradient}
        />
      </View>
    );
  }, []);

  const joinButton = useCallback(() => {
    return (
      <>
        {smallDevice && gradientView()}
        <View style={{height: 15, backgroundColor: colors.white}} />
        <AppButton
          style={styles.okButton}
          title={i18n.t('talk:beta:modal:join')}
          onPress={onPress}
        />
      </>
    );
  }, [gradientView, onPress]);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView key="modal" style={styles.storeBox}>
        <View style={styles.modalMargin}>
          {head()}
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.iconBox}>
              {title()}
              <AppIcon style={styles.modalIcon} name="imgTalkModalS" />
              {pointBox()}
            </View>
            {content()}
          </ScrollView>
          {joinButton()}
        </View>
      </SafeAreaView>
    </View>
  );
};

// export default memo(BetaModalBox);

export default connect(({product}: RootState) => ({
  product,
}))(BetaModalBox);
