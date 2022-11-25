import React from 'react';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  LinearGradient,
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
};

export default pressIcons;
