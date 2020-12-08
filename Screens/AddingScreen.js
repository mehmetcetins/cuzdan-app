
import React from "react";

import{
    StyleSheet,
    View,
    TextInput,
    Button,
    ScrollView,
    Text,
    TouchableOpacity,
} from "react-native";
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
                    <TextInput style={styles.addingInputs} placeholder="bir ürün ismi girin." onChangeText={(name) => this.nameChanged(name)}></TextInput>
                    <TextInput style={styles.addingInputs} placeholder = "fiyatı" keyboardType="number-pad" onChangeText={(price) => this.priceChanged(price)} ></TextInput>
                    <TextInput style={styles.addingInputs} placeholder = "adeti" keyboardType="number-pad" onChangeText={(quantity) => this.quantityChanged(quantity)} ></TextInput>
                    <TouchableOpacity style={styles.TouchableButton} onPress={()=> navigate('CategorySelecting')}>
                        <Text>{store.getState().categoryName}</Text>
                    </TouchableOpacity>
                </View>
                <Button  title = "ekle"  onPress={()=> this.addBought()}></Button>
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