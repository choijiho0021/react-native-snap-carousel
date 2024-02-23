import React, {memo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {PymButton} from '@/components/AppPaymentGateway/PymButtonList';
import i18n from '@/utils/i18n';
import AppActionMenu from '@/components/ModalContent/AppActionMenu';
import AppText from '@/components/AppText';

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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

const SelectCard = ({onPress}: {onPress: (id: string) => void}) => {
  return (
    <AppActionMenu title={i18n.t('pym:card:title')}>
      <AppText>{i18n.t('pym:card:noti')}</AppText>
      <ScrollView>
        {CARD_CODE.map((r, i) => (
          <View key={i} style={styles.buttonRow}>
            {r.map((c, j) => (
              <PymButton
                key={c}
                btnKey={`pym:card${c}`}
                onPress={() => onPress(`card${c}`)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </AppActionMenu>
  );
};

export default memo(SelectCard);
