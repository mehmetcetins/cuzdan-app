import { SELECT_CATEGORY } from "../actionTypes";

const initialState = {
  categoryName : "Kategori Seçiniz",
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SELECT_CATEGORY: {
      
      const { categoryName } = action.payload;
      console.log(categoryName);
      return {
        ...state,
        categoryName: categoryName
      };
    }
  
    default:
      return state;
  }
}
