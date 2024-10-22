import React, {useCallback} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grayBox: {
    backgroundColor: colors.backGrey,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  numberText: {
    ...appStyles.bold18Text,
    lineHeight: 26,
    color: colors.gray20,
  },
  bannerClock: {
    marginLeft: 12,
    marginRight: 8,
  },
  grayText: {
    ...appStyles.normal14Text,
    lineHeight: 22,
    color: colors.warmGrey,
  },
  callBtn: {
    flex: 1,
    backgroundColor: colors.clearBlue,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  kakaoBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.clearBlue,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  callText: {
    ...appStyles.normal18Text,
    lineHeight: 26,
    color: colors.white,
    marginLeft: 8,
  },
  kakaoText: {
    ...appStyles.normal18Text,
    lineHeight: 26,
    color: colors.clearBlue,
    marginLeft: 8,
  },
  detailTitle: {
    ...appStyles.bold14Text,
    lineHeight: 22,
    color: colors.darkBlue,
    marginBottom: 6,
  },
});

const CallService = ({
  type,
  num,
  needTitle = false,
  onPressCall,
  onPressKakao,
}: {
  type: string;
  num: number;
  needTitle?: boolean;
  onPressCall: (type: string) => void;
  onPressKakao: (type: string) => void;
}) => {
  const usageDetail = useCallback(
    (tp: string, nm: number, nt: boolean = false) => {
      return (
        <View style={styles.grayBox}>
          {nt && (
            <AppText style={styles.detailTitle}>
              {i18n.t(`talk:urgent:${tp}:usage:title`)}
            </AppText>
          )}
          {Array.from({length: nm}, (v, i) => i + 1).map((a, i) => {
            return (
              <View
                key={a.toString()}
                style={[styles.rowCenter, i < nm - 1 && {marginBottom: 9}]}>
                <AppSvgIcon style={{marginRight: 8}} name="checkBlueSmall" />
                <AppText>{i18n.t(`talk:urgent:${tp}:usage:${i + 1}`)}</AppText>
              </View>
            );
          })}
        </View>
      );
    },
    [],
  );

  return (
    <View style={{marginBottom: 44}}>
      <AppText style={{...appStyles.bold20Text, color: colors.clearBlue}}>
        {i18n.t(`talk:urgent:${type}:title`)}
      </AppText>
      <View style={[styles.grayBox, {marginTop: 8, marginBottom: 6}]}>
        <AppText style={styles.numberText}>
          {i18n.t(`talk:urgent:${type}:callNumber`)}
        </AppText>
      </View>
      <View style={[styles.rowCenter, {marginBottom: 24}]}>
        <AppSvgIcon style={styles.bannerClock} name="bannerClock" />
        <AppText style={styles.grayText}>
          {i18n.t(`talk:urgent:serviceTime`)}
        </AppText>
      </View>
      <View style={[styles.rowCenter, {marginBottom: 12}]}>
        <AppSvgIcon style={{marginRight: 4}} name="questionMark" />
        <AppText style={{...appStyles.bold16Text, lineHeight: 24}}>
          {i18n.t(`talk:urgent:whenToUse`)}
        </AppText>
      </View>

      {usageDetail(type, num, needTitle)}

      <Pressable style={styles.callBtn} onPress={() => onPressCall(type)}>
        <AppSvgIcon name="iconCall" />
        <AppText style={styles.callText}>
          {i18n.t(`talk:urgent:${type}:call`)}
        </AppText>
      </Pressable>
      <Pressable style={styles.kakaoBtn} onPress={() => onPressKakao(type)}>
        <AppSvgIcon name="loginImgKakao" />
        <AppText style={styles.kakaoText}>
          {i18n.t(`talk:urgent:${type}:kakao`)}
        </AppText>
      </Pressable>
    </View>
  );
};

export default CallService;
