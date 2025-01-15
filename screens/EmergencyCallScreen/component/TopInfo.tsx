import Lottie from 'lottie-react-native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';

const styles = StyleSheet.create({
  iconView: {
    alignItems: 'center',
    marginTop: 40,
  },
  titleText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 26,
  },
  titleBold: {
    ...appStyles.bold24Text,
    lineHeight: 28,
    textAlign: 'center',
    color: colors.clearBlue,
    marginTop: 6,
  },
  rokebiIcon: {
    width: 201,
    height: 206,
  },
  blueView: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 3,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    flex: 1,
    flexWrap: 'wrap',
  },
  point: {
    color: colors.warmGrey,
    marginHorizontal: 4,
  },
  detailText: {
    flex: 1,
    flexWrap: 'wrap',
    ...appStyles.normal12Text,
    textAlign: 'left',
    lineHeight: 16,
    color: colors.warmGrey,
  },
});

const TopInfo = () => {
  return (
    <View style={{backgroundColor: colors.aliceBlue}}>
      <View style={styles.iconView}>
        <AppText style={styles.titleText}>
          {i18n.t('talk:urgent:title')}
        </AppText>
        <AppText style={styles.titleBold}>
          {i18n.t('talk:urgent:titleBold')}
        </AppText>
        <View style={{height: 32}} />
        <Lottie
          autoPlay
          loop
          style={styles.rokebiIcon}
          source={require('@/assets/images/lottie/emg_flying.json')}
        />
      </View>

      <View style={styles.blueView}>
        <View style={styles.infoBox}>
          <AppSvgIcon name="sos" style={{marginRight: 8}} />
          <>
            <AppText style={styles.infoText}>
              {i18n.t('talk:urgent:info')}
              <AppText style={{fontWeight: 'bold'}}>
                {i18n.t('talk:urgent:infoBold')}
              </AppText>
            </AppText>
          </>
        </View>

        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <AppText style={styles.point}>{i18n.t('talk:urgent:point')}</AppText>
          <AppText style={styles.detailText}>
            {i18n.t('talk:urgent:detail1')}
          </AppText>
        </View>

        <View style={{flexDirection: 'row'}}>
          <AppText style={styles.point}>{i18n.t('talk:urgent:point')}</AppText>
          <AppText style={styles.detailText}>
            {i18n.t('talk:urgent:detail2')}
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default TopInfo;
