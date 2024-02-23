import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {Appearance, Platform} from 'react-native';
import AppModal from '@/components/AppModal';
import i18n from '@/utils/i18n';
import {emailDomainList} from '@/components/InputEmail';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';

const DomainPicker = ({
  visible,
  onOkClose,
  onCancelClose,
}: {
  visible: boolean;
  onOkClose: (v: string) => void;
  onCancelClose: () => void;
}) => {
  const [domain, setDomain] = useState<string>('direct');
  const ref = useRef<Picker>(null);
  const picker = useCallback(() => {
    const style = {
      ...appStyles.normal14Text,
      color:
        Appearance.getColorScheme() === 'dark' ? colors.white : colors.black,
    };
    return visible ? (
      <Picker
        ref={ref}
        onBlur={() => onOkClose(domain === 'direct' ? '' : domain)}
        dropdownIconColor={colors.warmGrey}
        selectedValue={domain}
        onValueChange={setDomain}>
        <Picker.Item
          key="direct"
          label={i18n.t('email:input')}
          value="direct"
          style={style}
        />
        {Object.entries(emailDomainList).map(([k, v]) => (
          <Picker.Item key={k} label={v} value={k} style={style} />
        ))}
      </Picker>
    ) : null;
  }, [domain, onOkClose, visible]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (visible) ref?.current?.focus();
      else ref?.current?.blur();
    }
  }, [visible]);

  return Platform.OS === 'android' ? (
    picker()
  ) : (
    <AppModal
      visible={visible}
      onOkClose={() => onOkClose(domain === 'direct' ? '' : domain)}
      onCancelClose={() => onCancelClose()}>
      {picker()}
    </AppModal>
  );
};

export default memo(DomainPicker);
