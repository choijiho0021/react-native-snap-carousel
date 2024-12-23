import {RootState} from '@reduxjs/toolkit';
import React, {useCallback, useRef, useState} from 'react';
import {InputAccessoryView, SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import _ from 'underscore';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppTextInput from '@/components/AppTextInput';
import Env from '@/environment';

const {isIOS} = Env.get();

const styles = StyleSheet.create({
  storeBox: {
    position: 'absolute',
    paddingTop: 32,
    paddingBottom: 40,
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderColor: colors.line,
    shadowColor: colors.black8,
    height: 396,
    bottom: 0,
    width: '100%',
  },
  modalMargin: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 32,
  },
  headView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 24,
  },
  headTitle: {
    ...appStyles.bold20Text,
    lineHeight: 30,
    textAlignVertical: 'center',
  },
  starRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputBox: {
    marginTop: 28,
    height: 128,
    borderRadius: 3,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    marginBottom: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    textAlignVertical: 'top',
  },
  okButton: {
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.blue,
  },
  nextButton: {
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.white,
  },
  inputAccessory: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: colors.lightGrey,
    padding: 5,
  },
  inputAccessoryText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    margin: 5,
  },
});

type CallReviewModalProps = {
  onPress: () => void;
};

const inputAccessoryViewID = 'doneKbd';
const CallReviewModal: React.FC<CallReviewModalProps> = ({onPress}) => {
  const [star, setStar] = useState(0);
  const [msg, setMsg] = useState<string>();
  const keybd = useRef();

  const head = useCallback(() => {
    return (
      <View style={styles.headView}>
        <AppText style={styles.headTitle}>
          {i18n.t('talk:review:modal:title')}
        </AppText>
      </View>
    );
  }, []);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView key="modal" style={styles.storeBox}>
        <KeyboardAwareScrollView
          enableOnAndroid
          showsVerticalScrollIndicator={false}
          extraScrollHeight={isIOS ? -100 : -300}>
          <View style={styles.modalMargin}>
            {head()}
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <AppButton
                  checked={s <= star}
                  style={{marginHorizontal: 6}}
                  iconName="btnStar"
                  onPress={() => setStar((prev) => (prev === s ? 0 : s))}
                />
              ))}
            </View>
            <View style={{}} />
            <AppTextInput
              style={[
                styles.inputBox,
                msg ? {borderColor: colors.clearBlue} : undefined,
              ]}
              ref={keybd}
              placeholder={i18n.t('talk:review:modal:placeholder')}
              placeholderTextColor={colors.greyish}
              multiline
              numberOfLines={8}
              inputAccessoryViewID={inputAccessoryViewID}
              enablesReturnKeyAutomatically
              clearTextOnFocus={false}
              maxLength={2000}
              onChangeText={(v) => {
                setMsg(v);
                // validate('msg', v);
              }}
              // onFocus={() => setExtraHeight(80)}
              // error={error('msg')}
              autoCapitalize="none"
              autoCorrect={false}
              // onContentSizeChange={({target}) =>
              //   scrollRef.current?.props?.scrollToFocusedInput(
              //     findNodeHandle(target),
              //   )
              // }
              value={msg}
            />
            <AppButton
              style={styles.okButton}
              disabled
              disableColor={colors.greyish}
              disableBackgroundColor={colors.lightGrey}
              title={i18n.t('ok')}
              onPress={onPress}
            />
            <AppButton
              style={styles.nextButton}
              titleStyle={{
                ...appStyles.bold16Text,
                lineHeight: 24,
                color: colors.black,
              }}
              title={i18n.t('talk:review:modal:next')}
              onPress={onPress}
            />
          </View>
          {isIOS ? (
            <InputAccessoryView nativeID={inputAccessoryViewID}>
              <AppButton
                style={styles.inputAccessory}
                title={i18n.t('done')}
                titleStyle={[
                  styles.inputAccessoryText,
                  {color: _.isEmpty(msg) ? colors.white : colors.blue},
                ]}
                onPress={() => keybd.current?.blur()}
              />
            </InputAccessoryView>
          ) : null}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
};

// export default memo(CallReviewModal);

export default connect(({product}: RootState) => ({
  product,
}))(CallReviewModal);
