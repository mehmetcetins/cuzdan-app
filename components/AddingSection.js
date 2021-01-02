import React from "react";

import{
    StyleSheet,
    View,
} from "react-native";
import { 
    TextInput,
    Button,
    Colors,
} from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';


export default class AddingSection extends React.Component{

    state = {
        name:'',
        price:'',
        quantity:'',
        //items: [],
        date : Date.now(),
        showDatePicker:false,
    };
    _isMounted = false;
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
    focusNextInput(inputRef){
        inputRef.current.focus();
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
    render(){
        const {
            date,
            showDatePicker,
            name,
            price,
            quantity
        } = this.state;

        const {navigation:{navigate},categoryName} = this.props;
        const nameInput = React.createRef();
        const priceInput = React.createRef();
        const quantityInput = React.createRef();
        return (
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
        )
    }
}

const styles = StyleSheet.create({
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
})