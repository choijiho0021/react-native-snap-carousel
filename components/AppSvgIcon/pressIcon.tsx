import React from 'react';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Mask,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

// normal, pressed, disabled
const pressIcons: Record<string, React.ReactElement[]> = {
  btnSetup: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 11.125A1.877 1.877 0 0 0 11.125 13c0 1.034.84 1.876 1.875 1.876A1.878 1.878 0 0 0 14.875 13 1.877 1.877 0 0 0 13 11.125zm0 5.625A3.754 3.754 0 0 1 9.25 13 3.754 3.754 0 0 1 13 9.25 3.754 3.754 0 0 1 16.75 13 3.754 3.754 0 0 1 13 16.75z"
        fill="#2C2C2C"
      />
      <Mask
        id="4mtinjhhga"
        style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="1"
        width="26"
        height="25">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1 1h24v24H1V1z"
          fill="#fff"
        />
      </Mask>
      <G mask="url(#4mtinjhhga)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.448 23.125h3.104l.396-2.715a.942.942 0 0 1 .613-.747 7.38 7.38 0 0 0 2.132-1.196.95.95 0 0 1 .941-.144l2.648 1.035 1.534-2.579-2.22-1.687a.934.934 0 0 1-.355-.904 6.95 6.95 0 0 0 0-2.376.933.933 0 0 1 .356-.903l2.219-1.688-1.534-2.579-2.648 1.036a.953.953 0 0 1-.941-.145 7.38 7.38 0 0 0-2.132-1.196.94.94 0 0 1-.613-.746l-.396-2.716h-3.104l-.397 2.716a.937.937 0 0 1-.612.746c-.776.28-1.492.68-2.132 1.196a.953.953 0 0 1-.941.145L4.718 6.642l-1.535 2.58 2.22 1.687c.279.212.416.558.356.903a6.95 6.95 0 0 0 0 2.376.933.933 0 0 1-.357.904l-2.219 1.687 1.535 2.58 2.648-1.036a.95.95 0 0 1 .941.144c.64.514 1.356.916 2.132 1.196a.938.938 0 0 1 .612.747l.397 2.715zM15.37 25H10.63a.943.943 0 0 1-.935-.803l-.435-2.982a9.282 9.282 0 0 1-1.697-.953L4.66 21.395A.95.95 0 0 1 3.5 21l-2.37-3.984a.934.934 0 0 1 .24-1.22l2.446-1.86a8.79 8.79 0 0 1 0-1.872l-2.446-1.86a.933.933 0 0 1-.24-1.22L3.5 5a.948.948 0 0 1 1.16-.396L7.563 5.74a9.281 9.281 0 0 1 1.697-.953l.435-2.983A.942.942 0 0 1 10.63 1h4.739c.47 0 .868.341.936.803l.435 2.981c.598.26 1.167.579 1.697.954l2.903-1.134A.948.948 0 0 1 22.5 5l2.369 3.983a.932.932 0 0 1-.24 1.221l-2.446 1.86a8.79 8.79 0 0 1 0 1.871l2.447 1.86c.38.29.482.813.239 1.221L22.499 21a.948.948 0 0 1-1.16.395l-2.902-1.133a9.28 9.28 0 0 1-1.697.953l-.435 2.982a.945.945 0 0 1-.936.803z"
          fill="#2C2C2C"
        />
      </G>
    </Svg>,
  ],
  rightArrow: [
    <Svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M4.5.5 9 5 4.5 9.5"
        stroke="#2C2C2C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
        fillRule="evenodd"
        clipRule="evenodd"
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
        strokeLinecap="round"
        strokeLinejoin="round"
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
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  checkedBlue: [
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M5 10.5 9.696 15 17 8"
        stroke="#2A7FF6"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </Svg>,
  ],
  qrInfo: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G
        clipPath="url(#33gk6x5uqa)"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#2C2C2C">
        <Path d="M4.5 4.5v6h6v-6h-6zM4 3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4zM4.5 15.5v6h6v-6h-6zM4 14a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H4zM15.5 4.5v6h6v-6h-6zM15 3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-7zM22.25 16a.75.75 0 0 1 .75.75v4.5A1.75 1.75 0 0 1 21.25 23h-4.5a.75.75 0 0 1 0-1.5h4.5a.25.25 0 0 0 .25-.25v-4.5a.75.75 0 0 1 .75-.75zM15.75 15.5a.25.25 0 0 0-.25.25v2a.75.75 0 0 1-1.5 0v-2c0-.966.784-1.75 1.75-1.75h2a.75.75 0 0 1 0 1.5h-2z" />
      </G>
      <Defs>
        <ClipPath id="33gk6x5uqa">
          <Path fill="#fff" d="M0 0h26v26H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  btnUsage: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G
        clip-path="url(#1utqpdok7a)"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#2C2C2C">
        <Path d="M22.39 9.492h-5.882V3.61a7.54 7.54 0 0 1 5.882 5.88zm1.604.504c.062.552-.394 1.004-.95 1.004h-7.038C15.45 11 15 10.55 15 9.994V2.955c0-.555.452-1.011 1.003-.95a9.05 9.05 0 0 1 7.991 7.991z" />
        <Path d="M22.42 14.482A9.519 9.519 0 1 1 11.518 3.581v8.396a2.505 2.505 0 0 0 2.505 2.505h8.396zm1.576-.502c.05-.551-.403-1-.956-1h-9.017a1.002 1.002 0 0 1-1.002-1.003V2.96c0-.553-.45-1.006-1-.956A11.02 11.02 0 1 0 23.995 13.98z" />
      </G>
      <Defs>
        <ClipPath id="1utqpdok7a">
          <Path fill="#fff" d="M0 0h26v26H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  btnChargeable: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G
        clipPath="url(#w0ansbqfpa)"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#2C2C2C">
        <Path d="M13 22.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19zm0 1.5c6.075 0 11-4.925 11-11S19.075 2 13 2 2 6.925 2 13s4.925 11 11 11z" />
        <Path d="M13.75 10a.75.75 0 0 0-1.5 0v2.25H10a.75.75 0 0 0 0 1.5h2.25V16a.75.75 0 0 0 1.5 0v-2.25H16a.75.75 0 0 0 0-1.5h-2.25V10z" />
      </G>
      <Defs>
        <ClipPath id="w0ansbqfpa">
          <Path fill="#fff" d="M0 0h26v26H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  btnChargeExpired: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 22.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19zm0 1.5c6.075 0 11-4.925 11-11S19.075 2 13 2 2 6.925 2 13s4.925 11 11 11z"
        fill="#2C2C2C"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 8a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1z"
        fill="#2C2C2C"
      />
      <Path d="M14 17a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill="#2C2C2C" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  btnNonChargeable: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G
        clipPath="url(#9wp35m2fxa)"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#979797">
        <Path d="M13 22.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19zm0 1.5c6.075 0 11-4.925 11-11S19.075 2 13 2 2 6.925 2 13s4.925 11 11 11z" />
        <Path d="M10.348 15.652a.75.75 0 0 1 0-1.061l4.243-4.243a.75.75 0 1 1 1.06 1.061l-4.242 4.243a.75.75 0 0 1-1.06 0z" />
        <Path d="M10.348 10.348a.75.75 0 0 1 1.061 0l4.243 4.243a.75.75 0 1 1-1.061 1.06l-4.243-4.242a.75.75 0 0 1 0-1.06z" />
      </G>
      <Defs>
        <ClipPath id="9wp35m2fxa">
          <Path fill="#fff" d="M0 0h26v26H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  btnChargeCaution: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 23c5.523 0 10-4.477 10-10S18.523 3 13 3 3 7.477 3 13s4.477 10 10 10zm0 2c6.627 0 12-5.373 12-12S19.627 1 13 1 1 6.373 1 13s5.373 12 12 12zm0-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0-14a1 1 0 0 0-1 1v8a1 1 0 1 0 2 0V7a1 1 0 0 0-1-1z"
        fill="#979797"
      />
    </Svg>,
  ],
  cautionIcon: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#FFE3DD" />
      <Path
        d="M13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 8a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8z"
        fill="#ED4847"
      />
    </Svg>,
  ],
  hkIcon: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Mask
        id="mask0_3149_14491"
        // style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="1"
        y="1"
        width="20"
        height="20">
        <Circle cx="10" cy="10" r="9" fill="white" />
      </Mask>
      <G mask="url(#mask0_3149_14491)">
        <Path
          d="M24.625 -0.0124512H-3.5V19.1125H24.625V-0.0124512Z"
          fill="#E52620"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.5702 4.22849C11.0546 4.50581 10.8436 5.11302 11.1952 5.63896C11.3452 5.86368 11.4249 6.16012 11.4108 6.4709C11.3921 6.78646 11.303 7.08768 11.0546 7.36977C10.6796 7.89093 9.98115 7.91962 9.8499 8.69896C9.81708 9.05755 9.87334 9.41137 10.1218 9.73171C9.73271 9.34921 9.47959 8.92846 9.39521 8.46468C9.30615 7.98177 9.3999 7.44627 9.71396 6.84862L9.65302 6.81515C9.33427 7.42715 9.23584 7.97699 9.32959 8.47902C9.41865 8.96671 9.68584 9.40659 10.0983 9.80343C9.39052 9.3779 8.93115 8.87109 8.62177 8.05827C8.22334 6.58565 8.88427 5.02218 10.2671 4.41974C10.6796 4.24284 11.1155 4.18546 11.5702 4.22849ZM5.48583 6.91077C5.3124 7.34587 5.23271 7.7953 5.2749 8.25909C5.41552 9.79865 6.66708 10.9222 8.14365 10.9701C8.9874 10.9079 9.59209 10.6067 10.1968 10.0377C9.70459 10.3246 9.22177 10.4585 8.74365 10.3963C8.25615 10.3341 7.77333 10.076 7.30458 9.57871L7.35615 9.52612C7.81552 10.009 8.27958 10.2624 8.75302 10.3198C9.20771 10.3772 9.67177 10.2529 10.1405 9.98034C9.77021 10.1286 9.42802 10.076 9.10458 9.9373C8.42021 9.57393 8.60302 8.87587 8.23271 8.35471C8.04521 8.02959 7.79209 7.8479 7.50615 7.73793C7.2249 7.63274 6.9249 7.6184 6.67177 7.69968C6.08583 7.89093 5.58427 7.50365 5.48583 6.91077ZM6.73271 8.64159L6.98115 8.85674L7.25302 8.67984L7.13115 8.99062L7.37959 9.20099L7.05615 9.17709L6.93896 9.48787L6.85927 9.16274L6.53583 9.14362L6.80771 8.96671L6.73271 8.64159ZM12.4702 15.2349C12.8593 14.9911 13.178 14.6755 13.4124 14.2739C14.1765 12.9447 13.8108 11.2761 12.6436 10.3389C11.9265 9.87515 11.2702 9.74605 10.4546 9.84168C11.0171 9.90862 11.4811 10.0999 11.8374 10.4393C12.1983 10.7884 12.4374 11.2904 12.5311 11.9789L12.4608 11.9885C12.3671 11.3191 12.1374 10.8314 11.7858 10.4919C11.453 10.1716 11.0077 9.98512 10.4733 9.91818C10.8577 10.0234 11.1015 10.2768 11.2843 10.5828C11.6265 11.2904 11.0827 11.7446 11.0827 12.3901C11.0499 12.7678 11.153 13.069 11.3171 13.332C11.4858 13.5902 11.7202 13.7814 11.9686 13.8723C12.5452 14.0779 12.728 14.6994 12.4702 15.2349ZM12.4515 13.0786L12.3718 12.7535L12.0483 12.7296L12.3202 12.5526L12.2405 12.2275L12.489 12.4427L12.7608 12.2658L12.639 12.5718L12.8874 12.7869L12.564 12.763L12.4515 13.0786ZM15.8733 9.44962C15.7843 8.98584 15.6061 8.56987 15.3202 8.21127C14.3686 7.01596 12.728 6.80081 11.4765 7.6184C10.8108 8.1539 10.4686 8.75155 10.2765 9.57871C10.5296 9.05755 10.8624 8.66549 11.289 8.44077C11.7296 8.20649 12.2686 8.14912 12.9249 8.28777L12.9108 8.35949C12.2686 8.22084 11.7436 8.28299 11.3218 8.50293C10.914 8.71809 10.5952 9.08624 10.3515 9.58349C10.5765 9.24402 10.8905 9.09102 11.2327 9.0193C11.9968 8.92846 12.2218 9.61218 12.8124 9.83212C13.1452 9.99468 13.4546 9.99468 13.7499 9.92774C14.0405 9.85602 14.2983 9.68868 14.4624 9.4783C14.8468 8.98105 15.4702 9.01452 15.8733 9.44962ZM13.9046 8.73243L13.5858 8.69896L13.4546 9.00496L13.389 8.67984L13.0702 8.64637L13.3515 8.47902L13.2811 8.1539L13.5202 8.37862L13.7968 8.21127L13.6655 8.51727L13.9046 8.73243ZM5.93583 13.6284C6.50771 13.7336 7.0374 13.3846 7.06552 12.7439C7.07958 12.4761 7.19208 12.1845 7.38427 11.9502C7.58583 11.7111 7.83427 11.5295 8.19521 11.4577C8.7999 11.2761 9.37177 11.6968 9.93427 11.1565C10.1686 10.8936 10.3374 10.578 10.328 10.1668C10.4124 10.7166 10.3655 11.2091 10.1593 11.6299C9.94365 12.0697 9.55459 12.4379 8.95459 12.7152L8.98271 12.7821C9.59677 12.4953 9.99521 12.1176 10.2202 11.6633C10.4358 11.2187 10.4827 10.7023 10.389 10.1286C10.703 10.9127 10.7686 11.6012 10.5343 12.4427C9.98583 13.8627 8.5374 14.6899 7.08427 14.2978C6.65771 14.1735 6.27333 13.9488 5.93583 13.6284ZM7.94209 13.0116L8.26083 13.0451L8.32646 13.3702L8.45771 13.0642L8.77646 13.0977L8.5374 12.8778L8.66865 12.5718L8.39208 12.7391L8.15302 12.5144L8.22334 12.8395L7.94209 13.0116ZM10.3421 5.97843L10.0702 6.15534L9.82646 5.94018L9.90146 6.2653L9.6249 6.43743L9.94833 6.46134L10.0233 6.78646L10.1452 6.48046L10.4686 6.50915L10.2249 6.29399L10.3421 5.97843Z"
          fill="white"
        />
      </G>
    </Svg>,
  ],
  naverIcon: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#a5avg8trsa)">
        <Rect
          x="1"
          y="1"
          width="18"
          height="18"
          rx="3"
          fill="url(#zzscewo07b)"
        />
        <Rect
          x="1"
          y="1"
          width="18"
          height="18"
          rx="3"
          fill="url(#gzi4ew4roc)"
        />
        <Path
          d="M11.427 10.282 8.446 6H6v8h2.573V9.718L11.53 14H14V6h-2.573v4.282z"
          fill="#fff"
        />
      </G>
      <Defs>
        <LinearGradient
          id="zzscewo07b"
          x1="5"
          y1="13"
          x2="17"
          y2="13"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#05C2E7" />
          <Stop offset="1" stopColor="#4764E6" />
        </LinearGradient>
        <LinearGradient
          id="gzi4ew4roc"
          x1="10"
          y1="4"
          x2="10"
          y2="15"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#17DC34" />
          <Stop offset="1" stopColor="#17DC34" stopOpacity="0" />
        </LinearGradient>
        <ClipPath id="a5avg8trsa">
          <Path fill="#fff" transform="translate(1 1)" d="M0 0h18v18H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  sortTriangle: [
    <Svg
      width="6"
      height="4"
      viewBox="0 0 6 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M3.4 3.467a.5.5 0 0 1-.8 0L.6.8A.5.5 0 0 1 1 0h4a.5.5 0 0 1 .4.8l-2 2.667z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  selected: [
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="11" cy="11" r="11" fill="#fff" />
      <Path
        d="M5 10.5 9.696 15 17 8"
        stroke="#2A7FF6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>,
  ],
  threeDots: [
    <Svg
      width="62"
      height="62"
      viewBox="0 0 62 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="31" cy="31" r="30" fill="url(#y2wbnymkxa)" />
      <Circle cx="17" cy="31" r="3" fill="#4F99FF" />
      <Circle cx="31" cy="31" r="3" fill="#4F99FF" />
      <Circle cx="45" cy="31" r="3" fill="#4F99FF" />
      <Defs>
        <LinearGradient
          id="y2wbnymkxa"
          x1="13.222"
          y1="6.556"
          x2="61"
          y2="71"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#E1EDFF" />
          <Stop offset="1" stopColor="#F8FAFE" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
  clear: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="8" cy="8" r="8" fill="#D8D8D8" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4.727 4.727 4 12 11.273l-.727.727L4 4.727z"
        fill="#fff"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m11.273 4 .727.727L4.727 12 4 11.273 11.273 4z"
        fill="#fff"
      />
    </Svg>,
  ],
  checkedBlueSmall: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.909 5.247a1 1 0 0 1 .095 1.41l-3.82 4.377a1 1 0 0 1-1.467.043l-2.43-2.47a1 1 0 0 1 1.426-1.402l1.673 1.7 3.112-3.563a1 1 0 0 1 1.41-.095z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  hkCheck: [
    <Svg
      width="96"
      height="110"
      viewBox="0 0 96 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="48" cy="49" r="45" fill="url(#vide1vqrca)" />
      <Mask
        id="q2ye1kc1tb"
        // style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="4"
        y="4"
        width="90"
        height="90">
        <Circle cx="49" cy="49" r="45" fill="#E1EDFF" />
      </Mask>
      <G mask="url(#q2ye1kc1tb)">
        <Path
          d="M19.963 57.998c-14.95-.72-16.87-24.306-16.96-37.003A.99.99 0 0 1 4 20h34.835c.586 0 1.044.517 1.005 1.101C37.954 49.41 57.076 56.331 67 56.813c-10.553.24-46.225 1.167-46.988 1.187-.024 0-.025 0-.049-.002z"
          fill="url(#hs3a9q2hvc)"
        />
      </G>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41.923 38.12c3.74 11.468 12.241 16.986 19.435 19.106L20 58c1.442-.245 4.168-1.074 7.227-6.337 1.083-1.863 1.599-4.12 2.087-6.257C30.206 41.506 31.007 38 35 38l6.923.12z"
        fill="url(#xaf2souxsd)"
      />
      <Path
        d="m90.942 97.6-35.533 3.361a.874.874 0 0 1-.707-.229c-5.357-5.23-9.533-32.083-10.986-42.72C41.983 45.328 40 39 35 38h34.048c3.095 0 6.81 1.483 9.285 8.153 3.06 8.24 5.051 40.914 12.958 50.56.268.328.072.847-.349.887z"
        fill="url(#ni5d2yf76e)"
      />
      <Ellipse cx="52.5" cy="107.5" rx="35" ry="2.5" fill="#F5F5F5" />
      <Path
        d="M67 60h7"
        stroke="url(#wcul11xfbf)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M66 53h7"
        stroke="url(#r5wuxy2a2g)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="m55 70 20-.5"
        stroke="url(#lkqf4ez7ah)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="m57 79 20-1"
        stroke="url(#l9eszh4uli)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M60 88.5 80 87"
        stroke="url(#s3myjj4ycj)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M50.214 52.179A1 1 0 0 1 51.198 51h8.967a1 1 0 0 1 .984.821l1.637 9A1 1 0 0 1 61.802 62h-8.967a1 1 0 0 1-.984-.821l-1.637-9z"
        fill="url(#yn2u1dqxtk)"
      />
      <Path
        d="m85.395.11-25 1.308A2 2 0 0 0 58.5 3.415V25.79c0 .929 1.157 1.356 1.76.65l2.968-3.475a1 1 0 0 1 .69-.348l21.724-1.55a2 2 0 0 0 1.858-1.995V2.107A2 2 0 0 0 85.395.11z"
        fill="url(#21mb9errsl)"
      />
      <Path
        d="M72.5 5.522a1.5 1.5 0 1 1 3 0v5.956a1.5 1.5 0 0 1-3 0V5.522z"
        fill="#fff"
      />
      <Circle cx="74" cy="16" r="1.5" fill="#fff" />
      <Defs>
        <LinearGradient
          id="vide1vqrca"
          x1="82"
          y1="75"
          x2="20.5"
          y2="13"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#D2E4FF" />
          <Stop offset="1" stopColor="#EBF3FF" />
        </LinearGradient>
        <LinearGradient
          id="hs3a9q2hvc"
          x1="-14.5"
          y1="3"
          x2="50.424"
          y2="44.048"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#B5D4FF" />
        </LinearGradient>
        <LinearGradient
          id="xaf2souxsd"
          x1="33.265"
          y1="40.353"
          x2="56.712"
          y2="54.016"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2A7FF6" />
          <Stop offset="1" stopColor="#BAD7FF" />
        </LinearGradient>
        <LinearGradient
          id="ni5d2yf76e"
          x1="60.5"
          y1="64.151"
          x2="90.612"
          y2="97.755"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#E8F1FF" />
        </LinearGradient>
        <LinearGradient
          id="wcul11xfbf"
          x1="63.25"
          y1="63"
          x2="79.782"
          y2="62.812"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#4F99FF" />
          <Stop offset="1" stopColor="#4F99FF" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="r5wuxy2a2g"
          x1="62.25"
          y1="56"
          x2="78.782"
          y2="55.812"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#4F99FF" />
          <Stop offset="1" stopColor="#4F99FF" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="lkqf4ez7ah"
          x1="53.5"
          y1="70"
          x2="86"
          y2="69"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#4F99FF" />
          <Stop offset="1" stopColor="#4F99FF" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="l9eszh4uli"
          x1="55.5"
          y1="79"
          x2="88"
          y2="78"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#4F99FF" />
          <Stop offset="1" stopColor="#4F99FF" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="s3myjj4ycj"
          x1="60"
          y1="89"
          x2="90.5"
          y2="85.5"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#4F99FF" />
          <Stop offset="1" stopColor="#4F99FF" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="yn2u1dqxtk"
          x1="65"
          y1="60.5"
          x2="49.403"
          y2="59.39"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FAE25C" />
          <Stop offset="1" stopColor="#F4B645" />
        </LinearGradient>
        <LinearGradient
          id="21mb9errsl"
          x1="87.5"
          y1=".5"
          x2="58.5"
          y2="27.5"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FC6B4F" />
          <Stop offset="1" stopColor="#DE2400" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
  cashHistoryPlus: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 5a1 1 0 0 0-2 0v2H5a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0V9h2a1 1 0 1 0 0-2H9V5z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  rightAngleBracket: [
    <Svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M4.5.5 9 5 4.5 9.5"
        stroke="#2C2C2C"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>,
  ],
  imgBoard: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M2 10a8 8 0 0 1 8-8h6a8 8 0 0 1 8 8v6a8 8 0 0 1-8 8H3a1 1 0 0 1-1-1V10z"
        stroke="#2C2C2C"
        strokeWidth="2"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 10a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1zM8 16a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  fbMsg: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#810bj2rxba)">
        <Path
          d="M12 0C5.241 0 0 4.953 0 11.64c0 3.498 1.434 6.522 3.768 8.61.195.174.315.42.321.684l.066 2.136a.96.96 0 0 0 1.347.849l2.382-1.05a.964.964 0 0 1 .642-.048c1.095.3 2.259.462 3.474.462 6.759 0 12-4.953 12-11.64S18.759 0 12 0z"
          fill="url(#6baev6dpdb)"
        />
        <Path
          d="m4.794 15.045 3.525-5.592a1.8 1.8 0 0 1 2.604-.48l2.805 2.103a.72.72 0 0 0 .867-.003L18.38 8.2c.504-.384 1.164.222.828.76l-3.528 5.588a1.8 1.8 0 0 1-2.604.48l-2.805-2.103a.72.72 0 0 0-.867.003l-3.786 2.874c-.504.384-1.164-.219-.825-.756z"
          fill="#fff"
        />
      </G>
      <Defs>
        <RadialGradient
          id="6baev6dpdb"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(26.4 0 0 26.4 4.02 24)">
          <Stop stop-color="#09F" />
          <Stop offset=".6" stop-color="#A033FF" />
          <Stop offset=".9" stop-color="#FF5280" />
          <Stop offset="1" stop-color="#FF7061" />
        </RadialGradient>
        <ClipPath id="810bj2rxba">
          <Path fill="#fff" d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  chatTalk: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 1a8 8 0 0 0-8 8v.1A5.002 5.002 0 0 0 6 19a1 1 0 0 0 1-1V9a6 6 0 1 1 12 0v9a5 5 0 0 1-5 5 1 1 0 1 0 0 2 7.001 7.001 0 0 0 6.941-6.088A5.002 5.002 0 0 0 21 9.1V9a8 8 0 0 0-8-8zm8 10.17v5.66a3.001 3.001 0 0 0 0-5.66zM3 14c0-1.306.835-2.418 2-2.83v5.66A3.001 3.001 0 0 1 3 14z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  localNotice1: [
    <Svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M8.11621 1.66938C8.49182 0.959892 9.50818 0.959894 9.88379 1.66938L17.2229 15.5321C17.5755 16.1981 17.0927 17 16.3391 17H1.66091C0.90733 17 0.424529 16.1981 0.777117 15.5321L8.11621 1.66938Z"
        fill="#2A7FF6"
      />
      <Path
        d="M10 14C10 14.5523 9.55228 15 9 15C8.44772 15 8 14.5523 8 14C8 13.4477 8.44772 13 9 13C9.55228 13 10 13.4477 10 14Z"
        fill="white"
      />
      <Path
        d="M8.02932 6.52774C8.0134 6.24113 8.24151 6 8.52855 6H9.47145C9.75849 6 9.9866 6.24113 9.97068 6.52773L9.6929 11.5277C9.67818 11.7927 9.45904 12 9.19367 12H8.80633C8.54096 12 8.32182 11.7927 8.3071 11.5277L8.02932 6.52774Z"
        fill="white"
      />
    </Svg>,
  ],
  localNotice2: [
    <Svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M17 7.412c0 3.56-4.631 7.832-6.846 9.672a1.792 1.792 0 0 1-2.308 0C5.631 15.244 1 10.97 1 7.412 1 2.734 4.582 0 9 0s8 2.734 8 7.412z"
        fill="#2A7FF6"
      />
      <Circle cx="9" cy="7.25" r="2" fill="#fff" />
    </Svg>,
  ],
  localNoticePopup: [
    <Svg
      width="214"
      height="74"
      viewBox="0 0 214 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M0 10C0 4.477 4.477 0 10 0h194c5.523 0 10 4.477 10 10v54c0 5.523-4.477 10-10 10H10C4.477 74 0 69.523 0 64V10z"
        fill="#fff"
      />
      <Path
        d="M33.012 29.229c-.285.603-.882.927-1.765.927-1.161 0-1.916-.857-1.974-2.21v-.05h4.92v-.419c0-2.126-1.124-3.44-2.97-3.44-1.88 0-3.086 1.396-3.086 3.548 0 2.165 1.187 3.536 3.085 3.536 1.498 0 2.565-.724 2.882-1.892h-1.092zm-1.803-4.227c1.086 0 1.81.8 1.835 2.012h-3.77c.082-1.213.844-2.012 1.935-2.012zm4.321 3.605c.121 1.58 1.46 2.609 3.403 2.609 2.094 0 3.421-1.073 3.421-2.755 0-1.346-.762-2.082-2.66-2.558l-.958-.254c-1.263-.324-1.765-.736-1.765-1.454 0-.926.806-1.536 2.025-1.536 1.143 0 1.917.559 2.076 1.498h1.149c-.095-1.479-1.416-2.532-3.187-2.532-1.936 0-3.237 1.053-3.237 2.608 0 1.302.717 2.05 2.374 2.47l1.174.304c1.264.318 1.835.813 1.835 1.594 0 .907-.908 1.574-2.14 1.574-1.3 0-2.215-.61-2.354-1.568H35.53zM45.323 31v-9.16H44.18V31h1.143zm11.284 0v-9.16h-1.326l-3.136 7.643h-.102l-3.135-7.643H47.58V31h1.066v-6.995h.077L51.611 31h.965l2.888-6.995h.076V31h1.066zM69.96 20.262v6.929h1.08v-6.929h-1.08zm.624 3.003v.897h2.171v-.897h-2.17zm-7.15 4.459v.767h6.552v.897H63.46v1.963h1.053v-1.248h6.526v-2.379h-7.605zm.026 3.393v.767h8.034v-.767H63.46zm1.547-6.032v1.495h1.08v-1.495h-1.08zm-3.016 1.846c2.054 0 4.85-.013 7.358-.455l-.09-.689c-2.419.338-5.305.351-7.398.351l.13.793zm.17-5.772v.767h6.746v-.767H62.16zm3.38 1.131c-1.678 0-2.744.572-2.744 1.547s1.066 1.547 2.743 1.547c1.664 0 2.73-.572 2.73-1.547s-1.066-1.547-2.73-1.547zm0 .715c1.052 0 1.715.312 1.715.832s-.663.845-1.716.845-1.729-.325-1.729-.845.676-.832 1.73-.832zm-.534-2.86v1.417h1.08v-1.417h-1.08zm11.764.78v1.209c0 1.794-1.17 3.367-2.964 4.004l.56.884c2.014-.754 3.301-2.613 3.301-4.888v-1.209h-.897zm.195 0v1.17c0 2.132 1.261 3.861 3.16 4.576l.584-.845c-1.716-.598-2.86-2.067-2.86-3.731v-1.17h-.884zm5.434-.663v6.955h1.08v-6.955h-1.08zm-2.782 7.293c-2.43 0-3.926.819-3.926 2.223s1.495 2.21 3.926 2.21c2.418 0 3.913-.806 3.913-2.21s-1.495-2.223-3.913-2.223zm0 .858c1.768 0 2.847.507 2.847 1.365s-1.079 1.365-2.847 1.365-2.847-.507-2.847-1.365 1.08-1.365 2.847-1.365zm.234-5.668v.897h2.782v-.897h-2.782zm8.891 4.524v1.911h1.08v-1.911h-1.08zm4.94-7.007v11.752h1.08V20.262h-1.08zm.728 4.992v.91h2.171v-.91h-2.17zm-8.697 4.524c2.054 0 4.81-.013 7.345-.468l-.09-.806c-2.432.351-5.305.377-7.41.377l.155.897zm.04-8.099v.871h7.032v-.871h-7.033zm3.522 1.56c-1.638 0-2.756.858-2.756 2.171 0 1.326 1.118 2.171 2.756 2.171 1.638 0 2.77-.845 2.77-2.171 0-1.313-1.132-2.171-2.77-2.171zm0 .832c1.053 0 1.755.533 1.755 1.339 0 .806-.702 1.339-1.755 1.339s-1.742-.533-1.742-1.339c0-.806.69-1.339 1.742-1.339zm-.533-3.796v1.989h1.08v-1.989h-1.08zm13.597 4.55v.897h2.223v-.897h-2.223zm4.186-4.563v11.752h1.04V20.262h-1.04zm-2.327.247v10.92h1.027v-10.92h-1.027zm-3.978.728c-1.52 0-2.496 1.573-2.496 4.095s.975 4.095 2.496 4.095 2.509-1.573 2.509-4.095-.988-4.095-2.509-4.095zm0 1.001c.936 0 1.521 1.196 1.521 3.094s-.585 3.094-1.521 3.094c-.923 0-1.508-1.196-1.508-3.094s.585-3.094 1.508-3.094zm21.374-1.976v6.084h1.079v-6.084h-1.079zm-6.513 6.682v.845h6.539v1.17h-6.513v2.418h1.053v-1.612h6.526v-2.821h-7.605zm.026 4.082v.858h7.969v-.858h-7.969zm1.001-10.426v.897c0 1.703-1.209 3.263-2.977 3.887l.533.858c1.989-.728 3.341-2.574 3.341-4.745V20.6h-.897zm.195 0v.897c0 2.106 1.352 3.835 3.328 4.511l.533-.845c-1.742-.572-2.977-2.041-2.977-3.666V20.6h-.884zm17.575-.338v11.752h1.04V20.262h-1.04zm-1.859 4.719v.897h2.249v-.897h-2.249zm-.689-4.459v10.894h1.014V20.522h-1.014zm-6.292 1.209v.884h5.434v-.884h-5.434zm-.104 7.397c1.534 0 3.978-.052 5.837-.403l-.078-.793c-1.794.234-4.342.286-5.889.286l.13.91zm1.105-6.825v6.149h.988v-6.149h-.988zm2.444 0v6.149h.988v-6.149h-.988zm17.198-2.028v7.267h1.027v-7.267h-1.027zm-1.911 3.211v.884h2.223v-.884h-2.223zm-.585-3.042v6.929h1.027v-6.929h-1.027zm-6.435 1.157v.858h5.954v-.858h-5.954zm2.99 1.443c-1.482 0-2.509.793-2.509 2.015s1.027 2.015 2.509 2.015c1.469 0 2.496-.793 2.496-2.015s-1.027-2.015-2.496-2.015zm0 .819c.91 0 1.534.468 1.534 1.196s-.624 1.209-1.534 1.209c-.923 0-1.547-.481-1.547-1.209 0-.728.624-1.196 1.547-1.196zm-.533-3.549v1.794h1.053v-1.794h-1.053zm.702 7.579v.403c0 1.066-.884 2.275-2.353 2.769l.507.806c1.703-.611 2.678-2.093 2.678-3.575v-.403h-.832zm.247 0v.403c0 1.495.754 3.055 2.431 3.679l.455-.819c-1.404-.533-2.093-1.729-2.093-2.86v-.403h-.793zm4.069 0v.403c0 .975-.715 2.262-2.08 2.86l.442.819c1.664-.676 2.431-2.353 2.431-3.679v-.403h-.793zm.221 0v.403c0 1.56.962 2.99 2.678 3.575l.52-.806c-1.482-.468-2.366-1.625-2.366-2.769v-.403h-.832zm5.589-.585v4.55h7.891v-4.55h-1.079v1.365h-5.746v-1.365h-1.066zm1.066 2.197h5.746v1.482h-5.746v-1.482zm-2.418-3.887v.871h10.621v-.871h-10.621zm4.771-5.226v.52c0 1.482-2.041 2.743-4.16 3.029l.39.845c2.418-.364 4.693-1.833 4.693-3.874v-.52h-.923zm.169 0v.52c0 2.015 2.288 3.51 4.68 3.874l.403-.845c-2.093-.286-4.16-1.573-4.16-3.029v-.52h-.923zm15.495-.13v11.752h1.079V20.262h-1.079zm-7.8 1.144v7.28h1.066v-7.28h-1.066zm0 6.643v.936h.962c1.859 0 3.718-.143 5.759-.559l-.13-.923c-1.989.416-3.848.546-5.629.546h-.962zm19.083-7.8v11.778h1.092V20.249h-1.092zm.832 4.641v.91h2.184v-.91h-2.184zm-8.281 3.302v.91h.923c2.21 0 3.757-.065 5.564-.403l-.117-.91c-1.755.325-3.276.403-5.447.403h-.923zm0-6.799v7.202h1.066v-6.318h4.394v-.884h-5.46zm12.667 9.67a.827.827 0 0 0 .825-.825.823.823 0 0 0-.825-.825.828.828 0 0 0-.826.825c0 .451.375.826.826.826z"
        fill="#2C2C2C"
      />
      <Path
        d="M97.66 56.204v1.862h1.862v-1.862H97.66zm5.488-5.908v8.82h1.862v-8.82h-1.862zm1.204 3.696v1.526h2.282v-1.526h-2.282zm-9.576 4.872c2.268-.014 5.236-.042 7.938-.504l-.14-1.274c-2.618.322-5.684.336-8.008.336l.21 1.442zm1.442.77v1.428h6.93v2.184h1.862v-3.612h-8.792zm-1.316-8.4v1.33h7.35v-1.33h-7.35zm3.682 1.638c-1.918 0-3.164.742-3.164 1.932s1.246 1.932 3.164 1.932c1.904 0 3.15-.742 3.15-1.932s-1.246-1.932-3.15-1.932zm0 1.218c.868 0 1.386.224 1.386.714 0 .462-.518.714-1.386.714-.882 0-1.4-.252-1.4-.714 0-.49.518-.714 1.4-.714zm-.924-3.906v1.652h1.862v-1.652H97.66zm18.765.112v9.31h1.876v-9.31h-1.876zm-6.762 11.242v1.484h8.96v-1.484h-8.96zm0-2.87v3.472h1.862v-3.472h-1.862zm1.582-7.56c-1.988 0-3.528 1.372-3.528 3.29 0 1.904 1.54 3.29 3.528 3.29s3.514-1.386 3.514-3.29c0-1.918-1.526-3.29-3.514-3.29zm0 1.61c.952 0 1.694.616 1.694 1.68 0 1.05-.742 1.666-1.694 1.666-.966 0-1.708-.616-1.708-1.666 0-1.064.742-1.68 1.708-1.68z"
        fill="#007AFF"
      />
    </Svg>,
  ],
  downArrow: [
    <Svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9.5 3 5 7.5.5 3"
        stroke="#2C2C2C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  upArrow: [
    <Svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M.5 5 5 .5 9.5 5"
        stroke="#2C2C2C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  rightArrow20: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m8 4 5.657 5.657L8 15.314"
        stroke="#2C2C2C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  notice: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#y161wjysma)">
        <Path
          d="M9.122 1.442a1 1 0 0 1 1.756 0l8.315 15.245a1 1 0 0 1-.878 1.48H1.686a1 1 0 0 1-.878-1.48L9.122 1.443z"
          fill="#FFC82D"
        />
        <Path
          d="M11 15a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM8.545 6.542A.5.5 0 0 1 9.043 6h1.914a.5.5 0 0 1 .498.542l-.417 5a.5.5 0 0 1-.498.458H9.46a.5.5 0 0 1-.498-.459l-.417-5z"
          fill="#2C2C2C"
        />
      </G>
      <Defs>
        <ClipPath id="y161wjysma">
          <Path fill="#fff" d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  noticeFlag: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 3a1 1 0 0 0-1 1v17l4-4h15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3z"
        fill="#0029FF"
      />
      <Circle cx="12" cy="13.8" r="1" fill="#fff" />
      <Rect x="11" y="5" width="2" height="7" rx="1" fill="#fff" />
    </Svg>,
  ],
  koreaFlag: [
    <Svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle
        cx="50"
        cy="49.911"
        r="44.078"
        fill="url(#1fb1oli7qa)"
        stroke="#EEE"
      />
      <Path
        d="M64.524 54.554a8.053 8.053 0 0 1-.596 3.048 15.994 15.994 0 0 1-2.09 2.96 15.827 15.827 0 0 1-11.754 5.305c-8.711.046-15.884-7.033-15.95-15.745-.02-2.57.574-5.003 1.641-7.157a8.063 8.063 0 0 0 14.536 6.727c.523-.852 1.217-1.593 2.078-2.1a8.063 8.063 0 0 1 12.132 6.96l.003.002z"
        fill="#194C94"
      />
      <Path
        d="M63.928 57.6a8.063 8.063 0 0 0-11.537-10.008c-.86.505-1.555 1.248-2.078 2.1a8.09 8.09 0 0 1-1.172 1.484 8.063 8.063 0 0 1-13.363-8.21 15.91 15.91 0 0 1 2.601-3.766 15.823 15.823 0 0 1 11.684-5.066c8.676.033 15.769 7.127 15.803 15.803.01 2.777-.692 5.39-1.936 7.664h-.002z"
        fill="#F1694F"
      />
      <Path
        d="m26.176 24.746-8.697 12.991 2.122 1.421 8.697-12.991-2.122-1.421zM29.407 26.909 20.709 39.9l2.123 1.421L31.53 28.33l-2.122-1.421zM32.636 29.072 23.94 42.063l2.123 1.421 8.697-12.991-2.123-1.421zM19.599 60.844l-2.123 1.42 8.697 12.992 2.123-1.42-8.697-12.992zM22.835 58.674l-2.123 1.42 3.97 5.932 2.123-1.42-3.97-5.932zM27.556 65.742l-2.123 1.42 3.968 5.933 2.123-1.42-3.968-5.933zM26.06 56.517l-2.123 1.421 8.697 12.992 2.123-1.421-8.697-12.992zM75.657 67.93l-3.954 5.906 2.122 1.421 3.955-5.905-2.123-1.421zM80.402 60.845 76.414 66.8l2.124 1.422 3.987-5.955-2.123-1.422zM72.443 65.742l-3.971 5.93 2.122 1.422 3.972-5.93-2.123-1.422zM77.17 58.682l-3.97 5.93 2.123 1.421 3.97-5.929-2.123-1.422zM69.197 63.603l-3.957 5.904 2.123 1.423 3.957-5.904-2.123-1.423zM76.061 57.937l-3.986 5.956-2.124-1.424 3.988-5.954 2.122 1.422zM73.822 24.746 71.7 26.167l3.971 5.93 2.123-1.421-3.972-5.93zM78.55 31.804l-2.122 1.422 3.971 5.93 2.123-1.421-3.972-5.93zM70.595 26.916l-2.123 1.42 8.697 12.992 2.123-1.42-8.697-12.992zM67.363 29.07l-2.124 1.422 3.947 5.894 2.124-1.422-3.947-5.894zM76.061 42.065l-2.123 1.422-3.995-5.968 2.124-1.42 3.994 5.966z"
        fill="#2C2C2C"
      />
      <Defs>
        <LinearGradient
          id="1fb1oli7qa"
          x1="23"
          y1="11"
          x2="56.999"
          y2="76"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#F3F3F3" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
  threeArrows: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M6 13 2 8l4-5m4 10L6 8l4-5m4 10-4-5 4-5"
        stroke="#2C2C2C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  btnHeaderCart: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 3h3.18l2.84 14.196A1 1 0 0 0 8 18h12a1 1 0 0 0 .94-.658l4-11A1 1 0 0 0 24 5H6.62l-.64-3.196A1 1 0 0 0 5 1H1v2zm7.82 13-1.8-9h15.552L19.3 16H8.82zM10 21a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-3 1A3 3 0 1 1 13 22 3 3 0 0 1 7 22zm11-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-3 1A3 3 0 1 1 21 22 3 3 0 0 1 15 22z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  iconArrowRight: [
    <Svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M5 .5 9.5 5 5 9.5"
        stroke="#979797"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  iconArrowUp: [
    <Svg
      width="12"
      height="11"
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1.5 5.83 6 1.4l4.5 4.43"
        stroke="#979797"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  btnNotice: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.024 1.922C19.347 1.247 21 2.18 21 3.725v17.55c0 1.545-1.653 2.478-2.976 1.803-2.08-1.063-5.76-2.759-8.634-3.155a111.813 111.813 0 0 0-6.525-.71A2.018 2.018 0 0 1 1 17.203V7.796c0-1.06.822-1.928 1.865-2.009 1.222-.094 3.571-.304 6.525-.71 2.873-.396 6.554-2.092 8.634-3.155zm.921 1.777-.01.004c-2.076 1.06-6.027 2.908-9.272 3.355-3.002.413-5.392.627-6.644.723l-.009.002a.024.024 0 0 0-.006.006L3 7.793v9.413s.001.003.004.005a.023.023 0 0 0 .006.005l.009.002c1.252.097 3.642.31 6.644.724 3.245.447 7.196 2.295 9.271 3.354l.011.005a.03.03 0 0 0 .008 0 .07.07 0 0 0 .047-.023V3.722a.07.07 0 0 0-.047-.023.03.03 0 0 0-.008 0z"
        fill="#2C2C2C"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.136 17.51a1 1 0 0 1 .855 1.126l-.002.01c.005.097.011.268.011.635C5 21.375 6.617 23 8.523 23c1.74 0 3.235-1.35 3.486-3.18a1 1 0 0 1 1.982.27C13.615 22.835 11.34 25 8.523 25 5.433 25 3 22.399 3 19.28c0-.401-.007-.522-.01-.56v-.004a1.368 1.368 0 0 1 .018-.34l.001-.012a1 1 0 0 1 1.127-.855zm.85 1.069v.005-.005zM24 9a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  imgFail: [
    <Svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50 25c0 13.807-11.193 25-25 25S0 38.807 0 25 11.193 0 25 0s25 11.193 25 25z"
        fill="#F8F8F8"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.9 17.929A2 2 0 0 0 32.07 15.1L25 22.172 17.929 15.1A2 2 0 0 0 15.1 17.93l7.07 7.07-7.07 7.072a2 2 0 0 0 2.828 2.828L25 27.83l7.071 7.07a2 2 0 1 0 2.829-2.828L27.828 25l7.072-7.071z"
        fill="#EE4423"
      />
    </Svg>,
  ],
};

export default pressIcons;
