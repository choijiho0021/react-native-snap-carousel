import React, {memo} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';

// '21', '22','23', '24', '25', '26'

const CARD_CODE = [
  '41',
  '03',
  '04',
  '06',
  '11',
  '12',
  '14',
  '34',
  '38',
  '32',
  '35',
  '33',
  '95',
  '43',
  '48',
  '51',
  '52',
  '54',
  '55',
  '56',
  '71',
];

const styles = StyleSheet.create({
  menu: {
    width: 254,
    position: 'absolute',
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 64,
    shadowOpacity: 1,
    left: 19,
    top: 125,
    height: '80%',
    backgroundColor: 'rgba(237, 237, 237, 0.8)',
    shadowColor: 'rgba(0, 0, 0, 0.16)',
  },
  menuItem: {
    height: 44,
    backgroundColor: colors.menu,
    borderBottomColor: colors.menuBorder,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
});

const SelectCard = ({
  visible,
  onPress,
}: {
  visible: boolean;
  style?: ViewStyle;
  onPress: (id: string) => void;
}) => {
  return (
    <Modal visible={visible} transparent>
      <Pressable style={{flex: 1}} onPress={() => onPress('')}>
        <ScrollView style={styles.menu}>
          <Pressable key="header" style={styles.menuItem}>
            <AppText style={appStyles.medium18}>
              {i18n.t('pym:card:sel')}
            </AppText>
          </Pressable>
          {CARD_CODE.map((r, i) => (
            <Pressable
              key={r}
              style={[
                styles.menuItem,
                {borderBottomWidth: i === CARD_CODE.length - 1 ? 0 : 1},
              ]}
              onPress={() => onPress(`card${r}`)}>
              <AppText style={appStyles.medium18}>
                {i18n.t(`pym:card${r}`)}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
      </Pressable>
    </Modal>
  );
};

export default memo(SelectCard);
