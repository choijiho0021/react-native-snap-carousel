import React, {memo, useCallback, useMemo, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppText from '@/components/AppText';
import AppIcon from '@/components/AppIcon';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  confirmList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    alignContent: 'stretch',
    flexDirection: 'column',
    backgroundColor: colors.backGrey,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  titleBox: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 24,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    marginBottom: 16,
  },
  title: {
    ...appStyles.bold16Text,
    flex: 1,
    marginLeft: 8,
  },
});

type ConfirmItem = {
  key: 'contract' | 'personalInfo' | 'marketing';
  label: string;
  param: string;
};

const RegisterMobileListItem0 = ({
  item,
  confirmed,
  onPress,
  onMove,
}: {
  item: ConfirmItem;
  confirmed: boolean;
  onPress: (k: ConfirmItem['key']) => void;
  onMove: (k: ConfirmItem['key']) => void;
}) => {
  return (
    <View style={styles.confirmList}>
      <Pressable onPress={() => onPress(item.key)} style={{paddingVertical: 8}}>
        <AppIcon
          style={{marginRight: 10}}
          name="policyCheck"
          checked={confirmed}
        />
      </Pressable>
      <Pressable
        onPress={() => onMove(item.key)}
        style={[styles.row, {paddingVertical: 8}]}>
        <AppText style={appStyles.normal16Text}>{item.label}</AppText>
        <AppIcon
          style={{marginRight: 10, marginTop: 5}}
          name="iconArrowRight"
        />
      </Pressable>
    </View>
  );
};

const RegisterMobileListItem = memo(RegisterMobileListItem0);

const ConfirmPolicy = ({
  onMove,
}: {
  onMove: (param: Record<string, string>) => void;
}) => {
  const confirmList = useMemo<ConfirmItem[]>(
    () => [
      {
        key: 'contract',
        label: i18n.t('cfm:contract'),
        param: 'setting:contract',
      },
      {
        key: 'personalInfo',
        label: i18n.t('cfm:personalInfo'),
        param: 'setting:privacy',
      },
      {
        key: 'marketing',
        label: i18n.t('cfm:marketing'),
        param: 'mkt:agreement',
      },
    ],
    [],
  );

  const [confirm, setConfirm] = useState<Record<ConfirmItem['key'], boolean>>({
    contract: false,
    personalInfo: false,
    marketing: false,
  });

  const [checkAll, setCheckAll] = useState(false);

  const toggleCheckAll = useCallback(() => {
    if (checkAll) {
      setConfirm({
        contract: false,
        personalInfo: false,
        marketing: false,
      });
      setCheckAll(false);
    } else {
      setConfirm({
        contract: true,
        personalInfo: true,
        marketing: true,
      });
      setCheckAll(true);
    }
  }, [checkAll]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.titleBox} onPress={toggleCheckAll}>
        <AppIcon name="checkBox" checked={checkAll} />
        <AppText style={styles.title}>{i18n.t('cfm:all')}</AppText>
      </Pressable>
      {confirmList.map((item) => (
        <RegisterMobileListItem
          key={item.key}
          item={item}
          confirmed={confirm[item.key]}
          onPress={(key) =>
            setConfirm((prev) => ({...prev, [key]: !prev[key]}))
          }
          onMove={() => onMove?.({key: item.param, title: item.label})}
        />
      ))}
    </View>
  );
};
export default memo(ConfirmPolicy);
