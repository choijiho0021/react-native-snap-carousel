import {RootState} from '@reduxjs/toolkit';
import React, {useCallback, useRef, useState} from 'react';
import {Keyboard, Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import AppTextInput from '@/components/AppTextInput';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AnimatedModal from './AnimatedModal';

const styles = StyleSheet.create({
  storeBox: {
    backgroundColor: colors.white,
    height: 396,
    width: '100%',
  },
  modalMargin: {
    marginHorizontal: 20,
    marginTop: 32,
  },
  headView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headTitle: {
    ...appStyles.bold20Text,
    lineHeight: 30,
    textAlignVertical: 'center',
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 38,
    marginTop: 24,
    marginBottom: 28,
  },
  inputBox: {
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
});

type CallReviewModalProps = {
  visible: boolean;
  onPress: () => void;
};

const CallReviewModal: React.FC<CallReviewModalProps> = ({
  visible = true,
  onPress,
}) => {
  const [star, setStar] = useState(0);
  const [focused, setFocused] = useState(false);
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
    <AnimatedModal
      containerStyle={styles.storeBox}
      innerRadius={8}
      keyboardFocused={focused}
      bottomColor={colors.white}
      animationType="slide"
      visible={visible}
      onClose={() => Keyboard.dismiss()}>
      <Pressable style={styles.modalMargin} onPress={() => Keyboard.dismiss()}>
        {head()}
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <AppButton
              checked={s <= star}
              style={{marginHorizontal: 6}}
              iconName="btnStar"
              onPress={() => setStar(s)}
            />
          ))}
        </View>
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
          enablesReturnKeyAutomatically
          clearTextOnFocus={false}
          maxLength={2000}
          onEndEditing={() => Keyboard.dismiss()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChangeText={(v) => {
            setMsg(v);
            // validate('msg', v);
          }}
          // error={error('msg')}
          autoCapitalize="none"
          autoCorrect={false}
          value={msg}
        />
        <>
          <AppButton
            style={styles.okButton}
            disabled={star === 0}
            disableColor={colors.greyish}
            disableBackgroundColor={colors.lightGrey}
            titleStyle={{
              ...appStyles.normal18Text,
              lineHeight: 26,
              color: star > 0 ? colors.white : colors.lightGrey,
            }}
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
        </>
      </Pressable>
    </AnimatedModal>
  );
};

// export default memo(CallReviewModal);

export default connect(({product}: RootState) => ({
  product,
}))(CallReviewModal);
