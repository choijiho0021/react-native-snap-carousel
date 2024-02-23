import {NativeModules} from 'react-native';

interface AndroidEuccidModuleInterface {
  isEnableEsim(): Promise<boolean>;
  getTelephonyFeature(): Promise<string>;
  getSystemAvailableFeatures(): Promise<string[]>;
}

const {AndroidEuccidModule} = NativeModules;

export default AndroidEuccidModule as AndroidEuccidModuleInterface;
