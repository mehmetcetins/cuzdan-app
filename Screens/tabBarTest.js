import React from "react";

import {
    StyleSheet,
    View,
    Text,

} from "react-native";

import {
    VictoryChart,
    VictoryBar,
    VictoryPie,
    VictoryTheme
} from "victory-native";
import * as firebase from "firebase";
import { ScrollView } from "react-native-gesture-handler";
import { data } from "@tensorflow/tfjs";
import PieIcons from "../components/PieIcons";

export default class TabTest extends React.Component{

    state = {
        showModal:false,
        items:[],
        frequency:[],
        percent:[],
    }
    setItems(results){
        data = [];
        for(let i = 0 ; i<results.length;i++){
            data.push(
                <View key={i}>
                    <Text>user_name: {results[i].user_id}</Text>
                    <Text>user_name: {results[i].user_name}</Text>
                </View>
            );
        }
        this.setState({items:data});
    }

    
    frequencyGraph(entries){
        var quantitySum = 0;
        var productName = "";
        var isThere = false;
        var quantityFreqList = [];
        var mean = 0;
        for (const [key,value] of entries ){
            productName = value.name;
            quantitySum = parseFloat(value.quantity);
            for (var element of quantityFreqList){
                isThere=false;
                if(element.product == productName){
                    isThere = true;
                    break;
                }
            }
            
            if(!isThere){
                for(const [searchKey,searchValue] of entries){
                    if(searchKey !== key && searchValue.name === productName){
                        quantitySum += parseFloat(searchValue.quantity);
                       
                    }
                }
                mean+=quantitySum;
                quantityFreqList.push({product:productName,amount:quantitySum});
            }
        }
        mean = mean / quantityFreqList.length;
        quantityFreqList = quantityFreqList.filter(x => x.amount > mean);

        this.setState({frequency:quantityFreqList});
    }

    percentGraph(entries){
        var categoryName = "";
        var categoryPrice = 0.0;
        var sumOfAll = 0;
        var isThere = false;
        var percentList = [];
        for (const [key,value] of entries){
            categoryName = value.categoryName;
            categoryPrice = parseFloat(value.price);
            for (var element of percentList){
                isThere=false;
                //console.log(element.category);
                if(element.category == categoryName){
                    isThere = true;
                    break;
                }
            }
            //console.log(isThere)
            if(!isThere){
                for (const[searchKey,searchValue] of entries){
                    if (searchKey !== key && searchValue.categoryName === categoryName){
                        categoryPrice += parseFloat(searchValue.price);
                    }
                }

                sumOfAll += categoryPrice;
                percentList.push({category:categoryName,percent:categoryPrice})
            }
            
        }
        for (var i = 0;i<percentList.length;i++){
            
            percentList[i].percent =  percentList[i].percent/sumOfAll; 
        }
        
        //console.log(percentList);
        this.setState({percent:percentList})
    }

    componentDidMount(){
        const database = firebase.database();
        database.ref("boughts").child(firebase.auth().currentUser.uid).on("value",(snapshot) => {
            var entries = Object.entries(snapshot.val());
            this.frequencyGraph(entries);
            this.percentGraph(entries);
        });
    }

    
    render(){
        const {percent,frequency} = this.state;

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{flex:1}}>
                        <VictoryChart theme={VictoryTheme.material} domainPadding={30}>
                            <VictoryBar data={frequency} x = 'product' y = 'amount' y0="0" ></VictoryBar>
                            
                        </VictoryChart>

                        <VictoryPie 
                            theme={VictoryTheme.material} 
                            data = {percent} 
                            x= "category" y = "percent"
                            labelComponent={<PieIcons/>}
                         ></VictoryPie>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    }
})