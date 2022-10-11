// import React, {useCallback, useEffect, useState} from 'react';
// import {StyleSheet, View} from 'react-native';
// import GoogleFit, {Scopes} from 'react-native-google-fit';
// import AppleHealthKit, {HealthKitPermissions} from 'react-native-health';
// import {useNavigation} from '@react-navigation/native';
// import {AnimatedCircularProgress} from 'react-native-circular-progress';
// import moment from 'moment';
// import AppText from '@/components/AppText';
// import Env from '@/environment';
// import {colors} from '@/constants/Colors';
// import {appStyles} from '@/constants/Styles';
// import AppBackButton from '@/components/AppBackButton';
// import i18n from '@/utils/i18n';
// import AppButton from '@/components/AppButton';

// const {isIOS} = Env.get();

// const styles = StyleSheet.create({
//   circleFrame: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     // paddingTop: 100,
//     height: '100%',
//   },
//   normal12WarmGrey: {
//     ...appStyles.normal12Text,
//     color: colors.warmGrey,
//     textAlign: 'left',
//   },
//   bold18ClearBlue: {
//     ...appStyles.bold18Text,
//     color: colors.clearBlue,
//   },
//   btnReload: {
//     width: 10,
//     height: 10,
//     marginTop: 5,
//   },
// });

// type sampleType = {
//   device: string;
//   end: string;
//   quantity: number;
//   sourceId: string;
//   sourceName: string;
//   start: string;
//   tracked: boolean;
// };

// const option = {
//   Scopes: [
//     Scopes.FITNESS_ACTIVITY_READ,
//     Scopes.FITNESS_ACTIVITY_WRITE,
//     Scopes.FITNESS_BODY_READ,
//     Scopes.FITNESS_BODY_WRITE,
//     Scopes.FITNESS_LOCATION_READ,
//   ],
// };

// const permissions = {
//   permissions: {
//     read: [AppleHealthKit.Constants.Permissions.Steps],
//     write: [AppleHealthKit.Constants.Permissions.Steps],
//   },
// } as HealthKitPermissions;

// const options = {
//   startDate: moment(moment().format('L')).toISOString(),
//   type: 'Walking',
// };

// const PedometerScreen = () => {
//   const [stepCount, setStepCount] = useState(0);
//   const navigation = useNavigation();

//   useEffect(() => {
//     navigation.setOptions({
//       title: null,
//       headerLeft: () => (
//         <AppBackButton title={i18n.t('esim:pedometer:title')} />
//       ),
//     });
//   }, [navigation]);

//   const getStepCount = useCallback(() => {
//     if (isIOS) {
//       AppleHealthKit.initHealthKit(permissions, (error: string) => {
//         if (error) {
//           console.log('[ERROR] Cannot grant permissions!');
//         } else {
//           AppleHealthKit.getSamples(
//             options,
//             (err: Object, results: Array<sampleType>) => {
//               if (err) {
//                 return;
//               }
//               // console.log(results);
//               let stepAcc = 0;
//               results.forEach((r) => {
//                 if (r.tracked) {
//                   stepAcc += r.quantity;
//                 }
//               });
//               setStepCount(stepAcc);
//             },
//           );
//         }
//       });
//     } else {
//       const today = new Date();
//       GoogleFit.authorize(option)
//         .then((authResult) => {
//           if (authResult.success) {
//             console.log('@@@@@AUTH_SUCCESS');
//             //   GoogleFitness APP이 깔려있고 해당 계정이 등록되어있어야만 동작
//             GoogleFit.getDailySteps(today)
//               .then((res) => {
//                 console.log('@@@@@result', res);
//                 if (res[res.length - 1].steps[0].value > stepCount)
//                   setStepCount(res[res.length - 1].steps[0].value);
//               })
//               .catch((err) => console.log('@@@@@NO_DATA?', err));
//           } else {
//             console.log('@@@@@AUTH_DENIED', authResult);
//           }
//         })
//         .catch(() => {
//           console.log('@@@@@AUTH_ERR');
//         });
//     }
//   }, [stepCount]);

//   useEffect(() => {
//     getStepCount();
//   }, [getStepCount]);

//   return (
//     <View style={styles.circleFrame}>
//       <AnimatedCircularProgress
//         size={300}
//         width={35}
//         fill={stepCount / 100}
//         rotation={0}
//         backgroundWidth={25}
//         tintColor={colors.clearBlue}
//         // onAnimationComplete={() => console.log('onAnimationComplete')}
//         backgroundColor={colors.whiteTwo}>
//         {() => (
//           <View style={{alignItems: 'center'}}>
//             <AppText>{i18n.t('esim:pedometer:sub')}</AppText>
//             <AppText style={styles.bold18ClearBlue}>
//               {stepCount} / 10000
//             </AppText>
//             <AppButton
//               style={styles.btnReload}
//               onPress={() => getStepCount()}
//               iconName="btnReload"
//               size={30}
//               iconStyle={{marginTop: 15}}
//             />
//           </View>
//         )}
//       </AnimatedCircularProgress>
//     </View>
//   );
// };

// export default PedometerScreen;
