import React from "react";

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Button,
} from "react-native";
import * as firebase from 'firebase';
export default class CategoryAddingScreen extends React.Component {

    constructor(props){
        super(props);
        this.database = firebase.database();
    }

    state={
        categoryName:"",
    };
    
    addCategory(){
        this.database.ref("categories").push(
            {
                name : this.state.categoryName,
            }
        );
    }

    render(){
        return(
            <View style={styles.container}>
                <Text style={{fontSize:16,}}>Kategori Adı:</Text>
                <TextInput style={styles.input} onChangeText={(category)=>this.setState({categoryName:category})}></TextInput>
                <Button title={"Kategori Ekle"} onPress={()=> this.addCategory()}></Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        borderWidth:1,
        padding:10,
        marginTop:10,
    },
    container:{
        margin:10,
    }
});