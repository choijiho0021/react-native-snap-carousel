import React, {memo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {PymButton} from '@/components/AppPaymentGateway/PymButtonList';
import i18n from '@/utils/i18n';
import AppActionMenu from '@/components/ModalContent/AppActionMenu';
import AppText from '@/components/AppText';

const BANK_CODE = [
  ['003', '004'],
  ['007', '011'],
  ['020', '023'],
  ['031', '032'],
  ['034', '039'],
  ['045', '071'],
  ['081', '088'],
  ['089'],
];

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

const SelectBank = ({onPress}: {onPress: (id: string) => void}) => {
  return (
    <AppActionMenu title={i18n.t('pym:card:title')}>
      <AppText>{i18n.t('pym:card:noti')}</AppText>
      <ScrollView>
        {BANK_CODE.map((r, i) => (
          <View key={i} style={styles.buttonRow}>
            {r.map((c, j) => (
              <PymButton
                key={c}
                btnKey={`pym:vbank:h:${c}`}
                onPress={() => onPress(`vbank:h:${c}`)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </AppActionMenu>
  );
};

export default memo(SelectBank);
