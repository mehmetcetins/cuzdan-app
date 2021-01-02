import { 
    SELECT_CATEGORY,
    ADD_BOUGHT,
    LIST_BOUGHT,
    SET_CATEGORIES,
    SET_DATES,
    LOADING
} from "./actionTypes";
import { LogBox } from 'react-native';
import * as firebase from 'firebase';
LogBox.ignoreAllLogs();

export const selectCategory = name => {
    return {
        type : SELECT_CATEGORY,
        payload : {
            categoryName : name
        }
    };
};

export const setCategories = (dispatch)=>  {
    firebase.
    database().
    ref("categories").
    once('value').then((snapshot) => {
        dispatch({
            type:SET_CATEGORIES,
            payload:{
                categories:Object.values(snapshot.val())
            }
        });
    });

    
}
export const listBoughts = (dispatch,startDate,endDate)=> {
    dispatch({
        type:LIST_BOUGHT,
        payload:{
            allBoughts:[],
            isFetching:true,
        }
    })
    if (startDate == endDate && startDate == -1){
        startDate = new Date(Date.now());
        endDate = new Date(startDate.getFullYear(),startDate.getMonth()+1,0);
        startDate = new Date(startDate.getFullYear(),startDate.getMonth() ,1);
    }
    else {
        endDate = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate() +1)
    }
    
    //console.log(startDate,endDate);
    
    const database = firebase.database();
    
    database.ref("boughts").child(firebase.auth().currentUser.uid).orderByChild('date').startAt(startDate.getTime()).endAt(endDate.getTime()).once('value',(snapshot) => {
    let allBoughts = [];
    if(snapshot.exists()){
        
        for (const [key,value] of Object.entries(snapshot.val())){
            allBoughts.push({
                key : key,
                name: value.name,
                price : value.price,
                categoryName: value.categoryName,
                quantity: value.quantity,
                date: new Date(value.date).toLocaleDateString(),
            })
        
        }
        
        
        }
        dispatch({
            type : LIST_BOUGHT,
            payload:{
                allBoughts:allBoughts.reverse(),
                isFetching:false,
            }
        });
    });
    
    //console.log(dispatch);

    
}

export const setDates = (startDate,endDate)=>{
    //console.log(startDate,endDate,"asdasdasğdkasğodkasdjkapjdp");
    return {
        type : SET_DATES,
        payload : {
            startDate : startDate,
            endDate:endDate,
        }
    };
}

export const addBoughts = ({name,price,quantity,categoryName,date}) => {
    //console.log({name,price,quantity,categoryName,date});
    let userBoughtRef = firebase.database().ref("boughts");
    userBoughtRef = userBoughtRef.child(firebase.auth().currentUser.uid);
    userBoughtRef.push({
        name: name,
        price: price,
        quantity:quantity,
        date: date,
        categoryName:categoryName,
    }).catch((error)=>{
        console.log(error)
    });
    return {
        type : ADD_BOUGHT,
        payload:{}
    }
}

export const deleteBought = (key) => {
    firebase.database().ref("boughts").child(firebase.auth().currentUser.uid).child(key).remove();
}

export const logout = ()=> {
    firebase.auth().signOut();
}

export const changeLoadingState = (loadingState)=> {
    return {
        type:LOADING,
        payload:{
            isLoading : loadingState,
        }
    }
}

