import React, {Component, memo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as accountActions} from '@/redux/modules/account';
import {actions as profileActions} from '@/redux/modules/profile';
import _ from 'underscore';
import AppBackButton from '@/components/AppBackButton';
import AddressCard from '@/components/AddressCard';
import {colors} from '@/constants/Colors';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import {isAndroid} from '@/components/SearchBarAnimation/utils';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {RootState} from '@/redux';

const styles = StyleSheet.create({
  container: {
    ...appStyles.container,
    alignItems: 'stretch',
  },
  cardSize: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  addrCard: {
    marginLeft: 20,
    marginBottom: 17,
    width: '65%',
  },
  addrCardText: {
    ...appStyles.normal14Text,
    color: colors.black,
    lineHeight: 24,
  },
  profileTitle: {
    marginBottom: 6,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileTitleText: {
    color: colors.black,
    height: 19,
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  chgButtonText: {
    fontSize: 12,
    lineHeight: 19,
    fontWeight: 'normal',
    color: colors.warmGrey,
    paddingHorizontal: 15,
  },
  buttonBorder: {
    width: 1,
    height: 20,
    marginTop: 19,
    backgroundColor: colors.lightGrey,
  },
  colorWarmGrey: {
    color: colors.warmGrey,
  },
  checkedBorder: {
    borderColor: colors.clearBlue,
  },
  checkedColor: {
    color: colors.clearBlue,
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
  updateOrDeleteBtn: {
    paddingTop: 19,
    paddingBottom: 9,
  },
  checkButton: {
    width: 62,
    height: 56,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    padding: 20,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    height: isDeviceSize('small') ? 400 : 710,
  },
  emptyText: {
    alignSelf: 'center',
  },
});

const Profile0 = ({
  checked,
  item,
  onChecked,
  deleteProfile,
  addProfile,
}: {
  checked: string;
  item: object;
  onChecked: (v: string) => void;
  deleteProfile: (v: string) => void;
  addProfile: () => void;
}) => {
  return (
    <View
      style={[styles.cardSize, checked === item.uuid && styles.checkedBorder]}>
      <View>
        <View style={styles.profileTitle}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                paddingTop: 19,
              }}>
              <Text
                style={[
                  styles.profileTitleText,
                  checked === item.uuid && styles.checkedColor,
                ]}>
                {item.alias}
              </Text>
              {item.isBasicAddr && (
                <View style={styles.basicAddrBox}>
                  <Text style={styles.basicAddr}>
                    {i18n.t('addr:basicAddr')}
                  </Text>
                </View>
              )}
            </View>
            <View style={{flexDirection: 'row'}}>
              <AppButton
                title={i18n.t('modify')}
                style={styles.updateOrDeleteBtn}
                titleStyle={styles.chgButtonText}
                onPress={addProfile}
              />
              <View style={styles.buttonBorder} />
              <AppButton
                title={i18n.t('delete')}
                style={styles.updateOrDeleteBtn}
                titleStyle={[styles.chgButtonText, {paddingRight: 20}]}
                onPress={() => deleteProfile(item.uuid)}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <AddressCard
            textStyle={styles.addrCardText}
            mobileStyle={[styles.addrCardText, styles.colorWarmGrey]}
            style={styles.addrCard}
            key={item.uuid}
            profile={item}
          />
          <TouchableOpacity
            style={styles.checkButton}
            onPress={() => onChecked(item.uuid)}>
            <AppIcon
              name="btnCheck"
              key={item.uuid}
              checked={checked === item.uuid || false}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const Profile = memo(Profile0);

class CustomerProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('pym:delivery')} />,
    });

    this.state = {
      checked: undefined,
      profile: undefined,
    };

    this._isEmptyList = this._isEmptyList.bind(this);
  }

  componentDidMount() {
    this.props.action.profile.getCustomerProfile(this.props.account);
    this.setState({
      checked:
        this.props.profile.selectedAddr ||
        this.props.profile.profile.find((item) => item.isBasicAddr).uuid,
    });
  }

  componentDidUpdate(prevProps) {
    if (_.isUndefined(this.props.profile.selectedAddr)) {
      if (prevProps.profile.profile != this.props.profile.profile) {
        const profile = this.props.profile.profile.find(
          (item) => item.isBasicAddr,
        );
        if (profile) {
          this.setState({
            checked: profile.uuid,
          });
        }
      }
    }
  }

  _renderItem = ({item}) => {
    const {account, action, navigation} = this.props;
    return (
      <Profile
        item={item}
        checked={this.state.checked}
        onChecked={(uuid: string) => {
          action.profile.selectedAddr(uuid);
          navigation.goBack();
        }}
        deleteProfile={(uuid: string) => {
          action.profile.profileDelAndGet(uuid, account);
        }}
        addProfile={() =>
          navigation.navigate('AddProfile', {
            update: item,
          })
        }
      />
    );
  };

  _isEmptyList() {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.emptyText}>{i18n.t('addr:noProfile')}</Text>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'never', bottom: 'always'}}>
        <AppActivityIndicator visible={this.props.pending} />
        <FlatList
          data={this.props.profile.profile}
          keyExtractor={(item) => item.uuid}
          renderItem={this._renderItem}
          ListEmptyComponent={this._isEmptyList}
          extraData={this.state.checked}
        />

        <AppButton
          title={i18n.t('add')}
          textStyle={appStyles.confirmText}
          onPress={() => this.props.navigation.navigate('AddProfile')}
          style={[appStyles.confirm, {marginTop: 20}]}
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, profile, status}: RootState) => ({
    account,
    auth: accountActions.auth(account),
    profile,
    pending:
      status.pending[profileActions.profileAddAndGet.typePrefix] ||
      status.pending[profileActions.updateCustomerProfile.typePrefix] ||
      status.pending[profileActions.getCustomerProfile.typePrefix] ||
      status.pending[profileActions.profileDelAndGet.typePrefix] ||
      false,
  }),
  // export default CustomerProfileScreen
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      profile: bindActionCreators(profileActions, dispatch),
    },
  }),
)(CustomerProfileScreen);
