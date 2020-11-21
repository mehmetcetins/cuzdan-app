import React from "react";

import {
    StyleSheet,
    View,
    Text,
    ScrollView
} from "react-native";


export default class MyScreen extends React.Component{
    state ={
        items: [],
    }
    render(){
        const {addItem} = this.props

        return(
            <View style={style.container} >
                <ScrollView>{addItem}</ScrollView>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    }
})