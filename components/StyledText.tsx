import React from 'react';
import AppText from './AppText';

export function MonoText(props) {
  return (
    <AppText {...props} style={[props.style, {fontFamily: 'space-mono'}]} />
  );
}
