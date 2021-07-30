import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import _ from 'underscore';
import i18n from '@/utils/i18n';
import AppBackButton from '@/components/AppBackButton';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import {colors} from '@/constants/Colors';
import {API} from '@/redux/api';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigation/navigation';
import {RouteProp} from '@react-navigation/native';
import {RkbInfo} from '@/redux/api/pageApi';
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

type FaqScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Faq'>;

type FaqScreenRouteProp = RouteProp<HomeStackParamList, 'Faq'>;

type FaqScreenProps = {
  navigation: FaqScreenNavigationProp;
  route: FaqScreenRouteProp;
};

type TabViewRouteKey = 'general' | 'config' | 'payment' | 'etc';
type TabViewRoute = {
  key: TabViewRouteKey;
  title: string;
};

type FaqScreenState = {
  querying: boolean;
  index: number;
  routes: TabViewRoute[];
  scene: Record<TabViewRouteKey, RkbInfo[]>;
  selectedTitleNo?: string;
};

class FaqScreen extends Component<FaqScreenProps, FaqScreenState> {
  constructor(props: FaqScreenProps) {
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
      scene: {
        general: [],
        payment: [],
        config: [],
        etc: [],
      },
    };

    this.onPress = this.onPress.bind(this);
    this.onIndexChange = this.onIndexChange.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.renderScene = this.renderScene.bind(this);
  }

  componentDidMount() {
    const {params} = this.props.route;
    const {key, num} = params || {};

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('contact:faq')} />,
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
    return _.isEmpty(key) ? true : !_.isEmpty(this.state.scene[key]);
  }

  onPress = (uuid: string) => {
    this.props.navigation.navigate('BoardMsgResp', {uuid});
  };

  onIndexChange(index: number) {
    this.refreshData(index);

    this.setState({
      index,
      selectedTitleNo: undefined,
    });
  }

  refreshData(index: number) {
    if (index < 0 || index >= this.state.routes.length) return;

    const {key} = this.state.routes[index];
    if (this.state.scene[key].length > 0) return;

    this.setState({
      querying: true,
    });

    API.Page.getPageByCategory(`faq:${key}`)
      .then((resp) => {
        if (resp.result === 0 && resp.objects.length > 0) {
          this.setState((state) => ({
            scene: {
              ...state.scene,
              [key]: resp.objects,
            },
          }));
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

  renderScene = ({route}: {route: TabViewRoute}) => {
    return (
      <FaqList
        data={this.state.scene[route.key]}
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
    const {index, routes} = this.state;
    return (
      <View style={styles.container}>
        <AppActivityIndicator visible={this.state.querying} />
        <TabView
          style={styles.container}
          navigationState={{index, routes}}
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
