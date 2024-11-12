import React, {memo, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {attachmentSize} from '@/constants/SliderEntry.style';
import AppActivityIndicator from '@/components/AppActivityIndicator';

const styles = StyleSheet.create({
  attach: {
    borderRadius: 3,
  },
});

type ImgWithIndicatorProps = {
  uri: string;
  maxImageCnt: number;
};

const ImgWithIndicator: React.FC<ImgWithIndicatorProps> = ({
  uri,
  maxImageCnt = 3,
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <View>
      <Image
        source={{uri}}
        style={[
          styles.attach,
          {
            width: attachmentSize(maxImageCnt),
            height: attachmentSize(maxImageCnt),
          },
        ]}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      <AppActivityIndicator visible={loading} size="small" />
    </View>
  );
};

export default memo(ImgWithIndicator);
