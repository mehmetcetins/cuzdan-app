import React from "react";
import {
    StyleSheet,TextInput,View,Text, ScrollView,Modal,Button
} from "react-native";
import MyScreen from "../Screens/MyScreen";

export default class MyInput extends React.Component{
    data = [];
    state ={
        text: "",
        items: <View></View>,
        showModal:false,
    };

    addItem(metin){
        this.data.push(<Text key={this.data.length-1}>{metin}</Text>);
        this.setState({items: <View>{this.data}</View>})
    };

    show(){
        this.setState({showModal:true});
    };
    close(){
        this.setState({showModal:false});
    };
    render(){
        const  {text,showModal} = this.state;
        const {items} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.inner}>
                    <Button title={"mehmet"} onPress={() =>this.show()}></Button>
                    <TextInput style={styles.input}  onChangeText={metin => this.addItem(metin)} ></TextInput>
                    
                </View>
                <View>
                    <Modal styles={styles.modal} animationType="slide" visible={showModal} onRequestClose={()=>this.close()}>
                        <MyScreen addItem={items}></MyScreen>
                    </Modal>
                </View>
            </View>
        );
    }
}





const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    input : {
        borderColor:"black",
        borderWidth:1,
        width:300,
    },
    inner:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
    },
    modal :{
        flex:1,

    }
})