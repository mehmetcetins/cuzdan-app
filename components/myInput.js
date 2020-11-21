import React from "react";
import {
    StyleSheet,TextInput,View,Text, ScrollView
} from "react-native";


export default class MyInput extends React.Component{
    data = [];
    state ={
        text: "",
        data_holder: [],
        items: <View></View>,
    };

    addItem(metin){
        this.data.push(<Text key={this.data.length-1}>{metin}</Text>);
        this.setState({data_holder:[...this.data]});
        this.setState({items: <View>{this.data}</View>})
    }

    render(){
        const  {text} = this.state;
        const {items} = this.state;
        return (
            <View>
                <TextInput style={styles.input}  onChangeText={metin => this.addItem(metin)} ></TextInput>
                <ScrollView>{items}</ScrollView>
                
            </View>
        );
    }
}





const styles = StyleSheet.create({
    input : {
        borderColor:"black",
        borderWidth:1,
        width:300
    }
})