import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 100,
  },
});

export type DailyProdFilterList = 'all' | '500' | '1024' | '2048';

const filterList: DailyProdFilterList[] = ['all', '500', '1024', '2048'];

type DailyProdFilterProps = {
  onValueChange: (v: DailyProdFilterList) => void;
};

const DailyProdFilter: React.FC<DailyProdFilterProps> = ({onValueChange}) => {
  const [filter, setFilter] = useState<DailyProdFilterList>('all');

  return (
    <View
      style={{
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 24,
      }}>
      {filterList.map((elm, idx) => (
        <Pressable
          onPress={() => {
            setFilter(elm);
            onValueChange?.(elm);
          }}
          key={elm}
          style={{marginLeft: idx > 0 ? 8 : 0}}>
          <AppText
            style={[
              styles.button,
              {
                backgroundColor: elm === filter ? colors.clearBlue : 'white',
                color: elm === filter ? 'white' : colors.warmGrey,
              },
            ]}>
            {i18n.t(`daily:filter:${elm}`)}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
};

export default DailyProdFilter;
