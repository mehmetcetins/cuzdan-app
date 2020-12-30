import { 
  SELECT_CATEGORY,
  ADD_BOUGHT,
  SET_CATEGORIES,
  LIST_BOUGHT,

} from "../actionTypes";
const initialState = {
  categoryName : "Kategori Seçiniz",
  allBoughts: [],
  categories: [],
  isEmpty:false,
};

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
        isEmpty:action.payload.isEmpty,
      }
    }
    case SET_CATEGORIES:{
     
      //console.log(action.payload.categories) 
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


