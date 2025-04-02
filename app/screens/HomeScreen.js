//HomeScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from '../styles/HomeScreenStyles';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Footer from '../components/Footer';
import axios from 'axios';
import API_BASE_URL from '../../config';
import * as Location from 'expo-location';
import { DriverContext } from '../context/DriverContext';

const Tab = createMaterialTopTabNavigator();

// Reusable Status Card component
const StatusCard = ({ title, count }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardCount}>{count}</Text>
  </View>
);

// Reusable Parcel Card component with status update functionality
const ParcelCard = ({ parcelId, customerName, trackingNo, address, isPickup, navigation, refreshCounts }) => {
  const { driverDetails } = useContext(DriverContext);

  const handleStatusUpdate = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/mobile/updateParcelstatus/`,  {
        parcelId,
        status: isPickup ? 'Picked Up' : 'Delivered'
      });
      console.log('Parcel status updated:', response.data);

      // Show success alert
      Alert.alert(
        "Success", 
        `Parcel is "${isPickup ? 'Picked Up' : 'Delivered'}" successfully!`,
        [{ text: "OK" }]
      );

      // Refresh parcel counts
      refreshCounts();
    } catch (error) {
      console.error('Error updating parcel status:', error.response?.data || error.message);
    }
  };

  const handleViewOnMap = async () => {
    try {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to access the map.');
        return;
      }

      // Get the driver's current location
      let location = await Location.getCurrentPositionAsync({});
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Navigate to the MapScreen with the address and coordinates
      navigation.navigate('Map', {
        address,
        currentLocation,
      });
    } catch (error) {
      console.warn('Error getting location:', error);
      Alert.alert('Error', 'Unable to get current location. Make sure that location services are enabled.');
    }
  };

  return (
    <View style={styles.parcelCard}>
      {/* Parcel Information */}
      <View style={styles.parcelRow}>
        <Text style={styles.parcelInfoTitle}>Parcel ID:</Text>
        <Text style={styles.parcelInfo}>{parcelId}</Text>
      </View>
      <View style={styles.parcelRow}>
        <Text style={styles.parcelInfoTitle}>Reeceiver Name:</Text>
        <Text style={styles.parcelInfo}>{customerName}</Text>
      </View>
      <View style={styles.parcelRow}>
        <Text style={styles.parcelInfoTitle}>Tracking No:</Text>
        <Text style={styles.parcelInfo}>{trackingNo}</Text>
      </View>
      <View style={styles.parcelRow}>
        <Text style={styles.parcelInfoTitle}>Address:</Text>
        <Text style={styles.parcelInfo}>{address}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={handleViewOnMap} 
        >
          <Text style={styles.mapButtonText}>View on Map</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deliveredButton} 
          onPress={handleStatusUpdate} 
        >
          <Text style={styles.buttonText}>{isPickup ? 'Picked Up' : 'Delivered'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PickupTab = ({ refreshCounts, navigation }) => (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <StatusCard title="Parcels Assigned" count={5} />
    <StatusCard title="Picked Up" count={3} />
    <StatusCard title="Pending" count={2} />

    <PendingParcelsPickupText />

    <ParcelCard 
      parcelId="PARCEL001" 
      customerName="John Doe" 
      trackingNo="TRK001" 
      address="University of Moratuwa, Srilanka" 
      isPickup={true} 
      refreshCounts={refreshCounts} 
      navigation={navigation} 
      mode="pickup" 
    />
    <ParcelCard 
      parcelId="67890" 
      customerName="Jane Smith" 
      trackingNo="TRK002" 
      address="katubedda" 
      isPickup={true} 
      refreshCounts={refreshCounts} 
      navigation={navigation} 
      mode="pickup" 
    />
  </ScrollView>
);

const DeliverTab = ({ refreshCounts, navigation }) => (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <StatusCard title="Parcels Assigned" count={6} />
    <StatusCard title="Delivered" count={1} />
    <StatusCard title="Pending" count={5} />

    <PendingParcelsText />

    <ParcelCard 
      parcelId="PARCEL001" 
      customerName="John Doe" 
      trackingNo="TRK001" 
      address="moratuwa" 
      isPickup={false} 
      refreshCounts={refreshCounts} 
      navigation={navigation} 
      mode="deliver" 
    />
    <ParcelCard 
      parcelId="67890" 
      customerName="Jane Smith" 
      trackingNo="TRK002" 
      address="mt lavinia" 
      isPickup={false} 
      refreshCounts={refreshCounts} 
      navigation={navigation} 
      mode="deliver" 
    />
  </ScrollView>
);

const HomeScreen = ({ navigation, route }) => {
  const { driverDetails } = route.params || {};
  const [headerTitle, setHeaderTitle] = useState('Deliveries');

  const [assignedCount, setAssignedCount] = useState(0);
  const [pickedUpCount, setPickedUpCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch parcel counts
  const fetchParcelCounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/mobile/parcel-counts/`);
      setAssignedCount(response.data.assignedCount);
      setPickedUpCount(response.data.pickedUpCount);
      setPendingCount(response.data.pendingCount);
    } catch (error) {
      console.error('Parcel Count Error:', error);
    }
  };

  useEffect(() => {
    fetchParcelCounts();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{headerTitle}</Text>
      </View>

      {/* Scrollable Tab Navigator */}
      <Tab.Navigator
        initialRouteName="Pickup"
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold', fontFamily: 'Poppins_700Bold' },
          tabBarStyle: { backgroundColor: '#f8f8f8' },
          tabBarItemStyle: { backgroundColor: 'transparent' },
          tabBarPressColor: '#1F818C',
          tabBarIndicatorStyle: { backgroundColor: '#1F818C', height: 3 },
        }}
      >
        <Tab.Screen
          name="Pickup"
          children={() => <PickupTab refreshCounts={fetchParcelCounts} navigation={navigation} />}
          listeners={{
            focus: () => setHeaderTitle('Pickups'),
          }}
        />
        <Tab.Screen
          name="Deliver"
          children={() => <DeliverTab refreshCounts={fetchParcelCounts} navigation={navigation} />}
          listeners={{
            focus: () => setHeaderTitle('Deliveries'),
          }}
        />
      </Tab.Navigator>

      {/* Footer */}
      <Footer navigation={navigation} driverDetails={driverDetails} />
    </View>
  );
};

// Pending Parcels Headers
const PendingParcelsText = () => (
  <View style={styles.pendingParcelsContainer}>
    <Text style={styles.pendingParcelsText}>Pending Parcels to Deliver</Text>
  </View>
);

const PendingParcelsPickupText = () => (
  <View style={styles.pendingParcelsContainer}>
    <Text style={styles.pendingParcelsText}>Pending Parcels to Pick Up</Text>
  </View>
);

export default HomeScreen;