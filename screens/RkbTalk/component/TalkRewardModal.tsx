import React, {useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppStyledText from '@/components/AppStyledText';

import Env from '@/environment';
import AppButton from '@/components/AppButton';
import {useNavigation} from '@react-navigation/native';
import AppModal from '@/components/AppModal';
import AppIcon from '@/components/AppIcon';

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
  modalButtonTitle: {
    ...appStyles.medium18,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },
});

type TalkRewardModalProps = {
  visible: boolean;
  onClick: () => void;
};

const TalkRewardModal: React.FC<TalkRewardModalProps> = ({
  visible,
  onClick,
}) => {
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
        </AppText>
      </View>
    );
  }, []);

  return (
    <AppModal
      type={'division'}
      safeAreaColor="rgba(0,0,0,0.8)"
      topClose={
        <View style={{width: '90%', marginBottom: 24}}>
          <View
            style={{
              marginHorizontal: -10,
              paddingTop: 40,
              alignSelf: 'flex-end',
            }}>
            <Pressable
              onPress={() => {
                onClick();
              }}
              style={{
                borderColor: colors.white,
                borderWidth: 2,
                borderRadius: 100,
              }}>
              <AppIcon name="boldCancel" />
            </Pressable>
          </View>
        </View>
      }
      contentStyle={{
        // marginHorizontal: 20,
        width: '80%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 120, // close btn area
      }}
      bottom={() => (
        <View
          style={{
            height: 92,
            marginTop: 50,
            width: '100%',
          }}>
          <AppButton
            style={{
              height: 52,
              backgroundColor: colors.clearBlue,
            }}
            type="primary"
            onPress={() => {
              navigation.navigate('TalkReward');
              onClick();
            }}
            title={'자세히 보기'}
            titleStyle={[styles.modalButtonTitle]}
          />
        </View>
      )}
      onOkClose={async () => {
        console.log('@@@@@@ ');
      }}
      onCancelClose={() => {
        console.log('@@@@@@');
      }}
      visible={visible}>
      <View>
        <AppStyledText
          text={'로깨비톡 런칭 기념\n<b>0,000 톡포인트</b>가 도착했어요.'}
          textStyle={[appStyles.bold22Text, {color: colors.white}]}
          format={{b: {color: colors.redBold}}}
        />

        <View style={{marginTop: 30}}>
          <AppStyledText
            text={
              '해외 여행 중에도 <b>30분간 무료 통화</b>에요!\n(한국 발신 기준)'
            }
            textStyle={[appStyles.normal16Text, {color: colors.white}]}
            format={{b: [appStyles.bold16Text, {color: colors.redBold}]}}
          />
          <AppText style={{backgroundColor: 'red', marginTop: 30}}>
            아이콘 위치
          </AppText>
        </View>
      </View>
    </AppModal>
  );
};

// export default memo(TalkRewardModal);

export default TalkRewardModal;
