import React, {Component} from 'react';
import {StyleSheet, Text, View, Platform, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Video from 'react-native-video';
import Analytics from 'appcenter-analytics';
import _ from 'underscore';
import {TouchableOpacity, TextInput} from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {API} from '@/redux/api';
import {
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {
  actions as profileActions,
  ProfileAction,
  ProfileModelState,
} from '@/redux/modules/profile';
import {
  actions as cartActions,
  CartAction,
  CartModelState,
} from '@/redux/modules/cart';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import AppButton from '@/components/AppButton';
import AddressCard from '@/components/AddressCard';
import PaymentItemInfo from '@/components/PaymentItemInfo';
import {isAndroid} from '@/components/SearchBarAnimation/utils';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import Env from '@/environment';
import Triangle from '@/components/Triangle';
import AppIcon from '@/components/AppIcon';
import api from '@/redux/api/api';
import AppAlert from '@/components/AppAlert';
import {RootState} from '@/redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  HomeStackParamList,
  PaymentParams,
  PymMethodScreenMode,
} from '@/navigation/navigation';
import {RouteProp} from '@react-navigation/native';
import {createPaymentResultForRokebiCash} from '@/redux/models/paymentResult';
import {PaymentMethod} from '@/redux/api/paymentApi';
import {RkbInfo} from '@/redux/api/pageApi';
import {Currency} from '@/redux/api/productApi';
import utils from '@/redux/api/utils';

const {esimApp} = Env.get();
const {deliveryText} = API.Order;
const loadingImg = require('../assets/images/loading_1.mp4');

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 37,
    color: colors.black,
    fontSize: isDeviceSize('small') ? 12 : 14,
    paddingVertical: 8,
  },
  inputAndroid: {
    height: 37,
    fontSize: 12,
    lineHeight: 20,
    paddingVertical: 8,
    color: colors.black,
  },
  iconContainer: {
    top: 8,
    right: 10,
    paddingVertical: 8,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  },
  divider: {
    // marginTop: 20,
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // marginTop: 15,
    // marginHorizontal: 20,
  },
  buttonText: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    color: colors.warmGrey,
  },
  addrCardText: {
    ...appStyles.normal14Text,
    color: colors.black,
    lineHeight: 24,
  },
  addrBtn: {
    height: 48,
    borderRadius: 3,
    // marginHorizontal: 20,
    marginTop: 0,
  },
  profileTitle: {
    marginBottom: 6,
    flex: 1,
    flexDirection: 'row',
  },
  profileTitleText: {
    color: colors.black,
    alignItems: 'flex-start',
    marginRight: 20,
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  chgButtonText: {
    ...appStyles.normal12Text,
    color: colors.white,
  },
  chgButton: {
    width: 50,
    height: 36,
    borderRadius: 3,
    backgroundColor: colors.warmGrey,
    marginLeft: 20,
  },
  basicAddr: {
    ...appStyles.normal12Text,
    width: 52,
    height: isAndroid() ? 15 : 12,
    lineHeight: isAndroid() ? 15 : 12,
    fontSize: isAndroid() ? 11 : 12,
    color: colors.clearBlue,
    alignSelf: 'center',
  },
  basicAddrBox: {
    width: 68,
    height: 22,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.clearBlue,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  result: {
    justifyContent: 'center',
    height: isDeviceSize('small') ? 200 : 255,
  },
  resultText: {
    ...appStyles.normal16Text,
    color: colors.warmGrey,
    textAlign: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  spaceBetweenBox: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boldTitle: {
    ...appStyles.bold18Text,
    color: colors.black,
    lineHeight: 22,
    // marginTop: 20,
    alignSelf: 'center',
  },
  dropDownIcon: {
    flexDirection: 'column',
    alignSelf: 'flex-end',
  },
  thickBar: {
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    // marginVertical: 20,
    marginBottom: 30,
  },
  pickerWrapper: {
    ...appStyles.borderWrapper,
    height: 40,
    borderColor: colors.lightGrey,
    paddingLeft: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },
  textField: {
    borderRadius: 3,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    marginTop: 15,
    height: 100,
    alignItems: 'flex-start',
  },
  alignCenter: {
    alignSelf: 'center',
    marginRight: 15,
  },
  normal16BlueTxt: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
    lineHeight: 24,
    letterSpacing: 0.24,
  },
  normal12TxtLeft: {
    ...appStyles.normal12Text,
    color: colors.black,
    textAlign: 'left',
    lineHeight: 14,
    textAlignVertical: 'center',
  },
  underlinedClearBlue: {
    color: colors.clearBlue,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
  beforeDrop: {
    marginHorizontal: 20,
    marginBottom: 45,
  },
  benefit: {
    backgroundColor: colors.whiteTwo,
    padding: 15,
    marginTop: 20,
  },
});

const buttonStyle = (
  idx: number,
  column: number,
  key: number,
  row: number,
) => ({
  // key, idx => 현위치 / row, column -> selected
  width: '33.3%',
  height: 62,
  backgroundColor: colors.white,
  borderStyle: 'solid' as const,
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderLeftWidth: idx === 0 ? 1 : 0,
  borderTopWidth: key === 0 ? 1 : 0,
  borderLeftColor:
    column === 0 && key === row ? colors.clearBlue : colors.lightGrey,
  borderTopColor:
    row === 0 && idx === column ? colors.clearBlue : colors.lightGrey,
  borderRightColor:
    (idx === column || idx === column - 1) && key === row
      ? colors.clearBlue
      : colors.lightGrey,
  borderBottomColor:
    (key === row || key === row - 1) && idx === column
      ? colors.clearBlue
      : colors.lightGrey,
});

type PymMethodScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'PymMethod'
>;

type PymMethodScreenRouteProp = RouteProp<HomeStackParamList, 'PymMethod'>;

type PymMethodScreenProps = {
  navigation: PymMethodScreenNavigationProp;
  route: PymMethodScreenRouteProp;

  account: AccountModelState;
  cart: CartModelState;
  profile: ProfileModelState;

  action: {
    profile: ProfileAction;
    cart: CartAction;
  };
};

type ShowModal = 'address' | 'memo' | 'method';

type PymMethodScreenState = {
  mode?: PymMethodScreenMode;
  selected: PaymentMethod;
  pymPrice?: Currency;
  deduct?: Currency;
  isRecharge?: boolean;
  clickable: boolean;
  loading?: boolean;
  data?: RkbInfo[];
  showModal: {
    [m in ShowModal]: boolean;
  };
  label?: string;
  deliveryMemo: {
    directInput: boolean;
    header?: string;
    selected?: string;
    content?: string;
  };
  consent?: boolean;
  simIncluded?: boolean;
  row?: string;
  column?: number;
};

class PymMethodScreen extends Component<
  PymMethodScreenProps,
  PymMethodScreenState
> {
  constructor(props: PymMethodScreenProps) {
    super(props);

    this.state = {
      selected: API.Payment.method[0][0],
      clickable: true,
      showModal: {
        address: true,
        memo: true,
        method: true,
      },
      label: Platform.OS === 'android' ? undefined : i18n.t('pym:selectMemo'),
      deliveryMemo:
        Platform.OS === 'android'
          ? {
              directInput: false,
              header: i18n.t('pym:notSelected'),
              selected: undefined,
              content: i18n.t('pym:notSelected'),
            }
          : {
              directInput: false,
              header: undefined,
              selected: undefined,
              content: undefined,
            },
      consent: undefined,
      simIncluded: undefined,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onPress = this.onPress.bind(this);
    this.button = this.button.bind(this);
    this.address = this.address.bind(this);
    this.memo = this.memo.bind(this);
    this.changePlaceHolder = this.changePlaceHolder.bind(this);
    this.method = this.method.bind(this);
    this.saveMemo = this.saveMemo.bind(this);
    this.showModal = this.showModal.bind(this);
    this.move = this.move.bind(this);
    this.consentEssential = this.consentEssential.bind(this);
    this.consentBox = this.consentBox.bind(this);
    this.dropDownHeader = this.dropDownHeader.bind(this);
    this.inputMemo = this.inputMemo.bind(this);
    this.benefit = this.benefit.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          title={i18n.t('payment')}
          isPaid={this.props.route.params?.isPaid}
        />
      ),
    });

    if (!esimApp) {
      const {uid, token} = this.props.account;
      // ESIM이 아닌 경우에만 주소 정보가 필요하다.
      this.props.action.profile.getCustomerProfile({uid, token});
    }

    const {pymPrice, deduct} = this.props.cart;
    const {content} = this.props.profile;
    const mode = this.props.route.params?.mode;

    Analytics.trackEvent('Page_View_Count', {page: `Payment - ${mode}`});

    this.setState((state) => ({
      pymPrice,
      deduct,
      isRecharge:
        this.props.cart.purchaseItems.findIndex(
          (item) => item.type === 'rch',
        ) >= 0,
      simIncluded:
        this.props.cart.purchaseItems.findIndex(
          (item) => item.type === 'sim_card',
        ) >= 0,
      deliveryMemo: {
        ...state.deliveryMemo,
        content,
      },
      mode,
    }));
    this.benefit();
  }

  async onSubmit() {
    if (!this.state.clickable) return;

    this.setState({
      clickable: false,
    });

    const {selected, pymPrice, deduct, deliveryMemo, simIncluded, mode} =
      this.state;
    const memo =
      deliveryMemo.selected === i18n.t('pym:input')
        ? deliveryMemo.content
        : deliveryMemo.selected;

    if (_.isEmpty(selected) && pymPrice?.value !== 0) return;

    const {mobile, email} = this.props.account;
    const profileId =
      this.props.profile.selectedAddr ||
      this.props.profile.profile.find((item) => item.isBasicAddr)?.uuid;
    const dlvCost =
      this.props.cart.pymReq?.find((item) => item.key === 'dlvCost')?.amount ||
      utils.toCurrency(0, pymPrice?.currency);

    // 로깨비캐시 결제
    if (pymPrice?.value === 0) {
      this.setState({
        loading: true,
      });
      const {impId} = Env.get();
      const response = createPaymentResultForRokebiCash({
        impId,
        mobile,
        profileId,
        memo,
        deduct,
        dlvCost,
        digital: !simIncluded,
      });
      // payNorder에서 재고 확인 - resp.result값으로 비교
      this.props.action.cart.payNorder(response).then(({payload: resp}) => {
        if (resp.result === 0) {
          this.props.navigation.setParams({isPaid: true});
          this.props.navigation.replace('PaymentResult', {
            pymResult: response,
            orderResult: resp,
            mode,
          });
        } else {
          this.setState({
            loading: false,
            clickable: true,
          });
          if (resp.result === api.E_RESOURCE_NOT_FOUND) {
            AppAlert.info(i18n.t('cart:soldOut'));
          } else {
            AppAlert.info(i18n.t('cart:systemError'));
          }
        }
      });
    } else {
      const params = {
        pg: selected?.key,
        pay_method: selected?.method,
        merchant_uid: `mid_${mobile}_${new Date().getTime()}`,
        name: i18n.t('appTitle'),
        amount: pymPrice?.value, // 최종 결제 금액
        rokebi_cash: deduct?.value, // balance 차감 금액
        buyer_tel: mobile,
        buyer_name: mobile,
        buyer_email: email,
        escrow: false,
        app_scheme: esimApp ? 'rokebiesim' : 'Rokebi',
        profile_uuid: profileId,
        dlvCost: dlvCost.value,
        digital: !simIncluded, // 컨텐츠 - 데이터상품일 경우 true
        memo,
        // mode: 'test'
      } as PaymentParams;

      this.setState({
        clickable: true,
      });
      this.props.navigation.navigate('Payment', {params});
    }
  }

  onPress = (method: PaymentMethod, key: string, idx: number) => () => {
    this.setState({
      selected: method,
      row: key,
      column: idx,
    });
  };

  button(key: string, value: PaymentMethod[]) {
    const {selected, row = '0', column = 0} = this.state;

    return (
      <View key={key} style={styles.buttonRow}>
        {
          // key: row, idx: column
          value.map(
            (v, idx) =>
              !_.isEmpty(v) && (
                <AppButton
                  key={v.method}
                  title={_.isEmpty(v.icon) ? i18n.t(v.title) : undefined}
                  style={buttonStyle(
                    idx,
                    column,
                    parseInt(key, 10),
                    parseInt(row, 10),
                  )}
                  iconName={v.icon}
                  checked={v === selected}
                  onPress={this.onPress(v, key, idx)}
                  titleStyle={styles.buttonText}
                />
              ),
          )
        }
      </View>
    );
  }

  saveMemo(value: string) {
    const selectedMemo = deliveryText.find((item) => item.value === value);

    if (!!selectedMemo) {
      if (deliveryText.indexOf(selectedMemo) + 1 === deliveryText.length) {
        this.setState((state) => ({
          deliveryMemo: {
            ...state.deliveryMemo,
            directInput: true,
            header: selectedMemo?.key,
            selected: value,
          },
        }));
      } else {
        this.setState({
          deliveryMemo: {
            directInput: false,
            header: selectedMemo?.key,
            selected: value,
          },
        });
      }
    }
  }

  showModal(key: ShowModal) {
    this.setState((state) => ({
      showModal: {
        ...state.showModal,
        [key]: !state.showModal[key],
      },
    }));
  }

  dropDownHeader(stateTitle: ShowModal, title: string, alias?: string) {
    return (
      <TouchableOpacity
        style={styles.spaceBetweenBox}
        onPress={() => this.showModal(stateTitle)}>
        <Text style={styles.boldTitle}>{title}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          {!this.state.showModal[stateTitle] && (
            <Text style={[styles.alignCenter, styles.normal16BlueTxt]}>
              {alias}
            </Text>
          )}
          <AppButton
            style={{backgroundColor: colors.white, height: 70}}
            iconName={
              this.state.showModal[stateTitle] ? 'iconArrowUp' : 'iconArrowDown'
            }
            iconStyle={styles.dropDownIcon}
          />
        </View>
      </TouchableOpacity>
    );
  }

  inputMemo(val: string) {
    this.setState((state) => ({
      deliveryMemo: {
        ...state.deliveryMemo,
        content: val,
      },
    }));
  }

  address() {
    const selectedAddr = this.props.profile.selectedAddr || undefined;
    const {profile} = this.props.profile;
    const item =
      profile.find((i) => i.uuid === selectedAddr) ||
      profile.find((i) => i.isBasicAddr);

    return item ? (
      <View>
        {this.dropDownHeader('address', i18n.t('pym:delivery'), item.alias)}
        {this.state.showModal.address && (
          <View style={styles.beforeDrop}>
            <View style={styles.thickBar} />
            {
              // 주소
              this.props.profile.profile.length > 0 && (
                <View>
                  <View style={styles.profileTitle}>
                    <Text style={styles.profileTitleText}>{item.alias}</Text>
                    {item.isBasicAddr && (
                      <View style={styles.basicAddrBox}>
                        <Text style={styles.basicAddr}>
                          {i18n.t('addr:basicAddr')}
                        </Text>
                      </View>
                    )}
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <AppButton
                        title={i18n.t('change')}
                        titleStyle={styles.chgButtonText}
                        style={[styles.chgButton]}
                        onPress={() =>
                          this.props.navigation.navigate('CustomerProfile')
                        }
                      />
                    </View>
                  </View>
                  <AddressCard
                    textStyle={styles.addrCardText}
                    mobileStyle={[
                      styles.addrCardText,
                      {color: colors.warmGrey},
                    ]}
                    profile={item}
                  />
                </View>
              )
            }
            {
              // 주소 등록
              // == 0
              this.props.profile.profile.length === 0 && (
                <AppButton
                  title={i18n.t('reg:address')}
                  titleStyle={appStyles.confirmText}
                  style={[appStyles.confirm, styles.addrBtn]}
                  onPress={() => this.props.navigation.navigate('AddProfile')}
                />
              )
            }
          </View>
        )}
        <View style={styles.divider} />
      </View>
    ) : null;
  }

  changePlaceHolder() {
    if (_.isEmpty(this.state.deliveryMemo.selected)) {
      this.setState({
        label: undefined,
      });
      this.saveMemo(deliveryText[0].key);
    }
  }

  memo() {
    const {label} = this.state;
    return (
      <View>
        {this.dropDownHeader(
          'memo',
          i18n.t('pym:deliveryMemo'),
          this.state.deliveryMemo.header,
        )}
        {this.state.showModal.memo && (
          <View style={styles.beforeDrop}>
            <View style={styles.thickBar} />
            <View style={styles.pickerWrapper}>
              <RNPickerSelect
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={!_.isEmpty(label) ? {label} : {}}
                placeholderTextColor={colors.warmGrey}
                onValueChange={(value) => this.saveMemo(value)}
                onOpen={this.changePlaceHolder}
                items={deliveryText.map((item) => ({
                  label: item.value,
                  value: item.value,
                }))}
                value={this.state.deliveryMemo.selected}
                Icon={() => (
                  <Triangle width={8} height={6} color={colors.warmGrey} />
                )}
              />
            </View>
            {this.state.deliveryMemo.directInput && (
              <TextInput
                placeholder={i18n.t('pym:IputMemo')}
                placeholderTextColor={colors.warmGrey}
                style={styles.textField}
                // clearTextOnFocus={true}
                maxLength={50}
                returnKeyType="done"
                multiline
                value={this.state.deliveryMemo.content || ''}
                enablesReturnKeyAutomatically
                onChangeText={(val) => this.inputMemo(val)}
                // maxFontSizeMultiplier
              />
            )}
          </View>
        )}
        <View style={styles.divider} />
      </View>
    );
  }

  method() {
    const {selected, data} = this.state;
    const benefit = selected
      ? data?.find((item) => item.title.indexOf(selected.title) >= 0)
      : undefined;

    return (
      <View>
        {this.dropDownHeader(
          'method',
          i18n.t('pym:method'),
          selected?.title ? i18n.t(selected?.title) : '',
        )}
        {this.state.showModal.method && (
          <View style={styles.beforeDrop}>
            <View style={styles.thickBar} />
            {API.Payment.method.map((v, idx) => this.button(`${idx}`, v))}
            {/* 
            // 토스 간편결제 추가로 현재 불필요
            <Text style={{marginVertical: 20, color: colors.clearBlue}}>
              {i18n.t('pym:tossInfo')}
            </Text> 
            */}
            {benefit && (
              <View style={styles.benefit}>
                <Text style={[styles.normal12TxtLeft, {marginBottom: 5}]}>
                  {benefit.title}
                </Text>
                <Text
                  style={[styles.normal12TxtLeft, {color: colors.warmGrey}]}>
                  {benefit.body}
                </Text>
              </View>
            )}
          </View>
        )}
        <View style={styles.divider} />
      </View>
    );
  }

  move(key: '1' | '2') {
    const param =
      key === '1'
        ? {
            key: 'setting:privacy',
            title: i18n.t('pym:privacy'),
          }
        : {
            key: 'pym:agreement',
            title: i18n.t('pym:paymentAgency'),
          };

    Analytics.trackEvent('Page_View_Count', {page: param.key});
    this.props.navigation.navigate('SimpleText', param);
  }

  consentEssential() {
    this.setState((state) => ({
      consent: !state.consent,
    }));
  }

  benefit() {
    API.Page.getPageByCategory('pym:benefit')
      .then((resp) => {
        if (resp.result === 0 && resp.objects.length > 0) {
          console.log('benefit resp', resp);
          this.setState({
            data: resp.objects,
          });
        }
      })
      .catch((err) => {
        console.log('failed to get page', err);
      });
  }

  consentBox() {
    return (
      <View style={{backgroundColor: colors.whiteTwo, paddingBottom: 45}}>
        <TouchableOpacity
          style={styles.rowCenter}
          onPress={() => this.consentEssential()}>
          <AppIcon name="btnCheck2" checked={this.state.consent} size={22} />
          <Text
            style={[
              appStyles.bold16Text,
              {color: colors.black, marginLeft: 12},
            ]}>
            {i18n.t('pym:consentEssential')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.spaceBetweenBox]}
          onPress={() => this.move('1')}>
          <Text
            style={[
              appStyles.normal14Text,
              {color: colors.warmGrey, lineHeight: 22},
            ]}>
            {i18n.t('pym:privacy')}
          </Text>
          <Text style={styles.underlinedClearBlue}>{i18n.t('pym:detail')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.spaceBetweenBox}
          onPress={() => this.move('2')}>
          <Text
            style={[
              appStyles.normal14Text,
              {color: colors.warmGrey, lineHeight: 22},
            ]}>
            {i18n.t('pym:paymentAgency')}
          </Text>
          <Text style={styles.underlinedClearBlue}>{i18n.t('pym:detail')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {selected, pymPrice, deduct, isRecharge, consent, simIncluded} =
      this.state;
    const {purchaseItems = [], pymReq} = this.props.cart;
    const noProfile = this.props.profile.profile.length === 0;

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{x: 0, y: 0}}
          enableOnAndroid>
          <PaymentItemInfo
            cart={purchaseItems}
            pymReq={pymReq}
            mode="method"
            pymPrice={pymPrice}
            deduct={deduct}
            isRecharge={isRecharge}
          />

          {simIncluded && this.address()}
          {simIncluded && this.memo()}
          {pymPrice?.value !== 0 ? (
            this.method()
          ) : (
            <View style={styles.result}>
              <Text style={styles.resultText}>{i18n.t('pym:balPurchase')}</Text>
            </View>
          )}
          {this.consentBox()}
          <AppButton
            title={i18n.t('payment')}
            titleStyle={appStyles.confirmText}
            disabled={
              (pymPrice?.value !== 0 && _.isEmpty(selected)) ||
              (simIncluded && noProfile) ||
              !consent
            }
            key={i18n.t('payment')}
            onPress={this.onSubmit}
            style={appStyles.confirm}
          />
        </KeyboardAwareScrollView>

        {
          // 로깨비캐시 결제시 필요한 로딩처리
          this.state.loading && (
            <Video
              source={loadingImg}
              resizeMode="stretch"
              repeat
              style={styles.backgroundVideo}
            />
          )
        }
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, cart, profile}: RootState) => ({
    account,
    cart,
    auth: accountActions.auth(account),
    profile,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      profile: bindActionCreators(profileActions, dispatch),
    },
  }),
)(PymMethodScreen);
