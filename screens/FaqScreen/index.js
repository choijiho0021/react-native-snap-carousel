import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import _ from 'underscore';
import i18n from '../../utils/i18n';
import AppBackButton from '../../components/AppBackButton';
import AppActivityIndicator from '../../components/AppActivityIndicator';
import {colors} from '../../constants/Colors';
import {API} from '../../submodules/rokebi-utils';
import FaqList from './components/FaqList';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  tabBar: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
});

class FaqScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      querying: false,
      index: 0,
      routes: [
        {key: 'general', title: i18n.t('faq:general')},
        {key: 'config', title: i18n.t('faq:config')},
        {key: 'payment', title: i18n.t('faq:payment')},
        {key: 'etc', title: i18n.t('faq:etc')},
      ],
      general: [],
      payment: [],
      config: [],
      etc: [],
    };

    this.onPress = this.onPress.bind(this);
    this.onIndexChange = this.onIndexChange.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.renderScene = this.renderScene.bind(this);
  }

  componentDidMount() {
    const {params} = this.props.route;
    const key = params && params.key ? params.key : undefined;
    const num = params && params.num ? params.num : undefined;

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          navigation={this.props.navigation}
          title={i18n.t('contact:faq')}
        />
      ),
    });

    const index = this.state.routes.findIndex((item) => item.key === key);
    if (index > 0) {
      this.setState({
        index,
        selectedTitleNo: num,
      });
    }

    this.refreshData(index > 0 ? index : 0);
  }

  shouldComponentUpdate() {
    const {key} = this.props.route.params || {};
    return _.isEmpty(key) ? true : !_.isEmpty(this.state[key]);
  }

  onPress = (key) => {
    console.log('goto screen', key);
    this.props.navigation.navigate('BoardMsgResp', {key});
  };

  onIndexChange(index) {
    this.refreshData(index);

    this.setState({
      index,
      selectedTitleNo: undefined,
    });
  }

  refreshData(index) {
    if (index < 0 || index >= this.state.routes.length) return;

    const {key} = this.state.routes[index];
    if (this.state[key].length > 0) return;

    this.setState({
      querying: true,
    });

    API.Page.getPageByCategory(`faq:${key}`)
      .then((resp) => {
        if (resp.result === 0 && resp.objects.length > 0) {
          this.setState({
            [key]: resp.objects,
          });
        } else throw new Error(`failed to get page:${key}`);
      })
      .catch((err) => {
        console.log('failed to get page', key, err);
      })
      .finally(() => {
        this.setState({
          querying: false,
        });
      });
  }

  renderScene = ({route, jumpTo}) => {
    return (
      <FaqList
        data={this.state[route.key]}
        jumpTp={jumpTo}
        titleNo={this.state.selectedTitleNo}
      />
    );
  };

  renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        tabStyle={{backgroundColor: colors.whiteTwo}}
        activeColor={colors.clearBlue}
        inactiveColor={colors.warmGrey}
        pressColor={colors.white}
        style={styles.tabBar}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <AppActivityIndicator visible={this.state.querying} />
        <TabView
          style={styles.container}
          navigationState={this.state}
          renderScene={this.renderScene}
          onIndexChange={this.onIndexChange}
          initialLayout={{width: Dimensions.get('window').width}}
          renderTabBar={this.renderTabBar}
        />
      </View>
    );
  }
}

export default FaqScreen;
