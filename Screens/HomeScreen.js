import React from "react";
import {
    StyleSheet,
    View,
    SafeAreaView,
} from "react-native";
import { 
    Button 
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
        const month = new Date(Date.now()); 
        const lengthOfMonth = new Date(month.getFullYear(),month.getMonth(),0).getDate();
        let date = new Date(Date.now()).getDate()
        
        for (let i = 1; i<= date+1;i++){
            purchased.push({
                d:i,
                price:0,
            });
        }; 
        for (const value of snapshot){
            
            currentDateofMonth = new Date(value.date).getDate()
            
            oldPrice = purchased[currentDateofMonth].price 
            
            purchased[currentDateofMonth] = {price:oldPrice + parseFloat(value.price),d:currentDateofMonth}
        }
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
            this.setState({slr:slrPlot});
            this.setState({predictedTotalExpense:slrPlot[slrPlot.length-1]}) 
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
        const {navigation : {navigate},items} = this.props;
        const {slr,graphsData} = this.state;
        const month = new Date(Date.now()); 
        const lengthOfMonth = new Date(month.getFullYear(),month.getMonth(),0).getDate();
        return(
            <View style={styles.container}>
                <VictoryChart  domain={{x:[0, lengthOfMonth ]}}>
                    <VictoryLine data = {graphsData} x = "d" y = "price"></VictoryLine>
                    <VictoryLine style={{data: { stroke: "#c43a31" },}} data = {slr} x="d" y = "price"></VictoryLine>
                </VictoryChart>
                <Button mode="contained" onPress= {()=>navigate("Adding")}>Ekle</Button>
                
                <Button mode="contained"  onPress= {()=>this.logout()}>Çıkış</Button>
                
                <SafeAreaView style={{flex:1,width:300,}}>
                    <ProductList products={items}/>
                </SafeAreaView>
                
            </View>
        );
    }
}
//<Button mode="contained" onPress= {()=>navigate("CategoryAdding")}>Kategori Ekle</Button>
const mapStateToProps = (state)=>{
    //console.log(state);
    return {
        items:state.cuzdan.allBoughts,
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
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  