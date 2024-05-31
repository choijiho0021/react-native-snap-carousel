import React, {useCallback, useState} from 'react';
import {
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Share from 'react-native-share';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import AppSvgIcon from '@/components/AppSvgIcon';
import {API} from '@/redux/api';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import i18n from '@/utils/i18n';
import Env from '@/environment';
import AppText from '@/components/AppText';

import KakaoSDK from '@/components/NativeModule/KakaoSDK';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {AccountModelState} from '@/redux/modules/account';
import RNFetchBlob from 'rn-fetch-blob';
import ViewShot from 'react-native-view-shot';
import {utils} from '@/utils/utils';

const {isProduction, webViewHost} = Env.get();

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
  contentContainer: {
    paddingTop: 32,
    paddingBottom: 48,
    height: 164,
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 40,
  },
});

export type SharePlatfromType = 'kakao' | 'insta' | 'more' | 'sms';

type LotteryShareModalProps = {
  visible: boolean;
  onClose: () => void;
  purchaseItem?: PurchaseItem;
  onShareInsta?: () => void;
  account: AccountModelState;
  captureRef: React.MutableRefObject<ViewShot | null>;
};

const LotteryShareModal: React.FC<LotteryShareModalProps> = ({
  visible,
  onClose,
  account: {iccid, token, mobile},
  onShareInsta,
  captureRef,
}) => {
  const [isShareDisabled, setIsShareDisabled] = useState(false);

  const uploadImage = useCallback(async () => {
    const uri = await captureRef.current?.capture?.();
    const image = Platform.OS === 'android' ? uri : `file://${uri}`;

    const convertImage = await utils.convertFileURLtoRkbImage(image);

    // image upload
    API.Account.uploadFortuneImage({
      image: convertImage,
      user: mobile,
      token,
    }).then((resp) => {
      if (resp?.result === 0) {
        const serverImageUrl = API.default.httpImageUrl(
          resp?.objects[0]?.userPictureUrl,
        );

        // fortune Image 필드 갱신
        API.Account.lotteryCoupon({
          iccid,
          token,
          prompt: 'image',
          fid: parseInt(resp?.objects[0]?.fid, 10), // ref_fortune 값에 넣을 데이터, imageUrl은 리덕스 처리해야하나...
        }).then((resp) => {
          if (resp?.result === 0) return serverImageUrl;
        });
      }

      return '';
    });
  }, [iccid, mobile, captureRef, token]);

  const getBase64 = useCallback((imgLink: string) => {
    return RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', imgLink)
      .then((resp) => {
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then(async (base64Data) => {
        const base64Image = `data:image/jpeg;base64,${base64Data}`;

        return base64Image;
      });
  }, []);

  const onPressShareMessage = useCallback(
    async (imgLink: string) => {
      getBase64(imgLink).then((base64) => {
        try {
          const shareOptions = {
            social: Share.Social.SMS,
            message: i18n.t('esim:lottery:share:desc'),
            url: base64,
            recipient: '',
          };
          Share.shareSingle(shareOptions).then((result) => {
            console.log('@@@@ result : ', result);
          });
        } catch (e) {
          console.log('@@@@ share error : ', e);
        }
      });
    },

    [getBase64],
  );
  const onShareMore = useCallback(
    async (imgLink) => {
      try {
        getBase64(imgLink).then(async (base64) => {
          const base64Image = `data:image/jpeg;base64,${base64}`;
          await Share.open({
            url: base64Image,
            message: i18n.t('esim:lottery:share:desc'),
          }).then((r) => {
            console.log('onShare success');
          });
        });
      } catch (e) {
        console.log('onShare fail : ', e);
      }
    },
    [getBase64],
  );

  const onPressShareMore = useCallback(
    async (imgLink) => {
      if (shareLink) {
        onShareMore(imgLink);
      }
    },
    [onShareMore],
  );

  // TODO : Share 관련된 것만 따로 뺼 것
  const onPressShareKakaoForFortune = useCallback(
    async (link: string, imgUrl: string) => {
      console.log('@@@@ kakaoShare image Url 전달 : ', imgUrl);

      const resp = await KakaoSDK.KakaoShareLink.sendCustom({
        templateId: isProduction ? 107765 : 108427,
        templateArgs: [
          {key: 'dynamicLink', value: link},
          {
            key: 'image',
            value: imgUrl,
          },
        ],
      });

      console.log('@@@ onPressKakao Result : ', resp);
    },

    [],
  );

  const sharePlatform = useCallback(
    (pictureUrl: string, type: string) => {
      const serverImageUrl = API.default.httpImageUrl(pictureUrl);

      console.log('@@@ serverImageUrl : ', serverImageUrl);

      //  kakao 때만 동적 링크 필요
      if (['kakao'].includes(type)) {
        const link = `${webViewHost}${
          isProduction
            ? 'linkPath=LPjf&recommender=202d3f20-6a53-44ee-8c07-5532abc8583a'
            : '?linkPath=ozCS&recommender=411d33bb-0bb6-4244-9b01-d5309233229f'
        }`;

        return API.Promotion.buildLinkFortune({
          imageUrl: serverImageUrl || '',
          link,
          desc: i18n.t('esim:lottery:share:desc'),
        }).then(async (url) => {
          console.log('@@@ 만들어진 url 링크 확인 : ', url);

          if (type === 'kakao') {
            onPressShareKakaoForFortune(url, serverImageUrl || '');
          }
        });
      }

      if (type === 'more') {
        onPressShareMore(serverImageUrl);
      }

      if (type === 'sms') {
        console.log('@@@ sms');
        onPressShareMessage(serverImageUrl);
      }
    },
    [onPressShareKakaoForFortune, onPressShareMessage, onPressShareMore],
  );

  // 공유 관련 코드 따로 컴포넌트 파서 사용하자..
  const onSharePress = useCallback(
    async (type: SharePlatfromType) => {
      // TODO : 서버에서 받은 값을 넣어줘야겠다.

      console.log('@@@ onSharePress');

      if (type === 'insta' && onShareInsta) {
        onShareInsta();
        return 'insta send success';
      }

      API.Account.lotteryCoupon({
        iccid,
        token,
        prompt: 'image',
      }).then((resp) => {
        console.log('@@@ lotteryCoupon resp : ', resp);

        if (resp.result === 0) {
          const pictureUrl = resp?.objects[0]
            ? resp?.objects[0]?.userPictureUrl
            : '';

          if (pictureUrl) {
            sharePlatform(pictureUrl, type);
          } else {
            uploadImage().then((url) => {
              sharePlatform(url, type);
            });
          }
        }
      });
    },
    [iccid, onShareInsta, sharePlatform, token, uploadImage],
  );

  const renderContentFortune = useCallback(() => {
    return ['kakao', 'sms', 'insta', 'more'].map((type) => (
      <View key={type} style={{alignContent: 'center', rowGap: 6}}>
        <AppSvgIcon
          key={`${type}Icon`}
          onPress={() => onSharePress(type)}
          name={`${type}Icon`}
        />
        <AppText style={[appStyles.normal14Text, {textAlign: 'center'}]}>
          {i18n.t(`cart:share:${type}`)}
        </AppText>
      </View>
    ));
  }, [onSharePress]);

  const renderContent = useCallback(() => {
    return renderContentFortune();
  }, [renderContentFortune]);

  // 나중에 ShareModal 공통된 부분 모아서 컴포넌트로 분리
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
          <View style={styles.contentContainer}>{renderContent()}</View>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};

// export default memo(LotteryShareModal);

export default connect(({product}: RootState) => ({
  product,
}))(LotteryShareModal);
