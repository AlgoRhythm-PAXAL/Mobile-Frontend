import React, { useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigationState } from '@react-navigation/native';
import styles from '../styles/FooterStyles';
import { DriverContext } from '../context/DriverContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../../config';

const Footer = ({ navigation, driverDetails}) => {
  // Get the active screen using useNavigationState
  const activeRoute = useNavigationState(state => state?.routes[state?.index]?.name);
  const { setDriverDetails } = useContext(DriverContext);


  // Helper function to determine if a route is active
  const isActive = (routeName) => activeRoute === routeName ? styles.activeFooterButton : null;

  const handleLogout = async () => {
    try {
      // Retrieve the token (if needed for the logout API call)
      const token = await AsyncStorage.getItem('token');
  
      // Call the logout API (optional)
      await axios.post(`${API_BASE_URL}/api/mobile/driver/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDriverDetails(null);
     
      await AsyncStorage.removeItem('token');

      
      // Redirect to the Login page
      navigation.navigate('Login');
      console.log('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[styles.footerButton, isActive('Home')]} // Apply active style when Home is active
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={24} color="white" />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.footerButton, isActive('Parcel')]} // Apply active style when Parcel is active
        onPress={() => navigation.navigate('Parcel')}
      >
        <Ionicons name="cube" size={24} color="white" />
        <Text style={styles.footerText}>Parcel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.footerButton, isActive('Profile')]} // Apply active style when Profile is active
        onPress={() => navigation.navigate('Profile',{ driverDetails })}
      >
        <Ionicons name="person" size={24} color="white" />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>

     {/* Logout Button */}
     <TouchableOpacity style={styles.footerButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="white" />
        <Text style={styles.footerText}>Logout</Text>
      </TouchableOpacity>
     
    </View>
  );
};

export default Footer;