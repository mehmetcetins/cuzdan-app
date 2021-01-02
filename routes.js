import React from "react";
import {
    createAppContainer,
    createSwitchNavigator,
} from "react-navigation";





import LoginNavigator from "./navigators/LoginNavigator";

import DrawerNavigator from "./navigators/DrawerNavigator";

const SwitchNavigator = createSwitchNavigator(
    {
        
        Login:LoginNavigator,
        
        Drawer:DrawerNavigator,
    },
    {
        initialRouteName:'Login'
    }
    
);


export default createAppContainer(SwitchNavigator);