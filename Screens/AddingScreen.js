
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
        snackBarFailure:false,
    };

    
    addBought(inputRef){
        if(this.checkInputs()){
            const {name,price,quantity,date} = this.state;
            const {categoryName,addBoughts,listBoughts,startDate,endDate} = this.props;
            this.snackBarDissmiss({snackBarVisible:true});
            addBoughts({name,price,quantity,categoryName,date});
            listBoughts(startDate,endDate);
            this.clearInputs();
            this.focusNextInput(inputRef);
        }
        else{
            this.setState({snackBarFailure:true});
        }
    }

    checkInputs(){
        const {name,price,quantity} = this.state;
        const {categoryName} = this.props;
        if (categoryName === "Kategori Seçiniz"){
            return false;
        }
        else if (name === '' || price==='' || quantity===''){
            return false;
        }
        return true;
    }

    clearInputs(){
        
        this.setState({
            name:'',
            price:'',
            quantity:'',
        })
        
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
    dateChanged(newDate){
        this.setState(newDate)
    }
    toggleDatePickerModal(){
        this.setState({showDatePicker:!this.state.showDatePicker})
    }
    snackBarDissmiss(visible){
        this.setState(visible);
    }
    componentDidMount(){
        //console.log(FirebaseCore.DEFAULT_APP_OPTIONS);
        //this.boughtList();       
    }


    focusNextInput(inputRef){
        inputRef.current.focus();
    }
    render(){
        const {
            date,
            showDatePicker,
            snackBarVisible,
            snackBarFailure,
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
                    style= {styles.snackBarSuccess}
                    wrapperStyle={styles.snackBarStyle}
                    onDismiss = {()=> {
                        this.snackBarDissmiss({snackBarVisible:false});  
                    }}
                    duration = {100}
                    >
                    Eklendi
                </Snackbar>
                <Snackbar
                    visible={snackBarFailure}
                    style= {styles.snackBarFailure}
                    wrapperStyle={styles.snackBarStyle}
                    onDismiss = {()=> {
                        this.snackBarDissmiss({snackBarFailure:false});  
                    }}
                    duration = {500}
                    >
                    Alanları Kontrol Et
                </Snackbar>
                <View >
               
                    <TextInput
                        autoFocus={true}
                        ref={nameInput}
                        label="Harcama Adı"
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
                
            </View>
        );
    }
}



const mapStateToProps = (state)=>{
    //console.log(state);
    return {
        categoryName: state.cuzdan.categoryName,
        startDate: state.cuzdan.startDate,
        endDate: state.cuzdan.endDate,
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        listBoughts:(startDate,endDate)=>listBoughts(dispatch,startDate,endDate),
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
        marginVertical:5,
    },
    snackBarStyle:{
        position:"absolute",
        top:0,
        
        
    },
    snackBarSuccess:{
        backgroundColor:Colors.green400,
    },
    snackBarFailure:{
        backgroundColor:Colors.red900,
    }




});