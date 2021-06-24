import React, {Component} from 'react';
import {StyleSheet, View, TextInput, Dimensions} from 'react-native';
import _ from 'underscore';
import {colors} from '../../../constants/Colors';
import i18n from '../../../utils/i18n';
import AppBackButton from '../../../components/AppBackButton';
import AppButton from '../../../components/AppButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    width: Math.round(Dimensions.get('window').width),
    flexDirection: 'row',
    alignContent: 'center',
    flex: 1,
  },
  searchText: {
    // React Native 6.3버전 미만에서 한글로 글을 쓰는 경우 글씨 크기가 오락가락하는 이슈가 발생
    // 글씨크기의 기본값 17로 설정하는 경우 어느정도 해결할 수 있으므로 설정 변경
    // ... appStyles.normal14Text,
    color: colors.black,
    fontSize: 17,
    flex: 1,
  },
  showSearchBar: {
    marginRight: 30,
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
  },
  titleBottom: {
    height: 1,
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: colors.black,
  },
});

export default class HeaderTitle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchWord: '',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.searchWord !== this.state.searchWord ||
      this.props.searchWord !== nextProps.searchWord ||
      this.props.searchWord !== this.state.searchWord ||
      this.props.navigation !== nextProps.navigation
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.props.searchWord &&
        this.props.searchWord !== prevProps.searchWord) ||
      _.isEmpty(prevState.searchWord)
    ) {
      this.setState({
        searchWord: this.props.searchWord,
      });
    }
  }

  onChangeText = (key) => (value) => {
    this.setState({
      [key]: value,
    });
    this.props.search && this.props.search(value, false);
  };

  search(searchWord) {
    this.props.search && this.props.search(searchWord, true);
  }

  render() {
    const {searchWord} = this.state;
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.headerTitle}>
          <AppBackButton />
          <TextInput
            style={styles.searchText}
            placeholder={i18n.t('store:search')}
            placeholderTextColor={colors.greyish}
            returnKeyType="search"
            enablesReturnKeyAutomatically
            clearButtonMode="always"
            onSubmitEditing={() => this.search(searchWord)}
            onChangeText={this.onChangeText('searchWord')}
            value={searchWord}
          />
          <AppButton
            style={styles.showSearchBar}
            onPress={() => this.search(searchWord)}
            iconName="btnSearchOff"
          />
        </View>
        <View style={styles.titleBottom} />
      </View>
    );
  }
}
