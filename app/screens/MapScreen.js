
// MapScreen.js
import React, { useEffect, useState } from 'react';
import { View, Alert, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import styles from '../styles/MapScreenStyles';

const MapScreen = ({ route }) => {
  const { address } = route.params || {};

  // Default location (Sri Lanka)
  const defaultLocation = {
    latitude: 6.7745227,
    longitude: 79.882978,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    requestLocationPermission();
    if (address) {
      geocodeAddress(address);
    }
  }, [address]);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }
      getCurrentLocation();
      startLocationTracking();
    } catch (err) {
      console.warn('Error requesting location permission:', err);
      Alert.alert('Error', 'Unable to request location permission.');
    }
  };

  const getCurrentLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setCurrentLocation(userLocation);
      setRouteCoordinates([userLocation]);

      // Log the source location (initial current location)
      console.log('Source Location:', {
        
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
    } catch (error) {
      console.warn('Error getting location:', error);
      Alert.alert('Error', 'Ensure location services are enabled.');
    }
  };

  const startLocationTracking = async () => {
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Update every 10 meters
      },
      (location) => {
        const newLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setCurrentLocation(newLocation);
        updateRoute(newLocation);

        // Log the driver's location at each 10 meters
        console.log('Driver Location (every 10m):', {
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
        });
      }
    );
  };

  const geocodeAddress = async (address) => {
    try {
        console.log("Geocoding Address:", address);

        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
            {
                headers: {
                    "User-Agent": "mobile_app"
                }
            }
        );

        console.log("Geocoding Response:", response.data);

        if (response.data.length > 0) {
            const location = response.data[0];
            const destinationLocation = {
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            setDestination(destinationLocation);

            console.log("Destination Location:", destinationLocation);
        } else {
            Alert.alert("Error", "Location not found.");
        }
    } catch (error) {
        console.error("Geocoding Error:", error.message);
        Alert.alert("Error", "Failed to fetch geocode data. Check internet & API availability.");
    }
};


  const fetchRoute = async (origin, destination) => {
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`
      );
      const coordinates = response.data.routes[0].geometry.coordinates.map((coord) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));
      setRouteCoordinates(coordinates);
    } catch (error) {
      console.error('Error fetching route:', error);
      Alert.alert('Error', 'Failed to fetch route data.');
    }
  };

  const updateRoute = async (newLocation) => {
    if (destination) {
      await fetchRoute(newLocation, destination);
    }
  };

  useEffect(() => {
    if (currentLocation && destination) {
      fetchRoute(currentLocation, destination);
    }
  }, [currentLocation, destination]);

  return (
    <View style={styles.container}>
      {currentLocation ? (
        <MapView
          style={styles.map}
          initialRegion={currentLocation || defaultLocation}
          showsUserLocation={true}
        >
          {currentLocation && <Marker coordinate={currentLocation} title="Your Location" pinColor="blue" />}
          {destination && <Marker coordinate={destination} title="Destination" pinColor="red" />}

          {routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={3}
              strokeColor="hotpink"
            />
          )}
        </MapView>
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading Map...</Text>
      )}
    </View>
  );
};

export default MapScreen;