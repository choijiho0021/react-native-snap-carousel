import React, {useCallback, useEffect} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppStyledText from '@/components/AppStyledText';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBox: {
    marginTop: 12,
    borderColor: colors.clearBlue,
    borderRadius: 3,
    width: '100%',
    borderWidth: 1,
    padding: 16,
  },
  boxText: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.black,
  },
  reasonBox: {
    marginTop: 12,
    backgroundColor: colors.backRed,
    paddingTop: 12,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 18,
  },
  reasonBoxText: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.redError,
    marginBottom: 8,
    width: Dimensions.get('window').width - 126,
  },
});

type EventStatusBoxProps = {
  statusCode: string;
  rejectReason?: string[];
  otherReason?: string;
};

const EventStatusBox: React.FC<EventStatusBoxProps> = ({
  statusCode,
  rejectReason = [],
  otherReason = '',
}) => {
  const renderReason = useCallback(
    (text: string) => (
      <View style={[styles.row, {alignItems: 'flex-start'}]}>
        <AppSvgIcon name="checkRedSmall" style={{marginRight: 10}} />
        <AppText style={styles.reasonBoxText}>{text}</AppText>
      </View>
    ),
    [],
  );

  return (
    <View
      style={[
        styles.statusBox,
        {
          borderColor:
            statusCode === 'Fail'
              ? colors.redError
              : statusCode === 'Success'
              ? colors.shamrock
              : colors.clearBlue,
        },
      ]}>
      <View style={styles.row}>
        <AppSvgIcon
          name={
            statusCode === 'Fail'
              ? 'cautionRed'
              : statusCode === 'Success'
              ? 'checkGreen'
              : 'cautionBlue'
          }
          style={{marginRight: 8}}
        />
        <AppStyledText
          text={i18n.t(`event:status:${statusCode}`)}
          textStyle={styles.boxText}
          format={{
            b: {
              fontWeight: 'bold',
              color:
                statusCode === 'Fail'
                  ? colors.redError
                  : statusCode === 'Success'
                  ? colors.shamrock
                  : colors.clearBlue,
            },
          }}
        />
      </View>
      {statusCode === 'Fail' && (rejectReason.length > 0 || !!otherReason) && (
        <View style={styles.reasonBox}>
          {rejectReason.length > 0 && rejectReason.map((r) => renderReason(r))}
          {!!otherReason && renderReason(otherReason)}
        </View>
      )}
    </View>
  );
};

export default EventStatusBox;
