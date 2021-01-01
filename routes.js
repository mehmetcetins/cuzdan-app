import React from "react";
import {
    createAppContainer,
    createSwitchNavigator,
} from "react-navigation";





import LoginScreen from "./screens/LoginScreen";

import TestDrawer from "./navigators/TestDrawer";

const testSwitch = createSwitchNavigator(
    {
        
        Login:LoginScreen,
        Tab:TestDrawer,
    },
    {
        initialRouteName:'Login'
    }
    
);


export default createAppContainer(testSwitch);