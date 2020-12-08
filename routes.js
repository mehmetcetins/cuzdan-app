import React from "react";
import {createAppContainer,createSwitchNavigator} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {MaterialIcons} from "react-native-vector-icons";

import MyScreen from "./screens/MyScreen";
import Home from "./screens/HomeScreen";
import AddingScreen from "./screens/AddingScreen";
import LoginScreen from "./screens/LoginScreen";
import TabTest from "./screens/tabBarTest";
import CategoryAddingScreen from "./screens/CategoryAddingScreen";
import CategorySelectingScreen from "./screens/CategorySelectingScreen";

const getTabBarIcon = icon => ({ tintColor }) => (
    <MaterialIcons name={icon} size={26} style={{ color: tintColor }} />
  );
const HomeScreens = createStackNavigator(
    {
        Home,
        MyScreen,
        Adding: {
            screen : AddingScreen,
            navigationOptions:{
                title: 'Yeni Ürün',
            }
        },
        CategoryAdding: {
            screen : CategoryAddingScreen,
            navigationOptions:{
                title: 'Yeni Kategori',
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
        initialRouteName:'Home',
        tabBarPosition: "Bottom",
        tabBarOptions:{
            showLabel:false,
        }
    }
);



const testSwitch = createSwitchNavigator(
    {
        
        Login:LoginScreen,
        Tab:TabBarTest,
    },
    {
        initialRouteName:'Login'
    }
    
);

export default createAppContainer(testSwitch);