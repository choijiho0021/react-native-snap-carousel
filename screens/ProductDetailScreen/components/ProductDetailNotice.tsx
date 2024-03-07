import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppIcon from '@/components/AppIcon';
import TextWithDot from '@/screens/EsimScreen/components/TextWithDot';

const styles = StyleSheet.create({
  noticeBox: {
    paddingVertical: 17,
    paddingHorizontal: 20,
    backgroundColor: colors.darkNavy,
  },
  noticeHeader: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  noticeHeaderText: {
    ...appStyles.normal16Text,
    lineHeight: 20,
    color: colors.white,
  },
  dot: {
    ...appStyles.bold14Text,
    marginHorizontal: 5,
    lineHeight: 20,
    color: colors.white,
  },
  noticeText: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    color: colors.white,
  },
  noticeTextBold: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.white,
  },
});

type ProductDetailNoticeProps = {
  fieldNoticeOption: string[] | string;
};

const ProductDetailNotice: React.FC<ProductDetailNoticeProps> = ({
  fieldNoticeOption,
}) => {
  let noticeOptionList: string[] = [];
  if (typeof fieldNoticeOption === 'string') {
    noticeOptionList = fieldNoticeOption.replace(' ', '').split(',');
  } else {
    noticeOptionList = fieldNoticeOption;
  }

  const drupalList = ['I', 'A', 'K', 'N', 'H'];

  const noticeList: string[] = drupalList.reduce(
    (acc: string[], curr: string) => {
      if (noticeOptionList.includes(curr)) {
        acc.push(curr);
      }
      return acc;
    },
    [],
  );

  const renderNoticeOption = useCallback(
    (notice: string) => (
      <TextWithDot
        key={notice}
        dotStyle={styles.dot}
        textStyle={styles.noticeText}
        boldStyle={styles.noticeTextBold}
        text={i18n.t(`prodDetail:noticeOption:${notice}`)}
        marginRight={20}
      />
    ),
    [],
  );

  return (
    <View style={styles.noticeBox}>
      <View style={styles.noticeHeader}>
        <AppIcon name="iconNoticeRed24" />
        <AppText style={styles.noticeHeaderText}>
          {i18n.t('prodDetail:Caution')}
        </AppText>
      </View>
      {noticeList.map((i) => renderNoticeOption(i))}
    </View>
  );
};

export default ProductDetailNotice;
