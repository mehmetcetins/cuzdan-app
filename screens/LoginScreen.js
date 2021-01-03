import React from "react";

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Keyboard
} from "react-native";
import {
    Button,
    TextInput,
    ActivityIndicator,
    Colors
} from "react-native-paper"
import {getErrorMessage} from "../utils/localizedErrorMessage";
import * as firebase from "firebase";

import { connect } from 'react-redux';
import {changeLoadingState} from "../redux/actions";


const screen = Dimensions.get("screen");

class LoginScreen extends React.Component{
    
    state={
        email:"",
        password:"",
        error:null,
        
    };
    
    componentDidMount(){
        
        const firebaseConfig = {
            apiKey: "AIzaSyAaTnLART9qx_m9QxM9j47XSVocsp1YmD0",
            authDomain: "cuzdan-app.firebaseapp.com",
            databaseURL: "https://cuzdan-app.firebaseio.com",
            projectId: "cuzdan-app",
            storageBucket: "cuzdan-app.appspot.com",
            messagingSenderId: "569554745849",
            appId: "1:569554745849:web:772a67a431593f5b5d6528",
            measurementId: "G-G19RPZHDNQ"
        };
        // Initialize Firebase
        const {navigation : {navigate}} = this.props;
        if(!firebase.apps.length){
            firebase.initializeApp(firebaseConfig);
            firebase.auth().onAuthStateChanged((user)=>{
                if(user){
                    //console.log("giriş yapıldı.");
                    //firebase.auth().signOut();
                    this.endLoading();
                    navigate("Drawer");
                    
                }
                else{
                    //console.log("giriş yapılamadı.");
                    this.endLoading();
                    navigate("Login");
                    
                }
            });
    
            
        }
        
        //firebase.analytics();
        
        
        
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

    signIn(){
        
        this.startLoading();
        this.clearErrorMessage();
        //console.log("giriş denemesi");
        //console.log(this.state.email,this.state.password)
        const {email,password} = this.state;
        firebase.auth().signInWithEmailAndPassword(email,password)
        .then(
            (result)=>{
                
                //console.log(result);
            }
        )
        .catch(
            (error)=>{
                this.endLoading();
                this.setState({error:error});
                //console.log(error)
            }
        );
    }
    signUp(){
        Keyboard.dismiss();
        this.props.navigation.navigate("Signup");
        
    }
    render(){
        const {error} = this.state;
        const {isLoading} = this.props;
        const passwordInput = React.createRef();
        return(
            <View style={styles.container}>
                <View style={styles.loginSection}>
                {error && (
                    <Text style={styles.errorText}>{getErrorMessage(error.code)}</Text>
                )}
                <ActivityIndicator size="large" color={Colors.red800} animating={isLoading}/>
                {!isLoading && (
                    <View>
                        <TextInput 
                            autoFocus={true} 
                            keyboardType="email-address" 
                            autoCapitalize="none"  
                            style={styles.inputs} 
                            label="E-Posta" 
                            onChangeText={(text)=>{
                                this.setState({email:text})
                            }}
                            blurOnSubmit={false}
                            onSubmitEditing={()=>passwordInput.current.focus()}
                        ></TextInput>
                        <TextInput 
                            ref={passwordInput} 
                            secureTextEntry={true} 
                            label="Şifre"
                            style = {styles.inputs}
                            
                            //placeholder="Password" 
                            onChangeText={(text)=>{
                                this.setState({password:text})}
                            }
                        ></TextInput>
                        <Button style={styles.buttons} contentStyle={styles.buttonsContent} mode= "contained" onPress={()=>this.signIn()}>
                            Giris Yap
                        </Button>
                        <Button style={styles.buttons} contentStyle={styles.buttonsContent} mode= "contained" onPress={()=>this.signUp()}>
                            Kayıt Ol
                        </Button>
                    </View>
                )}
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state)=>{
    //console.log(state);
    return {
        isLoading:state.cuzdan.isLoading,
    }
}
const mapDispatchToProps = {changeLoadingState}
export default connect(mapStateToProps,mapDispatchToProps)(LoginScreen)

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:'center'
    },
    loginSection:{
        width:screen.width-20
    },
    inputs:{
        


    },
    buttonsContent:{
        paddingVertical:20,
    },
    buttons:{
        marginTop:10,
        elevation:50,
    },
    errorText:{
        fontSize:18,
        color:Colors.red900,
    }

})