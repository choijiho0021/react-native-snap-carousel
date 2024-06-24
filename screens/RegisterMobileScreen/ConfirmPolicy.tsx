import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppText from '@/components/AppText';
import AppIcon from '@/components/AppIcon';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  confirmList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 1,
    alignItems: 'center',
    gap: 8,
  },
  comfirmText: {
    ...appStyles.normal16Text,
    lineHeight: 22,
    letterSpacing: -0.16,
    color: colors.black,
  },
  container: {
    alignContent: 'stretch',
    flexDirection: 'column',
    backgroundColor: colors.backGrey,
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  titleBox: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 21,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 3,
    marginBottom: 24,
  },
  title: {
    ...appStyles.bold16Text,
    lineHeight: 22,
    color: colors.black,
  },
});

type ConfirmItem = {
  key: 'contract' | 'personalInfo' | 'marketing';
  label: string;
  param: {key: string; title: string};
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
      <Pressable onPress={() => onPress(item.key)}>
        <AppIcon name="policyCheck" checked={confirmed} />
      </Pressable>
      <Pressable onPress={() => onMove(item.key)} style={styles.row}>
        <AppText style={styles.comfirmText}>{item.label}</AppText>
        <AppIcon name="iconArrowRight" />
      </Pressable>
    </View>
  );
};

const RegisterMobileListItem = memo(RegisterMobileListItem0);

const ConfirmPolicy = ({
  onMove,
  onChange,
}: {
  onMove: (param: Record<string, string>) => void;
  onChange: (value: {mandatory: boolean; optional: boolean}) => void;
}) => {
  const commonParam = useMemo(
    () => ({
      showIcon: false,
      showCloseModal: true,
      btnStyle: {marginHorizontal: 20},
    }),
    [],
  );
  const confirmList = useMemo<ConfirmItem[]>(
    () => [
      {
        key: 'contract',
        label: i18n.t('cfm:mandatory') + i18n.t('cfm:contract'),
        param: {
          key: 'setting:contract',
          title: i18n.t('cfm:contract'),
          ...commonParam,
        },
      },
      {
        key: 'personalInfo',
        label: i18n.t('cfm:mandatory') + i18n.t('cfm:personalInfo'),
        param: {
          key: 'setting:privacy',
          title: i18n.t('cfm:personalInfo'),
          ...commonParam,
        },
      },
      {
        key: 'marketing',
        label: i18n.t('cfm:optional') + i18n.t('cfm:marketing'),
        param: {
          key: 'mkt:agreement',
          title: i18n.t('cfm:marketing'),
          ...commonParam,
        },
      },
    ],
    [commonParam],
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

  useEffect(() => {
    onChange({
      mandatory: confirm.contract && confirm.personalInfo,
      optional: confirm.marketing,
    });
  }, [confirm, onChange]);

  useEffect(() => {
    if (confirm.contract && confirm.marketing && confirm.personalInfo) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
  }, [confirm.contract, confirm.marketing, confirm.personalInfo]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.titleBox} onPress={toggleCheckAll}>
        <AppIcon name="checkBox" checked={checkAll} />
        <AppText style={styles.title}>{i18n.t('cfm:all')}</AppText>
      </Pressable>
      <View style={styles.col}>
        {confirmList.map((item) => (
          <RegisterMobileListItem
            key={item.key}
            item={item}
            confirmed={confirm[item.key]}
            onPress={(key) =>
              setConfirm((prev) => ({...prev, [key]: !prev[key]}))
            }
            onMove={() => onMove?.(item.param)}
          />
        ))}
      </View>
    </View>
  );
};
export default memo(ConfirmPolicy);
