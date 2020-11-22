import React from "react";
import {StyleSheet,View} from "react-native";
import MyInput from "../components/myInput";

export default class Home extends React.Component{
    render(){
        const {navigation : {navigate}} = this.props;
        return(
            <View style={styles.container}>
                <MyInput navigateFunc={navigate}></MyInput>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  