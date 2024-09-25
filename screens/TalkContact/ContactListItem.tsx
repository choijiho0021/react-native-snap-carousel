import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import _ from 'underscore';
import {Contact} from 'react-native-contacts';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppIcon from '@/components/AppIcon';

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
  descriptionStyle: {
    fontSize: 14,
    color: '#515151',
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
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
}

const ContactListItem: React.FC<ContactListItemProps> = ({
  title,
  uri,
  data,
  onPress = () => {},
}) => {
  return data ? (
    <Pressable style={styles.itemContainer} onPress={() => onPress(data)}>
      <View style={styles.mainTitleContainer}>
        {!_.isEmpty(uri) ? (
          <Image source={{uri}} style={styles.icon} />
        ) : (
          <AppIcon name="imgProfile" style={styles.icon} />
        )}
      </View>
      <View style={[styles.mainTitleContainer, {marginLeft: 16}]}>
        <Text style={appStyles.normal18Text}>{title}</Text>
        <Text
          style={[
            appStyles.roboto16Text,
            {color: colors.warmGrey, lineHeight: 24},
          ]}>
          {data.phoneNumbers[0]?.number}
        </Text>
      </View>
    </Pressable>
  ) : null;
};

export default ContactListItem;
