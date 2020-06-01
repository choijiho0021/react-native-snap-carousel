import React, {PureComponent} from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, Easing } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { appStyles } from '../constants/Styles'
import { colors } from '../constants/Colors'
import _ from 'underscore'
import * as toastActions from '../redux/modules/toast'
import i18n from '../utils/i18n'
import { Map, List } from 'immutable'
import { Toast } from '../constants/CustomTypes'

class AppToast extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      isShown: false,
      opacity: new Animated.Value(0),
      text: ''
    }

    this._onPress = this._onPress.bind(this)

    this._isMounted = null
    this._timer = null
    this._isShown = false
    this._fadeInDuration = 750
    this._fadeOutDuration = 1000
    this._duration = 500
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentDidUpdate(prevProps) {
    if ( this.props.toastMsgBox.size > 0 
      && prevProps.toastMsgBox.size === 0
      && ! this._isShown ) {
        this._show()
      }
  }

  componentWillUnmount() {
    this._isMounted = null
    this._timer && clearTimeout(this._timer)
  }

  _show({ duration } = {}) {
    const { toastMsgBox } = this.props,
      text = Toast.mapToMessage( toastMsgBox.first() )

    if ( _.isNumber(duration) ) {
      this._duration = Number(duration)
    }

    this._isMounted && this.setState({ isShown: true, text })

    Animated.timing(
      this.state.opacity,
      {
        toValue: 1,
        easing: Easing.ease,
        duration: this._fadeInDuration,
        useNativeDriver: true
      }
    ).start(() => {
      this._isShown = true
      this._timer && clearTimeout(this._timer)
      this.props.action.toast.remove()

      this._timer = setTimeout(() => {
        this._close()
      }, this._duration)
    })
  }
  
  _close() {
    const { toastMsgBox } = this.props
    this._timer && clearTimeout(this._timer)

    if (! this._isShown && ! this.state._isShown ) return;

    Animated.timing(
      this.state.opacity,
      {
        toValue: 0,
        easing: Easing.ease,
        duration: this._fadeOutDuration,
        useNativeDriver: true
      }
    ).start(() => {
      this._isMounted && this.setState({ isShown: false })
      this._isShown = false

      if (toastMsgBox.size > 0) {
        this._show()
      }
    })

  }

  _onPress() {
    const { closable } = this.props

    if ( closable ) {
      this.close()
    }
  }

  render() {
    const props = this.props,
      { isShown, text } = this.state

    return ( 
      isShown ?
      <TouchableOpacity style={[styles.container, props.styles]} activeOpacity={0.5} onPress={this._onPress}>
        <Animated.View style={[styles.content]}>
          <Text style={[styles.text]}> {text} </Text>
        </Animated.View>
      </TouchableOpacity> :
      null
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1000,
    bottom: 100,
    left: 0,
    right: 0
  },
  content: {
    backgroundColor: colors.warmGrey,
    borderRadius: 10,
    padding: 10
  },
  text: {
    ...appStyles.normal14Text,
    color: colors.white,
    textAlign: 'center'
  }
});

const mapStateToProps = (state) => ({
  toastMsgBox : state.toast.get('messages')
})

export default connect(mapStateToProps, 
  (dispatch) => ({
      action : {
          toast: bindActionCreators(toastActions, dispatch),
      }
  })
)(AppToast)