import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
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

export type DailyProdFilterList = 'all' | '500' | '1024' | '2048' | '3072';

type DailyProdFilterProps = {
  onValueChange: (v: DailyProdFilterList) => void;
  filterList: DailyProdFilterList[];
  isExtension?: boolean;
};

const DailyProdFilter: React.FC<DailyProdFilterProps> = ({
  onValueChange,
  filterList,
  isExtension = false,
}) => {
  const [filter, setFilter] = useState<DailyProdFilterList>('all');

  return (
    <ScrollView
      style={{
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 24,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}>
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
          title={i18n.t(
            isExtension ? `daily:day:filter:${elm}` : `daily:filter:${elm}`,
          )}
        />
      ))}
    </ScrollView>
  );
};

export default DailyProdFilter;
