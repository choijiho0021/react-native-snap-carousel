import React from 'react';
import Svg, {Circle} from 'react-native-svg';

// normal, pressed, disabled
const toggleIcons: Record<string, React.ReactElement[]> = {
  radioBtn: [
    <Svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="8.5" cy="8" r="7.5" fill="#fff" stroke="#D8D8D8" />
      <Circle cx="8.5" cy="8" r="5" fill="#2A7FF6" />
    </Svg>,
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="8" cy="8" r="7.5" fill="#fff" stroke="#D8D8D8" />
      <Circle cx="8" cy="8" r="5" fill="#F5F5F5" />
    </Svg>,
  ],
};
export default toggleIcons;
