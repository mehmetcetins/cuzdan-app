import React from "react";
import {StyleSheet,View,Button} from "react-native";
import MyInput from "../components/myInput";
import {VictoryChart,VictoryLine} from "victory-native";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as firebase from "firebase";

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
        
        var firebaseConfig = {
            apiKey: "AIzaSyAaTnLART9qx_m9QxM9j47XSVocsp1YmD0",
            authDomain: "cuzdan-app.firebaseapp.com",
            databaseURL: "https://cuzdan-app.firebaseio.com",
            projectId: "cuzdan-app",
            storageBucket: "cuzdan-app.appspot.com",
            messagingSenderId: "569554745849",
            appId: "1:569554745849:web:772a67a431593f5b5d6528",
            measurementId: "G-G19RPZHDNQ"
        };    
        // Initialize Firebase
        if(!firebase.apps.length){
            firebase.initializeApp(firebaseConfig);
        }
        

        //firebase.analytics();
    
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                console.log("giriş yapıldı.");
            }
            else{
                console.log("giriş yapılamadı.");
            }
        });
        this.girisYap();
        
        
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
  