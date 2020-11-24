import React from "react";

import {
    StyleSheet,
    View,
    Text,
    Button,
    Modal,

} from "react-native";
import MyScreen from "./MyScreen";
//import {openDatabase} from 'react-native-sqlite-storage';
import * as SQLite from "expo-sqlite";
var db = SQLite.openDatabase("test.db");

export default class TabTest extends React.Component{

    constructor(props){
        super(props)

        db.transaction( (txn) => {
            txn.executeSql(
                `CREATE TABLE IF NOT EXISTS user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(50))`,
                [],null,(t,error) => console.log(error)
            );
            
        });



    }
    state = {
        showModal:false,
        items:[],
    }
    setItems(results){
        data = [];
        for(let i = 0 ; i<results.length;i++){
            data.push(
                <View key={i}>
                    <Text>user_name: {results[i].user_id}</Text>
                    <Text>user_name: {results[i].user_name}</Text>
                </View>
            );
        }
        this.setState({items:data});
    }
    hata(error){
        console.log(error);
    }
    show(){
        this.setState({showModal:true});
    }
    close(){
        this.setState({showModal:false});
    }
    ekleme(){
        db.transaction((txn) => {
            txn.executeSql(`INSERT INTO user(user_name) values('memoli');`,null,(txx) => console.log("eklendi."),(t,error)=> console.log(error));
            
        });
        
    }
    listele(){
        db.transaction( (txn) => {
            txn.executeSql(`SELECT * FROM user;`,null,(_,{rows:{_array}}) => this.setItems(_array), (t,error) => console.log(error));
        });


    }

    
    render(){
        const {items,showModal} = this.state;
        return (
            <View style={styles.container}>
                <Text>Mehmet ÇETİN</Text>
                <Button title="ekle" onPress={this.ekleme}></Button>
                <Button title="listele" onPress={()=>{this.listele(),this.show()}}></Button>
                <View>
                    <Modal  animationType="slide" visible={showModal} onRequestClose={()=>this.close()}>
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
    }
})