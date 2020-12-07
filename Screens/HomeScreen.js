import React from "react";
import {
    StyleSheet,
    View,
    Button,
    Modal,

} from "react-native";
import MyInput from "../components/myInput";
import {VictoryChart,VictoryLine} from "victory-native";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as firebase from "firebase";
import { interpolate } from "react-native-reanimated";

export default class Home extends React.Component{
    constructor(props){
        super(props);
        
    }
    state={
        isTfReady: false,
        modelPredictions: [],
        graphsData: [
            {d:1,price :50},
            {d:2,price :10},
            {d:3,price :30},
            {d:4,price :35},
            {d:5,price :40},
        ],
        showLoginModal:false,
    };


    randomInt(min,max){
        return Math.floor(Math.random() * (max - min)) + min;
    }

    model;
    async createModel(){
        
        values = [];
        for (let i =0;i<60;i++){
            values.push({d:i,price:this.randomInt(30,60)})
        }
        this.setState({graphsData:values});
        const dummyData=this.state.graphsData
        var inputs =[],outputs=[];
        dummyData.map(data => inputs.push(data.d));
        dummyData.map(data => outputs.push(data.price));
        this.model.add(tf.layers.dense({units:16,useBias:true,inputShape:[1],activation:"relu6"}));
        this.model.add(tf.layers.dense({units:1}));
        this.model.compile({
            optimizer:tf.train.sgd(0.001),
            loss: "meanSquaredError",
            metrics : [tf.metrics.meanAbsoluteError],
        });
        //console.log(inputs+ " "+outputs);
        inputs = tf.tensor(inputs);
        outputs = tf.tensor(outputs);
        //console.log(inputs+ " "+outputs);
        await this.model.fit(inputs,outputs,{
            epochs:10,
            batchSize:1,
            validationSplit:0.7,
            callbacks:{
                onEpochEnd: async (epoch,log)=>{
                    console.log(epoch);
                    console.log(log);
                }
            }
        });
        let predictions =[];
        for (let i =0 ;i<10;i++){
            predictions.push(
                {
                    d: i+this.state.graphsData.length,
                    price: this.model.predict( tf.tensor([i+this.state.graphsData.length]) ).dataSync()[0]
                });
        }
        
        this.setState({graphsData: this.state.graphsData.concat(predictions) });
        console.log(this.state.graphsData);
    }
    
    kayitol(){
        firebase.auth().createUserWithEmailAndPassword("mehmet.cetin14@ogr.sakarya.edu.tr","test123").catch((error)=>{
            console.log(error);
        });
    }

    girisYap(){
        firebase.auth().signInWithEmailAndPassword("mehmet.cetin14@ogr.sakarya.edu.tr","test123");
    }
    componentDidMount(){
        /*await tf.ready();
        this.setState({isTfReady:true});

        this.model = tf.sequential();
        
        this.createModel();*/
        

        //this.girisYap();
        
        //firebase.auth().signOut();


        const boughtList = firebase.database().ref("boughts").child(firebase.auth().currentUser.uid).on('value',
            (snapshot) => {
                var purchased = [];
                var currentDateofMonth;
                var oldPrice;
                for (const[key,value] of Object.entries(snapshot.val())){
                    oldPrice = 0;
                    currentDateofMonth = new Date(Date.parse(value.date)).getDate()
                    if (purchased[currentDateofMonth]){
                        oldPrice = purchased[currentDateofMonth].price
                    }
                    purchased[currentDateofMonth] = {price:oldPrice+parseFloat(value.price),d:currentDateofMonth}
                }
                this.setState({graphsData:purchased});
            }
        );

    }



    render(){
        let dummyData=[
            {d:1,price :50},
            {d:2,price :10},
            {d:3,price :30},
            {d:4,price :35},
            {d:5,price :40},
        ]
        
        const {navigation : {navigate}} = this.props;
        const {graphsData} = this.state;

        
        return(
            <View style={styles.container}>
                <VictoryChart>
                    <VictoryLine data = {graphsData} x="d" y = "price"/>
                </VictoryChart>
                <Button title={"Ekle"} onPress= {()=>navigate("Adding")}></Button>
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
  