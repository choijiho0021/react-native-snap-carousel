import React, {memo, useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppText from '../AppText';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppButton from '../AppButton';
import AppIcon from '../AppIcon';
import PymButtonList from './PymButtonList';
import AppTextInput from '../AppTextInput';
import {PaymentParams} from '@/navigation/navigation';
import DropDownHeader from '@/screens/PymMethodScreen/DropDownHeader';
import AppSvgIcon from '../AppSvgIcon';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    ...appStyles.bold16Text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ccard: {
    height: 48,
    width: '100%',
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  input: {
    height: 44,
    borderColor: colors.gray,
    borderWidth: 1,
    color: colors.black,
  },
});

const DropDownButton0 = ({
  title,
  disabled = false,
  onPress,
}: {
  title: string;
  disabled?: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable style={styles.ccard} disabled={disabled} onPress={onPress}>
      <AppText
        style={{
          ...appStyles.medium16,
          color: disabled ? colors.greyish : colors.black,
        }}>
        {title}
      </AppText>
      <AppSvgIcon name="dropDownToggle" focused />
    </Pressable>
  );
};

const DropDownButton = memo(DropDownButton0);

export type PymMethodRef = {
  getExtraInfo: () => PaymentParams['receipt'];
};

type PymMethodProps = {
  value: string;
  onPress: (kind: string) => void;
  pymMethodRef: React.MutableRefObject<PymMethodRef | null>;
};

const PymMethod: React.FC<PymMethodProps> = ({
  value,
  onPress,
  pymMethodRef,
}) => {
  const [method, setMethod] = useState<'easy' | 'card' | 'vbank'>('easy');
  const [selected, setSelected] = useState('');
  const [idType, setIdType] = useState<'m' | 'c' | 'b'>('m');
  const [id, setId] = useState('');
  const [rcptType, setRcptType] = useState<'p' | 'b' | 'n'>('p');

  console.log('@@@ pym method', value);

  useEffect(() => {
    if (pymMethodRef) {
      pymMethodRef.current = {
        getExtraInfo: () => ({id, idType, type: rcptType}),
      };
    }
  }, [id, idType, pymMethodRef, rcptType]);

  useEffect(() => {
    if (value?.startsWith('card')) setMethod('card');
    else if (value?.startsWith('vbank')) setMethod('vbank');
    else {
      setMethod('easy');
      setSelected(value);
    }
  }, [value]);

  const renderCardButton = useCallback(() => {
    return (
      <View>
        <DropDownButton
          title={i18n.t(
            value?.startsWith('card') ? `pym:${value}` : 'pym:method:card:sel',
          )}
          onPress={() => onPress('card')}
        />
        <View style={{height: 12}} />
        <DropDownButton
          title={i18n.t('pym:method:pay:atonce')}
          disabled={!value?.startsWith('card')}
          onPress={() => onPress('card:duration')}
        />
      </View>
    );
  }, [onPress, value]);

  return (
    <DropDownHeader title={i18n.t('pym:method')}>
      <View style={styles.container}>
        {(['easy', 'card'] as const).map((k, i) => (
          <View key={k} style={{marginBottom: 24}}>
            <Pressable
              style={[
                styles.row,
                {
                  paddingTop: 24,
                  paddingBottom: method === k ? 16 : 0,
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: colors.lightGrey,
                },
              ]}
              onPress={() => {
                setMethod(k);
                if (k === 'easy') onPress(value);
              }}>
              <AppSvgIcon name="btnRadio" focused={method === k} />
              <AppText style={{...appStyles.bold16Text, marginLeft: 6}}>
                {i18n.t(`pym:method:${k}`)}
              </AppText>
            </Pressable>
            {k === method ? (
              k === 'easy' ? (
                <PymButtonList
                  selected={selected}
                  onPress={(m) => {
                    setSelected(m);
                    onPress(m);
                  }}
                />
              ) : k === 'card' ? (
                renderCardButton()
              ) : (
                <View>
                  <AppButton
                    style={styles.ccard}
                    titleStyle={{color: colors.black}}
                    title={i18n.t(
                      value?.startsWith('vbank')
                        ? `pym:${value}`
                        : 'pym:method:vbank:input',
                    )}
                    onPress={() => onPress('vbank')}
                  />
                  <AppText
                    key="title"
                    style={[styles.title, {marginVertical: 10}]}>
                    {i18n.t('pym:vbank:receipt')}
                  </AppText>
                  <View style={[styles.row, {marginVertical: 10}]}>
                    {(['p', 'b', 'n'] as const).map((k) => (
                      <Pressable
                        key={k}
                        style={[styles.row, {flex: 1}]}
                        onPress={() => setRcptType(k)}>
                        <AppIcon name="btnCheck" checked={k === rcptType} />
                        <AppText style={{flex: 1, marginLeft: 5}}>
                          {i18n.t(`pym:vbank:receipt:${k}`)}
                        </AppText>
                      </Pressable>
                    ))}
                  </View>
                  <AppText style={styles.title}>
                    {i18n.t('pym:vbank:receipt')}
                  </AppText>
                  <AppTextInput
                    style={styles.input}
                    value={id}
                    onChangeText={setId}
                  />
                </View>
              )
            ) : null}
          </View>
        ))}
      </View>
    </DropDownHeader>
  );
};

export default memo(PymMethod);
