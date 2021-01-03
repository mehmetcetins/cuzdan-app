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
        const {addItem} = this.props;
        let items = addItem;
        if ("navigation" in this.props){
            const { navigation: { state: { params } } } = this.props;
            items = params;
        }
        
        return(
            <View style={style.container} >
                <ScrollView>{items}</ScrollView>
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