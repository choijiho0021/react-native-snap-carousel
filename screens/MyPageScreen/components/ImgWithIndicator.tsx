import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {attachmentSize} from '@/constants/SliderEntry.style';
import AppActivityIndicator from '@/components/AppActivityIndicator';

const styles = StyleSheet.create({
  attach: {
    width: attachmentSize,
    height: attachmentSize,
  },
});

type ImgWithIndicatorProps = {
  uri: string;
};

const ImgWithIndicator: React.FC<ImgWithIndicatorProps> = ({uri}) => {
  const [loading, setLoading] = useState(false);
  return (
    <View>
      <Image
        source={{uri}}
        style={styles.attach}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      <AppActivityIndicator visible={loading} size="small" />
    </View>
  );
};

export default ImgWithIndicator;
