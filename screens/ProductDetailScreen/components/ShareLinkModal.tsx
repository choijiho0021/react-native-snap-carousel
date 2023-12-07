import React, {memo, useCallback, useMemo, useState} from 'react';
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Share from 'react-native-share';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import AppModal from '@/components/AppModal';
import AppSvgIcon from '@/components/AppSvgIcon';
import {RkbProdByCountry} from '@/redux/api/productApi';
import {API} from '@/redux/api';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {SMSDivider} from '@/utils/utils';
import i18n from '@/utils/i18n';
import Env from '@/environment';
import AppText from '@/components/AppText';

import KakaoSDK from '@/components/NativeModule/KakaoSDK';
import {ProductModelState} from '@/redux/modules/product';

const {isProduction} = Env.get();

const styles = StyleSheet.create({});

type ShareLinkModalProps = {
  visible: boolean;
  onClose: () => void;
  purchaseItem: PurchaseItem;
  param: {
    partnerId?: string;
    uuid?: string;
    img?: string;
  };
  product: ProductModelState;
};

const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  visible,
  onClose,
  param,
  purchaseItem,
  product,
}) => {
  // uuid 체크하는거 넣어줘야하나?
  const {partnerId, uuid, img} = useMemo(() => param, [param]);
  const [isShareDisabled, setIsShareDisabled] = useState(false);

  const onShare = useCallback(async (link) => {
    try {
      await Share.open({
        title: i18n.t('rcpt:title'),
        url: link,
      }).then((r) => {
        setIsShareDisabled(false);
      });
    } catch (e) {
      console.log('onShare fail : ', e);
      setIsShareDisabled(false);
    }
  }, []);

  const onPressShareMore = useCallback(
    (shareLink) => {
      setIsShareDisabled(true);

      if (!isShareDisabled && shareLink) onShare(shareLink);
    },
    [isShareDisabled, onShare],
  );

  const onPressShareKakao = useCallback(
    async (country: RkbProdByCountry, imgUrl: string, dynamicLink: string) => {
      // 추가로 필요한 정보가 있다.
      // ex.
      // 제목 : 호주 무제한 2일
      // 설명 : 터치 한 번으로 eSIM 구매부터 사용까지 뚝딱😉

      console.log(
        '@@@ 결과나 확인하기 카카오톡에서 쓸 링크 : ',
        dynamicLink.replace('https://rokebi.page.link/', ''),
      );

      const resp = await KakaoSDK.KakaoShareLink.sendCustom({
        // kakao template 상용: 67017, TB: 70053

        // 상용 카카오톡 템플릿도 만들어야함
        templateId: isProduction ? 101518 : 101630,
        templateArgs: [
          {
            key: 'uuid',
            value: uuid,
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
            value: '40000',
          },
          {
            key: 'discountPrice',
            value: '30000',
          },
          {
            key: 'discount',
            value: '30',
          },
          {
            key: 'title',
            value: '호주 5일 무제한 상품',
          },
          {
            key: 'image',
            value: imgUrl,
          },
          {
            key: 'dynamicLink',
            value: dynamicLink.replace('https://rokebi.page.link/', ''),
          },
        ],
      });

      console.log('@@@ onPressKakao Result : ', resp);
    },

    [uuid],
  );

  const onPressShareMessage = useCallback(
    async (dynamicLink: string) => {
      const result = await Linking.openURL(
        `sms:${SMSDivider}body=${dynamicLink}\n안녕하세요. 테스트`,
      );

      console.log('@@@ onPressShareMessage Result : ', result);
    },

    [],
  );

  return (
    <AppModal
      visible={visible}
      type="close"
      onOkClose={() => {
        onClose(false);
      }}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 40,
        }}>
        {['kakao', 'message', 'more'].map((type) => (
          <View>
            <AppSvgIcon
              key="closeModal"
              onPress={() => {
                const selectedCountryData: RkbProdByCountry =
                  product.prodByCountry.find((r) => r.partner === partnerId);
                const imageUrl: string = API.default.httpImageUrl(img);

                console.log('@@@ imageUrl : ', imageUrl);

                // 별도 컴포넌트로 뺴고 이거 위에서 처리하게 하자.
                API.Promotion.buildShareLink({
                  uuid,
                  prodName: purchaseItem?.title,
                  imageUrl,
                  promoFlag: purchaseItem?.promoFlag,
                  country: selectedCountryData,
                  isShort: true,
                }).then((url) => {
                  if (type === 'more') {
                    onPressShareMore(url);
                  } else if (type === 'kakao') {
                    onPressShareKakao(selectedCountryData, uuid, imageUrl, url);
                  } else if (type === 'message') {
                    onPressShareMessage(url);
                  }
                });
              }}
              name="closeModal"
            />
            <AppText>{i18n.t(`cart:share:${type}`)}</AppText>
          </View>
        ))}
      </View>
    </AppModal>
  );
};

// export default memo(ShareLinkModal);

export default connect(({product}: RootState) => ({
  product,
}))(ShareLinkModal);
