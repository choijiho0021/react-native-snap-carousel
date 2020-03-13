import React, {Component} from 'react';
import {
    Alert,
    AppState
} from "react-native";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as syncActions from '../redux/modules/sync';
import codePush from "react-native-code-push";
import i18n from '../utils/i18n';

class CodePushModal extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.action.sync.init()
        this.codePushCheckForUpdate()
        AppState.addEventListener("change", (state) => {
            state === "active" && this.codePushCheckForUpdate();
        })
    }

    codePushCheckForUpdate() {
        if ( process.env.NODE_ENV !== 'production' &&  process.env.NODE_ENV !== 'staging' ) return;

        codePush.notifyAppReady()
            .then(_ => codePush.checkForUpdate())
            .then((update) => {
                if ( this.props.sync.isSkipped ) return;
                
                if (update) {
                    const { isMandatory } = update

                    if ( isMandatory ) {
                        Alert.alert(
                            i18n.t('codepush:title'),
                            i18n.t('codepush:mandatory'),
                            [
                                {
                                    text: i18n.t('codepush:continue'),
                                    onPress: () => this.props.action.sync.progress()
                                }
                            ]
                        )
                    }
                    else {
                        Alert.alert(
                            i18n.t('codepush:title'),
                            i18n.t('codepush:body'),
                            [
                                {
                                    text: i18n.t('codepush:later'),
                                    onPress: () => this.props.action.sync.skip(),
                                    style: "cancel"
                                },
                                {
                                    text: i18n.t('codepush:update'),
                                    onPress: () => this.props.action.sync.progress()
                                }
                            ]
                        )
                    }
                }
            })
            .catch((error) => {
                codePush.log(error);
            })
    }

    render() {
        return null;
    }
}

const mapStateToProps = (state) => ({
    sync : state.sync.toJS()
})

export default connect(mapStateToProps, 
    (dispatch) => ({
        action : {
            sync: bindActionCreators(syncActions, dispatch),
        }
    })
)(CodePushModal)