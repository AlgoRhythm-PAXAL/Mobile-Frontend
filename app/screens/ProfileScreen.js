
// ProfileScreen.js
import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // State initialization
  const [driverName, setDriverName] = useState(driverDetails?.name || '');
  const [driverEmail, setDriverEmail] = useState(driverDetails?.email || '');
  const [contactNumbers, setContactNumbers] = useState(
    driverDetails?.contactNo || []
  );
  const [vehicleNumber, setVehicleNumber] = useState(
    driverDetails?.licenseId || ''
  );
  const [profilePicture, setProfilePicture] = useState(
    driverDetails?.profilePicture || null
  );

  // Enhanced data fetching with proper cache handling
  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          setLoading(true);

          // First, check for cached profile picture
          const cachedPic = await AsyncStorage.getItem('profilePictureCache');
          
          const token = await AsyncStorage.getItem('token');
          const email =
            driverDetails?.email || (await AsyncStorage.getItem('driverEmail'));

          if (!email) {
            console.warn('No email available for profile fetch');
            setLoading(false);
            return;
          }

          // Only fetch from backend if we don't have unsaved changes
          if (!hasUnsavedChanges) {
            const response = await axios.get(
              `${API_BASE_URL}/api/mobile/driver/email/${email}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const details = response.data;
            console.log('Fetched profile data:', details);

            setDriverDetails(details);
            setDriverName(details.name || '');
            setDriverEmail(details.email || '');
            setContactNumbers(details.contactNo || []);
            setVehicleNumber(details.licenseId || '');

            // Use cached picture if available, otherwise use backend data
            if (cachedPic) {
              setProfilePicture(cachedPic);
              console.log('Using cached profile picture');
            } else if (details.profilePicture) {
              setProfilePicture(details.profilePicture);
              await AsyncStorage.setItem('profilePictureCache', details.profilePicture);
            }
          } else {
            // If we have unsaved changes, just use cached data
            if (cachedPic) {
              setProfilePicture(cachedPic);
              console.log('Using cached profile picture (unsaved changes)');
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          Alert.alert('Error', 'Failed to load profile data');
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }, [driverDetails?.email, setDriverDetails, hasUnsavedChanges])
  );

  // Request permissions for Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission Denied',
          'You need to allow storage access to upload an image.'
        );
      }
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  // Enhanced image upload handler
  const handleImageUpload = async () => {
    console.log('Image upload triggered');

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'You need to allow storage access to upload an image.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const imageUri = result.assets[0].uri;

        // Check file size
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        if (fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert('Error', 'Image size should be less than 5MB');
          return;
        }

        const base64data = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const fullBase64 = `data:image/jpeg;base64,${base64data}`;

        // Update all states and cache immediately
        setProfilePicture(fullBase64);
        setDriverDetails((prev) => ({
          ...prev,
          profilePicture: fullBase64,
        }));
        await AsyncStorage.setItem('profilePictureCache', fullBase64);
        setHasUnsavedChanges(true); // Mark as having unsaved changes

        console.log('New profile picture set and cached');
      }
    } catch (error) {
      console.error('Error handling image upload:', error);
      Alert.alert('Error', 'Failed to process the selected image');
    }
  };

  // Enhanced save functionality
  const handleSaveChanges = async () => {
    try {
      if (!profilePicture) {
        Alert.alert('Error', 'Please select a profile picture before saving.');
        return;
      }

      setSaving(true);
      const token = await AsyncStorage.getItem('token');

      const response = await axios.put(
        `${API_BASE_URL}/api/mobile/drivers/${driverDetails.email}/profilepicture`,
        { profilePicture: profilePicture },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Backend response:', response.data);

      if (response.data) {
        // Clear the unsaved changes flag
        setHasUnsavedChanges(false);
        
        // Update all storage locations
        await AsyncStorage.setItem('profilePictureCache', profilePicture);
        await AsyncStorage.setItem('profilePicture', profilePicture);

        // Update context with the saved profile picture
        setDriverDetails((prev) => ({
          ...prev,
          profilePicture: profilePicture,
        }));

        Alert.alert('Success', 'Profile picture updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update profile picture'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F818C" />
      </View>
    );
  }

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
              source={
                profilePicture
                  ? { uri: profilePicture }
                  : require('../../assets/driver1.jpeg')
              }
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
            <MaterialIcons
              name="person"
              size={20}
              color="#1F818C"
              style={styles.detailIcon}
            />
            <View>
              <Text style={styles.detailLabel}>Full Name</Text>
              <Text style={styles.detailValue}>{driverName}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons
              name="email"
              size={20}
              color="#1F818C"
              style={styles.detailIcon}
            />
            <View>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{driverEmail}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons
              name="phone"
              size={20}
              color="#1F818C"
              style={styles.detailIcon}
            />
            <View>
              <Text style={styles.detailLabel}>Contact Numbers</Text>
              <Text style={styles.detailValue}>
                {Array.isArray(contactNumbers)
                  ? contactNumbers.join(', ')
                  : contactNumbers}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons
              name="directions-car"
              size={20}
              color="#1F818C"
              style={styles.detailIcon}
            />
            <View>
              <Text style={styles.detailLabel}>Vehicle Number</Text>
              <Text style={styles.detailValue}>{vehicleNumber}</Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            hasUnsavedChanges && styles.saveButtonHighlight // Optional: highlight when changes exist
          ]}
          onPress={handleSaveChanges}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>
              {hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Footer navigation={navigation} driverDetails={driverDetails} />
    </View>
  );
};

export default ProfileScreen;