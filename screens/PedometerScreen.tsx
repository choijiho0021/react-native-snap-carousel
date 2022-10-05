import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import GoogleFit, {BucketUnit, Scopes} from 'react-native-google-fit';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
  HealthInputOptions,
} from 'react-native-health';
import AppText from '@/components/AppText';
import Env from '@/environment';

const {isIOS} = Env.get();

const styles = StyleSheet.create({});

const option = {
  Scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_ACTIVITY_WRITE,
    Scopes.FITNESS_BODY_READ,
    Scopes.FITNESS_BODY_WRITE,
  ],
};

const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.Steps],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
} as HealthKitPermissions;

const options = {
  startDate: new Date(2022, 5, 1).toISOString(), // required
  endDate: new Date().toISOString(), // optional; default now
};

const PedometerScreen = () => {
  const [stepCount, setStepCount] = useState(0);
  useEffect(() => {
    if (isIOS) {
      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        /* Called after we receive a response from the system */
        if (error) {
          console.log('[ERROR] Cannot grant permissions!');
        } else {
          AppleHealthKit.getDailyStepCountSamples(
            options,
            (err: Object, results: Array<Object>) => {
              if (err) {
                return;
              }
              console.log(results);
              setStepCount(results[0].value);
            },
          );
        }
      });
    } else {
      const today = new Date();
      GoogleFit.authorize(option)
        .then((authResult) => {
          if (authResult.success) {
            console.log('@@@@@AUTH_SUCCESS');
            //   GoogleFitness APP이 깔려있고 해당 계정이 등록되어있어야만 동작
            GoogleFit.getDailySteps(today)
              .then((res) => {
                console.log('@@@@@', res[res.length - 1].steps[0].value);
                if (res[res.length - 1].steps[0].value > stepCount)
                  setStepCount(res[res.length - 1].steps[0].value);
              })
              .catch();
          } else {
            console.log('@@@@@AUTH_DENIED', authResult);
          }
        })
        .catch(() => {
          console.log('@@@@@AUTH_ERR');
        });
    }
  }, [stepCount]);
  return (
    <View>
      <AppText>Pedometer Test</AppText>
      <AppText>stepCount : {stepCount}</AppText>
    </View>
  );
};

export default PedometerScreen;
