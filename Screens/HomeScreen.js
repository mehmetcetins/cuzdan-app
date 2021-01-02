import React from "react";
import {
    StyleSheet,
    View,
    SafeAreaView,
    Dimensions,
    Text,
} from "react-native";
import { 
    Button,
    ActivityIndicator,
    Colors,
    Card,
    IconButton,
    Title,
} from 'react-native-paper';
import {
    VictoryChart,
    VictoryLine
} from "victory-native";
import '@tensorflow/tfjs-react-native';
import {SLR} from "ml-regression";
import ProductList from "../components/productList";
import { connect } from 'react-redux';
import {setCategories,listBoughts,logout,setDates} from "../redux/actions";
import {schedulePushNotification,registerForPushNotificationsAsync, cancelNotification,} from "../utils/notificationApi";

const screen = Dimensions.get("screen");
const window = Dimensions.get("window");
class Home extends React.Component{
    
    state={
        isTfReady: false,
        modelPredictions: [],
        graphsData: [],
        slr: [],
        predictedTotalExpense:0,
        showLoginModal:false,
        notifId:null,
    };

    
   
    static navigationOptions = ({ navigation }) => {

        return {
            
            headerLeft:(props)=> {
                //console.log(props)
                return (
                    
                  <IconButton
                    icon='menu'
                    color={Colors.black}
                    size={26} 
                    style={{marginLeft:10,}}
                    onPress={()=> {
                        navigation.openDrawer();
                    }}
                    />
                    
                )
            }
        }
    }

    componentDidMount(){
       
        
        const {setCategories,listBoughts,setDates,startDate,endDate} = this.props;
        setCategories();
        setDates(-1,-1);
        listBoughts(-1,-1);
        
    }
    async notifTest(totalExpense){
        const token = await registerForPushNotificationsAsync();
        
        const identifier= await schedulePushNotification(totalExpense);
        this.setState({notifId:identifier})
    }
    componentDidUpdate(prevProps,prevState){
        const {predictedTotalExpense} = this.state;
        const {items} = this.props; 
        if(items != prevProps.items){
            this.cumulativeGraph(items);
        }
        if(predictedTotalExpense != prevState.predictedTotalExpense){
            cancelNotification(prevProps.notifId);
            if(predictedTotalExpense ){
                if(predictedTotalExpense.price > 0)
                    this.notifTest(predictedTotalExpense.price);
            }
            
        }
        
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
       
        this.setState({
            slr:slrPlot,
            predictedTotalExpense:slrPlot[slrPlot.length-1]
        });
        
    }
    updateGraphs(purchased){
        
            this.setState({graphsData:purchased}); 
    }

    

    render(){
        //this.props.listBoughts();
        const {navigation : {navigate},items,isFetching} = this.props;
        const {slr,graphsData} = this.state;
        //const month = new Date(Date.now()); 
        //const lengthOfMonth = new Date(month.getFullYear(),month.getMonth(),).getDate();
        //console.log(lengthOfMonth)
        
        return(
            <View style={styles.container}>
                
                
                <Card style={styles.cardStlye} elevation={6}>
                    <Card.Content style={{top:-50}} >
                        <VictoryChart width={window.width-50} height={window.height/2.5} domain={{x:[0, 31 ]}}  >
                            <VictoryLine data = {graphsData} x = "d" y = "price" animate={{duration:200,}}></VictoryLine>
                            <VictoryLine style={{data: { stroke: "#c43a31" },}} data = {slr} x="d" y = "price" animate={{duration:200,}}></VictoryLine>
                        </VictoryChart>
                        <Card.Title title="Kümülatif Grafik" />
                    </Card.Content>
                    
                </Card>
                
               
                <Card style={styles.cardStlye}  elevation={5}>
                        <IconButton 
                            icon="plus-circle"
                            color={Colors.deepPurpleA700} 
                            style={styles.addButton} 
                            size={46}
                            onPress= {()=>navigate("Adding")}
                        />
                    <Card.Content style={{flex:1,}}>
                        
                        <SafeAreaView style={styles.scrollAreaStyle}>
                        
                            
                            {isFetching  && (<ActivityIndicator style={styles.activityIndicator} size="large" color={Colors.redA100} animating={true}/>)}
                            {!isFetching && items.length == 0 && (
                                <Title >Veri YOK</Title>
                            )}
                            <ProductList products = {items}/>
                        </SafeAreaView>
                    </Card.Content>
                </Card>
                
            </View>
        );
    }
}


const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        //backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    activityIndicator:{
        flex:1,
        justifyContent:'center'
    },
    scrollAreaStyle:{
        flex:1,
        width:screen.width-50,
    },
    addButton:{
        position:"absolute",
        top:10,
        right:30,
        zIndex:99,
        color:Colors.deepPurpleA100,

    },  
    cardStlye:{
        flex:1,
    },
    
});

const mapStateToProps = (state)=>{
    //console.log(state);
    return {
        items:state.cuzdan.allBoughts,
        isFetching : state.cuzdan.isFetching,
        startDate: state.cuzdan.startDate,
        endDate: state.cuzdan.endDate,
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        listBoughts:(startDate,endDate)=>listBoughts(dispatch,startDate,endDate),
        setCategories:()=>setCategories(dispatch),
        setDates:(startDate,endDate) => dispatch(setDates(startDate,endDate)),
        logout :() => logout(),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Home)

  