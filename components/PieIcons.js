import React from "react";
import {
    Text,
} from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
export default class PieIcons extends React.Component {

    render() {
        const labels={
            "Yiyecek & İçecek":"hamburger",
            "Alışveriş":"shopping-cart",
            "Ulaşım":"bus",
            "Yaşam & Eğlence":"smile",
            "Elektronik":"plug",
        }
        const {x, y, datum} = this.props;
        const Icon = labels[datum.category] 
        //console.log(x+" "+y)
        return (
        <Text style={{
            position:"absolute",
            top:y-10,
            left:x-10,
        }}  >
            <FontAwesome5 name={Icon} size={24} color="black" />
        </Text>
        );
    }
}