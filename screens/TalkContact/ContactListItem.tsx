import React, {useCallback} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Contact} from 'react-native-contacts';
import _ from 'underscore';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  itemContainer: {
    minHeight: 70,
    height: 74,
    flexDirection: 'row',
  },
  mainTitleContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    marginLeft: 20,
  },
  icon: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
});

interface ContactListItemProps {
  leftElement?: Element;
  title: string;
  description?: string;
  rightElement?: Element;
  rightText?: string;
  onPress?: (contactData: Contact) => void;
  onDelete?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  data?: Contact;
  uri?: string;
  highlight?: number[];
}

const ContactListItem: React.FC<ContactListItemProps> = ({
  title,
  uri,
  data,
  highlight,
  onPress = () => {},
}) => {
  const start = useCallback(() => {
    return (
      <AppText style={[appStyles.bold18Text, {color: colors.clearBlue}]}>
        {title.substring(0, highlight[1] + 1)}
        <AppText style={appStyles.bold18Text}>
          {title.substring(highlight[1] + 1)}
        </AppText>
      </AppText>
    );
  }, [highlight, title]);

  const center = useCallback(() => {
    return (
      <AppText style={appStyles.bold18Text}>
        {title.substring(0, highlight[0])}
        <AppText style={[appStyles.bold18Text, {color: colors.clearBlue}]}>
          {title.substring(highlight[0], highlight[1] + 1)}
        </AppText>
        {title.substring(highlight[1] + 1)}
      </AppText>
    );
  }, [highlight, title]);

  const end = useCallback(() => {
    return (
      <AppText style={appStyles.bold18Text}>
        {title.substring(0, highlight[0])}
        <AppText style={[appStyles.bold18Text, {color: colors.clearBlue}]}>
          {title.substring(highlight[0])}
        </AppText>
      </AppText>
    );
  }, [highlight, title]);

  const checkHighlight = useCallback(() => {
    if (highlight && highlight?.length > 0) {
      return (
        <View style={[styles.mainTitleContainer, {marginLeft: 16}]}>
          {highlight[0] === 0
            ? start()
            : highlight[0] === title.length - 1
            ? end()
            : center()}
          <AppText
            style={[
              appStyles.roboto16Text,
              {color: colors.warmGrey, lineHeight: 24},
            ]}>
            {data?.phoneNumbers[0]?.number}
          </AppText>
        </View>
      );
    }

    return (
      <View style={[styles.mainTitleContainer, {marginLeft: 16}]}>
        <AppText style={appStyles.normal18Text}>{title}</AppText>
        <AppText
          style={[
            appStyles.roboto16Text,
            {color: colors.warmGrey, lineHeight: 24},
          ]}>
          {data?.phoneNumbers[0]?.number}
        </AppText>
      </View>
    );
  }, [center, data?.phoneNumbers, end, highlight, start, title]);

  return data && title ? (
    <Pressable style={styles.itemContainer} onPress={() => onPress(data)}>
      <View style={styles.mainTitleContainer}>
        {!_.isEmpty(uri) ? (
          <Image source={{uri}} style={styles.icon} />
        ) : (
          <AppIcon name="imgProfile" style={styles.icon} />
        )}
      </View>
      {checkHighlight()}
    </Pressable>
  ) : null;
};

export default ContactListItem;
