// ParcelScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../styles/ParcelScreenStyles';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Footer from '../components/Footer';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator();

// Reusable Parcel Card component
const ParcelCard = ({ parcelId, customerName, trackingNo, address }) => (
  <View style={styles.parcelCard}>
    <View style={styles.parcelRow}>
      <Text style={styles.parcelInfoTitle}>Parcel ID:</Text>
      <Text style={styles.parcelInfo}>{parcelId}</Text>
    </View>
    <View style={styles.parcelRow}>
      <Text style={styles.parcelInfoTitle}>Customer Name:</Text>
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
  </View>
);

const PickupTab = () => (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <ParcelCard
      parcelId="PARCEL001"
      customerName="John Doe"
      trackingNo="TRK001"
      address="123 Main Street"
      isPickup={true}
    />
    <ParcelCard
      parcelId="67890"
      customerName="Jane Smith"
      trackingNo="TRK002"
      address="456 Elm Avenue"
      isPickup={true}
    />
  </ScrollView>
);

const DeliverTab = () => (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <ParcelCard
      parcelId="PARCEL001"
      customerName="John Doe"
      trackingNo="TRK001"
      address="123 Main Street"
      isPickup={false}
    />
    <ParcelCard
      parcelId="67890"
      customerName="Jane Smith"
      trackingNo="TRK002"
      address="456 Elm Avenue"
      isPickup={false}
    />
  </ScrollView>
);

const PendingTab = () => (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <ParcelCard
      parcelId="12345"
      customerName="John Doe"
      trackingNo="TRK001"
      address="123 Main Street"
      isPickup={false}
    />
    <ParcelCard
      parcelId="67890"
      customerName="Jane Smith"
      trackingNo="TRK002"
      address="456 Elm Avenue"
      isPickup={false}
    />
  </ScrollView>
);

const ParcelScreen = ({ route, navigation }) => {
  const [mode, setMode] = useState('pickup'); // State to track the selected mode
  const [headerTitle, setHeaderTitle] = useState(
    mode === 'pickup' ? 'Pickups' : 'Deliveries'
  );

  // Update header title when mode changes
  useEffect(() => {
    setHeaderTitle(mode === 'pickup' ? 'Pickups' : 'Deliveries');
  }, [mode]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.headerText,
            { color: mode === 'pickup' ? 'black' : 'black' },
          ]}
        >
          {headerTitle}
        </Text>

        {/* Dropdown Menu */}
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={mode}
            onValueChange={(itemValue) => setMode(itemValue)}
            style={styles.picker}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Pickups" value="pickup" />
            <Picker.Item label="Deliveries" value="deliver" />
          </Picker>
        </View>
      </View>

      {/* Scrollable Tab Navigator */}
      <Tab.Navigator
        initialRouteName={mode === 'pickup' ? 'Assigned' : 'Pending'}
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
          tabBarStyle: { backgroundColor: '#f8f8f8' },
          tabBarIndicatorStyle: { backgroundColor: '#1F818C', height: 3 },
        }}
      >
        {mode === 'pickup' ? (
          <>
            <Tab.Screen name="Assigned" component={PickupTab} />
            <Tab.Screen name="Picked Up" component={PickupTab} />
          </>
        ) : (
          <>
            <Tab.Screen name="Assigned" component={DeliverTab} />
            <Tab.Screen name="Delivered" component={DeliverTab} />
          </>
        )}
        <Tab.Screen name="Pending" component={PendingTab} />
      </Tab.Navigator>

      {/* Footer (Fixed at the Bottom) */}
      <Footer navigation={navigation} />
    </View>
  );
};

export default ParcelScreen;
