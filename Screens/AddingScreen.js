
import React from "react";

import{
    StyleSheet,
    View,
    TextInput,
    Button,
    ScrollView,
    Text
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from "expo-sqlite";
import * as FirebaseCore from 'expo-firebase-core';
import * as firebase from 'firebase';


var db = SQLite.openDatabase("test.db");
export default class AddingScreen extends React.Component{

    constructor(props){
        super(props);
        /*db.transaction((txn)=>{
            txn.executeSql("DROP TABLE  boughts;",
            [],
                ()=>{
                    console.log("tablo silindi.");
                },
                ()=>{
                    console.log("tablo silmede hata yasandı.");
                }
                
            );
        });
        
       */
        db.transaction((txn) => {
            txn.executeSql(
                "CREATE TABLE IF NOT EXISTS boughts ( id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, price REAL NOT NULL,quantity REAL NOT NULL, date TEXT  );",
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
        quantity:'',
        items: [],
        date : null,
    };
    async addBought(){
        const {name,price,quantity} = this.state;

        
        db.transaction((txn)=>{
            txn.executeSql("INSERT INTO boughts (name, price, quantity , date)  values(?,?,?,datetime('now'))",[name,price,quantity],()=>{
                console.log("basarıyla kaydedildi.")
            });
        });
        let userBoughtRef = firebase.database().ref("boughts")
        /*await userBoughtRef.child(firebase.auth().currentUser.uid).once('value',
            (snapshot) => {
                if (snapshot.val() !== null){
                    //console.log("var")
                }
                else{
                    //userBoughtRef.push(firebase.auth().currentUser.uid)
                }
            }
        )*/
        userBoughtRef = userBoughtRef.child(firebase.auth().currentUser.uid);
        let userBoughtRefId = userBoughtRef.push().key;
        userBoughtRef.push(userBoughtRefId).set({
            name: name,
            price: price,
            quantity:quantity,
            date: Date(Date.now())
        }).catch((error)=>{
            console.log(error)
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
                                <Text>quantity: {_array[i].quantity}</Text>
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
    quantityChanged(newQuantity){
        this.setState({quantity:newQuantity});
    }

    componentDidMount(){
        console.log(FirebaseCore.DEFAULT_APP_OPTIONS);
    }

    render(){
        const {items,date} = this.state;
        //<DateTimePicker value = {date} mode= "date" display="default"></DateTimePicker>
        return (
            <View style={styles.container}>
                <View >
                    <TextInput style={styles.addingInputs} placeholder="bir ürün ismi girin." onChangeText={(name) => this.nameChanged(name)}></TextInput>
                    <TextInput style={styles.addingInputs} placeholder = "fiyatı" keyboardType="number-pad" onChangeText={(price) => this.priceChanged(price)} ></TextInput>
                    <TextInput style={styles.addingInputs} placeholder = "adeti" keyboardType="number-pad" onChangeText={(quantity) => this.quantityChanged(quantity)} ></TextInput>
                    
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