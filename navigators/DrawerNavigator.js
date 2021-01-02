
import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import DrawerMenuScreen from "../screens/DrawerMenuScreen";
import ExpenseUpdateScreen from "../screens/ExpenseUpdateScreen";
import TabNavigator from "./TabNavigator";
export default DrawerNavigator = createDrawerNavigator(
    {
        TabNavigator,
        DrawerMenuScreen,
        ExpenseUpdateScreen
    },
    {
        
        initialRouteName:"TabNavigator",
        contentComponent: DrawerMenuScreen,
    }

    
);