import {actions as notiActions} from '@/redux/modules/noti';
import HandleRegisterPushNoti from './handleRegisterPushNoti';
import HandleAccountPushNoti from './handleAccountPushNoti';
import HandleNormalPushNoti from './handleNormalPushNoti';
import HandleProvisionPushNoti from './handleProvisionPushNoti';
import HandleEventPushNoti from './handleEventPushNoti';

export default function createHandlePushNoti(
  navigation,
  payload,
  options = {},
) {
  if (options.isRegister) {
    return new HandleRegisterPushNoti(navigation, payload, options);
  }
  const type = (payload.data || {}).notiType.split('/')[0];
  if (type === notiActions.NOTI_TYPE_ACCOUNT) {
    return new HandleAccountPushNoti(navigation, payload, options);
  }
  if (type === notiActions.NOTI_TYPE_PROVISION) {
    return new HandleProvisionPushNoti(navigation, payload, options);
  }
  if (type === notiActions.NOTI_TYPE_EVENT) {
    return new HandleEventPushNoti(navigation, payload, options);
  }
  // else if (type == notiActions.NOTI_TYPE_REPLY) {
  //   return new HandleReplyPushNoti(navigation, payload, options);
  // } else if (type == notiActions.NOTI_TYPE_PYM) {
  //   return new HandlePymPushNoti(navigation, payload, options);
  // }
  return new HandleNormalPushNoti(navigation, payload, options);
}
