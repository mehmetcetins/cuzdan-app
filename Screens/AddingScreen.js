
import React from "react";

import{
    StyleSheet,
    View,
    TextInput,
    Button,
    ScrollView,
    Text
} from "react-native";
import * as SQLite from "expo-sqlite";
import { add } from "react-native-reanimated";

var db = SQLite.openDatabase("test.db");
export default class AddingScreen extends React.Component{

    constructor(props){
        super(props);
        db.transaction((txn) => {
            txn.executeSql(
                "CREATE TABLE IF NOT EXISTS boughts ( id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, price REAL NOT NULL, date TEXT  );",
                [],
                ()=>{
                    console.log("tablo olusturuldu.");
                },
                ()=>{
                    console.log("tablo olusturmada hata yasandı.");
                }
                
            )
        
        });

        this.boughtList();
    };
    state = {
        name:'',
        price:'',
        items: [],
    };
    addBought(){
        const {name,price} = this.state;

        
        db.transaction((txn)=>{
            txn.executeSql("INSERT INTO boughts (name, price , date)  values(?,?,datetime('now'))",[name,price],()=>{
                console.log("basarıyla kaydedildi.")
            });
        });
        this.boughtList();
    }

    boughtList(){
        
        db.transaction((txn)=>{
            txn.executeSql("SELECT *,datetime(date) FROM boughts",[],
                (_,{rows:{_array}})=>{
                    var allBoughts = [];
                    for(let i = 0 ; i<_array.length;i++){
                        allBoughts.push(
                            <View key={i} style={styles.test}>
                                <Text>id: {_array[i].id}</Text>
                                <Text>name: {_array[i].name}</Text>
                                <Text>price: {_array[i].price}</Text>
                                <Text>date: {_array[i].date}</Text>
                            </View>
                        );
                    }
                    this.setState({items:allBoughts});
                }
            );
        });
        
    }

    
    nameChanged(newName){

        this.setState({name:newName})
    }
    priceChanged(newPrice){
        this.setState({price:newPrice});
    }
    render(){
        const {items} = this.state;
        return (
            <View style={styles.container}>
                <View >
                    <TextInput style={styles.addingInputs} placeholder="bir ürün ismi girin." onChangeText={(name) => this.nameChanged(name)}></TextInput>
                    <TextInput style={styles.addingInputs} placeholder = "fiyatı" keyboardType="number-pad" onChangeText={(price) => this.priceChanged(price)} ></TextInput>
                </View>
                <Button  title = "ekle"  onPress={()=> this.addBought()}></Button>
                <ScrollView>{items}</ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10
    },
    addingInputs:{
        borderWidth:1,
        borderColor:"grey",
        marginBottom:10,
        padding:10,
    },

    test:{
        flex:1,
        flexDirection:'row',
        alignItems:"stretch",
        justifyContent:"space-around",
        marginTop:10,
    }

});