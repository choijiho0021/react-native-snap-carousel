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
    <Svg width="43" height="38" viewBox="0 0 43 38" fill="none">
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
    <Svg width="14" height="15" viewBox="0 0 14 15" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.646 12.354a.5.5 0 0 0 .708-.708L1.707 8H13a.5.5 0 0 0 0-1H1.707l3.647-3.646a.5.5 0 1 0-.708-.708l-4.5 4.5a.5.5 0 0 0 0 .708l4.5 4.5z"
        fill="#2C2C2C"
      />
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
  alarmFill: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="10" cy="10" r="9" fill="#AAA" />
      <Rect
        x="11"
        y="15"
        width="2"
        height="7"
        rx="1"
        transform="rotate(-180 11 15)"
        fill="#fff"
      />
      <Circle cx="10" cy="6" r="1" transform="rotate(-180 10 6)" fill="#fff" />
    </Svg>,
  ],
  plusWhite: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 6a1 1 0 1 0-2 0v3H6a1 1 0 1 0 0 2h3v3a1 1 0 1 0 2 0v-3h3a1 1 0 1 0 0-2h-3V6z"
        fill="#fff"
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
  plusBlue: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 4a1 1 0 0 0-2 0v3H4a1 1 0 1 0 0 2h3v3a1 1 0 1 0 2 0V9h3a1 1 0 1 0 0-2H9V4z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  minus16: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M13 8H3"
        stroke="#2C2C2C"
        strokeWidth="2"
        strokeLinecap="round"
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
  boldMinus: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M13 8H3"
        stroke="#2C2C2C"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>,
  ],
  boldPlus: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 4a1 1 0 0 0-2 0v3H4a1 1 0 1 0 0 2h3v3a1 1 0 1 0 2 0V9h3a1 1 0 1 0 0-2H9V4z"
        fill="#2C2C2C"
      />
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
  prodInfo: [
    <Svg
      width="27"
      height="26"
      viewBox="0 0 27 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m5.547 3.5-1.583 19h18.74l-1.584-19H5.547zm17.068-.125A1.5 1.5 0 0 0 21.12 2H5.547a1.5 1.5 0 0 0-1.495 1.375l-1.583 19A1.5 1.5 0 0 0 3.964 24h18.74a1.5 1.5 0 0 0 1.494-1.625l-1.583-19z"
        fill="#2C2C2C"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.333 6a.75.75 0 0 1 .75.75v1a2.25 2.25 0 0 0 4.5 0v-1a.75.75 0 0 1 1.5 0v1a3.75 3.75 0 1 1-7.5 0v-1a.75.75 0 0 1 .75-.75z"
        fill="#2C2C2C"
      />
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
        clipPath="url(#1utqpdok7a)"
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
  cautionIconClearBlue: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#DAEEFF" />
      <Path
        d="M13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 8a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  cautionUsageIcon: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#ED4847" />
      <Path
        d="M13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 8a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8z"
        fill="#fff"
      />
    </Svg>,
  ],
  checkUsageIcon: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#5B16EF" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.909 9.247a1 1 0 0 1 .095 1.41l-3.82 4.377a1 1 0 0 1-1.467.043l-2.43-2.47a1 1 0 1 1 1.426-1.402l1.673 1.7 3.112-3.563a1 1 0 0 1 1.41-.095z"
        fill="#fff"
      />
    </Svg>,
  ],
  chargeHistoryCautionIcon: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#ED4847" />
      <Path
        d="M13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 8a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8z"
        fill="#fff"
      />
    </Svg>,
  ],
  cautionBlue: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#2A7FF6" />
      <Path
        d="M13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 8a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8z"
        fill="#fff"
      />
    </Svg>,
  ],
  cautionRed: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#ED4847" />
      <Path
        d="M13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 8a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8z"
        fill="#fff"
      />
    </Svg>,
  ],
  checkGreen: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#00AD50" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.909 9.247a1 1 0 0 1 .095 1.41l-3.82 4.377a1 1 0 0 1-1.467.043l-2.43-2.47a1 1 0 1 1 1.426-1.402l1.673 1.7 3.112-3.563a1 1 0 0 1 1.41-.095z"
        fill="#fff"
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
  triangle: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M8.451 10.208a.627.627 0 0 1-.902 0L4.128 6.429c-.303-.334-.034-.83.451-.83h6.842c.485 0 .754.496.451.83l-3.42 3.779z"
        fill="#979797"
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
  checkedDarkBlueSmall: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9087 5.24676C12.3247 5.61001 12.3675 6.24173 12.0043 6.65774L8.18326 11.0337C8.00017 11.2434 7.73796 11.3673 7.45972 11.3756C7.18147 11.3838 6.91237 11.2758 6.71714 11.0773L4.28714 8.60733C3.89982 8.21363 3.90499 7.58048 4.29869 7.19316C4.69239 6.80584 5.32553 6.811 5.71286 7.2047L7.38629 8.90568L10.4977 5.34229C10.861 4.92628 11.4927 4.8835 11.9087 5.24676Z"
        fill="#194C94"
      />
    </Svg>,
  ],
  checkRedSmall: [
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
        fill="#EE4423"
      />
    </Svg>,
  ],
  checkGreySmall: [
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
        fill="#777"
      />
    </Svg>,
  ],
  checkGreenSmall: [
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
        fill="#00AD50"
      />
    </Svg>,
  ],
  star: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9.552 1.908a.5.5 0 0 1 .896 0l2.375 4.811a.5.5 0 0 0 .376.274l5.309.771a.5.5 0 0 1 .277.853l-3.841 3.745a.5.5 0 0 0-.144.442l.907 5.288a.5.5 0 0 1-.726.527l-4.748-2.497a.5.5 0 0 0-.466 0L5.02 18.62a.5.5 0 0 1-.726-.527l.907-5.288a.5.5 0 0 0-.144-.442L1.215 8.617a.5.5 0 0 1 .277-.853l5.309-.771a.5.5 0 0 0 .376-.274l2.375-4.81z"
        fill="url(#f138301lza)"
      />
      <Path
        d="M9.776 2.02a.25.25 0 0 1 .448 0l2.374 4.81a.75.75 0 0 0 .565.41l5.309.772a.25.25 0 0 1 .139.426l-3.842 3.745a.75.75 0 0 0-.216.663l.907 5.288a.25.25 0 0 1-.363.263l-4.748-2.496a.75.75 0 0 0-.698 0l-4.748 2.496a.25.25 0 0 1-.363-.263l.907-5.288a.75.75 0 0 0-.216-.663L1.389 8.438a.25.25 0 0 1 .139-.426l5.309-.772a.75.75 0 0 0 .565-.41l2.374-4.81z"
        stroke="#fff"
        strokeOpacity=".16"
        stroke-width=".5"
      />
      <Defs>
        <LinearGradient
          id="f138301lza"
          x1="11.429"
          y1="20.286"
          x2="5.714"
          y2="1.357"
          gradientUnits="userSpaceOnUse">
          <Stop offset=".14" stopColor="#FFBC00" />
          <Stop offset="1" stopColor="#FFE393" />
        </LinearGradient>
      </Defs>
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
  delivery: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9 6a1 1 0 0 1 1-1h2.172a1 1 0 0 1 .983.813l.218 1.145a.82.82 0 0 0 .806.667.82.82 0 0 1 .821.82V11a1 1 0 0 1-1 1H9V6z"
        fill="#2A7FF6"
      />
      <Rect x="1" y="2" width="9" height="10" rx="1" fill="#4F99FF" />
      <Circle cx="4" cy="12" r="2" fill="#194C94" />
      <Circle cx="11" cy="12" r="2" fill="#194C94" />
    </Svg>,
  ],
  rightBlueAngleBracket: [
    <Svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M4.5.5 9 5 4.5 9.5"
        stroke="#2A7FF6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  rightBlueBracket: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m6.4 3.2 4.525 4.526L6.4 12.25"
        stroke="#2A7FF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
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
  ticket: [
    <Svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M34 8H6a4 4 0 0 0-4 4v16a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V12a4 4 0 0 0-4-4z"
        fill="#F3EDFF"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 15a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4v-3z"
        fill="#5B16EF"
      />
      <Path
        d="M19.552 16.909a.5.5 0 0 1 .896 0l.611 1.237a.5.5 0 0 0 .377.274l1.366.198a.5.5 0 0 1 .277.853l-.989.964a.5.5 0 0 0-.143.442l.233 1.36a.5.5 0 0 1-.726.528l-1.221-.643a.5.5 0 0 0-.466 0l-1.221.643a.5.5 0 0 1-.726-.527l.233-1.36a.5.5 0 0 0-.143-.443l-.989-.964a.5.5 0 0 1 .277-.853l1.366-.198a.5.5 0 0 0 .377-.274l.61-1.237z"
        fill="#FFC82D"
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
  iconCalendar: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.923.23a1 1 0 0 1 1 1v.231h4.154v-.23a1 1 0 1 1 2 0v.23h.692a3 3 0 0 1 3 3v8.308a3 3 0 0 1-3 3H3.231a3 3 0 0 1-3-3V4.46a3 3 0 0 1 3-3h.692v-.23a1 1 0 0 1 1-1zm5.154 3.231v.231a1 1 0 1 0 2 0v-.23h.692a1 1 0 0 1 1 1v1.307H2.231V4.46a1 1 0 0 1 1-1h.692v.231a1 1 0 0 0 2 0v-.23h4.154zM2.231 7.77v5a1 1 0 0 0 1 1h9.538a1 1 0 0 0 1-1v-5H2.231zm4.923 2.692a1 1 0 0 1-1 1h-1.23a1 1 0 1 1 0-2h1.23a1 1 0 0 1 1 1zm3.923 1a1 1 0 1 0 0-2h-1.23a1 1 0 1 0 0 2h1.23z"
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
  iconArrowRightBlack: [
    <Svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M5 .5 9.5 5 5 9.5"
        stroke="#2C2C2C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  iconArrowUp: [
    <Svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M.5 6.967 5 2.54l4.5 4.426"
        stroke="#2C2C2C"
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
  iconArrowDown11: [
    <Svg
      width="11"
      height="10"
      viewBox="0 0 11 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#6ns27kvo6a)">
        <Path
          d="m1 3 4.5 4.5L10 3"
          stroke="#979797"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="6ns27kvo6a">
          <Path fill="#fff" transform="translate(.5)" d="M0 0h10v10H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  iconArrowUp11: [
    <Svg
      width="11"
      height="10"
      viewBox="0 0 11 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#ndtvnmo3ma)">
        <Path
          d="m1 7 4.5-4.5L10 7"
          stroke="#777"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="ndtvnmo3ma">
          <Path fill="#fff" transform="translate(.5)" d="M0 0h10v10H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  rightArrow10: [
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
      <Path d="M0 0h20v20H0V0z" fill="#000" fillOpacity=".4" />
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
  emptyCart: [
    <Svg
      width="176"
      height="176"
      viewBox="0 0 176 176"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="88" cy="88" r="88" fill="url(#g5bj5ieg9a)" />
      <Rect
        x="58.957"
        y="55.416"
        width="49.35"
        height="49.35"
        rx="5"
        transform="rotate(-30 58.957 55.416)"
        fill="url(#naevvbmtxb)"
      />
      <Rect
        x="23"
        y="88"
        width="20"
        height="20"
        rx="5"
        fill="url(#owptfq9yzc)"
      />
      <Rect
        x="37"
        y="99"
        width="12"
        height="12"
        rx="3"
        fill="url(#00ewmdbard)"
      />
      <Rect x="60" y="24" width="6" height="6" rx="3" fill="url(#l6mfz93zve)" />
      <Rect
        x="124"
        y="46"
        width="9"
        height="9"
        rx="4.5"
        fill="url(#uafrkpwdtf)"
      />
      <Rect
        x="51"
        y="138"
        width="10"
        height="10"
        rx="5"
        fill="url(#6q8t6jwm2g)"
      />
      <Rect
        x="111"
        y="105"
        width="26"
        height="26"
        rx="5"
        fill="url(#z950c6hdph)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M97.918 60.276a1.264 1.264 0 1 0-1.788-1.787l-3.825 3.825-4.022-4.022a1.264 1.264 0 1 0-1.788 1.788l4.022 4.022-4.219 4.219a1.264 1.264 0 0 0 1.788 1.787l4.219-4.218 4.022 4.022a1.264 1.264 0 0 0 1.788-1.788l-4.022-4.022 3.825-3.826z"
        fill="url(#j6s4t2pxei)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46.3 54.209a1.5 1.5 0 0 1 1.98-.762l9.19 4.084a1.5 1.5 0 0 1 .851 1.031l4.59 19.739h58.894a2 2 0 0 1 1.961 2.392l-6.347 31.734a2 2 0 0 1-1.961 1.608H68.575c-2.593.306-4.6 2.797-4.6 5.615 0 2.861 2.148 5.133 5.13 5.137h46.972a1.5 1.5 0 1 1 0 3H69.112c-4.694 0-8.136-3.669-8.136-8.137 0-3.191 1.803-6.385 4.692-7.837l-5.344-31.174a2.024 2.024 0 0 1-.03-.346l-4.726-20.324-8.506-3.78a1.5 1.5 0 0 1-.762-1.98z"
        fill="url(#qyg1osfzdj)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M92 78.3v35.735h23.251a2 2 0 0 0 1.959-1.595l6.553-31.735a2 2 0 0 0-1.959-2.404H92zm0 46.487h23.826c.855 0 1.549.671 1.549 1.5 0 .828-.694 1.5-1.549 1.5H92v-3z"
        fill="url(#qcn3d6f1kk)"
      />
      <Path
        d="M78.6 133.823a2.924 2.924 0 1 1-5.849 0 2.924 2.924 0 0 1 5.849 0z"
        stroke="url(#h9j5vl6jbl)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <Circle
        cx="107.277"
        cy="133.823"
        r="2.924"
        stroke="url(#q5szyvk5km)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <Path
        d="M75.238 90.553h33.692M75.238 101.783h33.692"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs>
        <LinearGradient
          id="g5bj5ieg9a"
          x1="60.952"
          y1="48"
          x2="144"
          y2="180.571"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#E1EDFF" />
          <Stop offset="1" stopColor="#F8FAFE" />
        </LinearGradient>
        <LinearGradient
          id="naevvbmtxb"
          x1="105.702"
          y1="56.988"
          x2="52.967"
          y2="115.694"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="owptfq9yzc"
          x1="26.5"
          y1="88"
          x2="43"
          y2="110"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="00ewmdbard"
          x1="37"
          y1="99"
          x2="55.5"
          y2="119.5"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="l6mfz93zve"
          x1="60"
          y1="23.192"
          x2="65.077"
          y2="30"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="uafrkpwdtf"
          x1="133"
          y1="43"
          x2="121"
          y2="58.5"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="6q8t6jwm2g"
          x1="58.5"
          y1="140"
          x2="46"
          y2="155"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="z950c6hdph"
          x1="134"
          y1="107"
          x2="97"
          y2="147"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="j6s4t2pxei"
          x1="92.108"
          y1="57.662"
          x2="88.948"
          y2="82.944"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2A7FF6" />
          <Stop offset="1" stopColor="#2A7FF6" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="qyg1osfzdj"
          x1="66.5"
          y1="74"
          x2="101"
          y2="141"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#1D77F6" />
          <Stop offset="1" stopColor="#fff" stopOpacity=".75" />
        </LinearGradient>
        <LinearGradient
          id="qcn3d6f1kk"
          x1="114.5"
          y1="71"
          x2="92"
          y2="155.5"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#1D77F6" />
          <Stop offset="1" stopColor="#fff" stopOpacity=".33" />
        </LinearGradient>
        <LinearGradient
          id="h9j5vl6jbl"
          x1="66.898"
          y1="138"
          x2="82.898"
          y2="130"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#1D77F6" />
          <Stop offset="1" stopColor="#1D77F6" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="q5szyvk5km"
          x1="98.5"
          y1="138"
          x2="114.5"
          y2="130"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#1D77F6" />
          <Stop offset="1" stopColor="#1D77F6" stopOpacity="0" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
  emptyESIM: [
    <Svg
      width="176"
      height="176"
      viewBox="0 0 176 176"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="88" cy="88" r="88" fill="url(#ishf0r8cha)" />
      <Ellipse
        cx="70.952"
        cy="31.268"
        rx="6.952"
        ry="7.268"
        fill="url(#o7qo61bhsb)"
      />
      <Circle cx="104.476" cy="151.476" fill="url(#cmq3rsy1nc)" r="3.476" />
      <Circle cx="132.74" cy="57.74" r="4.74" fill="url(#dk0r9r97sd)" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M150.351 92.838c0 .552-.065 1.09-.189 1.604a7.462 7.462 0 0 1 5.162 7.099 7.459 7.459 0 0 1-7.459 7.459H130.459a7.46 7.46 0 0 1-1.242-14.816l-.001-.103a5.595 5.595 0 0 1 8.46-4.806 6.838 6.838 0 0 1 12.675 3.563z"
        fill="url(#rcshoz816e)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M64.649 130.162c0 .336-.04.663-.115.976A4.54 4.54 0 0 1 63.136 140H52.54a4.54 4.54 0 0 1-.757-9.018v-.063a3.405 3.405 0 0 1 5.15-2.926 4.162 4.162 0 0 1 7.715 2.169z"
        fill="url(#xtpt1a8ovf)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M76.421 68.739c0 .544-.064 1.073-.186 1.58a7.351 7.351 0 0 1-2.264 14.348H56.818a7.351 7.351 0 0 1-1.224-14.602l-.001-.101a5.513 5.513 0 0 1 8.337-4.737 6.739 6.739 0 0 1 12.491 3.511z"
        fill="url(#wlonrxeqlg)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M56.441 74.467c0 .736-.087 1.451-.252 2.136 3.991 1.29 6.878 5.038 6.878 9.459 0 5.488-4.45 9.938-9.939 9.938h-23.19C24.45 96 20 91.55 20 86.062c0-4.925 3.582-9.014 8.284-9.802l-.002-.137a7.454 7.454 0 0 1 11.271-6.403 9.11 9.11 0 0 1 16.888 4.747z"
        fill="url(#ktik39j5mh)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M99.867 58.2a20.031 20.031 0 0 1 7.704-7.717c4.014-2.247 8.971.698 8.943 5.298a20.06 20.06 0 0 1-2.833 10.156l-10.146 16.975 13.227 31.878a9.985 9.985 0 0 1-2.879 11.538 1 1 0 0 1-1.484-.246L94.77 97.575l-7.814 13.072 2.917 5.052a9.09 9.09 0 0 1-3.328 12.418.91.91 0 0 1-1.242-.333l-5.003-8.666-3.674 1.914c-2.596 1.354-5.719-.449-5.845-3.374l-.177-4.113H60.64a.91.91 0 0 1-.91-.909 9.09 9.09 0 0 1 9.092-9.091h5.772l7.45-13.366-33.592-1.016A.999.999 0 0 1 47.5 88a9.986 9.986 0 0 1 8.552-8.263l34.319-4.496L99.867 58.2z"
        fill="url(#imu9s3efmi)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m72.916 121.026 40.671-70.445c1.722 1.034 2.941 2.912 2.927 5.2a20.06 20.06 0 0 1-2.833 10.155l-10.146 16.975 13.227 31.878a9.984 9.984 0 0 1-2.879 11.538.998.998 0 0 1-1.484-.245L94.77 97.575l-7.814 13.072 2.917 5.051a9.092 9.092 0 0 1-3.328 12.419.91.91 0 0 1-1.242-.333l-5.003-8.666-3.674 1.914a3.967 3.967 0 0 1-3.71-.006z"
        fill="url(#uulo9zs3hj)"
      />
      <Rect
        x="84.532"
        y="99"
        width="1.896"
        height="17.065"
        rx=".948"
        transform="rotate(30 84.532 99)"
        fill="#1D77F6"
      />
      <Defs>
        <LinearGradient
          id="ishf0r8cha"
          x1="60.952"
          y1="48"
          x2="144"
          y2="180.571"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#E1EDFF" />
          <Stop offset="1" stopColor="#F8FAFE" />
        </LinearGradient>
        <LinearGradient
          id="o7qo61bhsb"
          x1="70.952"
          y1="24"
          x2="78.794"
          y2="45.589"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="cmq3rsy1nc"
          x1="108.099"
          y1="148"
          x2="101.147"
          y2="159.377"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="dk0r9r97sd"
          x1="137.681"
          y1="53"
          x2="128.2"
          y2="68.514"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="rcshoz816e"
          x1="139.224"
          y1="92.325"
          x2="127.724"
          y2="111.875"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="xtpt1a8ovf"
          x1="57.876"
          y1="129.85"
          x2="50.876"
          y2="141.75"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="wlonrxeqlg"
          x1="65.456"
          y1="68.233"
          x2="54.123"
          y2="87.5"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="ktik39j5mh"
          x1="41.616"
          y1="73.783"
          x2="26.294"
          y2="99.831"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="imu9s3efmi"
          x1="73.5"
          y1="48"
          x2="82"
          y2="147"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#1D77F7" />
          <Stop offset="1" stopColor="#2A7FF6" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="uulo9zs3hj"
          x1="93"
          y1="58"
          x2="113.5"
          y2="139.5"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#1D77F6" />
          <Stop offset="1" stopColor="#fff" stopOpacity=".88" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
  usageR: [
    <Svg
      width="149"
      height="148"
      viewBox="0 0 149 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#td268l6cna)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M74.5 63a3 3 0 0 0-3 3v5h-5a3 3 0 1 0 0 6h5v5a3 3 0 1 0 6 0v-5h5a3 3 0 1 0 0-6h-5v-5a3 3 0 0 0-3-3z"
          fill="#E2E8ED"
        />
        <Path
          d="M56.484 5.24a3 3 0 0 1-1.986 3.749 67.562 67.562 0 0 0-11.821 4.901 3 3 0 1 1-2.812-5.3 73.557 73.557 0 0 1 12.87-5.337 3 3 0 0 1 3.75 1.987zM31.553 17.378a3 3 0 0 1-.397 4.224 68.432 68.432 0 0 0-9.054 9.054 3 3 0 1 1-4.62-3.827 74.425 74.425 0 0 1 9.847-9.848 3 3 0 0 1 4.224.397zM13.146 38.12a3 3 0 0 1 1.244 4.057 67.562 67.562 0 0 0-4.901 11.82 3 3 0 1 1-5.736-1.762 73.557 73.557 0 0 1 5.337-12.87 3 3 0 0 1 4.056-1.245zM4.09 64.328a3 3 0 0 1 2.708 3.266 68.882 68.882 0 0 0 0 12.812 3 3 0 1 1-5.974.558 74.883 74.883 0 0 1 0-13.928 3 3 0 0 1 3.266-2.708zM5.74 92.016a3 3 0 0 1 3.749 1.986 67.543 67.543 0 0 0 4.901 11.821 3 3 0 1 1-5.3 2.812 73.54 73.54 0 0 1-5.337-12.87 3 3 0 0 1 1.987-3.75zM17.878 116.947a3 3 0 0 1 4.224.397 68.428 68.428 0 0 0 9.054 9.054 3 3 0 1 1-3.827 4.621 74.403 74.403 0 0 1-9.848-9.848 3 3 0 0 1 .397-4.224zM38.62 135.354a3 3 0 0 1 4.057-1.244 67.529 67.529 0 0 0 11.82 4.901 3 3 0 0 1-1.762 5.736 73.547 73.547 0 0 1-12.87-5.337 3 3 0 0 1-1.245-4.056zM64.828 144.41a3 3 0 0 1 3.266-2.708 68.843 68.843 0 0 0 12.812 0 3 3 0 0 1 .558 5.974 74.946 74.946 0 0 1-13.928 0 3 3 0 0 1-2.708-3.266zM110.379 135.354a3 3 0 0 1-1.244 4.056 73.53 73.53 0 0 1-12.87 5.337 3 3 0 0 1-1.763-5.736 67.51 67.51 0 0 0 11.821-4.901 2.999 2.999 0 0 1 4.056 1.244zM143.26 92.016a3 3 0 0 1 1.987 3.748 73.53 73.53 0 0 1-5.337 12.871 3 3 0 1 1-5.3-2.812 67.51 67.51 0 0 0 4.901-11.821 3 3 0 0 1 3.749-1.986zM144.91 64.328a3 3 0 0 1 3.266 2.708 74.946 74.946 0 0 1 0 13.928 3 3 0 1 1-5.974-.558 68.843 68.843 0 0 0 0-12.812 3 3 0 0 1 2.708-3.266zM135.854 38.12a3 3 0 0 1 4.056 1.245 73.547 73.547 0 0 1 5.337 12.87 3 3 0 0 1-5.736 1.763 67.529 67.529 0 0 0-4.901-11.821 3 3 0 0 1 1.244-4.056zM117.447 17.378a3 3 0 0 1 4.224-.397 74.403 74.403 0 0 1 9.848 9.848 3 3 0 1 1-4.621 3.827 68.428 68.428 0 0 0-9.054-9.054 3 3 0 0 1-.397-4.224zM92.516 5.24a3 3 0 0 1 3.748-1.987 73.54 73.54 0 0 1 12.871 5.337 3 3 0 1 1-2.812 5.3 67.543 67.543 0 0 0-11.821-4.901 3 3 0 0 1-1.986-3.75zM67.536.324a74.883 74.883 0 0 1 13.928 0 3 3 0 0 1-.558 5.974 68.882 68.882 0 0 0-12.812 0 3 3 0 1 1-.558-5.974z"
          fill="#E2E8ED"
        />
        <Path
          d="M146.5 123c0 12.703-10.297 23-23 23s-23-10.297-23-23 10.297-23 23-23 23 10.297 23 23z"
          fill="#fff"
        />
        <Circle cx="123.5" cy="123" r="20" stroke="#E2E8ED" strokeWidth="6" />
        <Path
          d="m117 123 5.5 6 7-10"
          stroke="#2A7FF6"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="td268l6cna">
          <Path fill="#fff" transform="translate(.5)" d="M0 0h148v148H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  usageU: [
    <Svg
      width="149"
      height="148"
      viewBox="0 0 149 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#mit3k1bdpa)">
        <Circle cx="74.5" cy="74" r="74" fill="url(#vj5nccevpb)" />
        <Mask
          id="9xfw3596ec"
          style="mask-type:alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="149"
          height="148">
          <Circle cx="74.5" cy="74" r="74" fill="#F7F8FA" />
        </Mask>
        <G mask="url(#9xfw3596ec)">
          <Path
            d="M3.934 59.465c-.683-3.993.919-7.646.919-12.89 0-4.83-1.415-9.94-2.763-13.566-.796-2.14-.07-4.631 1.893-5.8l16.743-9.977a4.384 4.384 0 0 1 3.277-.491c6.262 1.516 16.86 3.897 20.026 3.897 3.006 0 4.066-4.294 4.3-7.323.066-.861-.204-1.706-.686-2.423l-.559-.833c-2.345-3.492 1.136-7.95 5.093-6.52l31.38 11.331a4.353 4.353 0 0 1 2.647 5.48l-.771 2.298c-1.027 3.058-4.95 4.022-7.433 1.963-3.495-2.898-7.959-6.186-12.206-8.295-8.706-4.323-13.059 0-13.059 4.323 0 3.458-5.804 4.322-8.706 4.322-1.45 0-4.353.865-4.353 4.323 0 2.077 2.094 3.218 4.395 3.799 2.33.588 4.205 2.957 6.249 4.223.613.38 1.404.623 2.415.623 2.319 0 3.48-1.278 3.996-2.557.435-1.075-.106-2.225-.929-3.042l-2.358-2.342a2.4 2.4 0 0 1 2.446-3.982l9.904 3.278 8.074 4.01c.419.207.8.48 1.132.81l5.565 5.526c.972.965.289 2.622-1.08 2.622-.405 0-.794.16-1.08.445l-2.632 2.613a4.353 4.353 0 0 1-3.067 1.265h-5.118c-1.15 0-2.252.454-3.067 1.264l-6.16 6.117c-.815.81-1.954 1.188-3.024 1.607-1.297.508-2.602 1.66-2.602 3.98v8.645c0 1.441-.87 2.594-4.353-4.323-3.018-5.994-8.435-3.762-11.714-1.184-.904.71-1.998 1.145-3.126 1.37-3.007.596-6.925 2.777-6.925 8.46 0 5.99 4.355 3.765 7.406 1.19.863-.729 1.934-1.19 3.063-1.19h2.103c2.22 0 3.662 2.34 2.664 4.323l-.22.434c-.897 1.784.4 3.888 2.396 3.888 1.451 0 4.353.865 4.353 4.323 0 3.12 4.727 1.782 7.782.433a4.826 4.826 0 0 1 1.945-.433h19.722c.672 0 1.335.155 1.936.454l6.492 3.223a4.352 4.352 0 0 1 1.952 1.941l2.802 5.565a4.493 4.493 0 0 0 2.83 2.293c6.112 1.691 15.48 5.031 15.48 8.137 0 2.904-4.091 6.01-7.121 7.785a5.075 5.075 0 0 0-2.194 2.558c-1.732 4.553-5.027 11.271-8.096 11.271-3.178 0-9.013 7.198-12.215 11.742a4.5 4.5 0 0 1-2.26 1.694l-9.933 3.289a4.35 4.35 0 0 0-2.52 2.174l-1.642 3.261a3.066 3.066 0 0 1-5.647-2.355l3.746-11.16 1.609-6.39c.4-1.592-4.797-14.067-5.962-15.223-6.965-6.917-5.804-14.409-4.353-17.291 1.451-2.882 3.482-8.645 0-8.645-3.127 0-6.489-2.325-8.193-3.842a4.95 4.95 0 0 0-1.145-.79c-3.15-1.505-9.178-4.014-12.427-4.014-3.114 0-8.781-2.305-12.02-3.822a4.062 4.062 0 0 1-1.675-1.462c-3.036-4.64-8.07-13.109-8.07-16.33 0-3.834-4.625 3.702-5.271-.077z"
            fill="#5ED979"
          />
        </G>
        <Path
          d="M87.77 42.761a1 1 0 0 0-.424 1.743L102.14 56.88a.999.999 0 0 0 1.141.1l8.894-5.136a1 1 0 0 0-.16-1.806l-21.402-7.753a1 1 0 0 0-.559-.035l-2.284.51z"
          fill="url(#e201zoasgd)"
        />
        <Path
          d="M110.767 82.594a1 1 0 0 1-1.721-.504l-3.322-19a1 1 0 0 1 .485-1.039l8.894-5.135a1 1 0 0 1 1.484 1.042L112.6 80.369a.996.996 0 0 1-.248.502l-1.585 1.723z"
          fill="url(#q9dsf1v3ke)"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m86.434 65.198.097-.11a18.106 18.106 0 0 1 4.226-3.592l23.181-14.207a13.98 13.98 0 0 1 2.583-1.265c3.07-1.098 10.421-3.368 12.04-.564 1.619 2.805-4.022 8.037-6.508 10.145a13.935 13.935 0 0 1-2.387 1.605L95.772 70.182a18.106 18.106 0 0 1-5.223 1.864l-.257.05-1.853 6.956a.661.661 0 0 1-.16.29l-1.233 1.283c-.436.454-1.235.026-1.244-.666l-.097-6.98-2.658.513c-1.357.261-2.424-1.586-1.519-2.63l1.82-2.102-6.116-3.645c-.595-.354-.566-1.26.045-1.41l1.728-.426a.66.66 0 0 1 .33.006l7.1 1.913z"
          fill="url(#usy1dn1ryf)"
        />
        <Path
          d="M123.06 51.167c.276.478.904.65 1.277.242a3.265 3.265 0 0 0-3.113-5.391c-.539.119-.705.748-.429 1.226l1.133 1.962 1.132 1.961z"
          fill="#2A7FF6"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M70.436 79.12a1.5 1.5 0 0 1-.599 2.035c-16.49 8.996-33.872 23.824-41.17 36.296-3.689 6.303-4.492 11.442-2.25 14.959 2.28 3.58 8.201 6.301 20.128 6.434a1.5 1.5 0 1 1-.034 3c-12.05-.134-19.45-2.842-22.625-7.822-3.214-5.044-1.606-11.597 2.191-18.087 7.674-13.113 25.564-28.271 42.324-37.414a1.5 1.5 0 0 1 2.035.598z"
          fill="url(#tseeaomzdg)"
        />
      </G>
      <Defs>
        <LinearGradient
          id="vj5nccevpb"
          x1="133.459"
          y1="130.24"
          x2="185.18"
          y2="62.989"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.281" stopColor="#2B80F7" />
          <Stop offset="1" stopColor="#5E90FF" />
        </LinearGradient>
        <LinearGradient
          id="e201zoasgd"
          x1="89.237"
          y1="42.488"
          x2="107.87"
          y2="59.217"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.281" stopColor="#fff" />
          <Stop offset="1" stopColor="#E7E7E7" />
        </LinearGradient>
        <LinearGradient
          id="q9dsf1v3ke"
          x1="111.738"
          y1="81.46"
          x2="106.567"
          y2="56.959"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.281" stopColor="#fff" />
          <Stop offset="1" stopColor="#E7E7E7" />
        </LinearGradient>
        <LinearGradient
          id="usy1dn1ryf"
          x1="119.169"
          y1="47.91"
          x2="85.158"
          y2="45.356"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.281" stopColor="#fff" />
          <Stop offset="1" stopColor="#E7E7E7" />
        </LinearGradient>
        <LinearGradient
          id="tseeaomzdg"
          x1="69.119"
          y1="79.838"
          x2="45.653"
          y2="135.684"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <ClipPath id="mit3k1bdpa">
          <Path fill="#fff" transform="translate(.5)" d="M0 0h148v148H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  usageE: [
    <Svg
      width="149"
      height="148"
      viewBox="0 0 149 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#t3njfl2mva)">
        <Circle cx="74.5" cy="74" r="74" fill="#F7F8FA" />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m83.342 23.477 2.278 16.302c1.328 4.631 2.275 13.102 2.94 21.893 4.478-1.316 9.402-1.971 14.237-1.165a.5.5 0 0 1-.165.986c-4.72-.787-9.566-.128-13.995 1.2.084 1.156.164 2.316.24 3.47 4.312-.307 9.09-.115 13.92.69a.5.5 0 0 1-.165.986c-4.757-.793-9.459-.98-13.692-.677.073 1.153.14 2.3.205 3.43 4.063.76 8.148 2.173 11.706 4.576a.5.5 0 1 1-.56.829c-3.35-2.263-7.21-3.625-11.089-4.376C89.806 82.661 90 92 90 92H33s-.184-9.042.12-19.834c-3.056.806-6.037 2.034-8.696 3.83a.5.5 0 0 1-.56-.828c2.851-1.926 6.041-3.215 9.287-4.043.042-1.342.09-2.708.15-4.082-3.558-.09-7.37.155-11.219.796a.5.5 0 1 1-.164-.986 60.552 60.552 0 0 1 11.426-.81c.06-1.338.13-2.682.21-4.02-3.713-.854-7.633-1.17-11.472-.53a.5.5 0 0 1-.164-.986c3.937-.657 7.933-.344 11.698.505.431-6.784 1.127-13.31 2.24-17.937l-.923-14.545c-.17-2.68 2.998-4.216 4.997-2.423l7.48 6.71C51.595 31.605 56.379 31 61.5 31c4.113 0 7.129 0 10.076.517l6.311-9.309c1.542-2.273 5.074-1.452 5.455 1.269z"
          fill="url(#jhrglsulbb)"
        />
        <Mask
          id="eibm4daaic"
          style="mask-type:alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="149"
          height="148">
          <Path
            d="M148.5 74c0 40.869-33.131 74-74 74-40.87 0-74-33.131-74-74 0-40.87 33.13-74 74-74 40.869 0 74 33.13 74 74z"
            fill="#F7F8FA"
          />
        </Mask>
        <G mask="url(#eibm4daaic)">
          <Path
            d="M168.5 121.5c0 18.502-42.085 33.5-94 33.5s-94-14.998-94-33.5c0-18.502 42.085-33.5 94-33.5s94 14.998 94 33.5z"
            fill="#DAEEFF"
          />
        </G>
        <Path
          d="M59 53c0 4.418-2.686 8-6 8s-6-3.582-6-8 2.686-8 6-8 6 3.582 6 8z"
          fill="#fff"
        />
        <Path
          d="M69 52c0 4.418-2.686 8-6 8s-6-3.582-6-8 2.686-8 6-8 6 3.582 6 8z"
          fill="#fff"
        />
        <Path
          d="M58 54.5c0 3.038-1.79 5.5-4 5.5s-4-2.462-4-5.5 1.79-5.5 4-5.5 4 2.462 4 5.5zM68 53.5c0 3.038-1.79 5.5-4 5.5s-4-2.462-4-5.5 1.79-5.5 4-5.5 4 2.462 4 5.5z"
          fill="#2C2C2C"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M62.658 69.701a1 1 0 0 1 1.29-.579c3.129 1.192 5.552 4.093 5.552 8.684v.022c-.258 11.712-5.456 18.043-10.301 22.81-.694.682-1.368 1.322-2.013 1.935-1.634 1.551-3.085 2.928-4.21 4.384-1.517 1.964-2.316 3.928-1.985 6.411.188 1.407 1.378 2.849 3.707 4.233 2.291 1.361 5.47 2.535 9.177 3.493C71.28 123.007 80.568 124 88.5 124a1 1 0 1 1 0 2c-8.067 0-17.528-1.007-25.125-2.97-3.793-.979-7.177-2.211-9.698-3.71-2.484-1.475-4.356-3.346-4.668-5.688-.422-3.168.652-5.655 2.384-7.897 1.226-1.587 2.847-3.126 4.528-4.721a145.59 145.59 0 0 0 1.875-1.802c4.655-4.58 9.46-10.442 9.704-21.417-.004-3.756-1.915-5.91-4.264-6.803a1 1 0 0 1-.578-1.29zM57.339 70.025a1 1 0 0 1-.295 1.383c-1.973 1.278-2.702 3.836-2.074 6.35a1 1 0 0 1-1.94.485c-.775-3.1.047-6.648 2.926-8.514a1 1 0 0 1 1.383.296z"
          fill="#2A7FF6"
        />
        <Path
          d="M118.267 98.149c3.573 13.336-4.341 27.045-17.678 30.618-13.337 3.574-27.045-4.341-30.618-17.677-3.574-13.337 4.34-27.046 17.677-30.62 13.337-3.573 27.045 4.342 30.619 17.679z"
          fill="url(#y8vlk0lozd)"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M88.62 98.937a1.203 1.203 0 1 0-2.083-1.203l-2.605 4.512-4.515-2.606a1.203 1.203 0 0 0-1.203 2.083l4.515 2.607-2.607 4.515a1.203 1.203 0 0 0 2.083 1.203l2.607-4.516 4.513 2.606a1.203 1.203 0 0 0 1.203-2.083l-4.513-2.606 2.605-4.512zM106.974 94.019a1.203 1.203 0 1 0-2.084-1.203l-2.605 4.512-4.514-2.606a1.203 1.203 0 1 0-1.203 2.083l4.514 2.607-2.606 4.515a1.203 1.203 0 0 0 2.083 1.203l2.607-4.516 4.513 2.606a1.203 1.203 0 1 0 1.202-2.083l-4.513-2.606 2.606-4.512zM90.204 117.056a1 1 0 0 1 .707-1.225l11.591-3.106a1 1 0 0 1 .518 1.932l-11.591 3.106a1 1 0 0 1-1.225-.707z"
          fill="#fff"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m54.352 58.654 4.28 4.669.425 4.305v.007l.002.01c.121 1.271-.637 2.063-1.297 2.128-.662.065-1.563-.566-1.69-1.843a1 1 0 0 0-1.99.197c.2 2.02 1.79 3.842 3.877 3.636 1.022-.1 1.833-.657 2.37-1.435.679.658 1.583 1.044 2.605.943 2.086-.206 3.29-2.304 3.09-4.325a1 1 0 1 0-1.99.197c.126 1.277-.634 2.073-1.296 2.138-.661.065-1.56-.563-1.689-1.833v-.01l-.427-4.312 3.283-5.416a1 1 0 0 0-.954-1.513l-7.96.787a1 1 0 0 0-.64 1.67z"
          fill="#2C2C2C"
        />
      </G>
      <Defs>
        <LinearGradient
          id="jhrglsulbb"
          x1="38.5"
          y1="42.716"
          x2="61.034"
          y2="82.547"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#D9D9D9" />
          <Stop offset="1" stopColor="#AAA" />
        </LinearGradient>
        <LinearGradient
          id="y8vlk0lozd"
          x1="84.119"
          y1="100.119"
          x2="79.5"
          y2="124.619"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2A7FF6" />
          <Stop offset="1" stopColor="#71A9F8" />
        </LinearGradient>
        <ClipPath id="t3njfl2mva">
          <Path fill="#fff" transform="translate(.5)" d="M0 0h148v148H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  iconShare: [
    <Svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.293 6.207a1 1 0 0 1 0-1.414l4.5-4.5a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 1 1-1.414 1.414L11.5 3.414V14a1 1 0 1 1-2 0V3.414L6.707 6.207a1 1 0 0 1-1.414 0zM5.5 20a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4h1a1 1 0 1 1 0 2h-1a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-1a1 1 0 1 1 0-2h1a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4h-10z"
        fill="#fff"
      />
    </Svg>,
  ],
  iconShare2: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path d="m7 9 6-4M7 12l6 4" stroke="#2C2C2C" strokeWidth="2" />
      <Circle cx="4.5" cy="10.5" r="2.5" stroke="#2C2C2C" strokeWidth="2" />
      <Circle cx="14.5" cy="3.5" r="2.5" stroke="#2C2C2C" strokeWidth="2" />
      <Circle cx="14.5" cy="16.5" r="2.5" stroke="#2C2C2C" strokeWidth="2" />
    </Svg>,
  ],
  iconCopy: [
    <Svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 0a4 4 0 0 0-4 4h-1a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h5a4 4 0 0 0 4-4h1a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4h-5zm4 14h1a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2h2a4 4 0 0 1 4 4v6zm-11-6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V8z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  arrowLeft: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path d="m16 20-8-8 8-8" stroke="#2C2C2C" strokeLinecap="round" />
    </Svg>,
  ],
  arrowLeftWhite: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path d="m16 20-8-8 8-8" stroke="#fff" strokeLinecap="round" />
    </Svg>,
  ],
  arrowRight24: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path d="m8 20 8-8-8-8" stroke="#2C2C2C" strokeLinecap="round" />
    </Svg>,
  ],
  arrowRightWhite: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path d="m8 20 8-8-8-8" stroke="#fff" strokeLinecap="round" />
    </Svg>,
  ],
  arrowRightBlue16: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m6.4 3.2 4.525 4.526L6.4 12.25"
        stroke="#2A7FF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  imgFaq: [
    <Svg
      width="59"
      height="46"
      viewBox="0 0 59 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 44c8.837 0 16-6.044 16-13.5S26.837 17 18 17 2 23.044 2 30.5c0 3.465 1.547 6.625 4.09 9.015l-.399 4.462c-.068.764.73 1.322 1.433 1.001l4.549-2.075C13.613 43.61 15.753 44 18 44z"
        fill="url(#bb4h3ikfwa)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.5 39C21.626 39 12 30.493 12 20S21.626 1 33.5 1 55 9.507 55 20c0 4.61-1.858 8.836-4.947 12.126l.62 7.216a.989.989 0 0 1-1.408.988l-6.607-3.135A23.796 23.796 0 0 1 33.5 39z"
        fill="url(#onrbflxgxb)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31.466 15.818c.119-.547.339-.818.574-.98.265-.182.717-.338 1.46-.338.68 0 1.16.228 1.465.534.306.305.535.784.535 1.466 0 .73-.217 1.284-.55 1.675-.33.389-.863.717-1.678.842A1.5 1.5 0 0 0 32 20.5V24a1.5 1.5 0 1 0 3 0v-2.343a5.325 5.325 0 0 0 2.234-1.536c.855-1.005 1.266-2.277 1.266-3.621 0-1.391-.487-2.662-1.415-3.589-.927-.926-2.198-1.411-3.585-1.411-1.128 0-2.239.232-3.162.868-.954.657-1.548 1.636-1.804 2.814a1.5 1.5 0 1 0 2.932.636zM33.5 30a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
        fill="#fff"
      />
      <Defs>
        <LinearGradient
          id="bb4h3ikfwa"
          x1="9.816"
          y1="14.722"
          x2="-16.948"
          y2="59.591"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#0029FF" />
          <Stop offset="1" stopColor="#0029FF" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="onrbflxgxb"
          x1="38.231"
          y1="20.714"
          x2="10.938"
          y2="51.522"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#BDD9FF" />
          <Stop offset="1" stopColor="#C8DFFF" stopOpacity=".24" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
  grabber: [
    <Svg
      width="46"
      height="10"
      viewBox="0 0 46 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G filter="url(#csidtg60xa)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.451 9.924a2 2 0 0 0 1.099 0l21-6A2 2 0 0 0 43.451.078L23.001 5.92 2.55.078a2 2 0 0 0-1.099 3.846l21 6z"
          fill="#EFF1F3"
        />
      </G>
      <Defs>
        <filter
          id="csidtg60xa"
          x="0"
          y="0"
          width="46.001"
          height="11.001"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation=".5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
          <feBlend in2="shape" result="effect1_innerShadow_6420_6717" />
        </filter>
      </Defs>
    </Svg>,
  ],
  imgGuide: [
    <Svg
      width="59"
      height="46"
      viewBox="0 0 59 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M31.157 21.766c-.263-.775.487-1.513 1.275-1.254L55.5 28.074c.915.3.92 1.57.01 1.879L44.997 33.51a1 1 0 0 0-.625.615l-3.617 10.337c-.313.897-1.605.89-1.91-.009l-7.69-22.687z"
        fill="url(#4sbc9pb8ha)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.39 3.975a.913.913 0 0 0-.39.764V41a2 2 0 1 0 4 0V30.629a17.903 17.903 0 0 1 6.25-1.14c3.738 0 6.994 1.627 10.25 3.255C26.756 34.372 30.012 36 33.75 36c5.038 0 8.7-2.185 9.86-2.975a.913.913 0 0 0 .39-.764V6.327c0-.837-1.013-1.367-1.75-.972-1.76.945-4.749 2.157-8.5 2.157-3.738 0-6.994-1.628-10.25-3.256C20.244 2.628 16.988 1 13.25 1c-5.038 0-8.7 2.185-9.86 2.975z"
        fill="url(#562e3loqtb)"
      />
      <Circle cx="22.5" cy="24.5" r="1.5" fill="#fff" />
      <Rect x="21" y="10" width="3" height="12" rx="1.5" fill="#fff" />
      <Defs>
        <LinearGradient
          id="4sbc9pb8ha"
          x1="24.068"
          y1="22.95"
          x2="32.6"
          y2="68.737"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#0029FF" />
          <Stop offset="1" stopColor="#0029FF" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="562e3loqtb"
          x1="26.476"
          y1="11.58"
          x2="65.834"
          y2="58.324"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#BDD9FF" />
          <Stop offset="1" stopColor="#C8DFFF" stopOpacity=".24" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
  imgMark: [
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
      <Rect x="23" y="10" width="4" height="22" rx="2" fill="#2A7FF6" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 38a2 2 0 1 1-4.001-.001A2 2 0 0 1 27 38z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  moreIcon: [
    <Svg
      width="57"
      height="56"
      viewBox="0 0 57 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#ovggbgn6ka)">
        <Path
          d="M.5 28c0 15.464 12.536 28 28 28s28-12.536 28-28-12.536-28-28-28S.5 12.536.5 28z"
          fill="#EFF1F3"
        />
        <Path
          d="M37.5 30a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM28.5 30a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM19.5 30a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
          fill="#2C2C2C"
        />
      </G>
      <Defs>
        <ClipPath id="ovggbgn6ka">
          <Path fill="#fff" transform="translate(.5)" d="M0 0h56v56H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  smsIcon: [
    <Svg
      width="57"
      height="56"
      viewBox="0 0 57 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#g2hmijto6a)">
        <Path
          d="M.5 28c0 15.464 12.536 28 28 28s28-12.536 28-28-12.536-28-28-28S.5 12.536.5 28z"
          fill="#5B16EF"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.5 17a3 3 0 0 0-3 3v15a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V20a3 3 0 0 0-3-3h-18zm16.707 5.707a1 1 0 0 0-1.414-1.414L28.5 27.586l-6.293-6.293a1 1 0 0 0-1.414 1.414l7 7a1 1 0 0 0 1.414 0l7-7z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="g2hmijto6a">
          <Path fill="#fff" transform="translate(.5)" d="M0 0h56v56H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  kakaoIcon: [
    <Svg
      width="57"
      height="56"
      viewBox="0 0 57 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#j8jk4dmw4a)">
        <Path
          d="M.5 28c0 15.464 12.536 28 28 28s28-12.536 28-28-12.536-28-28-28S.5 12.536.5 28z"
          fill="#FAE100"
        />
        <Path
          d="M28.5 16.005c-7.734 0-14 5.005-14 11.185 0 4.02 2.656 7.546 6.643 9.518a765.695 765.695 0 0 0-1.215 4.62c-.19.771.28.758.585.552.24-.162 3.836-2.635 5.388-3.702.843.126 1.712.193 2.599.193 7.734 0 14-5.006 14-11.186S36.234 16 28.5 16"
          fill="#371C1D"
        />
        <Path
          d="M18.73 25.128h1.442s.009 4.002 0 4.934c0 .681 1.499.69 1.499.01v-4.89h1.441c.896 0 .896-1.425 0-1.425-1.011 0-4.381-.027-4.381-.027-.847 0-.843 1.398 0 1.398z"
          fill="#FAE100"
        />
        <Mask
          id="lp76oxexnb"
          style="mask-type:luminance"
          maskUnits="userSpaceOnUse"
          x="18"
          y="23"
          width="6"
          height="8">
          <Path
            d="M18.73 25.128h1.442s.009 4.002 0 4.934c0 .681 1.499.69 1.499.01v-4.89h1.441c.896 0 .896-1.425 0-1.425-1.011 0-4.381-.027-4.381-.027-.847 0-.843 1.398 0 1.398z"
            fill="#fff"
          />
        </Mask>
        <G mask="url(#lp76oxexnb)">
          <Path d="M24.008 23.735h-6.124v7.017h6.124v-7.017z" fill="#FAE100" />
        </G>
        <Path
          d="m25.627 25.388.802 2.541h-1.672l.87-2.54zm-.9-1.187c-.355.788-1.637 4.517-2.063 5.503-.306.712 1.02 1.295 1.326.582l.288-1.017h2.639s-.089.04.257.977c.284.757 1.654.233 1.37-.524-.403-1.08-1.804-4.97-2.062-5.521-.12-.256-.54-.44-.949-.44-.337 0-.67.126-.807.44z"
          fill="#FAE100"
        />
        <Mask
          id="r2c5zd0ayc"
          style="mask-type:luminance"
          maskUnits="userSpaceOnUse"
          x="22"
          y="23"
          width="7"
          height="8">
          <Path
            d="m25.627 25.388.802 2.541h-1.672l.87-2.54zm-.9-1.187c-.355.788-1.637 4.517-2.063 5.503-.306.712 1.02 1.295 1.326.582l.288-1.017h2.639s-.089.04.257.977c.284.757 1.654.233 1.37-.524-.403-1.08-1.804-4.97-2.062-5.521-.12-.256-.54-.44-.949-.44-.337 0-.67.126-.807.44z"
            fill="#fff"
          />
        </Mask>
        <G mask="url(#r2c5zd0ayc)">
          <Path d="M28.833 23.762h-6.47v7.237h6.47v-7.237z" fill="#FAE100" />
        </G>
        <Path
          d="M29.055 24.434c0 1.268.009 5.35.009 5.35s-.116.812.572.812c.687 0 2.217-.01 2.891-.01.674 0 .674-1.456 0-1.456s-1.911-.009-1.911-.009.004-3.777 0-4.692c0-.443-.39-.663-.78-.663-.391 0-.781.224-.781.668z"
          fill="#FAE100"
        />
        <Mask
          id="2texwhft7d"
          style="mask-type:luminance"
          maskUnits="userSpaceOnUse"
          x="29"
          y="23"
          width="5"
          height="8">
          <Path
            d="M29.055 24.434c0 1.268.009 5.35.009 5.35s-.116.812.572.812c.687 0 2.217-.01 2.891-.01.674 0 .674-1.456 0-1.456s-1.911-.009-1.911-.009.004-3.777 0-4.692c0-.443-.39-.663-.78-.663-.391 0-.781.224-.781.668z"
            fill="#fff"
          />
        </Mask>
        <G mask="url(#2texwhft7d)">
          <Path d="M33.201 23.762h-4.257v6.83H33.2v-6.83z" fill="#FAE100" />
        </G>
        <Path
          d="M33.383 24.232c.013.556-.018 5.58-.018 5.951 0 .587 1.48.587 1.48 0v-1.976l.436-.354 1.898 2.622c.385.51 1.591-.413 1.21-.924l-2.018-2.684s1.37-1.497 1.907-2.039c.315-.318-.66-1.308-.975-.99-.306.304-2.453 2.473-2.453 2.473s.018-1.362 0-2.115c-.008-.287-.354-.426-.71-.426-.38 0-.766.157-.762.467"
          fill="#FAE100"
        />
        <Mask
          id="s9iocwh5he"
          style="mask-type:luminance"
          maskUnits="userSpaceOnUse"
          x="33"
          y="23"
          width="6"
          height="8">
          <Path
            d="M33.383 24.232c.013.556-.018 5.58-.018 5.951 0 .587 1.48.587 1.48 0v-1.976l.436-.354 1.898 2.622c.385.51 1.591-.413 1.21-.924l-2.018-2.684s1.37-1.497 1.907-2.039c.315-.318-.66-1.308-.975-.99-.306.304-2.453 2.473-2.453 2.473s.018-1.362 0-2.115c-.008-.287-.354-.426-.71-.426-.38 0-.766.157-.762.467"
            fill="#fff"
          />
        </Mask>
        <G mask="url(#s9iocwh5he)">
          <Path d="M38.77 23.515h-5.405v7.47h5.405v-7.47z" fill="#FAE100" />
        </G>
      </G>
      <Defs>
        <ClipPath id="j8jk4dmw4a">
          <Path fill="#fff" transform="translate(.5)" d="M0 0h56v56H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  kakaoLogin: [
    <Svg
      width="24"
      height="44"
      viewBox="0 0 24 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#1dajot839a)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 27c4.418 0 8-2.91 8-6.5S16.418 14 12 14s-8 2.91-8 6.5c0 2.178 1.319 4.106 3.343 5.286l-.735 3.676a.2.2 0 0 0 .32.195l3.482-2.785A9.84 9.84 0 0 0 12 27z"
          fill="#171717"
        />
      </G>
      <Defs>
        <ClipPath id="1dajot839a">
          <Path fill="#fff" d="M0 0h24v44H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  leftCalendarIcon: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m12 16-5.657-5.657L12 4.686"
        stroke="#2C2C2C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],

  leftCalendarDisabledIcon: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m12 16-5.657-5.657L12 4.686"
        stroke="#AAA"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  rightCalendarIcon: [
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

  rightCalendarDisabledIcon: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m8 4 5.657 5.657L8 15.314"
        stroke="#AAA"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  emojiCheck: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#qw3fyn9bxa)">
        <Rect
          x=".5"
          y=".5"
          width="19"
          height="19"
          rx="2.5"
          fill="url(#cyjnezbiab)"
          stroke="#00CE2D"
        />
        <Path
          d="m14 6-4.444 8L6 10"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <LinearGradient
          id="cyjnezbiab"
          x1="10"
          y1="0"
          x2="10"
          y2="17.917"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#69FFAE" />
          <Stop offset="1" stopColor="#00CE2D" />
        </LinearGradient>
        <ClipPath id="qw3fyn9bxa">
          <Path fill="#fff" d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  check20: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.536 12.9 5.707 10.07a1 1 0 0 1 1.415-1.414l2.12 2.121 4.244-4.242A1 1 0 1 1 14.9 7.95L9.95 12.9a1 1 0 0 1-1.414 0z"
        fill="#2c2c2c"
      />
    </Svg>,
  ],
  dropDownOpen: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10.564 7.24a.784.784 0 0 0-1.128 0L5.16 11.963C4.78 12.38 5.118 13 5.724 13h8.552c.606 0 .943-.62.564-1.037L10.564 7.24z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  dropDown: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10.564 12.76a.784.784 0 0 1-1.128 0L5.16 8.037C4.78 7.62 5.118 7 5.724 7h8.552c.606 0 .943.62.564 1.037l-4.276 4.723z"
        fill="#979797"
      />
    </Svg>,
  ],
  xWhite26: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect
        x="2"
        y="3.571"
        width="2"
        height="29"
        rx="1"
        transform="rotate(-45 2 3.571)"
        fill="#fff"
      />
      <Rect
        x="22.429"
        y="2"
        width="2"
        height="29"
        rx="1"
        transform="rotate(45 22.429 2)"
        fill="#fff"
      />
    </Svg>,
  ],
  x: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m6 6 8 8M14 6l-8 8"
        stroke="#2C2C2C"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>,
  ],
  x26: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect
        x="2"
        y="3.571"
        width="2"
        height="29"
        rx="1"
        transform="rotate(-45 2 3.571)"
        fill="#2C2C2C"
      />
      <Rect
        x="22.429"
        y="2"
        width="2"
        height="29"
        rx="1"
        transform="rotate(45 22.429 2)"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  circleX: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#hz0pplis7a)">
        <Circle cx="10" cy="10" r="8" fill="#D8D8D8" />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 6.727 6.727 6 14 13.273l-.727.727L6 6.727z"
          fill="#fff"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m13.273 6 .727.727L6.727 14 6 13.273 13.273 6z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="hz0pplis7a">
          <Path fill="#fff" transform="translate(2 2)" d="M0 0h16v16H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  bluePin: [
    <Svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.02 17.322c2.157-1.505 6.98-5.278 6.98-8.91C17 3.734 13.418 1 9 1S1 3.734 1 8.412c0 3.632 4.824 7.405 6.98 8.91a1.772 1.772 0 0 0 2.04 0zM9 9.25a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  blueNotice: [
    <Svg
      width="63"
      height="63"
      viewBox="0 0 63 63"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M30.626 4.073a1 1 0 0 1 1.748 0l28.3 50.941a1 1 0 0 1-.873 1.486H3.2a1 1 0 0 1-.875-1.486l28.3-50.94z"
        fill="url(#yr2y7wdt3a)"
      />
      <Circle cx="31.5" cy="43.5" r="2" fill="#fff" />
      <Rect x="29.5" y="24.5" width="4" height="15" rx="2" fill="#fff" />
      <Defs>
        <LinearGradient
          id="yr2y7wdt3a"
          x1="77"
          y1="69"
          x2="18.5"
          y2="22"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#CADCF5" />
          <Stop offset="1" stopColor="#2A7FF6" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
  blueClock: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm.75-9a.75.75 0 0 0-1.5 0v3c0 .414.336.75.75.75h2a.75.75 0 0 0 0-1.5H8.75V5zM4.53.47a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 0 1-1.06-1.06l2-2a.75.75 0 0 1 1.06 0zM11.47.47a.75.75 0 0 0 0 1.06l2 2a.75.75 0 1 0 1.06-1.06l-2-2a.75.75 0 0 0-1.06 0z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  addOnType: [
    <Svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#clip0_5564_56664)">
        <Path
          d="M3 2C3 0.895431 3.89543 0 5 0H28C29.1046 0 30 0.895431 30 2V25C30 26.1046 29.1046 27 28 27H5C3.89543 27 3 26.1046 3 25V2Z"
          fill="url(#paint0_linear_5564_56664)"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19 4C18.4477 4 18 4.44772 18 5C18 5.55228 18.4477 6 19 6H22.5858L16.2929 12.2929C15.9024 12.6834 15.9024 13.3166 16.2929 13.7071C16.6834 14.0976 17.3166 14.0976 17.7071 13.7071L24 7.41421V11C24 11.5523 24.4477 12 25 12C25.5523 12 26 11.5523 26 11V5C26 4.44772 25.5523 4 25 4H19Z"
          fill="white"
        />
        <Path
          d="M0 18C0 16.8954 0.895431 16 2 16H12C13.1046 16 14 16.8954 14 18V28C14 29.1046 13.1046 30 12 30H2C0.89543 30 0 29.1046 0 28V18Z"
          fill="url(#paint1_linear_5564_56664)"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_5564_56664"
          x1="30.0001"
          y1="-3.57"
          x2="-3.08834"
          y2="8.47299"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.28125" stopColor="#2B80F7" />
          <Stop offset="1" stopColor="#7DA6FF" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_5564_56664"
          x1="1.23529"
          y1="27.9412"
          x2="15.4369"
          y2="15.1212"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFC700" />
          <Stop offset="0.801663" stopColor="#FFDF43" />
        </LinearGradient>
        <ClipPath id="clip0_5564_56664">
          <Rect width="30" height="30" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  extensionType: [
    <Svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M11 2H28C29.1046 2 30 2.89543 30 4V26C30 27.1046 29.1046 28 28 28H11V2Z"
        fill="url(#paint0_linear_5564_56652)"
      />
      <Path
        d="M0 3.96444C0 2.87951 0.930253 2 2.07778 2H11V28H2.07778C0.930254 28 0 27.1205 0 26.0356V3.96444Z"
        fill="url(#paint1_linear_5564_56652)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.8392 9.88127C21.4487 9.49075 20.8155 9.49075 20.425 9.88127C20.0344 10.2718 20.0344 10.905 20.425 11.2955L23.1296 14.0001L15 14.0001C14.4477 14.0001 14 14.4478 14 15.0001C14 15.5524 14.4477 16.0001 15 16.0001L23.041 16.0001L20.425 18.6161C20.0344 19.0066 20.0344 19.6398 20.425 20.0303C20.8155 20.4209 21.4487 20.4209 21.8392 20.0303L26.2066 15.6629C26.5971 15.2724 26.5971 14.6392 26.2066 14.2487L21.8392 9.88127Z"
        fill="white"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_5564_56652"
          x1="30"
          y1="15.0001"
          x2="18.1287"
          y2="11.5863"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2B80F7" />
          <Stop offset="1" stopColor="#7DA6FF" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_5564_56652"
          x1="0.970588"
          y1="24.1765"
          x2="18.6441"
          y2="17.4267"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFC700" />
          <Stop offset="0.801663" stopColor="#FFDF43" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
  info: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="10" cy="10" r="9" fill="#979797" />
      <Rect
        x="11"
        y="15"
        width="2"
        height="7"
        rx="1"
        transform="rotate(-180 11 15)"
        fill="#fff"
      />
      <Circle cx="10" cy="6" r="1" transform="rotate(-180 10 6)" fill="#fff" />
    </Svg>,
  ],
  blueBulletPoint: [
    <Svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="4" cy="4" r="4" fill="#2A7FF6" />
    </Svg>,
  ],
  fire: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 6c-1.5-2.5-4-5-4-5S3 6.5 3 11.5 7 19 10.02 19c3.019 0 6.98-2.5 6.98-7.5S13.5 4 13.5 4s-1 1-1.5 2z"
        fill="#F1694F"
      />
      <Path
        d="M13 15.143C13 17.273 11.657 19 10 19s-3-1.727-3-3.857S10 10 10 10s3 3.013 3 5.143z"
        fill="#FFC82D"
      />
    </Svg>,
  ],
  beforeCheck: [
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="22" height="22" rx="3" fill="#D8D8D8" />
      <Path
        d="M5 10.5 9.696 15 17 8"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  afterCheck: [
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="22" height="22" rx="3" fill="#2A7FF6" />
      <Path
        d="M5 10.5 9.696 15 17 8"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  speechBubble: [
    <Svg
      width="54"
      height="24"
      viewBox="0 0 54 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 0a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h20l4 4 4-4h20a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z"
        fill="#5B16EF"
      />
    </Svg>,
  ],
  speechBubble2: [
    <Svg
      width="134"
      height="24"
      viewBox="0 0 134 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 0a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h60l4 4 4-4h60a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z"
        fill="#5B16EF"
      />
    </Svg>,
  ],
  lightning: [
    <Svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m8.167 5.833.412-4.123c.05-.498-.581-.752-.89-.359l-4.72 6.007a.5.5 0 0 0 .393.809h2.471l-.412 4.123c-.05.498.582.752.89.359l4.72-6.007a.5.5 0 0 0-.393-.809H8.167z"
        fill="#FFC82D"
      />
    </Svg>,
  ],
  notShowEsimUsage: [
    <Svg
      width="149"
      height="148"
      viewBox="0 0 149 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#viijc6w79a)">
        <Circle cx="74.5" cy="74" r="74" fill="#F7F8FA" />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M132.519 119.938C118.964 137.034 98.013 148 74.5 148c-23.055 0-43.647-10.543-57.218-27.07a524.908 524.908 0 0 1 115.237-.992z"
          fill="#DAEEFF"
        />
        <Path
          d="M105.629 100.349a2.001 2.001 0 0 1 1.881-1.32h3.748a2 2 0 0 1 1.994 1.842l2.539 31.912a2.001 2.001 0 0 1-1.994 2.159H95.96a2 2 0 0 1-1.88-2.681l11.549-31.912z"
          fill="url(#pk5zjwvbtb)"
        />
        <Path
          d="m78.637 109.941 27.527-47.677 2.167 1.252c13.165 7.6 17.676 24.436 10.075 37.601-7.601 13.166-24.436 17.677-37.602 10.076l-2.167-1.252z"
          fill="url(#iuvdhom36c)"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M109.353 139.295h-6.767a2.177 2.177 0 0 1-2.08-2.817l11.392-37a2.177 2.177 0 0 1 2.08-1.536h3.073c1.202 0 2.176.974 2.176 2.176v32.84a74.017 74.017 0 0 1-9.874 6.337z"
          fill="url(#nt3zzfs6ud)"
        />
        <Ellipse
          cx="92.762"
          cy="86.311"
          rx="27.526"
          ry="9.593"
          transform="rotate(-60 92.762 86.311)"
          fill="#fff"
        />
        <Ellipse
          cx="92.4"
          cy="86.103"
          rx="25.858"
          ry="8.341"
          transform="rotate(-60 92.4 86.103)"
          fill="url(#st4hz0qu1e)"
        />
        <Ellipse
          cx="92.4"
          cy="86.103"
          rx="25.858"
          ry="8.341"
          transform="rotate(-60 92.4 86.103)"
          fill="#84AAFF"
        />
        <Path
          d="m78.008 79.335.918-1.59 22.784 8.917-4.588 7.946-19.114-15.273z"
          fill="url(#ky8do6zlzf)"
        />
        <Circle
          cx="77.382"
          cy="77.915"
          r="3.754"
          transform="rotate(-60 77.382 77.915)"
          fill="#EE4423"
        />
        <Circle
          cx="77.382"
          cy="77.915"
          r="3.754"
          transform="rotate(-60 77.382 77.915)"
          fill="#FFD717"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m54.886 116.369.78-6.358c.056-.463.68-.549.846-.117l3.916 10.212c.131.342-.177.695-.526.601l-3.011-.807-.78 6.358c-.056.463-.68.549-.845.117l-3.917-10.212c-.131-.342.177-.695.526-.601l3.011.807z"
          fill="#5ED979"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m25.571 67.195.646-5.27c.047-.383.564-.455.701-.097l3.246 8.464c.109.283-.147.576-.436.498l-2.495-.669-.646 5.27c-.047.383-.564.455-.701.097l-3.246-8.464c-.109-.283.147-.576.436-.498l2.495.669z"
          fill="#2A7FF6"
        />
        <Path
          d="M53.103 29.382h34.088a2 2 0 0 1 2 2V57.629c0 .862-1.019 1.32-1.663.748l-4.089-3.63a1 1 0 0 0-.658-.253l-29.69-.18a2 2 0 0 1-1.988-2v-20.93a2 2 0 0 1 2-2z"
          fill="url(#r8ptv1y0fg)"
        />
        <Path
          d="M53.103 29.382h34.088a2 2 0 0 1 2 2V57.629c0 .862-1.019 1.32-1.663.748l-4.089-3.63a1 1 0 0 0-.658-.253l-29.69-.18a2 2 0 0 1-1.988-2v-20.93a2 2 0 0 1 2-2z"
          fill="#EE4423"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M74.99 37.994a1.203 1.203 0 0 0-1.7-1.701l-3.685 3.684-3.686-3.686a1.203 1.203 0 0 0-1.701 1.701l3.686 3.686-3.687 3.687a1.203 1.203 0 0 0 1.701 1.7l3.687-3.686 3.685 3.685a1.203 1.203 0 0 0 1.7-1.7l-3.684-3.686 3.684-3.684z"
          fill="#fff"
        />
      </G>
      <Defs>
        <LinearGradient
          id="pk5zjwvbtb"
          x1="101.679"
          y1="107.381"
          x2="110.506"
          y2="140.233"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#95BFFF" />
          <Stop offset="1" stopColor="#5E90FF" />
        </LinearGradient>
        <LinearGradient
          id="iuvdhom36c"
          x1="115.317"
          y1="107.307"
          x2="104.259"
          y2="87.668"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.281" stopColor="#2B80F7" />
          <Stop offset="1" stopColor="#6A99FF" />
        </LinearGradient>
        <LinearGradient
          id="nt3zzfs6ud"
          x1="110.832"
          y1="96.182"
          x2="111.662"
          y2="128.299"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#3885F9" />
          <Stop offset="1" stopColor="#5E90FF" />
        </LinearGradient>
        <LinearGradient
          id="st4hz0qu1e"
          x1="110.205"
          y1="89.283"
          x2="69.292"
          y2="93.274"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.281" stopColor="#4190FF" />
          <Stop offset="1" stopColor="#76A1FF" />
        </LinearGradient>
        <LinearGradient
          id="ky8do6zlzf"
          x1="86.957"
          y1="83.118"
          x2="99.416"
          y2="90.635"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFDF41" />
          <Stop offset="1" stopColor="#4187FB" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="r8ptv1y0fg"
          x1="62.712"
          y1="38.655"
          x2="75.767"
          y2="59.562"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#ED4847" />
          <Stop offset="0.674" stopColor="#FF7574" />
          <Stop offset="1" stopColor="#FFE35A" />
        </LinearGradient>
        <ClipPath id="viijc6w79a">
          <Path fill="#fff" transform="translate(.5)" d="M0 0h148v148H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  applepay: [
    <Svg
      width="99"
      height="24"
      viewBox="0 0 99 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M37.516 6.063c.447-.555.75-1.3.67-2.063-.654.032-1.453.429-1.916.985-.415.476-.783 1.253-.687 1.983.735.063 1.47-.365 1.933-.905zM38.178 7.11c-1.067-.062-1.975.602-2.485.602-.51 0-1.29-.57-2.135-.554-1.1.016-2.12.633-2.677 1.614-1.147 1.962-.303 4.874.813 6.472.542.79 1.195 1.662 2.055 1.63.813-.031 1.131-.522 2.12-.522.987 0 1.274.522 2.134.506.892-.015 1.45-.79 1.992-1.582.622-.902.876-1.772.892-1.82-.016-.016-1.72-.665-1.736-2.611-.017-1.63 1.338-2.405 1.402-2.453-.765-1.123-1.96-1.25-2.375-1.281zM47.475 4.905c2.32 0 3.936 1.588 3.936 3.9 0 2.32-1.649 3.915-3.994 3.915h-2.57v4.056h-1.856V4.905h4.484zm-2.628 6.269h2.13c1.617 0 2.537-.864 2.537-2.361 0-1.498-.92-2.353-2.528-2.353h-2.139v4.714zM51.897 14.316c0-1.514 1.168-2.444 3.24-2.559l2.387-.14v-.666c0-.962-.655-1.538-1.749-1.538-1.036 0-1.682.493-1.84 1.267h-1.69c.1-1.563 1.442-2.715 3.597-2.715 2.113 0 3.464 1.11 3.464 2.846v5.964H57.59v-1.423h-.041c-.506.963-1.608 1.571-2.752 1.571-1.707 0-2.9-1.053-2.9-2.607zm5.627-.782v-.683l-2.147.132c-1.069.074-1.674.543-1.674 1.283 0 .757.63 1.25 1.591 1.25 1.252 0 2.23-.855 2.23-1.982zM60.925 19.959v-1.44c.133.033.431.033.58.033.83 0 1.277-.345 1.55-1.234 0-.016.158-.526.158-.535l-3.15-8.662h1.94l2.204 7.042h.033l2.205-7.042h1.89l-3.266 9.107C64.323 19.325 63.461 20 61.655 20c-.15 0-.597-.017-.73-.041z"
        fill="#000"
      />
    </Svg>,
  ],

  bell: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="8" cy="13.334" r="2" fill="#EE4423" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 .667a6 6 0 0 0-6 6v4.666l-.297.445a1 1 0 0 0 .832 1.555h10.93a1 1 0 0 0 .832-1.555L14 11.333V6.666a6 6 0 0 0-6-6z"
        fill="#FFC82D"
      />
    </Svg>,
  ],

  imgIcon: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm6.4 1.602a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-4.8 9v1.297a.5.5 0 0 0 .5.5h11.8a.5.5 0 0 0 .5-.5v-2.897a.5.5 0 0 0-.141-.348l-3.01-3.104a.5.5 0 0 0-.699-.018l-3.226 2.995a.5.5 0 0 1-.624.045L5.051 9.44a.5.5 0 0 0-.642.063L1.74 12.255a.5.5 0 0 0-.141.348z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],

  bannerMark2: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="10" cy="10" r="9.167" fill="#979797" />
      <Path
        d="M10.834 13.333a.833.833 0 1 1-1.667 0 .833.833 0 0 1 1.667 0zM9.167 6.667a.833.833 0 1 1 1.667 0v4.166a.833.833 0 0 1-1.667 0V6.667z"
        fill="#fff"
      />
    </Svg>,
  ],
  bannerCheckBlue2: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#DAEEFF" />
      <Path
        d="M13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 8a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  bannerWarning20: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9.134 3.162a1 1 0 0 1 1.731 0l7.432 12.837a1 1 0 0 1-.865 1.501H2.567A1 1 0 0 1 1.702 16L9.134 3.162z"
        fill="#ED4847"
      />
      <Path
        d="M10.834 15a.833.833 0 1 1-1.667 0 .833.833 0 0 1 1.667 0zM9.167 8.214c0-.394.373-.714.833-.714.46 0 .834.32.834.714v3.572c0 .394-.373.714-.834.714-.46 0-.833-.32-.833-.714V8.214z"
        fill="#fff"
      />
    </Svg>,
  ],
  bannerWarning: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M12.135 3.662a1 1 0 0 1 1.73 0l10.183 17.587a1 1 0 0 1-.866 1.501H2.818a1 1 0 0 1-.866-1.5L12.135 3.661z"
        fill="#EE4423"
      />
      <Path
        d="M14.083 19.5a1.083 1.083 0 1 1-2.166 0 1.083 1.083 0 0 1 2.166 0zM11.917 10.679c0-.513.485-.929 1.083-.929s1.083.416 1.083.929v4.642c0 .513-.485.929-1.083.929s-1.083-.416-1.083-.929V10.68z"
        fill="#fff"
      />
    </Svg>,
  ],

  bannerCheck: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#5B16EF" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.909 9.247a1 1 0 0 1 .095 1.41l-3.82 4.377a1 1 0 0 1-1.467.043l-2.43-2.47a1 1 0 1 1 1.426-1.402l1.673 1.7 3.112-3.563a1 1 0 0 1 1.41-.095z"
        fill="#fff"
      />
    </Svg>,
  ],
  bannerCheckBlue: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#2A7FF6" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.909 9.247a1 1 0 0 1 .095 1.41l-3.82 4.377a1 1 0 0 1-1.467.043l-2.43-2.47a1 1 0 1 1 1.426-1.402l1.673 1.7 3.112-3.563a1 1 0 0 1 1.41-.095z"
        fill="#fff"
      />
    </Svg>,
  ],
  bluePlus: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 4a1 1 0 0 0-2 0v3H4a1 1 0 1 0 0 2h3v3a1 1 0 1 0 2 0V9h3a1 1 0 1 0 0-2H9V4z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  redirectFlag: [
    <Svg
      width="44"
      height="26"
      viewBox="0 0 44 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#7muozqmana)">
        <G clipPath="url(#8zm4mv4qxb)">
          <Circle cx="13" cy="13" r="11.5" fill="#E52620" stroke="#EEE" />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.094 5.305c-.688.37-.97 1.18-.5 1.88.2.3.306.695.287 1.11-.025.42-.144.822-.475 1.198-.5.695-1.431.733-1.606 1.772-.044.479.031.95.362 1.377-.518-.51-.856-1.07-.968-1.689-.12-.644.006-1.358.425-2.155l-.082-.044c-.425.816-.556 1.549-.43 2.218.118.65.474 1.237 1.024 1.766-.944-.567-1.556-1.243-1.969-2.327-.53-1.963.35-4.048 2.194-4.851a3.502 3.502 0 0 1 1.738-.255zM6.98 8.88A3.86 3.86 0 0 0 6.7 10.68a3.96 3.96 0 0 0 3.825 3.615c1.125-.083 1.931-.485 2.737-1.244-.656.383-1.3.561-1.937.479-.65-.083-1.294-.428-1.919-1.09l.069-.07c.612.643 1.231.981 1.862 1.058.607.076 1.225-.09 1.85-.453-.493.198-.95.127-1.38-.057-.913-.485-.67-1.416-1.163-2.11a1.825 1.825 0 0 0-.97-.823c-.374-.14-.774-.16-1.112-.05-.78.254-1.45-.262-1.58-1.053zm1.663 2.308.33.287.363-.236-.162.414.331.28-.431-.031-.156.414-.107-.433-.43-.026.362-.236-.1-.433zm7.65 8.791A3.7 3.7 0 0 0 17.55 18.7c1.019-1.773.531-3.997-1.025-5.247-.956-.618-1.831-.79-2.919-.663.75.09 1.369.344 1.844.797.481.465.8 1.135.925 2.053l-.094.012c-.125-.892-.431-1.542-.9-1.995-.444-.427-1.037-.676-1.75-.765.513.14.838.478 1.081.886.457.944-.268 1.55-.268 2.41-.044.504.093.905.312 1.256.225.344.538.6.869.72.769.274 1.012 1.103.669 1.817zm-.025-2.875-.107-.434-.43-.031.362-.236-.107-.434.332.287.362-.236-.162.408.33.287-.43-.032-.15.42zm4.562-4.839a3.726 3.726 0 0 0-.737-1.65c-1.27-1.595-3.457-1.881-5.125-.791-.888.714-1.344 1.51-1.6 2.613.337-.694.78-1.217 1.35-1.517.587-.312 1.306-.389 2.18-.204l-.018.096c-.856-.185-1.556-.102-2.119.191-.543.287-.968.778-1.293 1.44.3-.452.718-.656 1.175-.751 1.018-.122 1.318.79 2.106 1.083.444.217.856.217 1.25.128.387-.096.731-.319.95-.6.512-.662 1.344-.618 1.881-.038zm-2.625-.956-.425-.045-.175.408-.087-.433-.425-.045.375-.223-.094-.433.319.3.368-.224-.175.408.32.287zM7.581 17.838c.763.14 1.469-.325 1.506-1.18.02-.356.17-.745.425-1.058.27-.318.6-.56 1.082-.656.806-.242 1.568.319 2.318-.402.313-.35.538-.771.525-1.32.113.734.05 1.39-.225 1.951-.287.587-.806 1.078-1.606 1.447l.038.09c.818-.383 1.35-.886 1.65-1.492.287-.593.35-1.281.225-2.046.418 1.045.506 1.963.193 3.085-.73 1.893-2.662 2.996-4.6 2.474a3.72 3.72 0 0 1-1.53-.893zm2.675-.822.425.044.088.434.175-.408.425.044-.32-.293.176-.408-.369.223-.319-.3.094.434-.375.23zm3.2-9.378-.362.236-.325-.287.1.434-.37.23.432.03.1.434.163-.408.43.039-.324-.287.156-.42z"
            fill="#fff"
          />
        </G>
        <G clipPath="url(#3qoyp7j92c)">
          <Mask
            id="38lu3468fd"
            style="mask-type:alpha"
            maskUnits="userSpaceOnUse"
            x="19"
            y="1"
            width="24"
            height="24">
            <Circle cx="31" cy="13" r="12" fill="#fff" />
          </Mask>
          <G mask="url(#38lu3468fd)">
            <Circle cx="31" cy="13" r="12" fill="#E52620" />
            <Path d="M34.077.692H15.615V13h18.462V.692z" fill="#000095" />
            <Path
              d="m28.128 6.846-1.23 4.616-1.231-4.616 1.23-4.615m0 5.846 4.616-1.23-4.616-1.231-4.615 1.23"
              fill="#fff"
            />
            <Path
              d="m27.963 7.462-3.374 3.381 1.242-4.612 3.374-3.381m-2.923 5.062 4.612 1.242-3.381-3.374L22.9 4.538"
              fill="#fff"
            />
            <Path
              d="M27.513 7.912 22.9 9.153l3.381-3.373 4.612-1.242m-5.062 2.923 3.374 3.381-1.242-4.612-3.374-3.381"
              fill="#fff"
            />
            <Path
              d="M26.897 9.461a2.615 2.615 0 1 0 0-5.23 2.615 2.615 0 0 0 0 5.23z"
              fill="#000095"
            />
            <Path
              d="M26.898 9.154a2.307 2.307 0 1 0 0-4.615 2.307 2.307 0 0 0 0 4.615z"
              fill="#fff"
            />
            <Circle cx="31" cy="13" r="11.5" stroke="#EEE" />
          </G>
        </G>
      </G>
      <Defs>
        <ClipPath id="7muozqmana">
          <Path fill="#fff" d="M0 0h44v26H0z" />
        </ClipPath>
        <ClipPath id="8zm4mv4qxb">
          <Path fill="#fff" transform="translate(1 1)" d="M0 0h24v24H0z" />
        </ClipPath>
        <ClipPath id="3qoyp7j92c">
          <Path fill="#fff" transform="translate(19 1)" d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  bannerMark: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#ED4847" />
      <Path
        d="M13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 8a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8z"
        fill="#fff"
      />
    </Svg>,
  ],
  goods: [
    <Svg
      width="252"
      height="133"
      viewBox="0 0 252 133"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#clip0_6088_52333)">
        <Path
          d="M123.171 41.5234L167.233 45.2022L159.217 119.338C159.072 120.681 158.047 121.761 156.714 121.977L113.991 128.895L123.171 41.5234Z"
          fill="url(#paint0_linear_6088_52333)"
        />
        <Path
          d="M126.842 18.5312L171.363 27.7521L169.068 46.1461L124.088 41.9836L126.842 18.5312Z"
          fill="url(#paint1_linear_6088_52333)"
        />
        <Mask
          id="mask0_6088_52333"
          style="mask-type:alpha"
          maskUnits="userSpaceOnUse"
          x="124"
          y="18"
          width="48"
          height="29">
          <Path
            d="M126.842 18.5312L171.363 27.7521L169.068 46.1461L124.088 41.9836L126.842 18.5312Z"
            fill="url(#paint2_linear_6088_52333)"
          />
        </Mask>
        <G mask="url(#mask0_6088_52333)">
          <Rect
            width="11.8889"
            height="43.225"
            transform="matrix(0.99419 0.107635 -0.107233 0.994234 147.108 10.877)"
            fill="url(#paint3_linear_6088_52333)"
          />
        </G>
        <Path
          d="M169.527 70.8102C164.019 67.8671 164.478 55.4818 165.396 49.657L177.789 32.6426L176.871 57.0146C176.718 62.8394 175.035 73.7532 169.527 70.8102Z"
          fill="url(#paint4_linear_6088_52333)"
        />
        <Path
          d="M185.133 71.2684C173.75 69.7968 173.352 47.6627 174.576 36.7796C176.779 33.8365 184.062 35.2467 187.428 36.3197V47.816C187.428 51.9546 188.346 60.6918 188.805 65.7502C189.172 69.7968 186.51 71.1151 185.133 71.2684Z"
          fill="url(#paint5_linear_6088_52333)"
        />
        <Path
          d="M224.146 66.6702C201.748 69.2454 196.76 49.6558 197.066 39.5391L215.425 47.3565C216.802 55.174 218.179 51.955 224.146 58.3929C228.919 63.5433 226.135 66.0571 224.146 66.6702Z"
          fill="url(#paint6_linear_6088_52333)"
        />
        <Path
          d="M186.969 56.5542C184.031 50.3002 183.603 38.9266 183.756 34.0215C188.652 34.0215 198.351 34.9412 197.984 38.62C197.617 42.2988 200.585 53.0286 202.115 57.9337C203.186 61.7658 204.318 69.5219 200.279 69.8898C195.23 70.3497 190.641 64.3716 186.969 56.5542Z"
          fill="url(#paint7_linear_6088_52333)"
        />
        <Path
          d="M157.594 36.7806C154.289 46.3455 150.403 50.5761 148.873 51.4958C145.936 59.2212 146.731 63.9118 147.496 65.2915C164.479 63.9119 167.232 54.2551 172.74 43.2187C177.146 34.3895 187.122 37.0873 191.558 39.5399C195.718 41.8391 200.738 46.7135 217.261 51.4958C233.785 56.2782 240.975 52.1091 245.259 48.7369C249.543 45.3646 254.806 38.8041 241.587 39.5399C225.064 40.4596 213.589 27.5836 191.558 20.6859C169.527 13.7881 161.725 24.8245 157.594 36.7806Z"
          fill="url(#paint8_linear_6088_52333)"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M168.136 22.0822C163.058 25.3808 160.121 30.9966 158.066 36.9438C156.402 41.7613 154.586 45.2492 152.984 47.657C151.482 49.9147 150.148 51.2513 149.282 51.8283C147.875 55.5737 147.366 58.5709 147.296 60.7889C147.235 62.7441 147.515 64.066 147.799 64.7638C155.971 64.0372 160.692 61.3467 164.046 57.5454C166.774 54.4544 168.61 50.627 170.638 46.3984C171.17 45.2896 171.715 44.1532 172.293 42.9953C174.592 38.3888 178.372 36.7765 182.121 36.6488C185.836 36.5222 189.529 37.8464 191.8 39.1021C192.689 39.5932 193.608 40.1943 194.66 40.8819C198.606 43.461 204.411 47.256 217.4 51.0154C225.607 53.3907 231.452 53.5304 235.753 52.6836C240.047 51.8383 242.844 50.0019 244.95 48.3439C246.001 47.5162 247.105 46.4983 247.966 45.4554C248.84 44.3959 249.405 43.3791 249.489 42.5475C249.529 42.1484 249.458 41.8051 249.267 41.5073C249.072 41.2046 248.726 40.9051 248.141 40.6507C246.953 40.1345 244.9 39.8561 241.615 40.0389C233.21 40.5068 226.107 37.4599 218.409 33.4886C217.058 32.7918 215.689 32.0664 214.29 31.3253C207.699 27.8335 200.452 23.9942 191.409 21.1629C180.481 17.7415 173.191 18.7986 168.136 22.0822ZM167.591 21.2436C172.978 17.7444 180.604 16.7322 191.708 20.2086C200.847 23.0699 208.186 26.959 214.78 30.4529C216.173 31.1906 217.532 31.9108 218.867 32.5999C226.546 36.5611 233.441 39.4923 241.559 39.0405C244.884 38.8555 247.13 39.1212 248.539 39.7336C249.252 40.0435 249.779 40.4543 250.108 40.9671C250.441 41.4848 250.543 42.0622 250.484 42.648C250.369 43.786 249.641 44.9957 248.737 46.0918C247.819 47.2044 246.659 48.2712 245.568 49.1296C243.391 50.8438 240.45 52.7781 235.946 53.6648C231.45 54.55 225.439 54.3831 217.122 51.976C203.973 48.1701 198.033 44.2845 194.094 41.708C193.062 41.0329 192.167 40.4477 191.316 39.9773C189.151 38.7805 185.638 37.5295 182.155 37.6482C178.706 37.7657 175.295 39.2192 173.188 43.4418C172.629 44.5604 172.097 45.671 171.573 46.7646C169.537 51.0115 167.625 55.0017 164.796 58.2071C161.198 62.2853 156.136 65.0912 147.537 65.7897L147.215 65.8158L147.059 65.5338C146.615 64.7334 146.223 63.1135 146.297 60.7575C146.371 58.3844 146.92 55.2256 148.406 51.318L148.467 51.1563L148.616 51.0672C149.288 50.6629 150.593 49.446 152.152 47.1031C153.701 44.7744 155.481 41.3646 157.121 36.6172C159.197 30.6082 162.227 24.7278 167.591 21.2436Z"
          fill="url(#paint9_linear_6088_52333)"
        />
        <Path
          d="M30.4566 49.5378C29.0796 45.3992 37.4942 29.3044 41.931 20.1074L53.8645 24.7059C52.1815 26.392 47.5305 32.6154 42.39 44.0196C37.2494 55.4239 31.5275 52.7568 30.4566 49.5378Z"
          fill="url(#paint10_linear_6088_52333)"
        />
        <Path
          d="M19.9003 44.0197C21.0001 38.9995 28.162 26.3921 31.8338 18.268C34.5877 16.4286 43.3083 18.7279 43.7673 21.0271C44.2263 23.3264 32.4109 45.0105 25.8671 48.1583C21.0001 50.4995 19.5457 45.6383 19.9003 44.0197Z"
          fill="url(#paint11_linear_6088_52333)"
        />
        <Path
          d="M9.34342 35.7423C11.1793 33.535 15.0042 28.3847 16.6871 26.0854C19.441 21.0271 32.2924 17.3483 32.2924 18.7278C32.2924 20.1074 23.1128 39.8809 15.7691 42.64C8.42546 45.3992 7.04852 38.5014 9.34342 35.7423Z"
          fill="url(#paint12_linear_6088_52333)"
        />
        <Path
          d="M37.8004 2.63337C62.4017 -1.7812 71.9179 17.9617 73.6008 28.385L51.1108 29.7644C51.2638 28.3848 49.0913 24.706 39.1773 21.0272C26.7849 16.4287 24.949 28.385 14.8514 28.385C4.75388 28.385 2 22.4068 2 16.8886C2 12.474 2.91796 11.8302 4.75388 13.2098C6.5898 14.5893 7.96673 16.4287 17.1463 10.9105C26.3259 5.39229 34.7405 3.09316 37.8004 2.63337Z"
          fill="url(#paint13_linear_6088_52333)"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M64.6493 9.59209C70.4044 15.3699 73.2405 23.0163 74.0944 28.3053L74.1824 28.8502L50.5484 30.2998L50.6139 29.7092C50.6364 29.5062 50.5773 29.1249 50.2696 28.5805C49.9665 28.0441 49.4395 27.3821 48.5888 26.6333C46.8867 25.1351 43.9256 23.3224 39.0034 21.4959C35.9798 20.374 33.6414 20.2754 31.6798 20.7242C29.7087 21.1753 28.0686 22.1895 26.4508 23.3839C25.9823 23.7297 25.515 24.0923 25.0419 24.4593C22.286 26.5974 19.3374 28.885 14.8514 28.885C9.70131 28.885 6.33601 27.3569 4.26619 25.0391C2.20635 22.7325 1.5 19.7221 1.5 16.8885C1.5 15.7716 1.55776 14.8715 1.67952 14.1716C1.79888 13.4855 1.99006 12.9262 2.3074 12.5526C2.47303 12.3576 2.67601 12.2099 2.91717 12.1293C3.15659 12.0492 3.40283 12.0455 3.64137 12.0903C4.10102 12.1767 4.5778 12.452 5.05424 12.81C5.16558 12.8937 5.27288 12.9767 5.37799 13.058C6.1736 13.6736 6.84311 14.1917 8.17954 14.147C9.76245 14.0942 12.3059 13.2369 16.8887 10.4819C26.1154 4.93544 34.5862 2.61228 37.7191 2.13994C50.1797 -0.0940294 58.8717 3.79183 64.6493 9.59209ZM63.9408 10.2978C58.3903 4.72552 50.0256 0.947573 37.8887 3.12547L37.8817 3.12672L37.8747 3.12778C34.8822 3.57746 26.5295 5.85325 17.4039 11.339C12.8072 14.1023 10.0723 15.0844 8.21291 15.1465C6.5008 15.2037 5.56132 14.4708 4.75524 13.842C4.65295 13.7622 4.55281 13.6841 4.45351 13.6094C4.01199 13.2777 3.68556 13.1161 3.45674 13.0731C3.35105 13.0533 3.28174 13.0618 3.2343 13.0777C3.1886 13.0929 3.13339 13.1249 3.06954 13.2C2.9279 13.3668 2.77485 13.71 2.66472 14.343C2.55698 14.9623 2.5 15.7982 2.5 16.8885C2.5 19.5732 3.17059 22.3109 5.01207 24.373C6.84358 26.4239 9.904 27.885 14.8514 27.885C18.9694 27.885 21.6257 25.832 24.3844 23.7001C24.8692 23.3254 25.3572 22.9482 25.8568 22.5794C27.5092 21.3595 29.2828 20.2469 31.4568 19.7494C33.6404 19.2498 36.1786 19.3811 39.3513 20.5584C44.3431 22.4107 47.4252 24.2768 49.2495 25.8827C50.1621 26.6859 50.7692 27.4321 51.1402 28.0885C51.3705 28.4959 51.5173 28.8826 51.5812 29.2345L73.0135 27.92C72.0823 22.8146 69.3206 15.6988 63.9408 10.2978Z"
          fill="url(#paint14_linear_6088_52333)"
        />
        <Path
          d="M37.542 14.1729C37.6848 12.5274 39.1309 11.3069 40.777 11.4424L126.842 18.5311L124.088 41.9834L38.8808 32.6694C37.2597 32.4922 36.077 31.0524 36.218 29.4278L37.542 14.1729Z"
          fill="url(#paint15_linear_6088_52333)"
        />
        <Path
          d="M39.6365 32.7856L123.171 41.5221L113.991 128.894L34.0851 113.772C32.5529 113.482 31.4973 112.066 31.6566 110.514L39.6365 32.7856Z"
          fill="#E8C48C"
        />
        <G opacity="0.32">
          <Path
            d="M88.8071 60.1571C86.8456 57.3279 84.8429 55.3757 83.3264 54.1246C82.5678 53.5013 81.9297 53.0531 81.4829 52.7564C81.2568 52.61 81.0798 52.5016 80.9566 52.4318C80.8974 52.3972 80.7604 52.3211 80.7604 52.3211C80.6825 52.2797 80.5913 52.2688 80.5059 52.2908C80.5059 52.2908 80.3596 52.3331 80.2892 52.3523C80.153 52.3912 79.9555 52.4549 79.7013 52.544C79.1931 52.7223 78.4723 53.0085 77.5879 53.4406C75.8199 54.3002 73.4144 55.727 70.8428 58.016C67.808 60.7183 64.5613 64.6265 61.8582 70.1844C62.4176 70.4348 62.9488 70.7186 63.4366 71.0386C64.7839 71.9113 65.4911 71.8623 65.9513 71.7196C66.8305 71.4523 67.8565 70.4859 68.9911 68.8525C70.9251 66.0695 73.503 65.0354 75.3259 64.6555C76.1501 64.4827 76.9917 64.4084 77.8226 64.4248C78.1481 64.4314 78.4037 64.4527 78.5867 64.4699L79.0861 64.5294C79.2734 64.5517 79.5311 64.5962 79.8443 64.6657C80.6605 64.8457 81.4611 65.1157 82.2216 65.4774C83.9041 66.2751 86.1667 67.8862 87.3924 71.0458C88.1108 72.9046 88.8814 74.0806 89.6732 74.5471C90.087 74.7939 90.7628 75.0077 92.2775 74.4762C93.0191 74.22 93.8113 74.0297 94.638 73.9169C93.3158 67.9711 91.0962 63.4665 88.8071 60.1571Z"
            fill="white"
          />
          <Path
            d="M103.761 79.0923C101.598 75.7062 95.191 76.3436 94.5429 76.5098C94.0993 76.5948 93.6632 76.699 93.2516 76.8428C91.1987 77.5583 89.5109 77.4995 88.0867 76.659C86.6806 75.8299 85.5669 74.2639 84.5831 71.7304C83.8605 69.8664 82.5966 68.4984 80.8265 67.6581C80.1354 67.3277 79.4985 67.1553 79.0951 67.0659C78.8764 67.0214 78.6998 66.9912 78.5803 66.9723L78.1577 66.922C78.0425 66.9082 77.8589 66.8955 77.6353 66.8919C77.2175 66.8834 76.5622 66.9064 75.8132 67.0606C73.8958 67.4568 72.3452 68.4939 71.2047 70.1358C69.653 72.3672 68.2073 73.6281 66.6409 74.1029C65.059 74.5851 63.4047 74.2455 61.5775 73.0676C61.2112 72.831 60.8118 72.6272 60.4006 72.4404C59.8098 72.1265 54.4695 69.8592 51.2408 73.0437C47.9523 76.2809 41.1148 93.3587 74.7385 97.3663C108.362 101.374 106.234 82.984 103.752 79.0912L103.761 79.0923Z"
            fill="white"
          />
        </G>
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_6088_52333"
          x1="140.612"
          y1="41.5234"
          x2="140.612"
          y2="128.895"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#A97354" />
          <Stop offset="1" stopColor="#CA9175" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_6088_52333"
          x1="147.037"
          y1="18.5312"
          x2="147.037"
          y2="45.2264"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#D3997F" />
          <Stop offset="0.963542" stopColor="#BA8262" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_6088_52333"
          x1="147.037"
          y1="18.5312"
          x2="147.037"
          y2="45.2264"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#D3997F" />
          <Stop offset="0.963542" stopColor="#BA8262" />
        </LinearGradient>
        <LinearGradient
          id="paint3_linear_6088_52333"
          x1="1.60835"
          y1="13.078"
          x2="9.36318"
          y2="39.1642"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#5C353A" />
          <Stop offset="1" stopColor="#2A1121" />
        </LinearGradient>
        <LinearGradient
          id="paint4_linear_6088_52333"
          x1="170.445"
          y1="41.8396"
          x2="171.315"
          y2="71.3045"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.666041" stopColor="white" />
          <Stop offset="1" stopColor="#D1D4EE" />
        </LinearGradient>
        <LinearGradient
          id="paint5_linear_6088_52333"
          x1="186.051"
          y1="34.9404"
          x2="181.424"
          y2="76.7319"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.414644" stopColor="white" />
          <Stop offset="1" stopColor="#D1D4EE" />
        </LinearGradient>
        <LinearGradient
          id="paint6_linear_6088_52333"
          x1="204.41"
          y1="32.6413"
          x2="221.933"
          y2="69.5368"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.180769" stopColor="white" />
          <Stop offset="0.973514" stopColor="#D1D4EE" />
        </LinearGradient>
        <LinearGradient
          id="paint7_linear_6088_52333"
          x1="193.853"
          y1="32.6419"
          x2="197.854"
          y2="69.0852"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.415946" stopColor="white" />
          <Stop offset="1" stopColor="#D1D4EE" />
        </LinearGradient>
        <LinearGradient
          id="paint8_linear_6088_52333"
          x1="178.248"
          y1="18.3867"
          x2="211.702"
          y2="57.7768"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset="0.211122" stopColor="white" />
          <Stop offset="1" stopColor="#D1D4EE" />
        </LinearGradient>
        <LinearGradient
          id="paint9_linear_6088_52333"
          x1="180.084"
          y1="9.35755"
          x2="178.241"
          y2="32.3495"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#D1D4EE" />
          <Stop offset="1" stopColor="#D1D4EE" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint10_linear_6088_52333"
          x1="42.39"
          y1="14.5892"
          x2="40.1694"
          y2="52.2032"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.388737" stopColor="white" />
          <Stop offset="1" stopColor="#D1D4EE" />
        </LinearGradient>
        <LinearGradient
          id="paint11_linear_6088_52333"
          x1="31.3748"
          y1="12.2898"
          x2="28.5459"
          y2="64.847"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.168081" stopColor="white" />
          <Stop offset="1" stopColor="#D1D4EE" />
        </LinearGradient>
        <LinearGradient
          id="paint12_linear_6088_52333"
          x1="23.1128"
          y1="14.4159"
          x2="14.931"
          y2="56.1073"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.0963135" stopColor="white" />
          <Stop offset="1" stopColor="#D1D4EE" />
        </LinearGradient>
        <LinearGradient
          id="paint13_linear_6088_52333"
          x1="23.8248"
          y1="1.90023"
          x2="45.7025"
          y2="42.4463"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset="0.309525" stopColor="white" />
          <Stop offset="1" stopColor="#D1D4EE" />
        </LinearGradient>
        <LinearGradient
          id="paint14_linear_6088_52333"
          x1="23.1131"
          y1="-2.59854"
          x2="37.8344"
          y2="15.7683"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#D1D4EE" />
          <Stop offset="1" stopColor="#D1D4EE" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint15_linear_6088_52333"
          x1="86.9111"
          y1="45.2262"
          x2="89.7488"
          y2="15.2686"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#E9C68E" />
          <Stop offset="1" stopColor="#F2E7BE" />
        </LinearGradient>
        <ClipPath id="clip0_6088_52333">
          <Rect width="252" height="133" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  goodsError: [
    <Svg
      width="212"
      height="198"
      viewBox="0 0 212 198"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Ellipse cx="106" cy="177" rx="104" ry="19" fill="#FFF5F3" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M153 5a3 3 0 0 0-3-3H60a3 3 0 0 0-3 3v53a3 3 0 0 0 3 3h34.007a3 3 0 0 1 2.596 1.497l5.801 10.019c1.155 1.995 4.037 1.995 5.192 0l5.801-10.02A2.998 2.998 0 0 1 115.993 61H150a3 3 0 0 0 3-3V5z"
        fill="#F1694F"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M112.778 44.02a3 3 0 0 0 4.243-4.242L109.243 32l7.778-7.778a3.001 3.001 0 0 0-4.243-4.243L105 27.757l-7.778-7.778a3 3 0 1 0-4.243 4.243L100.757 32l-7.778 7.778a3 3 0 1 0 4.243 4.243L105 36.243l7.778 7.778z"
        fill="#fff"
      />
      <Ellipse cx="115.5" cy="110.5" rx="40.5" ry="4.5" fill="#DAEEFF" />
      <Path d="m92 89-50 6v40l63 12 66-20V92l-79-3z" fill="url(#0aa60f9r8a)" />
      <Path
        d="m126.807 99 44-7v74.806a3 3 0 0 1-2.091 2.859L126.807 183V99z"
        fill="url(#rssjhd1vub)"
      />
      <Path
        d="m42 95 85 4v84l-82.314-8.716A3.002 3.002 0 0 1 42 171.298V95z"
        fill="#E8C48C"
      />
      <G opacity=".32" fillule="evenodd" clipRule="evenodd" fill="#fff">
        <Path d="M84.105 123.836a1.462 1.462 0 0 0-1.07-.042c-.526.185-10.472 3.867-15.922 18.359a10.948 10.948 0 0 1 2.632.97c.042.022.087.041.129.064 1.15.621 1.731.574 2.067.485.802-.214 1.696-1.164 2.658-2.823 2.767-4.782 7.728-4.672 8.492-4.622.75.009 5.72.282 8.11 5.263.83 1.729 1.649 2.745 2.433 3.02.326.114.9.206 2.097-.325.044-.019.089-.034.133-.053a10.904 10.904 0 0 1 2.7-.764c-4.316-14.87-13.949-19.308-14.459-19.532" />
        <Path d="M104.709 148.454c-1.337-1.778-3.432-2.293-5.374-2.068a7.734 7.734 0 0 0-2.215.597 9.97 9.97 0 0 1-.481.195c-1.525.587-2.879.665-4.124.229-1.677-.59-3.035-2.065-4.274-4.647-1.659-3.456-5.144-3.443-5.178-3.446l-.091.002-.091-.009c-.135-.005-3.538-.227-5.43 3.036-1.433 2.479-2.901 3.845-4.62 4.304-1.274.338-2.62.156-4.094-.546-.154-.074-.308-.147-.464-.232a7.514 7.514 0 0 0-2.163-.76 7.189 7.189 0 0 0-1.108-.14c-1.593-.062-3.217.428-4.409 1.781-1.068 1.214-2.433 5.154-.74 8.76 1.697 3.615 6.92 8.049 22.16 8.638 15.238.588 20.788-3.43 22.76-6.904 1.965-3.464.908-7.497-.064-8.79" />
      </G>
      <Path
        d="M23.04 121.716 42 95l85 4-22.018 31.193a6 6 0 0 1-5.406 2.518l-74.341-6.27c-2.314-.195-3.538-2.832-2.195-4.725zM146.692 129.945 127 99l44-7 16.874 20.768a3 3 0 0 1-1.271 4.699l-36.323 13.675a3 3 0 0 1-3.588-1.197z"
        fill="#FFE2B6"
      />
      <Defs>
        <LinearGradient
          id="0aa60f9r8a"
          x1="87"
          y1="92.5"
          x2="120"
          y2="96"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#A97354" />
          <Stop offset="1" stopColor="#CA9175" />
        </LinearGradient>
        <LinearGradient
          id="rssjhd1vub"
          x1="143.982"
          y1="93.377"
          x2="151.852"
          y2="180.393"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#A97354" />
          <Stop offset="1" stopColor="#CA9175" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
  fiveG: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.626 8.768c.197-.27.371-.528.508-.766 2.384-4.13-.074-6.954-.074-6.954S8.384.33 6 4.46c-.144.25-.278.505-.404.763C4.574 5.306 2.544 6.008 2 8.25l2.42.17c-.123.45-.212.832-.272 1.11a.768.768 0 0 0 .188.68l-.509.603a.203.203 0 0 0 .032.293c.34.261 1.122.849 1.715 1.191.592.342 1.492.726 1.888.89.108.044.23-.01.27-.12l.272-.756a.792.792 0 0 0 .678-.225c.195-.196.452-.458.74-.76l1.34 1.983c1.62-1.545 1.286-3.576.864-4.541zM5.658 14.22c-.448.776-1.815 1.06-1.815 1.06s-.438-1.325.01-2.102c.449-.776 1.013-.82 1.511-.533.499.287.742.799.294 1.575zM9.566 5.38a1 1 0 1 0 1-1.732 1 1 0 0 0-1 1.732z"
        fill="url(#j6pb3bswia)"
      />
      <Defs>
        <LinearGradient
          id="j6pb3bswia"
          x1="10.87"
          y1=".979"
          x2="4.819"
          y2="16.08"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#5B16EF" />
          <Stop offset="1" stopColor="#2A7FF6" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
  phone: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="13" cy="13" r="12" fill="#00AD50" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m15.796 14.095-1.131 1.132c-.319.319-.814.39-1.189.138a10.448 10.448 0 0 1-2.836-2.838c-.252-.374-.182-.87.136-1.189l1.132-1.131c.479-.48.479-1.257 0-1.737l-2.11-2.11a1.226 1.226 0 0 0-1.735 0l-1.31 1.31-.39.39a1.212 1.212 0 0 0-.346 1.06c.09.512.207 1.016.356 1.506a13.496 13.496 0 0 0 8.977 8.98c.5.153 1.011.28 1.533.376a1.21 1.21 0 0 0 1.065-.347l.71-.709.982-.984c.48-.48.48-1.257 0-1.736l-2.109-2.11a1.227 1.227 0 0 0-1.735 0z"
        fill="#fff"
      />
    </Svg>,
  ],
  verLine: [
    <Svg
      width="8"
      height="144"
      viewBox="0 0 8 144"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="8" height="144" rx="4" fill="#2A7FF6" />
      <Circle cx="4" cy="4" r="2" fill="#fff" />
      <Circle cx="4" cy="72" r="2" fill="#fff" />
      <Circle cx="4" cy="140" r="2" fill="#fff" />
    </Svg>,
  ],
  triangleCaution: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M11.135 3.495a1 1 0 0 1 1.73 0l9.266 16.004A1 1 0 0 1 21.266 21H2.734a1 1 0 0 1-.865-1.501l9.266-16.004z"
        fill="#ED4847"
      />
      <Path
        d="M13 18a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 9.857c0-.473.448-.857 1-.857s1 .384 1 .857v4.286c0 .473-.448.857-1 .857s-1-.384-1-.857V9.857z"
        fill="#fff"
      />
    </Svg>,
  ],
  iconDataOnly: [
    <Svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m2.167 15.067-.66.752h.002l.002.003.006.005a2.485 2.485 0 0 0 .068.057 11.023 11.023 0 0 0 .88.63c.61.392 1.513.905 2.721 1.415 2.42 1.02 6.052 2.018 10.98 2.018v-2c-4.65 0-8.018-.94-10.203-1.861a15.764 15.764 0 0 1-2.414-1.253 9.057 9.057 0 0 1-.697-.497l-.025-.02a.12.12 0 0 0-.004-.004l.001.001h.001v.002l-.658.752zm14 4.88c4.928 0 8.56-.999 10.98-2.018a17.76 17.76 0 0 0 2.721-1.416 11.008 11.008 0 0 0 .88-.629 3.278 3.278 0 0 0 .069-.057l.006-.005.002-.002v-.001l-.658-.752a102.65 102.65 0 0 1-.659-.753h.001l.001-.002-.003.003-.026.021a9.054 9.054 0 0 1-.697.496c-.519.335-1.32.793-2.413 1.254-2.186.92-5.554 1.861-10.204 1.861v2zm-14 .72c-.653.757-.652.758-.652.758l.001.001.002.002a.18.18 0 0 1 .006.005l.016.013.053.043a11.068 11.068 0 0 0 .88.617c.609.386 1.512.889 2.72 1.388 2.418 1 6.048 1.98 10.974 1.98v-2c-4.653 0-8.024-.924-10.21-1.828a15.872 15.872 0 0 1-2.415-1.23 9.06 9.06 0 0 1-.697-.486l-.026-.021-.003-.003.002.002-.651.759zm14 4.807c4.926 0 8.555-.98 10.974-1.98a17.87 17.87 0 0 0 2.72-1.387 11.066 11.066 0 0 0 .88-.618 4.1 4.1 0 0 0 .052-.043l.017-.013a.254.254 0 0 1 .005-.005l.002-.002h.001c0-.001.001-.002-.651-.76a97.401 97.401 0 0 1-.651-.758v-.001h.001l-.003.002-.025.02a9.057 9.057 0 0 1-.697.487c-.52.329-1.32.778-2.415 1.23-2.187.904-5.557 1.828-10.21 1.828v2zm13-17.874c0 .41-.204.901-.788 1.453-.585.554-1.487 1.1-2.684 1.578-2.389.956-5.757 1.569-9.528 1.569v2c3.96 0 7.592-.64 10.27-1.712 1.337-.534 2.486-1.196 3.317-1.982.833-.787 1.413-1.77 1.413-2.906h-2zm-13 4.6c-3.772 0-7.14-.613-9.528-1.569-1.197-.479-2.099-1.024-2.685-1.578-.584-.552-.787-1.043-.787-1.453h-2c0 1.137.58 2.119 1.413 2.906.83.786 1.98 1.448 3.316 1.982 2.678 1.072 6.31 1.712 10.27 1.712v-2zm-13-4.6c0-.41.203-.901.787-1.453.586-.554 1.488-1.1 2.685-1.578C9.027 3.613 12.395 3 16.167 3V1c-3.96 0-7.593.64-10.271 1.712-1.337.534-2.485 1.196-3.316 1.982-.833.787-1.413 1.77-1.413 2.906h2zm13-4.6c3.771 0 7.14.613 9.528 1.569 1.197.478 2.099 1.024 2.684 1.578.584.552.788 1.043.788 1.453h2c0-1.137-.58-2.119-1.413-2.906-.831-.786-1.98-1.448-3.316-1.982C23.759 1.64 20.128 1 16.167 1v2zm13 21.4c0 .41-.204.901-.788 1.453-.585.554-1.487 1.1-2.684 1.578-2.389.956-5.757 1.569-9.528 1.569v2c3.96 0 7.592-.64 10.27-1.712 1.337-.534 2.486-1.196 3.317-1.982.833-.788 1.413-1.77 1.413-2.906h-2zm-13 4.6c-3.772 0-7.14-.613-9.528-1.569-1.197-.479-2.099-1.024-2.685-1.578-.584-.552-.787-1.043-.787-1.453h-2c0 1.137.58 2.119 1.413 2.906.83.786 1.98 1.448 3.316 1.982C8.574 30.36 12.206 31 16.166 31v-2zm15-4.6V7.6h-2v16.8h2zm-28 0V7.6h-2v16.8h2z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  iconDataV: [
    <Svg
      width="70"
      height="32"
      viewBox="0 0 70 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m2.417 15.183-.66.753h.002c0 .001 0 .002.002.002l.005.005.015.013.048.04.165.13c.142.107.347.255.616.428.539.348 1.335.8 2.4 1.249 2.132.898 5.327 1.776 9.656 1.776v-2c-4.051 0-6.982-.82-8.88-1.62-.95-.4-1.644-.796-2.092-1.085a7.785 7.785 0 0 1-.621-.445l.002.002-.659.752zm12.25 4.396c4.33 0 7.524-.878 9.656-1.776 1.065-.449 1.861-.901 2.4-1.249a9.8 9.8 0 0 0 .782-.559l.047-.04.015-.012.005-.005.002-.002h.001s.001-.001-.659-.753c-.66-.751-.659-.752-.658-.752l.001-.001.001-.001-.002.001-.02.018a7.785 7.785 0 0 1-.599.426c-.448.289-1.143.685-2.093 1.086-1.897.799-4.828 1.619-8.88 1.619v2zm-12.25.504c-.653.758-.653.759-.652.759l.003.002a15.767 15.767 0 0 0 3.249 1.829c2.13.88 5.322 1.741 9.65 1.741v-2c-4.055 0-6.988-.805-8.887-1.59a13.76 13.76 0 0 1-2.093-1.065 7.796 7.796 0 0 1-.599-.418l-.02-.017a.02.02 0 0 1-.001 0h.001c0 .001.001.002-.651.76zm12.25 4.332c4.327 0 7.519-.861 9.65-1.742 1.064-.44 1.86-.883 2.399-1.224a9.77 9.77 0 0 0 .781-.549l.048-.038c.006-.005.01-.01.015-.013l.005-.005.002-.001.001-.001-.652-.759c-.652-.757-.652-.758-.651-.758l.002-.002-.001.001-.021.017a7.781 7.781 0 0 1-.598.418c-.45.284-1.144.673-2.094 1.066-1.9.785-4.832 1.59-8.887 1.59v2zM25.916 8.65c0 .313-.155.712-.65 1.18-.498.471-1.271.94-2.31 1.356-2.072.83-5.002 1.364-8.29 1.364v2c3.477 0 6.671-.562 9.033-1.507 1.178-.471 2.199-1.057 2.94-1.76.745-.703 1.276-1.593 1.276-2.633h-2zm-11.25 3.9c-3.289 0-6.22-.535-8.291-1.364-1.039-.415-1.812-.885-2.31-1.355-.495-.469-.65-.868-.65-1.181h-2c0 1.04.532 1.93 1.276 2.634.742.702 1.763 1.288 2.941 1.76 2.362.944 5.556 1.506 9.034 1.506v-2zm-11.25-3.9c0-.313.154-.712.65-1.18.497-.471 1.27-.94 2.309-1.356 2.072-.83 5.002-1.364 8.29-1.364v-2c-3.477 0-6.671.562-9.033 1.507-1.178.471-2.199 1.057-2.94 1.76-.745.703-1.276 1.593-1.276 2.633h2zm11.25-3.9c3.288 0 6.218.535 8.29 1.364 1.039.415 1.812.885 2.31 1.355.495.469.65.868.65 1.181h2c0-1.04-.532-1.93-1.276-2.634-.742-.702-1.763-1.288-2.941-1.76-2.362-.944-5.556-1.506-9.034-1.506v2zm11.25 18.6c0 .313-.155.712-.65 1.18-.498.471-1.271.94-2.31 1.356-2.072.83-5.002 1.364-8.29 1.364v2c3.477 0 6.671-.562 9.033-1.507 1.178-.471 2.199-1.057 2.94-1.76.745-.703 1.276-1.593 1.276-2.633h-2zm-11.25 3.9c-3.289 0-6.22-.535-8.291-1.364-1.039-.415-1.812-.885-2.31-1.355-.495-.469-.65-.868-.65-1.181h-2c0 1.04.532 1.93 1.276 2.634.742.702 1.763 1.288 2.941 1.76 2.362.944 5.556 1.506 9.034 1.506v-2zm13.25-3.9V8.65h-2v14.7h2zm-24.5 0V8.65h-2v14.7h2zm24.5-8.167V8.65h-2v6.533h2zM1.416 8.65v6.533h2V8.65h-2zm0 6.533v4.9h2v-4.9h-2zm26.5 4.9v-4.9h-2v4.9h2zm-26.5 0v3.267h2v-3.267h-2zm26.5 3.267v-3.267h-2v3.267h2z"
        fill="#2A7FF6"
      />
      <Path
        d="m60.56 17.917-2.385 2.385a.965.965 0 0 1-1.195.148 18.285 18.285 0 0 1-5.756-5.758.965.965 0 0 1 .147-1.195l2.384-2.386c.838-.838.838-2.199 0-3.038L50.063 4.38a2.145 2.145 0 0 0-3.036 0l-2.293 2.294-.681.68a2.122 2.122 0 0 0-.606 1.855c.156.898.362 1.778.622 2.636 2.274 7.519 8.198 13.43 15.71 15.716.876.267 1.77.49 2.683.657.679.124 1.376-.119 1.864-.606l1.24-1.241 1.72-1.723c.84-.838.84-2.199.002-3.038l-3.692-3.693a2.147 2.147 0 0 0-3.037 0"
        stroke="#2A7FF6"
        strokeWidth="2"
      />
      <Path
        d="M30.666 16a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2h-8a1 1 0 0 1-1-1z"
        fill="#2A7FF6"
      />
      <Path
        d="M35.666 11a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  iconDataM: [
    <Svg
      width="70"
      height="32"
      viewBox="0 0 70 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m21.666 12.672-.268-.963.268.963zm-19.25 2.511c-.66.752-.659.752-.658.753l.003.002.005.005.015.013.048.04.165.13c.142.107.347.255.616.428.539.348 1.335.8 2.4 1.249 2.132.898 5.327 1.776 9.656 1.776v-2c-4.051 0-6.982-.82-8.88-1.62-.95-.4-1.644-.796-2.092-1.085a7.785 7.785 0 0 1-.621-.445l.002.002-.659.752zm0 4.9c-.652.758-.652.759-.651.759l.003.002a15.767 15.767 0 0 0 3.249 1.829c2.13.88 5.322 1.741 9.65 1.741v-2c-4.055 0-6.988-.805-8.887-1.59a13.76 13.76 0 0 1-2.093-1.065 7.796 7.796 0 0 1-.599-.418l-.02-.017c0 .001.001.002-.651.76zm12.25 4.332c4.328 0 7.52-.861 9.65-1.742 1.065-.44 1.861-.883 2.4-1.224a9.77 9.77 0 0 0 .781-.549l.048-.038c.006-.005.01-.01.015-.013l.005-.005.002-.001.001-.001-.652-.759c-.652-.757-.652-.758-.651-.758l.002-.002-.001.001-.021.017a7.781 7.781 0 0 1-.598.418c-.45.284-1.144.673-2.094 1.066-1.9.785-4.832 1.59-8.887 1.59v2zm0-11.865c-3.288 0-6.218-.535-8.29-1.364-1.039-.415-1.812-.885-2.31-1.355-.495-.469-.65-.868-.65-1.181h-2c0 1.04.532 1.93 1.276 2.634.742.702 1.763 1.288 2.941 1.76 2.362.944 5.556 1.506 9.034 1.506v-2zm-11.25-3.9c0-.313.155-.712.65-1.18.498-.471 1.271-.94 2.31-1.356 2.072-.83 5.002-1.364 8.29-1.364v-2c-3.477 0-6.671.562-9.033 1.507-1.178.471-2.199 1.057-2.94 1.76-.745.703-1.276 1.593-1.276 2.633h2zm22.5 14.7c0 .313-.154.712-.65 1.18-.497.471-1.27.94-2.309 1.356-2.072.83-5.002 1.364-8.29 1.364v2c3.477 0 6.671-.562 9.033-1.507 1.178-.471 2.199-1.057 2.94-1.76.745-.703 1.276-1.593 1.276-2.633h-2zm-11.25 3.9c-3.288 0-6.218-.535-8.29-1.364-1.039-.415-1.812-.885-2.31-1.355-.495-.469-.65-.868-.65-1.181h-2c0 1.04.532 1.93 1.276 2.634.742.702 1.763 1.288 2.941 1.76 2.362.944 5.556 1.506 9.034 1.506v-2zm-11.25-3.9V8.65h-2v14.7h2zm-2-14.7v6.533h2V8.65h-2zm0 6.533v4.9h2v-4.9h-2zm0 4.9v3.267h2v-3.267h-2zm26.5 3.267v-3.267h-2v3.267h2zm-6.518-11.642c-1.886.527-4.207.842-6.732.842v2c2.682 0 5.186-.334 7.27-.915l-.538-1.926zM14.666 4.75c3.668 0 6.88.665 8.954 1.653l.86-1.806c-2.42-1.152-5.948-1.847-9.814-1.847v2zm8.14 6.495c-.433.168-.904.323-1.408.464l.537 1.926c.56-.156 1.093-.331 1.591-.524l-.72-1.866zm-8.14 8.334c4.985 0 8.462-1.163 10.547-2.18l-.877-1.798c-1.829.893-5.008 1.978-9.67 1.978v2zm13.25.504V19h-2v1.083h2zm0 3.267V19h-2v4.35h2z"
        fill="#2A7FF6"
      />
      <Path
        d="M46.913 23a2.143 2.143 0 0 1-.626 1.648l-1.72 1.723-1.242 1.24c-.487.488-1.184.731-1.863.607a24.257 24.257 0 0 1-2.683-.657c-7.512-2.286-13.436-8.197-15.71-15.716a22.371 22.371 0 0 1-.622-2.636c-.12-.676.12-1.368.606-1.854l.68-.681 2.294-2.294a2.145 2.145 0 0 1 3.036 0l3.692 3.693c.838.84.838 2.2 0 3.038l-2.384 2.386a.965.965 0 0 0-.147 1.195 18.285 18.285 0 0 0 5.756 5.758.965.965 0 0 0 1.195-.148l2.384-2.385a2.147 2.147 0 0 1 3.037 0l.73.73.429.429"
        stroke="#2A7FF6"
        strokeWidth="2"
      />
      <Path
        d="M67.666 6a2 2 0 0 0-2-2h-20a2 2 0 0 0-2 2v14.75a2 2 0 0 0 2 2H59.55a2 2 0 0 1 1.292.473l5.18 4.384a1 1 0 0 0 1.645-.763V6z"
        stroke="#2A7FF6"
        strokeWidth="2"
      />
      <Circle
        cx="1.5"
        cy="1.5"
        r="1.5"
        transform="matrix(-1 0 0 1 62.666 12)"
        fill="#2A7FF6"
      />
      <Circle
        cx="1.5"
        cy="1.5"
        r="1.5"
        transform="matrix(-1 0 0 1 57.166 12)"
        fill="#2A7FF6"
      />
      <Circle
        cx="1.5"
        cy="1.5"
        r="1.5"
        transform="matrix(-1 0 0 1 51.666 12)"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  iconClock: [
    <Svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 1a1 1 0 0 1 1 1v2h16V2a1 1 0 1 1 2 0v2h3a2 2 0 0 1 2 2v23a2 2 0 0 1-2 2h-26a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2a1 1 0 0 1 1-1zm17 5v2a1 1 0 1 0 2 0V6h3v5h-26V6h3v2a1 1 0 0 0 2 0V6h16zm-21 7h26v16h-26V13z"
        fill="#2A7FF6"
      />
      <Path
        stroke="#2A7FF6"
        strokeWidth="2"
        strokeLinejoin="round"
        d="M6.5 17h4v4h-4zM14.5 17h4v4h-4zM22.5 17h4v4h-4z"
      />
    </Svg>,
  ],
  icon3G: [
    <Svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M26 12.505c-1.667-3.799-9.167-3.76-9.167 3.498 0 7.996 10 7.996 10 0l-4.5-.003M7.333 13.013c0-3.966 6-4.068 6 0 0 2.034-1.75 2.531-3.5 2.531 1.75 0 4 1.013 4 3.038 0 4.557-7 4.557-7 0"
        stroke="#2A7FF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x="2.833"
        y="2"
        width="28"
        height="28"
        rx="5"
        stroke="#2A7FF6"
        strokeWidth="2"
      />
    </Svg>,
  ],
  iconLTE: [
    <Svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect
        x="2.833"
        y="2"
        width="28"
        height="28"
        rx="5"
        stroke="#2A7FF6"
        strokeWidth="2"
      />
      <Path
        d="M6.833 10v12h5M12.833 10h3m3 0h-3m0 0v12M26.833 10h-5v6m5 6h-5v-6m0 0h5"
        stroke="#2A7FF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  icon5G: [
    <Svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M26 12.505c-1.667-3.799-9.167-3.76-9.167 3.498 0 7.996 10 7.996 10 0h-4.545M12.958 10h-5.25l-.875 5.393c2-2.393 7-2.423 7 2.387 0 4.625-5.5 5.625-7 2.12"
        stroke="#2A7FF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x="2.833"
        y="2"
        width="28"
        height="28"
        rx="5"
        stroke="#2A7FF6"
        strokeWidth="2"
      />
    </Svg>,
  ],
  iconAllday: [
    <Svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M12.166 12a5.657 5.657 0 1 0 0 8l8-8a5.657 5.657 0 1 1 0 8l-4-4-4-4z"
        stroke="#2A7FF6"
        strokeWidth="2"
      />
    </Svg>,
  ],
  iconTimer: [
    <Svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.167 1a1 1 0 0 0 0 2h2v4a9.98 9.98 0 0 0 3.713 7.777c.589.477 1.234.888 1.922 1.223a10.01 10.01 0 0 0-1.922 1.223A9.98 9.98 0 0 0 5.167 25v4h-2a1 1 0 1 0 0 2h26a1 1 0 1 0 0-2h-2v-4a9.98 9.98 0 0 0-3.714-7.777A10.01 10.01 0 0 0 21.531 16a10.01 10.01 0 0 0 1.922-1.223A9.98 9.98 0 0 0 27.166 7V3h2a1 1 0 1 0 0-2h-26zm4 6V3h18v4a8 8 0 0 1-4.51 7.201 2 2 0 0 0 0 3.598A8 8 0 0 1 25.167 25v4H23.88l-3.509-5.457a4.943 4.943 0 0 0-3.206-2.197V14a1 1 0 1 0 0-2h-2a1 1 0 1 0 0 2v7.346a4.943 4.943 0 0 0-3.205 2.197L8.452 29H7.167v-4a8 8 0 0 1 4.51-7.201 2 2 0 0 0 0-3.598A8 8 0 0 1 7.166 7zM18.69 24.624 21.503 29H10.83l2.813-4.376c1.18-1.837 3.866-1.837 5.047 0z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  iconSpeed: [
    <Svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="16.166" cy="16" r="14" stroke="#2A7FF6" strokeWidth="2" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.166 1a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1zm7.708 9.536a1 1 0 1 1-1.415-1.415l2.829-2.828a1 1 0 1 1 1.414 1.414l-2.828 2.829zm2.828 14.585a1 1 0 0 1-1.414 1.414l-2.829-2.828a1 1 0 0 1 1.415-1.414l2.828 2.828zM31.166 16a1 1 0 0 1-1 1h-4a1 1 0 1 1 0-2h4a1 1 0 0 1 1 1zM5.46 7.707a1 1 0 1 1 1.415-1.414L9.702 9.12a1 1 0 1 1-1.414 1.415L5.459 7.707zm0 18.828a1 1 0 0 1 0-1.414l2.829-2.828a1 1 0 0 1 1.414 1.414l-2.828 2.828a1 1 0 0 1-1.415 0zM2.167 17a1 1 0 1 1 0-2h4a1 1 0 1 1 0 2h-4z"
        fill="#2A7FF6"
      />
      <Path
        d="M19.945 13.122s-.243 4.485-1.415 5.657a3 3 0 0 1-4.242-4.243c1.171-1.172 5.657-1.414 5.657-1.414z"
        stroke="#2A7FF6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  iconWifi: [
    <Svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.026 8.85C6.995 6.4 11.596 5 16.5 5c4.905 0 9.505 1.4 13.475 3.85a1 1 0 0 0 1.05-1.7C26.756 4.511 21.794 3 16.5 3 11.207 3 6.245 4.512 1.975 7.15a1 1 0 0 0 1.05 1.7zM16.5 13c-3.463 0-6.7 1.036-9.452 2.837a1 1 0 1 1-1.095-1.674C9.016 12.16 12.63 11 16.5 11c3.87 0 7.484 1.16 10.548 3.163a1 1 0 1 1-1.095 1.674C23.199 14.036 19.963 13 16.5 13zm-4.346 9.756C13.477 21.613 14.96 21 16.5 21s3.024.613 4.346 1.756a1 1 0 1 0 1.308-1.512C20.535 19.844 18.602 19 16.5 19s-4.035.843-5.654 2.244a1 1 0 0 0 1.308 1.512zM16.5 29a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  iconWifiOff: [
    <Svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.341 2.54a1 1 0 1 0-1.682-1.08l-1.533 2.383C21.634 3.145 19.113 3 16.5 3 11.207 3 6.245 4.512 1.975 7.15a1 1 0 0 0 1.05 1.7C6.996 6.4 11.596 5 16.5 5c2.324 0 4.445.12 6.488.613l-3.602 5.605A19.151 19.151 0 0 0 16.5 11c-3.87 0-7.484 1.16-10.547 3.163a1 1 0 0 0 1.095 1.674C9.8 14.036 13.037 13 16.5 13c.57 0 1.132.028 1.687.082L7.659 29.46a1 1 0 0 0 1.682 1.082l18-28zm-.53 3.533a1 1 0 0 1 1.33-.483c.992.464 1.955.985 2.885 1.56a1 1 0 1 1-1.051 1.7 26.273 26.273 0 0 0-2.68-1.448 1 1 0 0 1-.483-1.33zm-2.637 6.534a1 1 0 0 0-.802 1.832c.898.393 1.76.861 2.58 1.398a1 1 0 0 0 1.096-1.674 19.64 19.64 0 0 0-2.874-1.556zm-6.642 7.522a1 1 0 0 1 1.217-.72c1.154.297 2.246.749 3.252 1.33a1 1 0 1 1-1.002 1.732 10.925 10.925 0 0 0-2.748-1.125 1 1 0 0 1-.72-1.217zM17.5 28a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  iconCharge: [
    <Svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.156 1.67c1.293-1.414 3.694-.43 3.556 1.458l-.728 9.9h5.807c1.758 0 2.692 2.02 1.523 3.298L15.51 30.33c-1.293 1.414-3.694.43-3.556-1.458l.728-9.9H6.875c-1.759 0-2.691-2.02-1.523-3.298L18.156 1.67zm1.523 1.316L6.875 16.991h6.901c.283 0 .553.114.746.315.193.201.29.471.27.746l-.805 10.962 12.804-14.005H19.89c-.283 0-.553-.114-.746-.315a.974.974 0 0 1-.27-.746l.805-10.962z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  iconChargeOff: [
    <Svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m16.389 28-1.601 1.801c-.635.714-1.813.217-1.745-.735L13.833 18H7.06c-.863 0-1.32-1.02-.748-1.664L18.878 2.199c.635-.714 1.814-.217 1.745.735L19.833 14h7"
        stroke="#2A7FF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m24.485 18.768-5.304 6M24.485 24.767l-5.304-6"
        stroke="#2A7FF6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>,
  ],
  iconChargeInfo: [
    <Svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="10.333" cy="10" r="9" fill="#AAA" />
      <Rect
        x="11.333"
        y="15"
        width="2"
        height="7"
        rx="1"
        transform="rotate(-180 11.333 15)"
        fill="#fff"
      />
      <Circle
        cx="10.333"
        cy="6"
        r="1"
        transform="rotate(-180 10.333 6)"
        fill="#fff"
      />
    </Svg>,
  ],
  iconOk: [
    <Svg
      width="13"
      height="12"
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="6.333" cy="6" r="5" stroke="#00AD50" strokeWidth="2" />
    </Svg>,
  ],
  iconX: [
    <Svg
      width="13"
      height="12"
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#02elzcw9ma)">
        <Path
          d="m1.19.857 10.286 10.286m0-10.286L1.19 11.143"
          stroke="#EE4423"
          strokeWidth="2"
        />
      </G>
      <Defs>
        <ClipPath id="02elzcw9ma">
          <Path fill="#fff" transform="translate(.333)" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  iconNoticeRed24: [
    <Svg
      width="24"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10.366 1.815a2 2 0 0 1 3.268 0l8.14 11.532c.935 1.325-.012 3.153-1.634 3.153H3.86c-1.622 0-2.57-1.829-1.634-3.153l8.14-11.532z"
        fill="#ED4847"
      />
      <Rect x="11" y="5.5" width="2" height="6" rx="1" fill="#fff" />
      <Rect x="11" y="12.5" width="2" height="2" rx="1" fill="#fff" />
    </Svg>,
  ],
  iconM: [
    <Svg
      width="27"
      height="26"
      viewBox="0 0 27 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="13.5" cy="13" r="12" fill="#5B16EF" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 7C20.1046 7 21 7.89543 21 9V19.7929C21 20.2383 20.4614 20.4614 20.1464 20.1464L18.2929 18.2929C18.1054 18.1054 17.851 18 17.5858 18H7.99985C6.89528 18 5.99985 17.1046 5.99985 16V9C5.99985 7.89543 6.89528 7 7.99985 7H19ZM17 13.5C16.4477 13.5 16 13.0523 16 12.5C16 11.9477 16.4477 11.5 17 11.5C17.5523 11.5 18 11.9477 18 12.5C18 13.0523 17.5523 13.5 17 13.5ZM12.5 12.5C12.5 13.0523 12.9477 13.5 13.5 13.5C14.0523 13.5 14.5 13.0523 14.5 12.5C14.5 11.9477 14.0523 11.5 13.5 11.5C12.9477 11.5 12.5 11.9477 12.5 12.5ZM10 13.5C9.44771 13.5 9 13.0523 9 12.5C9 11.9477 9.44771 11.5 10 11.5C10.5523 11.5 11 11.9477 11 12.5C11 13.0523 10.5523 13.5 10 13.5Z"
        fill="white"
      />
    </Svg>,
  ],
  iconV: [
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="13" cy="13" r="12" fill="#00AD50" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m15.796 14.095-1.131 1.132c-.319.319-.814.39-1.189.138a10.448 10.448 0 0 1-2.836-2.838c-.252-.374-.182-.87.136-1.189l1.132-1.131c.479-.48.479-1.257 0-1.737l-2.11-2.11a1.226 1.226 0 0 0-1.735 0l-1.31 1.31-.39.39a1.212 1.212 0 0 0-.346 1.06c.09.512.207 1.016.356 1.506a13.496 13.496 0 0 0 8.977 8.98c.5.153 1.011.28 1.533.376a1.21 1.21 0 0 0 1.065-.347l.71-.709.982-.984c.48-.48.48-1.257 0-1.736l-2.109-2.11a1.227 1.227 0 0 0-1.735 0z"
        fill="#fff"
      />
    </Svg>,
  ],
  arrowRightBlue10: [
    <Svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M4.5.5 9 5 4.5 9.5"
        stroke="#2A7FF6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  apn: [
    <Svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V2zM3 3.959a1 1 0 0 1 1.04-.958C9.984 3.244 14.757 8.017 15 13.959a1 1 0 1 1-2 .082A9.445 9.445 0 0 0 3.96 4.999a1 1 0 0 1-.958-1.04zm1.058 3.043a1 1 0 0 0-.116 1.996 5.387 5.387 0 0 1 5.06 5.06 1 1 0 1 0 1.996-.116 7.387 7.387 0 0 0-6.94-6.94zm.052 4.004a1 1 0 0 0-.22 1.988 1.267 1.267 0 0 1 1.116 1.116 1 1 0 0 0 1.988-.22 3.267 3.267 0 0 0-2.884-2.884z"
        fill="#fff"
      />
    </Svg>,
  ],
  mycoupon: [
    <Svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.936 3.692h18.461v5.11a3.69 3.69 0 0 0-1.846 3.197 3.69 3.69 0 0 0 1.846 3.199v5.11H2.936v-5.11a3.69 3.69 0 0 0 1.846-3.199 3.69 3.69 0 0 0-1.846-3.198v-5.11zm18.461-1.846c1.02 0 1.847.826 1.847 1.846v6.461a1.846 1.846 0 1 0 0 3.693v6.461c0 1.02-.827 1.846-1.847 1.846H2.936a1.846 1.846 0 0 1-1.846-1.846v-6.461a1.846 1.846 0 1 0 0-3.693V3.692c0-1.02.826-1.846 1.846-1.846h18.461zM15.86 14.307a.462.462 0 1 1-.923 0 .462.462 0 0 1 .923 0zm1.846 0a2.308 2.308 0 1 1-4.615 0 2.308 2.308 0 0 1 4.615 0zm-8.77-4.154a.462.462 0 1 0 0-.923.462.462 0 0 0 0 .923zm0 1.846a2.308 2.308 0 1 0 .001-4.615 2.308 2.308 0 0 0 0 4.615zm-1.113 3.04a.923.923 0 0 0 1.305 1.306l7.385-7.385a.923.923 0 1 0-1.306-1.305l-7.384 7.384z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  contact121: [
    <Svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.423 9.232A8.308 8.308 0 0 1 9.731.924h5.538a8.308 8.308 0 0 1 8.308 8.308v5.538a8.308 8.308 0 0 1-8.308 8.308h-12a1.846 1.846 0 0 1-1.846-1.846v-12zM9.731 2.77a6.462 6.462 0 0 0-6.462 6.462v12h12a6.462 6.462 0 0 0 6.462-6.462V9.232a6.462 6.462 0 0 0-6.462-6.462H9.731z"
        fill="#2C2C2C"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.885 9.232c0-.51.413-.923.923-.923h7.384a.923.923 0 0 1 0 1.846H8.808a.923.923 0 0 1-.923-.923zM7.885 14.77c0-.51.413-.922.923-.922h4.615a.923.923 0 1 1 0 1.846H8.808a.923.923 0 0 1-.923-.923z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  caution24: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#2C2C2C" />
      <Path
        d="M13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 8a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8z"
        fill="#fff"
      />
    </Svg>,
  ],
  imgCoupon: [
    <Svg
      width="63"
      height="62"
      viewBox="0 0 63 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.5 12a2 2 0 0 1 2-2h58a2 2 0 0 1 2 2v12.7c-3.314 0-6 2.82-6 6.3s2.686 6.3 6 6.3V50a2 2 0 0 1-2 2h-58a2 2 0 0 1-2-2V37.3c3.314 0 6-2.82 6-6.3s-2.686-6.3-6-6.3V12z"
        fill="url(#3m87a5l96a)"
      />
      <Circle cx="19.5" cy="31" r="3" fill="#fff" />
      <Circle cx="31.5" cy="31" r="3" fill="#fff" />
      <Circle cx="43.5" cy="31" r="3" fill="#fff" />
      <Defs>
        <LinearGradient
          id="3m87a5l96a"
          x1="19.5"
          y1="22.6"
          x2="51.204"
          y2="39.185"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2A7FF6" />
          <Stop offset="1" stopColor="#71A9F8" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
  couponColor: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M.684 11.94a2 2 0 0 0 1.68 1.96l9.213 1.49a2 2 0 0 0 2.3-1.695l.084-.604a2 2 0 0 0-1.717-2.26L2.945 9.595a2 2 0 0 0-2.263 1.996l.002.348z"
        fill="#F1694F"
      />
      <Path
        d="M.666 11.435A2 2 0 0 0 2.52 13.43l9.729.716a2 2 0 0 0 2.142-1.855l.043-.615a2 2 0 0 0-1.898-2.137l-9.772-.477A2 2 0 0 0 .666 11.06v.375z"
        fill="#FFD357"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.666 2.667a2 2 0 0 1 2-2h10.667a2 2 0 0 1 2 2v2.666a1.333 1.333 0 1 0 0 2.667v2.667a2 2 0 0 1-2 2H2.666a2 2 0 0 1-2-2V8a1.333 1.333 0 0 0 0-2.667V2.667z"
        fill="#2A7FF6"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 8.667a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM6 5.667a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.646 9.02a.5.5 0 0 1 0-.707l4-4a.5.5 0 0 1 .707.707l-4 4a.5.5 0 0 1-.707 0z"
        fill="#fff"
      />
    </Svg>,
  ],
  cautionPurple: [
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="11" fill="#5B16EF" />
      <Path
        d="M13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM11 8a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8z"
        fill="#fff"
      />
    </Svg>,
  ],
  iconGift: [
    <Svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.924 2.962c-.048-.096-.085-.124-.095-.13-.006-.004-.03-.021-.108-.024-.198-.008-.612.081-1.326.494-.715.413-1.081.889-1.274 1.267.487.005 1.064-.08 1.597-.388.74-.428 1.076-.733 1.206-.931.051-.08.053-.115.053-.122 0-.01 0-.06-.053-.166zm-4.07 2.378zm4.186.2h4.101a2.77 2.77 0 0 1 2.77 2.768v1.847a2.77 2.77 0 0 1-1.847 2.611v7.542a2.77 2.77 0 0 1-2.77 2.77H6.373a2.77 2.77 0 0 1-2.77-2.77v-7.542a2.77 2.77 0 0 1-1.846-2.611V8.308a2.77 2.77 0 0 1 2.77-2.769h4.141c-.608-.384-1.115-.798-1.43-1.28A2.073 2.073 0 0 1 6.886 3.2a2.172 2.172 0 0 1 .247-1.068c.16-.316.387-.61.707-.828.323-.22.69-.327 1.074-.342.724-.029 1.51.272 2.321.74.737.425 1.256.923 1.619 1.416.362-.493.881-.99 1.618-1.416.81-.468 1.597-.769 2.322-.74.383.015.75.122 1.074.342.32.218.547.512.706.828.161.32.263.68.248 1.068a2.073 2.073 0 0 1-.352 1.058c-.314.482-.821.896-1.43 1.28zM8.878 2.831c-.01.006-.047.034-.095.13-.053.107-.053.155-.053.165 0 .008.002.044.053.123.13.198.466.503 1.206.931.533.308 1.11.393 1.598.388-.193-.378-.56-.854-1.275-1.267-.714-.413-1.128-.502-1.326-.494-.077.003-.102.02-.108.024zm4.878 10.092h6.462v7.384c0 .51-.413.924-.923.924h-5.539v-8.308zm0-1.846h7.385c.51 0 .923-.414.923-.923V8.308a.923.923 0 0 0-.923-.923h-7.385v3.693zM11.91 7.385v3.693H4.526a.923.923 0 0 1-.923-.923V8.308c0-.51.413-.923.923-.923h7.384zm0 5.539v8.308H6.372a.923.923 0 0 1-.923-.924v-7.384h6.461z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  rokebiLogo: [
    <Svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m11.128.613.048-.118a.128.128 0 0 0-.097 0l.049.118z"
        fill="#FFD300"
      />
      <Path
        d="m18.418 14.7.11.067a.128.128 0 0 0 .018-.076c-.38-5.725-2.212-9.273-3.958-11.391-.873-1.059-1.722-1.759-2.355-2.195a7.872 7.872 0 0 0-.763-.467 4.718 4.718 0 0 0-.288-.14l-.004-.003h-.001l-.05.118-.048-.118h-.002l-.004.002A1.068 1.068 0 0 0 11 .53c-.05.023-.123.059-.215.108a7.86 7.86 0 0 0-.763.467C9.39 1.541 8.54 2.241 7.668 3.3 5.922 5.418 4.09 8.966 3.709 14.69a.128.128 0 0 0 .02.076l.108-.067-.109.067v.001l.002.002.004.007a.757.757 0 0 0 .07.092c.05.06.127.144.238.243.221.199.577.459 1.122.717 1.09.517 2.932 1.027 5.964 1.027 3.031 0 4.874-.51 5.963-1.027.545-.258.9-.518 1.122-.717a2.36 2.36 0 0 0 .294-.315.624.624 0 0 0 .014-.02l.004-.007.001-.002-.108-.068z"
        fill="#FFD300"
      />
      <Path
        d="M11 6.114a1.029 1.029 0 0 1 .088-.001 3.465 3.465 0 0 1 1.056.201c.637.23 1.4.717 1.909 1.744.435.88.852 1.37 1.284 1.573.422.2.89.14 1.472-.165 1.23-.646 3.157-.741 4.309.769.292.383.605 1.131.714 2.033.11.905.014 1.977-.525 3.004-1.084 2.062-3.925 3.886-10.307 3.886-6.382 0-9.223-1.824-10.307-3.886-.54-1.027-.634-2.1-.525-3.004.109-.902.422-1.65.714-2.033 1.152-1.51 3.079-1.415 4.31-.77.58.305 1.049.365 1.47.166.433-.204.85-.694 1.285-1.573.509-1.027 1.272-1.515 1.909-1.744a3.466 3.466 0 0 1 1.056-.201 1.834 1.834 0 0 1 .087 0z"
        fill="#2A7FF6"
      />
    </Svg>,
  ],
  emailIcon: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect
        x=".667"
        y="1.334"
        width="14.667"
        height="13.333"
        rx="2"
        fill="#2A7FF6"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 9.334a.667.667 0 0 1-.472-.195l-4-4a.667.667 0 1 1 .943-.943L8 7.725l3.528-3.53a.667.667 0 1 1 .943.944l-4 4A.667.667 0 0 1 8 9.334z"
        fill="#fff"
      />
    </Svg>,
  ],

  stampSuccess: [
    <Svg
      width="133"
      height="88"
      viewBox="0 0 133 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M89 85c22.644 0 41-18.356 41-41S111.644 3 89 3 48 21.356 48 44s18.356 41 41 41zm0 2c23.748 0 43-19.252 43-43S112.748 1 89 1 46 20.252 46 44s19.252 43 43 43z"
        fill="url(#ltn5v8648a)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M95.42 33.376a5.908 5.908 0 0 1 6.431-1.843c.352.118.628.394.745.745a5.897 5.897 0 0 1-1.844 6.426l-3.567 2.939-1.686 1.389 3.03 15.186a1.41 1.41 0 0 1-2.61.965L89.577 47.91l-7.318 6.029 1.947 5.065a.698.698 0 0 1-1.233.638l-2.708-4.06-2.534 2.088a.916.916 0 0 1-1.29-1.288l2.09-2.533-4.064-2.707a.698.698 0 0 1 .638-1.233l5.07 1.947 6.033-7.313-11.283-6.338a1.408 1.408 0 0 1 .966-2.609l15.2 3.03 1.389-1.685 2.94-3.565z"
        fill="#2A7FF6"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M88.995 19h.01a25.48 25.48 0 0 1 1.507.045c7.73.461 14.515 4.435 18.778 10.347A24.867 24.867 0 0 1 114 44a24.867 24.867 0 0 1-4.71 14.608c-4.263 5.912-11.048 9.886-18.778 10.347a25.432 25.432 0 0 1-3.024 0c-7.73-.461-14.514-4.435-18.778-10.347A24.866 24.866 0 0 1 64 44a24.866 24.866 0 0 1 4.71-14.608c4.264-5.912 11.048-9.886 18.778-10.347A25.432 25.432 0 0 1 88.995 19zM90 31.7V21.364l.291.303a48.769 48.769 0 0 1 4.346 5.271 42.976 42.976 0 0 1 1.978 3.04 7.922 7.922 0 0 1 1.952-.623 44.65 44.65 0 0 0-2.3-3.576 50.66 50.66 0 0 0-3.6-4.488 22.98 22.98 0 0 1 14.423 8.503c-.948.166-2.11.36-3.415.56.368.353.652.793.818 1.29.064.192.121.386.17.58 1.337-.21 2.5-.41 3.403-.571l.307-.056A22.866 22.866 0 0 1 111.979 43h-9.097a24.683 24.683 0 0 0-.355-3.204c-.16.156-.328.307-.503.451l-1.291 1.063c.07.559.12 1.122.146 1.69h-2.196l-.989.814.237 1.186h2.948c-.119 2.516-.679 4.948-1.504 7.233l.985 4.94a166.615 166.615 0 0 1 6.73 1.033 22.98 22.98 0 0 1-14.424 8.503 50.678 50.678 0 0 0 3.864-4.863 3.396 3.396 0 0 1-1.788-.934l-.105.15A48.769 48.769 0 0 1 90 66.636V56.3a64.14 64.14 0 0 1 2.044.074l-1.154-2.05c-.299-.01-.596-.019-.89-.024v-1.56l-.995-1.768-1.005.829V54.3c-1.042.02-2.117.068-3.202.138l-.155.128.708 1.842A66.56 66.56 0 0 1 88 56.3v10.336a48.948 48.948 0 0 1-4.012-4.718c-1.082 1.082-2.255.303-2.255.303s2.524 3.292 3.6 4.488a22.98 22.98 0 0 1-14.423-8.503c.945-.166 2.103-.36 3.404-.559a2.917 2.917 0 0 1 .265-2.063 168.288 168.288 0 0 0-4.952.819A22.864 22.864 0 0 1 66.02 45h9.097a24.4 24.4 0 0 0 .307 2.924c.134.029.266.068.397.118l1.792.688A22.927 22.927 0 0 1 77.12 45h5.817l-3.56-2H77.12c.019-.408.05-.813.092-1.216l-1.886-1.06A24.102 24.102 0 0 0 75.117 43h-9.097a22.864 22.864 0 0 1 3.606-11.403l.307.056a168.65 168.65 0 0 0 7.715 1.193 34.44 34.44 0 0 0-.418.978l2 .398c.161-.379.328-.753.501-1.122 2.72.31 5.6.55 8.268.6v2.27l2 .398V33.7c.864-.016 1.75-.052 2.647-.104l1.231-1.493c.186-.225.383-.439.589-.639A73.564 73.564 0 0 1 90 31.7zM102.882 45c-.158 3.634-1.156 7.07-2.531 10.154a169.024 169.024 0 0 1 7.715 1.193l.307.056A22.866 22.866 0 0 0 111.979 45h-9.097zM88 31.7c-2.342-.046-4.866-.242-7.304-.505a41.828 41.828 0 0 1 2.667-4.257A48.769 48.769 0 0 1 88 21.364V31.7zm-6.267-5.92a50.66 50.66 0 0 1 3.6-4.49 22.98 22.98 0 0 0-14.423 8.504c1.193.209 2.725.463 4.454.717 1.011.148 2.087.296 3.2.435a43.182 43.182 0 0 1 3.17-5.167z"
        fill="url(#com4wx3fab)"
      />
      <Path
        d="m65 15.626 3.243-2.245a2.648 2.648 0 0 1 1.378-.483c.497-.03.983.06 1.45.292.465.232.86.574 1.175 1.027.375.583.547 1.167.527 1.751a3.329 3.329 0 0 1-.517 1.66l3.81 1.3-1.48 1.016-3.536-1.218-1.45.996 1.734 2.466-1.166.806L65 15.626zm6.222.966c.112-.241.152-.503.132-.775a1.538 1.538 0 0 0-.264-.745 1.467 1.467 0 0 0-.972-.624c-.416-.07-.79 0-1.135.252l-1.946 1.349 1.753 2.496 1.946-1.349c.223-.161.395-.362.506-.604h-.02zM74.505 12.174a4.64 4.64 0 0 1 1.044-2.104 4.32 4.32 0 0 1 1.946-1.288 4.305 4.305 0 0 1 2.34-.1c.79.18 1.49.543 2.098 1.086a4.498 4.498 0 0 1 1.297 1.983c.264.785.304 1.58.132 2.375a4.607 4.607 0 0 1-1.054 2.104 4.408 4.408 0 0 1-1.956 1.288c-.77.252-1.55.282-2.34.101a4.747 4.747 0 0 1-2.098-1.077 4.473 4.473 0 0 1-1.297-1.993 4.476 4.476 0 0 1-.132-2.365l.02-.01zm6.729 3.08c.365-.413.608-.886.72-1.43a3.19 3.19 0 0 0-.092-1.63 3.073 3.073 0 0 0-.892-1.359 3.131 3.131 0 0 0-1.428-.735 3.008 3.008 0 0 0-1.581.07 2.874 2.874 0 0 0-1.318.866 3.143 3.143 0 0 0-.72 1.43c-.12.543-.08 1.077.092 1.62.182.544.476.996.892 1.369.415.372.892.614 1.429.735a2.97 2.97 0 0 0 2.888-.936h.01zM89.534 10.976l3.557 5.123-1.824-.03-2.757-3.986-1.61 1.751-.031 2.164-1.47-.02L85.541 7l1.47.02-.071 4.67 4.246-4.61 1.986.03-3.638 3.866zM102.15 10.744l-4.56-1.308-.618 2.133 4.185 1.198-.405 1.38-4.186-1.199-.689 2.366 4.56 1.308-.395 1.38-5.948-1.702 2.503-8.626 5.948 1.701-.395 1.37zM105.941 10.875l3.445 2.094a2.454 2.454 0 0 1 1.196 2.143c0 .433-.122.836-.365 1.228-.385.624-.973.987-1.753 1.087.172.373.233.785.213 1.218-.02.433-.162.856-.406 1.248a2.435 2.435 0 0 1-.942.896 2.602 2.602 0 0 1-1.246.312c-.436 0-.852-.12-1.237-.362l-3.617-2.204 4.732-7.66h-.02zm-2.665 7.116 2.188 1.329c.274.17.568.221.872.15.304-.07.537-.24.709-.513a1.19 1.19 0 0 0 .173-.916 1.125 1.125 0 0 0-.507-.734l-2.189-1.329-1.246 2.013zm2.006-3.24 2.108 1.277c.273.151.557.192.841.131.284-.06.497-.221.659-.483.172-.272.212-.564.142-.856a1.112 1.112 0 0 0-.527-.694l-2.058-1.248-1.155 1.872h-.01zM115 17.407 108.849 24l-1.075-.986 6.152-6.593 1.074.986zM45.919 51.026c-3.62.964-5.73.393-7.782-.173-2.028-.55-3.94-1.065-7.333-.161-3.393.904-4.793 2.302-6.276 3.787-1.498 1.5-3.04 3.056-6.659 4.02-3.62.965-5.73.393-7.782-.172-2.028-.55-3.94-1.065-7.333-.161-.253.067-.512-.104-.588-.389-.077-.285.062-.562.316-.629 3.62-.964 5.73-.393 7.782.172 2.027.55 3.94 1.066 7.332.162 3.394-.904 4.793-2.302 6.276-3.788 1.499-1.5 3.04-3.055 6.66-4.02 3.62-.964 5.73-.393 7.782.173 2.028.55 3.94 1.065 7.333.161 3.393-.904 4.793-2.302 6.276-3.787 1.498-1.5 3.04-3.056 6.659-4.02.253-.068.512.103.588.388.077.285-.062.562-.316.63-3.393.903-4.793 2.301-6.276 3.786-1.498 1.5-3.04 3.056-6.659 4.02z"
        fill="#2A7FF6"
      />
      <Path
        d="M47.276 56.115c-3.62.965-5.731.393-7.782-.172-2.028-.55-3.94-1.065-7.333-.161-3.394.904-4.793 2.302-6.276 3.787-1.498 1.5-3.04 3.056-6.66 4.02-3.619.965-5.73.393-7.781-.172-2.028-.55-3.94-1.066-7.333-.162-.254.068-.513-.103-.589-.388-.076-.285.063-.562.316-.63 3.62-.964 5.73-.392 7.782.173 2.028.55 3.94 1.066 7.333.162 3.393-.905 4.793-2.302 6.276-3.788 1.498-1.5 3.04-3.055 6.66-4.02 3.619-.964 5.73-.393 7.781.173 2.028.55 3.94 1.065 7.333.16 3.393-.903 4.793-2.3 6.276-3.786 1.498-1.5 3.04-3.056 6.66-4.02.253-.068.512.103.588.388.076.285-.063.562-.316.63-3.393.903-4.793 2.301-6.276 3.786-1.498 1.5-3.04 3.056-6.66 4.02z"
        fill="#2A7FF6"
      />
      <Path
        d="M48.63 61.205c-3.618.965-5.73.393-7.78-.172-2.029-.55-3.94-1.065-7.334-.161-3.393.904-4.793 2.301-6.276 3.787-1.498 1.5-3.04 3.056-6.66 4.02-3.618.964-5.73.393-7.781-.172-2.028-.55-3.94-1.066-7.333-.162-.253.068-.512-.103-.589-.388-.076-.285.063-.562.317-.63 3.619-.964 5.73-.392 7.782.173 2.027.55 3.94 1.065 7.332.161 3.394-.904 4.793-2.302 6.276-3.787 1.499-1.5 3.04-3.056 6.66-4.02 3.62-.964 5.73-.393 7.782.172 2.027.55 3.94 1.066 7.332.162 3.394-.904 4.793-2.302 6.276-3.787 1.499-1.5 3.04-3.056 6.66-4.02.253-.068.512.103.588.388.077.285-.062.562-.316.63-3.393.903-4.793 2.3-6.276 3.786-1.498 1.5-3.04 3.056-6.66 4.02z"
        fill="#2A7FF6"
      />
      <Path
        d="M49.987 66.295c-3.619.964-5.73.393-7.782-.173-2.027-.55-3.94-1.065-7.332-.161-3.394.904-4.793 2.302-6.276 3.787-1.499 1.5-3.04 3.056-6.66 4.02-3.619.965-5.73.393-7.782-.172-2.027-.55-3.94-1.065-7.332-.161-.254.067-.513-.104-.59-.389-.075-.285.064-.561.317-.629 3.62-.964 5.73-.393 7.782.172 2.028.55 3.94 1.066 7.333.162 3.393-.904 4.793-2.302 6.276-3.787 1.498-1.5 3.04-3.056 6.66-4.02 3.618-.965 5.73-.394 7.781.172 2.028.55 3.94 1.065 7.333.161 3.393-.904 4.793-2.302 6.276-3.787 1.498-1.5 3.04-3.056 6.66-4.02.253-.068.512.103.588.388.076.285-.063.562-.316.63-3.394.904-4.793 2.301-6.276 3.787-1.498 1.5-3.04 3.055-6.66 4.02z"
        fill="#2A7FF6"
      />
      <Defs>
        <LinearGradient
          id="ltn5v8648a"
          x1="123.378"
          y1="105.875"
          x2="67.211"
          y2="7.098"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#DAEEFF" />
          <Stop offset=".646" stopColor="#2A7FF6" />
        </LinearGradient>
        <LinearGradient
          id="com4wx3fab"
          x1="108.987"
          y1="79.974"
          x2="76.332"
          y2="22.545"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#DAEEFF" />
          <Stop offset=".646" stopColor="#2A7FF6" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],

  stampFail: [
    <Svg
      width="133"
      height="88"
      viewBox="0 0 133 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M83.137 2.933a9 9 0 0 1 9.724 0l5.473 3.513a6.999 6.999 0 0 0 3.378 1.097l6.493.375a9 9 0 0 1 7.866 5.715l2.363 6.06a6.993 6.993 0 0 0 2.088 2.873l5.032 4.12a9 9 0 0 1 3.005 9.247l-1.65 6.29a6.987 6.987 0 0 0 0 3.553l1.65 6.29a9 9 0 0 1-3.005 9.248l-5.032 4.12a6.992 6.992 0 0 0-2.088 2.873l-2.363 6.06a9 9 0 0 1-7.866 5.715l-6.493.374a6.999 6.999 0 0 0-3.378 1.098l-5.473 3.513a9 9 0 0 1-9.724 0l-5.472-3.513a7 7 0 0 0-3.379-1.098l-6.492-.374a9 9 0 0 1-7.867-5.716l-2.362-6.059a7 7 0 0 0-2.088-2.873l-5.033-4.12a9 9 0 0 1-3.005-9.248l1.65-6.29a7 7 0 0 0 0-3.552l-1.65-6.29a9 9 0 0 1 3.005-9.248l5.033-4.12a7 7 0 0 0 2.088-2.873l2.362-6.06a9 9 0 0 1 7.867-5.715l6.492-.375a7 7 0 0 0 3.379-1.097l5.472-3.513zm8.644 1.683a7 7 0 0 0-7.563 0l-5.473 3.513A9 9 0 0 1 74.4 9.54l-6.492.375a7 7 0 0 0-6.119 4.445l-2.362 6.059a9 9 0 0 1-2.685 3.695l-5.032 4.12a7 7 0 0 0-2.337 7.192l1.65 6.29a9 9 0 0 1 0 4.567l-1.65 6.29a7 7 0 0 0 2.337 7.194l5.032 4.119a9 9 0 0 1 2.685 3.695l2.362 6.059a7 7 0 0 0 6.119 4.445l6.492.375a9 9 0 0 1 4.344 1.411l5.473 3.513a7 7 0 0 0 7.563 0l5.472-3.513a9 9 0 0 1 4.344-1.411l6.492-.375a7 7 0 0 0 6.119-4.445l2.362-6.06a9.005 9.005 0 0 1 2.685-3.694l5.032-4.12a6.999 6.999 0 0 0 2.337-7.192l-1.65-6.29a9.015 9.015 0 0 1 0-4.568l1.65-6.29a6.999 6.999 0 0 0-2.337-7.193l-5.032-4.12a9.004 9.004 0 0 1-2.685-3.694l-2.362-6.059a7 7 0 0 0-6.119-4.445l-6.492-.375a9.001 9.001 0 0 1-4.344-1.411l-5.472-3.513z"
        fill="url(#gvx7pw6cma)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M92.32 9.164a8 8 0 0 0-8.644 0l-4.023 2.583a8.002 8.002 0 0 1-3.861 1.255l-4.774.275a8 8 0 0 0-6.992 5.08l-1.737 4.455a8 8 0 0 1-2.386 3.284l-3.7 3.029a8 8 0 0 0-2.671 8.22l1.213 4.625a8 8 0 0 1 0 4.06l-1.213 4.625a8 8 0 0 0 2.67 8.22l3.7 3.029a7.999 7.999 0 0 1 2.387 3.284l1.737 4.455a8 8 0 0 0 6.992 5.08l4.774.276a8 8 0 0 1 3.86 1.254l4.024 2.583a8 8 0 0 0 8.644 0l4.023-2.583a8 8 0 0 1 3.861-1.254l4.774-.276a8 8 0 0 0 6.992-5.08l1.737-4.455a8.006 8.006 0 0 1 2.386-3.284l3.7-3.029a7.999 7.999 0 0 0 2.671-8.22l-1.213-4.625a8 8 0 0 1 0-4.06l1.213-4.625a7.999 7.999 0 0 0-2.671-8.22l-3.7-3.029a8.007 8.007 0 0 1-2.386-3.284l-1.737-4.454a8 8 0 0 0-6.992-5.08l-4.774-.276a8.001 8.001 0 0 1-3.86-1.255L92.32 9.164zm-4.322 65.449c16.907 0 30.613-13.706 30.613-30.613s-13.706-30.613-30.613-30.613S57.385 27.093 57.385 44s13.706 30.613 30.613 30.613z"
        fill="url(#4yl8t38w0b)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M88 64c11.598 0 21-9.402 21-21s-9.402-21-21-21-21 9.402-21 21 9.402 21 21 21zm0 2c12.703 0 23-10.297 23-23s-10.297-23-23-23-23 10.297-23 23 10.297 23 23 23z"
        fill="url(#b0cvdt3qnc)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M82.73 38.256a1.026 1.026 0 0 0-1.778-1.026l-2.224 3.85-3.852-2.224a1.026 1.026 0 1 0-1.026 1.777l3.852 2.225-2.224 3.852a1.026 1.026 0 0 0 1.778 1.027l2.224-3.853 3.85 2.223a1.026 1.026 0 1 0 1.027-1.777l-3.85-2.224 2.222-3.85zM99.15 33.856a1.026 1.026 0 0 0-1.779-1.026l-2.222 3.85-3.853-2.224a1.026 1.026 0 1 0-1.026 1.778l3.852 2.224-2.224 3.852a1.026 1.026 0 0 0 1.777 1.027l2.225-3.853 3.85 2.223a1.027 1.027 0 0 0 1.027-1.777l-3.85-2.224 2.222-3.85zM83.943 55.162c-.143-.534.143-1.074.639-1.206l10.763-2.885c.495-.132 1.013.193 1.155.726.143.534-.142 1.074-.638 1.206L85.1 55.887c-.495.133-1.013-.192-1.156-.725z"
        fill="#EE4423"
      />
      <Path
        d="M9.234 8.724a.75.75 0 0 1 .918-.53L47.34 18.16a.75.75 0 0 1-.388 1.449L9.764 9.643a.75.75 0 0 1-.53-.919zM4.267 15.675a.75.75 0 0 1 .918-.53l35.257 9.447a.75.75 0 0 1-.388 1.449L4.796 16.594a.75.75 0 0 1-.53-.919zM2.195 23.403a.75.75 0 0 1 .918-.53l35.256 9.446a.75.75 0 1 1-.388 1.449L2.725 24.321a.75.75 0 0 1-.53-.918zM3.023 31.907a.75.75 0 0 1 .918-.53L41.13 41.34a.75.75 0 0 1-.388 1.449L3.553 32.825a.75.75 0 0 1-.53-.918z"
        fill="#EE4423"
      />
      <Defs>
        <LinearGradient
          id="gvx7pw6cma"
          x1="122.377"
          y1="105.874"
          x2="66.21"
          y2="7.098"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFDAD2" />
          <Stop offset=".646" stopColor="#EE4423" />
        </LinearGradient>
        <LinearGradient
          id="4yl8t38w0b"
          x1="65.779"
          y1="13.547"
          x2="109.255"
          y2="83.647"
          gradientUnits="userSpaceOnUse">
          <Stop offset=".506" stopColor="#EE4423" />
          <Stop offset="1" stopColor="#FFDAD2" />
        </LinearGradient>
        <LinearGradient
          id="b0cvdt3qnc"
          x1="106.388"
          y1="76.096"
          x2="76.345"
          y2="23.262"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFDAD2" />
          <Stop offset=".646" stopColor="#EE4423" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
  scrollRightArrow: [
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m10 3 4 5-4 5M6 3l4 5-4 5M2 3l4 5-4 5"
        stroke="url(#my9n6t4ika)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs>
        <LinearGradient
          id="my9n6t4ika"
          x1="15"
          y1="8"
          x2="1.5"
          y2="8"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2C2C2C" />
          <Stop offset="1" stopColor="#D8D8D8" />
        </LinearGradient>
      </Defs>
    </Svg>,
  ],
};

export default pressIcons;
