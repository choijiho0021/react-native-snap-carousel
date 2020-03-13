
import {AppState} from 'react-native';
import _ from 'underscore'

class AppStateHandler {
  constructor() {
    this.appState = ''
    this.callback = null
    this._handleAppStateChange = this._handleAppStateChange.bind(this)
  }

  _handleAppStateChange(nextAppState) {
    if (_.isFunction(this.callback)) {
      if (this.appState.match(/inactive|background/) && nextAppState === 'active' ) {
        this.callback('active')
      }
      else {
        this.callback('inactive')
      }
    }

    this.appState = nextAppState
  }

  remove() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }
  
  add(callback) {
    if(_.isFunction(callback)) this.callback = callback

    AppState.addEventListener('change', this._handleAppStateChange)
  }
}

export default new AppStateHandler()