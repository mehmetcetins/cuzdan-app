import { SELECT_CATEGORY } from "./actionTypes";

import * as firebase from 'firebase';


export const selectCategory = name => {
    console.log("böyle kullanabiliyor muyum testi.")
    return {
        type : SELECT_CATEGORY,
        payload : {
            categoryName : name
        }
    };
};