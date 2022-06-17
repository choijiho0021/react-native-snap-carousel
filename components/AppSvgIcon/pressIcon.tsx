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
        fill-rule="evenodd"
        clip-rule="evenodd"
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
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M5 19a4 4 0 0 1 0-8v8zM19 19a4 4 0 0 0 0-8v8z"
        stroke="#2C2C2C"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <Mask id="tmfbrruh2a" fill="#fff">
        <Path d="M3 11.039V9.503c0-4.655 4.03-8.429 9-8.429s9 3.774 9 8.429v1.571" />
      </Mask>
      <Path
        d="M5 11.039V9.503H1V11.039h4zm0-1.536c0-3.429 3.008-6.429 7-6.429v-4C6.05-.926 1 3.622 1 9.503h4zm7-6.429c3.992 0 7 3 7 6.429h4C23 3.622 17.95-.926 12-.926v4zm7 6.429V11.074h4V9.503h-4z"
        fill="#2C2C2C"
        mask="url(#tmfbrruh2a)"
      />
      <Path
        d="M20 19v4h-7"
        stroke="#2C2C2C"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
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
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M37.779 22.24a2.221 2.221 0 0 0 0-4.442h-2.221v-3.621h2.22a2.221 2.221 0 0 0 0-4.443H35.5a5.928 5.928 0 0 0-5.37-5.099V2.221a2.221 2.221 0 0 0-4.442 0v2.385H21.99V2.221a2.221 2.221 0 0 0-4.442 0v2.385h-3.699V2.221a2.221 2.221 0 0 0-4.442 0v2.482A5.923 5.923 0 0 0 4.53 9.734H2.221a2.221 2.221 0 0 0 0 4.443h2.221v3.621h-2.22a2.221 2.221 0 0 0 0 4.443h2.22v3.62h-2.22a2.221 2.221 0 0 0 0 4.443H4.5a5.923 5.923 0 0 0 4.877 5.032v2.433a2.221 2.221 0 0 0 4.442 0v-2.346h3.7v2.346a2.221 2.221 0 0 0 4.441 0v-2.346h3.7v2.346a2.221 2.221 0 0 0 4.441 0v-2.366a5.928 5.928 0 0 0 5.37-5.099h2.279a2.221 2.221 0 0 0 0-4.442h-2.221V22.24h2.25z"
        fill="#2A7FF6"
      />
      <Path
        d="M20 26.837c5.852 0 7.069-1.989 7.069-1.989C26.335 13.665 20 11.028 20 11.028s-6.335 2.637-7.07 13.82c0 0 1.218 1.99 7.07 1.99z"
        fill="#FFD300"
      />
      <Path
        d="M20 28.972c12.419 0 10.845-7.012 9.773-8.402-1.072-1.39-2.878-1.314-4.046-.705-1.169.608-2.01.3-2.859-1.41C21.912 16.543 20 16.649 20 16.649s-1.912-.106-2.868 1.806c-.86 1.71-1.69 2.018-2.859 1.41-1.168-.609-2.974-.686-4.046.705C9.145 21.96 7.58 28.972 20 28.972z"
        fill="#fff"
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.646 12.354a.5.5 0 0 0 .708-.708L1.707 8H13a.5.5 0 0 0 0-1H1.707l3.647-3.646a.5.5 0 1 0-.708-.708l-4.5 4.5a.5.5 0 0 0 0 .708l4.5 4.5z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
};

export default pressIcons;
