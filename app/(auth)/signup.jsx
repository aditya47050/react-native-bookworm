import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome, Fontisto, Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import {useAuthStore} from '../../store/authStore'

export default function SignUp() {

    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [showPassword,setShowPassword] = useState(false)
 


    const router = useRouter();
    const {user,isLoading,register} = useAuthStore()

    const handleSignUp = async() => {
        const result = await register(username,email,password)
        if(!result.success) Alert.alert("Error",result.error)
    }

  return (
    <View style={styles.container}>
        <View style={styles.insideContainer}>
            <View style={styles.textImage}>
            <Text style={styles.title}>BookWorm App </Text>
            <Image source={require("../../assets/images/bookWorm.jpg")} style={styles.image}/>
            </View>

            <View style={styles.inputText}>
            <Ionicons name="person-circle-outline" size={24} color="black" />
                <TextInput placeholder='Enter Username' value={username} onChangeText={setUsername} style={{width:300}}/>
            </View>

            <View style={styles.inputText}>
            <Fontisto name="email" size={22} color="gray" />
                <TextInput placeholder='Enter Your Email' value={email} onChangeText={setEmail} style={{width:300}}/>
            </View>

            <View style={styles.inputText}>
            <FontAwesome name="key" size={24} color="black" />
                <TextInput placeholder='Enter Your Password' value={password} onChangeText={setPassword} style={{width:300}}/>
            </View>

            <TouchableOpacity style={styles.button} onPress={()=>handleSignUp()}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.login}>
            <Text>Already have an account? </Text>
            <TouchableOpacity><Text style={styles.loginText} onPress={()=>router.back()}>Login</Text></TouchableOpacity>
            </View>

        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white"
    },
    insideContainer:{
        borderWidth:0.3,
        alignItems:"center",
        marginTop:"40%",
        height:"60%",
        paddingLeft:10,
        marginLeft:20,
        marginRight:20,
        borderRadius:10
    },
    title:{
        fontWeight:"bold",
        color:"green",
        fontSize:30
    },
    textImage:{
        flexDirection:"row",
        paddingTop:20
    },
    image:{
        height:40,
        width:40
    },
    inputText:{
        flexDirection:"row",
        borderWidth:0.3,
        width:300,
        borderRadius:10,
        marginTop:30,
        paddingLeft:10,
        alignItems:"center",
        gap:10
    },
    button:{
        backgroundColor:"#4CBB17",
        marginTop:50,
        width:300,
        borderWidth:0.2,
        borderColor:"white",
        borderRadius:10,
        padding:10
    },
    buttonText:{
        fontWeight:"bold",
        textAlign:"center",
        fontSize:17,
        color:"white"
    },
    login:{
        flexDirection:"row",
        marginTop:20
    },
    loginText:{
        fontWeight:"bold",
        color:"green"
    }

})