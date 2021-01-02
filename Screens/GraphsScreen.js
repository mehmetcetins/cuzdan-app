import React from "react";

import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    Dimensions
} from "react-native";
import {
    Card
} from "react-native-paper";
import {
    VictoryChart,
    VictoryBar,
    VictoryPie,
    VictoryTheme
} from "victory-native";
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from "react-native-gesture-handler";
import { data } from "@tensorflow/tfjs";
import PieIcons from "../components/PieIcons";

import { connect } from 'react-redux';


class GraphsScreen extends React.Component{

    state = {
        showModal:false,
        items:[],
        frequency:[],
        percent:[
            {
                category:"Alışveriş",
                percent:50,
            },
            {
                category:"Ulaşım",
                percent:50,
            }
        ],
        categoires: [],
        mean:0,
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
        quantityFreqList = quantityFreqList.filter(x => x.amount >= mean);
        this.setState({frequency:quantityFreqList,mean:mean});
    }

    percentGraph(entries){
        let categoryName = "";
        let categoryPrice = 0.0;
        let sumOfAll = 0;
        let isThere = false;
        let percentList = [];
        let icon = "";
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
                for (element of this.props.categories){
                    
                    if (element.name == categoryName){
                        icon = element.icon;
                    }
                }
                percentList.push({category:categoryName,percent:categoryPrice,icon:icon})
            }
            
        }
        for (var i = 0;i<percentList.length;i++){
            
            percentList[i].percent =  percentList[i].percent/sumOfAll; 
        }
        
        //console.log(percentList);
        this.setState({percent:percentList})
    }

    componentDidMount(){/*
        const database = firebase.database();
        database.ref("boughts").child(firebase.auth().currentUser.uid).on("value",(snapshot) => {
            var entries = Object.entries(snapshot.val());
            this.frequencyGraph(entries);
            this.percentGraph(entries);
        });*/

        const entries = Object.entries(this.props.items)
        this.frequencyGraph(entries);
        this.percentGraph(entries);
    }


    componentDidUpdate(prevProps){
        if(this.props.items != prevProps.items){
            const entries = Object.entries(this.props.items)
            this.frequencyGraph(entries);
            this.percentGraph(entries);
        }
    }
    render(){
        const {percent,frequency,mean} = this.state;

        return (
            <View style={styles.container}>
                
                <ScrollView>
                    
                    
                    <Card elevation={10}>
                        
                        <Card.Content style={styles.cardContent}>
                            <VictoryChart theme={VictoryTheme.material} domainPadding={30}  >
                                <VictoryBar data={frequency} x = 'product' y = 'amount' y0="0" ></VictoryBar>
                                
                            </VictoryChart>
                            <Card.Title title="Adet/Kilo Sıklık Grafiği" subtitle={"Ortalamanın Altındakiler Gösterilmez. Ortalama : "+ mean}/>
                        </Card.Content>
                       
                    </Card>
                    <Card elevation={5} >
                        <Card.Content style={styles.cardContent}>
                            <VictoryPie 
                                theme={VictoryTheme.material} 
                                
                                data = {percent} 
                                x= "category" y = "percent"
                                labelComponent={<PieIcons/>}
                                
                            ></VictoryPie>
                        <Card.Title title="Pasta Grafiği" subtitle="Kategorilere Göre Harcanan Para "/>
                        </Card.Content>
                       
                    </Card>
                    
                </ScrollView>
               
            </View>
        );
    }
}


const mapStateToProps = (state)=>{
    //console.log(state);
    return {
        items:state.cuzdan.allBoughts,
        categories:state.cuzdan.categories,
    }
}

export default connect(mapStateToProps)(GraphsScreen)

const styles = StyleSheet.create({
    cardContent:{
        left:-15,
        
    },
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    }
})