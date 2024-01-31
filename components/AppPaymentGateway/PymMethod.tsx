import React, {memo, useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppText from '../AppText';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppButton from '../AppButton';
import AppIcon from '../AppIcon';
import PymButtonList from './PymButtonList';

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  title: {
    ...appStyles.bold18Text,
    marginBottom: isDeviceSize('small') ? 10 : 20,
    color: colors.black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ccard: {
    height: 44,
    width: '100%',
    borderColor: colors.gray,
    borderWidth: 1,
  },
});

type PymMethodProps = {
  value: string;
  onPress: (kind: 'card') => void;
};

const PymMethod: React.FC<PymMethodProps> = ({value, onPress}) => {
  const [method, setMethod] = useState<'easy' | 'card' | 'vbank'>('easy');
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (value.startsWith('card')) setMethod('card');
    else if (value.startsWith('vbank')) setMethod('vbank');
    else setMethod('easy');
  }, [value]);

  return (
    <View style={styles.container}>
      <AppText key="title" style={styles.title}>
        {i18n.t('pym:method')}
      </AppText>
      {['easy', 'card', 'vbank'].map((k) => (
        <>
          <Pressable key={k} style={styles.row} onPress={() => setMethod(k)}>
            <AppIcon name="btnCheck" focused={method === k} />
            <AppText style={styles.title}>{i18n.t(`pym:method:${k}`)}</AppText>
          </Pressable>
          {k === method ? (
            k === 'easy' ? (
              <PymButtonList selected={selected} onPress={setSelected} />
            ) : k === 'card' ? (
              <AppButton
                style={styles.ccard}
                titleStyle={{color: colors.black}}
                title={i18n.t(
                  value?.startsWith('card')
                    ? `pym:${value}`
                    : 'pym:method:card:sel',
                )}
                onPress={() => onPress('card')}
              />
            ) : (
              <View>
                <AppButton title={i18n.t('pym:method:vbank:input')} />
                <AppText key="title" style={styles.title}>
                  {i18n.t('pym:vbank:receipt')}
                </AppText>
                {['1', '2', '3'].map((k) => (
                  <AppText key={k}>{i18n.t(`pym:vbank:receipt:${k}`)}</AppText>
                ))}
                <AppText style={styles.title}>
                  {i18n.t('pym:vbank:receipt')}
                </AppText>
              </View>
            )
          ) : null}
        </>
      ))}
    </View>
  );
};

export default memo(PymMethod);
