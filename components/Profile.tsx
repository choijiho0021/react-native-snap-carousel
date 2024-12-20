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
    <Circle cx="38" cy="38" r="38" fill="#D8E7FF" />
    <Mask
      id="mask0_4079_22115"
      style="mask-type:luminance"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="76"
      height="76">
      <Circle cx="38" cy="38" r="38" fill="white" />
    </Mask>
    <G mask="url(#mask0_4079_22115)">
      <Path
        d="M32.7968 16.8876C31.8691 16.3375 29.7229 13.7644 29.6899 12.4288C29.6749 11.8356 30.0493 11.2919 30.5273 11.093C31.0273 10.8841 32.1625 10.7688 33.7687 12.8686"
        fill="#FFDC00"
      />
      <Path
        d="M56.637 16.6955C56.0907 13.0908 55.9407 12.7106 54.5991 12.1796C53.755 11.8865 52.9158 11.9801 52.2017 12.2031C52.7328 11.8934 53.7695 11.8302 54.1432 11.4025C54.7659 10.6883 54.4876 9.52478 53.8385 8.64691C53.6391 8.37706 52.8078 8.47745 52.085 8.28649C51.167 8.04282 50.3129 7.52751 49.9359 7.40641C47.9867 6.77588 46.5757 7.07332 45.2866 7.76948C45.1263 7.16339 44.7156 6.84931 44.7156 6.84931C42.892 5.58906 39.7248 7.17725 39.7248 7.17725C33.8713 9.93129 32.0072 15.3017 32.0072 15.3017C29.5129 21.2782 31.5639 27.2231 39.2101 30.2514C46.0318 32.9502 52.3629 31.9189 55.8029 24.7322C57.0893 21.8049 56.8824 18.3368 56.6352 16.6956L56.637 16.6955Z"
        fill="#FFDC00"
      />
      <Path
        d="M43.2683 9.24373C43.2683 9.24373 44.0434 8.44155 45.2864 7.77072M50.2371 13.2572C51.0763 12.4763 52.1914 11.9526 53.3365 11.858C53.6602 11.8307 54.014 11.8355 54.3593 11.889"
        stroke="#F4A32C"
        strokeWidth="1.01098"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M42.716 26.2842C42.8474 27.0839 43.2914 27.9282 44.0402 28.1763C44.4683 28.3178 44.9342 28.2337 45.3081 27.8888C45.6821 27.544 46.1619 26.709 45.6736 25.3095"
        stroke="black"
        strokeWidth="1.01098"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.4319 49.5766C14.3425 50.5237 16.5764 52.193 18.8726 56.2517C20.3931 58.939 21.1782 61.2345 22.1151 63.7236C22.4868 64.7086 22.8718 65.6703 22.9818 66.7267L19.5959 71.6254C19.5959 71.6254 15.9649 70.5559 10.8281 67.259C7.62225 65.2016 5.67218 63.7745 4.09643 61.871C2.34701 59.757 1.39933 56.3677 2.61662 53.3193C3.55565 50.9678 5.50632 49.1817 7.84654 48.8174C9.65487 48.5352 11.0297 48.8776 12.4315 49.5724L12.4319 49.5766Z"
        fill="#5AA2FF"
      />
      <Path
        d="M52.4006 86.8991C56.1086 84.6375 54.7953 73.7098 54.6844 73.4669C51.4479 66.4318 43.658 64.6057 36.3213 64.3613C36.3213 64.3613 25.4522 62.7574 20.3017 66.4758C18.716 67.622 15.3047 72.4459 15.4787 74.9398C18.3316 88.6636 43.4279 92.131 52.4006 86.8991Z"
        fill="#529EFF"
      />
      <Path
        d="M46.2304 25.3196C46.2304 25.3196 44.7872 20.3217 40.7625 16.6704C40.1664 16.1297 39.2757 16.0666 38.6107 16.5183C34.1118 19.5666 31.9774 24.311 31.9774 24.311L38.9012 27.6809L46.2305 25.3214L46.2304 25.3196Z"
        fill="white"
      />
      <Path
        d="M45.3664 32.1634C47.3862 32.1404 49.3081 30.3719 49.4367 28.2015C49.5429 26.4215 48.3966 24.9924 46.6368 24.7006C45.6432 24.5359 44.8825 24.858 44.0502 25.2348C43.4465 25.5091 42.7382 25.2342 42.4946 24.7279C41.8154 23.3123 40.8594 22.3655 39.2818 22.2545C37.7041 22.1435 36.6231 22.9449 35.7524 24.2512C35.4405 24.7189 34.7006 24.8903 34.1415 24.535C33.3721 24.0451 32.6624 23.6174 31.6561 23.6415C29.8735 23.683 28.5367 24.9371 28.3915 26.7124C28.2147 28.8788 29.8667 30.9009 31.8634 31.2076L45.3646 32.1635L45.3664 32.1634Z"
        fill="#529EFF"
      />
      <Path
        d="M39.0144 26.0569C21.8783 24.8442 10.6548 35.9883 9.79305 48.1452C8.8822 60.9983 20.4588 68.4124 35.9377 69.5085C51.4166 70.6047 63.9221 64.8954 64.8311 52.0424C65.6928 39.8836 56.1506 27.2697 39.0144 26.0569Z"
        fill="#529EFF"
      />
      <Path
        d="M28.1218 50.6276C29.015 50.5653 29.6886 49.7907 29.6263 48.8975C29.564 48.0043 28.7893 47.3307 27.8961 47.393C27.0029 47.4553 26.3293 48.23 26.3916 49.1232C26.454 50.0164 27.2286 50.69 28.1218 50.6276Z"
        fill="black"
      />
      <Path
        d="M18.5228 53.6816C20.3133 53.5566 21.6635 52.0039 21.5385 50.2134C21.4136 48.4229 19.8609 47.0727 18.0704 47.1976C16.2799 47.3226 14.9297 48.8753 15.0546 50.6658C15.1795 52.4563 16.7323 53.8065 18.5228 53.6816Z"
        fill="#8DBFFF"
      />
      <Path
        d="M48.5079 56.3803C50.2984 56.2554 51.6486 54.7027 51.5237 52.9122C51.3988 51.1217 49.846 49.7715 48.0555 49.8964C46.265 50.0213 44.9148 51.5741 45.0398 53.3646C45.1647 55.155 46.7174 56.5053 48.5079 56.3803Z"
        fill="#8DBFFF"
      />
      <Path
        d="M39.5001 45.2443C40.3519 45.0669 41.5296 44.5425 41.3887 43.5794C41.2935 43.1125 40.7846 42.8164 40.2867 42.759C39.436 42.6617 38.5812 42.8485 37.8594 43.3042C37.5135 43.5237 37.1123 43.8999 37.1296 44.5436C37.3076 45.5115 38.6498 45.416 39.502 45.2441"
        fill="#1169D2"
      />
      <Path
        d="M28.3451 44.2407C27.5391 43.9136 26.4733 43.1883 26.7829 42.2657C26.9603 41.824 27.5139 41.6232 28.0136 41.6547C28.867 41.7112 29.6754 42.0473 30.3054 42.6261C30.6067 42.9036 30.9341 43.3451 30.803 43.9752C30.4545 44.8951 29.1525 44.5621 28.3451 44.2407Z"
        fill="#1169D2"
      />
      <Path
        d="M41.7624 55.1121C41.0098 53.1985 38.611 53.0453 37.6349 53.1834C36.8923 53.2886 36.4083 53.4035 35.5208 53.4396C34.6683 53.4751 33.9234 53.5197 33.1408 53.449C32.3583 53.3783 31.6348 53.2022 30.7999 53.0153C29.9333 52.8215 29.4772 52.623 28.7641 52.3853C27.8285 52.0747 25.4396 51.7973 24.3583 53.5458C24.047 54.0485 23.9704 54.8793 23.986 55.208C24.0548 56.7492 24.758 60.5162 32.442 61.2073C40.1242 61.8985 41.4904 58.3188 41.8332 56.8134C41.9065 56.4913 41.9794 55.6608 41.7641 55.1101L41.7624 55.1121Z"
        fill="#AA2222"
      />
      <Path
        d="M41.7621 55.1121C41.0095 53.1985 38.6108 53.0453 37.6346 53.1834C36.892 53.2886 36.4081 53.4035 35.5206 53.4396C34.6681 53.4751 33.9231 53.5197 33.1406 53.449C32.3581 53.3783 31.6345 53.2022 30.7997 53.0153C29.933 52.8215 29.477 52.623 28.7639 52.3853C27.8283 52.0747 25.4393 51.7973 24.3581 53.5458C24.0467 54.0485 23.9702 54.8793 23.9858 55.208C24.0546 56.7492 24.7578 60.5162 32.4418 61.2073C40.124 61.8985 41.4902 58.3188 41.8329 56.8134C41.9063 56.4913 41.9792 55.6608 41.7638 55.1101L41.7621 55.1121Z"
        fill="#AF0404"
      />
      <Path
        d="M30.2848 52.8874C29.906 52.7834 29.6007 52.676 29.2714 52.5602C29.1116 52.504 28.9461 52.4458 28.7638 52.385C28.3583 52.2504 27.6799 52.122 26.9532 52.1621C26.9809 52.4718 27.1208 53.4318 27.8127 54.2553C28.1461 54.6503 28.6658 54.7301 29.1571 54.3513C29.5392 54.0556 29.9737 53.6448 30.2848 52.8874Z"
        fill="white"
      />
      <Path
        d="M36.0485 53.4055C36.4354 53.3711 36.752 53.3205 37.0917 53.2663C37.2628 53.239 37.4398 53.2107 37.6346 53.1831C38.0577 53.1232 38.7481 53.1181 39.4559 53.2874C39.3729 53.5888 39.0642 54.5068 38.2371 55.1918C37.8381 55.5219 37.312 55.507 36.8965 55.0458C36.5732 54.6877 36.2203 54.2059 36.0485 53.4055Z"
        fill="white"
      />
      <Path
        d="M41.0621 58.6211C37.3341 56.8342 32.872 56.4156 32.872 56.4156L32.8717 56.412C32.8717 56.412 28.4065 56.0273 24.4197 57.1205C25.1579 58.7855 27.1351 60.7298 32.4417 61.2071C37.7437 61.6841 40.0372 60.1268 41.0621 58.6211Z"
        fill="#FF6A63"
      />
      <Path
        d="M35.9397 69.5087C25.7582 70.2191 9.36406 62.9516 9.78969 50.872"
        stroke="#3373DB"
        strokeWidth="1.01098"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.879 66.1364C19.4523 67.2384 17.5963 69.3727 16.3088 72.4698"
        stroke="#3373DB"
        strokeWidth="1.01098"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M50.3595 62.1886C49.4905 64.9517 48.3308 66.9728 47.1916 70.0258C46.159 72.788 49.0727 77.0107 51.9565 76.6953C59.9205 75.8228 70.1307 63.491 64.5819 55.1772C57.6153 48.2706 51.4654 58.6719 50.3595 62.1886Z"
        fill="#529EFF"
      />
      <Path
        d="M64.3113 54.9669C58.0687 49.8577 51.3931 55.9467 50.4836 62.3024C50.1767 64.4468 49.7424 65.593 49 66.4468"
        stroke="#3373DB"
        strokeWidth="1.01098"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M37.2097 50.5006C37.2097 50.5006 38.4439 49.624 40.2694 49.9333"
        stroke="black"
        strokeWidth="1.01098"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M47.3089 21.9983C46.3777 22.5423 43.0863 23.17 41.9025 22.5505C41.3767 22.2758 41.083 21.6846 41.1411 21.1701C41.2011 20.6316 41.6513 19.583 44.2667 19.1979"
        fill="#FFDC00"
      />
      <Path
        d="M43.1095 15.0846C43.1095 15.0846 42.7931 15.3554 42.2611 15.363C42.0162 15.3654 41.7042 15.3042 41.3837 15.1737C41.0633 15.0449 40.9204 14.9241 40.7462 14.752C40.3682 14.3785 40.3283 13.9648 40.3283 13.9648"
        stroke="#EA5B54"
        strokeWidth="1.01098"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M43.8188 13.2563C43.8188 13.2563 44.7702 12.9743 45.8177 13.3305M41.0794 12.1815C40.9494 11.7705 40.6475 11.1411 40 10.8398"
        stroke="black"
        strokeWidth="1.01098"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M47.3089 21.9983C46.3777 22.5423 43.0863 23.17 41.9025 22.5505C41.3767 22.2758 41.083 21.6846 41.1411 21.1701C41.2011 20.6316 41.6513 19.583 44.2667 19.1979"
        stroke="#F4A32C"
        strokeLinecap="round"
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
    lineHeight: isDeviceSize('medium') ? 22 : 24,
    color: colors.warmGrey,
    marginBottom: 4,
  },
  value: {
    ...appStyles.bold20Text,
    fontSize: isDeviceSize('medium') ? 20 : 22,
    marginLeft: 20,
    maxWidth: '100%',
    lineHeight: isDeviceSize('medium') ? 24 : 26,
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
