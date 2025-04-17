
//LoginScreen.js
import React, { useState,useContext } from 'react';
import { 
  View, Text, TextInput, Pressable, Alert, Image, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../styles/LoginScreenStyles';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from '../../config';
import { DriverContext } from '../context/DriverContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  //const [driverDetails, setDriverDetails] = useState(null);
  const { setDriverDetails } = useContext(DriverContext);

  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  
const handleLogin = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/mobile/driver/login`, {
      email: email.trim(),
      password: password.trim(),
    });

    if (response.data.success) {
      const { token, driver } = response.data;

      // Save token to AsyncStorage
      await AsyncStorage.setItem('token', token);
      console.log("Token saved:");
      //console.log("Token saved:", token)
      
      // Save driver details in context
      setDriverDetails(driver);
      console.log("Login successful");

      // Navigate to home screen
      navigation.navigate('Home', { driverDetails: driver });
      
    } else {
      Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
    }
  } catch (error) {
    console.error("Login Error:", error);
    Alert.alert('Login Error', 'Something went wrong. Please try again.');
  }
};

const checkToken = async () => {
  const token = await AsyncStorage.getItem('token');
  console.log('Stored Token:', token);
};

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeIn" duration={1500} style={styles.header}>
        <Image 
          source={require('../../assets/paxallogo.png')} 
          style={styles.logoImage} 
        />
      </Animatable.View>

      {/* Lottie Animation (Remains Fixed) */}
      <View style={styles.lorryContainer}>
        <LottieView 
          source={require('../../assets/lorry-animation.json')} 
          autoPlay 
          loop 
          style={styles.lorryAnimation}
        />
      </View>

      {/* Keyboard-Aware Form */}
      <KeyboardAwareScrollView 
        contentContainerStyle={styles.formContainer}
        extraScrollHeight={50} // Moves up slightly when keyboard appears
        enableOnAndroid={true} 
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.welcomeContainer}>
            {/* Welcome Text */}
            <Text style={[styles.welcomeText, { fontFamily: 'Poppins_700Bold' }]}>Welcome!</Text>
            <View style={styles.form}>
              <TextInput
                style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={[styles.buttonText, { fontFamily: 'Poppins_400Regular' }]}>Login</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LoginScreen;