import React from "react";

import {
    StyleSheet,
    View,
    Text,
    Button,
    Modal,

} from "react-native";
import MyScreen from "./MyScreen";
import {VictoryChart,VictoryBar,VictoryPie,VictoryTheme} from "victory-native";
import * as firebase from "firebase";
import * as SQLite from "expo-sqlite";
import { ScrollView } from "react-native-gesture-handler";
import { data } from "@tensorflow/tfjs";
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
        frequency:[],
        percent:[],
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
    frequencyGraph(entries){
        var quantitySum = 0;
        var productName = "";
        var isThere = false;
        var quantityFreqList = [];
        for (const [key,value] of entries ){
            productName = value.name;
            quantitySum = parseFloat(value.quantity);
            for (var element of quantityFreqList){
                isThere=false;
                if(element.product == productName){
                    isThere = true;
                    break;
                }
            }
            
            if(!isThere){
                for(const [searchKey,searchValue] of entries){
                    if(searchKey !== key && searchValue.name === productName){
                        quantitySum += parseFloat(searchValue.quantity);
                    }
                }
                quantityFreqList.push({product:productName,amount:quantitySum});
            }
        }
        //console.log(quantityFreqList);
        this.setState({frequency:quantityFreqList});
    }

    percentGraph(entries){
        var categoryName = "";
        var categoryPrice = 0.0;
        var sumOfAll = 0;
        var isThere = false;
        var percentList = [];
        for (const [key,value] of entries){
            categoryName = value.categoryName;
            categoryPrice = parseFloat(value.price);
            for (var element of percentList){
                isThere=false;
                //console.log(element.category);
                if(element.category == categoryName){
                    isThere = true;
                    break;
                }
            }
            //console.log(isThere)
            if(!isThere){
                for (const[searchKey,searchValue] of entries){
                    if (searchKey !== key && searchValue.categoryName === categoryName){
                        categoryPrice += parseFloat(searchValue.price);
                    }
                }

                sumOfAll += categoryPrice;
                percentList.push({category:categoryName,percent:categoryPrice})
            }
            
        }
        for (var i = 0;i<percentList.length;i++){
            
            percentList[i].percent =  percentList[i].percent/sumOfAll; 
        }
        
        //console.log(percentList);
        this.setState({percent:percentList})
    }

    componentDidMount(){
        const database = firebase.database();
        database.ref("boughts").child(firebase.auth().currentUser.uid).on("value",(snapshot) => {
            var entries = Object.entries(snapshot.val());
            this.frequencyGraph(entries);
            this.percentGraph(entries);
        });
    }

    
    render(){
        const {percent,frequency,items,showModal} = this.state;
        const dummyFreq = [
            {product:'cikolata', amount:30},
            {product:'muz', amount:100},
            {product:'viski', amount:15},
            {product:'ayakkabı', amount:3},
        ]

        const dummyPercent = [
            {category:'ıvır zıvır',percent :40},
            {category:'giyim',percent : 25},
            {category:'faturalar',percent :35 },
            
        ]
        return (
            <View style={styles.container}>
                <ScrollView>
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
                    <View style={{flex:1}}>
                        <VictoryChart theme={VictoryTheme.material} domainPadding={30}>
                            <VictoryBar data={frequency} x = 'product' y = 'amount' y0="0" ></VictoryBar>
                            
                        </VictoryChart>

                        <VictoryPie theme={VictoryTheme.material} data = {percent} x= "category" y = "percent"></VictoryPie>
                    </View>
                </ScrollView>
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