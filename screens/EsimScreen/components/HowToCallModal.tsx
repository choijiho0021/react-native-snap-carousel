import React, {memo, useCallback} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import AppModal from '@/components/AppModal';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  content: {
    marginHorizontal: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  title: {
    ...appStyles.bold20Text,
    marginTop: 42,
    marginBottom: 20,
  },
  subtitle: {
    ...appStyles.bold16Text,
    color: colors.clearBlue,
    marginTop: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  phone: {
    ...appStyles.bold14Text,
    lineHeight: 22,
  },
  greyBox: {
    backgroundColor: colors.backGrey,
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginBottom: 8,
    borderRadius: 3,
  },
  way: {
    ...appStyles.bold14Text,
    marginLeft: 6,
    color: colors.clearBlue,
  },
  wayTxt: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    marginVertical: 8,
  },
  step: {
    ...appStyles.bold14Text,
    color: colors.clearBlue,
    marginBottom: 12,
  },
  stepTxt: {
    ...appStyles.normal18Text,
    marginBottom: 16,
    lineHeight: 22,
  },
  stepBoldTxt: {
    ...appStyles.bold18Text,
    marginBottom: 16,
    lineHeight: 22,
    paddingRight: 20,
  },
  darkblueBold14: {
    ...appStyles.bold14Text,
    color: colors.darkBlue,
    marginBottom: 4,
    lineHeight: 22,
  },
  warmGreyBold14: {
    ...appStyles.bold14Text,
    color: colors.warmGrey,
  },
  checkSmall: {
    marginRight: 4,
    paddingVertical: 3,
  },
  tip: {
    width: 40,
    height: 24,
    borderRadius: 100,
    backgroundColor: colors.gray3,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
type HowToCallModalProps = {
  visible: boolean;
  clMtd: string; // "ustotal" | "usdaily" | "ais" | "dtac"  | "mvtotal" | "vndaily" | "vtdaily"
  onOkClose: () => void;
};

const HowToCallModal: React.FC<HowToCallModalProps> = ({
  visible,
  clMtd,
  onOkClose,
}) => {
  const renderMethodTitle = useCallback((num: string) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <AppSvgIcon name="bannerCheckBlue" />
        <AppText style={styles.way}>{`${i18n.t(
          'esim:howToCall:numCheck:way',
        )}${num}`}</AppText>
      </View>
    );
  }, []);

  const renderMethodWay1 = useCallback(
    (isAlone = false) => {
      return (
        <>
          <AppText style={[styles.wayTxt, isAlone && {marginTop: 0}]}>
            {i18n.t(`esim:howToCall:numCheck:way1:${clMtd}`)}
          </AppText>
        </>
      );
    },
    [clMtd],
  );

  const renderMethodWay2 = useCallback((isAlone = false) => {
    return (
      <>
        <AppText style={[styles.wayTxt, isAlone && {marginTop: 0}]}>
          {i18n.t(`esim:howToCall:numCheck:way2:txt`)}
        </AppText>
        <View style={{marginBottom: 6}}>
          <AppStyledText
            text={i18n.t(`esim:howToCall:numCheck:way2:ios`)}
            textStyle={styles.phone}
            format={{
              h: {color: colors.darkBlue, fontWeight: '700'},
              g: {color: colors.warmGrey},
            }}
            numberOfLines={2}
          />
        </View>
        <AppStyledText
          text={i18n.t(`esim:howToCall:numCheck:way2:aos`)}
          textStyle={styles.phone}
          format={{
            h: {color: colors.darkBlue, fontWeight: '700'},
            g: {color: colors.warmGrey},
          }}
          numberOfLines={2}
        />
      </>
    );
  }, []);

  const renderMethod = useCallback(() => {
    return (
      <>
        {renderMethodTitle('1')}
        {renderMethodWay1()}
        {renderMethodTitle('2')}
        {renderMethodWay2()}
      </>
    );
  }, [renderMethodTitle, renderMethodWay1, renderMethodWay2]);

  const renderNumCheck = useCallback(
    () => (
      <>
        <AppText style={styles.subtitle}>
          {i18n.t('esim:howToCall:numCheck')}
        </AppText>

        <View style={styles.greyBox}>{renderMethod()}</View>
      </>
    ),
    [renderMethod],
  );

  const rednerDomestic = useCallback(
    () => (
      <>
        <AppText style={styles.subtitle}>
          {i18n.t(`esim:howToCall:domestic:${clMtd}`)}
        </AppText>
        <View style={styles.greyBox}>
          <AppText style={{...appStyles.bold18Text}}>
            {i18n.t(`esim:howToCall:domestic:${clMtd}:txt`)}
          </AppText>
        </View>
        <AppText
          style={{
            ...appStyles.bold14Text,
            marginLeft: 12,
            marginBottom: 8,
            color: colors.warmGrey,
          }}>
          {i18n.t(`esim:howToCall:domestic:${clMtd}:ex`)}
        </AppText>
      </>
    ),
    [clMtd],
  );

  const renderStep = useCallback(
    (idx: number, bold: boolean) => (
      <>
        <AppText style={styles.step}>
          {i18n.t('esim:howToCall:international:step')}
          {idx}
        </AppText>
        <AppText style={bold ? styles.stepBoldTxt : styles.stepTxt}>
          {i18n.t(`esim:howToCall:international:step${idx}:txt`)}
        </AppText>
      </>
    ),
    [],
  );

  const renderIntGreyBox = useCallback(() => {
    return (
      <AppText style={styles.stepBoldTxt}>
        {i18n.t(`esim:howToCall:international:${clMtd}:txt`)}
      </AppText>
    );
  }, [clMtd]);

  const rednerInternational = useCallback(() => {
    return (
      <>
        <AppText style={styles.subtitle}>
          {i18n.t(`esim:howToCall:international:${clMtd}`)}
        </AppText>
        <View
          style={{
            ...styles.greyBox,
            flexDirection: 'row',
            alignContent: 'center',
          }}>
          {renderIntGreyBox()}
        </View>

        <View style={{marginLeft: 20}}>
          <View style={{flexDirection: 'row'}}>
            <AppSvgIcon name="checkedDarkBlueSmall" style={styles.checkSmall} />
            <View>
              <AppText style={styles.darkblueBold14}>
                {i18n.t(`esim:howToCall:international:${clMtd}:ex:title`)}
              </AppText>
              <View style={{flexDirection: 'row'}}>
                <AppText style={[styles.warmGreyBold14, {marginBottom: 4}]}>
                  {i18n.t(`example`)}
                </AppText>
                <View>
                  <AppText style={[styles.warmGreyBold14, {marginBottom: 4}]}>
                    {i18n.t(`esim:howToCall:international:${clMtd}:ex:txt1`)}
                  </AppText>
                  {clMtd === 'ustotal' && (
                    <AppText style={[styles.warmGreyBold14, {marginBottom: 8}]}>
                      {i18n.t(`esim:howToCall:international:${clMtd}:ex:txt2`)}
                    </AppText>
                  )}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.tip}>
                  <AppText style={styles.warmGreyBold14}>Tip!</AppText>
                </View>
                <AppText style={styles.warmGreyBold14}>
                  {i18n.t(`esim:howToCall:international:ex:tip`)}
                </AppText>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  }, [clMtd, renderIntGreyBox]);

  const renderEtcInfo = useCallback(
    () => (
      <>
        <AppText style={styles.subtitle}>
          {i18n.t(`esim:howToCall:etcInfo`)}
        </AppText>
        <View style={styles.greyBox}>
          <AppText style={appStyles.bold14Text}>
            {i18n.t(`esim:howToCall:etcInfo:checkMtd`)}
          </AppText>

          <View style={{flexDirection: 'row', marginTop: 12}}>
            <AppSvgIcon name="checkedDarkBlueSmall" style={styles.checkSmall} />
            <View style={{flex: 1, marginRight: 4}}>
              <AppText style={{...styles.darkblueBold14, marginBottom: 4}}>
                {i18n.t(`esim:howToCall:etcInfo:subtitle1:${clMtd}:title`)}
              </AppText>
              <AppText
                style={{...appStyles.bold14Text, color: colors.warmGrey}}>
                {i18n.t(`esim:howToCall:etcInfo:subtitle1:${clMtd}:txt`)}
              </AppText>
            </View>
          </View>

          {['ais', 'dtac'].includes(clMtd) && (
            <View style={{flexDirection: 'row', marginTop: 12}}>
              <AppSvgIcon
                name="checkedDarkBlueSmall"
                style={styles.checkSmall}
              />
              <View style={{marginRight: 4}}>
                <AppText style={{...styles.darkblueBold14, marginBottom: 4}}>
                  {i18n.t(`esim:howToCall:etcInfo:subtitle2:${clMtd}:title`)}
                </AppText>
                <AppText
                  style={{...appStyles.bold14Text, color: colors.warmGrey}}>
                  {i18n.t(`esim:howToCall:etcInfo:subtitle2:${clMtd}:txt`)}
                </AppText>
              </View>
            </View>
          )}
        </View>
      </>
    ),
    [clMtd],
  );

  return (
    <AppModal
      justifyContent="flex-end"
      contentStyle={styles.content}
      bottom={() => null}
      onOkClose={() => {
        onOkClose();
      }}
      onCancelClose={() => {
        onOkClose();
      }}
      visible={visible}>
      <View style={styles.header}>
        <AppText style={{...appStyles.bold18Text}}>
          {i18n.t('esim:howToCall')}
        </AppText>
        <AppSvgIcon
          key="closeModal"
          onPress={() => {
            onOkClose();
          }}
          name="closeModal"
        />
      </View>
      <ScrollView
        style={{
          paddingHorizontal: 20,
        }}>
        <AppText style={styles.title}>
          {i18n.t(`esim:howToCall:title:${clMtd}`)}
        </AppText>

        {renderNumCheck()}

        {rednerDomestic()}

        {['ais', 'dtac', 'ustotal'].includes(clMtd) && rednerInternational()}

        {['ais', 'dtac', 'mvtotal', 'vtdaily'].includes(clMtd) &&
          renderEtcInfo()}
        <View style={{height: 24, width: '100%'}} />
      </ScrollView>
    </AppModal>
  );
};

export default memo(HowToCallModal);
