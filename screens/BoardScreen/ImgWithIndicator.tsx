import React, {memo, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {attachmentSize} from '@/constants/SliderEntry.style';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppIcon from '@/components/AppIcon';

const styles = StyleSheet.create({
  attach: {
    borderRadius: 3,
  },
  attachCancel: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});

type ImgWithIndicatorProps = {
  uri: string;
  maxImageCnt: number;
  showBtn?: boolean;
};

const ImgWithIndicator: React.FC<ImgWithIndicatorProps> = ({
  uri,
  maxImageCnt = 3,
  showBtn = false,
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
      {showBtn && (
        <View style={styles.attachCancel}>
          <AppIcon name="btnBoxOpen" />
        </View>
      )}
      <AppActivityIndicator visible={loading} size="small" />
    </View>
  );
};

export default memo(ImgWithIndicator);
