import React from "react";
import {StyleSheet,View} from "react-native";
import MyInput from "../components/myInput";
import {VictoryChart,VictoryArea} from "victory-native";

export default class Home extends React.Component{


    render(){
        const dummyData=[
            {d:1,price :5},
            {d:2,price :10},
            {d:3,price :30},
            {d:4,price :35},
            {d:5,price :60},
        ]
        const {navigation : {navigate}} = this.props;
        return(
            <View style={styles.container}>
                <VictoryChart>
                    <VictoryArea data = {dummyData} x="d" y = "price"/>
                </VictoryChart>
                <MyInput navigateFunc={navigate}></MyInput>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  