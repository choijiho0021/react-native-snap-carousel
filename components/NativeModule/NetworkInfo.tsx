import {NativeModules} from 'react-native';

interface RCTNetworkInfoInterface {
  supportEsim: (callback: (v: boolean) => void) => void;
}

const {NetworkInfo} = NativeModules;

export default NetworkInfo as RCTNetworkInfoInterface;
