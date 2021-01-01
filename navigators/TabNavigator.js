
import React from "react";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {Colors} from "react-native-paper"
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreens from "./HomeNavigator";

import TabTest from "../screens/tabBarTest";

const getTabBarIcon = icon => ({ tintColor }) => (
    <MaterialCommunityIcons name={icon} size={26} style={{ color: tintColor }} />
);

export default TabBarTest = createBottomTabNavigator(
    {
        Home : HomeScreens,
        Test : {
            screen: TabTest,
            navigationOptions:{
                tabBarIcon: getTabBarIcon("scale-balance"),
                
            },
        },
    },
    {
        initialRouteName:'Home',
        tabBarPosition: "Bottom",
        tabBarOptions:{
            activeTintColor:Colors.deepPurpleA700,
            showLabel:false,
        }
    }
);
