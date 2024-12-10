import {NativeModules} from 'react-native';

const {NaverTracker} = NativeModules;

export declare type NTrackerConversionItem = {
  quantity: number;
  payAmount: number;
  id: string;
  name: string;
  category: string;
};

export const trackPurchaseEvent = async (
  amount: number,
  items: NTrackerConversionItem[],
) => {
  try {
    const result = await NaverTracker.trackPurchaseEvent(amount, items);
    console.log('trackPurchaseEvent Success:', result);
  } catch (error) {
    console.error('trackPurchaseEvent Error:', error);
  }
};
