import { 
  SELECT_CATEGORY,
  ADD_BOUGHT,
  SET_CATEGORIES,
  LIST_BOUGHT,
  SET_DATES,
  LOADING,
} from "../actionTypes";
const initialState = {
  categoryName : "Kategori Seçiniz",
  allBoughts: [],
  categories: [],
  isFetching:true,
  isLoading:true,
  startDate:-1,
  endDate:-1,
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
        isFetching:action.payload.isFetching,
      }
    }
    case SET_CATEGORIES:{
     
      //console.log(action.payload.categories) 
      return {
        ...state,
        categories:action.payload.categories,
      }
    }
    case SET_DATES:{
      //console.log(action.payload)
      return {
        ...state,
        startDate:action.payload.startDate,
        endDate:action.payload.endDate,
      }
    }
    case LOADING:{
      return {
        ...state,
        isLoading:action.payload.isLoading,
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


