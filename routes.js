import React from "react";
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {MaterialIcons} from "react-native-vector-icons";

import MyScreen from "./screens/MyScreen";
import Home from "./screens/HomeScreen";
import TabTest from "./screens/tabBarTest";
const getTabBarIcon = icon => ({ tintColor }) => (
    <MaterialIcons name={icon} size={26} style={{ color: tintColor }} />
  );
const HomeScreens = createStackNavigator(
    {
        Home,
        MyScreen,
    },
    {
        mode:"Card",
        initialRouteName:"Home",
        navigationOptions:{
            tabBarIcon : getTabBarIcon("home")
        }
    }
);

const TabBarTest = createBottomTabNavigator(
    {
        Home : HomeScreens,
        Test : {
            screen: TabTest,
            navigationOptions:{
                tabBarIcon: getTabBarIcon("assessment"),
            },
        },
    },
    {
        initialRouteName:"Home",
        tabBarPosition: "Bottom",

    }
)

export default createAppContainer(TabBarTest);