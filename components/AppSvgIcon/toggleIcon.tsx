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
      <Mask
        id="qrhjr868ra"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="1"
        y="1"
        width="21"
        height="21">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1 1h20v20H1V1z"
          fill="#fff"
        />
      </Mask>
      <G mask="url(#qrhjr868ra)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m20.55 8.725-8.749-7.431a1.24 1.24 0 0 0-1.602 0L1.45 8.725c-.285.243-.45.602-.45.98V19.75C1 20.44 1.56 21 2.25 21h5.416c.69 0 1.25-.56 1.25-1.25v-5.445c0-1.108.789-2.101 1.87-2.213 1.24-.128 2.297.872 2.297 2.112v5.545c0 .691.56 1.251 1.251 1.251h5.416c.69 0 1.251-.56 1.251-1.25V9.704c0-.378-.166-.737-.451-.98z"
          fill="#2A7FF6"
        />
      </G>
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
        d="M10.36 1.263a1 1 0 0 1 1.28 0l9 7.5a1 1 0 0 1 .36.769V20a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-5.698a2 2 0 0 0-4 0V20a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9.532a1 1 0 0 1 .36-.769l9-7.5zM3 10v9h4v-4.698a4 4 0 0 1 8 0V19h4v-9l-8-6.667L3 10z"
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
        clipRule="evenodd"
        d="M9.18 18.68a1.363 1.363 0 1 1-2.727 0 1.363 1.363 0 0 1 2.726 0zM16.45 18.68a1.363 1.363 0 1 1-2.726 0 1.363 1.363 0 0 1 2.726 0z"
        stroke="#2A7FF6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m15.755 13.255.092-.185-.074.185h-.018zm5.027-8.616a.908.908 0 0 0-.753-.401H5.634L5.131 1.69a.91.91 0 0 0-.892-.733H1v1.818h2.492l2.284 11.564a.91.91 0 0 0 .892.734h9.717c.371 0 .704-.225.843-.568l3.643-9.017a.908.908 0 0 0-.089-.85z"
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
        clipRule="evenodd"
        d="M9.62 18.616a1.428 1.428 0 1 1-2.856 0 1.428 1.428 0 0 1 2.857 0zM16.56 18.616a1.428 1.428 0 1 1-2.857 0 1.428 1.428 0 0 1 2.857 0z"
        stroke="#2C2C2C"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Path
        d="M1 1.955h3.224L6.64 14.194h9.67l3.626-8.974H5.029"
        stroke="#2C2C2C"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Svg>,
  ],
  btnEsim: [
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path d="M12.636 9.364H9.364v3.272h3.272V9.364z" fill="#2A7FF6" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.455 3.522c0 .07.004.139.014.205h-.742a2 2 0 0 0-2 2v.742a1.469 1.469 0 0 0-.205-.014H2.114C1.502 6.455 1 6.83 1 7.29v.147c0 .46.502.836 1.114.836h1.408c.07 0 .139-.005.205-.015v1.847a1.463 1.463 0 0 0-.205-.014H2.114c-.612 0-1.114.376-1.114.835v.148c0 .459.502.835 1.114.835h1.408c.07 0 .139-.005.205-.014v1.847a1.478 1.478 0 0 0-.205-.015H2.114c-.612 0-1.114.377-1.114.836v.147c0 .46.502.835 1.114.835h1.408c.07 0 .139-.004.205-.014v.742a2 2 0 0 0 2 2h.742c-.01.066-.014.135-.014.205v1.408c0 .612.376 1.114.835 1.114h.147c.46 0 .836-.502.836-1.114v-1.408c0-.07-.005-.139-.014-.205h1.846c-.01.066-.014.135-.014.205v1.408c0 .612.376 1.114.835 1.114h.148c.459 0 .835-.502.835-1.114v-1.408c0-.07-.005-.139-.014-.205h1.847c-.01.066-.015.135-.015.205v1.408c0 .612.377 1.114.836 1.114h.147c.46 0 .835-.502.835-1.114v-1.408c0-.07-.004-.139-.014-.205h.742a2 2 0 0 0 2-2v-.742c.066.01.135.014.205.014h1.408c.613 0 1.114-.376 1.114-.835v-.147c0-.46-.5-.836-1.114-.836h-1.408c-.07 0-.139.005-.205.015v-1.847c.066.01.135.014.205.014h1.408c.613 0 1.114-.376 1.114-.835v-.148c0-.459-.5-.835-1.114-.835h-1.408c-.07 0-.139.005-.205.014V8.258c.066.01.135.015.205.015h1.408c.613 0 1.114-.377 1.114-.836V7.29c0-.46-.5-.835-1.114-.835h-1.408c-.07 0-.139.004-.205.014v-.742a2 2 0 0 0-2-2h-.742c.01-.066.014-.135.014-.205V2.114C15.546 1.5 15.17 1 14.71 1h-.147c-.46 0-.836.5-.836 1.114v1.408c0 .07.005.139.015.205h-1.847c.01-.066.014-.135.014-.205V2.114C11.91 1.5 11.533 1 11.074 1h-.148c-.459 0-.835.5-.835 1.114v1.408c0 .07.005.139.014.205H8.258c.01-.066.015-.135.015-.205V2.114C8.273 1.5 7.896 1 7.437 1H7.29c-.46 0-.835.5-.835 1.114v1.408zm2.909 3.842a2 2 0 0 0-2 2v3.272a2 2 0 0 0 2 2h3.272a2 2 0 0 0 2-2V9.364a2 2 0 0 0-2-2H9.364z"
        fill="#2A7FF6"
      />
    </Svg>,
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect
        x="4.727"
        y="4.727"
        width="12.546"
        height="12.546"
        rx="1"
        stroke="#2C2C2C"
        strokeWidth="2"
      />
      <Rect
        x="8.364"
        y="8.364"
        width="5.273"
        height="5.273"
        rx="1"
        stroke="#2C2C2C"
        strokeWidth="2"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.437 4.636H7.29c-.46 0-.835-.501-.835-1.114V2.114C6.455 1.5 6.83 1 7.29 1h.147c.46 0 .836.5.836 1.114v1.408c0 .613-.377 1.114-.836 1.114zM7.437 21H7.29c-.46 0-.835-.502-.835-1.114v-1.408c0-.614.376-1.114.835-1.114h.147c.46 0 .836.5.836 1.114v1.408c0 .612-.377 1.114-.836 1.114zM17.364 7.437V7.29c0-.46.502-.835 1.114-.835h1.408c.613 0 1.114.376 1.114.835v.147c0 .46-.5.836-1.114.836h-1.408c-.613 0-1.114-.377-1.114-.836zM1 7.437V7.29c0-.46.502-.835 1.114-.835h1.408c.614 0 1.114.376 1.114.835v.147c0 .46-.5.836-1.114.836H2.114C1.502 8.273 1 7.896 1 7.437zM11.073 4.636h-.147c-.459 0-.835-.501-.835-1.114V2.114c0-.613.376-1.114.835-1.114h.147c.46 0 .836.5.836 1.114v1.408c0 .613-.376 1.114-.836 1.114zM11.073 21h-.147c-.459 0-.835-.502-.835-1.114v-1.408c0-.614.376-1.114.835-1.114h.147c.46 0 .836.5.836 1.114v1.408c0 .612-.376 1.114-.836 1.114zM17.364 11.073v-.147c0-.459.502-.835 1.114-.835h1.408c.613 0 1.114.376 1.114.835v.147c0 .46-.5.836-1.114.836h-1.408c-.613 0-1.114-.376-1.114-.836zM1 11.073v-.147c0-.459.502-.835 1.114-.835h1.408c.614 0 1.114.376 1.114.835v.147c0 .46-.5.836-1.114.836H2.114c-.612 0-1.114-.376-1.114-.836zM14.71 4.636h-.148c-.459 0-.835-.501-.835-1.114V2.114c0-.613.376-1.114.835-1.114h.148c.459 0 .835.5.835 1.114v1.408c0 .613-.376 1.114-.835 1.114zM14.71 21h-.148c-.459 0-.835-.502-.835-1.114v-1.408c0-.614.376-1.114.835-1.114h.148c.459 0 .835.5.835 1.114v1.408c0 .612-.376 1.114-.835 1.114zM17.364 14.71v-.148c0-.459.502-.835 1.114-.835h1.408c.613 0 1.114.376 1.114.835v.148c0 .459-.5.835-1.114.835h-1.408c-.613 0-1.114-.376-1.114-.835zM1 14.71v-.148c0-.459.502-.835 1.114-.835h1.408c.614 0 1.114.376 1.114.835v.148c0 .459-.5.835-1.114.835H2.114C1.502 15.545 1 15.17 1 14.71z"
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
  ],
  btnMypage: [
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.981 1a4.6 4.6 0 1 0 .002 9.2A4.6 4.6 0 0 0 10.98 1zM10.608 10.798C5.37 10.798 1 14.873 1 19.963a1 1 0 0 0 1.002 1h17.996a1 1 0 0 0 1.002-1c0-5.09-4.37-9.165-9.608-9.165h-.784z"
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
        d="M10.981 3a2.6 2.6 0 1 0 .002 5.2A2.6 2.6 0 0 0 10.98 3zM6.382 5.6a4.6 4.6 0 1 1 9.2 0 4.6 4.6 0 0 1-9.2 0zM1 19.963c0-5.09 4.362-9.165 9.59-9.165h.783c5.228 0 9.59 4.075 9.59 9.165a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm2.075-1h15.813c-.518-3.436-3.662-6.165-7.515-6.165h-.782c-3.854 0-6.998 2.73-7.516 6.165z"
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
};
export default toggleIcons;
