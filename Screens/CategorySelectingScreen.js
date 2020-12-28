import React from "react";

import {
    StyleSheet,
    View,
    Text,
    FlatList,
    ScrollView
} from "react-native";
import {List,Button} from "react-native-paper";
import * as firebase from "firebase";
import { FontAwesome5 } from '@expo/vector-icons';
import store from "../store";
export default class CategorySelectingScreen extends React.Component{
    state = {
        categories:null,
    }

    componentDidMount(){
        const database = firebase.database();
        const categories = database.ref("categories").once('value').then((snapshot) => {
            this.setState({categories:(Object.values(snapshot.val()))});
        });
        
        
    }

    changeCategory(name){
        const {navigation} = this.props;
        console.log(name);
        store.setState({categoryName:name})
        navigation.goBack();
    }
    categoryItems(item,index){
        return (

                
            <List.Item
            style={{paddingVertical:30,}}
            onPress={()=> this.changeCategory(item.name)}
            title={item.name}
            left = {props => <List.Icon {...props} icon="folder" />}
            />

        )
    }
    render(){
        return(
            <List.Section>

                <FlatList 
                data={this.state.categories}
                renderItem={({item,index}) => this.categoryItems(item,index)}
                keyExtractor={(item, index) => index.toString()}

                />

            </List.Section>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        //backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center',
    }
})
