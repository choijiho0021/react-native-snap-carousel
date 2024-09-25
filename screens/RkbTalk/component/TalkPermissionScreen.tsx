import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import {HomeStackParamList} from '@/navigation/navigation';
import AppIcon from '@/components/AppIcon';

const styles = StyleSheet.create({
  modalButtonTitle: {
    ...appStyles.medium18,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },
});

type TalkPermissionScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'TalkPermission'
>;

type TalkPermissionScreenRouteProp = RouteProp<
  HomeStackParamList,
  'TalkPermission'
>;

type TalkPermissionScreenProps = {
  navigation: TalkPermissionScreenNavigationProp;
  route: TalkPermissionScreenRouteProp;
};

const TalkPermissionScreen: React.FC<TalkPermissionScreenProps> = ({
  navigation,
}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        // justifyContent: 'space-around',
      }}>
      <View style={{marginHorizontal: 20, flex: 1}}>
        <View style={{gap: 8, marginTop: 80}}>
          <AppText style={[appStyles.normal18Text, {color: colors.clearBlue}]}>
            {i18n.t(`talk:permission:title`)}
          </AppText>

          <AppText style={[appStyles.bold24Text, {color: colors.black}]}>
            {i18n.t(`talk:permission:body`)}
          </AppText>
        </View>

        <View style={{marginTop: 48}}>
          <AppText style={[appStyles.bold16Text, {color: colors.gray2}]}>
            {i18n.t(`talk:permission:choice`)}
          </AppText>

          <View style={{paddingLeft: 15, marginTop: 12, gap: 12}}>
            {['book', 'mic'].map((name) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 15,
                    paddingVertical: 12,
                  }}>
                  <AppIcon name={`${name}Icon`} />
                  <View>
                    <AppText style={[appStyles.normal18Text, {lineHeight: 26}]}>
                      {i18n.t(`talk:permission:${name}`)}
                    </AppText>
                    <AppText
                      style={[
                        appStyles.normal14Text,
                        {color: colors.warmGrey, lineHeight: 22},
                      ]}>
                      {i18n.t(`talk:permission:${name}:body`)}
                    </AppText>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={{flexDirection: 'row'}}>
        <AppButton
          style={{
            height: 52,
            backgroundColor: colors.clearBlue,
            flex: 1,
          }}
          type="primary"
          onPress={() => {
            navigation.goBack();
          }}
          title={'확인' || i18n.t('talk:reward:btn')}
          titleStyle={[styles.modalButtonTitle]}
        />
      </View>
    </SafeAreaView>
  );
};

// export default memo(TalkPermissionScreen);

export default TalkPermissionScreen;
