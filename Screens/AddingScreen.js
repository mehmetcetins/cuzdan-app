
import React from "react";

import{
    StyleSheet,
    View,
    
    SafeAreaView,
    ScrollView,

} from "react-native";
import { TextInput,Button } from 'react-native-paper';
import * as firebase from 'firebase';
import ProductList from "../components/productList";


import { connect } from 'react-redux';
import { addBoughts,listBoughts } from '../redux/actions';
class AddingScreen extends React.Component{



    state = {
        name:'',
        price:'',
        quantity:'',
        //items: [],
        date : null,
    };

    
    async addBought(){
        const {name,price,quantity} = this.state;
        const {categoryName} = this.props;
        
        this.props.addBoughts({name,price,quantity,categoryName});
        this.props.listBoughts();
        //this.boughtList();
    }

    boughtList(){
       
        const database = firebase.database();
        database.ref("boughts").child(firebase.auth().currentUser.uid).on('value',(snapshot) => {
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
        //this.boughtList();
        this.props.listBoughts();
       
    }
    componentWillUnmount(){
        //this.unsubscribe();
    }
    render(){
        const {date} = this.state;
        const {navigation:{navigate},categoryName,items} = this.props;
        //<DateTimePicker value = {date} mode= "date" display="default"></DateTimePicker>
        return (
            <View style={styles.container}>
                <View >
                    <TextInput label="Ürün Adı" onChangeText={(name) => this.nameChanged(name)}></TextInput>
                    <TextInput  label = "Fiyatı" keyboardType="number-pad" onChangeText={(price) => this.priceChanged(price)} ></TextInput>
                    <TextInput  label = "Adeti" keyboardType="number-pad" onChangeText={(quantity) => this.quantityChanged(quantity)} ></TextInput>
                    <Button contentStyle={styles.categoryButton} mode="outlined" compact={true} onPress={()=> navigate('CategorySelecting')}>
                        {categoryName}
                    </Button>
                </View>
                <Button mode="contained" onPress={()=> this.addBought()}>EKLE</Button>
                <SafeAreaView style={{flex:1,}}>
                    <ProductList products={items}/>
                </SafeAreaView>
            </View>
        );
    }
}
/*
*/
const mapStateToProps = (state)=>{
    //console.log(state);
    return {
        categoryName: state.cuzdan.categoryName,
        items:state.cuzdan.allBoughts,
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        listBoughts:()=>listBoughts(dispatch),
        addBoughts:(parameters)=>addBoughts(parameters),
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(AddingScreen)

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