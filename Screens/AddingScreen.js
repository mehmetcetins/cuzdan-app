
import React from "react";

import{
    StyleSheet,
    View,
    SafeAreaView,
} from "react-native";
import { 
    TextInput,
    Button,
    Colors,
    Snackbar
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import ProductList from "../components/productList";
import { connect } from 'react-redux';
import { addBoughts,listBoughts } from '../redux/actions';

class AddingScreen extends React.Component{



    state = {
        name:'',
        price:'',
        quantity:'',
        //items: [],
        date : Date.now(),
        showDatePicker:false,
        snackBarVisible:false,
    };

    _isMounted = false;
    async addBought(inputRef){
        const {name,price,quantity,date} = this.state;
        const {categoryName} = this.props;
        this.snackBarDissmiss({snackBarVisible:true});
        this.props.addBoughts({name,price,quantity,categoryName,date});
        this.props.listBoughts();
        this.clearInputs();
        this.focusNextInput(inputRef);
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
                if(this._isMounted)
                    this.setState({items:allBoughts});
                //console.log(allBoughts);
            }
        });
        
    }

    clearInputs(){
        if(this._isMounted){
            this.setState({
                name:'',
                price:'',
                quantity:'',
            })
        }
    }

    nameChanged(newName){
        if(this._isMounted)
            this.setState({name:newName})
    }
    priceChanged(newPrice){
        if(this._isMounted)
            this.setState({price:newPrice});
    }
    quantityChanged(newQuantity){
        if(this._isMounted)
            this.setState({quantity:newQuantity});
    }
    dateChanged(newDate){
        this.setState(newDate)
    }
    toggleDatePickerModal(){
        if(this._isMounted)
            this.setState({showDatePicker:!this.state.showDatePicker})
    }
    snackBarDissmiss(visible){
        if(this._isMounted)
            this.setState(visible);
    }
    componentDidMount(){
        //console.log(FirebaseCore.DEFAULT_APP_OPTIONS);
        //this.boughtList();
        this._isMounted= true;
        this.props.listBoughts();
       
    }
    componentWillUnmount(){
        //this.unsubscribe();
        this._isMounted = false;
    }

    focusNextInput(inputRef){
        inputRef.current.focus();
    }
    render(){
        const {
            date,
            showDatePicker,
            snackBarVisible,
            name,
            price,
            quantity
        } = this.state;
        const {navigation:{navigate},categoryName,items} = this.props;
        const nameInput = React.createRef();
        const priceInput = React.createRef();
        const quantityInput = React.createRef();
        return (
            <View style={styles.container}>
                    <Snackbar
                        visible={snackBarVisible}
                        style= {{backgroundColor:Colors.green400}}
                        onDismiss = {()=> {
                          this.snackBarDissmiss({snackBarVisible:false});  
                        }}
                        duration = {100}
                        >
                        Eklendi
                    </Snackbar>
                <View >
               
                    <TextInput
                        autoFocus={true}
                        ref={nameInput}
                        label="Ürün Adı"
                        value={name}
                        onChangeText={(name) => this.nameChanged(name)}
                        blurOnSubmit={false}
                        onSubmitEditing={()=>this.focusNextInput(priceInput)}
                     ></TextInput>
                    <TextInput 
                        ref={priceInput}  
                        label = "Toplam Fiyat" 
                        value={price}
                        keyboardType="number-pad" 
                        onChangeText={(price) => this.priceChanged(price)} 
                        blurOnSubmit={false}
                        onSubmitEditing={()=>this.focusNextInput(quantityInput)}
                    ></TextInput>
                    <TextInput 
                    ref={quantityInput}  
                    label = "Adet/Kilo" 
                    value={quantity}
                    keyboardType="number-pad"
                    blurOnSubmit={false}
                    onChangeText={(quantity) => this.quantityChanged(quantity)} 
                    ></TextInput>
                    <Button style={styles.categoryButton} mode="outlined" onPress={()=> this.toggleDatePickerModal()}>
                        {new Date(date).toLocaleDateString("tr-TR")}
                    </Button>
                    <Button style={styles.categoryButton} mode="outlined" compact={true} onPress={()=> navigate('CategorySelecting')}>
                        {categoryName}
                    </Button>
                    {showDatePicker && (
                        <DateTimePicker value ={date} mode= "date" display="default" locale="tr-TR"
                            onChange={(event,selectedDate)=>{
                                this.toggleDatePickerModal();
                                if(selectedDate){
                                    this.dateChanged({date:event.nativeEvent.timestamp})
                                }
                                
                            }}
                        ></DateTimePicker>
                    )}
                    
                    
                </View>
                <Button mode="contained" onPress={()=> this.addBought(nameInput)}>EKLE</Button>
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
        borderWidth:1,
        borderColor:Colors.deepPurple900,
        //paddingVertical:15,
        marginVertical:5,
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