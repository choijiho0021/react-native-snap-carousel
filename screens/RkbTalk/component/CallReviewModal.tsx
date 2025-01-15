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
  inputText: {
    ...appStyles.medium16,
    lineHeight: 24,
    letterSpacing: -0.16,
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
  onPress: ({
    k,
    star,
    cont,
  }: {
    k: 'ok' | 'next';
    star?: number;
    cont?: string;
  }) => void;
};

const CallReviewModal: React.FC<CallReviewModalProps> = ({
  visible = true,
  onPress,
}) => {
  const [stars, setStars] = useState(0);
  const [focused, setFocused] = useState(false);
  const [msg, setMsg] = useState<string>();
  const keybd = useRef();

  const closed = useCallback(
    ({k, star, cont}: {k: 'ok' | 'next'; star?: number; cont?: string}) => {
      Keyboard.dismiss();
      onPress({k, star, cont});
      setMsg(undefined);
      setFocused(false);
      setStars(0);
    },
    [onPress],
  );

  const head = useCallback(() => {
    return (
      <View style={styles.headView}>
        <AppText style={styles.headTitle}>
          {i18n.t('talk:review:modal:title')}
        </AppText>
      </View>
    );
  }, []);

  const starRow = useCallback(
    () => (
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((s) => (
          <AppButton
            key={s}
            checked={s <= stars}
            style={{marginHorizontal: 6}}
            iconName="btnStar"
            onPress={() => setStars(s)}
          />
        ))}
      </View>
    ),
    [stars],
  );

  const content = useCallback(
    () => (
      <AppTextInput
        containerStyle={{
          ...styles.inputBox,
          borderColor: msg ? colors.clearBlue : colors.lightGrey,
        }}
        style={styles.inputText}
        ref={keybd}
        placeholder={i18n.t('talk:review:modal:placeholder')}
        placeholderTextColor={colors.greyish}
        multiline
        numberOfLines={8}
        enablesReturnKeyAutomatically
        clearTextOnFocus={false}
        maxLength={500}
        onEndEditing={() => Keyboard.dismiss()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChangeText={(v) => {
          setMsg(v);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        value={msg}
      />
    ),
    [msg],
  );

  const buttons = useCallback(() => {
    return (
      <>
        <AppButton
          style={styles.okButton}
          disabled={stars === 0}
          disableColor={colors.greyish}
          disableBackgroundColor={colors.lightGrey}
          titleStyle={{
            ...appStyles.normal18Text,
            lineHeight: 26,
            color: stars > 0 ? colors.white : colors.lightGrey,
          }}
          title={i18n.t('ok')}
          onPress={() => closed({k: 'ok', star: stars, cont: msg})}
        />
        <AppButton
          style={styles.nextButton}
          titleStyle={{
            ...appStyles.bold16Text,
            lineHeight: 24,
            color: colors.black,
          }}
          title={i18n.t('talk:review:modal:next')}
          onPress={() => closed({k: 'next'})}
        />
      </>
    );
  }, [closed, msg, stars]);

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
        {starRow()}
        {content()}
        {buttons()}
      </Pressable>
    </AnimatedModal>
  );
};

// export default memo(CallReviewModal);

export default connect(({product}: RootState) => ({
  product,
}))(CallReviewModal);
