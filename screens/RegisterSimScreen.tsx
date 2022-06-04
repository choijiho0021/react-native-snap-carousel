import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import AppTextInput from '@/components/AppTextInput';
import BackbuttonHandler from '@/components/BackbuttonHandler';
import ScanSim from '@/components/ScanSim';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import {actions as simActions, SimAction} from '@/redux/modules/sim';
import i18n from '@/utils/i18n';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {Component} from 'react';
import {
  findNodeHandle,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {check, openSettings, PERMISSIONS} from 'react-native-permissions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';

const styles = StyleSheet.create({
  actCodeTitle: {
    ...appStyles.bold12Text,
    flex: 1,
    textAlign: 'center',
    color: colors.black,
  },
  actCodeInput: {
    flex: 1,
    height: 36,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    paddingHorizontal: 30,
    textAlign: 'center',
    color: colors.black,
    marginLeft: 40,
    paddingTop: 0,
    paddingBottom: 0,
  },
  actCodeBox: {
    marginTop: 50,
    marginBottom: 30,
    marginHorizontal: 35,
  },
  actCode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanTitle: {
    ...appStyles.normal14Text,
    marginHorizontal: 10,
  },
  scanButton: {
    marginTop: 10,
    height: 20,
    marginHorizontal: 20,
    justifyContent: 'flex-start',
    width: 150,
  },
  inputBox: {
    marginTop: 13,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  input: {
    ...appStyles.roboto16Text,
    paddingHorizontal: 5,
    paddingVertical: 0,
    width: 60,
  },
  inputRow: {
    flexDirection: 'row',
  },
  iccidBox: {
    marginVertical: 12,
    marginHorizontal: 20,
    paddingHorizontal: isDeviceSize('small') ? 10 : 20,
    height: 80,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.clearBlue,
  },
  iccid: {
    ...appStyles.bold12Text,
    color: colors.clearBlue,
    marginTop: 15,
  },
  delimiter: {
    paddingVertical: 3,
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  card: {
    marginVertical: 20,
    paddingHorizontal: 20,
    height: 200,
    borderColor: 'transparent',
  },
  title: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    marginTop: isDeviceSize('small') ? 20 : 40,
    marginHorizontal: 20,
  },
});

type RegisterSimScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'RegisterSim'
>;

type RegisterSimScreenRouteProp = RouteProp<HomeStackParamList, 'RegisterSim'>;

type RegisterSimScreenProps = {
  navigation: RegisterSimScreenNavigationProp;
  route: RegisterSimScreenRouteProp;

  pending: boolean;

  account: AccountModelState;

  action: {
    account: AccountAction;
    order: OrderAction;
    sim: SimAction;
  };
};
type RegisterSimScreenState = {
  iccid: string[];
  actCode?: string;
  scan: boolean;
  hasCameraPermission: boolean;
};

const initialState: RegisterSimScreenState = {
  scan: false,
  iccid: ['', '', '', ''],
  actCode: undefined,
  hasCameraPermission: false,
};

const errCode = {
  [API.default.E_NOT_FOUND]: 'reg:invalidStatus',
  [API.default.E_ACT_CODE_MISMATCH]: 'reg:wrongActCode',
  [API.default.E_STATUS_EXPIRED]: 'reg:expiredIccid',
  [API.default.E_INVALID_STATUS]: 'reg:invalidStatus',
};

class RegisterSimScreen extends Component<
  RegisterSimScreenProps,
  RegisterSimScreenState
> {
  inputIccid: React.RefObject<TextInput>[];

  defaultIccid: string;

  defaultLastIccid: string;

  lastIccidIdx: number;

  scrollRef: any;

  constructor(props: RegisterSimScreenProps) {
    super(props);

    this.state = initialState;

    this.onSubmit = this.onSubmit.bind(this);
    this.onCamera = this.onCamera.bind(this);
    this.updateIccid = this.updateIccid.bind(this);
    this.onChangeIccid = this.onChangeIccid.bind(this);
    this.onChangeActCode = this.onChangeActCode.bind(this);

    this.inputIccid = [...Array(4)].map(() => React.createRef());
    this.defaultIccid = '12345';
    this.defaultLastIccid = '1234';
    this.lastIccidIdx = 6;
    this.scrollRef = null;
  }

  componentDidMount() {
    const {params} = this.props.route;

    Analytics.trackEvent('Page_View_Count', {page: 'Register Usim'});

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          back={params?.back}
          title={params?.title || i18n.t('sim:reg')}
        />
      ),
    });
  }

  onSubmit() {
    const {actCode} = this.state;
    const iccid = this.state.iccid.join('');
    const {mobile, token} = this.props.account;

    this.props.action.account
      .registerMobile({iccid, code: actCode, mobile, token})
      .then(({payload: resp}) => {
        if (resp.result === 0) {
          this.props.action.order.getSubs({iccid, token});
          this.props.action.account.getAccount({iccid, token});

          AppAlert.info(
            i18n.t('reg:success'),
            i18n.t('appTitle'),
            () =>
              this.props.navigation.canGoBack() &&
              this.props.navigation.goBack(),
          );
        } else {
          AppAlert.error(i18n.t(errCode[resp.result] || 'reg:fail'));
          this.setState(initialState);
        }
        console.log('@@@ resp', resp);
        return resp;
      });
  }

  async onCamera(flag: boolean) {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    const result = await check(permission);
    const hasCameraPermission = result === 'granted';

    if (hasCameraPermission === false) {
      // 카메라 권한을 요청한다.
      AppAlert.confirm(i18n.t('settings'), i18n.t('acc:permCamera'), {
        ok: () => openSettings(),
      });
    } else {
      this.setState({
        scan: flag,
        hasCameraPermission,
      });
    }
  }

  onChangeIccid = (value: string, idx: number) => {
    const {iccid} = this.state;

    this.setState({
      iccid: iccid.map((elm, i) => (i === idx ? value : elm)),
    });

    if (_.size(value) === 5 && idx < 3) {
      this.inputIccid[idx + 1]?.current?.focus();
    } else if (value.length === 4 && idx === 3) {
      Keyboard.dismiss();
    }
  };

  onChangeActCode = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();
    }

    this.setState({
      actCode: value,
    });
  };

  updateIccid(iccid: string) {
    const arr = [] as string[];

    for (let i = 0; i < _.size(iccid) / 5 && i < 4; ) {
      arr.push(iccid.substring(i * 5, ++i * 5));
    }

    this.setState({
      iccid: arr,
    });

    this.props.action.sim.addIccid(iccid);
  }

  renderIccid() {
    const {iccid} = this.state;

    return iccid
      .reduce((acc, cur) => acc.concat([cur, '-']), [] as string[])
      .map((elm, idx) => {
        if (elm === '-') {
          return idx + 1 === _.size(iccid) * 2 ? null : (
            <AppText
              key={`${idx}`}
              style={[
                styles.delimiter,
                {
                  color: _.size(elm) === 5 ? colors.black : colors.greyish,
                },
              ]}>
              -
            </AppText>
          );
        }

        return (
          <AppTextInput
            style={styles.input}
            key={`${idx}`}
            ref={this.inputIccid[idx / 2]}
            placeholder={
              idx === this.lastIccidIdx
                ? this.defaultLastIccid
                : this.defaultIccid
            }
            placeholderTextColor={colors.greyish}
            onChangeText={(value) => this.onChangeIccid(value, idx / 2)}
            keyboardType="numeric"
            returnKeyType="done"
            enablesReturnKeyAutomatically
            maxLength={idx === this.lastIccidIdx ? 4 : 5}
            value={elm}
            blurOnSubmit={false}
            // onFocus={() => {}}
          />
        );
      });
  }

  render() {
    const {scan, iccid, actCode, hasCameraPermission} = this.state;

    const disabled =
      _.size(iccid) !== 4 ||
      !iccid.every((elm, idx) =>
        idx === iccid.length - 1 ? elm.length === 4 : elm.length === 5,
      ) ||
      !actCode ||
      actCode.length < 6 ||
      this.props.pending;

    let iccidIdx = iccid.findIndex((elm) => _.size(elm) !== 5);
    if (iccidIdx < 0) iccidIdx = 3;

    const back = this.props.route.params?.back;

    return (
      <SafeAreaView style={{flex: 1}}>
        <BackbuttonHandler navigation={this.props.navigation} back={back} />
        <AppActivityIndicator visible={this.props.pending} />

        <KeyboardAwareScrollView
          enableOnAndroid
          enableResetScrollToCoords={false}
          innerRef={(ref) => (this.scrollRef = ref)}
          // resetScrollToCoords={{x: 0, y: 0}}
          contentContainerStyle={styles.container}
          extraScrollHeight={50}
          // scrollEnabled={isDeviceSize('small')}
        >
          <Pressable style={styles.card} onPress={() => this.onCamera(!scan)}>
            <ScanSim
              scan={scan}
              hasCameraPermission={hasCameraPermission}
              onScan={({data}: BarCodeReadEvent) => {
                this.setState({
                  scan: false,
                });
                this.updateIccid(data);
              }}
            />
          </Pressable>

          <AppText style={styles.title}>{i18n.t('reg:inputIccid')}</AppText>
          <TouchableOpacity
            onPress={() => this.inputIccid[iccidIdx]?.current?.focus()}
            activeOpacity={1.0}
            style={styles.iccidBox}>
            <AppText style={styles.iccid}>ICCID</AppText>
            <View style={styles.inputBox}>{this.renderIccid()}</View>
          </TouchableOpacity>

          <AppButton
            iconName={scan ? 'iconCameraCancel' : 'iconCamera'}
            style={styles.scanButton}
            title={i18n.t(scan ? 'reg:scanOff' : 'reg:scan')}
            titleStyle={styles.scanTitle}
            onPress={() => this.onCamera(!scan)}
            direction="row"
          />

          <View style={styles.actCodeBox}>
            <View style={styles.actCode}>
              <AppText style={styles.actCodeTitle}>
                {i18n.t('reg:actCode')}
              </AppText>
              <AppTextInput
                style={styles.actCodeInput}
                onChangeText={this.onChangeActCode}
                keyboardType="numeric"
                returnKeyType="done"
                placeholder="123456"
                placeholderTextColor={colors.greyish}
                enablesReturnKeyAutomatically
                maxLength={6}
                onContentSizeChange={({target}) => {
                  if (this.scrollRef)
                    this.scrollRef.props?.scrollToFocusedInput(
                      findNodeHandle(target),
                    );
                }}
                value={actCode}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>

        <AppButton
          style={appStyles.confirm}
          title={i18n.t('reg:confirm')}
          titleStyle={appStyles.medium18}
          onPress={this.onSubmit}
          disabled={disabled}
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, status}: RootState) => ({
    account,
    auth: accountActions.auth(account),
    pending:
      status.pending[accountActions.getAccount.typePrefix] ||
      status.pending[accountActions.registerMobile.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      sim: bindActionCreators(simActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(RegisterSimScreen);
