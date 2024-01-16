/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import {StyleSheet} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  box_info2: {
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  stit: {
    ...appStyles.medium20,
    lineHeight: 22,
    marginBottom: 16,
  },
  info: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 3,
    padding: 20,
  },
  txt_dot: {
    ...appStyles.normal14Text,
    lineHeight: 18,
    color: colors.warmGrey,
  },
});

const tagStyle = StyleSheet.create({
  dt: {
    ...appStyles.semiBold16Text,
    lineHeight: 22,
    color: colors.black,
    marginBottom: 4,
  },
  dd: {
    ...appStyles.semiBold16Text,
    lineHeight: 22,
    marginLeft: 0,
    color: colors.clearBlue,
  },
  em: {
    ...appStyles.semiBold14Text,
    lineHeight: 18,
    color: colors.black,
  },
});

type BodyHtmlProps = {body: string};

const BodyHtml: React.FC<BodyHtmlProps> = ({body}) => {
  // const html = body.replace('<p', '<ul><li').replace('/p></ul>', '/li></ul>');
  return (
    <RenderHtml
      source={{html: body}}
      classesStyles={styles}
      tagsStyles={tagStyle}
    />
  );
};

export default BodyHtml;
