import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  Linking,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Share from 'react-native-share';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {SMSDivider} from '@/utils/utils';
import AppSvgIcon from '@/components/AppSvgIcon';
import {Currency, RkbProdByCountry} from '@/redux/api/productApi';
import {API} from '@/redux/api';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import i18n from '@/utils/i18n';
import Env from '@/environment';
import AppText from '@/components/AppText';

import KakaoSDK from '@/components/NativeModule/KakaoSDK';
import {ProductModelState, getDiscountRate} from '@/redux/modules/product';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {shareWebViewLink} from '@/redux/api/promotionApi';

const {isProduction} = Env.get();

const styles = StyleSheet.create({
  storeBox: {
    position: 'absolute',
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderColor: colors.line,
    shadowColor: colors.black8,
    height: 272,
    bottom: 0,
    width: '100%',
  },
  modalClose: {
    justifyContent: 'center',
    // height: 56,
    alignItems: 'flex-end',
    width: 26,
    height: 26,
  },
  head: {
    height: 74,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 6,
  },
  store: {
    paddingTop: 32,
    paddingBottom: 48,
    height: 164,
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
});

export type SharePlatfromType = 'kakao' | 'insta' | 'more' | 'sms';

type ShareLinkModalProps = {
  visible: boolean;
  onClose: () => void;
  purchaseItem?: PurchaseItem;
  params?: {
    partnerId?: string;
    uuid?: string;
    img?: string;
    listPrice?: Currency;
    price?: Currency;
  };
  product: ProductModelState;
  mode?: 'product' | 'fortune';
  onShareInsta?: () => void;
  onPress?: (type: SharePlatfromType) => Promise<string>;
};

const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  visible,
  onClose,
  params,
  purchaseItem,
  product,
}) => {
  // uuid 체크하는거 넣어줘야하나?
  const {partnerId, uuid, img, price, listPrice} = useMemo(
    () => params || {},
    [params],
  );

  const [isShareDisabled, setIsShareDisabled] = useState(false);

  const onShare = useCallback(async (link) => {
    try {
      await Share.open({
        title: i18n.t('rcpt:title'),
        url: link,
      }).then((r) => {
        console.log('onShare success ');
      });
    } catch (e) {
      console.log('onShare fail : ', e);
    }
  }, []);

  const onPressShareMore = useCallback(
    (shareLink) => {
      if (!isShareDisabled && shareLink) onShare(shareLink);
    },
    [isShareDisabled, onShare],
  );

  const onPressShareKakao = useCallback(
    async (country: RkbProdByCountry, imgUrl: string, dynamicLink: string) => {
      const discount =
        getDiscountRate(price?.value, listPrice?.value).toString() || '0';

      const resp = await KakaoSDK.KakaoShareLink.sendCustom({
        templateId: isProduction ? 101678 : 101630,
        templateArgs:
          discount === '0'
            ? [
                {
                  key: 'uuid',
                  value: uuid || '',
                },
                {
                  key: 'country',
                  value: country.country,
                },
                {
                  key: 'partnerId',
                  value: country.partner,
                },
                {
                  key: 'price',
                  value: listPrice?.value.toString() || '0',
                },
                {
                  key: 'title',
                  value: purchaseItem?.title,
                },
                {
                  key: 'image',
                  value: imgUrl,
                },
                {
                  key: 'dynamicLink',
                  value: dynamicLink.replace('https://rokebi.page.link/', ''),
                },
                {
                  key: 'webLink',
                  value: shareWebViewLink(uuid, country, false, false),
                },
              ]
            : [
                {
                  key: 'uuid',
                  value: uuid || '',
                },
                {
                  key: 'country',
                  value: country.country,
                },
                {
                  key: 'partnerId',
                  value: country.partner,
                },
                {
                  key: 'price',
                  value: listPrice?.value.toString() || '0',
                },
                {
                  key: 'discountPrice',
                  value: price?.value.toString(),
                },
                {
                  key: 'discount',
                  value: discount,
                },
                {
                  key: 'title',
                  value: purchaseItem?.title,
                },
                {
                  key: 'image',
                  value: imgUrl,
                },
                {
                  key: 'dynamicLink',
                  value: dynamicLink.replace('https://rokebi.page.link/', ''),
                },
                {
                  key: 'webLink',
                  value: shareWebViewLink(uuid, country, false, false),
                },
              ],
      });

      console.log('@@@ onPressKakao Result : ', resp);
    },

    [listPrice?.value, price?.value, purchaseItem, uuid],
  );

  const onPressShareMessage = useCallback(
    async (dynamicLink: string, msg?: string) => {
      const content =
        msg || `이번 여행은 로밍도깨비 ${purchaseItem?.title} eSIM 어때요?`;

      const text = encodeURIComponent(`${dynamicLink}\n${content}`);

      const result = await Linking.openURL(`sms:${SMSDivider()}body=${text}`);

      console.log('@@@ onPressShareMessage Result : ', result);
    },

    [purchaseItem?.title],
  );

  const renderContentProduct = useCallback(() => {
    return ['kakao', 'sms', 'more'].map((type) => (
      <View key={type} style={{alignContent: 'center', rowGap: 6}}>
        <AppSvgIcon
          key="closeModal"
          onPress={() => {
            setIsShareDisabled(true);

            const selectedCountryData: RkbProdByCountry =
              product.prodByCountry.find((r) => r.partner === partnerId);
            // 이미지 코드
            const imageUrl: string = API.default.httpImageUrl(img);

            // 별도 컴포넌트로 뺴고 이거 위에서 처리하게 하자.
            API.Promotion.buildShareLink({
              uuid,
              prodName: purchaseItem?.title,
              imageUrl,
              promoFlag: purchaseItem?.promoFlag,
              country: selectedCountryData,
              isShort: true,
            }).then((url) => {
              setIsShareDisabled(false);

              if (type === 'more') {
                onPressShareMore(url);
              } else if (type === 'kakao') {
                onPressShareKakao(selectedCountryData, imageUrl, url);
              } else if (type === 'sms') {
                onPressShareMessage(url);
              }
            });
          }}
          name={`${type}Icon`}
        />
        <AppText style={[appStyles.normal14Text, {textAlign: 'center'}]}>
          {i18n.t(`cart:share:${type}`)}
        </AppText>
      </View>
    ));
  }, [
    img,
    onPressShareKakao,
    onPressShareMessage,
    onPressShareMore,
    partnerId,
    product.prodByCountry,
    purchaseItem?.promoFlag,
    purchaseItem?.title,
    uuid,
  ]);

  return (
    <Modal visible={visible} transparent>
      <Pressable
        style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)'}}
        onPress={onClose}>
        <SafeAreaView key="modal" style={styles.storeBox}>
          <View style={styles.head}>
            <AppText style={appStyles.bold18Text}>
              {i18n.t(`cart:share`)}
            </AppText>
            <View style={styles.modalClose}>
              <AppSvgIcon
                name="closeModal"
                key="closeModal"
                onPress={onClose}
              />
            </View>
          </View>
          <View
            style={[
              styles.store,
              {
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'row',
                paddingHorizontal: 40,
                gap: 40,
              },
            ]}>
            {renderContentProduct()}
          </View>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};

export default connect(({product}: RootState) => ({
  product,
}))(ShareLinkModal);
