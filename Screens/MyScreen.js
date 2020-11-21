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
        console.log("ekran");
        return(
            <View style={style.container} addItem={(data)=>{console.log(data);this.setState({items:data})}}>
                <ScrollView>{this.state.items}</ScrollView>
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