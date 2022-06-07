import React from 'react';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Mask,
  Path,
  Rect,
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
};

export default pressIcons;
