import React from "react";
import {
    StyleSheet,
    View,
    FlatList,
} from "react-native";
import { List } from 'react-native-paper';
import ProductListItem from "./productListItem";
export default class ProductList extends React.Component{
    render(){
        const {products} = this.props;
        return(
            <List.Section>
              <FlatList 
                data={products}
                renderItem={({item,index}) => <ProductListItem product={item}/>}
                keyExtractor={(item, index) => index.toString()}
              />

            </List.Section>
        );
    }
}


/*
<View key={"productlist"}>
                
                 {
                products.map((value,_) => {
                    //console.log(value)
                    return <ProductListItem product={value}/>
                })
                }
                
            </View>
*/