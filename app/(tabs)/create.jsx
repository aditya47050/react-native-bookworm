import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, Alert, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { useAuthStore } from '../../store/authStore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '../../constants/api'



export default function create() {
  const [title,setTitle] = useState("")
  const [caption,setCaption] = useState("")
  const [rating,setRating] = useState(3)
  const [image,setImage] = useState(null)
  const [imageBase64,setImageBase64] = useState(null)
  const [loading,setLoading] = useState(false)

  const {token} = useAuthStore();
  console.log("token is :",token)

  const router = useRouter()

  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission denied", "We need camera roll permission to upload an image");
          return;
        }
  
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,  // Updated here
          allowsEditing: true,
          // aspect: [4, 3],  
          quality: 0.5,     
          base64: true,
        });
  
        if (!result.canceled) {
          const uri = result.assets[0].uri;
          setImage(uri);
  
          // Check image size
          const fileInfo = await FileSystem.getInfoAsync(uri);
          if (fileInfo.size > 2097152) { // 2MB limit
            Alert.alert("Image too large", "Please select an image smaller than 2MB");
            return;
          }
  
          if (result.assets[0].base64) {
            setImageBase64(result.assets[0].base64);
          }else{
            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri,{
              encoding:FileSystem.EncodingType.Base64,
            });
            setImageBase64(base64)
          }
        }
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while picking the image.");
      console.error(error);
    }
  };
  
  
  const handleSubmit = async () => {
    // 1. Check required fields
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    } 

    try {
      setLoading(true)
      const uriParts = image.split(".")
      const fileType = uriParts [uriParts.length - 1]
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      const response = await fetch(`${API_URL}/books`,{
        method:"POST",
        headers:{
          Authorization : `Bearer ${token}`,
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          title,
          caption,
          rating: rating.toString(),
          image: imageDataUrl,
        })
      })

      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success","Your book recomendation has been posted");
      setTitle("");
      setCaption("");
      setRating(3);
      setImage(null);
      setImageBase64(null);
      router.push('/')

    } catch (error) {
      console.error("Error creating post",error)
      Alert.alert("Error",error.message || "Something went wrong")
    }
    finally{
      setLoading(false)
    }
  
  }



  const renderRatingPicker = ()  =>{
    const stars = []
    for(let i=1;i<=5;i++){
      stars.push(
        <TouchableOpacity key={i} onPress={()=>setRating(i)}>
          <Ionicons name={i<=rating ? "star" : "star-outline"} size={32} color={i<=rating ? "gold" : "green"}/>
        </TouchableOpacity>
      )
    }
    return<View style={styles.ratingContainer}>{stars}</View>;
  }


  return (
    <View style={styles.container}>
      <View style={styles.secondContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headingText}>Add Book Recommendation</Text>
        <Text style={styles.caption}>Share your favoirate reads with others</Text>
    {/* Title */}
        <View style={styles.titleBox}>
          <Text style={styles.label}>Book Title</Text>
          <View style={styles.input}>
              <Ionicons name='book-outline' size={24} />
              <TextInput placeholder='Enter Book title' style={{width:300}} value={title} onChangeText={setTitle}/>
          </View>
        </View>
    {/* {Rating} */}
        <View>
            <Text  style={styles.label}>Your Rating</Text>
            <View style={{borderWidth:0.2,paddingLeft:10,paddingRight:5,borderRadius:10,backgroundColor:"white"}}>
            <View style={styles.ratingContainer}>
            {renderRatingPicker()}
            </View>
            </View>
        </View>

        {/* IMAGE */}
  <View style={styles.formGroup}>
  <Text style={styles.label}>Book Image</Text>
  <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
    {image ? (
      <Image source={{ uri: image }} style={styles.previewImage} />
    ) : (
      <View style={styles.placeholderContainer}>
        <Ionicons name="image-outline" size={40} color="green" />
        <Text style={styles.placeholderText}>Tap to select image</Text>
      </View>
    )}
  </TouchableOpacity>
  </View>

  <View>
    <Text style={styles.label}>Caption</Text>
    <TextInput placeholder='Enter a review about a book or thoughts related to this book ...' multiline style={styles.captionInput} value={caption} onChangeText={setCaption}></TextInput> 
  </View>

  {loading ? (
  <ActivityIndicator size="large" color="green" style={{ marginTop: 30, marginBottom: 30 }} />
) : (
  <TouchableOpacity style={styles.shareBtn} onPress={handleSubmit}>
    <Text style={styles.shareText}>Share</Text>
  </TouchableOpacity>
)}


        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center"
  },
  secondContainer:{
    height:700,
    borderWidth:0.2,
    alignItems:"center",
    marginLeft:20,
    marginRight:20,
    borderRadius:15,
    justifyContent:"center"
  },
  headingText:{
    fontSize:24,
    color:"green",
    fontWeight:"bold",
    marginTop:20
  },
  caption:{
    fontSize:14,
    color:"green",
    marginTop:7,
    fontWeight:"semibold",
    textAlign:"center"
  },
  titleBox:{
    marginTop:30,
  },
  label:{
    marginLeft:5,
    fontWeight:"600",
    fontSize:16,
    color:"green",
    marginBottom:5,
    marginTop:30
  },
  input:{
    flexDirection:"row",
    borderWidth:0.2,
    alignItems:"center",
    width:300,
    gap:4,
    paddingLeft:10,
    borderRadius:10,
    backgroundColor:"white"
  },
  ratingContainer:{
    flexDirection:"row",
    width:280,
    height:70,
    alignItems:"center",
    justifyContent:"space-between",
  },
  previewImage: {
    width: 300,
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  
  placeholderText: {
    marginTop: 8,
  },
  captionInput:{
    borderWidth:0.2,
    height:100,
    width:300,
    verticalAlign:"top",
    borderRadius:10,
    backgroundColor:"white"
  },
  shareBtn:{
    backgroundColor:"green",
    width:300,
    height:40,
    marginTop:30,
    marginBottom:30,
    justifyContent:"center",
    borderRadius:10
  },
  shareText:{
    color:"white",
    fontSize:16,
    fontWeight:"bold",
    textAlign:"center"
  }
  
})