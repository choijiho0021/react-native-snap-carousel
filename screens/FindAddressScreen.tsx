import React, {Component, memo} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import i18n from '@/utils/i18n';
import {actions as profileActions} from '@/redux/modules/profile';
import {TextField} from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/Ionicons';
import AppButton from '@/components/AppButton';
import {FlatList} from 'react-native-gesture-handler';
import Address from '@/components/Address';
import _ from 'underscore';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppBackButton from '@/components/AppBackButton';
import AppIcon from '@/components/AppIcon';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {API} from '@/submodules/rokebi-utils';

const styles = StyleSheet.create({
  container: {
    ...appStyles.container,
    alignItems: 'stretch',
  },
  field: {
    height: 46,
  },
  showSearchBar: {
    position: 'absolute',
    top: 10,
    right: isDeviceSize('small') ? -10 : 0,
    alignSelf: 'flex-end',
    width: 50,
    height: 50,
  },
  searchIcon: {
    width: 15,
    height: 16,
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  divider: {
    marginHorizontal: 0,
    marginTop: 20,
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 0,
    left: 0,
    right: 0,
  },
  textFieldBox: {
    borderBottomColor: colors.black,
    marginHorizontal: 20,
    height: 50,
  },
  searchEx: {
    ...appStyles.normal14Text,
    letterSpacing: 0.15,
    lineHeight: 30,
  },
  mrgLeft40Top20: {
    marginLeft: 40,
    marginTop: 20,
  },
  boldText16: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: 'bold',
    color: colors.black,
  },
  paginationBox: {
    width: 44,
    height: 44,
    flexDirection: 'row',
    backgroundColor: colors.clearBlue,
  },
  paginationButton: {
    width: '100%',
    height: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  paginationText: {
    color: colors.black,
    height: 19,
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  dataCard: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
});

const FindAddressListItem0 = ({item, onPress}) => {
  return (
    <TouchableOpacity style={styles.dataCard} onPress={onPress(item)}>
      <Address item={item} />
    </TouchableOpacity>
  );
};

const FindAddressListItem = memo(FindAddressListItem0);

class FindAddressScreen extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('purchase:address')} />,
    });

    this.state = {
      addr: undefined,
      links: undefined,
      data: [],
    };

    this._onChangeText = this._onChangeText.bind(this);
    this._findAddr = this._findAddr.bind(this);
    this._renderItem = this._renderItem.bind(this);
  }

  _onChangeText = (key) => (value) => {
    this.setState({
      [key]: value,
    });
    if (_.isEmpty(value)) {
      this.setState({
        data: [],
      });
    }
  };

  _search() {
    return (
      <Icon
        name={Platform.OS == 'ios' ? 'ios-search' : 'md-search'}
        size={32}
      />
    );
  }

  _findAddr = (page = 1) => () => {
    const {addr} = this.state;

    API.Address.find(addr, page).then((resp) => {
      this.setState({
        links: resp.links,
        data: resp.objects,
      });
    });
  };

  _onPress = (addr) => () => {
    //리덕스 저장
    this.props.action.profile.updateProfileAddress(addr);
    this.props.navigation.goBack();
  };

  _renderPagination() {
    const {links} = this.state,
      {totalCount = 0, countPerPage = 1, currentPage = 1} =
        _.isArray(links) && links.length > 0 ? links[0] : {},
      totalPage = Math.ceil(Number(totalCount) / Number(countPerPage));
    const minDisabled = currentPage == 1 ? true : false;
    const maxDisabled = currentPage == totalPage ? true : false;

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.paginationBox, minDisabled && styles.disabledButton]}
          disabled={minDisabled}
          onPress={this._findAddr(Math.max(1, Number(currentPage) - 1))}>
          <AppIcon name="iconArrowLeftWhite" style={styles.paginationButton} />
        </TouchableOpacity>
        <Text
          style={styles.paginationText}>{`${currentPage} / ${totalPage}`}</Text>
        <TouchableOpacity
          style={[styles.paginationBox, maxDisabled && styles.disabledButton]}
          disabled={maxDisabled}
          onPress={this._findAddr(
            Math.min(totalPage, Number(currentPage) + 1),
          )}>
          <AppIcon name="iconArrowRightWhite" style={styles.paginationButton} />
        </TouchableOpacity>
      </View>
    );
  }

  _renderItem({item}) {
    return <FindAddressListItem item={item} onPress={this._onPress} />;
  }

  render() {
    const {addr, data} = this.state;

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'never', bottom: 'always'}}>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View style={styles.modal}>
            <View style={styles.textFieldBox}>
              <TextField
                containerStyle={styles.field}
                inputContainerStyle={{paddingTop: 5, height: 55}}
                style={{fontSize: 14, width: '80%'}}
                label={i18n.t('purchase:findAddr')}
                labelOffset={{y0: 2}}
                labelTextStyle={{height: 20, textAlignVertical: 'bottom'}}
                returnKeyType="done"
                enablesReturnKeyAutomatically={true}
                onChangeText={this._onChangeText('addr')}
                onEndEditing={this._findAddr()}
                renderAccessory={this._search}
                value={addr}
              />
              <AppButton
                style={styles.showSearchBar}
                iconStyle={styles.searchIcon}
                onPress={this._findAddr()}
                iconName="btnSearchOff"
              />
            </View>
            <View style={styles.divider} />
            {addr && data ? (
              <FlatList
                data={data}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.bdMgtSn}
                scroll
              />
            ) : (
              <View style={styles.mrgLeft40Top20}>
                <Text style={(styles.searchEx, styles.boldText16)}>
                  {i18n.t('purchase:searchEx')}
                </Text>
                <Text style={styles.searchEx}>
                  {i18n.t('purchase:roadBuildingNo')}
                </Text>
                <Text style={styles.searchEx}>
                  {i18n.t('purchase:areaBunji')}
                </Text>
                <Text style={styles.searchEx}>
                  {i18n.t('purchase:areaBuilding')}
                </Text>
              </View>
            )}
            {!_.isEmpty(data) && this._renderPagination()}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

// export default FindAddressScreen
export default connect(undefined, (dispatch) => ({
  action: {
    profile: bindActionCreators(profileActions, dispatch),
  },
}))(FindAddressScreen);
