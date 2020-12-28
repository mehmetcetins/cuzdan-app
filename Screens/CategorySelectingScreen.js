import React from "react";

import {
    StyleSheet,
    FlatList,
} from "react-native";
import {List} from "react-native-paper";

import * as firebase from "firebase";

import { connect } from 'react-redux';
import { selectCategory } from '../redux/actions';


class CategorySelectingScreen extends React.Component{
    state = {
        categories:null,
    }

    componentDidMount(){
        const database = firebase.database();
        database.ref("categories").once('value').then((snapshot) => {
            this.setState({categories:(Object.values(snapshot.val()))});
        });
        
        
    }

    changeCategory(name){
        const {navigation} = this.props;
        this.props.selectCategory(name)
        navigation.goBack();
    }
    categoryItems(item,index){
        return (

                
            <List.Item
            style={{paddingVertical:30,}}
            onPress={()=> this.changeCategory(item.name)}
            title={item.name}
            left = {props => <List.Icon {...props} icon={item.icon} />}
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
const mapStateToProps = (state) => {
    return {}
}
const mapDispatchToProps = {selectCategory};

export default connect(mapStateToProps,mapDispatchToProps)(CategorySelectingScreen)
