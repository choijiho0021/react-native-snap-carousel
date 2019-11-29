import React from 'react'
import { StyleSheet, View, TextInput, Text } from 'react-native'

const TextField = (props) => {
    console.log( 'error', props)

    return (
        <View style={props.style}>
            <TextInput {... props} style={styles.input}/>
            { props.error ? <Text style={styles.input}>{props.error[0]}</Text> : null}
        </View>
    )
}
const styles = StyleSheet.create({
    input : {
        width: "100%",
    },
})
 
export default TextField