import { SELECT_CATEGORY, ADD_BOUGHT, SET_CATEGORIES,LIST_BOUGHT } from "../actionTypes";
import * as firebase from 'firebase';
const initialState = {
  categoryName : "Kategori Seçiniz",
  allBoughts: [],
  categories: [],
};
let tempBoughts = [];
let tempCategories = [];
export default function reducer(state = initialState, action) {
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
      return null
    }
    case LIST_BOUGHT:{
      return {
        ...state,
        allBoughts:action.payload.allBoughts,
      }
    }
    case SET_CATEGORIES:{
     
      console.log(action.payload.categories) 
      return {
        ...state,
        categories:action.payload.categories,
      }
    }
    case "TEST" : {
      console.log("test,test")
      return {
        ...state,
        allBoughts: tempBoughts,
      }
    }
  
    default:
      return state;
  }
}




const setCategories = (allCategories)=> {
  tempCategories = allCategories
}


