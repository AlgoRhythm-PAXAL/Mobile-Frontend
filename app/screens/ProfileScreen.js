//ProfileScreen.js
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, PermissionsAndroid, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import Footer from '../components/Footer';
import styles from '../styles/ProfileStyles';
import API_BASE_URL from '../../config';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { DriverContext } from '../context/DriverContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation, route }) => {
  const { driverDetails, setDriverDetails } = useContext(DriverContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State initialization with null checks
  const [driverName, setDriverName] = useState(driverDetails?.name || '');
  const [driverEmail, setDriverEmail] = useState(driverDetails?.email || '');
  const [contactNumbers, setContactNumbers] = useState(driverDetails?.contactNo || []);
  const [vehicleNumber, setVehicleNumber] = useState(driverDetails?.licenseId || '');
  const [profilePicture, setProfilePicture] = useState(driverDetails?.profilePicture || null);

  // Enhanced data fetching with loading state
  useFocusEffect(
  useCallback(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        
        // First get the email either from driverDetails or AsyncStorage
        const email = driverDetails?.email || await AsyncStorage.getItem('driverEmail');
        
        if (!email) {
          console.warn("No email available for profile fetch");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/mobile/driver/email/${email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const details = response.data;
        setDriverDetails(details);
        setDriverName(details.name || '');
        setDriverEmail(details.email || '');
        setContactNumbers(details.contactNo || []);
        setVehicleNumber(details.licenseId || '');
        setProfilePicture(details.profilePicture || null);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [driverDetails?.email, setDriverDetails]) // Use optional chaining here
);
  
  
    // Request permissions for Android
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        console.log('Permission granted:', granted === PermissionsAndroid.RESULTS.GRANTED); // Debugging line
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'You need to allow storage access to upload an image.');
        }
      }
    };
  
    useEffect(() => {
      requestPermissions();
    }, []);
  

  // Enhanced image upload with better feedback
  const handleImageUpload = async () => {
    console.log('Image upload triggered');
  
    // Request permissions first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('Media library permission status:', status);
  
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'You need to allow storage access to upload an image.'
      );
      return;
    }
  
    console.log('Launching image library...');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images, // Updated this line
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      console.log('Image picker result:', result);
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log('Selected image URI:', imageUri);
  
        // Read the file as a Base64 string
        try {
          const base64data = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const fullBase64 = `data:image/jpeg;base64,${base64data}`;
          setProfilePicture(fullBase64);
          setDriverDetails((prevDetails) => ({
            ...prevDetails,
            profilePicture: fullBase64,
          }));
          console.log('Image converted to base64');
        } catch (error) {
          console.error('Error reading file as Base64:', error);
          Alert.alert('Error', 'Failed to process the selected image');
        }
      }
    } catch (error) {
      console.error('Error launching image library:', error);
      Alert.alert('Error', 'Failed to open image library');
    }
  };

  // Enhanced save functionality with visual feedback
  const handleSaveChanges = async () => {
    try {
        if (!profilePicture) {
            Alert.alert('Error', 'Please select a profile picture before saving.');
            return;
        }
        const token = await AsyncStorage.getItem('token');
        const response = await axios.put(
            `${API_BASE_URL}/api/mobile/drivers/${driverDetails.email}/profilepicture`,
            { profilePicture } ,{
                headers: {
                    Authorization: `Bearer ${token}`,

                },
            }
        );

        console.log("Backend Response:", response.data);

        if (response.data) {
            Alert.alert("Success", "Profile picture updated successfully");
            setDriverDetails(response.data); 
        }
    } catch (error) {
        console.error("Error updating profile picture:", error);
        Alert.alert("Error", error.response?.data?.message || "Failed to update profile picture");
    }
};

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#1F818C" />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={handleImageUpload}
          >
            <Image
              source={profilePicture ? { uri: profilePicture } : require('../../assets/driver1.jpeg')}
              style={styles.avatar}
            />
            <View style={styles.cameraIcon}>
              <MaterialIcons name="photo-camera" size={20} color="white" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{driverName}</Text>
            <Text style={styles.userEmail}>{driverEmail}</Text>
            <Text style={styles.userRole}>Delivery Driver</Text>
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <MaterialIcons name="person" size={20} color="#1F818C" style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Full Name</Text>
              <Text style={styles.detailValue}>{driverName}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons name="email" size={20} color="#1F818C" style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{driverEmail}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons name="phone" size={20} color="#1F818C" style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Contact Numbers</Text>
              <Text style={styles.detailValue}>
                {Array.isArray(contactNumbers) ? contactNumbers.join(', ') : contactNumbers}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons name="directions-car" size={20} color="#1F818C" style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Vehicle Number</Text>
              <Text style={styles.detailValue}>{vehicleNumber}</Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveChanges}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Footer navigation={navigation} driverDetails={driverDetails} />
    </View>
  );
};

export default ProfileScreen;