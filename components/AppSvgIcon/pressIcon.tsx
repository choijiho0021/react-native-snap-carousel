import React from 'react';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Mask,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

// normal, pressed, disabled
const pressIcons: Record<string, React.ReactElement[]> = {
  btnSetup: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 10.125A1.877 1.877 0 0 0 10.125 12c0 1.033.84 1.876 1.875 1.876A1.878 1.878 0 0 0 13.875 12 1.877 1.877 0 0 0 12 10.125zm0 5.625A3.754 3.754 0 0 1 8.25 12 3.754 3.754 0 0 1 12 8.25 3.754 3.754 0 0 1 15.75 12 3.754 3.754 0 0 1 12 15.75z"
        fill="#2C2C2C"
      />
      <Mask
        id="xah08mnrja"
        style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 0h24v24H0V0z"
          fill="#fff"
        />
      </Mask>
      <G mask="url(#xah08mnrja)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.448 22.125h3.104l.396-2.715a.942.942 0 0 1 .613-.748 7.379 7.379 0 0 0 2.132-1.195.95.95 0 0 1 .941-.144l2.648 1.035 1.534-2.579-2.22-1.688a.934.934 0 0 1-.355-.903 6.951 6.951 0 0 0 0-2.376.932.932 0 0 1 .356-.903l2.218-1.688-1.533-2.579-2.648 1.036a.953.953 0 0 1-.941-.145 7.38 7.38 0 0 0-2.132-1.196.94.94 0 0 1-.613-.746l-.396-2.715h-3.104l-.397 2.715a.937.937 0 0 1-.612.746c-.775.28-1.492.68-2.131 1.196a.953.953 0 0 1-.942.145L3.718 5.642l-1.534 2.58 2.218 1.687c.28.212.417.558.357.903a6.95 6.95 0 0 0 0 2.376.933.933 0 0 1-.357.903L2.184 15.78l1.534 2.58 2.648-1.036a.95.95 0 0 1 .942.144 7.39 7.39 0 0 0 2.131 1.195.939.939 0 0 1 .612.748l.397 2.715zM14.37 24H9.63a.943.943 0 0 1-.935-.804l-.435-2.981a9.282 9.282 0 0 1-1.696-.954L3.66 20.395A.95.95 0 0 1 2.5 20L.13 16.016a.934.934 0 0 1 .24-1.22l2.446-1.86a8.791 8.791 0 0 1 0-1.872L.37 9.204a.933.933 0 0 1-.24-1.22L2.501 4a.948.948 0 0 1 1.16-.396l2.903 1.134a9.28 9.28 0 0 1 1.696-.953L8.695.803A.942.942 0 0 1 9.63 0h4.739c.47 0 .868.342.936.803l.435 2.982c.598.26 1.167.578 1.697.953l2.902-1.133A.948.948 0 0 1 21.5 4l2.37 3.983a.932.932 0 0 1-.24 1.22l-2.446 1.86a8.79 8.79 0 0 1 0 1.871l2.447 1.86c.38.29.482.813.239 1.22L21.499 20a.948.948 0 0 1-1.16.395l-2.902-1.134a9.28 9.28 0 0 1-1.697.954l-.435 2.981a.944.944 0 0 1-.936.804z"
          fill="#2C2C2C"
        />
      </G>
    </Svg>,
  ],
  arrowRight: [
    <Svg
      width="10"
      height="11"
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M4.5.7 9 5.2 4.5 9.7"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  pin: [
    <Svg
      width="10"
      height="16"
      viewBox="0 0 10 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M4 6.5h2V14l-.553 1.106a.5.5 0 0 1-.894 0L4 14V6.5z"
        fill="#777"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.512 1.842A1 1 0 0 0 8.572.5H1.428a1 1 0 0 0-.94 1.342L2 6l-.5 1.25a.911.911 0 0 0 .846 1.25h5.177a1 1 0 0 0 .928-1.371L8 6l1.512-4.158z"
        fill="#ED4847"
      />
    </Svg>,
  ],
  btnCnter: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm2 0c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zM12 7a2 2 0 0 0-2 2 1 1 0 0 1-2 0 4 4 0 1 1 5 3.874V14a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1 2 2 0 1 0 0-4zm1 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  callCenter: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 10.503v.913A5.001 5.001 0 0 0 6 21a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1v-.497c0-3.429 3.008-6.429 7-6.429s7 3 7 6.429V11a1 1 0 0 0-1 1v11h-6a1 1 0 1 0 0 2h7a1 1 0 0 0 1-1v-3.1a5.002 5.002 0 0 0 1-9.484v-.913c0-4.655-4.03-8.429-9-8.429s-9 3.774-9 8.429zM3 16c0-1.306.835-2.418 2-2.83v5.66A3.001 3.001 0 0 1 3 16zm20 0a3.001 3.001 0 0 0-2-2.83v5.66A3.001 3.001 0 0 0 23 16z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  closeModal: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect
        x="2.101"
        y="3.515"
        width="2"
        height="26"
        rx="1"
        transform="rotate(-45 2.1 3.515)"
        fill="#2C2C2C"
      />
      <Rect
        x="20.485"
        y="2.101"
        width="2"
        height="26"
        rx="1"
        transform="rotate(45 20.485 2.1)"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  esimLogo: [
    <Svg
      width="43"
      height="38"
      viewBox="0 0 43 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 28.278C34.52 6.595 21.75 1.487 21.75 1.487S8.98 6.595 7.5 28.278c0 0 2.452 3.857 14.25 3.857S36 28.278 36 28.278z"
        fill="#FFD300"
      />
      <Path
        clipRule="evenodd"
        d="M21.75 32.135c11.798 0 14.25-3.857 14.25-3.857C34.52 6.595 21.75 1.487 21.75 1.487S8.98 6.595 7.5 28.278c0 0 2.452 3.857 14.25 3.857z"
        stroke="#FFD300"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.5 36.514c24.877 0 21.727-13.837 19.577-16.58-2.15-2.744-5.765-2.592-8.107-1.396-2.342 1.196-4.014.585-5.727-2.784-1.92-3.773-5.743-3.563-5.743-3.563s-3.823-.21-5.742 3.563c-1.714 3.369-3.386 3.98-5.728 2.784-2.341-1.196-5.956-1.348-8.107 1.396-2.15 2.743-5.3 16.58 19.577 16.58z"
        fill="#2A7FF6"
      />
      <Path
        clipRule="evenodd"
        d="M21.5 36.514c24.877 0 21.727-13.837 19.577-16.58-2.15-2.744-5.765-2.592-8.107-1.396-2.342 1.196-4.014.585-5.727-2.784-1.92-3.773-5.743-3.563-5.743-3.563s-3.823-.21-5.742 3.563c-1.714 3.369-3.386 3.98-5.728 2.784-2.341-1.196-5.956-1.348-8.107 1.396-2.15 2.743-5.3 16.58 19.577 16.58z"
        stroke="#2A7FF6"
      />
    </Svg>,
  ],
  leftArrow: [
    <Svg
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.646 12.354a.5.5 0 0 0 .708-.708L1.707 8H13a.5.5 0 0 0 0-1H1.707l3.647-3.646a.5.5 0 1 0-.708-.708l-4.5 4.5a.5.5 0 0 0 0 .708l4.5 4.5z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  flag: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.372 2.586A.881.881 0 0 0 1 3.324V21.5a1.5 1.5 0 0 0 3 0v-3.862a8.965 8.965 0 0 1 2.5-.359c2.006 0 3.753.93 5.5 1.86 1.747.93 3.494 1.861 5.5 1.861 2.5 0 4.369-1.068 5.128-1.585a.882.882 0 0 0 .372-.74V5.016c0-.85-1.073-1.408-1.854-1.068a9.138 9.138 0 0 1-3.646.774c-2.006 0-3.753-.93-5.5-1.86C10.253 1.93 8.506 1 6.5 1 4 1 2.131 2.068 1.372 2.586z"
        fill="#0029FF"
      />
      <Circle cx="12" cy="14.8" r="1" fill="#fff" />
      <Rect x="11" y="6" width="2" height="7" rx="1" fill="#fff" />
    </Svg>,
  ],
  newFlag: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3 3a1 1 0 0 0-1 1v17l4-4h15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3z"
        fill="#0029FF"
      />
      <Circle cx="12" cy="13.8" r="1" fill="#fff" />
      <Rect x="11" y="5" width="2" height="7" rx="1" fill="#fff" />
    </Svg>,
  ],

  closeSnackBar: [
    <Svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect
        x="10.596"
        y="1.197"
        width="1"
        height="14"
        rx=".5"
        transform="rotate(45 10.596 1.197)"
        fill="#fff"
      />
      <Rect
        x=".697"
        y="1.904"
        width="1"
        height="14"
        rx=".5"
        transform="rotate(-45 .697 1.904)"
        fill="#fff"
      />
    </Svg>,
  ],
  removeSearchHist: [
    <Svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect
        x="10.596"
        y=".697"
        width="1"
        height="14"
        rx=".5"
        transform="rotate(45 10.596 .697)"
        fill="#979797"
      />
      <Rect
        x=".697"
        y="1.404"
        width="1"
        height="14"
        rx=".5"
        transform="rotate(-45 .697 1.404)"
        fill="#979797"
      />
    </Svg>,
  ],
  plus: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M8 12a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 8 12z"
        fill="#2C2C2C"
      />
      <Path
        d="M12 8a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 12 8z"
        fill="#2C2C2C"
      />
    </Svg>,
    null,
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M8 12a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 8 12z"
        fill="#D8D8D8"
      />
      <Path
        d="M12 8a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 12 8z"
        fill="#D8D8D8"
      />
    </Svg>,
  ],
  minus: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect x="8" y="11.5" width="8" height="1" rx=".5" fill="#2C2C2C" />
    </Svg>,
    null,
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect x="8" y="11.5" width="8" height="1" rx=".5" fill="#D8D8D8" />
    </Svg>,
  ],
  bottomArrow: [
    <Svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9.5 3 5 7.5.5 3"
        stroke="#2C2C2C"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>,
  ],
  topArrow: [
    <Svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M.5 5 5 .5 9.5 5"
        stroke="#2C2C2C"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>,
  ],
};

export default pressIcons;
