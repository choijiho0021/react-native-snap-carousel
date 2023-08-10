import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import AppButton from './AppButton';

const styles = StyleSheet.create({
  button: {
    borderColor: colors.lightGrey,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 100,
  },
});

export type DailyProdFilterList = 'all' | '500' | '1024' | '2048';

type DailyProdFilterProps = {
  onValueChange: (v: DailyProdFilterList) => void;
  filterList: DailyProdFilterList[];
};

const DailyProdFilter: React.FC<DailyProdFilterProps> = ({
  onValueChange,
  filterList,
}) => {
  const [filter, setFilter] = useState<DailyProdFilterList>('all');

  return (
    <View
      style={{
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 24,
      }}>
      {filterList.map((elm, idx) => (
        <AppButton
          onPress={() => {
            setFilter(elm);
            onValueChange?.(elm);
          }}
          key={elm}
          style={{
            marginLeft: idx > 0 ? 8 : 0,
            backgroundColor: elm === filter ? colors.clearBlue : 'white',
            borderWidth: 1,
            borderRadius: 100,
            borderColor: elm === filter ? colors.clearBlue : colors.lightGrey,
            height: 34,
          }}
          titleStyle={[
            styles.button,
            {
              color: elm === filter ? 'white' : colors.warmGrey,
            },
          ]}
          title={i18n.t(`daily:filter:${elm}`)}
        />
      ))}
    </View>
  );
};

export default DailyProdFilter;
