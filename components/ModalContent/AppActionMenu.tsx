import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import React, {PropsWithChildren, memo} from 'react';
import {useDispatch} from 'react-redux';
import {actions as modalActions} from '@/redux/modules/modal';
import AppText from '../AppText';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
    height: 56,
  },
});

type AppActionMenuProps = {
  title?: string;
  onCancelClose?: () => void;
};

const AppActionMenu: React.FC<PropsWithChildren<AppActionMenuProps>> = ({
  children,
  title,
}) => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
        <Pressable
          style={{flex: 1}}
          onPress={() => dispatch(modalActions.closeModal())}
        />
        {title ? (
          <View style={styles.container}>
            <AppText key="title" style={styles.header}>
              {title}
            </AppText>
            {children}
          </View>
        ) : (
          children
        )}
      </View>
    </SafeAreaView>
  );
};

export default memo(AppActionMenu);
