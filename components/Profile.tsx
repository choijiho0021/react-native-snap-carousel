import {RootState} from '@reduxjs/toolkit';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import Svg, {Circle, G, Mask, Path} from 'react-native-svg';
import AppUserPic from '@/components/AppUserPic';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import AppText from './AppText';
import {isDeviceSize} from '@/constants/SliderEntry.style';

const ProfileImg = () => (
  <Svg
    width="76"
    height="76"
    viewBox="0 0 76 76"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Circle cx="38" cy="38" r="37.5" fill="#F8F8F8" stroke="#F3F3F3" />
    <Mask
      id="sxpeg9ujea"
      style="mask-type:alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="76"
      height="76">
      <Circle cx="38" cy="38" r="37.5" fill="#fff" stroke="#fff" />
    </Mask>
    <G mask="url(#sxpeg9ujea)">
      <Path
        d="M37.943 69.623c.944 0 1.71-.756 1.71-1.688 0-.931-.766-1.687-1.71-1.687s-1.71.755-1.71 1.687.766 1.688 1.71 1.688z"
        fill="#000"
      />
      <Path
        d="M41.419 76.934h-6.78c-.456 0-.855-.393-.855-.843v-7.536c0-.45.399-.844.855-.844h6.78c.455 0 .854.394.854.844v7.536c0 .45-.399.844-.855.844z"
        fill="#FFD300"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m37.373 67.26-3.59-4.274M38.513 67.26l3.646-4.274"
        stroke="#000"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M39.88 75.529h-3.817a.688.688 0 0 1-.684-.675v-5.062c0-.394.342-.675.684-.675h3.817c.399 0 .684.338.684.675v5.062c.057.337-.285.675-.684.675z"
        fill="#EE4423"
      />
      <Path
        d="M35.664 75.022v-.112.225c0 .056 0 .056.057.112l.057.057h.114-.114s-.057 0-.057-.057l-.057-.056v-.393c0-.338 0-.675-.114-.957.114-.056.171-.73.114-.73 0-.113-.057-.282-.057-.395v.282-.282c-.057-.9-.057-1.855 0-2.868v-.337c0-.056.057-.056.057-.056H35.948c.514 0 1.026 0 1.311.056h.228-.285c.342 0 .684-.056.969-.056-.057 0-.057 0-.171-.057h.17c.172-.056.457-.056.628-.056-.057 0 .114 0 .17.056h-.056H40.108l.057.056.057.057v.112c-.057 0 0 .281-.057.113.057.281 0 .506.057.787 0 .9 0 1.8.057 2.756 0 .337.057.619.057 1.012.057.282.057.675.114.788v.45c0 .056-.057.112-.114.168a.785.785 0 0 1-.228.17c.057 0-.057.055-.114.055h-.114.057c.171 0 .228 0 .285-.056.057-.056.114-.056.228-.169.057-.056.114-.112.114-.225v-1.181c0-.393 0-.843.057-1.237V69.567c0-.056 0-.112-.057-.169-.057-.112-.057-.168-.114-.225l-.171-.168c-.114-.057-.171-.057-.285-.057H37.601c-.057-.056-1.71.057-1.823.057h-.228c-.057 0-.114 0-.17.056-.115.056-.229.112-.286.169-.057.112-.114.168-.114.28V69.793c0 .281-.057.562-.057.844 0 .112.057.225.057.337v.225c-.057.281-.057.45 0 .281V72.998c0 .056.057.562.057.618v-.056c0 .281-.057.45-.057.675V75.304c0 .168.114.28.171.393a.52.52 0 0 0 .4.17h.512c0-.057-.171 0-.171-.057.399 0 .797.056 1.14.056.056 0 .17 0 .17.056h.171c.114 0 .171.056.342 0H38c.057 0 .513-.112.57-.112H38.855s.057 0 0 0h.17c-.113 0-.284-.056-.455-.056h.228c.057 0 .227.056.341.056 0 0 .057-.056.114 0h.114-.17H39.765s-.17 0-.114-.056h.171s-.057 0 0 0h.171-.057c.057 0-.399.112-.285.056 0 0 .399-.056.342-.113-.057 0 .057 0 0-.056h-.057c-.057 0-.114-.056-.057-.056.114 0-.285.112-.228.056h-.057.342c-.285 0 .171-.169-.057-.169.114.057-.057.057-.17.057 0 0-.058 0-.115-.057h-.057c-.057 0-.114 0-.114-.056h-.512s-.114-.056-.057-.056c.114 0-.057.056.114.056-.057-.056.114 0 .17-.056h-.512.057-.228l-.456.056h-.114s.627-.056.513-.056c-.057 0-.74.056-.74.056h-.115c-.057 0 0 0-.057-.056h-.513c.057 0 .057-.056.171-.056h.057H36.917c-.056-.057-.284 0-.455 0h-.057c-.171 0-.228 0-.4-.057-.056 0-.056 0 0 .057h-.113c.114-.057-.228-.057-.114-.113h-.171s0 .056-.114.056h-.114v-.056c-.057 0-.057 0-.057-.056v-.056s0-.057-.057-.057c0 0 0-.056-.057-.056.399 0 .399 0 .456.056z"
        fill="#EE4423"
      />
      <Path
        d="M39.88 69.51h-3.817c-.228 0-.456.226-.456.45v4.837c0 .225.228.45.456.45h2.621c.114 0 .228-.056.342-.112l1.139-1.125a.507.507 0 0 0 .17-.394V70.017c0-.281-.17-.506-.455-.506zm-.627.057h.684c.228 0 .399.169.399.394v.675h-.74c-.172 0-.286-.113-.286-.282v-.787h-.057zm-3.532.394c0-.225.17-.394.399-.394h.684v.731c0 .169-.114.281-.285.281h-.741v-.618h-.057zm1.083 5.118h-.684a.387.387 0 0 1-.399-.394v-.675h.74c.172 0 .285.112.285.281v.788h.057zm3.475-1.575c0 .112-.057.225-.114.337l-1.14 1.125a.438.438 0 0 1-.284.113h-1.824v-.731a.387.387 0 0 0-.398-.394h-.741v-3.262h.74a.387.387 0 0 0 .4-.394v-.731h2.278v.731c0 .225.171.394.4.394h.74v2.812h-.057z"
        fill="#fff"
      />
      <Path
        d="M38.627 74.798h-2.28c-.17 0-.284-.113-.284-.281V70.13c0-.169.114-.281.285-.281h3.418c.171 0 .285.112.285.28v3.32c0 .112-.057.168-.114.224l-1.026 1.012c-.113.113-.227.113-.284.113z"
        fill="#fff"
      />
      <Path
        d="M38.627 74.854h-2.28c-.17 0-.341-.113-.341-.338V70.13c0-.168.114-.337.342-.337h3.418c.171 0 .342.112.342.337v3.319c0 .112-.057.168-.114.28l-1.026 1.013c-.17.056-.284.113-.341.113zm-2.28-4.95c-.113 0-.227.113-.227.225v4.387c0 .113.114.225.228.225h2.279c.057 0 .17-.056.228-.112l1.025-1.013c.057-.056.114-.112.114-.225v-3.318c0-.112-.114-.225-.228-.225h-3.418v.056z"
        fill="#EC4624"
      />
      <Path
        d="M36.462 70.299h3.076v2.98c0 .057 0 .113-.057.17l-.854.843c-.057.056-.114.056-.171.056h-1.994v-4.05z"
        fill="#fff"
      />
      <Path
        d="M38.456 74.404h-1.994v-4.162h3.133v3.037a.424.424 0 0 1-.114.225l-.854.844s-.114.056-.171.056zm-1.937-.056h1.937c.057 0 .114 0 .17-.056l.855-.844c.057-.056.057-.112.057-.169V70.3h-3.02v4.049z"
        fill="#EE4423"
      />
      <Path
        d="M38.969 73.673H37.03c-.114 0-.17-.056-.17-.169v-.225c0-.056.056-.169.17-.169h.57s.057 0 .057-.056v-.169s0-.056-.057-.056h-.57c-.114 0-.17-.056-.17-.169v-.9c0-.056.056-.168.17-.168H38.4s.057 0 .057-.056v-.113s0-.056-.057-.056h-1.367c-.114 0-.171-.056-.171-.169v-.225c0-.056.056-.169.17-.169h.285v-.28c0-.057.057-.17.171-.17h.171c.057 0 .171.057.171.17v.28h.399v-.28c0-.057.057-.17.17-.17h.172c.057 0 .17.057.17.17v.28h.286c.113 0 .17.057.17.17v.843c0 .056-.056.169-.17.169h-1.368s-.057 0-.057.056v.112s0 .056.057.056h1.368c.113 0 .17.057.17.17v.224c0 .056-.056.169-.17.169h-.57s-.057 0-.057.056v.169s0 .056.057.056h.57c.113 0 .17.056.17.169v.225c-.056.112-.113.225-.227.225zm-1.938-.45s-.056 0 0 0l-.056.281s0 .056.056.056h1.938s.057 0 .057-.056v-.225s0-.056-.057-.056h-.57c-.114 0-.171-.056-.171-.169v-.169c0-.056.057-.168.17-.168h.57s.058 0 .058-.057v-.225s0-.056-.057-.056H37.6c-.114 0-.17-.056-.17-.169v-.112c0-.056.056-.169.17-.169h1.368s.057 0 .057-.056v-.844s0-.056-.057-.056h-.4v-.394h-.17v.394h-.684v-.394h-.228v.394h-.399s-.056 0-.056.056v.225s0 .057.056.057h1.368c.114 0 .17.056.17.168v.113c0 .056-.056.168-.17.168h-1.368s-.056 0-.056.057v.9s0 .056.056.056h.57c.114 0 .171.056.171.169v.168c0 .057-.057.169-.17.169h-.627v-.056z"
        fill="#EE4423"
      />
      <Path
        d="M36.86 70.299v-.45h-.512c-.171 0-.285.112-.285.28v.507h.456c.17 0 .341-.112.341-.337z"
        fill="#fff"
      />
      <Path
        d="M36.519 70.692h-.513v-.563c0-.168.114-.337.342-.337h.57v.506c-.057.225-.228.394-.4.394zm-.456-.056h.456c.17 0 .342-.17.342-.338v-.45h-.513c-.114 0-.228.113-.228.225v.563h-.057z"
        fill="#EE4423"
      />
      <Path
        d="M36.348 74.798h.513v-.45c0-.168-.171-.337-.342-.337h-.456v.506c0 .169.114.281.285.281z"
        fill="#fff"
      />
      <Path
        d="M36.86 74.854h-.57c-.17 0-.341-.112-.341-.338v-.562h.513c.228 0 .398.169.398.394v.506zm-.797-.844v.506c0 .113.114.225.228.225h.513v-.45c0-.168-.171-.337-.342-.337h-.4v.056z"
        fill="#EE4423"
      />
      <Path
        d="M39.538 70.636h.456v-.506c0-.169-.114-.281-.285-.281h-.513v.45c0 .224.171.337.342.337z"
        fill="#fff"
      />
      <Path
        d="M40.051 70.692h-.513a.387.387 0 0 1-.398-.394v-.506h.57c.17 0 .341.112.341.337v.563zm-.855-.787v.45c0 .168.171.337.342.337h.456v-.506c0-.113-.114-.225-.228-.225h-.57v-.056z"
        fill="#EE4423"
      />
      <Path
        d="M58.397 55.675s5.868 13.273 7.008 25.197c.228 2.98-1.539 4.274-3.533 4.274-2.45 0-4.387-1.969-3.247-5.287 0 0-2.792-14.622-5.812-19.572 0 0-2.848-3.88.171-5.793 3.02-1.968 5.071.45 5.413 1.181z"
        fill="#fff"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M37.943 55.731h20.34s-1.595 18.841-6.04 37.176c0 0 1.71.731 1.71 2.868-2.621 0-10.597.057-11.452 0-.912-.056-1.994-5.005-2.735-10.798-.285-1.856-1.025-2.418-1.823-2.418s-1.538.562-1.823 2.418c-.74 5.793-1.88 10.798-2.735 10.798-.911.057-8.831 0-11.452 0 0-2.193 1.71-2.868 1.71-2.868-4.445-18.335-6.04-37.176-6.04-37.176h20.34zM55.662 39.646s1.481-6.074 5.64-6.074c4.16 0 5.755 4.218 5.356 7.818-.399 3.543-3.077 9.448-9.856 9.223 0 0-2.564-2.643-1.14-10.967z"
        fill="#fff"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M56.802 41.502s.911-3.655 3.532-3.655c2.62 0 3.646 2.587 3.361 4.724-.284 2.137-1.937 5.737-6.267 5.568.057-.056-1.538-1.631-.626-6.637z"
        fill="#2A7FF6"
        stroke="#000"
        strokeMiterlimit="10"
      />
      <Path
        d="M20.338 39.646s-1.481-6.074-5.64-6.074c-4.16 0-5.755 4.218-5.356 7.818.399 3.543 3.076 9.448 9.856 9.223 0 0 2.564-2.643 1.14-10.967z"
        fill="#fff"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.198 41.502s-.911-3.655-3.532-3.655c-2.62 0-3.646 2.587-3.361 4.724.284 2.137 1.937 5.737 6.267 5.568-.057-.056 1.538-1.631.626-6.637z"
        fill="#2A7FF6"
        stroke="#000"
        strokeMiterlimit="10"
      />
      <Path
        d="M38 64.28c-7.634 0-14.585-2.361-17.035-3.88-2.45-1.518-3.419-3.6-3.419-6.187 0-13.498 2.564-19.29 2.564-19.29C24.953 23.056 38 23.843 38 23.843s13.047-.844 17.89 11.08c0 0 2.564 5.792 2.564 19.29 0 2.587-.969 4.669-3.419 6.187-2.45 1.519-9.4 3.88-17.035 3.88z"
        fill="#fff"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M42.273 39.365s1.367-2.024 4.786-2.924c3.418-.844 5.47-.056 5.811.956"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M47.572 44.202c.17 1.406 2.165 2.306 4.444 2.025 2.279-.281 3.931-1.687 3.76-3.093-.17-1.406-1.481-2.475-4.444-2.025-2.279.337-3.931 1.687-3.76 3.093z"
        fill="#ED4847"
      />
      <Path
        d="M47.8 44.821c.626 1.069 2.336 1.631 4.216 1.406 2.279-.281 3.931-1.687 3.76-3.093"
        stroke="#000"
        stroke-width=".5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m23.13 37.51 10.768.675s-1.823 1.63-5.356 1.63c-3.532 0-5.355-1.237-5.412-2.305z"
        fill="#fff"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m27.916 37.848.227 2.024 1.71-.056.398-1.8-2.335-.168z"
        fill="#000"
      />
      <Path
        d="M28.428 44.202c-.17 1.406-2.165 2.306-4.444 2.025-2.279-.281-3.93-1.687-3.76-3.093.17-1.406 1.481-2.475 4.444-2.025 2.279.337 3.988 1.687 3.76 3.093z"
        fill="#ED4847"
      />
      <Path
        d="M28.257 44.821c-.626 1.069-2.336 1.631-4.216 1.406-2.279-.281-3.931-1.687-3.76-3.093"
        stroke="#000"
        strokeWidth=".5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M38.114 38.972c.228.45.855 1.687 1.026 2.475.056.168-.057.337-.228.337l-.969.169c-.17.056-.342-.113-.342-.338 0-.562.114-1.8.399-2.643-.057-.112.057-.112.114 0z"
        fill="#000"
      />
      <Path
        d="M34.354 33.066s-1.254-2.362-5.242-2.7c-3.988-.337-5.07 1.294-5.356 1.688-.512.675-.285 3.318 2.165 3.037 2.45-.225 4.444-.112 5.584.563 2.051 1.237 3.931-.45 2.849-2.588zM41.134 32.673s.854-2.475 4.728-3.375c3.875-.9 5.071.506 5.413.844.627.618.798 3.15-1.652 3.262-2.45.112-4.33.506-5.356 1.35-1.766 1.518-3.874.112-3.133-2.081z"
        fill="#000"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M42.444 39.14s6.096-3.037 9.23-.28"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M38 26.542c-4.615 0-5.526-1.518-5.526-1.518C33.044 16.363 38 14.338 38 14.338s4.957 2.025 5.527 10.686c0-.056-.912 1.518-5.527 1.518z"
        fill="#FFD300"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M38 28.174c-9.743 0-8.49-5.456-7.692-6.524.855-1.069 2.28-1.013 3.191-.563.912.45 1.595.225 2.222-1.068.74-1.463 2.222-1.406 2.222-1.406s1.481-.057 2.222 1.406c.684 1.35 1.31 1.574 2.222 1.068.912-.45 2.336-.506 3.19.563.97 1.125 2.166 6.524-7.577 6.524z"
        fill="#2A7FF6"
        stroke="#000"
        strokeMiterlimit="10"
      />
      <Path
        d="M48.198 47.295c-1.88 2.193-5.754 3.712-10.255 3.712-4.501 0-8.375-1.519-10.255-3.712"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m17.261 57.138.741-2.081 2.051 10.348-2.564 2.025-.228-10.292zM58.682 57.138l-.74-2.081-2.109 10.348 2.564 2.025.285-10.292z"
        fill="#fff"
      />
      <Path
        d="M45.464 67.15H30.479a1.402 1.402 0 0 1-1.424-1.407v-8.38c0-.787.627-1.406 1.424-1.406h14.985c.797 0 1.424.619 1.424 1.406v8.38c0 .787-.627 1.406-1.424 1.406z"
        fill="#FFD300"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        opacity=".6"
        d="M42.615 56.463H30.479a.894.894 0 0 0-.911.9v4.78l13.047-5.68z"
        fill="#fff"
      />
      <Path
        d="M17.49 55.957s-4.559 10.405-1.71 15.241c3.362 5.737 12.363-5.174 12.363-5.174s2.45.056 3.59-1.18c1.253-1.35.57-4.05-.513-4.894-1.481-1.125-3.304-1.125-6.096 1.069-3.134 2.362-6.894 5.905-6.894 5.905"
        fill="#fff"
      />
      <Path
        d="M17.49 55.957s-4.559 10.405-1.71 15.241c3.362 5.737 12.363-5.174 12.363-5.174s2.45.056 3.59-1.18c1.253-1.35.57-4.05-.513-4.894-1.481-1.125-3.304-1.125-6.096 1.069-3.134 2.362-6.894 5.905-6.894 5.905"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.743 66.417c-.513-1.687-1.425-3.768-3.19-5.68-1.083-1.181.398-5.456 2.392-4.556 0 0 3.532 1.8 4.102 6.3.057.337.057.618.057.955"
        fill="#000"
      />
      <Path
        d="M18.743 66.417c-.513-1.687-1.425-3.768-3.19-5.68-1.083-1.181.398-5.456 2.392-4.556 0 0 3.532 1.8 4.102 6.3.057.337.057.618.057.955"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <Path
        d="M57.884 56.181s-3.532 1.8-4.102 6.3c-.57 4.498 2.62 9.898 2.62 9.898l.172-2.756s0-4.837 3.76-8.886c1.082-1.181-.399-5.456-2.45-4.556z"
        fill="#000"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <Path
        d="m18.173 66.923 4.5-3.937"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M37.943 63.774c2.222 0 2.735-.731 2.735-.731-.285-4.218-2.735-5.23-2.735-5.23s-2.45 1.012-2.735 5.23c0 0 .513.731 2.735.731z"
        fill="#FFD300"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M37.943 64.618c4.786 0 4.16-2.643 3.76-3.206-.398-.562-1.082-.506-1.538-.281-.456.225-.798.112-1.082-.563-.342-.73-1.083-.674-1.083-.674s-.74-.057-1.083.675c-.341.618-.626.787-1.082.562-.456-.225-1.14-.281-1.538.281-.4.563-1.14 3.206 3.646 3.206z"
        fill="#2A7FF6"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 20,
    height: 76,
    marginBottom: 30,
  },
  photo: {
    alignSelf: 'center',
  },
  label: {
    ...appStyles.medium16,
    fontSize: isDeviceSize('medium') ? 16 : 18,
    marginHorizontal: 20,
    lineHeight: 22,
    color: colors.warmGrey,
    marginBottom: 4,
  },
  value: {
    ...appStyles.bold20Text,
    fontSize: isDeviceSize('medium') ? 20 : 22,
    marginLeft: 20,
    maxWidth: '100%',
    lineHeight: 24,
    color: colors.black,
    marginRight: 20,
    marginBottom: 8,
  },
  userPicture: {
    width: 76,
    height: 76,
    borderRadius: 76 / 2,
    borderWidth: 1,
    borderColor: colors.whitefour,
  },
});

type ProfileProps = {
  account: AccountModelState;
  mobile?: string;
  email?: string;
  userPictureUrl?: string;
  onChangePhoto?: () => void;
};

const Profile: React.FC<ProfileProps> = ({
  account: {
    mobile: accountMobile,
    email: accountEmail,
    userPictureUrl: accountUserPictureUrl,
  },
  mobile,
  email,
  userPictureUrl,
  onChangePhoto = () => {},
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.photo}>
        <AppUserPic
          url={userPictureUrl || accountUserPictureUrl}
          icon={<ProfileImg />}
          style={styles.userPicture}
          isAbsolutePath={userPictureUrl !== undefined}
          onPress={onChangePhoto}
        />
      </View>
      <View style={{flex: 3, justifyContent: 'center'}}>
        <AppText style={styles.value} numberOfLines={1} ellipsizeMode="tail">
          {email || accountEmail || ''}
        </AppText>
        <AppText style={styles.label}>
          {utils.toPhoneNumber(mobile || accountMobile)}
        </AppText>
      </View>
    </View>
  );
};

export default connect(({account}: RootState) => ({account}))(memo(Profile));
