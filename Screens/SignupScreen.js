import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from "react-native";
import {
    TextInput,
    Button,
    ActivityIndicator,
    Colors,
} from "react-native-paper";
import { connect } from 'react-redux';
import {changeLoadingState} from "../redux/actions";
import {getErrorMessage} from "../utils/localizedErrorMessage";
import * as firebase from "firebase";
const screen = Dimensions.get("screen");

class SignupScreen extends React.Component{
    state={
        error:null,
        email:"",
        password:"",
        passwordCheck:"",
    }

    
    startLoading(){
        this.props.changeLoadingState(true);
    }
    endLoading(){
        this.props.changeLoadingState(false);
    }

    clearErrorMessage(){
    
        this.setState({error:null});
    }
    checkAndSignUp(){
        const {email,password,passwordCheck} = this.state;
        
        if (email === ""){
           
            this.setState({error:{code:"99"}})
        }
        else if(password !== passwordCheck || password === "" || passwordCheck === "" ){
            
            this.setState({error:{code:"98"}})
        }
        else{
            this.signUp();
        }
    }
    signUp(){
        this.startLoading();
        this.clearErrorMessage();
        //console.log("kayit denemesi");
        //console.log(this.state.email,this.state.password);
        const {email,password} = this.state;
        firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(
            (result)=>{
                this.endLoading();
                //console.log(result);
            }
        )
        .catch(
            (error)=>{
                //console.log(error.message)
                this.endLoading();
                this.setState({error:error});
            }
        )
    }
    render(){
        const {error} = this.state;
        const {isLoading} = this.props;
        const passwordInput = React.createRef();
        const passwordCheckInput = React.createRef();
        return (
            <View style={styles.container}>
                <View style={styles.signingSection}>
                    {error && (
                        <Text style={styles.errorText}>{getErrorMessage(error.code)}</Text>
                    )}
                    <ActivityIndicator size="large" color={Colors.red800} animating={isLoading}/>
                    {!isLoading && (
                    <View>
                        <TextInput 
                            label="E-Posta"
                            autoFocus={true}
                            keyboardType="email-address"
                            autoCapitalize="none"  
                            blurOnSubmit={false}
                            onChangeText={(text)=>{
                                this.setState({email:text})
                            }}
                            onSubmitEditing={()=>{passwordInput.current.focus();}}
                        />
                        <TextInput 
                            ref = {passwordInput}
                            label="Şifre"
                            secureTextEntry={true} 
                            blurOnSubmit={false}
                            onChangeText={(text)=>{
                                this.setState({password:text})
                                
                            }}
                            onSubmitEditing={()=>{passwordCheckInput.current.focus();}}
                        />
                        <TextInput 
                            ref = {passwordCheckInput}
                            label="Şifreyi Tekrar Giriniz"
                            secureTextEntry={true} 
                            onChangeText={(text)=>{
                                this.setState({passwordCheck:text})
                            }}
                        />
                        <Button style = {styles.signInput} contentStyle={styles.signInputContent} mode = "contained" onPress={()=>{
                            this.checkAndSignUp();
                        }}>
                            Kayıt Ol
                        </Button>
                    </View>
                    )}
                </View>
                
                
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    signingSection:{
        width:screen.width-20
    },
    signInputContent:{
        paddingVertical:20,
        
        
    },
    signInput:{
        marginTop:10,
        elevation:50,
    },
    errorText:{
        fontSize:18,
        color:Colors.red900,
    }
})

const mapStateToProps = (state)=>{
    //console.log(state);
    return {
        isLoading:state.cuzdan.isLoading,
    }
}
const mapDispatchToProps = {changeLoadingState}
export default connect(mapStateToProps,mapDispatchToProps)(SignupScreen)