import _ from 'underscore'

export default function MyAppLoading({startAsync, onError, onFinish}) {

  try {
    if ( _.isFunction(startAsync)) {
      startAsync()
      onFinish()
    }
  } catch (e) {
    _.isFunction(onError) && onError(e)
  }

  return null
}

