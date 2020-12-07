import React from "react";
import {
    StyleSheet,
    View,
} from "react-native";
import ProductListItem from "./productListItem";
export default class ProductList extends React.Component{
    render(){
        const {products} = this.props;
        return(
            <View key={-1}>
                {products.map((value,_) => {
                    console.log(value)
                    return <ProductListItem product={value}/>
                })
                }
                
            </View>
        );
    }
}