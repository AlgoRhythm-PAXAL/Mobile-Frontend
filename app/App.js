import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DriverProvider } from './context/DriverContext';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { StatusBar } from 'expo-status-bar';
import ProfileScreen from './screens/ProfileScreen';
import ParcelScreen from './screens/ParcelScreen';
import MapScreen from './screens/MapScreen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity,KeyboardAvoidingView,Platform,View } from 'react-native';
import { Footer } from './components/Footer';




const Stack = createStackNavigator();

const App = () => {
  return (
    <DriverProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Parcel"
            component={ParcelScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={({ navigation }) => ({
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ marginLeft: 10 }}
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
              ),
              title: 'Map Navigation',
              headerTitleAlign: 'center',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DriverProvider>
    
  );
};

export default App;
