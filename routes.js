import React from "react";
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";


import MyScreen from "./Screens/MyScreen";
import Home from "./Screens/HomeScreen";

const HomeScreens = createStackNavigator(
    {
        Home,
        MyScreen,
    },
    {
        initialRouteName:"Home",

    }
);

export default createAppContainer(HomeScreens);