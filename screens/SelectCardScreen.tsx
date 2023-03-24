import React, {useCallback, useRef, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '@/constants/Colors';
import {PymButton} from '@/components/AppPaymentGateway/PymButtonList';
import AppButton from '@/components/AppButton';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';

// '21', '22','23', '24', '25', '26'

const CARD_CODE = [
  ['41', '03', '04'],
  ['06', '11', '12'],
  ['14', '34', '38'],
  ['32', '35', '33'],
  ['95', '43', '48'],
  ['51', '52', '54'],
  ['55', '56', '71'],
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

const SelectCard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selected, setSelected] = useState('pym:card01');
  const goingBack = useRef(false);

  const onSubmit = useCallback(() => {
    navigation.navigate('PaymentGateway', {
      ...route?.params,
      card: selected.substring(selected.length - 2),
    });
  }, [navigation, route?.params, selected]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        onScroll={({
          nativeEvent: {
            contentOffset: {y},
          },
        }) => {
          if (!goingBack.current && y < -100) {
            goingBack.current = true;
            navigation.goBack();
          }
        }}
        scrollEventThrottle={16}>
        {CARD_CODE.map((r, i) => (
          <View key={i} style={styles.buttonRow}>
            {r.map((c, j) => (
              <PymButton
                key={c}
                btnKey={`pym:card${c}`}
                onPress={setSelected}
                selected={selected}
                topColor={
                  i > 0
                    ? `pym:card${CARD_CODE[i - 1][j]}` === selected
                    : undefined
                }
                leftColor={
                  j > 0
                    ? `pym:card${CARD_CODE[i][j - 1]}` === selected
                    : undefined
                }
                bottom={i === CARD_CODE.length - 1}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      <AppButton
        title={i18n.t('payment')}
        titleStyle={appStyles.medium18}
        key={i18n.t('payment')}
        onPress={onSubmit}
        style={appStyles.confirm}
        type="primary"
      />
    </SafeAreaView>
  );
};

export default SelectCard;
