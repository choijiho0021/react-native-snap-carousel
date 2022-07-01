import {useNavigation, useRoute} from '@react-navigation/native';
import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import AppActivityIndicator from '@/components/AppActivityIndicator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
  },
});
type ReceiptScreenProps = {};

const runFirst = ({tel, amount}: {tel: string; amount: number}) => `
document.body.style.backgroundColor = 'yellow';

checkValFlg(3);
document.querySelector("#inpTab3 input[name='telBuyer']").value = '${tel}';
document.querySelector("#inpTab3 input[name='prGoods']").value = '${amount}';
document.all.checkFrm.submit();

true; 
`;

const ReceiptScreen: React.FC<ReceiptScreenProps> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const ref = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const {receipt_url, buyer_tel, amount} = useMemo(
    () => route.params || {},
    [route.params],
  );

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('his:detail')} />,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{uri: receipt_url}}
        ref={ref}
        style={{width: 580}}
        onLoadEnd={() => {
          setLoading(false);
          ref.current?.injectJavaScript(runFirst({tel: buyer_tel, amount}));
        }}
      />
      <AppActivityIndicator visible={loading} />
    </SafeAreaView>
  );
};

export default memo(ReceiptScreen);
