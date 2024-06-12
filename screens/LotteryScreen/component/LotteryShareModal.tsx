import React, {useCallback, useState} from 'react';
import {
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Share, {ShareOptions, ShareSingleOptions} from 'react-native-share';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import RNFetchBlob from 'rn-fetch-blob';
import ViewShot from 'react-native-view-shot';
import AppSvgIcon from '@/components/AppSvgIcon';
import {API} from '@/redux/api';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import i18n from '@/utils/i18n';
import Env from '@/environment';
import AppText from '@/components/AppText';

import KakaoSDK from '@/components/NativeModule/KakaoSDK';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {AccountModelState, Fortune} from '@/redux/modules/account';
import {utils} from '@/utils/utils';

const {isProduction, webViewHost, isIOS} = Env.get();

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
    paddingBottom: 28,
    gap: 6,
    marginTop: isIOS ? 20 : 0,
  },
  contentContainer: {
    paddingBottom: 48,

    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  const uploadImage = useCallback(async () => {
    const uri = await captureRef.current?.capture?.();

    try {
      const convertImage = await utils.convertFileURLtoRkbImage(uri || '');

      // image upload
      const resp = await API.Account.uploadFortuneImage({
        image: convertImage,
        user: mobile,
        token,
      });

      if (resp?.result === 0) {
        const serverImageUrl = resp?.objects[0]?.userPictureUrl;

        // fortune Image 필드 갱신
        const setImageResp = await API.Account.lotteryCoupon({
          iccid,
          token,
          prompt: 'image',
          fid: parseInt(resp?.objects[0]?.fid, 10), // ref_fortune 값에 넣을 데이터, imageUrl은 리덕스 처리해야하나...
        });

        if (setImageResp?.result !== 0) {
          console.log('@@@ 전송 에러 ');
        }

        return serverImageUrl;
      }
    } catch (e) {
      console.log('@@@ uploadImage Fail : ', e);
    }

    return '';
  }, [iccid, mobile, captureRef, token]);

  const getBase64 = useCallback((imgLink: string) => {
    return RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', imgLink)
      .then((resp) => {
        return resp.readFile('base64');
      })
      .then(async (base64Data) => {
        const base64Image = `data:image/jpeg;base64,${base64Data}`;

        return base64Image;
      });
  }, []);

  const onPressShare = useCallback(
    async (
      type: 'single' | 'open',
      imgLink: string,
      shareOptions: ShareOptions | ShareSingleOptions,
    ) => {
      getBase64(imgLink).then(async (base64) => {
        try {
          if (type === 'single') {
            Share.shareSingle({...shareOptions, url: base64});
          } else if (type === 'open') {
            Share.open({...shareOptions, url: base64});
          }
        } catch (e) {
          console.log('@@@@ share error : ', e);
        }
      });
    },
    [getBase64],
  );

  const onPressShareMessage = useCallback(
    (imgLink: string) => {
      onPressShare('single', imgLink, {
        social: Share.Social.SMS,
        message: i18n.t('esim:lottery:share:desc'),
        recipient: '',
      });
    },

    [onPressShare],
  );
  const onPressShareMore = useCallback(
    (imgLink: string) => {
      onPressShare('open', imgLink, {
        message: i18n.t('esim:lottery:share:desc'),
        failOnCancel: false,
      });
    },
    [onPressShare],
  );

  // TODO : Share 관련된 것만 따로 뺼 것
  const onPressShareKakaoForFortune = useCallback(
    async (link: string, imgUrl: string) => {
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

      //  kakao 때만 동적 링크 필요
      if (type === 'kakao') {
        const link = `${webViewHost}${
          isProduction
            ? '?linkPath=LPjf&recommender=202d3f20-6a53-44ee-8c07-5532abc8583a'
            : '?linkPath=ozCS&recommender=411d33bb-0bb6-4244-9b01-d5309233229f'
        }`;

        return API.Promotion.buildLinkFortune({
          imageUrl: serverImageUrl || '',
          link,
          desc: i18n.t('esim:lottery:share:desc'),
        }).then(async (url) => {
          console.log('@@@ 만들어진 url 링크 확인 : ', url);
          onPressShareKakaoForFortune(url, serverImageUrl || '');
        });
      }

      if (type === 'more') {
        onPressShareMore(serverImageUrl);
      }

      if (type === 'sms') {
        onPressShareMessage(serverImageUrl);
      }
    },
    [onPressShareKakaoForFortune, onPressShareMessage, onPressShareMore],
  );

  const onSharePress = useCallback(
    async (type: SharePlatfromType) => {
      if (type === 'insta' && onShareInsta) {
        onShareInsta();
        return 'insta send success';
      }

      return API.Account.lotteryCoupon({
        iccid,
        token,
        prompt: 'image',
      }).then((resp) => {
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
      <View key={type} style={{justifyContent: 'center'}}>
        <Pressable onPress={() => onSharePress(type as SharePlatfromType)}>
          <View style={{height: 80, rowGap: 6, alignContent: 'center'}}>
            <AppSvgIcon key={`${type}Icon`} name={`${type}Icon`} />
            <AppText style={[appStyles.normal14Text, {textAlign: 'center'}]}>
              {i18n.t(`cart:share:${type}`)}
            </AppText>
          </View>
        </Pressable>
      </View>
    ));
  }, [onSharePress]);

  // 나중에 ShareModal 공통된 부분 모아서 컴포넌트로 분리
  return (
    <Modal visible={visible} transparent>
      <Pressable
        style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
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
          <View style={styles.contentContainer}>{renderContentFortune()}</View>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};

// export default memo(LotteryShareModal);

export default connect(({product}: RootState) => ({
  product,
}))(LotteryShareModal);
