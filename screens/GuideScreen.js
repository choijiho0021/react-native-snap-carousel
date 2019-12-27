import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image
} from 'react-native';
import {connect} from 'react-redux'
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import { colors } from '../constants/Colors';
import * as orderActions from '../redux/modules/order'
import * as accountActions from '../redux/modules/account'
import _ from 'underscore'
import AppBackButton from '../components/AppBackButton';
import pageApi from '../utils/api/pageApi';
import AppFlatListItem from '../components/AppFlatListItem';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { sliderWidth } from '../constants/SliderEntry.style'

const guideImages = {
  step1: require('../assets/images/guide/step1/img.png'),
  step2: require('../assets/images/guide/step2/img.png'),
  step3: require('../assets/images/guide/step3/img.png'),
  step4: require('../assets/images/guide/step4/img.png'),
}

class GuideScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('guide:title') } />
  })

  constructor(props) {
    super(props)
    this.state = {
      querying: false,
      data: [],
      activeSlide: 0,
      images: [
        { key:'step1'},
        { key:'step2'},
        { key:'step3'},
        { key:'step4'},
      ]
    }

    this._header = this._header.bind(this)
  }

  componentDidMount() {
    this._refreshData()
  }

  _refreshData() {
    this.setState({
      querying: true
    })

    pageApi.getPageByCategory('FAQ').then(resp => {
      if ( resp.result == 0 && resp.objects.length > 0) {
        this.setState({
          data: resp.objects
        })
      }
    }).catch(err => {
      console.log('failed to get page', err)
    }).finally(_ => {
      this.setState({
        querying: false
      })
    })

  }

  _renderGuide({item}) {
    return <Image style={styles.image} source={guideImages[item.key]} 
      resizeMode='cover'/>
  }

  _header() {
    const {images, activeSlide} = this.state

    return(
      <View>
        <Carousel
          data={images}
          renderItem={this._renderGuide}
          onSnapToItem={(index) => this.setState({activeSlide: index})}
          autoplay={false}
          loop={true}
          useScrollView={true}
          lockScrollWhileSnapping={true}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth} />

        <Pagination dotsLength={images.length}
          activeDotIndex={activeSlide} 
          dotStyle={styles.dotStyle}
          inactiveDotOpacity={0.4}
          inactiveDotScale={1.0}
          containerStyle={styles.pagination}/>

        <View style={styles.faqBox}>
          <Text style={styles.faq}>FAQ</Text>
        </View>
        <View style={styles.divider}/>
        <View style={styles.tipBox}>
          <Text style={styles.tip}>{i18n.t('guide:tip')}</Text>
        </View>
      </View>
    )
  }

  _renderItem({item}) {
    return (
      <AppFlatListItem key={item.key} item={item} />
    )
  }

  render() {
    const { data, activeSlide} = this.state

    return (
      <View style={styles.container}>
        <FlatList data={data} renderItem={this._renderItem} 
          extraData={activeSlide}
          ListHeaderComponent={this._header} />
      </View>
    )
  }

}


const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    top: 0, 
    right: 0,
    paddingVertical: 20,
    paddingRight: 20,
    marginLeft: 7
  },
  dotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  tipBox: {
    height: 71,
    justifyContent: 'center',
    borderBottomColor: colors.whiteTwo,
    borderBottomWidth: 1
  },
  tip: {
    ... appStyles.bold18Text,
    marginLeft: 20
  },
  container: {
    flex:1,
    alignItems: 'stretch'
  },
  image: {
    height: 390,
  },
  text: {
    ... appStyles.bold18Text,
    color: colors.white,
    marginTop: 40,
  },
  faq: {
    ... appStyles.normal16Text,
    color: colors.clearBlue,
    textAlign: 'center',
  },
  faqBox: {
    height: 48,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.clearBlue,
    marginVertical: 30,
    marginHorizontal: 20,
    alignContent: 'center',
    justifyContent: 'center'
  },
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo
  }
});

const mapStateToProps = state => ({
  account: state.account.toJS(),
  order: state.order.toJS(),
  auth: accountActions.auth( state.account),
  pending: state.pender.pending[orderActions.GET_ORDERS] || 
    state.pender.pending[accountActions.UPLOAD_PICTURE] || false,
})

export default connect(mapStateToProps)(GuideScreen)