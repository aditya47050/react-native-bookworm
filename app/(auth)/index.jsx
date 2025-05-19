import { useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome, Fontisto, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {useAuthStore} from "../../store/authStore"


export default function Login(){
  const[email,setEmail] = useState("")
  const[password,setPassword] = useState("")
  const[showPassword,setShowPassword] = useState(false)
  const{user,isLoading,login} = useAuthStore()

  const router = useRouter();

  const handleLogin = async() =>{
    const result = await login(email,password)
    if(!result.success) Alert.alert("Error",result.error);
  }

  return(
    <View style={styles.container}>

          <Image
          source={require('../../assets/images/book.jpg')}
          style={styles.topImage}
          resizeMode="contain"
          />
        <View style={styles.borderView}>
          <Text style={styles.text}>BookWorm App</Text>

        <View style={styles.email}>
          <Fontisto name="email" size={22} color="gray" />
          <TextInput
            placeholder="Enter your email"
            style={{paddingLeft:10,flex:1}}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <></>
        <View style={styles.email}>
        <FontAwesome name="key" size={24} color="black" />
            <TextInput
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            style={{paddingLeft:10,flex:1}}
            value={password}
            onChangeText={setPassword}
            
          />


          <TouchableOpacity onPress={()=>setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={"#C4A484"} style={{paddingRight:10}}/>
          </TouchableOpacity>

        </View>

          <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
            style={styles.loginButton}
            >{
              isLoading ? (<ActivityIndicator color={"#fff"}></ActivityIndicator>) : (<Text style={styles.loginText}>Login</Text>)
            }
          </TouchableOpacity>


          <View style={styles.signUp}>
            <Text style={{}}>Dont have an account ?</Text>
            <TouchableOpacity><Text style={styles.signUpText} onPress={()=>router.push('signup')}> Sign Up</Text></TouchableOpacity>
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
  topImage:{
    width:"100%",
    height:"40%",

  },
  borderView:{
    borderWidth:0.5,
    padding:20,
    paddingTop:30,
    paddingBottom:100,
    borderRadius:15,
    marginLeft:10,
    marginRight:10,
    borderColor:"gray"
  },
  text:{
    textAlign:"center",
    fontSize:30,
    color:"brown",
    fontWeight:"bold"
  },
  email:{
    flexDirection:"row",
    alignItems:"center",
    borderRadius:10,
    borderWidth:0.4,
    paddingLeft:10,
    marginLeft:20,
    marginRight:20,
    marginTop:20,
    width:300,

  },
  loginButton:{
    backgroundColor:"#C4A484",
    marginTop:20,
    padding:9,
    marginLeft:13,
    marginRight:13,
    borderRadius:20,
    borderWidth:0.4
  },
  loginText:{
    textAlign:"center",
    fontSize:20,
    fontWeight:"bold",
    color:"#ffffff"
  },
  signUp:{
    flexDirection:"row",
    paddingLeft:60,
    marginTop:10,
  },
  signUpText:{
    color:"#C4A484",
    fontWeight:"bold"
  }

})