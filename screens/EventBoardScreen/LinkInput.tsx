import React, {memo, useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {useDispatch} from 'react-redux';
import AppTextInput from '@/components/AppTextInput';
import AppSvgIcon from '@/components/AppSvgIcon';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {actions as modalActions} from '@/redux/modules/modal';
import AppModalContent from '@/components/ModalContent/AppModalContent';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  link: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  attachTitle: {
    marginTop: 32,
    marginBottom: 8,
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  essentialText: {
    ...appStyles.bold12Text,
    color: colors.redError,
    lineHeight: 20,
    marginLeft: 3,
  },
  attachTitleText: {
    ...appStyles.semiBold14Text,
    lineHeight: 20,
  },
  inputBox: {
    ...appStyles.normal14Text,
    marginHorizontal: 20,
    height: 56,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    color: colors.black,
    paddingHorizontal: 16,
  },
  linkInputBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addText: {
    ...appStyles.bold14Text,
    marginLeft: 4,
    color: colors.clearBlue,
  },
  minusBtn: {
    backgroundColor: colors.backGrey,
    borderRadius: 3,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  modalText: {
    ...appStyles.normal16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.warmGrey,
  },
  modalBoldText: {
    ...appStyles.semiBold16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.black,
  },
  addLinkBtn: {
    marginTop: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    alignItems: 'center',
  },
});

type LinkInputProps = {
  value: string[];
  onChangeValue: (v: string[]) => void;
  required?: boolean;
};

const LinkInput: React.FC<LinkInputProps> = ({
  value,
  onChangeValue,
  required = false,
}) => {
  const [linkList, setLinkList] = useState(['']);
  const [linkCount, setLinkCount] = useState(1);
  const [focusedItem, setFocusedItem] = useState<number | undefined>();
  const dispatch = useDispatch();

  useEffect(() => {
    setLinkList(value);
    setLinkCount(value.length);
  }, [value]);

  const changeList = useCallback(
    (idx: number, v: string) => {
      setLinkList((prev) => {
        const a = prev.map((p, i) => (i === idx ? v : p));
        onChangeValue(a);
        return a;
      });
    },
    [onChangeValue],
  );

  const deleteLink = useCallback(
    (idx: number) => {
      setLinkList((prev) => {
        const a = prev.filter((l, index) => index !== idx);
        onChangeValue(a);
        return a;
      });
    },
    [onChangeValue],
  );

  const addLinkInput = useCallback(() => {
    if (linkCount < 3) {
      setLinkList((prev) => {
        const a = prev.concat('');
        onChangeValue(a);
        return a;
      });
      setLinkCount((prev) => prev + 1);
    } else {
      dispatch(
        modalActions.renderModal(() => (
          <AppModalContent
            type="info"
            onOkClose={() => dispatch(modalActions.closeModal())}>
            <View style={{marginLeft: 30}}>
              <AppStyledText
                text={i18n.t('event:alert:link')}
                textStyle={styles.modalText}
                format={{b: styles.modalBoldText}}
              />
            </View>
          </AppModalContent>
        )),
      );
    }
  }, [dispatch, linkCount, onChangeValue]);

  return (
    <View>
      <View style={styles.link}>
        <View
          style={[
            styles.attachTitle,
            {marginTop: 0, marginBottom: 0, marginHorizontal: 0},
          ]}>
          <AppText style={styles.attachTitleText}>{i18n.t('link')}</AppText>
          {required && (
            <AppText style={styles.essentialText}>
              {i18n.t('event:essential')}
            </AppText>
          )}
        </View>

        <Pressable
          style={[styles.attachTitle, styles.addLinkBtn]}
          onPress={addLinkInput}>
          <AppSvgIcon name="plusBlue" />
          <AppText style={styles.addText}>{i18n.t('event:add')}</AppText>
        </Pressable>
      </View>
      {linkList.map((cur, idx) =>
        idx < linkCount ? (
          <View style={{display: 'flex', flexDirection: 'row'}} key={idx}>
            <View
              style={[
                styles.inputBox,
                styles.linkInputBox,
                idx < linkCount - 1 ? {marginBottom: 8} : undefined,
                idx > 0 ? {marginRight: 8} : undefined,
                focusedItem === idx
                  ? {
                      borderColor: colors.clearBlue,
                    }
                  : undefined,
              ]}>
              <AppTextInput
                // autoFocus={idx > 0}
                style={{flex: 1, height: 56}}
                maxLength={1000}
                onChangeText={(v) => {
                  changeList(idx, v);
                }}
                value={linkList[idx]}
                enablesReturnKeyAutomatically
                clearTextOnFocus={false}
                onFocus={() => {
                  setFocusedItem(idx);
                }}
                onBlur={() => {
                  setFocusedItem(undefined);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={i18n.t('event:input:link')}
                placeholderTextColor={colors.greyish}
              />
              {linkList[idx].length > 0 && (
                <AppSvgIcon
                  style={{marginLeft: 10}}
                  name={idx === focusedItem ? 'circleX' : 'x'}
                  onPress={() => changeList(idx, '')}
                />
              )}
            </View>
            {idx > 0 && (
              <Pressable
                style={styles.minusBtn}
                onPress={() => {
                  setLinkCount((prev) => prev - 1);
                  if (focusedItem === idx) setFocusedItem(undefined);
                  deleteLink(idx);
                }}>
                <AppSvgIcon name="minus16" />
              </Pressable>
            )}
          </View>
        ) : undefined,
      )}
    </View>
  );
};

export default memo(LinkInput);
