import React, {memo} from 'react';
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
  reason?: string[];
};

const EventStatusBox: React.FC<EventStatusBoxProps> = ({
  statusCode,
  reason = [],
}) => {
  return (
    <View
      style={[
        styles.statusBox,
        {
          borderColor:
            statusCode === 'f'
              ? colors.redError
              : statusCode === 's'
              ? colors.shamrock
              : colors.clearBlue,
        },
      ]}>
      <View style={styles.row} key="status">
        <AppSvgIcon
          name={
            statusCode === 'f'
              ? 'cautionRed'
              : statusCode === 's'
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
                statusCode === 'f'
                  ? colors.redError
                  : statusCode === 's'
                  ? colors.shamrock
                  : colors.clearBlue,
            },
          }}
        />
      </View>
      {statusCode === 'f' && reason.length > 0 && (
        <View style={styles.reasonBox} key="reason">
          {reason.map((r, idx) =>
            r ? (
              <View style={[styles.row, {alignItems: 'flex-start'}]} key={idx}>
                <AppSvgIcon name="checkRedSmall" style={{marginRight: 10}} />
                <AppText style={styles.reasonBoxText}>{r}</AppText>
              </View>
            ) : null,
          )}
        </View>
      )}
    </View>
  );
};

export default memo(EventStatusBox);
