import { SELECT_CATEGORY,ADD_BOUGHT,LIST_BOUGHT,SET_CATEGORIES } from "./actionTypes";

import * as firebase from 'firebase';


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

export const listBoughts = (dispatch)=> {
    const database = firebase.database();
    
    database.ref("boughts").child(firebase.auth().currentUser.uid).once('value',(snapshot) => {
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
        //console.log(allBoughts)
        
        }
        dispatch({
            type : LIST_BOUGHT,
            payload:{
                allBoughts:allBoughts,
            }
        });
    });
    
    //console.log(dispatch);

    
}

export const addBoughts = ({name,price,quantity,categoryName}) => {
    let userBoughtRef = firebase.database().ref("boughts");
    userBoughtRef = userBoughtRef.child(firebase.auth().currentUser.uid);
    userBoughtRef.push({
        name: name,
        price: price,
        quantity:quantity,
        date: Date.now(),
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