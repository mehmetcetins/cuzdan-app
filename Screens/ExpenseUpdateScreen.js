import React from "react";

import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    StyleSheet,
} from "react-native";
import {
    List,
    Button,
    Portal,
    Modal,
    TextInput,
    DataTable,
    ActivityIndicator,
    Colors,
} from "react-native-paper";
import { connect } from 'react-redux';
import {deleteBought,listBoughts} from "../redux/actions";
import AddingScreen from "../screens/AddingScreen";





class ExpenseUpdateScreen extends React.Component{

    state={
        key:"",
        showModal:false,
    }

    remove(key){
        
        const {deleteBought,listBoughts,startDate,endDate} = this.props;
        deleteBought(key);
        listBoughts(startDate,endDate);
    }
    update(key){
        this.setState({key:key});
        this.displayModal({showModal:true})
    }

    listComponent = (item) => {
        return (
            <DataTable.Row>
                <DataTable.Cell style={styles.dataTableItems}>{item.name}</DataTable.Cell>
                <DataTable.Cell style={styles.dataTableItems}><Text>{item.price}</Text></DataTable.Cell>
                <DataTable.Cell style={styles.dataTableItems}>{item.quantity}</DataTable.Cell>
                <DataTable.Cell  style={styles.dataTableItems}>{item.date}</DataTable.Cell>
                <DataTable.Cell  style={styles.dataTableItems}><Button onPress={()=>{this.remove(item.key)}}>Sil</Button></DataTable.Cell>
            </DataTable.Row>
        )
    }
    displayModal(visible){
        this.setState(visible);
    }
    render(){
        const {items,isFetching} = this.props;
        const {showModal} =this.state;
        return (
            <SafeAreaView>
                <DataTable style={styles.dataTable}>
                
                    <DataTable.Header>
                        <DataTable.Title  style={styles.dataTableItems}>Harcama Adı</DataTable.Title>
                        
                        <DataTable.Title  style={styles.dataTableItems}>Toplam Fiyat</DataTable.Title>
                        <DataTable.Title  style={styles.dataTableItems}>Adet/Kilo</DataTable.Title>
                        <DataTable.Title  style={styles.dataTableItems}>Tarih</DataTable.Title>
                        <DataTable.Title  style={styles.dataTableItems}>İşlem</DataTable.Title>
                    </DataTable.Header>
                    {isFetching && (<ActivityIndicator style={styles.activiyIndicator} size="large" color={Colors.redA100} animating={true}/>)}
                    {!isFetching && (
                        <FlatList
                            data={items}
                            renderItem={({item,index}) =>this.listComponent(item)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    )}
                </DataTable>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    activiyIndicator:{
        marginTop:30,
    },
    dataTable :{
        marginTop:50,
        
    },
    dataTableItems:{
        justifyContent:'center',
        alignItems:'center'
    }
})

const containerStyle = {backgroundColor: 'white', padding: 20};
const mapStateToProps = (state)=>{
    //console.log(state);
    return {
        items:state.cuzdan.allBoughts,
        isFetching:state.cuzdan.isFetching,
        startDate: state.cuzdan.startDate,
        endDate: state.cuzdan.endDate,
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        deleteBought :(key) => deleteBought(key),
        listBoughts: (startDate,endDate)=> listBoughts(dispatch,startDate,endDate),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ExpenseUpdateScreen)