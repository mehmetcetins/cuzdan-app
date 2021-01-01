import React from "react";

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    
} from "react-native";
import {
    Button,
    TextInput,
    ActivityIndicator,
    Colors
} from "react-native-paper"
import * as firebase from "firebase";
export default class LoginScreen extends React.Component{
    
    state={
        email:"",
        password:"",
        error:null,
        loading:true,
        
    };
    
    _isMounted = false;
    componentDidMount(){
        this._isMounted = true;
        var firebaseConfig = {
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
            
        }
        
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                //console.log("giriş yapıldı.");
                //firebase.auth().signOut();
                this.closeLoading();
                navigate("Tab");
                
            }
            else{
                //console.log("giriş yapılamadı.");
                this.closeLoading();
                navigate("Login");
                
            }
        });

        //firebase.analytics();
        
        
        
    }

    componentWillUmmount() {
        this._isMounted = false;
    }
    closeLoading(){
        if(this._isMounted)
            this.setState({loading:false});
    }
    clearErrorMessage(){
        if(this._isMounted)
            this.setState({error:null});
    }

    async signIn(){
        if(this._isMounted)
            this.setState({loading:true});
        this.clearErrorMessage();
        //console.log("giriş denemesi");
        //console.log(this.state.email,this.state.password)
        const {email,password} = this.state;
        await firebase.auth().signInWithEmailAndPassword(email,password)
        .then(
            (result)=>{
                
                //console.log(result);
            }
        )
        .catch(
            (error)=>{
                this.closeLoading();
                if(this._isMounted)
                    this.setState({error:error});
            }
        );
    }
    async signUp(){
        if(this._isMounted)
            this.setState({loading:true});
        this.clearErrorMessage();
        //console.log("kayit denemesi");
        //console.log(this.state.email,this.state.password);
        const {email,password} = this.state;
        await firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(
            (result)=>{
                //console.log(result);
            }
        )
        .catch(
            (error)=>{
                //console.log(error.message)
                this.closeLoading();
                if(this._isMounted)
                    this.setState({error:error});
            }
        )
    }
    render(){
        const {error,loading} = this.state;
        const passwordInput = React.createRef();
        return(
            <View style={styles.container}>
                {error && (
                    <Text style={{width:Dimensions.get("screen").width-40,fontSize:18}}>{error.message}</Text>
                )}
                
                <ActivityIndicator size="large" color={Colors.red800} animating={loading}/>
                {!loading && (
                    <View >
                        <TextInput 
                            autoFocus={true} 
                            keyboardType="email-address" 
                            autoCapitalize="none"  
                            style={styles.inputs} 
                            label="E-mail" 
                            onChangeText={(text)=>{
                                if(this._isMounted)
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
                                if(this._isMounted)
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
        );
    }
}
/*
<TouchableOpacity style={styles.buttons} onPress={()=>this.signIn()} >
                            <View >
                                <Text style={styles.buttonText}  ></Text>
                            </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons} onPress={()=>this.signUp()}>
                            <View>
                                <Text style={styles.buttonText} >Kayıt Ol</Text>
                            </View>
                        </TouchableOpacity>
*/
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        //alignItems:"center",
    },
    inputs:{
        width:Dimensions.get("screen").width-20,
        /*borderWidth:1,
        alignItems:"center",
        padding:10,
        marginTop:10,*/
        marginHorizontal:10,
    },
    buttonsContent:{
        paddingVertical:20,
    },
    buttons:{
        width:Dimensions.get("screen").width-20,
        marginHorizontal:10,
        
        marginTop:10,
        /*justifyContent:"center",
        alignItems:"center",
        backgroundColor:"lightcoral",
        shadowColor:"black",
        shadowOffset:{
            width:0,
            height:2,
        },*/
        elevation:50,
    },
    buttonText:{
        color:"white",
        fontSize:16,
    }

})