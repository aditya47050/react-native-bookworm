import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { useAuthStore } from '../store/authStore'
import { Ionicons } from '@expo/vector-icons'

export default function LogoutButton() {
    const {logout} = useAuthStore()

    const confirmLogut = () => {
        Alert.alert("Logout","Are you sure you want to logout ?",[
            {text:"Cancel",style:"cancel"},
            {text:"Logout",onPress:()=>logout(),style:"destructive"}
        ])
    }

  return (
    <View>
      <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogut}>
        <Ionicons name='log-out-outline' size={24} color={"white"} style={{marginTop:2}}/>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    logoutBtn:{
        backgroundColor:"#4CBB17",
        height:55,
        marginLeft:25,
        marginRight:25,
        borderRadius:10,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        gap:4
    },
    logoutText:{
        color:"white",
        fontSize:17,
        fontWeight:"bold"
    }
})