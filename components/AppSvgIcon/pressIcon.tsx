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
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M4.5.5 9 5 4.5 9.5"
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
  iconTrash: [
    <Svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15.5 3.502V14.27c0 1.784-1.465 3.23-3.273 3.23H6.773c-1.808 0-3.273-1.446-3.273-3.23V3.477M1 3.5h17"
        stroke="#2C2C2C"
      />
      <Rect x="7" y="1.5" width="5" height="2" rx="1" stroke="#2C2C2C" />
      <Path d="M6.5 7v6M9.5 7v6M12.5 7v6" stroke="#2C2C2C" />
    </Svg>,
  ],
  iconArrowDown: [
    <Svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M.5 3 5 7.5 9.5 3"
        stroke="#979797"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  iconArrowRightBlack: [
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
  imgCheck: [
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
        d="m15 24 9 9 11-16"
        stroke="#2A7FF6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  btnSearchOn: [
    <Svg
      width="15"
      height="16"
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="6.5" cy="6.5" r="6" stroke="#2C2C2C" />
      <Path
        d="M10.126 11.126a.432.432 0 0 1 .61 0l4.138 4.137a.432.432 0 0 1-.61.61l-4.138-4.136a.432.432 0 0 1 0-.61z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  btnSearchCancel: [
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
  btnSearchOff: [
    <Svg
      width="15"
      height="16"
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="6.5" cy="6.5" r="6" stroke="#979797" />
      <Path
        d="M10.126 11.126a.432.432 0 0 1 .61 0l4.138 4.137a.432.432 0 0 1-.61.61l-4.138-4.136a.432.432 0 0 1 0-.61z"
        fill="#979797"
      />
    </Svg>,
  ],
  btnSearchBlue: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.923 6.77a4.154 4.154 0 1 1-8.307 0 4.154 4.154 0 0 1 8.307 0zm-.567 5a6.154 6.154 0 1 1 1.414-1.414l3.706 3.706a1 1 0 1 1-1.414 1.414l-3.706-3.706z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  btnCancel: [
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
        fill="#2C2C2C"
      />
      <Rect
        x=".697"
        y="1.404"
        width="1"
        height="14"
        rx=".5"
        transform="rotate(-45 .697 1.404)"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  btnCancelWhite: [
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
        fill="#fff"
      />
      <Rect
        x=".697"
        y="1.404"
        width="1"
        height="14"
        rx=".5"
        transform="rotate(-45 .697 1.404)"
        fill="#fff"
      />
    </Svg>,
  ],
  btnBoxCancel: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path d="M0 0h17a3 3 0 0 1 3 3v17H0V0z" fill="#000" fillOpacity=".4" />
      <Path
        d="M3.99 3.282 16.716 16.01l-.707.707L3.282 3.99l.708-.707z"
        fill="#fff"
      />
      <Path
        d="M16.718 3.99 3.99 16.716l-.708-.707L16.01 3.282l.707.707z"
        fill="#fff"
      />
    </Svg>,
  ],
  btnPhotoPlus: [
    <Svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path fill="#2C2C2C" d="M0 9h19v1H0z" />
      <Path fill="#2C2C2C" d="M10 0v19H9V0z" />
    </Svg>,
  ],
  btnReply: [
    <Svg
      width="30"
      height="10"
      viewBox="0 0 30 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 .5a.5.5 0 0 1 1 0V9h27.293l-4.94-4.94a.5.5 0 1 1 .708-.706l5.657 5.656a.5.5 0 0 1 .061.075.5.5 0 0 1-.279.915H0V.5z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  btnAlarm: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2a1 1 0 1 1 2 0v1c0 .02 0 .038-.002.057C18.5 3.572 22 7.529 22 12.334V20h2a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2h2v-7.666c0-4.805 3.5-8.762 8.002-9.277A.972.972 0 0 1 12 3V2zM6 20h14v-7.666C20 8.214 16.798 5 13 5s-7 3.214-7 7.334V20zm7 5a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  btnBack: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m10 21-9-9 9-9"
        stroke="#2C2C2C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  openFaceBookEng: [
    <Svg
      width="198"
      height="52"
      viewBox="0 0 198 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#u2hpsi98ta)">
        <Rect width="198" height="52" rx="26" fill="#fff" />
        <G clipPath="url(#thej7yl1eb)">
          <Path
            d="M26 6C14.735 6 6 14.255 6 25.4c0 5.83 2.39 10.87 6.28 14.35.325.29.525.7.535 1.14l.11 3.56a1.6 1.6 0 0 0 2.245 1.415l3.97-1.75c.335-.15.715-.175 1.07-.08 1.825.5 3.765.77 5.79.77 11.265 0 20-8.255 20-19.4C46 14.26 37.265 6 26 6z"
            fill="url(#tqobekilmc)"
          />
          <Path
            d="m13.99 31.075 5.875-9.32a3 3 0 0 1 4.34-.8l4.675 3.505a1.2 1.2 0 0 0 1.445-.005l6.31-4.79c.84-.64 1.94.37 1.38 1.265l-5.88 9.315a3 3 0 0 1-4.34.8L23.12 27.54a1.2 1.2 0 0 0-1.445.005l-6.31 4.79c-.84.64-1.94-.365-1.375-1.26z"
            fill="#fff"
          />
        </G>
        <Path
          d="M82.78 30.408h1.984V19.352h-1.04L80.94 20.6v1.152l1.84-.368v9.024zm4.963-6.608h1.952v-1.888h-1.952V23.8zm0 5.792h1.952v-1.888h-1.952v1.888zm5.145.816h1.984V19.352h-1.04L91.048 20.6v1.152l1.84-.368v9.024zm9.488-.064h1.984V19.368h-1.984v10.976zm4.61 0h1.84v-6.4c.496-.24 1.216-.448 1.856-.448 1.12 0 1.392.336 1.392 1.168v5.68h1.856v-6.112c0-1.632-.816-2.272-2.4-2.272-.992 0-2 .368-2.704.88h-.064v-.736h-1.776v8.24zm14.505 2.384h1.824V22.536c-.736-.32-1.76-.576-3.264-.576-2.384 0-4.208 1.04-4.208 4.32v.224c0 2.96 1.728 3.984 3.36 3.984 1.072 0 1.76-.32 2.192-.64h.096v2.88zm-1.68-3.696c-1.264 0-2.08-.592-2.08-2.656v-.288c0-2.048.864-2.752 2.208-2.752.624 0 1.2.144 1.552.24v4.928c-.32.24-.88.528-1.68.528zm8.309 1.456c1.04 0 1.84-.368 2.528-.864h.08l.16.72h1.6v-8.24h-1.84v6.4c-.528.24-1.12.496-1.84.496-1.024 0-1.344-.368-1.344-1.264v-5.632h-1.84v5.984c0 1.616.896 2.4 2.496 2.4zm6.747-.144h1.856v-8.24h-1.856v8.24zm0-9.6h1.872v-1.68h-1.872v1.68zm4.272 9.6h1.84v-6.128c.528-.336 1.264-.544 2-.544.192 0 .464.016.672.048v-1.632c-.08-.032-.288-.048-.512-.048-.864 0-1.712.432-2.16 1.024h-.064v-.96h-1.776v8.24zm7.17 2.368c1.52 0 2.32-.576 2.864-2.144l3.184-8.464h-1.776l-1.92 5.344h-.064l-2.08-5.344h-1.952l3.104 7.632-.224.576c-.288.784-.784.976-1.536.976-.288 0-.592-.032-.8-.08v1.232c.24.16.784.272 1.2.272z"
          fill="#2C2C2C"
        />
      </G>
      <Defs>
        <ClipPath id="u2hpsi98ta">
          <Path fill="#fff" d="M0 0h198v52H0z" />
        </ClipPath>
        <ClipPath id="thej7yl1eb">
          <Path fill="#fff" transform="translate(6 6)" d="M0 0h40v40H0z" />
        </ClipPath>
        <RadialGradient
          id="tqobekilmc"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(44 0 0 44 12.7 46)">
          <Stop stopColor="#09F" />
          <Stop offset=".6" stopColor="#A033FF" />
          <Stop offset=".9" stopColor="#FF5280" />
          <Stop offset="1" stopColor="#FF7061" />
        </RadialGradient>
      </Defs>
    </Svg>,
  ],
  textLogo: [
    <Svg
      width="98"
      height="24"
      viewBox="0 0 98 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.27 7.474h.951c.48 0 .892-.124 1.232-.37.34-.247.51-.634.51-1.161 0-.293-.046-.54-.14-.74-.094-.2-.22-.36-.38-.483a1.47 1.47 0 0 0-.553-.264 2.72 2.72 0 0 0-.669-.08h-.95v3.098zm-3.008 7.989a13.99 13.99 0 0 1-.035-.819c-.012-.428-.021-.95-.027-1.566-.005-.615-.008-1.305-.008-2.068V8.68c0-.793.003-1.573.008-2.342a992.272 992.272 0 0 1 .035-3.774c.007-.458.015-.768.027-.933a43.376 43.376 0 0 1 1.706-.08c.61-.017 1.327-.02 2.148-.008.645.012 1.26.108 1.847.29a4.66 4.66 0 0 1 1.558.819c.45.364.81.818 1.074 1.363.263.545.396 1.189.396 1.928 0 .773-.154 1.446-.458 2.015a4.088 4.088 0 0 1-1.25 1.416l.73 1.46c.265.528.513 1.033.748 1.513.235.482.44.913.617 1.295.175.38.292.648.352.8-.141.117-.335.244-.581.379a10.8 10.8 0 0 1-1.54.686c-.252.088-.46.143-.625.167a73.453 73.453 0 0 1-1.038-2.2c-.234-.516-.478-1.058-.73-1.628l-.696-1.558-.37.019h-.88v4.611c0 .293-.006.474-.017.545-.13.035-.325.059-.59.07a21.417 21.417 0 0 1-1.716 0 4.43 4.43 0 0 1-.685-.07zM44.763 8.547c0 .646.079 1.232.236 1.761.16.528.4.976.722 1.345.323.371.722.658 1.197.863.475.206 1.029.308 1.663.308.634 0 1.188-.102 1.663-.308a3.288 3.288 0 0 0 1.197-.863c.323-.369.563-.817.72-1.345a6.097 6.097 0 0 0 .239-1.76c0-.646-.08-1.232-.238-1.76a3.578 3.578 0 0 0-.72-1.347 3.297 3.297 0 0 0-1.198-.861c-.474-.205-1.029-.308-1.663-.308-.634 0-1.188.103-1.663.308a3.29 3.29 0 0 0-1.197.861c-.322.37-.562.819-.722 1.346a6.141 6.141 0 0 0-.236 1.76zm-3.15 0c0-1.15.182-2.167.545-3.053.363-.886.86-1.632 1.487-2.243a6.177 6.177 0 0 1 2.21-1.38 7.819 7.819 0 0 1 2.726-.468c.962 0 1.868.156 2.72.467.85.31 1.588.77 2.216 1.381.628.61 1.123 1.357 1.487 2.243.364.886.546 1.904.546 3.053 0 1.15-.182 2.168-.546 3.054-.364.886-.859 1.633-1.486 2.244a6.195 6.195 0 0 1-2.218 1.38 7.852 7.852 0 0 1-2.719.467 7.818 7.818 0 0 1-2.727-.466 6.202 6.202 0 0 1-2.209-1.381c-.627-.61-1.124-1.358-1.487-2.244-.363-.886-.545-1.903-.545-3.054zM58.665 15.463a13.049 13.049 0 0 1-.035-.8 80.108 80.108 0 0 1-.027-1.602l-.018-2.129a379.371 379.371 0 0 1 .018-6.89c.005-.634.015-1.168.027-1.601.011-.434.023-.704.035-.81.152-.023.366-.04.641-.053a21.747 21.747 0 0 1 1.743 0c.276.013.49.03.642.053a7.4 7.4 0 0 1 .027.599c.005.305.012.686.018 1.144.005.457.008.976.008 1.557v1.838a141.865 141.865 0 0 1 2.103-3.274c.335-.503.625-.943.871-1.319.246-.374.417-.626.51-.756.153.047.347.13.581.246a14.738 14.738 0 0 1 1.426.819c.223.146.398.272.528.378-.06.129-.224.405-.493.827-.27.423-.59.91-.96 1.46a189.6 189.6 0 0 1-1.188 1.751c-.42.617-.82 1.183-1.196 1.699.447.516.916 1.062 1.408 1.637.493.575.953 1.117 1.382 1.627.428.51.797.956 1.109 1.338.31.38.5.63.571.747a6.45 6.45 0 0 1-.448.44c-.194.177-.405.352-.634.529-.229.175-.455.34-.678.492a4.82 4.82 0 0 1-.544.334c-.107-.094-.315-.322-.626-.685a153.67 153.67 0 0 1-1.09-1.295c-.417-.498-.857-1.031-1.32-1.601-.465-.568-.902-1.11-1.312-1.627v1.768c0 .557-.003 1.056-.008 1.496-.006.44-.013.806-.018 1.1a6.236 6.236 0 0 1-.027.563c-.14.036-.343.059-.606.07a21.566 21.566 0 0 1-1.734 0 4.44 4.44 0 0 1-.686-.07zM71.07 15.463a24.24 24.24 0 0 1-.044-1.513c-.006-.716-.015-1.537-.026-2.464-.013-.926-.014-1.91-.01-2.947l.019-2.948c.005-.927.011-1.747.017-2.464.006-.715.02-1.22.044-1.513a68.39 68.39 0 0 1 2.28-.062 124.925 124.925 0 0 1 2.841 0c.446.006.85.018 1.215.036.363.018.645.032.843.044.013.14.02.35.027.625a40.56 40.56 0 0 1 0 1.671 6.087 6.087 0 0 1-.027.519c-.164 0-.436.003-.817.009-.382.006-.79.01-1.224.01h-1.24c-.393 0-.677-.007-.853-.02v2.482c.398 0 .811.003 1.24.01l1.197.017.95.017c.264.006.431.015.502.027.01.14.023.342.034.607a17.463 17.463 0 0 1 0 1.628c-.01.258-.023.457-.034.598-.118.012-.317.02-.598.027-.282.006-.608.009-.977.009h-2.314v2.727c.116 0 .29-.003.518-.01.229-.004.487-.008.775-.008H77.221c.286 0 .542.004.765.009.223.006.387.009.492.009.012.152.02.36.026.625a35.316 35.316 0 0 1 0 1.645c-.006.258-.014.457-.026.598-.164.011-.43.024-.8.036-.37.011-.792.02-1.267.026a126.361 126.361 0 0 1-4.4-.026 51.407 51.407 0 0 1-.94-.036zM84.585 12.895a13.793 13.793 0 0 0 1.426.017c.692-.035 1.234-.19 1.627-.467.393-.276.59-.723.59-1.346 0-.598-.197-1.029-.59-1.293-.393-.263-.935-.408-1.627-.43-.258-.013-.52-.016-.784-.01s-.478.015-.642.026v3.503zm0-6.178c.105 0 .226.003.36.01.135.006.265.009.388.009h.501c.48 0 .869-.1 1.162-.3.292-.2.44-.492.44-.88 0-.41-.148-.718-.44-.924-.293-.205-.681-.308-1.162-.308h-.51c-.13 0-.264.004-.404.009a8.16 8.16 0 0 1-.352.009l.017 2.375zm-2.992 8.746c-.012-.117-.023-.39-.034-.818-.013-.428-.022-.95-.027-1.566-.006-.615-.01-1.305-.01-2.068V8.68c0-.792.004-1.572.01-2.34.005-.77.011-1.476.017-2.121.007-.646.012-1.197.018-1.654.006-.458.014-.769.026-.933a43.48 43.48 0 0 1 1.866-.08c.716-.017 1.531-.02 2.446-.008a6.429 6.429 0 0 1 1.795.273c.551.17 1.026.42 1.425.748s.712.739.942 1.231c.229.493.343 1.062.343 1.708 0 .516-.09.967-.274 1.354-.181.388-.42.716-.712.986.528.352.97.81 1.329 1.373.357.562.537 1.26.537 2.093 0 1.362-.411 2.394-1.233 3.098-.82.703-1.947 1.079-3.378 1.126-.47.011-.941.02-1.416.026a55.07 55.07 0 0 1-1.373 0 88.06 88.06 0 0 1-1.25-.026c-.392-.011-.742-.03-1.047-.053v-.018zM94.316 15.463a13.101 13.101 0 0 1-.035-.8 83.921 83.921 0 0 1-.026-1.601l-.019-2.13a412.41 412.41 0 0 1 0-4.769l.019-2.12c.005-.634.015-1.168.026-1.601.012-.434.023-.705.035-.81.153-.023.367-.04.642-.053a21.469 21.469 0 0 1 1.725 0c.276.013.49.03.642.053.012.105.02.376.027.81.006.433.01.967.017 1.601.006.633.01 1.34.01 2.12v4.77c0 .78-.004 1.489-.01 2.129-.006.639-.011 1.173-.017 1.601-.006.428-.015.695-.027.8-.14.036-.343.06-.607.07a21.216 21.216 0 0 1-1.716 0 4.415 4.415 0 0 1-.686-.07z"
        fill="#2B2B2B"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.06 24C6.372 24 2.183 22.374.607 19.166c-1.139-2.317-.471-4.945.337-5.99a3.843 3.843 0 0 1 2.296-1.431l.484-.1.205-.646C6.527 2.769 11.719.396 12.3.152a1.965 1.965 0 0 1 1.515 0c.583.243 5.777 2.617 8.375 10.846l.203.648.486.1a3.842 3.842 0 0 1 2.296 1.43c.808 1.045 1.475 3.673.337 5.99C23.937 22.374 19.748 24 13.06 24z"
        fill="#231F20"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.33 1.32a.699.699 0 0 0-.54 0c-.261.11-5.193 2.265-7.653 10.059a5.421 5.421 0 0 1 1.343.46l.066.03c.59.307.882.27 1.05.216.399-.13.83-.652 1.281-1.551A4.617 4.617 0 0 1 13.06 7.91a4.622 4.622 0 0 1 4.183 2.624c.45.9.882 1.422 1.281 1.551.167.054.458.09 1.05-.215l.066-.031a5.333 5.333 0 0 1 1.343-.46c-2.46-7.794-7.393-9.95-7.654-10.058z"
        fill="#FFD200"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.174 13.949c-.707-.915-1.772-1.145-2.744-.986a3.684 3.684 0 0 0-1.103.362 4.41 4.41 0 0 1-.239.113c-.755.343-1.435.411-2.07.206-.855-.278-1.567-1.033-2.24-2.376-.902-1.798-2.654-1.72-2.672-1.72l-.046.002-.046-.003c-.068 0-1.785-.048-2.672 1.721-.673 1.343-1.385 2.098-2.24 2.376-.636.205-1.316.137-2.07-.206a4.248 4.248 0 0 1-.24-.113 3.745 3.745 0 0 0-1.662-.41c-.803 0-1.611.293-2.184 1.034-.514.666-1.124 2.782-.202 4.659.924 1.882 3.637 4.125 11.316 4.125 7.678 0 10.392-2.243 11.316-4.126.922-1.876.312-3.992-.203-4.658z"
        fill="#0066B2"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31.51 21.14h.23c.115 0 .215-.029.296-.089.082-.059.124-.153.124-.28 0-.07-.012-.13-.034-.178a.308.308 0 0 0-.092-.117.358.358 0 0 0-.133-.064.658.658 0 0 0-.162-.02h-.23v.748zm-.727 1.93a18.182 18.182 0 0 1-.015-.575 52.978 52.978 0 0 1-.002-.5v-.564a74.77 74.77 0 0 1 .006-1.076 53.17 53.17 0 0 1 .011-.625 11.535 11.535 0 0 1 .93-.021c.156.003.304.026.447.07.141.043.267.11.375.197.11.088.196.198.26.33.063.131.095.287.095.465 0 .187-.036.35-.11.486a.98.98 0 0 1-.302.342l.176.353c.065.127.124.25.181.365.057.117.106.22.149.313.042.092.07.156.085.193a.87.87 0 0 1-.14.091 2.54 2.54 0 0 1-.372.166.831.831 0 0 1-.151.04 16.703 16.703 0 0 1-.25-.53 49.112 49.112 0 0 1-.177-.394c-.06-.137-.117-.262-.168-.376l-.089.005h-.212v1.113c0 .07-.002.114-.005.131a.665.665 0 0 1-.142.018 4.827 4.827 0 0 1-.415 0 1.037 1.037 0 0 1-.165-.018zM36.009 21.4c0 .156.019.298.057.425a.792.792 0 0 0 .463.533c.115.05.248.074.401.074.154 0 .287-.024.402-.074a.793.793 0 0 0 .463-.533c.038-.127.057-.269.057-.425 0-.156-.019-.297-.057-.425a.793.793 0 0 0-.463-.533 1.01 1.01 0 0 0-.402-.074c-.152 0-.286.025-.401.074a.792.792 0 0 0-.29.209.864.864 0 0 0-.173.324 1.48 1.48 0 0 0-.057.425zm-.761 0c0-.277.044-.523.132-.737.087-.213.207-.395.359-.542.15-.147.329-.258.533-.334.204-.075.424-.112.658-.112.232 0 .452.037.657.112.205.076.384.187.535.334.152.147.272.329.36.542.087.214.131.46.131.737 0 .278-.044.524-.132.737a1.582 1.582 0 0 1-.359.542c-.151.148-.33.259-.535.334a1.902 1.902 0 0 1-.657.113c-.234 0-.454-.038-.658-.113a1.493 1.493 0 0 1-.533-.334 1.582 1.582 0 0 1-.36-.542 1.93 1.93 0 0 1-.131-.737zM43.21 21.672a511.493 511.493 0 0 0-.415-1.207L42.61 21l-.232.672h.833zm-2.056 1.249c.015-.048.039-.124.074-.227l.126-.361.16-.453.18-.504.185-.51a36.026 36.026 0 0 1 .323-.866c.043-.115.08-.205.108-.27a4.204 4.204 0 0 1 .746-.021c.084.005.158.012.223.02.028.066.064.156.108.271a71.408 71.408 0 0 1 .323.867l.185.51c.063.171.122.339.18.503l.16.453.125.36c.036.104.06.18.075.228a2.232 2.232 0 0 1-.327.117 3.42 3.42 0 0 1-.204.048 1.157 1.157 0 0 1-.179.026 4.491 4.491 0 0 1-.108-.285c-.05-.138-.107-.301-.173-.488-.093 0-.196 0-.31.002a22.94 22.94 0 0 1-.684 0c-.11-.002-.212-.002-.305-.002-.066.187-.123.35-.173.488-.05.14-.085.234-.108.285a1.154 1.154 0 0 1-.178-.026 3.29 3.29 0 0 1-.393-.108 1.496 1.496 0 0 1-.139-.057zM47.277 23.07a3.741 3.741 0 0 1-.009-.194 34.668 34.668 0 0 1-.01-.9 60.588 60.588 0 0 1 0-1.152 230.965 230.965 0 0 1 .01-.899c.003-.105.007-.17.01-.195.036-.006.096-.01.178-.013a8.158 8.158 0 0 1 .516 0c.08.003.138.007.172.013l.187.327.25.447a74.303 74.303 0 0 1 .789 1.444c.069.134.124.24.163.319.037-.08.091-.185.162-.319a56.912 56.912 0 0 1 .79-1.445c.09-.161.175-.31.25-.446l.188-.327a1.55 1.55 0 0 1 .172-.013 7.983 7.983 0 0 1 .516 0c.083.003.141.007.179.013.002.026.005.09.008.195a39.038 39.038 0 0 1 .009.9V21.975a56.514 56.514 0 0 1-.009.9 3.741 3.741 0 0 1-.008.194 1.047 1.047 0 0 1-.164.017 4.452 4.452 0 0 1-.41 0 .74.74 0 0 1-.144-.017 5.053 5.053 0 0 1-.007-.262 43.773 43.773 0 0 1-.002-.522v-1.37c-.065.133-.135.271-.21.416l-.226.433a81.926 81.926 0 0 1-.412.788l-.15.287-.09.166c-.142.017-.29.025-.446.025-.156 0-.302-.008-.437-.025l-.158-.295a108.825 108.825 0 0 1-.607-1.158 25.72 25.72 0 0 1-.32-.633V22.288c-.003.204-.003.377-.005.52a4.43 4.43 0 0 1-.007.262.736.736 0 0 1-.144.017 4.12 4.12 0 0 1-.41 0 1.053 1.053 0 0 1-.164-.017zM54.806 23.07a3.577 3.577 0 0 1-.009-.194 40.332 40.332 0 0 1-.01-.9 64.096 64.096 0 0 1 0-1.152l.004-.512.006-.387c.004-.105.007-.17.01-.195.036-.006.088-.01.155-.013a5.266 5.266 0 0 1 .416 0c.066.003.118.007.155.013.002.026.005.09.006.195a47.35 47.35 0 0 1 .006.9V21.975a45.09 45.09 0 0 1-.012 1.094.758.758 0 0 1-.147.017 4.222 4.222 0 0 1-.414 0 1.061 1.061 0 0 1-.166-.017zM58.545 23.07a3.178 3.178 0 0 1-.009-.194 40.332 40.332 0 0 1-.01-.9 64.096 64.096 0 0 1 0-1.152l.004-.512.006-.387c.003-.105.006-.17.01-.195.036-.006.094-.01.174-.013a7.528 7.528 0 0 1 .497 0c.079.003.137.007.174.013.068.125.146.271.235.44a57.418 57.418 0 0 1 .83 1.637v-1.32l.003-.5c.002-.138.004-.221.007-.252a.766.766 0 0 1 .146-.018 4.993 4.993 0 0 1 .415 0c.068.003.123.009.166.018a22.334 22.334 0 0 1 .015.58l.001.513v1.152a44.568 44.568 0 0 1-.008.898 4.65 4.65 0 0 1-.008.196 4.49 4.49 0 0 1-.846 0 30.333 30.333 0 0 1-.234-.44l-.276-.531A34.786 34.786 0 0 1 59.284 21v.678c0 .231 0 .444-.002.64l-.004.5a5.93 5.93 0 0 1-.006.252.764.764 0 0 1-.147.017 4.207 4.207 0 0 1-.414 0 1.061 1.061 0 0 1-.166-.017zM64.112 21.4c0-.303.046-.565.14-.786.093-.221.225-.402.397-.542.171-.14.376-.24.616-.302.24-.06.503-.084.793-.07.005.04.01.091.012.154a4.62 4.62 0 0 1 0 .388 2.115 2.115 0 0 1-.012.16c-.394-.032-.695.04-.902.216-.206.176-.31.437-.31.782 0 .292.074.524.221.697.148.173.362.274.642.306v-.808a.911.911 0 0 1-.147.007 11.341 11.341 0 0 1-.201-.007 6.18 6.18 0 0 1-.006-.493c0-.062.002-.11.005-.144a4.664 4.664 0 0 1 .44-.021 11.433 11.433 0 0 1 .589.017 27.837 27.837 0 0 1 .017 1.071 37.39 37.39 0 0 1-.009.818 5.839 5.839 0 0 1-.008.218c-.04.009-.091.015-.155.02a6.94 6.94 0 0 1-.198.01 2.79 2.79 0 0 1-.781-.078 1.6 1.6 0 0 1-.608-.298 1.365 1.365 0 0 1-.396-.533 1.98 1.98 0 0 1-.14-.782zM70.685 22.381c.274 0 .485-.087.63-.261.143-.174.215-.42.215-.737 0-.303-.072-.54-.216-.708-.144-.168-.355-.253-.629-.253h-.352v1.96h.352zm-1.075.689a31.225 31.225 0 0 1-.021-1.094v-1.152a25.589 25.589 0 0 1 .02-1.094l.243-.009a9.64 9.64 0 0 1 .276-.004h.272c.088 0 .167.002.238.004.246.01.47.049.672.12.2.07.373.174.516.312.143.137.254.308.333.514.08.205.12.444.12.716 0 .28-.04.524-.12.73-.08.207-.19.38-.333.519-.143.139-.316.245-.516.319a2.243 2.243 0 0 1-.672.127 13.633 13.633 0 0 1-.497.013c-.096 0-.191-.001-.285-.005a2.77 2.77 0 0 1-.246-.016zM75.618 21.4c0 .156.019.298.058.425a.865.865 0 0 0 .174.325c.077.09.174.159.288.208.115.05.249.074.402.074.153 0 .287-.024.401-.074a.788.788 0 0 0 .29-.208.872.872 0 0 0 .174-.325c.038-.127.057-.269.057-.425 0-.156-.019-.297-.057-.425a.87.87 0 0 0-.174-.324.788.788 0 0 0-.29-.21 1.012 1.012 0 0 0-.4-.073c-.154 0-.288.025-.403.074a.786.786 0 0 0-.288.209.862.862 0 0 0-.174.324 1.466 1.466 0 0 0-.058.425zm-.76 0c0-.277.044-.523.131-.737.088-.213.208-.395.36-.542.15-.147.329-.258.532-.334a1.9 1.9 0 0 1 .66-.112c.231 0 .45.037.656.112.205.076.383.187.534.334.152.147.272.329.36.542.087.214.132.46.132.737 0 .278-.045.524-.132.737a1.576 1.576 0 0 1-.36.542c-.15.148-.33.259-.534.334a1.903 1.903 0 0 1-.657.113 1.9 1.9 0 0 1-.659-.113 1.495 1.495 0 0 1-.532-.334 1.576 1.576 0 0 1-.36-.542 1.93 1.93 0 0 1-.132-.737zM81.142 23.07a3.27 3.27 0 0 1-.009-.193 75.272 75.272 0 0 1-.01-.9c-.002-.19-.002-.381-.002-.577 0-.195 0-.387.002-.575a74.076 74.076 0 0 1 .01-.899c.003-.105.006-.17.009-.195.037-.006.088-.01.155-.013a5.13 5.13 0 0 1 .421 0c.066.003.118.007.155.013.002.022.004.07.006.144l.005.276.001.376v.444a38.265 38.265 0 0 1 .842-1.291.965.965 0 0 1 .14.059 4.287 4.287 0 0 1 .345.198c.053.035.096.066.127.09a2.193 2.193 0 0 1-.12.2 45.28 45.28 0 0 1-.518.776 16.81 16.81 0 0 1-.289.41l.34.395.334.393.268.324c.075.092.121.152.138.18a2.573 2.573 0 0 1-.261.233c-.056.043-.11.083-.164.12a1.124 1.124 0 0 1-.132.08 1.896 1.896 0 0 1-.15-.166 29.145 29.145 0 0 1-.583-.699 38.648 38.648 0 0 1-.317-.393v.428l-.001.36-.005.266a1.67 1.67 0 0 1-.006.136.74.74 0 0 1-.147.017 4.261 4.261 0 0 1-.419 0 1.053 1.053 0 0 1-.165-.017zM86.305 23.07a5.443 5.443 0 0 1-.011-.366l-.007-.594a33.928 33.928 0 0 1-.001-.712 134.516 134.516 0 0 1 .008-1.307 5.44 5.44 0 0 1 .01-.365 26.537 26.537 0 0 1 .55-.015 42.9 42.9 0 0 1 .687 0c.107.002.205.004.293.009l.204.01c.003.034.005.084.007.151a10.54 10.54 0 0 1 0 .404 1.698 1.698 0 0 1-.007.125c-.04 0-.106 0-.198.002-.091.002-.19.002-.295.002h-.3c-.094 0-.163-.001-.206-.004v.6l.3.001.29.004.228.005c.064.001.104.004.121.006a3.863 3.863 0 0 1 .013.344 4.688 4.688 0 0 1-.013.34 12.29 12.29 0 0 1-.38.008H87.04v.66l.126-.003.187-.002h.438a7.136 7.136 0 0 1 .303.005c.003.036.005.086.007.15a9.744 9.744 0 0 1 0 .398 2.21 2.21 0 0 1-.007.144c-.04.003-.103.006-.193.009a34.09 34.09 0 0 1-.671.008 48.723 48.723 0 0 1-.697-.008 14.113 14.113 0 0 1-.227-.01zM91.735 22.45a4.088 4.088 0 0 0 .343.005.749.749 0 0 0 .394-.113c.095-.067.142-.175.142-.325 0-.145-.047-.249-.142-.313a.746.746 0 0 0-.394-.104 2.63 2.63 0 0 0-.343.005v.845zm0-1.491c.025 0 .054 0 .087.002.032.002.063.002.093.002h.121c.116 0 .21-.024.28-.072a.24.24 0 0 0 .107-.212c0-.1-.035-.174-.107-.224a.477.477 0 0 0-.28-.074h-.123c-.031 0-.064 0-.098.002a2.084 2.084 0 0 1-.085.002l.005.574zm-.723 2.111a18.098 18.098 0 0 1-.015-.575 42.339 42.339 0 0 1-.002-.5v-.563a58.382 58.382 0 0 1 .007-1.076l.004-.4c.001-.11.003-.185.006-.225.127-.009.278-.015.45-.02.173-.003.37-.004.591-.001.156.003.3.024.434.066.133.04.247.1.344.18a.84.84 0 0 1 .227.297c.055.12.083.257.083.413a.765.765 0 0 1-.066.327.763.763 0 0 1-.172.238c.127.084.234.195.32.331.087.136.13.305.13.506 0 .328-.099.578-.298.748-.198.17-.47.26-.815.271a21.385 21.385 0 0 1-.674.007 14.852 14.852 0 0 1-.554-.02v-.004zM96.25 23.07a3.577 3.577 0 0 1-.008-.194 40.332 40.332 0 0 1-.01-.9 60.588 60.588 0 0 1 0-1.152l.004-.512c.001-.153.004-.282.006-.387.003-.105.006-.17.009-.195a1.53 1.53 0 0 1 .155-.013 5.266 5.266 0 0 1 .417 0c.066.003.118.007.155.013a51.69 51.69 0 0 1 .012 1.094v1.152a47.533 47.533 0 0 1-.012 1.094.76.76 0 0 1-.147.017 4.224 4.224 0 0 1-.415 0 1.06 1.06 0 0 1-.165-.017z"
        fill="#231F20"
      />
    </Svg>,
  ],
  appleLogin: [
    <Svg
      width="25"
      height="44"
      viewBox="0 0 25 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.556 15.319c-.49.591-1.312 1.034-1.968 1.034-.074 0-.148-.009-.194-.018a1.27 1.27 0 0 1-.028-.259c0-.757.38-1.496.795-1.967.526-.62 1.404-1.081 2.134-1.109.018.083.028.185.028.286 0 .749-.324 1.497-.767 2.033zm-3.213 11.937c-.33.142-.641.276-1.065.276-.905 0-1.533-.832-2.254-1.848-.84-1.2-1.524-3.058-1.524-4.813 0-2.827 1.838-4.323 3.65-4.323.528 0 1.01.193 1.44.366.344.137.653.262.924.262.235 0 .528-.116.87-.251.477-.189 1.048-.415 1.69-.415.406 0 1.893.037 2.872 1.442l-.035.023c-.24.16-1.526 1.008-1.526 2.748 0 2.153 1.875 2.92 1.94 2.938l-.012.035a8.12 8.12 0 0 1-.986 2.025c-.619.887-1.275 1.792-2.254 1.792-.482 0-.79-.136-1.108-.277-.338-.15-.689-.305-1.275-.305-.59 0-.98.168-1.347.325z"
        fill="#fff"
      />
    </Svg>,
  ],
  facebookLogin: [
    <Svg
      width="24"
      height="44"
      viewBox="0 0 24 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Mask
        id="7mwptlp82a"
        style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="44">
        <Path fill="#fff" d="M0 0h24v44H0z" />
      </Mask>
      <G mask="url(#7mwptlp82a)">
        <Path
          d="m17.28 22.607.57-3.413h-3.567v-2.213c0-.934.498-1.845 2.096-1.845H18V12.23S16.529 12 15.122 12c-2.937 0-4.857 1.634-4.857 4.593v2.601H7v3.413h3.265v8.25c1.331.19 2.687.19 4.018 0v-8.25h2.996z"
          fill="#fff"
        />
      </G>
    </Svg>,
  ],
  googleLogin: [
    <Svg
      width="24"
      height="44"
      viewBox="0 0 24 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.68 22.182c0-.567-.05-1.112-.145-1.636H12v3.094h4.305a3.68 3.68 0 0 1-1.596 2.415v2.007h2.585c1.513-1.393 2.386-3.443 2.386-5.88z"
        fill="#4285F4"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 30c2.16 0 3.971-.717 5.295-1.939l-2.586-2.007c-.716.48-1.633.764-2.709.764-2.084 0-3.847-1.408-4.476-3.299H4.85v2.073A7.997 7.997 0 0 0 12.001 30z"
        fill="#34A853"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.524 23.52A4.81 4.81 0 0 1 7.273 22c0-.527.09-1.04.25-1.52v-2.073H4.852A7.997 7.997 0 0 0 4 22c0 1.29.31 2.513.85 3.593l2.674-2.073z"
        fill="#FBBC05"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 17.182c1.175 0 2.23.404 3.058 1.196l2.295-2.294C15.967 14.793 14.156 14 12 14a7.997 7.997 0 0 0-7.149 4.407l2.673 2.073c.629-1.89 2.392-3.298 4.476-3.298z"
        fill="#EA4335"
      />
    </Svg>,
  ],
  imgQuestion: [
    <Svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="25" cy="25" r="25" fill="#fff" />
      <Path
        d="M25.026 31v-3.135c0-1.417.904-2.654 2.236-3.18 2.332-.921 3.894-2.934 3.726-5.603-.186-2.965-2.576-4.883-5.577-5.067C21.908 13.8 19 15.969 19 19.384"
        stroke="#2A7FF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="25" cy="36" r="2" fill="#2A7FF6" />
    </Svg>,
  ],
  samsung: [
    <Svg
      width="98"
      height="24"
      viewBox="0 0 98 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#xvh6dxrh8a)" fill="#000">
        <Path d="M72.57 8.395v2.95h1.27c1.003 0 1.671-.658 1.671-1.475 0-.817-.668-1.475-1.67-1.475h-1.27zM70.9 7.02h3.074c1.85 0 3.23 1.275 3.23 2.85 0 1.594-1.38 2.87-3.252 2.87H72.57v2.29H70.9V7.02zM83.465 11.803c0-1.097-.914-1.973-2.139-1.973-1.225 0-2.183.877-2.183 1.973 0 1.115.936 1.992 2.183 1.992 1.225 0 2.139-.877 2.139-1.992zm-5.949.02c0-2.133 1.738-3.348 3.565-3.348.936 0 1.782.358 2.317.896v-.757h1.649v6.417h-1.649v-.837c-.535.598-1.381.976-2.34.976-1.737 0-3.542-1.255-3.542-3.348zM88.522 14.712l-2.94-6.098h1.782l1.982 4.324 1.894-4.324H93L88.7 18h-1.67l1.492-3.288zM53.433 7.24l.134 5.878H53.5l-1.916-5.879h-3.119v7.413h2.072l-.111-6.078h.044l2.072 6.078h2.986V7.24h-2.095zM13.978 7.24l-1.56 7.492h2.273l1.136-6.795h.045l1.136 6.795h2.25l-1.56-7.493h-3.72zM26.655 7.24l-1.047 5.738h-.045L24.538 7.24h-3.43l-.179 7.493h2.094l.045-6.735h.044l1.404 6.735h2.139l1.403-6.735h.045l.044 6.735h2.095l-.179-7.493h-3.408zM8.899 12.62c.089.179.067.418.022.558-.067.259-.267.498-.824.498-.535 0-.847-.28-.847-.678v-.717H5v.578c0 1.674 1.47 2.172 3.052 2.172 1.515 0 2.763-.459 2.963-1.714.112-.638.022-1.076 0-1.236-.356-1.554-3.542-2.032-3.787-2.909a.787.787 0 0 1 0-.398c.067-.24.245-.499.757-.499.49 0 .78.28.78.678v.458h2.094v-.518C10.86 7.26 9.211 7 8.03 7c-1.492 0-2.717.438-2.94 1.674-.067.339-.067.638.022 1.016.38 1.515 3.342 1.953 3.788 2.93zM36.145 12.6c.09.18.045.418.023.558-.067.239-.245.498-.802.498-.513 0-.825-.26-.825-.678v-.717h-2.228v.578c0 1.654 1.448 2.152 3.008 2.152 1.493 0 2.74-.458 2.94-1.694.112-.637.023-1.056 0-1.215-.356-1.555-3.497-2.013-3.742-2.89a.794.794 0 0 1 0-.398c.067-.24.245-.499.758-.499.49 0 .78.26.78.678v.458h2.071v-.518c0-1.614-1.626-1.873-2.807-1.873-1.47 0-2.673.438-2.896 1.654-.067.339-.067.618.022.996.334 1.515 3.275 1.953 3.698 2.91zM43.185 13.616c.58 0 .758-.359.802-.538.023-.08.023-.2.023-.279v-5.56h2.116v5.38c0 .14-.022.42-.022.499-.156 1.395-1.382 1.853-2.919 1.853-1.537 0-2.785-.458-2.918-1.853 0-.08-.022-.359-.022-.498V7.24h2.116v5.54c0 .099 0 .198.022.278.045.2.223.558.802.558zM60.674 13.536c.601 0 .824-.338.846-.538.023-.08.023-.199.023-.279v-1.096h-.847v-1.096h2.963v2.013c0 .14 0 .24-.022.498-.134 1.375-1.47 1.854-2.94 1.854-1.494 0-2.808-.499-2.942-1.854-.022-.259-.022-.358-.022-.498V9.391c0-.139.022-.358.045-.498.178-1.395 1.448-1.853 2.94-1.853 1.493 0 2.785.438 2.941 1.853.023.24.023.498.023.498v.26h-2.117v-.419s0-.18-.022-.279c-.045-.16-.2-.538-.847-.538-.601 0-.78.359-.846.538-.023.1-.045.24-.045.359v3.427c0 .1 0 .2.022.28.023.179.245.517.847.517z" />
      </G>
      <Defs>
        <ClipPath id="xvh6dxrh8a">
          <Path fill="#fff" transform="translate(5 7)" d="M0 0h88v11H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  paypal: [
    <Svg
      width="98"
      height="24"
      viewBox="0 0 98 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#r0rup0juba)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M68.734 11.049c-.216 1.29-1.298 1.29-2.345 1.29h-.595l.417-2.41c.026-.145.163-.252.325-.252h.273c.713 0 1.386 0 1.733.37.207.22.27.549.192 1.002zm-.456-3.368H64.33c-.27 0-.5.18-.542.422l-1.596 9.22c-.031.183.123.347.326.347h2.024c.19 0 .35-.125.38-.295l.452-2.614c.042-.243.272-.422.542-.422h1.249c2.6 0 4.1-1.146 4.492-3.418.177-.994.007-1.775-.504-2.321-.56-.601-1.556-.919-2.876-.919z"
          fill="#2790C3"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M40.583 11.049c-.216 1.29-1.298 1.29-2.344 1.29h-.595l.417-2.41c.025-.145.163-.252.325-.252h.273c.712 0 1.385 0 1.732.37.208.22.27.549.192 1.002zm-.455-3.368H36.18c-.27 0-.5.18-.542.422l-1.596 9.22c-.031.183.123.347.325.347h1.885c.27 0 .5-.179.541-.422l.431-2.487c.042-.243.272-.422.542-.422h1.248c2.6 0 4.1-1.146 4.493-3.418.176-.994.007-1.775-.504-2.321-.561-.601-1.556-.919-2.876-.919zM49.29 14.359c-.182.984-1.04 1.644-2.133 1.644-.548 0-.987-.16-1.269-.465-.28-.301-.384-.73-.296-1.21.17-.974 1.041-1.656 2.118-1.656.537 0 .972.162 1.26.47.29.308.403.74.32 1.217zm2.634-3.352h-1.89c-.162 0-.3.107-.325.253l-.083.482-.132-.175c-.41-.54-1.321-.722-2.232-.722-2.088 0-3.872 1.442-4.219 3.464-.18 1.009.076 1.972.704 2.645.576.618 1.4.876 2.38.876 1.683 0 2.616-.985 2.616-.985l-.084.478c-.032.182.123.347.325.347h1.702c.27 0 .5-.179.541-.422l1.022-5.894c.032-.182-.123-.347-.325-.347z"
          fill="#27346A"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M77.44 14.359c-.182.984-1.04 1.644-2.132 1.644-.549 0-.988-.16-1.27-.465-.28-.301-.385-.73-.296-1.21.17-.974 1.041-1.656 2.118-1.656.537 0 .973.162 1.26.47.29.308.403.74.32 1.217zm2.634-3.352h-1.89c-.162 0-.3.107-.325.253l-.083.482-.132-.175c-.41-.54-1.321-.722-2.232-.722-2.088 0-3.872 1.442-4.219 3.464-.18 1.009.076 1.972.704 2.645.577.618 1.4.876 2.38.876 1.683 0 2.616-.985 2.616-.985l-.084.478c-.032.182.123.347.325.347h1.702c.27 0 .5-.179.542-.422l1.021-5.894c.032-.182-.123-.347-.325-.347z"
          fill="#2790C3"
        />
        <Mask
          id="d9erbk6jdb"
          style="mask-type:alpha"
          maskUnits="userSpaceOnUse"
          x="13"
          y="4"
          width="72"
          height="16">
          <Path d="M13.01 20h71.77V4.133H13.01V20z" fill="#fff" />
        </Mask>
        <G mask="url(#d9erbk6jdb)" fillRule="evenodd" clipRule="evenodd">
          <Path
            d="M61.99 11.007h-1.9a.565.565 0 0 0-.453.22l-2.62 3.516-1.111-3.38a.544.544 0 0 0-.525-.356h-1.868c-.225 0-.384.202-.311.397l2.092 5.594-1.968 2.529c-.154.198.002.473.269.473h1.897c.18 0 .349-.08.451-.215l6.318-8.307c.15-.199-.006-.47-.271-.47z"
            fill="#27346A"
          />
          <Path
            d="m82.302 7.934-1.62 9.39c-.031.182.123.346.325.346h1.63c.27 0 .499-.179.541-.422l1.597-9.22c.032-.182-.123-.347-.325-.347h-1.823c-.162 0-.3.108-.325.253z"
            fill="#2790C3"
          />
          <Path
            d="m20.477 19.346.53-3.065.035-.17a.618.618 0 0 1 .234-.38.734.734 0 0 1 .449-.151h.42c.703 0 1.348-.068 1.919-.203a5.103 5.103 0 0 0 1.608-.665 4.124 4.124 0 0 0 1.214-1.21c.337-.515.585-1.135.736-1.843.134-.625.159-1.184.075-1.663a2.413 2.413 0 0 0-.636-1.282c-.201-.21-.46-.39-.767-.54l-.007-.003v-.008c.107-.623.103-1.144-.012-1.591-.116-.45-.351-.853-.719-1.235-.762-.79-2.148-1.192-4.118-1.192h-5.413a.807.807 0 0 0-.494.166.682.682 0 0 0-.258.42L13.02 17.751c-.021.119.016.24.102.33a.47.47 0 0 0 .343.145h3.358l-.003.014-.23 1.333a.336.336 0 0 0 .089.288.41.41 0 0 0 .298.125h2.817a.703.703 0 0 0 .431-.145c.12-.093.2-.223.225-.365l.027-.13z"
            fill="#27346A"
          />
          <Path
            d="M18.548 8.18a.627.627 0 0 1 .376-.46.732.732 0 0 1 .293-.06h4.242a9.7 9.7 0 0 1 1.4.092 6.709 6.709 0 0 1 .695.14l.16.046c.21.064.406.14.587.226.212-1.234-.002-2.074-.735-2.835-.806-.837-2.264-1.196-4.128-1.196h-5.413c-.381 0-.706.252-.765.595L13.006 17.75c-.045.257.174.49.459.49h3.341l1.742-10.06z"
            fill="#27346A"
          />
        </G>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.3 8.164c-.016.094-.034.19-.055.289-.714 3.339-3.156 4.493-6.275 4.493h-1.588c-.381 0-.703.253-.762.596l-1.044 6.03c-.04.225.151.428.401.428h2.817c.333 0 .617-.22.669-.52l.027-.131.531-3.066.034-.17c.052-.3.336-.52.67-.52h.42c2.73 0 4.866-1.01 5.49-3.931.261-1.22.126-2.24-.564-2.956a2.666 2.666 0 0 0-.77-.542z"
          fill="#2790C3"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25.554 7.893a5.589 5.589 0 0 0-.694-.14 9.698 9.698 0 0 0-1.4-.094h-4.243a.732.732 0 0 0-.293.06.627.627 0 0 0-.376.461l-.902 5.21-.026.152c.06-.343.381-.596.762-.596h1.588c3.12 0 5.562-1.154 6.275-4.493.022-.099.04-.195.056-.29a4.045 4.045 0 0 0-.747-.27z"
          fill="#1F264F"
        />
      </G>
      <Defs>
        <ClipPath id="r0rup0juba">
          <Path fill="#fff" transform="translate(13 4)" d="M0 0h72v16H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  openKakao: [
    <Svg
      width="198"
      height="52"
      viewBox="0 0 198 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="198" height="52" rx="26" fill="#FEE900" />
      <Path
        d="M88.147 22.936V21.4h-2.032v-3.392h-1.888v8.336h1.888v-3.408h2.032zm-4.8 1.296c-1.68-.544-3.328-2.144-3.328-4.352v-1.232h-1.92v1.344c0 2.144-1.376 3.84-3.456 4.576l1.136 1.488c1.328-.464 2.864-1.792 3.296-3.248.624 1.312 2.096 2.464 3.2 2.88l1.072-1.456zm2.928 5.152c0-1.792-1.792-2.896-4.896-2.896-3.072 0-4.864 1.104-4.864 2.896 0 1.744 1.792 2.88 4.864 2.88 3.104 0 4.896-1.136 4.896-2.88zm-4.896-1.408c1.888 0 2.992.544 2.992 1.408 0 .848-1.104 1.376-2.992 1.376-1.856 0-2.944-.528-2.944-1.376 0-.864 1.088-1.408 2.944-1.408zm18.854 4.096v-4.704h-3.888v-1.04h5.536v-1.504h-12.88v1.504h5.456v1.04h-3.824v4.704h9.6zm.304-8.16V22.44h-1.936l.416-1.856a70.889 70.889 0 0 1-1.824-.224l-.352 2.08h-2.864c-.08-.688-.208-1.376-.304-2.096-.592.08-1.2.176-1.792.24.096.64.24 1.232.352 1.856h-1.968v1.472h10.272zm.048-4.016v-1.472H90.233v1.472h10.352zm-2.192 10.72h-5.904v-1.808h5.904v1.808zm15.814-12.064h-9.472v5.152h9.472v-5.152zm-3.664 10.592V26.52h5.376v-1.488h-12.88v1.488h5.632v2.624h1.872zm3.888 2.736v-1.472h-7.872V27.8h-1.872v4.08h9.744zm-2.096-9.664h-5.712V20.04h5.712v2.176zm7.222.112c0-1.008.768-1.824 2.048-1.824 1.296 0 2.064.816 2.064 1.824 0 1.056-.768 1.872-2.064 1.872-1.28 0-2.048-.816-2.048-1.872zm9.552-4.32h-1.856v14.256h1.856V18.008zm-11.472 4.336c0 1.984 1.568 3.424 3.968 3.424 2.416 0 3.952-1.44 3.952-3.424 0-2-1.536-3.424-3.952-3.424-2.4 0-3.968 1.424-3.968 3.424zm9.024 6.272-.16-1.504c-1.264.16-2.992.288-4.768.352-1.616.064-2.992.08-4.64.08l.272 1.6c1.2.016 2.896-.048 4.48-.112 1.52-.08 3.456-.24 4.816-.416zm12.662-5.728V21.4h-8.272v1.488h8.272zm-6.272-2.48h4.4v-1.472h-4.4v1.472zm9.216-2.4h-1.888v14.256h1.888v-6.928h1.984v-1.552h-1.984v-5.776zm-10.512 8.448c0 1.808 1.392 3.072 3.44 3.072s3.44-1.328 3.44-3.072c0-1.792-1.392-3.072-3.44-3.072s-3.44 1.328-3.44 3.072zm1.824 0c0-.944.688-1.568 1.616-1.568.928 0 1.616.624 1.616 1.568 0 .928-.576 1.552-1.616 1.552-.944 0-1.616-.624-1.616-1.552zm23.367 5.808V18.008h-1.872v14.256h1.872zm-4.384-12.768h-6.656v1.552h4.64c-.256 2.832-2.384 5.808-5.504 7.232l1.152 1.408c4.352-2.368 6.256-5.888 6.368-10.192z"
        fill="#3E2B2E"
      />
      <Path
        d="M25.997 7C16.056 7 8 14.439 8 23.617c0 6.776 2.841 10.015 6.742 12.962h.02v7.964c0 .377.429.591.728.364l6.827-5.063.15.065c1.144.208 2.327.324 3.536.324C35.944 40.233 44 32.795 44 23.617S35.944 7 26.003 7M19.97 27.83c1.762 0 3.27-1.052 3.725-2.681h2.607c-.637 3.135-3.081 5.186-6.339 5.186-3.784 0-6.781-2.817-6.781-6.738 0-3.92 2.997-6.737 6.781-6.737 3.29 0 5.748 2.096 6.352 5.283h-2.6c-.397-1.733-1.957-2.817-3.752-2.817-2.542 0-4.233 1.811-4.233 4.265 0 2.453 1.925 4.232 4.233 4.232m17.197 2.246h-2.392V24.68c0-1.24-.722-1.908-1.834-1.908-1.242 0-2.041.76-2.041 2.291v4.998H28.5v-13.17h2.392v4.953c.573-.87 1.502-1.292 2.764-1.292 1.02 0 1.853.331 2.503 1.02.67.687 1.001 1.609 1.001 2.81v5.686z"
        fill="#010202"
      />
    </Svg>,
  ],
  imgNotiDokebi: [
    <Svg
      width="78"
      height="112"
      viewBox="0 0 78 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#iuwasjm6ja)">
        <Path
          d="M38.847 56.96H66.2s-2.145 25.716-8.121 50.742c0 0 2.298.998 2.298 3.915-3.524 0-14.251.076-15.4 0-1.15-.077-2.682-6.832-3.678-14.74-.383-2.532-1.38-3.3-2.452-3.3-1.073 0-2.069.767-2.452 3.3-.996 7.908-2.529 14.74-3.678 14.74h-15.4c0-2.994 2.298-3.915 2.298-3.915-5.976-25.026-8.122-50.742-8.122-50.742h27.354z"
          fill="#fff"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M38.924 75.92a2.3 2.3 0 0 0 2.298-2.303 2.3 2.3 0 0 0-2.298-2.303 2.3 2.3 0 0 0-2.299 2.303 2.3 2.3 0 0 0 2.299 2.303z"
          fill="#000"
        />
        <Path
          d="M43.597 85.9h-9.04c-.614 0-1.15-.537-1.15-1.151V74.462c0-.614.536-1.151 1.15-1.151h9.117c.613 0 1.15.537 1.15 1.151v10.287c-.077.614-.537 1.151-1.227 1.151z"
          fill="#FFD300"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="m38.234 72.696-4.827-5.834M39.766 72.696l4.827-5.834"
          stroke="#000"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M15.247 35.005s-1.992-8.29-7.585-8.29S-.077 32.472.46 37.385c.536 4.836 4.137 12.897 13.255 12.59 0 0 3.448-3.608 1.532-14.97z"
          fill="#fff"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M13.715 37.538s-1.226-4.99-4.75-4.99c-3.525 0-4.904 3.532-4.521 6.45.383 2.916 2.605 7.83 8.428 7.599-.076-.077 2.069-2.226.843-9.059z"
          fill="#2A7FF6"
          stroke="#000"
          strokeMiterlimit="10"
        />
        <Path
          d="M62.752 35.005s1.992-8.29 7.586-8.29c5.593 0 7.738 5.757 7.202 10.67-.536 4.836-4.138 12.897-13.255 12.59 0 0-3.448-3.608-1.533-14.97z"
          fill="#fff"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M64.284 37.538s1.226-4.99 4.751-4.99c3.525 0 4.904 3.532 4.52 6.45-.383 2.916-2.605 7.83-8.428 7.599.077-.077-2.068-2.226-.843-9.059z"
          fill="#2A7FF6"
          stroke="#000"
          strokeMiterlimit="10"
        />
        <Path
          d="M39 68.629c10.267 0 19.615-3.225 22.91-5.297 3.294-2.073 4.597-4.913 4.597-8.444 0-18.424-3.448-26.33-3.448-26.33C56.546 12.282 39 13.434 39 13.434S21.454 12.36 14.941 28.557c0 0-3.448 7.907-3.448 26.33 0 3.532 1.303 6.372 4.597 8.445 3.295 2.072 12.643 5.297 22.91 5.297z"
          fill="#fff"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="m19.002 28.48 14.48 2.15s-2.451 5.297-7.202 5.297c-4.75 0-7.202-4.069-7.279-7.447z"
          fill="#fff"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="m25.438 29.401.306 6.449 2.3-.154.535-5.68-3.141-.615z"
          fill="#000"
        />
        <Path
          d="M58.691 28.48 44.21 30.63s2.452 5.297 7.202 5.297 7.28-4.069 7.28-7.447z"
          fill="#fff"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="m52.255 29.401-.306 6.449-2.299-.154-.536-5.68 3.141-.615z"
          fill="#000"
        />
        <Path
          d="M26.127 41.223c-.23 1.919-2.911 3.147-5.976 2.763-3.065-.384-5.287-2.303-5.057-4.222.23-1.919 1.992-3.378 5.976-2.763 3.065.46 5.364 2.303 5.057 4.222z"
          fill="#ED4847"
        />
        <Path
          d="M25.898 42.068c-.843 1.458-3.142 2.226-5.67 1.919-3.065-.384-5.287-2.303-5.057-4.222"
          stroke="#000"
          strokeWidth=".5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M51.872 41.223c.23 1.919 2.911 3.147 5.976 2.763 3.065-.384 5.287-2.303 5.057-4.222-.23-1.919-1.992-3.378-5.976-2.763-3.065.46-5.287 2.303-5.057 4.222z"
          fill="#ED4847"
        />
        <Path
          d="M52.178 42.068c.843 1.458 3.142 2.226 5.67 1.919 3.065-.384 5.287-2.303 5.057-4.222"
          stroke="#000"
          strokeWidth=".5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M39.153 34.084c.306.614 1.15 2.303 1.38 3.378.076.23-.078.46-.307.46l-1.303.23c-.23.077-.46-.153-.46-.46 0-.768.154-2.457.537-3.608-.077-.154.076-.154.153 0z"
          fill="#000"
        />
        <Path
          d="M33.56 23.567s-1.456-3.377-6.743-4.222c-5.287-.844-6.896 1.152-7.356 1.689-.766.844-.766 4.452 2.529 4.376 3.295-.077 5.976.307 7.432 1.381 2.605 1.843 5.364-.23 4.138-3.224zM44.593 23.797s1.302-3.377 6.59-4.452c5.286-1.075 6.972.921 7.431 1.459.843.844.92 4.452-2.375 4.452-3.371.077-5.976.537-7.432 1.612-2.529 1.92-5.287 0-4.214-3.07zM39.306 58.803c2.75 0 4.98-3.162 4.98-7.063 0-3.9-2.23-7.062-4.98-7.062-2.75 0-4.98 3.162-4.98 7.062 0 3.9 2.23 7.063 4.98 7.063z"
          fill="#000"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M39.306 58.726c2.452 0 4.444-2.457 4.904-5.681-1.303-.768-2.988-1.151-4.904-1.151-1.915 0-3.601.46-4.904 1.151.46 3.3 2.452 5.68 4.904 5.68z"
          fill="#ED4847"
          stroke="#000"
          strokeMiterlimit="10"
        />
        <Path
          d="M39 17.119c6.206 0 7.432-2.073 7.432-2.073C45.666 3.224 39 .461 39 .461s-6.666 2.763-7.432 14.585c0-.076 1.226 2.073 7.432 2.073z"
          fill="#FFD300"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M39 19.345c13.102 0 11.417-7.446 10.344-8.904-1.15-1.459-3.065-1.382-4.29-.768-1.227.614-2.146.307-2.99-1.459-.995-1.995-2.987-1.919-2.987-1.919s-1.992-.076-2.988 1.92c-.92 1.842-1.763 2.149-2.989 1.458-1.226-.614-3.141-.69-4.29.768-1.226 1.535-2.912 8.904 10.19 8.904z"
          fill="#2A7FF6"
          stroke="#000"
          strokeMiterlimit="10"
        />
        <Path
          d="M41.605 83.982H36.47c-.536 0-.92-.46-.92-.921v-6.91c0-.537.46-.92.92-.92h5.134c.536 0 .92.46.92.92v6.91c.076.46-.384.92-.92.92z"
          fill="#EE4423"
        />
        <Path
          d="M35.935 83.29v-.153.307c0 .077 0 .077.077.154l.076.076h.154-.154s-.076 0-.076-.076l-.077-.077v-.537c0-.461 0-.922-.153-1.305.153-.077.23-.998.153-.998 0-.154-.077-.384-.077-.538v.384-.384a33.349 33.349 0 0 1 0-3.915v-.46c0-.077.077-.077.077-.077h.383c.69 0 1.38 0 1.762.077h.307-.383c.46 0 .92-.077 1.302-.077-.076 0-.076 0-.23-.077h.23c.23-.077.613-.077.843-.077-.076 0 .153 0 .23.077h-.077 1.609l.077.077.077.077v.153c-.077 0 0 .384-.077.154.077.383 0 .69.077 1.074 0 1.229 0 2.457.076 3.762 0 .46.077.844.077 1.382.077.383.077.92.153 1.074v.614c0 .077-.076.154-.153.23a1.058 1.058 0 0 1-.307.231c.077 0-.076.077-.153.077h-.153.077c.23 0 .306 0 .383-.077.076-.077.153-.077.306-.23.077-.077.153-.154.153-.307v-1.612c0-.538 0-1.152.077-1.69v-4.759c0-.076 0-.153-.077-.23-.076-.153-.076-.23-.153-.307l-.23-.23c-.153-.077-.23-.077-.383-.077H38.54c-.076-.077-2.298.077-2.452.077h-.306c-.077 0-.153 0-.23.076-.153.077-.306.154-.383.23-.077.154-.153.231-.153.385v.383c0 .384-.077.768-.077 1.152 0 .154.077.307.077.46v.308c-.077.383-.077.614 0 .383V80.527c0 .077.076.768.076.844v-.076c0 .384-.076.614-.076.92v1.459c0 .23.153.384.23.538.153.153.306.23.536.23H36.47c0-.077-.23 0-.23-.077.537 0 1.073.077 1.533.077.077 0 .23 0 .23.077h.23c.153 0 .23.077.46 0h.383c.076 0 .69-.154.766-.154h.383s.076 0 0 0h.23c-.154 0-.383-.076-.613-.076h.306c.077 0 .307.076.46.076 0 0 .076-.076.153 0h.153-.23.767s-.23 0-.154-.076h.23s-.076 0 0 0h.23-.076c.076 0-.537.153-.384.076 0 0 .537-.076.46-.153-.076 0 .077 0 0-.077h-.076c-.077 0-.154-.077-.077-.077.153 0-.383.154-.306.077h-.077.46c-.384 0 .23-.23-.077-.23.153.076-.077.076-.23.076 0 0-.077 0-.153-.076h-.077c-.076 0-.153 0-.153-.077h-.69s-.153-.077-.076-.077c.153 0-.077.077.153.077-.077-.077.153 0 .23-.077h-.69.077-.307l-.612.077h-.154s.843-.077.69-.077c-.077 0-.996.077-.996.077h-.153c-.077 0 0 0-.077-.077h-.69c.077 0 .077-.077.23-.077h.077-.383c-.077-.076-.383 0-.613 0h-.077c-.23 0-.306 0-.536-.076-.077 0-.077 0 0 .076h-.154c.154-.076-.306-.076-.153-.153h-.23s0 .077-.153.077h-.153v-.077c-.077 0-.077 0-.077-.077v-.077s0-.076-.076-.076c0 0 0-.077-.077-.077.536 0 .536 0 .613.077z"
          fill="#EE4423"
        />
        <Path
          d="M41.605 75.768h-5.134c-.306 0-.613.307-.613.614V82.984c0 .306.307.614.613.614h3.525c.153 0 .306-.077.46-.154l1.532-1.535a.698.698 0 0 0 .23-.538v-4.913c0-.383-.23-.69-.613-.69zm-.92.076h.92c.306 0 .536.23.536.538v.92h-.996c-.23 0-.383-.153-.383-.383v-1.075h-.077zm-4.673.538c0-.307.23-.538.536-.538h.92v.998c0 .23-.154.384-.384.384h-1.072v-.844zm1.455 6.985h-.919a.524.524 0 0 1-.536-.537v-.921h.996c.23 0 .383.153.383.384v1.074h.076zm4.674-2.15c0 .154-.076.308-.153.462l-1.532 1.535a.585.585 0 0 1-.384.153h-2.528v-.998a.524.524 0 0 0-.536-.537h-.996V77.38h.996c.306 0 .536-.23.536-.538v-.998h3.065v.998c0 .307.23.538.536.538h.996v3.838z"
          fill="#fff"
        />
        <Path
          d="M39.843 82.984h-3.065c-.23 0-.383-.154-.383-.384v-5.988c0-.23.153-.383.383-.383h4.597c.23 0 .383.153.383.383v4.53c0 .153-.076.23-.153.306l-1.379 1.382c-.077.154-.23.154-.383.154z"
          fill="#fff"
        />
        <Path
          d="M39.843 83.06h-3.065c-.23 0-.46-.153-.46-.46v-5.988c0-.23.154-.46.46-.46h4.597c.23 0 .46.153.46.46v4.53c0 .153-.077.23-.153.383l-1.38 1.382c-.153.076-.306.153-.46.153zm-3.065-6.755c-.153 0-.306.153-.306.307V82.6c0 .153.153.307.306.307h3.065c.076 0 .23-.077.306-.154l1.38-1.382c.076-.076.153-.153.153-.307v-4.529c0-.153-.153-.307-.307-.307h-4.597v.077z"
          fill="#EC4624"
        />
        <Path
          d="M37.008 76.843h4.137v4.068c0 .077 0 .154-.076.23l-1.15 1.152c-.076.077-.153.077-.23.077h-2.681v-5.527z"
          fill="#fff"
        />
        <Path
          d="M39.69 82.446h-2.682v-5.68h4.214v4.145c0 .077-.077.23-.153.307l-1.15 1.151c-.076 0-.153.077-.23.077zm-2.682-.076h2.605c.077 0 .153 0 .23-.077l1.15-1.152c.076-.077.076-.153.076-.23v-4.069h-4.061v5.528z"
          fill="#EE4423"
        />
        <Path
          d="M40.38 81.448h-2.606c-.153 0-.23-.077-.23-.23v-.307c0-.077.077-.23.23-.23h.767s.076 0 .076-.077v-.23s0-.077-.076-.077h-.767c-.153 0-.23-.077-.23-.23v-1.229c0-.077.077-.23.23-.23h1.84s.076 0 .076-.077v-.154s0-.076-.077-.076h-1.839c-.153 0-.23-.077-.23-.23v-.308c0-.076.077-.23.23-.23h.383v-.384c0-.076.077-.23.23-.23h.23c.077 0 .23.077.23.23v.384h.536v-.384c0-.076.077-.23.23-.23h.23c.077 0 .23.077.23.23v.384h.383c.153 0 .23.077.23.23v1.152c0 .077-.077.23-.23.23h-1.839s-.076 0-.076.077v.153s0 .077.076.077h1.839c.153 0 .23.077.23.23v.308c0 .076-.077.23-.23.23h-.766s-.077 0-.077.077v.23s0 .077.077.077h.766c.153 0 .23.076.23.23v.307c-.077.153-.153.307-.307.307zm-2.606-.614s-.076 0 0 0l-.076.384s0 .076.076.076h2.605s.077 0 .077-.076v-.307s0-.077-.077-.077h-.766c-.153 0-.23-.077-.23-.23v-.23c0-.077.077-.23.23-.23h.766s.077 0 .077-.078v-.307s0-.076-.077-.076h-1.838c-.154 0-.23-.077-.23-.23v-.154c0-.077.076-.23.23-.23h1.838s.077 0 .077-.077V77.84s0-.077-.077-.077h-.536v-.537h-.23v.537h-.92v-.537h-.23v.537h-.535s-.077 0-.077.077v.307s0 .077.077.077h1.838c.154 0 .23.077.23.23v.154c0 .076-.076.23-.23.23h-1.838s-.077 0-.077.077v1.228s0 .077.077.077h.766c.153 0 .23.077.23.23v.23c0 .077-.077.23-.23.23h-.92v-.076z"
          fill="#EE4423"
        />
        <Path
          d="M37.468 76.843v-.615h-.69c-.23 0-.383.154-.383.384v.691h.613c.306 0 .46-.153.46-.46z"
          fill="#fff"
        />
        <Path
          d="M37.008 77.38h-.69v-.768c0-.23.154-.46.46-.46h.766v.69c0 .307-.23.538-.536.538zm-.536-.077h.613c.23 0 .46-.23.46-.46v-.615h-.767c-.153 0-.306.154-.306.307v.768z"
          fill="#EE4423"
        />
        <Path
          d="M36.778 82.984h.69v-.614c0-.23-.23-.46-.46-.46h-.613v.69c0 .23.153.384.383.384z"
          fill="#fff"
        />
        <Path
          d="M37.544 83.06h-.766c-.23 0-.46-.153-.46-.46v-.768h.69c.306 0 .536.23.536.537v.691zm-1.072-1.151v.69c0 .154.153.308.306.308h.69v-.614c0-.23-.23-.461-.46-.461h-.536v.077z"
          fill="#EE4423"
        />
        <Path
          d="M41.146 77.303h.613v-.69c0-.231-.154-.385-.383-.385h-.69v.615c0 .307.153.46.46.46z"
          fill="#fff"
        />
        <Path
          d="M41.759 77.38h-.69a.524.524 0 0 1-.536-.538v-.69h.766c.23 0 .46.153.46.46v.768zm-1.073-1.075v.614c0 .23.23.46.46.46h.613v-.69c0-.154-.154-.307-.307-.307h-.766v-.077z"
          fill="#EE4423"
        />
        <Path
          d="M11.34 58.111S2.221 70.624 4.443 77.84c0 0 .996 3.378 4.98 1.535 3.984-1.842 4.904-15.046 4.904-15.046l-2.989-6.218z"
          fill="#fff"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M11.953 57.574s4.75 2.456 5.516 8.598c.766 6.14-3.524 13.51-3.524 13.51l-.23-3.761s0-6.602-5.057-12.13c-1.456-1.534.536-7.445 3.295-6.217z"
          fill="#000"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinejoin="round"
        />
        <Path
          d="M5.44 79.298c6.896 8.52 17.623-14.048 17.623-14.048s3.141-3.761 1.302-6.295c-2.758-3.838-.536-9.365-2.452-10.9-2.068-1.69-4.367.23-4.75 7.676-4.214 5.68-9.118 14.048-9.118 14.048"
          fill="#fff"
        />
        <Path
          d="M5.44 79.298c6.896 8.52 17.623-14.048 17.623-14.048s3.141-3.761 1.302-6.295c-2.758-3.838-.536-9.365-2.452-10.9-2.068-1.69-4.367.23-4.75 7.676-4.214 5.68-9.118 14.048-9.118 14.048"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M66.353 58.111s9.118 12.513 6.896 19.729c0 0-.996 3.378-4.98 1.535-4.06-1.842-4.904-15.046-4.904-15.046l2.988-6.218z"
          fill="#fff"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M65.74 57.574s-4.75 2.456-5.516 8.598c-.766 6.14 3.525 13.51 3.525 13.51l.23-3.761s0-6.602 5.056-12.13c1.456-1.534-.536-7.445-3.294-6.217z"
          fill="#000"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinejoin="round"
        />
        <Path
          d="M72.33 79.298c-7.969 8.137-20.534-13.51-20.534-13.51s-3.602-3.608-1.456-6.065c3.141-3.685.613-8.981 2.835-10.44 2.375-1.612 5.057.23 5.517 7.37 4.903 5.526 10.573 13.51 10.573 13.51"
          fill="#fff"
        />
        <Path
          d="M72.33 79.298c-7.969 8.137-20.534-13.51-20.534-13.51s-3.602-3.608-1.456-6.065c3.141-3.685.613-8.981 2.835-10.44 2.375-1.612 5.057.23 5.517 7.37 4.903 5.526 10.573 13.51 10.573 13.51"
          stroke="#000"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="iuwasjm6ja">
          <Path fill="#fff" d="M0 0h78v112H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
};

export default pressIcons;
