import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import AppButton from '@/components/AppButton';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import {retrieveData, storeData} from '@/utils/utils';

const styles = StyleSheet.create({
  toolTipBox: {
    backgroundColor: colors.black,
    paddingTop: 16,
    paddingBottom: 20,
    height: '100%',
  },
  toolTipTitleFrame: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 36,
    marginBottom: 12,
  },
  toolTipTitleText: {
    ...appStyles.bold14Text,
    color: colors.white,
    lineHeight: 20,
    marginLeft: 16,
  },
  btnCancel: {
    padding: 8,
    marginRight: 8,
  },
  toolTipBody: {
    marginLeft: 16,
    paddingRight: 30,
  },
  toolTipBodyText: {
    ...appStyles.normal14Text,
    color: colors.white,
    lineHeight: 20,
  },
  cautionBtn: {
    width: 24,
    height: 24,
    marginTop: 2,
  },
  toolTipStyle: {
    borderRadius: 5,
  },
  arrowStyle: {
    borderTopColor: colors.black,
    zIndex: 10,
  },
});

const ToolTip = () => {
  const [showTip, setTip] = useState(false);

  useEffect(() => {
    retrieveData('LocalProdTooltip').then((elm) => {
      setTimeout(() => {
        setTip(elm !== 'closed');
      }, 1000);

      storeData('LocalProdTooltip', 'closed');
    });
  }, []);

  return (
    <Tooltip
      isVisible={showTip}
      backgroundColor="rgba(0,0,0,0)"
      contentStyle={styles.toolTipBox}
      tooltipStyle={styles.toolTipStyle}
      arrowStyle={styles.arrowStyle}
      backgroundStyle={{opacity: 0.92}}
      disableShadow
      arrowSize={{width: 20, height: 12}}
      content={
        <View>
          <View style={styles.toolTipTitleFrame}>
            <AppText style={styles.toolTipTitleText}>
              {i18n.t('local:noticeBox:title')}
            </AppText>
            <AppButton
              style={styles.btnCancel}
              iconName="btnCancelWhite"
              onPress={() => setTip(false)}
            />
          </View>
          <View style={styles.toolTipBody}>
            {[1, 2].map((k) => (
              <View key={k} style={{flexDirection: 'row'}}>
                <AppText
                  style={[
                    appStyles.normal14Text,
                    {marginHorizontal: 5, marginTop: 3, color: colors.white},
                  ]}>
                  •
                </AppText>
                <AppText style={styles.toolTipBodyText}>
                  {i18n.t(`local:noticeBox:body${k}`)}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      }
      onClose={() => setTip(false)}
      placement="bottom">
      <AppSvgIcon
        style={styles.cautionBtn}
        onPress={() => {
          storeData('LocalProdTooltip', 'closed');
          setTip(true);
        }}
        name="btnChargeCaution"
      />
      {/* {showTip && <View style={styles.triangle} />} */}
    </Tooltip>
  );
};

export default memo(ToolTip);
