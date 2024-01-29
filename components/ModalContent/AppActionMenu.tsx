import {Pressable, SafeAreaView, View} from 'react-native';
import React, {PropsWithChildren, memo} from 'react';
import {useDispatch} from 'react-redux';
import {actions as modalActions} from '@/redux/modules/modal';

const AppActionMenu: React.FC<PropsWithChildren<{}>> = ({children}) => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
        <Pressable
          style={{flex: 1}}
          onPress={() => dispatch(modalActions.closeModal())}
        />
        {children}
      </View>
    </SafeAreaView>
  );
};

export default memo(AppActionMenu);
