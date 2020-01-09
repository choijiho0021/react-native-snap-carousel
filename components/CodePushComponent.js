import React, {Component} from 'react';
import {
    View,
    Alert,
    Text,
    AppState,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as syncActions from '../redux/modules/sync';
import codePush from "react-native-code-push";
import i18n from '../utils/i18n';
import { appStyles } from '../constants/Styles';
import { colors } from '../constants/Colors';

class CodePushComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            syncMessage : '',
            syncStatus : undefined,
            progress : undefined
        }

        this._isMounted = false
    }

    componentDidMount() {
        this._isMounted = true

        this.codePushSync()
        AppState.addEventListener("change", (state) => {
            state === "active" && this.codePushSync();
        })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    codePushSync() {
        try {
            codePush.sync(
                {
                    updateDialog: {
                        title : i18n.t('codepush:title'),
                        optionalUpdateMessage : i18n.t('codepush:body'),
                        mandatoryContinueButtonLabel : i18n.t('codepush:continue'),
                        mandatoryUpdateMessage : i18n.t('codepush:mandatory'),
                        optionalIgnoreButtonLabel : i18n.t('codepush:later'),
                        optionalInstallButtonLabel : i18n.t('codepush:update')
                    },
                    installMode: codePush.InstallMode.IMMEDIATE //업데이트 후 바로 재기동
                },
                (syncStatus) => {
                    let syncMessage = ''

                    switch(syncStatus) {
                        case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                            syncMessage = i18n.t('codepush:checking')
                            break;
                        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                            syncMessage = i18n.t('codepush:download')
                            break;
                        /*
                        case codePush.SyncStatus.AWAITING_USER_ACTION:
                            syncMessage = i18n.t('codepush:awaiting')
                            break;
                        */
                        case codePush.SyncStatus.INSTALLING_UPDATE:
                            syncMessage = i18n.t('codepush:install')
                            break;
                        /*
                        case codePush.SyncStatus.UP_TO_DATE:
                            syncMessage = i18n.t('codepush:install')
                            break;
                        */
                        case codePush.SyncStatus.UPDATE_IGNORED:
                            syncMessage = i18n.t('codepush:ignore')
                            break;
                        /*
                        case codePush.SyncStatus.UPDATE_INSTALLED:
                            syncMessage = i18n.t('codepush:nextresume')
                            break;
                        */
                        case codePush.SyncStatus.UNKNOWN_ERROR:
                            syncMessage = i18n.t('codepush:error')
                            break;

                        default:
                    }

                    this.props.action.sync.update({ syncStatus })

                    if ( this._isMounted ) {
                        this.setState({ syncMessage, syncStatus })
                    }

                    if ( [codePush.SyncStatus.UP_TO_DATE,
                        codePush.SyncStatus.UPDATE_IGNORED,
                        codePush.SyncStatus.UPDATE_INSTALLED,
                        codePush.SyncStatus.UNKNOWN_ERROR ].includes(syncStatus)  ) {
                        
                            this.props.action.sync.complete()
                            if ( this._isMounted ) {
                                this.setState({ progress: undefined })
                            }
                    }
                },
                (progress) => {
                    if ( this._isMounted ) {
                        this.setState({ progress })
                    }
                }
            );
        } catch (error) {
            Alert.alert(i18n.t('error'), i18n.t('codepush:failedToUpdate'), [ {text: 'OK'} ]);
            codePush.log(error);
        }
    }

    render(){
        const { progress, syncStatus, syncMessage } = this.state

        return (
            <View style={[styles.container, this.props.style]}>
                {
                    <ActivityIndicator size="large" color={colors.clearBlue} style={ styles.indicator}/>
                }
                {
                    progress && <Text style={styles.text}> {parseInt((progress.receivedBytes/progress.totalBytes)*100)}% </Text>
                }
                <Text style={styles.text}> {syncMessage} </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.white
    },
    text: {
        ...appStyles.normal14Text,
        textAlign: 'center',
        marginBottom: 15
    },
    indicator: {
        marginBottom: 15
    }
    
})

const mapStateToProps = (state) => ({
    sync : state.sync.toJS()
})

export default connect(mapStateToProps, 
    (dispatch) => ({
        action : {
            sync: bindActionCreators(syncActions, dispatch),
        }
    })
)(CodePushComponent)