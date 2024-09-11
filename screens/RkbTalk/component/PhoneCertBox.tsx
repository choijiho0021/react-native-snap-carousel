import React, {useMemo} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppBottomModal from '@/screens/DraftUsScreen/component/AppBottomModal';
import AppStyledText from '@/components/AppStyledText';
import i18n from '@/utils/i18n';

import Env from '@/environment';
import AppButton from '@/components/AppButton';
import AppAuthGateway from './AuthGateway';
import {useNavigation} from '@react-navigation/native';

const {isIOS} = Env.get();

const styles = StyleSheet.create({
  bodyBox: {
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
  storeBox: {
    position: 'absolute',
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderColor: colors.line,
    shadowColor: colors.black8,
    height: 480,
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
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 6,
  },
});

type PhoneCertBoxProps = {
  onClickButton: (val) => void;
};

const PhoneCertBox: React.FC<PhoneCertBoxProps> = ({onClickButton}) => {
  const navigation = useNavigation();

  const title = useMemo(() => {
    return (
      <View
        style={{
          paddingVertical: 24,
          height: 108,
        }}>
        <AppText style={[appStyles.bold24Text, {lineHeight: 30}]}>
          {`데이터만 있으면\n언제 어디서든 톡톡!`}
          {/* {i18n.t('"데이터만 있으면\n언제 어디서든 톡톡!"')} */}
        </AppText>
      </View>
    );
  }, []);

  const body = useMemo(() => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}>
        <View style={{marginBottom: 48, gap: 8}}>
          <AppStyledText
            text={`<b>휴대폰 본인인증</b>\n로깨비톡 이용을 위해 본인 인증이 필요해요.`}
            textStyle={[
              appStyles.medium16,
              {color: colors.black, lineHeight: 24, letterSpacing: -0.16},
            ]}
            format={{b: [appStyles.bold16Text, {color: colors.clearBlue}]}}
          />
          <AppStyledText
            text={'로그아웃 시 인증 정보는 초기화됩니다.'}
            textStyle={[appStyles.semiBold14Text, {color: colors.gray2}]}
          />
          <Image
            style={{alignSelf: 'center', marginTop: 28}}
            source={require('@/assets/images/rkbtalk/imgVerification.png')}
            resizeMode="stretch"
          />
        </View>
        <AppButton
          style={{
            width: '100%',
            alignItems: 'center',
            height: 52,
            backgroundColor: colors.blue,
          }}
          title="인증하기"
          onPress={() => {
            // onClickButton('test');
            // setVisible(false);
            navigation.navigate('AuthGateway', {});
          }}
        />
      </View>
    );
  }, []);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView key="modal" style={[styles.storeBox]}>
        {title && (
          <View style={[styles.head]}>
            <AppText style={appStyles.bold18Text}>{title}</AppText>
          </View>
        )}
        {body}
      </SafeAreaView>
    </View>
  );
};

// export default memo(PhoneCertBox);

export default connect(({product}: RootState) => ({
  product,
}))(PhoneCertBox);
