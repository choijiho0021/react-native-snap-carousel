import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
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
import {Currency} from '@/redux/api/productApi';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingBottom: 24,
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
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
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
      <AppSvgIcon name="dropDownToggle" focused={!disabled} />
    </Pressable>
  );
};

const DropDownButton = memo(DropDownButton0);

export type PymMethodRef = {
  getExtraInfo: () => PaymentParams['receipt'];
  getIsSave: () => boolean;
};

type PymMethodProps = {
  value: string;
  installmentMonths?: string;
  onPress: (kind: string) => void;
  pymMethodRef: React.MutableRefObject<PymMethodRef | null>;
  price: Currency;
};

const PymMethod: React.FC<PymMethodProps> = ({
  value,
  installmentMonths,
  onPress,
  pymMethodRef,
  price = {value: 0, currency: 'KRW'},
}) => {
  const [method, setMethod] = useState<'easy' | 'card' | 'vbank'>('easy');
  const [selected, setSelected] = useState('');
  const [isSave, setIsSave] = useState(true);
  const [idType, setIdType] = useState<'m' | 'c' | 'b'>('m');
  const [id, setId] = useState('');
  const [rcptType, setRcptType] = useState<'p' | 'b' | 'n'>('p');
  const disabled = useMemo(
    () => price.currency === 'KRW' && price.value <= 0,
    [price.currency, price.value],
  );

  useEffect(() => {
    if (pymMethodRef) {
      pymMethodRef.current = {
        getExtraInfo: () => ({id, idType, type: rcptType}),
        getIsSave: () => isSave,
      };
    }
  }, [id, idType, isSave, pymMethodRef, rcptType]);

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
            value?.startsWith('card') ? `pym:${value}` : `pym:card:noSelect`,
          )}
          onPress={disabled ? () => {} : () => onPress('card')}
        />
        <View style={{height: 12}} />

        <DropDownButton
          title={
            (installmentMonths || '0') === '0'
              ? i18n.t('pym:pay:atonce')
              : installmentMonths + i18n.t('pym:duration')
          }
          disabled={
            disabled ||
            (price?.currency === 'KRW' && (price?.value || 0) < 50000) ||
            !value?.startsWith('card')
          }
          onPress={() => onPress('installmentMonths')}
        />
      </View>
    );
  }, [
    disabled,
    installmentMonths,
    onPress,
    price?.currency,
    price?.value,
    value,
  ]);

  const renderVBankButton = useCallback(() => {
    return (
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
        <AppText key="title" style={[styles.title, {marginVertical: 10}]}>
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
        <AppText style={styles.title}>{i18n.t('pym:vbank:receipt')}</AppText>
        <AppTextInput style={styles.input} value={id} onChangeText={setId} />
      </View>
    );
  }, [id, onPress, rcptType, value]);

  return (
    <DropDownHeader
      title={i18n.t('pym:method')}
      summary={
        disabled
          ? ''
          : i18n.t(value.startsWith('card') ? `pym:${value}` : value)
      }>
      <View style={styles.container}>
        {(['easy', 'card'] as const).map((k, i) => (
          <View key={k} style={{marginBottom: 24}}>
            <Pressable
              style={[
                styles.row,
                {
                  paddingTop: 24,
                  paddingBottom: !disabled && method === k ? 16 : 0,
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: colors.lightGrey,
                },
              ]}
              onPress={() => {
                if (k !== method) {
                  setMethod(k);
                  if (k === 'easy') {
                    onPress('pym:kakao');
                  } else if (k === 'card') {
                    onPress('card:noSelect');
                  }
                }
              }}>
              <AppSvgIcon name="btnRadio" focused={!disabled && method === k} />
              <AppText style={{...appStyles.bold16Text, marginLeft: 6}}>
                {i18n.t(`pym:method:${k}`)}
              </AppText>
            </Pressable>
            {!disabled && k === method ? (
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
                renderVBankButton()
              )
            ) : null}
          </View>
        ))}
        <Pressable
          style={styles.rowCenter}
          disabled={disabled}
          onPress={() => {
            setIsSave((pre) => !pre);
          }}>
          <AppIcon name="btnCheck3" checked={isSave && !disabled} size={22} />
          <AppText style={[appStyles.normal16Text, {marginLeft: 6}]}>
            {i18n.t('pym:saveMethod')}
          </AppText>
        </Pressable>
      </View>
    </DropDownHeader>
  );
};

export default memo(PymMethod);
