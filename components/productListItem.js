import React from "react";

import {
    View,
    Text,
    StyleSheet,
    
} from "react-native";
import { List } from 'react-native-paper';
export default class ProductListItem extends React.Component {
    render(){
        const {product:{key,name,price,quantity,date}} = this.props;
        return (
           <List.Item 
            title = {name }
            description={date + " " + price +"TL "}
           />
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        alignItems:"stretch",
        justifyContent:"space-around",
        backgroundColor:"lightgrey",
        padding:20,
        marginTop:10,
    },
    productLabels:{
        width:100,
        fontWeight:"bold",
        color:"black",
    }

});


/*
 <View key= {key} style={styles.container}>
                <Text style={styles.productLabels}>{name}</Text>
                <Text style={styles.productLabels}>{price}</Text>
                <Text style={styles.productLabels}>{quantity}</Text>
                <Text style={styles.productLabels}>{date}</Text>
            </View>*/