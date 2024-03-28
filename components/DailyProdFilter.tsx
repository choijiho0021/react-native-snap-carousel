import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import AppButton from './AppButton';
import {appStyles} from '../constants/Styles';

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
};

const DailyProdFilter: React.FC<DailyProdFilterProps> = ({
  onValueChange,
  filterList,
}) => {
  const [filter, setFilter] = useState<DailyProdFilterList>('all');

  return (
    <ScrollView
      style={{
        flexDirection: 'row',
        marginBottom: 24,
        width: '100%',
      }}
      horizontal
      showsHorizontalScrollIndicator={false}>
      <View style={{width: 20, height: 34}} />
      {filterList.map((elm, idx) => (
        <AppButton
          onPress={() => {
            setFilter(elm);
            onValueChange?.(elm);
          }}
          key={elm}
          style={{
            marginRight: 8,
            backgroundColor: elm === filter ? colors.clearBlue : colors.white,
            borderWidth: 1,
            borderRadius: 100,
            borderColor: elm === filter ? colors.clearBlue : colors.lightGrey,
            height: 34,
          }}
          titleStyle={[
            styles.button,
            {
              ...appStyles.bold14Text,
              color: elm === filter ? colors.white : colors.black,
            },
          ]}
          title={i18n.t(`daily:filter:${elm}`)}
        />
      ))}
      <View style={{width: 12, height: 34}} />
    </ScrollView>
  );
};

export default DailyProdFilter;
