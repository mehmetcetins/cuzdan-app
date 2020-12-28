
import React from "react";

import{
    StyleSheet,
    View,
    
   
    ScrollView,

} from "react-native";
import { TextInput,Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from "expo-sqlite";

import * as firebase from 'firebase';
import ProductList from "../components/productList";
import store from "../store";

export default class AddingScreen extends React.Component{



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

        
       
        let userBoughtRef = firebase.database().ref("boughts");
        userBoughtRef = userBoughtRef.child(firebase.auth().currentUser.uid);
        userBoughtRef.push({
            name: name,
            price: price,
            quantity:quantity,
            date: Date.now(),
            categoryName:categoryName,
        }).catch((error)=>{
            console.log(error)
        });
        this.boughtList();
    }

    boughtList(){
       
        const database = firebase.database();
        const products = database.ref("boughts").child(firebase.auth().currentUser.uid).on('value',(snapshot) => {
            if(snapshot.exists()){
                var allBoughts = [];
                for (const [key,value] of Object.entries(snapshot.val())){
                    allBoughts.push({
                        key : key,
                        name: value.name,
                        price : value.price,
                        quantity: value.quantity,
                        date: new Date(value.date).toLocaleDateString("tr-TR"),
                    })
                    
                }
                this.setState({items:allBoughts});
                //console.log(allBoughts);
            }
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
                    <Button contentStyle={styles.categoryButton} mode="outlined" compact={true} onPress={()=> navigate('CategorySelecting')}>
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
    categoryButton:{
        paddingVertical:20,
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