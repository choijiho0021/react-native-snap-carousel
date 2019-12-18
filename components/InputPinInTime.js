import React, { Component } from 'react'
import { StyleSheet, View, TextInput, Text } from 'react-native'
import i18n from '../utils/i18n'
import AppButton from './AppButton'
import { colors } from '../constants/Colors'
import { appStyles } from '../constants/Styles'
import _ from 'underscore'

class InputPinInTime extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          pin: "",
          duration: 0,
          timeout: false
        }

        this._interval = null;

        this._init = this._init.bind(this)
        this._start = this._start.bind(this)
        this._pause = this._pause.bind(this)
        this._timeout = this._timeout.bind(this)
        this._onChangeText = this._onChangeText.bind(this)
        this._onPress = this._onPress.bind(this)
    }

    componentDidMount() {
        this._init(this.props)
    }

    componentDidUpdate(prevProps) {
        if ( this.props.countdown != prevProps.countdown ) {
            if ( this.props.countdown ) {
                this._init(this.props)
            }
            else {
                this._pause()
            }
        }

        if ( this.props.authorized && this.props.authorized != prevProps.authorized ) {
            this._pause()
            this.setState({
                timeout: false
            })
        }
    }

    _init = ({ duration, countdown }) => {
        this.setState({
            pin: "",
            duration: parseInt(duration, 10) || 0,
            timeout: false
        })

        if ( countdown ) {
            this._pause()
            this._start()
        }
    }

    _start = () => {
        this._interval = setInterval(() => {
            const { duration } = this.state

            if ( duration - 1 <= 0 ) {
                this.setState({
                    duration: 0,
                    timeout: true
                })
                this._pause()
                this._timeout()
            }
            else {
                this.setState({
                    duration: duration - 1
                })
            }
        }, 1000)
    }

    _pause = () => {
        if ( this._interval ) {
            clearInterval(this._interval)
            this._interval = null
        }
    }

    _timeout = () => {
        const { onTimeout } = this.props
        
        if ( _.isFunction(onTimeout) ) {
            onTimeout()
        }
    }

    _onChangeText = (key) => (value) => {
        this.setState({
          [key]: value
        })
    }

    _onPress = () => {
        const { pin } = this.state,
            { onPress } = this.props

        if ( _.isFunction(onPress) ) {
            onPress(pin)
        }
    }

    render() {
        const { pin, duration, timeout } = this.state,
            { forwardRef, authorized, countdown } = this.props,
            clickable = this.props.clickable && _.size(pin) === 6

        const min = Math.floor( duration / 60 ),
            sec = Math.floor( duration - min * 60 )

        return (
            <View>
                <View style={[styles.container, this.props.style]}>
                    <View style={[styles.inputWrapper, _.size(pin) <= 0 ? styles.emptyWrapper : {} ]}>
                        <TextInput {... this.props}
                            placeholder={i18n.t('mobile:auth')}
                            ref={forwardRef}
                            keyboardTtpe="numeric"
                            enablesReturnKeyAutomatically={true}
                            maxLength={6}
                            clearTextOnFocus={true}
                            autoFocus={true}
                            onChangeText={this._onChangeText('pin')}
                            value={pin}
                            style={styles.input}
                            textContentType={"oneTimeCode"} />
                        
                        {
                            countdown ?
                            <Text style={styles.timer}> {min}분 {sec.toString().padStart(2, '0')}초 </Text> :
                            null
                        }

                    </View>
                    <AppButton disabled={ ! clickable } 
                        onPress={this._onPress}
                        titleStyle={styles.title} 
                        title={i18n.t('ok')}
                        disableColor={colors.white}/>
                </View>
                <View style={styles.helpBox}>
                {
                    <Text style={[styles.helpText, {color: authorized ? colors.clearBlue : colors.tomato}]}>
                        {
                            typeof authorized == 'undefined' && ! timeout ? null : 
                            i18n.t( 
                                timeout ?
                                'mobile:timeout' :
                                authorized ? 
                                'mobile:authMatch' : 
                                'mobile:authMismatch')
                        }
                    </Text>
                }
                {
                    authorized ? null :
                    <Text style={[styles.helpText, styles.helpTextMargin, {color: colors.warmGrey}]}>
                        { i18n.t( 'mobile:inputInTime') }
                    </Text>
                }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    inputWrapper: {
        paddingHorizontal: 10,
        borderBottomColor: colors.black,
        borderBottomWidth: 1,
        flexDirection:'row',
        justifyContent: 'space-between',
        flex: 1,
        marginRight: 10,
        paddingBottom: 9
    },
    emptyWrapper: {
        borderBottomColor: colors.lightGrey
    },
    timer: {
        ... appStyles.normal14Text,
        color: 'red'
    },
    title: {
        ... appStyles.normal14Text,
        textAlign: "center",
        color: colors.white
    },
    helpBox: {
        marginTop: 13,
        marginLeft: 30
    },
    helpText: {
        ... appStyles.normal14Text,
        color: colors.clearBlue
    },
    helpTextMargin: {
        marginTop: 30
    }, 
    input: {
        ... appStyles.normal16Text,
        color: colors.black
    },

})

export default InputPinInTime