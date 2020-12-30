import { 
    SELECT_CATEGORY,
    ADD_BOUGHT,
    LIST_BOUGHT,
    SET_CATEGORIES,
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
export const listBoughts = (dispatch,startDate = -1,endDate = -1)=> {
    if (startDate == endDate && startDate == -1){
        startDate = new Date(Date.now());
        endDate = new Date(startDate.getFullYear(),startDate.getMonth()+1,0).getTime();
        startDate = new Date(startDate.getFullYear(),startDate.getMonth() ,1).getTime();
    }
    dispatch({
        type:LIST_BOUGHT,
        payload:{
            allBoughts:[],
            isEmpty:true,
        }
    })
    const database = firebase.database();
    
    database.ref("boughts").child(firebase.auth().currentUser.uid).orderByChild('date').startAt(startDate).endAt(endDate).once('value',(snapshot) => {
    let allBoughts = [];
    if(snapshot.exists()){
        
        for (const [key,value] of Object.entries(snapshot.val())){
            allBoughts.push({
                key : key,
                name: value.name,
                price : value.price,
                categoryName: value.categoryName,
                quantity: value.quantity,
                date: new Date(value.date).toLocaleDateString("tr-TR"),
            })
        
        }
        
        
        }
        dispatch({
            type : LIST_BOUGHT,
            payload:{
                allBoughts:allBoughts.reverse(),
                isEmpty:!(allBoughts.length > 0),
            }
        });
    });
    
    //console.log(dispatch);

    
}

export const addBoughts = ({name,price,quantity,categoryName,date}) => {
    console.log({name,price,quantity,categoryName,date});
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


export const logout = ()=> {
    firebase.auth().signOut();
    
}

