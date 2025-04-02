//ProfileScreen.js
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import Footer from '../components/Footer';
import styles from '../styles/ProfileStyles';
import API_BASE_URL from '../../config';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { DriverContext } from '../context/DriverContext';

const ProfileScreen = ({ navigation, route }) => {
  const { driverDetails, setDriverDetails } = useContext(DriverContext);

  console.log(driverDetails);  // Check if driverDetails is being passed correctly

  const [driverName, setDriverName] = useState(driverDetails.name);
  const [driverEmail, setDriverEmail] = useState(driverDetails.email);
  const [contactNumbers, setContactNumbers] = useState(driverDetails.contactNo);
  const [vehicleNumber, setVehicleNumber] = useState(driverDetails.licenseId);
  const [profilePicture, setProfilePicture] = useState(driverDetails.profilePicture);

  // Fetch driver details when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const details = route.params?.driverDetails;
      console.log('Received driverDetails:', details);

      if (details) {
        setDriverDetails(details);
        setDriverName(details.name || '');
        setDriverEmail(details.email || '');
        setContactNumbers(details.contactNo || []);
        setVehicleNumber(details.licenseId || '');
        setProfilePicture(details.profilePicture || null);
      }
    }, [route.params?.driverDetails])
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

  // Handle image upload
  const handleImageUpload = async () => {
    console.log('Image upload triggered'); 
  
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('Media library permission status:', status); 
  
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to allow storage access to upload an image.');
      return;
    }
  
    console.log('Launching image library...'); 
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      console.log('Image picker result:', result); 
  
      if (!result.canceled) {
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
          console.log('Image converted to base64:', fullBase64);
        } catch (error) {
          console.error('Error reading file as Base64:', error);
        }
      }
    } catch (error) {
      console.error('Error launching image library:', error); 
    }
  };
  


  const handleSaveChanges = async () => {
    try {
        if (!profilePicture) {
            Alert.alert('Error', 'Please select a profile picture before saving.');
            return;
        }

        const response = await axios.put(
            `${API_BASE_URL}/api/mobile/drivers/${driverDetails.email}/profilepicture`,
            { profilePicture } 
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

useFocusEffect(
  useCallback(() => {
    const fetchProfile = async () => {
      try {
        if (!driverDetails.email) {
          console.warn("No driver email available");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/mobile/driver/email/${driverDetails.email}`);
        console.log("Fetched Profile Data:", response.data);

        const details = response.data;
        setDriverDetails(details);
        setDriverName(details.name || '');
        setDriverEmail(details.email || '');
        setContactNumbers(details.contactNo || []);
        setVehicleNumber(details.licenseId || '');
        setProfilePicture(details.profilePicture || null);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [driverDetails.email])
);


  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleImageUpload}>
          <Image
            source={
              profilePicture
                ? { uri: profilePicture }
                : require('../../assets/driver1.jpeg')
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{driverName}</Text>
          <Text style={styles.userEmail}>{driverEmail}</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput style={styles.input} value={driverName} editable={false} />

        <Text style={styles.label}>Email:</Text>
        <TextInput  
          style={styles.input} 
          value={driverEmail} 
          editable={false} 
          keyboardType="email-address" 
        />

        <Text style={styles.label}>Contact Numbers:</Text>
        <TextInput
          style={styles.input}
          value={JSON.stringify(contactNumbers)}
          editable={false}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Vehicle Number:</Text>
        <TextInput
          style={styles.input}
          value={vehicleNumber}
          editable={false}
        />
      </View>

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      <Footer navigation={navigation} />
    </View>
  );
};

export default ProfileScreen;