import React, {memo} from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppIcon from './AppIcon';
import AppText from './AppText';

const styles = StyleSheet.create({
  storeBox: {
    position: 'absolute',
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: colors.line,
    shadowColor: colors.black8,
    bottom: 0,
    width: '100%',
  },
  store: {
    height: 62,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  storeName: {
    ...appStyles.medium18,
    color: colors.black,
  },
});

type AppModalDropDownProps = {
  visible: boolean;
  onClose: () => void;
  data: {value: string | number; label: string}[];
  onPress?: (v: string | number) => void;
  value?: string;
};

const AppModalDropDown: React.FC<AppModalDropDownProps> = ({
  visible,
  onClose,
  data,
  onPress,
  value,
}) => {
  return (
    <Modal visible={visible} transparent>
      <Pressable
        style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
        onPress={onClose}>
        <SafeAreaView key="modal" style={styles.storeBox}>
          {visible && (
            <View>
              {data.map((item) => (
                <Pressable
                  key={item.value}
                  onPress={() => onPress?.(item.value)}>
                  <View style={styles.store}>
                    <AppText
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.storeName,
                        item.value === value && {
                          color: colors.clearBlue,
                          opacity: 1,
                          fontWeight: 'bold',
                        },
                      ]}>
                      {item.label}
                    </AppText>

                    {item.value === value ? (
                      <AppIcon name="selected" style={{marginLeft: 6}} />
                    ) : (
                      <View style={{width: 22, marginLeft: 6}} />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};

export default memo(AppModalDropDown);
