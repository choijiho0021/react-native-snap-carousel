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
  btnHome: [
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.36 1.263a1 1 0 0 1 1.28 0l9 6.5a1 1 0 0 1 .36.769V19a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-4a2 2 0 1 0-4 0v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V8.532a1 1 0 0 1 .36-.769l9-6.5z"
        fill="#2A7FF6"
      />
    </Svg>,
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.36 1.264a1 1 0 0 1 1.28 0l9 6.5a1 1 0 0 1 .36.768V19a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-4a2 2 0 1 0-4 0v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V8.532a1 1 0 0 1 .36-.768l9-6.5zM3 9v9h4v-3a4 4 0 0 1 8 0v3h4V9l-8-5.667L3 9z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  btnCart: [
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.402 2.5H1v-2h3.224a1 1 0 0 1 .98.806L5.737 3.5h14.247a1 1 0 0 1 .927 1.375l-3.635 9.5a1 1 0 0 1-.927.625h-9.67a1 1 0 0 1-.98-.806L3.401 2.5zM8 19.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM15 19.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
        fill="#2A7FF6"
      />
    </Svg>,
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.402 2.5H1v-2h3.224a1 1 0 0 1 .98.806L5.737 3.5h14.247a1 1 0 0 1 .927 1.375l-3.635 9.5a1 1 0 0 1-.927.625h-9.67a1 1 0 0 1-.98-.806L3.401 2.5zm2.73 3L7.5 13h8.174L18.5 5.5H6.131zM8 19.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM15 19.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  btnEsim: [
    <Svg
      width="23"
      height="22"
      viewBox="0 0 23 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#vcqj0cdkma)" fill="#2A7FF6">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M2.5 5.375A3.375 3.375 0 0 1 5.875 2h11.25A3.375 3.375 0 0 1 20.5 5.375v11.25A3.375 3.375 0 0 1 17.125 20H5.875A3.375 3.375 0 0 1 2.5 16.625V5.375zm7.964 1.761c-1.51.405-2.367 1.306-2.744 2.342-.352.97-.247 1.948-.084 2.557.226.845.814 2.159 2.232 2.728 1.387.557 3.192.251 5.495-1.146a.247.247 0 0 0 .08-.343l-.797-1.27a.253.253 0 0 0-.346-.082c-2.065 1.248-3.163 1.196-3.687.985a1.476 1.476 0 0 1-.61-.47l4.653-1.247a1 1 0 0 0 .707-1.225c-.163-.61-.561-1.51-1.351-2.173-.844-.708-2.037-1.06-3.548-.656zm2.504 2.435-3.454.926c.018-.114.046-.226.086-.335.145-.399.477-.851 1.382-1.094.905-.242 1.42-.016 1.744.256.089.075.17.158.242.247z"
        />
        <Rect x="6.5" width="2" height="4" rx=".5" />
        <Rect x="10.5" width="2" height="4" rx=".5" />
        <Rect x="14.5" width="2" height="4" rx=".5" />
        <Rect
          x="22.5"
          y="6"
          width="2"
          height="4"
          rx=".5"
          transform="rotate(90 22.5 6)"
        />
        <Rect
          x="4.5"
          y="6"
          width="2"
          height="4"
          rx=".5"
          transform="rotate(90 4.5 6)"
        />
        <Rect
          x="22.5"
          y="10"
          width="2"
          height="4"
          rx=".5"
          transform="rotate(90 22.5 10)"
        />
        <Rect
          x="4.5"
          y="10"
          width="2"
          height="4"
          rx=".5"
          transform="rotate(90 4.5 10)"
        />
        <Rect
          x="22.5"
          y="14"
          width="2"
          height="4"
          rx=".5"
          transform="rotate(90 22.5 14)"
        />
        <Rect
          x="4.5"
          y="14"
          width="2"
          height="4"
          rx=".5"
          transform="rotate(90 4.5 14)"
        />
        <Rect
          x="16.5"
          y="22"
          width="2"
          height="4"
          rx=".5"
          transform="rotate(-180 16.5 22)"
        />
        <Rect
          x="12.5"
          y="22"
          width="2"
          height="4"
          rx=".5"
          transform="rotate(-180 12.5 22)"
        />
        <Rect
          x="8.5"
          y="22"
          width="2"
          height="4"
          rx=".5"
          transform="rotate(-180 8.5 22)"
        />
      </G>
      <Defs>
        <ClipPath id="vcqj0cdkma">
          <Path fill="#fff" transform="translate(.5)" d="M0 0h22v22H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 5C2 3.34315 3.34315 2 5 2H17C18.6569 2 20 3.34315 20 5V17C20 18.6569 18.6569 20 17 20H5C3.34315 20 2 18.6569 2 17V5ZM5 4C4.44772 4 4 4.44772 4 5V17C4 17.5523 4.44772 18 5 18H17C17.5523 18 18 17.5523 18 17V5C18 4.44772 17.5523 4 17 4H5Z"
        fill="#2C2C2C"
      />
      <Rect x="6" width="2" height="3" rx="0.5" fill="#2C2C2C" />
      <Rect x="10" width="2" height="3" rx="0.5" fill="#2C2C2C" />
      <Rect x="14" width="2" height="3" rx="0.5" fill="#2C2C2C" />
      <Rect
        x="22"
        y="6"
        width="2"
        height="3"
        rx="0.5"
        transform="rotate(90 22 6)"
        fill="#2C2C2C"
      />
      <Rect
        x="3"
        y="6"
        width="2"
        height="3"
        rx="0.5"
        transform="rotate(90 3 6)"
        fill="#2C2C2C"
      />
      <Rect
        x="22"
        y="10"
        width="2"
        height="3"
        rx="0.5"
        transform="rotate(90 22 10)"
        fill="#2C2C2C"
      />
      <Rect
        x="3"
        y="10"
        width="2"
        height="3"
        rx="0.5"
        transform="rotate(90 3 10)"
        fill="#2C2C2C"
      />
      <Rect
        x="22"
        y="14"
        width="2"
        height="3"
        rx="0.5"
        transform="rotate(90 22 14)"
        fill="#2C2C2C"
      />
      <Rect
        x="3"
        y="14"
        width="2"
        height="3"
        rx="0.5"
        transform="rotate(90 3 14)"
        fill="#2C2C2C"
      />
      <Rect
        x="16"
        y="22"
        width="2"
        height="3"
        rx="0.5"
        transform="rotate(-180 16 22)"
        fill="#2C2C2C"
      />
      <Rect
        x="12"
        y="22"
        width="2"
        height="3"
        rx="0.5"
        transform="rotate(-180 12 22)"
        fill="#2C2C2C"
      />
      <Rect
        x="8"
        y="22"
        width="2"
        height="3"
        rx="0.5"
        transform="rotate(-180 8 22)"
        fill="#2C2C2C"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.22023 9.47793C7.597 8.44233 8.45438 7.54097 9.96443 7.13635C11.4745 6.73174 12.6677 7.08365 13.5118 7.79212C14.3018 8.45526 14.7001 9.35525 14.8634 9.96478C15.0063 10.4982 14.6898 11.0466 14.1563 11.1895L9.5035 12.4362C9.66587 12.6428 9.86742 12.8084 10.113 12.907C10.6376 13.1176 11.7348 13.1702 13.8 11.9225C13.9182 11.8511 14.0726 11.8861 14.1459 12.0031L14.9431 13.2737C15.0165 13.3907 14.9811 13.5453 14.8631 13.6169C12.5597 15.0141 10.7554 15.3199 9.36805 14.7631C7.94957 14.1937 7.36227 12.8798 7.136 12.0353C6.97268 11.4258 6.86758 10.4473 7.22023 9.47793ZM9.01354 10.497L12.4682 9.57129C12.3955 9.48225 12.3148 9.39856 12.226 9.32403C11.9013 9.05156 11.3868 8.82577 10.4821 9.06821C9.5773 9.31064 9.24461 9.76344 9.09971 10.1617C9.06008 10.2707 9.03203 10.3835 9.01354 10.497Z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  btnCall: [
    <Svg
      width="23"
      height="22"
      viewBox="0 0 23 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#nyvs57zf7a)">
        <Path
          d="M8.162 2.056c-.375-.424-.852-.738-1.422-.814-.539-.072-1.124.04-1.614.464l-.248.213c-.505.432-1.073.92-1.563 1.475-1.006 1.14-1.34 2.495-1.17 3.894.16 1.31.663 2.456 1.236 3.476.31.55.914 1.308 1.61 2.103a56.24 56.24 0 0 0 2.47 2.62 56.316 56.316 0 0 0 2.62 2.47c.795.696 1.552 1.3 2.104 1.61 1.02.574 2.165 1.077 3.475 1.236 1.399.17 2.754-.163 3.894-1.17.558-.492 1.046-1.061 1.48-1.567l.21-.244c.423-.49.535-1.075.462-1.614-.092-.69-.49-1.134-.813-1.42l-3.008-2.695c-.95-.884-2.32-.694-3.12.188l-.614.673-.758.832c-.993-.787-1.558-1.274-2.257-1.973a23.8 23.8 0 0 1-1.973-2.257l1.019-.93.486-.442c.882-.801 1.071-2.17.188-3.12-.79-.85-1.559-1.721-2.337-2.603l-.357-.405z"
          fill="#2A7FF6"
        />
      </G>
      <Defs>
        <ClipPath id="nyvs57zf7a">
          <Path fill="#fff" transform="translate(.9)" d="M0 0h22v22H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
    <Svg
      width="23"
      height="22"
      viewBox="0 0 23 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#x0k97bxgfa)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.885 12.094c-.95-.884-2.32-.694-3.12.188-.445.49-.918 1.004-1.372 1.505-.993-.787-1.558-1.274-2.257-1.973a23.809 23.809 0 0 1-1.973-2.258l1.505-1.371c.882-.801 1.071-2.17.188-3.12-.917-.986-1.804-1.999-2.695-3.008-.374-.424-.851-.738-1.421-.814-.539-.072-1.124.04-1.614.464-.56.483-1.238 1.039-1.811 1.688-1.006 1.14-1.34 2.495-1.17 3.894.16 1.31.663 2.456 1.236 3.476.31.55.914 1.308 1.61 2.103a56.295 56.295 0 0 0 2.47 2.62 56.298 56.298 0 0 0 2.62 2.47c.795.696 1.552 1.3 2.104 1.61 1.02.574 2.164 1.077 3.475 1.236 1.399.17 2.754-.163 3.894-1.17.65-.573 1.204-1.25 1.69-1.81.423-.49.534-1.076.462-1.615-.092-.69-.49-1.134-.814-1.42l-3.007-2.695zM9.43 6.514 6.474 3.224S5.3 4.17 4.814 4.718c-.586.665-.792 1.432-.684 2.33.116.946.485 1.83.994 2.736.198.352.676.972 1.372 1.766.678.775 1.514 1.66 2.379 2.524.864.865 1.75 1.7 2.524 2.38.794.695 1.414 1.173 1.766 1.37.906.51 1.79.88 2.736.995.898.109 1.666-.098 2.33-.684.225-.2 1.49-1.678 1.49-1.678l-3.252-2.936s-1.083 1.048-1.597 1.613a2 2 0 0 1-2.72.22c-1.03-.814-1.658-1.353-2.43-2.126a25.788 25.788 0 0 1-2.135-2.44 2 2 0 0 1 .229-2.71A45.218 45.218 0 0 0 9.43 6.514z"
          fill="#2C2C2C"
        />
      </G>
      <Defs>
        <ClipPath id="x0k97bxgfa">
          <Path fill="#fff" transform="translate(.9)" d="M0 0h22v22H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  btnMypage: [
    <Svg
      width="23"
      height="22"
      viewBox="0 0 23 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.8 6.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0zM2.3 20.115C2.3 15.608 6.233 12 10.947 12h.706c4.714 0 8.647 3.608 8.647 8.115a.894.894 0 0 1-.902.885H3.202a.894.894 0 0 1-.902-.885z"
        fill="#2A7FF6"
      />
    </Svg>,
    <Svg
      width="23"
      height="22"
      viewBox="0 0 23 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.3 3.957a2.544 2.544 0 1 0 .001 5.087 2.544 2.544 0 0 0-.001-5.087zM6.8 6.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0zM2.3 20.115C2.3 15.608 6.233 12 10.947 12h.706c4.714 0 8.647 3.608 8.647 8.115a.894.894 0 0 1-.902.885H3.202a.894.894 0 0 1-.902-.885zM4.3 19h14c-.467-3.042-3.173-5-6.647-5h-.706c-3.474 0-6.18 1.958-6.647 5z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  btnCheck3: [
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="22" height="22" rx="3" fill="#2A7FF6" />
      <Path
        d="m6 10 3.913 5L16 7"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect
        x=".5"
        y=".5"
        width="21"
        height="21"
        rx="2.5"
        fill="#fff"
        stroke="#D8D8D8"
      />
      <Path
        d="m6 10 3.913 5L16 7"
        stroke="#D8D8D8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  btnCheck2: [
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22">
      <G fill="none">
        <Rect width="22" height="22" fill="#2A7FF6" rx="3" />
        <Path stroke="#FFF" strokeLinecap="round" d="M5 10.5L9.696 15 17 8" />
      </G>
    </Svg>,
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22">
      <G fill="none" stroke="#D8D8D8">
        <Rect width="21" height="21" fill="#FFFFFF" x=".5" y=".5" rx="3" />
        <Path strokeLinecap="round" d="M5 10.5L9.696 15 17 8" />
      </G>
    </Svg>,
  ],
  btnCheck: [
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="11" cy="11" r="11" fill="#2A7FF6" />
      <Path
        d="m6 10 3.913 5L16 7"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="11" cy="11" r="10.5" fill="#fff" stroke="#D8D8D8" />
    </Svg>,
  ],
  btnRadio: [
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="11" cy="11" r="11" fill="#2A7FF6" />
      <Circle cx="11" cy="11" r="5" fill="#fff" />
    </Svg>,
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx="11" cy="11" r="10.5" fill="#fff" stroke="#D8D8D8" />
      <Circle cx="11" cy="11" r="5" fill="#F5F5F5" />
    </Svg>,
  ],
  dropDownToggle: [
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10.564 12.76a.784.784 0 0 1-1.128 0L5.16 8.037C4.78 7.62 5.118 7 5.724 7h8.552c.606 0 .943.62.564 1.037l-4.276 4.723z"
        fill="#2C2C2C"
      />
    </Svg>,
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10.564 12.76a.784.784 0 0 1-1.128 0L5.16 8.037C4.78 7.62 5.118 7 5.724 7h8.552c.606 0 .943.62.564 1.037l-4.276 4.723z"
        fill="#AAA"
      />
    </Svg>,
  ],
  policyCheck: [
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m6 10 3.913 5L16 7"
        stroke="#2A7FF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="m6 10 3.913 5L16 7"
        stroke="#D8D8D8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  checkBox: [
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="22" height="22" rx="3" fill="#2A7FF6" />
      <Path
        d="m6 10 3.913 5L16 7"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="22" height="22" rx="3" fill="#D8D8D8" />
      <Path
        d="m6 10 3.913 5L16 7"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  btnStar: [
    <Svg
      width="41"
      height="38"
      viewBox="0 0 41 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#hv85usvfga)">
        <Path
          d="M19.547.59a1.064 1.064 0 0 1 1.906 0l5.357 10.813c.155.313.454.53.8.58l11.98 1.733c.87.126 1.219 1.193.588 1.806l-8.668 8.417c-.25.243-.365.593-.306.936l2.047 11.885c.148.865-.763 1.524-1.542 1.116l-10.715-5.611a1.066 1.066 0 0 0-.988 0L9.29 37.876c-.78.408-1.69-.251-1.541-1.116l2.046-11.885a1.056 1.056 0 0 0-.306-.936L.822 15.522c-.63-.613-.283-1.68.589-1.806l11.979-1.734c.346-.05.645-.266.8-.579L19.547.59z"
          fill="#FFC82D"
        />
      </G>
      <Defs>
        <ClipPath id="hv85usvfga">
          <Path fill="#fff" transform="translate(.5)" d="M0 0h40v38H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
    <Svg
      width="41"
      height="38"
      viewBox="0 0 41 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#f9pigu8hsa)">
        <Path
          d="M19.547.59a1.064 1.064 0 0 1 1.906 0l5.357 10.813c.155.313.454.53.8.58l11.98 1.733c.87.126 1.219 1.193.588 1.806l-8.668 8.417c-.25.243-.365.593-.306.936l2.047 11.885c.148.865-.763 1.524-1.542 1.116l-10.715-5.611a1.066 1.066 0 0 0-.988 0L9.29 37.876c-.78.408-1.69-.251-1.541-1.116l2.046-11.885a1.056 1.056 0 0 0-.306-.936L.822 15.522c-.63-.613-.283-1.68.589-1.806l11.979-1.734c.346-.05.645-.266.8-.579L19.547.59z"
          fill="#D8D8D8"
        />
      </G>
      <Defs>
        <ClipPath id="f9pigu8hsa">
          <Path fill="#fff" transform="translate(.5)" d="M0 0h40v38H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  mute: [
    <Svg
      width="68"
      height="68"
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="68" height="68" rx="34" fill="#2A7FF6" />
      <Mask
        id="aydmyfjsxa"
        style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="19"
        y="19"
        width="30"
        height="30">
        <Path
          d="M40.923 27.075a6.923 6.923 0 1 0-13.846 0v3.462a6.92 6.92 0 0 0 3.461 5.997M34 42.075c1.515 0 3.016-.268 4.416-.79a11.697 11.697 0 0 0 3.743-2.251 10.387 10.387 0 0 0 2.501-3.37 9.49 9.49 0 0 0 .878-3.973M34 42.075v5.77m0-5.77c-.58 0-1.16-.039-1.73-.117M34 47.845h-6.923m6.923 0h6.923M22.461 31.69c0 1.363.299 2.714.879 3.974.58 1.26 1.43 2.404 2.501 3.369.387.348.8.67 1.236.965m20.77-19.847L20.153 47.845"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Mask>
      <G mask="url(#aydmyfjsxa)">
        <Path fill="#fff" d="M19 19h30v30H19z" />
      </G>
    </Svg>,
    <Svg
      width="68"
      height="68"
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="68" height="68" rx="34" fill="#fff" />
      <G clipPath="url(#4nlph3n1ta)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25.923 27.077a8.077 8.077 0 0 1 15.786-2.418l5.321-5.321a1.154 1.154 0 1 1 1.632 1.632L20.97 48.662a1.154 1.154 0 1 1-1.632-1.632l6.5-6.5a12.332 12.332 0 0 1-.769-.637 11.54 11.54 0 0 1-2.777-3.744 10.644 10.644 0 0 1-.984-4.457 1.154 1.154 0 0 1 2.307 0c0 1.195.262 2.38.773 3.492a9.232 9.232 0 0 0 2.225 2.994c.277.249.569.483.875.702l1.79-1.789a8.067 8.067 0 0 1-3.355-6.553v-3.461zm5.016 8.353 8.812-8.813a5.77 5.77 0 0 0-11.52.46v3.461c0 2.06 1.079 3.87 2.708 4.892zm14.6-4.892c.637 0 1.153.517 1.153 1.154 0 1.533-.335 3.048-.984 4.457a11.54 11.54 0 0 1-2.777 3.744 12.854 12.854 0 0 1-4.112 2.475 13.75 13.75 0 0 1-3.665.815v3.51h5.77a1.154 1.154 0 0 1 0 2.307H27.076a1.154 1.154 0 0 1 0-2.308h5.77v-3.509c-.246-.02-.49-.047-.734-.08a1.154 1.154 0 0 1 .312-2.287c.52.071 1.047.107 1.575.107 1.38 0 2.743-.245 4.013-.718a10.545 10.545 0 0 0 3.374-2.027 9.232 9.232 0 0 0 2.225-2.994 8.338 8.338 0 0 0 .773-3.492c0-.637.516-1.154 1.154-1.154z"
          fill="#2C2C2C"
        />
      </G>
      <Defs>
        <ClipPath id="4nlph3n1ta">
          <Path fill="#fff" transform="translate(19 19)" d="M0 0h30v30H0z" />
        </ClipPath>
      </Defs>
    </Svg>,
  ],
  speaker: [
    <Svg
      width="68"
      height="68"
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="68" height="68" rx="34" fill="#2A7FF6" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.192 27.948c-.33.183-.711.287-1.116.287h-4.614v11.539h4.468a2.29 2.29 0 0 1 1.18.242l10.505 5.253V22.737l-10.423 5.211zm9.391 19.385c1.535.767 3.34-.349 3.34-2.064V22.737c0-1.716-1.805-2.832-3.34-2.065l-10.505 5.253-.001.001-.002.002h-4.613a2.308 2.308 0 0 0-2.308 2.307v11.539a2.308 2.308 0 0 0 2.308 2.308h4.614v-.001h.002c3.337 1.668 6.723 3.36 10.505 5.252zM47.648 30.735a4.616 4.616 0 0 1 0 6.527l-.816-.816.816.816a4.616 4.616 0 0 1-3.263 1.352 1.154 1.154 0 0 1 0-2.308 2.308 2.308 0 1 0 0-4.615 1.154 1.154 0 0 1 0-2.308c1.224 0 2.398.486 3.263 1.352z"
        fill="#fff"
      />
    </Svg>,
    <Svg
      width="68"
      height="68"
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="68" height="68" rx="34" fill="#fff" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.193 27.948c-.331.183-.712.287-1.117.287h-4.614v11.539h4.468a2.29 2.29 0 0 1 1.18.242l10.506 5.253V22.737l-10.423 5.211zm9.39 19.385c1.535.767 3.34-.349 3.34-2.064V22.737c0-1.716-1.805-2.832-3.34-2.065l-10.505 5.253v.001l-.002.002h-4.614a2.308 2.308 0 0 0-2.308 2.307v11.539a2.308 2.308 0 0 0 2.308 2.308h4.614l.001-.001h.002c3.337 1.668 6.723 3.36 10.505 5.252zM47.648 30.735a4.616 4.616 0 0 1 0 6.527l-.816-.816.816.816a4.616 4.616 0 0 1-3.263 1.352 1.154 1.154 0 0 1 0-2.308 2.308 2.308 0 1 0 0-4.615 1.154 1.154 0 0 1 0-2.308c1.224 0 2.398.486 3.263 1.352z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
  keypad: [
    <Svg
      width="68"
      height="68"
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="68" height="68" rx="34" fill="#F7F8FA" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.77 23.616a1.154 1.154 0 1 0 0 2.308 1.154 1.154 0 0 0 0-2.308zm-3.462 1.154a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM24.77 32.847a1.154 1.154 0 1 0-.001 2.307 1.154 1.154 0 0 0 0-2.307zM21.307 34a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM24.77 42.077a1.154 1.154 0 1 0 0 2.308 1.154 1.154 0 0 0 0-2.308zm-3.462 1.154a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM34 23.616a1.154 1.154 0 1 0 0 2.308 1.154 1.154 0 0 0 0-2.308zM30.54 24.77a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM34 32.847a1.154 1.154 0 1 0 0 2.307 1.154 1.154 0 0 0 0-2.307zM30.54 34a3.461 3.461 0 1 1 6.923 0 3.461 3.461 0 0 1-6.923 0zM43.23 23.616a1.154 1.154 0 1 0 0 2.308 1.154 1.154 0 0 0 0-2.308zM39.77 24.77a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM34 42.077a1.154 1.154 0 1 0 0 2.308 1.154 1.154 0 0 0 0-2.308zm-3.461 1.154a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM43.23 32.847a1.154 1.154 0 1 0 0 2.307 1.154 1.154 0 0 0 0-2.307zM39.77 34a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM43.23 42.077a1.154 1.154 0 1 0 0 2.308 1.154 1.154 0 0 0 0-2.308zm-3.461 1.154a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0z"
        fill="#2C2C2C"
      />
    </Svg>,
    <Svg
      width="68"
      height="68"
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width="68" height="68" rx="34" fill="#fff" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.77 23.616a1.154 1.154 0 1 0 0 2.308 1.154 1.154 0 0 0 0-2.308zm-3.462 1.154a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM24.77 32.847a1.154 1.154 0 1 0-.001 2.307 1.154 1.154 0 0 0 0-2.307zM21.307 34a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM24.77 42.077a1.154 1.154 0 1 0 0 2.308 1.154 1.154 0 0 0 0-2.308zm-3.462 1.154a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM34 23.616a1.154 1.154 0 1 0 0 2.308 1.154 1.154 0 0 0 0-2.308zM30.54 24.77a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM34 32.847a1.154 1.154 0 1 0 0 2.307 1.154 1.154 0 0 0 0-2.307zM30.54 34a3.461 3.461 0 1 1 6.923 0 3.461 3.461 0 0 1-6.923 0zM43.23 23.616a1.154 1.154 0 1 0 0 2.308 1.154 1.154 0 0 0 0-2.308zM39.77 24.77a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM34 42.077a1.154 1.154 0 1 0 0 2.308 1.154 1.154 0 0 0 0-2.308zm-3.461 1.154a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM43.23 32.847a1.154 1.154 0 1 0 0 2.307 1.154 1.154 0 0 0 0-2.307zM39.77 34a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0zM43.23 42.077a1.154 1.154 0 1 0 0 2.308 1.154 1.154 0 0 0 0-2.308zm-3.461 1.154a3.462 3.462 0 1 1 6.923 0 3.462 3.462 0 0 1-6.923 0z"
        fill="#2C2C2C"
      />
    </Svg>,
  ],
};
export default toggleIcons;
