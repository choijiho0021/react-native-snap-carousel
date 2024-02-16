import React, {useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import BeautifulSoup from 'beautiful-soup-js';
import {SoupElement} from 'beautiful-soup-js/build/es/main/SoupElement';

import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import TextWithDot from '@/screens/EsimScreen/components/TextWithDot';
import AppStyledText from '@/components/AppStyledText';
import AppCopyBtn from '@/components/AppCopyBtn';
import AppIcon from '@/components/AppIcon';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  dotBlack: {
    ...appStyles.bold14Text,
    marginHorizontal: 5,
    lineHeight: 18,
    color: colors.black,
  },
  noticeTextBlackWithDot: {
    ...appStyles.normal14Text,
    lineHeight: 18,
    color: colors.warmGrey,
  },
  noticeTextBlack: {
    ...appStyles.normal14Text,
    lineHeight: 18,
    color: colors.warmGrey,
  },
  noticeTextBlackBold: {
    ...appStyles.semiBold14Text,
    lineHeight: 18,
    color: colors.black,
  },
  noticeTextBlueBold: {
    ...appStyles.semiBold14Text,
    lineHeight: 18,
    color: colors.clearBlue,
  },
  bodyTop: {
    paddingVertical: 56,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  bodyTopTitle: {
    ...appStyles.medium20,
    lineHeight: 22,
    color: colors.black,
  },
  bodyTopBox: {
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 3,
    padding: 20,
    marginVertical: 16,
  },
  bodyTopBoxCountry: {
    ...appStyles.semiBold16Text,
    lineHeight: 22,
    color: colors.black,
    marginBottom: 4,
  },
  bodyTopBoxTel: {
    ...appStyles.semiBold16Text,
    lineHeight: 22,
    color: colors.clearBlue,
  },
  multiApn: {
    paddingVertical: 9,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apnButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  apnButtonText: {
    ...appStyles.medium14,
    letterSpacing: 0.23,
    color: colors.clearBlue,
  },
  tplInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  apnSetBox: {
    marginTop: 40,
    marginBottom: 16,
  },
  apnSetBoxTop: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    paddingVertical: 14,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  apnCopy: {
    padding: 20,
    backgroundColor: colors.whiteTwo,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    borderRightColor: colors.lightGrey,
    borderLeftColor: colors.lightGrey,
    display: 'flex',
    flexDirection: 'row',
  },
  apn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  apnBoxTitle: {
    ...appStyles.normal18Text,
    lineHeight: 22,
    color: colors.white,
  },
  apnInfo: {
    display: 'flex',
    flexDirection: 'row',
  },
  underline: {
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    paddingBottom: 1,
  },
  apnPrefix: {
    ...appStyles.normal16Text,
    lineHeight: 24,
    color: colors.warmGrey,
    paddingBottom: 1,
  },
  apnInfoText: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    color: colors.black,
  },
  goToApnText: {
    ...appStyles.semiBold16Text,
    lineHeight: 24,
    color: colors.black,
  },
  bodyBottom: {
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 20,
    backgroundColor: colors.whiteTwo,
  },
  bodyNoticeContents: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 26,
  },
  noticeTitle: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.black,
    marginBottom: 2,
  },
});

type ProductDetailBodyProps = {
  body: string;
  onMessage: (key: string, value?: string) => void;
  descApn: string;
  prodName: string;
  isDaily: boolean;
};

const ProductDetailBody: React.FC<ProductDetailBodyProps> = ({
  body,
  onMessage,
  descApn,
  prodName,
  isDaily,
}) => {
  const soup = useMemo(
    () => new BeautifulSoup(`<html><body>${body}</body></html>`),
    [body],
  );

  const renderTplInfo = useCallback(
    (t: {class: string; tag: string; text: string}, lineHeight?: number) => {
      const regex = /►.*◄/;
      const text = t.text.replace(/\t|&nbsp;/g, '');
      // console.log('@@@@ text', text);
      return (
        <Pressable
          onPress={() => regex.test(text) && onMessage('moveToFaq')}
          key={text}>
          {t.class === 'txt_dot' ? (
            <TextWithDot
              key={text}
              text={text}
              boldStyle={{...styles.noticeTextBlackBold, lineHeight}}
              secondBoldStyle={{...styles.noticeTextBlueBold, lineHeight}}
              textStyle={{...styles.noticeTextBlackWithDot, lineHeight}}
              dotStyle={{...styles.dotBlack, lineHeight}}
              marginRight={20}
            />
          ) : (
            <AppStyledText
              text={text}
              textStyle={{...styles.noticeTextBlack, lineHeight}}
              format={{
                b: {...styles.noticeTextBlackBold, lineHeight},
                s: {...styles.noticeTextBlueBold, lineHeight},
              }}
            />
          )}
        </Pressable>
      );
    },
    [onMessage],
  );

  const renderAPN = useCallback(
    (apn: string) => (
      <View style={styles.apn}>
        <View style={styles.apnInfo}>
          <AppText style={styles.apnPrefix}>
            {i18n.t('prodDetail:body:top:apn')}
          </AppText>
          <View style={styles.underline}>
            <AppText style={styles.apnInfoText}>{apn}</AppText>
          </View>
        </View>
        <AppCopyBtn
          title={i18n.t('copy')}
          onPress={() => onMessage('copy', apn)}
        />
      </View>
    ),
    [onMessage],
  );

  const attachBTag = useCallback((el: SoupElement, orgText: string) => {
    const boldList = el?.contents
      ?.reduce((acc: {text: string; tag: string}[], cur) => {
        const text = cur?.getText();
        if (text !== '') {
          acc?.push({text, tag: cur?.name});
        }
        return acc;
      }, [])
      ?.filter((b) => b.text !== '.');

    return boldList && boldList?.length > 0
      ? boldList?.reduce((acc, cur) => {
          const regex = new RegExp(`(${cur?.text})`, 'g');
          return cur?.tag === 'a'
            ? acc?.replace(regex, '<s>$1</s>')
            : acc?.replace(regex, '<b>$1</b>');
        }, orgText)
      : orgText;
  }, []);

  const renderBodyTop = useCallback(() => {
    const tplInfoTags = soup?.find({attrs: {class: 'tpl_info'}});
    const tplList =
      tplInfoTags?.contents.length > 1
        ? tplInfoTags?.contents.map((c) => ({
            class: c?.attrs?.class,
            tag: c?.name,
            text: attachBTag(c, c.getText()),
          }))
        : [
            {
              class: tplInfoTags?.contents[0]?.attrs?.class,
              tag: tplInfoTags?.name,
              text: attachBTag(
                tplInfoTags?.contents[0],
                tplInfoTags?.getText(),
              ),
            },
          ];

    const apnList = descApn?.split(',');
    const apnInfo = apnList?.[0]?.split('/');
    const tel = apnInfo?.[1]?.replace(/&amp;/g, ' • ');
    const apn = apnInfo?.[2]?.replace(/&amp;/g, '&');

    return (
      <View style={styles.bodyTop}>
        <AppText style={styles.bodyTopTitle}>
          {i18n.t('prodDetail:body:top:title')}
        </AppText>
        {apnList &&
          apnInfo &&
          (apnList?.length > 1 ? (
            <Pressable
              style={styles.bodyTopBox}
              onPress={() => onMessage('apn')}>
              <View style={styles.multiApn}>
                <AppText style={styles.bodyTopBoxCountry}>
                  {prodName
                    .split(' ')
                    .filter((item) => !/(무제한|종량제|\d+일)/.test(item))
                    .join(' ')}
                </AppText>
                <View style={styles.apnButton}>
                  <AppText style={styles.apnButtonText}>
                    {i18n.t('pym:detail')}
                  </AppText>
                  <AppIcon name="arrowRightBlue10" />
                </View>
              </View>
            </Pressable>
          ) : (
            <View style={styles.bodyTopBox}>
              <AppText style={styles.bodyTopBoxCountry}>{apnInfo[0]}</AppText>
              <AppText style={styles.bodyTopBoxTel}>{tel}</AppText>
            </View>
          ))}
        {tplList && tplList.length > 0 && !!tplList[0]?.text && (
          <View style={styles.tplInfo}>
            {tplList.map((t) => renderTplInfo(t))}
          </View>
        )}
        <View style={styles.apnSetBox}>
          <View
            style={[
              styles.apnSetBoxTop,
              {
                backgroundColor: isDaily ? colors.purpleishBlue : colors.violet,
              },
            ]}>
            <AppIcon name="apn" />
            <AppText style={styles.apnBoxTitle}>{i18n.t('store:apn')}</AppText>
          </View>

          {apnList &&
            apnInfo &&
            (apnList?.length > 1 ? (
              <Pressable
                style={[
                  styles.apnCopy,
                  {
                    backgroundColor: colors.white,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                ]}
                onPress={() => onMessage('apn')}>
                <AppText style={styles.goToApnText}>
                  {i18n.t('prodDetail:body:top:go:apn')}
                </AppText>
                <AppIcon name="iconArrowRightBlack10" />
              </Pressable>
            ) : (
              <View
                style={[styles.apnCopy, {flexDirection: 'column', gap: 16}]}>
                {apn?.split('&').map((a) => renderAPN(a))}
              </View>
            ))}
        </View>
        {[1, 2].map((i) => (
          <TextWithDot
            key={`prodDetail:body:top:apn:notice${i}`}
            text={i18n.t(`prodDetail:body:top:apn:notice${i}`)}
            boldStyle={styles.noticeTextBlackBold}
            textStyle={styles.noticeTextBlackWithDot}
            dotStyle={styles.dotBlack}
            marginRight={20}
          />
        ))}
      </View>
    );
  }, [
    attachBTag,
    descApn,
    isDaily,
    onMessage,
    prodName,
    renderAPN,
    renderTplInfo,
    soup,
  ]);

  const renderBodyNotice = useCallback(
    (t: {class: string; tag: string; text: string}) => {
      return t.tag === 'dt' ? (
        <AppText style={styles.noticeTitle}>{t.text}</AppText>
      ) : (
        renderTplInfo(t, 20)
      );
    },
    [renderTplInfo],
  );

  const renderBodyBottom = useCallback(() => {
    const tplCautionTags = soup?.find({attrs: {class: 'box_notandum'}});

    const tplClist = tplCautionTags?.contents?.filter((c) => c?.name === 'dl');

    const textList = tplClist?.map((c) => {
      return c?.contents.map((c) => ({
        class: c?.attrs?.class,
        tag: c?.name,
        text: attachBTag(c, c.getText()),
      }));
    });

    return (
      <View style={styles.bodyBottom}>
        <AppText style={{...styles.bodyTopTitle, fontWeight: 'bold'}}>
          {i18n.t('prodDetail:Caution')}
        </AppText>
        <View style={styles.bodyNoticeContents}>
          {textList &&
            textList.length > 0 &&
            textList.map((t) => (
              <View key={t[0].text}>{t.map((c) => renderBodyNotice(c))}</View>
            ))}
        </View>
      </View>
    );
  }, [attachBTag, renderBodyNotice, soup]);

  return (
    <View>
      {renderBodyTop()}
      {renderBodyBottom()}
    </View>
  );
};

export default ProductDetailBody;
