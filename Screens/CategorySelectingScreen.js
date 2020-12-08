import React from "react";

import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from "react-native";

import * as firebase from "firebase";
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

    render(){
        return(
            <View key={"categoryList"} style={styles.container}>
                <FlatList style={{flex:1,}} data={this.state.categories} renderItem={({item,index}) => (
                    <View key = {index} style={{flex:1,marginVertical:30,} }>
                        <TouchableOpacity style={{padding:10,}} onPress={()=> this.changeCategory(item.name)}>
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    </View>
                )}></FlatList>
            </View>
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
