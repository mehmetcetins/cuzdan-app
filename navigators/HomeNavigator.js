import React from "react";
import {
    IconButton,
    Colors
} from "react-native-paper";
import {createStackNavigator} from "react-navigation-stack";

import Home from "../screens/HomeScreen";
import AddingScreen from "../screens/AddingScreen";
import CategorySelectingScreen from "../screens/CategorySelectingScreen";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const getTabBarIcon = icon => ({ tintColor }) => (
    <MaterialCommunityIcons name={icon} size={26} style={{ color: tintColor }} />
);

export default HomeScreens = createStackNavigator(
    {
        Home:{
            screen:Home,
            navigationOptions:{
                title : 'Ana Sayfa',
                
            }
        },
        Adding: {
            screen : AddingScreen,
            navigationOptions:{
                title: 'Yeni Harcama',
            }
        },
        CategorySelecting:{
            screen:CategorySelectingScreen,
            navigationOptions:{
                title: 'Kategori Seç'
            }
        }
    },
    {
        
        mode:"Card",
        initialRouteName:"Home",
        navigationOptions:{
            tabBarIcon : getTabBarIcon("home")
        }
    }
);