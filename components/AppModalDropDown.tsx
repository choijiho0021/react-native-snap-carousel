import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppIcon from './AppIcon';
import AppStyledText from './AppStyledText';
import AppText from './AppText';

const {height: screenHeight} = Dimensions.get('screen');

const styles = StyleSheet.create({
  storeBox: {
    position: 'absolute',
    paddingVertical: 16,
    // maxHeight: 212,
    backgroundColor: 'white',

    borderRadius: 3,
    shadowRadius: 3,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.black8,
  },
  store: {
    height: 36,
    marginLeft: 14,
    marginRight: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeName: {
    ...appStyles.normal16Text,
    color: colors.gray02,
  },
});

type AppModalDropDownProps = {
  visible: boolean;
  onClose: () => void;
  posX: number;
  posY: number;
  rightPosX?: number;
  data: {value: string | number; label: string}[];
  //   renderItem: ({item}) => React.ReactElement;
  onPress?: (v: string | number) => void;
  value?: string;
  fixedWidth?: number;
  boldStyle?: TextStyle;
  buttonHeight?: number;
};

const AppModalDropDown: React.FC<AppModalDropDownProps> = ({
  visible,
  onClose,
  posX = 0,
  posY = 0,
  rightPosX,
  data,
  onPress,
  value,
  fixedWidth,
  boldStyle,
  buttonHeight,
}) => {
  const btnHeight = useMemo(
    () => (buttonHeight ? buttonHeight + 2 : 40),
    [buttonHeight],
  );
  const [top, setTop] = useState(posY + btnHeight);
  const x = rightPosX ? {right: rightPosX} : {left: posX};
  useEffect(() => setTop(posY + btnHeight), [btnHeight, buttonHeight, posY]);

  return (
    <Modal visible={visible} transparent>
      <Pressable style={{flex: 1}} onPress={onClose}>
        <SafeAreaView
          key="modal"
          style={[styles.storeBox, {top, ...x}]}
          onLayout={({
            nativeEvent: {
              layout: {y, height},
            },
          }) => {
            if (y + height > screenHeight) setTop(screenHeight - height - 48);
          }}>
          {visible && (
            <ScrollView
              style={[
                {maxHeight: screenHeight / 2, maxWidth: 500},
                {minWidth: fixedWidth},
              ]}>
              {data.map((item) => (
                <Pressable
                  key={item.value}
                  onPress={() => onPress?.(item.value)}>
                  <View style={styles.store}>
                    {item.value === value ? (
                      <AppIcon name="check20" />
                    ) : (
                      <View style={{width: 20}} />
                    )}
                    {boldStyle ? (
                      <AppStyledText
                        text={item.label}
                        textStyle={[
                          styles.storeName,
                          item.value === value && {
                            color: colors.black,
                            opacity: 1,
                            fontWeight: 'bold',
                          },
                        ]}
                        format={{b: boldStyle || {}}}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      />
                    ) : (
                      <AppText
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.storeName,
                          item.value === value && {
                            color: colors.black,
                            opacity: 1,
                            fontWeight: 'bold',
                          },
                        ]}>
                        {item.label}
                      </AppText>
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};

export default memo(AppModalDropDown);
