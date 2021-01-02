import React from "react";
import {
    SafeAreaView,
    StyleSheet
} from "react-native";
import{
    Drawer,
    Colors
} from "react-native-paper";

import { connect } from 'react-redux';
import {logout,listBoughts, setDates} from "../redux/actions";
import DateTimePicker from '@react-native-community/datetimepicker';
class DrawerMenuScreen extends React.Component{

    state={
        startDate : new Date(Date.now()),
        endDate : new Date(Date.now()),
        showDatePicker:false,
        showEndDatePicker:false,
        maximumDate: Date.now(),
    }

    goHome(){
       
        this.props.navigation.navigate("Home")
    }
    closeDrawer(){
        this.props.navigation.closeDrawer();
    }
    goUpdateExpense(){
        this.props.navigation.navigate("ExpenseUpdateScreen");
    }
    logout(){
        this.props.logout();
    }
    dateChanged(newDate){
        this.setState(newDate)
    }
    openDatePickerModal(){
        
        this.setState({showDatePicker:true})
    }
    openEndDatePickerModal(){
        
        this.setState({showEndDatePicker:true})
    }
    closeAllDatePickers(){
        this.setState({
            showDatePicker:false,
            showEndDatePicker:false,
        });
    }
    componentDidMount(){
        let startDate =new Date(Date.now());
        let endDate = new Date(startDate.getFullYear(),startDate.getMonth()+1,0)
        startDate = new Date(startDate.getFullYear(),startDate.getMonth() ,1)
        this.setState({startDate:startDate,endDate:endDate});
    }
    changeDates(endDate){
        const {listBoughts,setDates} = this.props;
        const {startDate} = this.state;
        setDates(startDate,endDate);
       
        listBoughts(startDate,endDate);
    }
    render(){
        const {showDatePicker,showEndDatePicker,startDate,endDate,maximumDate} = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <Drawer.Section title={"Sayfalar"}>
                    <Drawer.Item 
                        icon="home" 
                        label="Anasayfa" 
                        style={styles.drawer}
                        onPress={
                            ()=> {
                                this.goHome();
                            }
                        }
                    />
                    <Drawer.Item 
                        icon="playlist-remove" 
                        label="Kayıt Sil" 
                        style={styles.drawer}
                        onPress={
                            ()=> {
                                this.goUpdateExpense();
                            }
                        }
                    />
                </Drawer.Section>
                <Drawer.Section title = "Ayarlar">
                    <Drawer.Item 
                        icon="calendar" 
                        label={startDate.toLocaleDateString("tr-TR")+ " - " + endDate.toLocaleDateString("tr-TR") }
                        style={styles.drawer}
                        onPress={
                            ()=> {
                                this.openDatePickerModal();
                            }
                        }
                    />

                    <Drawer.Item 
                        icon="logout" 
                        label="Çıkış" 
                        style={styles.drawer}
                        onPress={
                            ()=> {
                                this.logout();
                            }
                        }
                    />
                </Drawer.Section>
                {showDatePicker && (
                    <DateTimePicker value ={startDate} mode= "date" display="default" locale="tr-TR"
                        onChange={(event,selectedDate)=>{
                            if(selectedDate){
                                this.setState({
                                    startDate:selectedDate,
                                    showDatePicker:false,
                                    maximumDate: new Date(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate()+30),
                                    showEndDatePicker:true,
                                });
                            }
                            else{
                                this.closeAllDatePickers();
                            }
                        }}
                        
                    ></DateTimePicker>
                    
                )}
                {showEndDatePicker  && (
                    <DateTimePicker value ={endDate} 
                        minimumDate={startDate} 
                        maximumDate={maximumDate} 
                        mode= "date" 
                        display="default" 
                        locale="tr-TR"
                        onChange={(event,selectedDate)=>{
                            if(selectedDate){
                                this.setState({
                                    endDate:selectedDate,
                                    showEndDatePicker:false,
                                })
                                
                                this.changeDates(selectedDate);
                                this.closeDrawer();
                            }
                            else{
                                this.closeAllDatePickers();
                            }
                        }}
                  ></DateTimePicker>  
                )}
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state)=>{
    //console.log(state);
    return {
        
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        logout :() => logout(),
        listBoughts:(startDate,endDate)=> listBoughts(dispatch,startDate,endDate),
        setDates:(startDate,endDate)=>dispatch(setDates(startDate,endDate)),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(DrawerMenuScreen)
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
    },
    drawer:{
        backgroundColor:Colors.grey200,
    }
})