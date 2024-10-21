import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootState} from '@reduxjs/toolkit';
import React, {useCallback} from 'react';
import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {actions as talkActions, TalkAction} from '@/redux/modules/talk';
import i18n from '@/utils/i18n';

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

  action: {
    talk: TalkAction;
  };
};

const TalkPermissionScreen: React.FC<TalkPermissionScreenProps> = ({
  navigation,
  action,
}) => {
  const onClick = useCallback(async () => {
    const permissions =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.MICROPHONE, PERMISSIONS.IOS.CONTACTS]
        : [PERMISSIONS.ANDROID.RECORD_AUDIO, PERMISSIONS.ANDROID.READ_CONTACTS];

    const statuses = await requestMultiple(permissions);

    console.log(
      'MICROPHONE, CONTACTS :',
      permissions.map((r) => statuses[r]),
    );

    navigation.goBack();
    action.talk.updateTooltip(true);
  }, [action.talk, navigation]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View style={{marginHorizontal: 20, flex: 1}}>
        <View style={{gap: 8, marginTop: 80}}>
          <AppText style={[appStyles.normal18Text, {color: colors.clearBlue}]}>
            {i18n.t(`talk:permission:title`)}
          </AppText>

          <AppText
            style={[
              appStyles.bold24Text,
              {color: colors.black, lineHeight: 28},
            ]}>
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
            onClick();
          }}
          title={i18n.t('talk:permission:btn')}
          titleStyle={[styles.modalButtonTitle]}
        />
      </View>
    </SafeAreaView>
  );
};

export default connect(
  ({account, talk}: RootState) => ({
    account,
    talk,
  }),
  (dispatch) => ({
    action: {
      talk: bindActionCreators(talkActions, dispatch),
    },
  }),
)(TalkPermissionScreen);
