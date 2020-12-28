import { SELECT_CATEGORY,ADD_BOUGHT } from "./actionTypes";

import * as firebase from 'firebase';


export const selectCategory = name => {
    return {
        type : SELECT_CATEGORY,
        payload : {
            categoryName : name
        }
    };
};

export const listBoughts = ()=> ({
    type : ADD_BOUGHT,
    payload:{}
})

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