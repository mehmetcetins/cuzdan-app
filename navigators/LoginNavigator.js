import React from "react";

import {createStackNavigator} from "react-navigation-stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";


export default LoginNavigator = createStackNavigator(
    {
       Login:{
           screen:LoginScreen,
           navigationOptions:{
               headerTitle:"Giriş Sayfası",
           }
       },
       Signup:{
        screen:SignupScreen,
        navigationOptions:{
            headerTitle:"Kayıt Sayfası",
            }
        }
    },
    {
        initialRouteName:"Login",
    }
);