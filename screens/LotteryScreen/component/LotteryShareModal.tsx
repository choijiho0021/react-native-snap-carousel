import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  Linking,
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

type LotteryShareModalProps = {
  visible: boolean;
  onClose: () => void;
  purchaseItem?: PurchaseItem;
  onShareInsta?: () => void;
  onPress?: (type: SharePlatfromType) => Promise<string>;
};

const LotteryShareModal: React.FC<LotteryShareModalProps> = ({
  visible,
  onClose,
  onPress,
}) => {
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
  const renderContentFortune = useCallback(() => {
    return ['kakao', 'sms', 'insta', 'more'].map((type) => (
      <View key={type} style={{alignContent: 'center', rowGap: 6}}>
        <AppSvgIcon
          key={`${type}Icon`}
          onPress={() => {
            setIsShareDisabled(true);

            if (onPress) {
              onPress(type).then((url) => {
                console.log('@@@ url : ', url);
                if (type === 'more') {
                  onPressShareMore(url);
                }
              });
            }
          }}
          name={`${type}Icon`}
        />
        <AppText style={[appStyles.normal14Text, {textAlign: 'center'}]}>
          {i18n.t(`cart:share:${type}`)}
        </AppText>
      </View>
    ));
  }, [onPress, onPressShareMore]);

  const renderContent = useCallback(() => {
    return renderContentFortune();
  }, [renderContentFortune]);

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
            {renderContent()}
          </View>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};

// export default memo(LotteryShareModal);

export default connect(({product}: RootState) => ({
  product,
}))(LotteryShareModal);
