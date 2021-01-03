import React from "react";
import {
    Text,
} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class PieIcons extends React.Component {

    render() {
        const {x, y, datum} = this.props;
        const Icon = datum.icon
        
        //console.log(x+" "+y)
        return (
        <Text style={{
            position:"absolute",
            top:y-10,
            left:x-10,
        }}  >
            <MaterialCommunityIcons name={Icon} size={24} color="black" />
        </Text>
        );
    }
}

