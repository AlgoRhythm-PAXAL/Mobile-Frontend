import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigationState } from '@react-navigation/native';
import styles from '../styles/FooterStyles';
import { DriverContext } from '../context/DriverContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../../config';

const Footer = ({ navigation, driverDetails }) => {
  const activeRoute = useNavigationState(
    (state) => state?.routes[state?.index]?.name
  );
  const { setDriverDetails } = useContext(DriverContext);

  // Helper functions for active state
  const isActive = (routeName) =>
    activeRoute === routeName ? styles.activeFooterButton : null;
  const isIconActive = (routeName) => ({
    color: activeRoute === routeName ? '#FFF' : 'rgba(255,255,255,0.7)',
    fontSize: 24,
  });
  const isTextActive = (routeName) => ({
    ...styles.footerText,
    fontWeight: activeRoute === routeName ? '600' : '400',
    color: activeRoute === routeName ? '#FFF' : 'rgba(255,255,255,0.7)',
  });

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/mobile/driver/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDriverDetails(null);
      await AsyncStorage.removeItem('token');
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
        style={[styles.footerButton, isActive('Home')]}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" style={isIconActive('Home')} />
        <Text style={isTextActive('Home')}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.footerButton, isActive('Parcel')]}
        onPress={() => navigation.navigate('Parcel')}
      >
        <Ionicons name="cube" style={isIconActive('Parcel')} />
        <Text style={isTextActive('Parcel')}>Parcel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.footerButton, isActive('Profile')]}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person" style={isIconActive('Profile')} />
        <Text style={isTextActive('Profile')}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerButton} onPress={handleLogout}>
        <Ionicons name="log-out" style={isIconActive('Logout')} />
        <Text style={styles.footerText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
