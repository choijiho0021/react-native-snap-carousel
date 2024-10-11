import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppIcon from '@/components/AppIcon';
import TextWithCheck from '@/screens/HomeScreen/component/TextWithCheck';

const styles = StyleSheet.create({
  callMethod: {
    paddingHorizontal: 20,
    paddingTop: 42,
  },
  callMethodTitle: {
    ...appStyles.medium20,
    lineHeight: 22,
    color: colors.black,
    marginBottom: 16,
  },
  callMethodBox: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    backgroundColor: colors.white,
    borderRadius: 3,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  callMethodBoxTop: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: colors.whiteFive,
    display: 'flex',
    flexDirection: 'row',
  },
  callMethodContents: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    marginTop: 8,
    paddingVertical: 12,
  },
  callMethodBoxBottom: {
    paddingTop: 9,
    paddingBottom: 6,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  featureWithText: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    width: '50%',
  },
  featureText: {
    ...appStyles.semiBold18Text,
    lineHeight: 22,
    color: colors.black,
  },
  callMethodBoxBold: {
    ...appStyles.semiBold16Text,
    lineHeight: 24,
    color: colors.black,
  },
  callMethodBoxText: {
    ...appStyles.normal16Text,
    lineHeight: 24,
    color: colors.black,
  },
  showDetail: {
    ...appStyles.bold14Text,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: colors.warmGrey,
  },
  ustotalDetailBox: {
    marginLeft: 24,
  },
  countryBox: {
    padding: 8,
    backgroundColor: colors.backGrey,
    borderRadius: 3,
    marginVertical: 2,
  },
  countryBoxText: {
    ...appStyles.semiBold14Text,
    lineHeight: 22,
    color: colors.black,
  },
  countryBoxNotice: {
    ...appStyles.semiBold14Text,
    lineHeight: 22,
    color: colors.warmGrey,
  },
});

type ProductDetailCallMethodProps = {
  clMtd: string;
  ftr: string;
};

const getDetailList = (clMtd: string) => {
  switch (clMtd) {
    case 'usdaily':
    case 'mvtotal':
    case 'latotal':
    case 'ais2':
      return [1];
    case 'ustotal':
    case 'ais':
    case 'vtdaily':
      return [1, 2];
    case 'dtac':
      return [1, 2, 3, 4];
    default:
      return [];
  }
};

const ProductDetailCallMethod: React.FC<ProductDetailCallMethodProps> = ({
  clMtd,
  ftr,
}) => {
  const ftrList = useMemo(
    () => (ftr.toLowerCase() === 'm' ? ['V', 'M'] : ['V']),
    [ftr],
  );
  const isUS = useMemo(() => clMtd.includes('us'), [clMtd]);
  const defaultList = useMemo(
    () => (['ustotal', 'mvtotal'].includes(clMtd) ? [1, 2] : [1]),
    [clMtd],
  );
  const detailList = useMemo(() => getDetailList(clMtd), [clMtd]);
  const [showCallDetail, setShowCallDetail] = useState(false);

  const renderFeature = useCallback((feature: string) => {
    const key = `icon${feature}`;
    return (
      <View style={styles.featureWithText} key={key}>
        {feature === 'M' && <View style={{width: 20}} />}
        <AppIcon name={key} />
        <AppText style={styles.featureText}>
          {i18n.t(`prodDetail:callMethod:box:feature:${feature}`)}
        </AppText>
      </View>
    );
  }, []);

  const renderUsTotalCountryBox = useCallback(
    () => (
      <View style={styles.ustotalDetailBox}>
        <View style={styles.countryBox}>
          <AppText style={styles.countryBoxText}>
            {i18n.t('prodDetail:callMethod:box:detail:ustotal:country')}
          </AppText>
        </View>
        <AppText style={styles.countryBoxNotice}>
          {i18n.t('prodDetail:callMethod:box:detail:ustotal:notice')}
        </AppText>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.callMethod}>
      <AppText style={styles.callMethodTitle}>
        {i18n.t('prodDetail:callMethod:title')}
      </AppText>
      <View style={styles.callMethodBox}>
        <View style={styles.callMethodBoxTop}>
          {ftrList.map((f) => renderFeature(f))}
        </View>
        <View style={styles.callMethodContents}>
          {defaultList.map((i) => (
            <View key={`default${clMtd}${i}`}>
              <TextWithCheck
                text={i18n.t(
                  `prodDetail:callMethod:box:contents:default${i}:${
                    isUS ? 'us' : clMtd
                  }`,
                )}
                textStyle={styles.callMethodBoxBold}
              />
            </View>
          ))}
          {showCallDetail &&
            detailList.length > 0 &&
            detailList.map((i) => (
              <View key={`detail${clMtd}${i}`} style={{marginRight: 20}}>
                <TextWithCheck
                  text={i18n.t(
                    `prodDetail:callMethod:box:contents:detail${i}:${clMtd}`,
                  )}
                  textStyle={styles.callMethodBoxText}
                />
                {clMtd === 'ustotal' && i === 1 && renderUsTotalCountryBox()}
              </View>
            ))}
        </View>
        <Pressable
          style={styles.callMethodBoxBottom}
          onPress={() => setShowCallDetail((prev) => !prev)}>
          <AppText style={styles.showDetail}>
            {i18n.t(showCallDetail ? 'close' : 'pym:detail')}
          </AppText>
          <AppIcon
            name={showCallDetail ? 'iconArrowUp11' : 'iconArrowDown11'}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default ProductDetailCallMethod;
