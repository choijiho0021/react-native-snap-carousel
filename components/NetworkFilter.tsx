import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView} from 'react-native';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import AppIcon from './AppIcon';
import AppText from './AppText';
import AppSvgIcon from './AppSvgIcon';
import {appStyles} from '@/constants/Styles';

export type NetworkFilterList = 'fiveG' | 'else';

type NetworkFilterProps = {
  onValueChange: (v: NetworkFilterList[]) => void;
  filterList: NetworkFilterList[];
};

const NetworkFilter: React.FC<NetworkFilterProps> = ({
  onValueChange,
  filterList,
}) => {
  const [filter, setFilter] = useState<NetworkFilterList[]>(filterList);

  const onPressFilter = useCallback(
    (fi) => {
      if (!filter.includes(fi)) {
        setFilter((prev) => prev.concat(fi));
        onValueChange?.(filter.concat(fi));
      } else if (filter.includes(fi)) {
        // const newFilter = fi === 'fiveG' ? 'else' : 'fiveG';
        setFilter([fi === 'fiveG' ? 'else' : 'fiveG']);
        onValueChange?.([fi === 'fiveG' ? 'else' : 'fiveG']);
      }
    },
    [filter, onValueChange],
  );

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
        <Pressable
          style={{flexDirection: 'row'}}
          onPress={() => onPressFilter(elm)}>
          <AppIcon
            name="btnCheck"
            checked={filter?.includes(elm)}
            style={{marginRight: 6}}
          />
          {elm === 'fiveG' && (
            <AppSvgIcon name="fiveG" style={{justifyContent: 'center'}} />
          )}
          <AppText
            style={{
              marginRight: 8,
              ...appStyles.bold14Text,
              color: elm === 'fiveG' ? colors.purplyBlue : colors.black,
            }}>
            {i18n.t(`network:filter:${elm}`)}
          </AppText>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default NetworkFilter;
