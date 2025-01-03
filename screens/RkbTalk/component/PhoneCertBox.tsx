import React, {useMemo} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppStyledText from '@/components/AppStyledText';
import i18n from '@/utils/i18n';

import AppButton from '@/components/AppButton';
import {useNavigation} from '@react-navigation/native';

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
    height: 500,
    bottom: 0,
    width: '100%',
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

type PhoneCertBoxProps = {};

const PhoneCertBox: React.FC<PhoneCertBoxProps> = ({}) => {
  const navigation = useNavigation();

  const title = useMemo(() => {
    return (
      <View
        style={{
          paddingVertical: 24,
          height: 108,
        }}>
        <AppText style={[appStyles.bold24Text, {lineHeight: 30}]}>
          {i18n.t('talk:modal:title')}
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
            text={i18n.t('talk:modal:body')}
            textStyle={[
              appStyles.medium16,
              {color: colors.black, lineHeight: 24, letterSpacing: -0.16},
            ]}
            format={{b: [appStyles.bold16Text, {color: colors.clearBlue}]}}
          />
          <AppStyledText
            text={i18n.t('talk:modal:info')}
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
          title={i18n.t('talk:modal:btn')}
          onPress={() => {
            navigation.navigate('AuthGateway');
          }}
        />
      </View>
    );
  }, [navigation]);

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
