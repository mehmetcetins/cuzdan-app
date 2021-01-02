
import React from "react";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {Colors} from "react-native-paper"
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreens from "./HomeNavigator";

import GraphsScreen from "../screens/GraphsScreen";

const getTabBarIcon = icon => ({ tintColor }) => (
    <MaterialCommunityIcons name={icon} size={26} style={{ color: tintColor }} />
);

export default TabNavigator = createBottomTabNavigator(
    {
        Home : HomeScreens,
        Graphs : {
            screen: GraphsScreen,
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
