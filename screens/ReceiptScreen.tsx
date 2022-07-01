import {useNavigation, useRoute} from '@react-navigation/native';
import React, {memo, useEffect, useMemo} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
type ReceiptScreenProps = {};

const ReceiptScreen: React.FC<ReceiptScreenProps> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const uri = useMemo(() => route.params?.uri, [route.params?.uri]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('his:detail')} />,
    });
  }, [navigation]);
  console.log('@@@ uri', uri);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{uri}}
        style={styles.container}
        originWhitelist={['*']}
        onLoadEnd={({nativeEvent: {loading}}) => console.log('finish loading')}
      />
    </SafeAreaView>
  );
};

export default memo(ReceiptScreen);
