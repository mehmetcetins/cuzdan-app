import React from "react";
import {
    StyleSheet,
    View,
    SafeAreaView,
    Dimensions,
} from "react-native";
import { 
    Button,
    ActivityIndicator,
    Colors,
    Card,
    IconButton
} from 'react-native-paper';
import {
    VictoryChart,
    VictoryLine
} from "victory-native";
import '@tensorflow/tfjs-react-native';
import {SLR} from "ml-regression";
import ProductList from "../components/productList";
import { connect } from 'react-redux';
import {setCategories,listBoughts,logout} from "../redux/actions";

class Home extends React.Component{
    
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
        slr: [],
        predictedTotalExpense:0,
        showLoginModal:false,
    };

    _isMounted = false;
   
    componentDidMount(){
        this._isMounted = true;
        this.props.setCategories();
        this.props.listBoughts();
    }
    componentDidUpdate(prevProps){
        if(this.props.items != prevProps.items){
            this.cumulativeGraph(this.props.items);
        }
        
    }
    componentWillUnmount(){
        this._isMounted = false;
    }

    cumulativeGraph(snapshot){
       
        let purchased = [];
        let currentDateofMonth;
        let oldPrice = 0;
        /*const month = new Date(Date.now()); 
        const lengthOfMonth = new Date(month.getFullYear(),month.getMonth(),0).getDate();
        let date = new Date(Date.now()).getDate()
        */
        for (let i = 1; i<= 31;i++){
            purchased.push({
                d:i,
                price:0,
                name:"",
            });
        }; 
        for (const value of snapshot){
            
            currentDateofMonth = new Date(value.date).getDate()
            
            oldPrice = purchased[currentDateofMonth].price 
            
            purchased[currentDateofMonth] = {price:oldPrice + parseFloat(value.price),d:currentDateofMonth,name:value.name}
        }
        let endIndex = 30;
        for(let i = 30 ;i>0;i--){
            if(purchased[i].name !== ""){
                endIndex=i;
                break;
            }
        }
        
        purchased = purchased.slice(0,endIndex+1);
       
        oldPrice = 0;
        for (let i = 0 ;i<purchased.length;i++){
            oldPrice += purchased[i].price
            purchased[i].price = oldPrice;
        }
        
        this.updateGraphs(purchased);
        this.plotSlr(purchased);
        
       
        
    }
    plotSlr(purchased){
        let inputs = [];
        let outputs = [];
        for (let element of purchased ){
            inputs.push(element.d);
            outputs.push(element.price);
        }
        let slr = new SLR(inputs,outputs);
        let slrPlot = [];
        const month = new Date(Date.now()); 
        const lengthOfMonth = new Date(month.getFullYear(),month.getMonth(),0).getDate();
        for (let i = 1;i<=lengthOfMonth;i++){
            slrPlot.push({
                d:i,
                price:slr.predict(i)
            });
        }
        slrPlot = slrPlot.filter(x => x.price > 0);
        //console.log(slrPlot)
        if(this._isMounted){
            //this.setState({slr:slrPlot});
            //this.setState({predictedTotalExpense:slrPlot[slrPlot.length-1]}) 
        }
    }
    updateGraphs(purchased){
        if (this._isMounted)
            this.setState({graphsData:purchased}); 
    }

    logout(){
        this.props.logout();
    }

    render(){
        //this.props.listBoughts();
        const {navigation : {navigate},items,isEmpty} = this.props;
        const {slr,graphsData} = this.state;
        //const month = new Date(Date.now()); 
        //const lengthOfMonth = new Date(month.getFullYear(),month.getMonth(),).getDate();
        //console.log(lengthOfMonth)
        
        return(
            <View style={styles.container}>
                
                
                <Card style={{flex:1}} elevation={6}>
                    <Card.Content style={{top:-50}} >
                        <VictoryChart width={Dimensions.get("window").width-50} height={Dimensions.get("window").height/2.5} domain={{x:[0, 31 ]}}  >
                            <VictoryLine data = {graphsData} x = "d" y = "price" animate={{duration:200,}}></VictoryLine>
                            <VictoryLine style={{data: { stroke: "#c43a31" },}} data = {slr} x="d" y = "price"></VictoryLine>
                        </VictoryChart>
                        <Card.Title title="Kümülatif Grafik" />
                    </Card.Content>
                    
                </Card>
                
               
                <Card style={{flex:1}}  elevation={5}>
                        <IconButton 
                            icon="plus-circle"
                            color={Colors.deepPurpleA700} 
                            style={styles.addButton} 
                            size={46}
                            onPress= {()=>navigate("Adding")}
                        />
                    <Card.Content style={{flex:1,}}>
                        
                        <SafeAreaView style={{flex:1,width:Dimensions.get("window").width-50,}}>
                        
                            
                            {isEmpty  && (<ActivityIndicator style={{flex:1,justifyContent:'center'}} size="large" color={Colors.redA100} animating={true}/>)}
                            <ProductList products = {items}/>
                        </SafeAreaView>
                    </Card.Content>
                    <Button mode="contained"  onPress= {()=>this.logout()}>Çıkış</Button>
                </Card>
                
            </View>
        );
    }
}
/*
<Button mode="contained" onPress= {()=>navigate("Adding")}>Ekle</Button>
*/
//<Button mode="contained" onPress= {()=>navigate("CategoryAdding")}>Kategori Ekle</Button>
const mapStateToProps = (state)=>{
    //console.log(state);
    return {
        items:state.cuzdan.allBoughts,
        isEmpty : state.cuzdan.isEmpty,
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        listBoughts:()=>listBoughts(dispatch),
        setCategories:()=>setCategories(dispatch),
        logout :() => logout(),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Home)
const styles = StyleSheet.create({
    addButton:{
        position:"absolute",
        top:10,
        right:30,
        zIndex:99,
        color:Colors.deepPurpleA100,

    },  
    container: {
      flex: 1,
      //backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
  });
  