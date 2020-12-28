import { SELECT_CATEGORY, ADD_BOUGHT } from "../actionTypes";
import * as firebase from 'firebase';
const initialState = {
  categoryName : "Kategori Seçiniz",
  allBoughts: [],
};
let tempBoughts = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case SELECT_CATEGORY: {
      
      const { categoryName } = action.payload;
      //console.log(categoryName);
      return {
        ...state,
        categoryName: categoryName
      };
    }
    case ADD_BOUGHT: {
      listBoughts();
      
      return {
        ...state,
        allBoughts:tempBoughts,
      }
    }
  
    default:
      return state;
  }
}


const setAllBoughts = (allBoughts)=>{
  tempBoughts = allBoughts;
};

const listBoughts = ()=> {
  const database = firebase.database();
    database.ref("boughts").child(firebase.auth().currentUser.uid).once('value',(snapshot) => {
      if(snapshot.exists()){
        let allBoughts = [];
        for (const [key,value] of Object.entries(snapshot.val())){
          allBoughts.push({
          key : key,
          name: value.name,
          price : value.price,
          quantity: value.quantity,
          date: new Date(value.date).toLocaleDateString("tr-TR"),
          })
         
        }
        setAllBoughts(allBoughts);
      }
      });
}
