
import React from "react";

import{
    StyleSheet,
    View,
    
   
    ScrollView,
    Text,
    TouchableOpacity,
} from "react-native";
import { TextInput,Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from "expo-sqlite";
import * as FirebaseCore from 'expo-firebase-core';
import * as firebase from 'firebase';
import ProductList from "../components/productList";
import store from "../store";


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
      /*
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
        
        });*/

        
    };


    state = {
        name:'',
        price:'',
        quantity:'',
        items: [],
        date : null,
        categoryName:'',
    };
    async addBought(){
        const {name,price,quantity,categoryName} = this.state;

        
        /*db.transaction((txn)=>{
            txn.executeSql("INSERT INTO boughts (name, price, quantity , date)  values(?,?,?,datetime('now'))",[name,price,quantity],()=>{
                console.log("basarıyla kaydedildi.")
            });
        });
        
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
        let userBoughtRef = firebase.database().ref("boughts");
        userBoughtRef = userBoughtRef.child(firebase.auth().currentUser.uid);
        userBoughtRef.push({
            name: name,
            price: price,
            quantity:quantity,
            date: Date(Date.now()),
            categoryName:categoryName,
        }).catch((error)=>{
            console.log(error)
        });
        this.boughtList();
    }

    boughtList(){
        /*
        db.transaction((txn)=>{
            txn.executeSql("SELECT *,datetime(date) FROM boughts",[],
                (_,{rows:{_array}})=>{
                    var allBoughts = [];
                    for(let i = 0 ; i<_array.length;i++){
                        
                        allBoughts.push({
                            
                                key:i,
                                name:_array[i].name,
                                price:_array[i].price,
                                quantity:_array[i].quantity,
                                date:_array[i].date,
                            
                        }
                            
                        );
                    }
                    this.setState({items:allBoughts});
                }
            );
        });*/

        const database = firebase.database();
        const products = database.ref("boughts").child(firebase.auth().currentUser.uid).on('value',(snapshot) => {
            var allBoughts = [];
            for (const [key,value] of Object.entries(snapshot.val())){
                allBoughts.push({
                    key : key,
                    name: value.name,
                    price : value.price,
                    quantity: value.quantity,
                    date: value.date,
                })
                
            }
            this.setState({items:allBoughts});
            //console.log(allBoughts);
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
        //console.log(FirebaseCore.DEFAULT_APP_OPTIONS);
        this.boughtList();
        this.unsubscribe = store.onChange(()=>{
            this.setState({
                categoryName:store.getState().categoryName,
            })
        })
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    render(){
        const {items,date} = this.state;
        const {navigation:{navigate}} = this.props;
        //<DateTimePicker value = {date} mode= "date" display="default"></DateTimePicker>
        return (
            <View style={styles.container}>
                <View >
                    <TextInput label="Ürün Adı" onChangeText={(name) => this.nameChanged(name)}></TextInput>
                    <TextInput  label = "Fiyatı" keyboardType="number-pad" onChangeText={(price) => this.priceChanged(price)} ></TextInput>
                    <TextInput  label = "Adeti" keyboardType="number-pad" onChangeText={(quantity) => this.quantityChanged(quantity)} ></TextInput>
                    <Button mode="outlined" compact={true} onPress={()=> navigate('CategorySelecting')}>
                        {store.getState().categoryName}
                    </Button>
                </View>
                <Button mode="contained" onPress={()=> this.addBought()}>EKLE</Button>
                <ScrollView>
                    <ProductList products={items}/>
                </ScrollView>
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
    TouchableButton:{
        borderColor:'blue',
        borderWidth:2,
        padding:20,
        marginVertical:10,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    }


});