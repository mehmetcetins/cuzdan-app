
import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import DrawerTestScreen from "../screens/DrawerTestScreen";
import TabBarTest from "./TabNavigator";
export default TestDrawer = createDrawerNavigator(
    {
        TabBarTest,
        DrawerTestScreen
    },
    {
        
        initialRouteName:"TabBarTest",
        contentComponent: DrawerTestScreen,
    }

    
);