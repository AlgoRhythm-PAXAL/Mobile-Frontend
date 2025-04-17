
//HomeScreen.js
// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';
// import styles from '../styles/HomeScreenStyles';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import Footer from '../components/Footer';
// import axios from 'axios';
// import API_BASE_URL from '../../config';
// import * as Location from 'expo-location';
// import { DriverContext } from '../context/DriverContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const Tab = createMaterialTopTabNavigator();

// // Reusable Status Card component
// const StatusCard = ({ title, count }) => (
//   <View style={styles.card}>
//     <Text style={styles.cardTitle}>{title}</Text>
//     <Text style={styles.cardCount}>{count}</Text>
//   </View>
// );

// // Reusable Parcel Card component
// const ParcelCard = ({ 
//   parcelId, 
//   customerName, 
//   trackingNo, 
//   address, 
//   isPickup, 
//   navigation, 
//   refreshCounts,
//   paymentMethod = isPickup ? 'Online' : 'COD', // Pickups are always Online
//   amountToBePaid = 0
// }) => {
//   const { driverDetails } = useContext(DriverContext);
//   const [isPaid, setIsPaid] = useState(paymentMethod === 'Online');
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [paidAmount, setPaidAmount] = useState('');
//   const [isPressed, setIsPressed] = useState(false);

//   const handleStatusUpdate = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
      
//       // For COD deliveries that aren't paid yet
//       if (!isPickup && paymentMethod === 'COD' && !isPaid) {
//         setShowPaymentModal(true);
//         return;
//       }

//       const response = await axios.post(`${API_BASE_URL}/api/mobile/updateParcelstatus/`, {
//         parcelId,
//         status: isPickup ? 'Picked Up' : 'Delivered',
//         paymentMethod,
//         isPaid,
//         paidAmount: paymentMethod === 'COD' ? parseFloat(paidAmount) || amountToBePaid : 0
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log('Parcel status updated:', response.data);
//       Alert.alert(
//         "Success", 
//         `Parcel ${isPickup ? 'picked up' : 'delivered'} successfully${!isPickup && paymentMethod === 'COD' ? ' and payment collected' : ''}!`,
//         [{ text: "OK" }]
//       );
//       refreshCounts();
//     } catch (error) {
//       console.error('Error updating parcel status:', error);
//       Alert.alert("Error", "Failed to update parcel status");
//     }
//   };

//   const confirmPayment = () => {
//     if (!paidAmount || parseFloat(paidAmount) < amountToBePaid) {
//       Alert.alert("Invalid Amount", `Please enter at least LKR ${amountToBePaid}`);
//       return;
//     }
//     setIsPaid(true);
//     setShowPaymentModal(false);
//     Alert.alert(
//       "Payment Confirmed", 
//       `LKR ${paidAmount} collected successfully!`,
//       [{ text: "OK", onPress: handleStatusUpdate }]
//     );
//   };

//   const handleViewOnMap = async () => {
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location permission is required to access the map.');
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       navigation.navigate('Map', {
//         address,
//         currentLocation: {
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//         },
//       });
//     } catch (error) {
//       console.warn('Error getting location:', error);
//       Alert.alert('Error', 'Unable to get current location.');
//     }
//   };
  
//   return (
//     <View style={[
//       styles.parcelCard,
//       isPickup ? styles.pickupCard : styles.deliveryCard,
//       isPressed && styles.cardPressed
//     ]}
//     onTouchStart={() => setIsPressed(true)}
//     onTouchEnd={() => setIsPressed(false)}>
      
//       {/* Card Header */}
//       <View style={styles.cardHeader}>
//         <Text style={styles.parcelId}>{parcelId}</Text>
//         <View style={[
//           styles.statusBadge,
//           isPickup ? styles.pickupBadge : styles.deliveryBadge
//         ]}>
//           <Text style={styles.badgeText}>
//             {isPickup ? 'PICKUP' : 'DELIVERY'}
//           </Text>
//         </View>
//       </View>

//       {/* Customer Info */}
//       <View style={styles.infoSection}>
//         <View style={styles.infoRow}>
//           <MaterialIcons name="person" size={18} color="#555" />
//           <Text style={styles.infoText}>{customerName}</Text>
//         </View>
        
//         <View style={styles.infoRow}>
//           <MaterialIcons name="confirmation-number" size={18} color="#555" />
//           <Text style={styles.infoText}>{trackingNo}</Text>
//         </View>
        
//         <View style={styles.infoRow}>
//           <MaterialIcons name="location-on" size={18} color="#555" />
//           <Text style={styles.infoText}>{address}</Text>
//         </View>
//       </View>

//       {/* Payment Info */}
//       <View style={styles.paymentSection}>
//         <View style={styles.infoRow}>
//           <MaterialIcons 
//             name={paymentMethod === 'COD' ? 'attach-money' : 'credit-card'} 
//             size={18} 
//             color={paymentMethod === 'COD' ? '#E53935' : '#43A047'} 
//           />
//           <Text style={[
//             styles.paymentText,
//             paymentMethod === 'COD' ? styles.codText : styles.onlineText
//           ]}>
//             {paymentMethod === 'COD' ? 
//               `COD - LKR ${amountToBePaid} ${isPaid ? '(Paid)' : '(Pending)'}` : 
//               'Online (Paid)'}
//           </Text>
//         </View>
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actionButtons}>
//         <TouchableOpacity 
//           style={styles.mapButton}
//           onPress={handleViewOnMap}
//           activeOpacity={0.8}
//         >
//           <MaterialIcons name="map" size={16} color="white" />
//           <Text style={styles.mapButtonText}> Map</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[
//             styles.actionButton,
//             !isPickup && paymentMethod === 'COD' && !isPaid && styles.codButton,
//             isPickup ? styles.pickupButton : styles.deliverButton
//           ]}
//           onPress={handleStatusUpdate}
//           activeOpacity={0.8}
//         >
//           <MaterialIcons 
//             name={isPickup ? 'local-shipping' : 'check-circle'} 
//             size={16} 
//             color="white" 
//           />
//           <Text style={styles.actionButtonText}>
//             {isPickup ? ' Picked Up' : 
//               (paymentMethod === 'COD' ? 
//                 (isPaid ? ' Delivered' : ' Collect COD') : 
//                 ' Delivered')}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Payment Modal for COD */}
//       {showPaymentModal && (
//         <View style={styles.paymentModal}>
//           <View style={styles.paymentModalContent}>
//             <Text style={styles.modalTitle}>Collect COD Payment</Text>
//             <Text style={styles.modalText}>Amount Due: LKR {amountToBePaid}</Text>
            
//             <TextInput
//               style={styles.paymentInput}
//               placeholder={`Enter collected amount (min LKR ${amountToBePaid})`}
//               keyboardType="numeric"
//               value={paidAmount}
//               onChangeText={setPaidAmount}
//             />
            
//             <View style={styles.modalButtonContainer}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setShowPaymentModal(false)}
//               >
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.confirmButton}
//                 onPress={confirmPayment}
//               >
//                 <Text style={styles.buttonText}>Confirm</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// const PickupTab = ({ refreshCounts, navigation }) => (
//   <ScrollView contentContainerStyle={styles.scrollContainer}>
//     <StatusCard title="Parcels Assigned" count={5} />
//     <StatusCard title="Picked Up" count={3} />
//     <StatusCard title="Pending" count={2} />

//     <PendingParcelsPickupText />

//     <ParcelCard 
//       parcelId="PARCEL001" 
//       customerName="John Doe" 
//       trackingNo="TRK001" 
//       address="University of Moratuwa, Srilanka" 
//       isPickup={true} 
//       refreshCounts={refreshCounts} 
//       navigation={navigation}
//       paymentMethod="Online"
//     />
//     <ParcelCard 
//       parcelId="PARCEL002" 
//       customerName="Kasun" 
//       trackingNo="TRK003" 
//       address="Piliyandala" 
//       isPickup={true} 
//       refreshCounts={refreshCounts} 
//       navigation={navigation}
//       paymentMethod="Online"
//     />
//     <ParcelCard 
//       parcelId="PARCEL003" 
//       customerName="Jane Smith" 
//       trackingNo="TRK002" 
//       address="Katubedda" 
//       isPickup={true} 
//       refreshCounts={refreshCounts} 
//       navigation={navigation}
//       paymentMethod="Online"
//     />
//   </ScrollView>
// );

// const DeliverTab = ({ refreshCounts, navigation }) => (
//   <ScrollView contentContainerStyle={styles.scrollContainer}>
//     <StatusCard title="Parcels Assigned" count={6} />
//     <StatusCard title="Delivered" count={1} />
//     <StatusCard title="Pending" count={5} />

//     <PendingParcelsText />

//     <ParcelCard 
//       parcelId="PARCEL001" 
//       customerName="John Doe" 
//       trackingNo="TRK001" 
//       address="Moratuwa" 
//       isPickup={false} 
//       refreshCounts={refreshCounts} 
//       navigation={navigation}
//       paymentMethod="COD"
//       amountToBePaid="1500"
//     />
//     <ParcelCard 
//       parcelId="PARCEL002" 
//       customerName="Sarah Johnson" 
//       trackingNo="TRK004" 
//       address="Colombo" 
//       isPickup={false} 
//       refreshCounts={refreshCounts} 
//       navigation={navigation}
//       paymentMethod="Online"
//     />
//     <ParcelCard 
//       parcelId="PARCEL003" 
//       customerName="Jane Smith" 
//       trackingNo="TRK002" 
//       address="Mt Lavinia" 
//       isPickup={false} 
//       refreshCounts={refreshCounts} 
//       navigation={navigation}
//       paymentMethod="COD"
//       amountToBePaid="2000"
//     />
//   </ScrollView>
// );

// const HomeScreen = ({ navigation, route }) => {
//   const { driverDetails } = route.params || {};
//   const [headerTitle, setHeaderTitle] = useState('Deliveries');
//   const [assignedCount, setAssignedCount] = useState(0);
//   const [pickedUpCount, setPickedUpCount] = useState(0);
//   const [pendingCount, setPendingCount] = useState(0);

//   const fetchParcelCounts = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const response = await axios.get(`${API_BASE_URL}/api/mobile/parcel-counts/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setAssignedCount(response.data.assignedCount);
//       setPickedUpCount(response.data.pickedUpCount);
//       setPendingCount(response.data.pendingCount);
//     } catch (error) {
//       console.error('Parcel Count Error:', error);
//     }
//   };

//   useEffect(() => {
//     fetchParcelCounts();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>{headerTitle}</Text>
//       </View>

//       {/* Scrollable Tab Navigator */}
//       <Tab.Navigator
//         initialRouteName="Pickup"
//         screenOptions={{
//           tabBarActiveTintColor: 'black',
//           tabBarInactiveTintColor: 'gray',
//           tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold', fontFamily: 'Poppins_700Bold' },
//           tabBarStyle: { backgroundColor: '#f8f8f8' },
//           tabBarItemStyle: { backgroundColor: 'transparent' },
//           tabBarPressColor: '#1F818C',
//           tabBarIndicatorStyle: { backgroundColor: '#1F818C', height: 3 },
//         }}
//       >
//         <Tab.Screen
//           name="Pickup"
//           children={() => <PickupTab refreshCounts={fetchParcelCounts} navigation={navigation} />}
//           listeners={{
//             focus: () => setHeaderTitle('Pickups'),
//           }}
//         />
//         <Tab.Screen
//           name="Deliver"
//           children={() => <DeliverTab refreshCounts={fetchParcelCounts} navigation={navigation} />}
//           listeners={{
//             focus: () => setHeaderTitle('Deliveries'),
//           }}
//         />
//       </Tab.Navigator>

//       {/* Footer */}
//       <Footer navigation={navigation} driverDetails={driverDetails} />
//     </View>
//   );
// };

// // Pending Parcels Headers
// const PendingParcelsText = () => (
//   <View style={styles.pendingParcelsContainer}>
//     <Text style={styles.pendingParcelsText}>Pending Parcels to Deliver</Text>
//   </View>
// );

// const PendingParcelsPickupText = () => (
//   <View style={styles.pendingParcelsContainer}>
//     <Text style={styles.pendingParcelsText}>Pending Parcels to Pick Up</Text>
//   </View>
// );

// export default HomeScreen;

// import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator, Dimensions } from 'react-native';
// import styles from '../styles/HomeScreenStyles';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import Footer from '../components/Footer';
// import * as Location from 'expo-location';
// import { DriverContext } from '../context/DriverContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { LinearGradient } from 'expo-linear-gradient';
// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import API_BASE_URL from '../../config';

// const { width } = Dimensions.get('window');
// const Tab = createMaterialTopTabNavigator();


// // Enhanced mock data with proper date formatting
// const mockVehicleData = {
//   _id: "VEHICLE_123",
//   licensePlate: "ABC-1234",
//   model: "Toyota Hilux",
//   bookedTime: [
//     {
//       bookedTime: "2023-06-15T08:00:00Z", 
//       tripId: "TRIP_001",
//       status: "in-progress"
//     },
//     {
//       bookedTime: "2023-06-15T13:30:00Z", 
//       tripId: "TRIP_002",
//       status: "assigned"
//     }
//   ]
// };

// const mockParcelTrips = {
//   "TRIP_001": {
//     parcels: [
//       {
//         id: "PARCEL-001",
//         type: "pickup",
//         customerName: "John Doe",
//         trackingNo: "TRK123456",
//         address: "123 Main St, Colombo",
//         paymentMethod: "Online",
//         status: "Pending"
//       },
//       {
//         id: "PARCEL-003",
//         type: "pickup",
//         customerName: "David Wilson",
//         trackingNo: "TRK345678",
//         address: "789 Beach Road, Galle",
//         paymentMethod: "Online",
//         status: "Pending"
//       }
//     ]
//   },
//   "TRIP_002": {
//     parcels: [
//       {
//         id: "PARCEL-002",
//         type: "delivery",
//         customerName: "Jane Smith",
//         trackingNo: "TRK789012",
//         address: "456 Oak Ave, Kandy",
//         paymentMethod: "COD",
//         amountToBePaid: 1500,
//         status: "Pending"
//       }
//     ]
//   }
// };

// // Improved Trip Card Component
// const TripCard = ({ trip, isSelected, onPress }) => {
//   const tripDate = new Date(trip.bookedTime).toLocaleDateString('en-US', {
//     weekday: 'short',
//     month: 'short',
//     day: 'numeric'
//   });
  
//   const tripTime = new Date(trip.bookedTime).toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });

//   return (
//     <TouchableOpacity
//       style={[styles.tripCard, isSelected && styles.selectedTripCard]}
//       onPress={onPress}
//     >
//       <View style={styles.tripTimeContainer}>
//         <MaterialIcons name="access-time" size={16} color="#1F818C" />
//         <Text style={styles.tripTime}>{tripTime}</Text>
//       </View>
//       <Text style={styles.tripDate}>{tripDate}</Text>
//       <View style={styles.tripIdContainer}>
//         <MaterialIcons name="local-shipping" size={16} color="#1F818C" />
//         <Text style={styles.tripId}>Trip #{trip.tripId.slice(-3)}</Text>
//       </View>
//       <View style={[
//         styles.tripStatusBadge,
//         trip.status === 'assigned' ? styles.assignedBadge : styles.inProgressBadge
//       ]}>
//         <Text style={styles.tripStatusText}>
//           {trip.status === 'assigned' ? 'Assigned' : 'In Progress'}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// // Status Card Component
// const StatusCard = ({ title, count }) => (
//   <LinearGradient
//     colors={['#1F818C', '#2AA3B1']}
//     start={{ x: 0, y: 0 }}
//     end={{ x: 1, y: 0 }}
//     style={styles.card}
//   >
//     <Text style={styles.cardTitle}>{title}</Text>
//     <Text style={styles.cardCount}>{count}</Text>
//   </LinearGradient>
// );

// // Parcel Card Component (unchanged from your working version)
// const ParcelCard = ({ 
//   parcelId, 
//   customerName, 
//   trackingNo, 
//   address, 
//   isPickup, 
//   navigation,
//   paymentMethod = isPickup ? 'Online' : 'COD',
//   amountToBePaid = 0
// }) => {
//   const { driverDetails } = useContext(DriverContext);
//   const [isPaid, setIsPaid] = useState(paymentMethod === 'Online');
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [paidAmount, setPaidAmount] = useState('');
//   const [isPressed, setIsPressed] = useState(false);

//   const handleStatusUpdate = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
      
//       if (!isPickup && paymentMethod === 'COD' && !isPaid) {
//         setShowPaymentModal(true);
//         return;
//       }

//       // In a real app, this would call your API
//       const response = await axios.post(`${API_BASE_URL}/api/mobile/updateParcelstatus/`, {
//         parcelId,
//         status: isPickup ? 'Picked Up' : 'Delivered',
//         paymentMethod,
//         isPaid,
//         paidAmount: paymentMethod === 'COD' ? parseFloat(paidAmount) || amountToBePaid : 0
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log('Parcel status updated:', response.data);
//       Alert.alert(
//         "Success", 
//         `Parcel ${isPickup ? 'picked up' : 'delivered'} successfully${!isPickup && paymentMethod === 'COD' ? ' and payment collected' : ''}!`,
//         [{ text: "OK" }]
//       );
//       refreshCounts();
//     } catch (error) {
//       console.error('Error updating parcel status:', error);
//       Alert.alert("Error", "Failed to update parcel status");
//     }
//   };

//   const confirmPayment = () => {
//     if (!paidAmount || parseFloat(paidAmount) < amountToBePaid) {
//       Alert.alert("Invalid Amount", `Please enter at least LKR ${amountToBePaid}`);
//       return;
//     }
//     setIsPaid(true);
//     setShowPaymentModal(false);
//     Alert.alert(
//       "Payment Confirmed", 
//       `LKR ${paidAmount} collected successfully!`,
//       [{ text: "OK", onPress: handleStatusUpdate }]
//     );
//   };

//   const handleViewOnMap = async () => {
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location permission is required to access the map.');
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       navigation.navigate('Map', {
//         address,
//         currentLocation: {
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//         },
//       });
//     } catch (error) {
//       console.warn('Error getting location:', error);
//       Alert.alert('Error', 'Unable to get current location.');
//     }
//   };
  
//   return (
//     <View style={[
//       styles.parcelCard,
//       isPressed && styles.cardPressed
//     ]}
//     onTouchStart={() => setIsPressed(true)}
//     onTouchEnd={() => setIsPressed(false)}>
      
//       {/* Card Header */}
//       <View style={[
//         styles.cardHeader,
//         isPickup ? styles.pickupHeader : styles.deliveryHeader
//       ]}>
//         <View style={styles.parcelIdContainer}>
//           <MaterialIcons name="local-shipping" size={18} color="white" />
//           <Text style={styles.parcelId}>{parcelId}</Text>
//         </View>
//         <View style={[
//           styles.statusBadge,
//           isPickup ? styles.pickupBadge : styles.deliveryBadge
//         ]}>
//           <Text style={styles.badgeText}>
//             {isPickup ? 'PICKUP' : 'DELIVERY'}
//           </Text>
//         </View>
//       </View>

//       {/* Customer Info */}
//       <View style={styles.infoSection}>
//         <View style={styles.infoRow}>
//           <MaterialIcons name="person" size={20} color="#1F818C" />
//           <Text style={styles.infoText}>{customerName}</Text>
//         </View>
        
//         <View style={styles.infoRow}>
//           <MaterialIcons name="confirmation-number" size={20} color="#1F818C" />
//           <Text style={styles.infoText}>{trackingNo}</Text>
//         </View>
        
//         <View style={styles.infoRow}>
//           <MaterialIcons name="location-on" size={20} color="#1F818C" />
//           <Text style={styles.infoText} numberOfLines={2}>{address}</Text>
//         </View>
//       </View>

//       {/* Divider */}
//       <View style={styles.divider} />

//       {/* Payment Info */}
//       <View style={styles.paymentSection}>
//         <View style={styles.infoRow}>
//           <MaterialIcons 
//             name={paymentMethod === 'COD' ? 'attach-money' : 'credit-card'} 
//             size={20} 
//             color={paymentMethod === 'COD' ? '#E53935' : '#43A047'} 
//           />
//           <Text style={[
//             styles.paymentText,
//             paymentMethod === 'COD' ? styles.codText : styles.onlineText
//           ]}>
//             {paymentMethod === 'COD' ? 
//               `COD - LKR ${amountToBePaid} ${isPaid ? '(Paid)' : '(Pending)'}` : 
//               'Online (Paid)'}
//           </Text>
//         </View>
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actionButtons}>
//         <TouchableOpacity 
//           style={styles.mapButton}
//           onPress={handleViewOnMap}
//           activeOpacity={0.8}
//         >
//           <MaterialIcons name="map" size={18} color="white" />
//           <Text style={styles.mapButtonText}> VIEW MAP</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[
//             styles.actionButton,
//             isPickup ? styles.pickupButton : styles.deliverButton
//           ]}
//           onPress={handleStatusUpdate}
//           activeOpacity={0.8}
//         >
//           <MaterialIcons 
//             name={isPickup ? 'local-shipping' : 'check-circle'} 
//             size={18} 
//             color="white" 
//           />
//           <Text style={styles.actionButtonText}>
//             {isPickup ? ' PICK UP' : 
//               (paymentMethod === 'COD' ? 
//                 (isPaid ? ' DELIVER' : ' COLLECT COD') : 
//                 ' DELIVER')}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Payment Modal for COD */}
//       {showPaymentModal && (
//         <View style={styles.paymentModal}>
//           <View style={styles.paymentModalContent}>
//             <Text style={styles.modalTitle}>Collect COD Payment</Text>
//             <Text style={styles.modalText}>Amount Due: LKR {amountToBePaid}</Text>
            
//             <TextInput
//               style={styles.paymentInput}
//               placeholder={`Enter collected amount (min LKR ${amountToBePaid})`}
//               keyboardType="numeric"
//               value={paidAmount}
//               onChangeText={setPaidAmount}
//               placeholderTextColor="#999"
//             />
            
//             <View style={styles.modalButtonContainer}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setShowPaymentModal(false)}
//               >
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.confirmButton}
//                 onPress={confirmPayment}
//               >
//                 <Text style={styles.buttonText}>Confirm</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// const PickupTab = ({ parcels = [], navigation }) => (
//   <ScrollView contentContainerStyle={styles.scrollContainer}>
//     <View style={styles.statusCardsContainer}>
//       <StatusCard title="Assigned" count={parcels.length} />
//       <StatusCard 
//         title="Picked Up" 
//         count={parcels.filter(p => p.status === 'Picked Up').length} 
//       />
//       <StatusCard 
//         title="Pending" 
//         count={parcels.filter(p => p.status !== 'Picked Up').length} 
//       />
//     </View>

//     <View style={styles.pendingParcelsContainer}>
//       <Text style={styles.pendingParcelsText}>Parcels To Pick Up</Text>
//     </View>

//     {parcels.map(parcel => (
//       <ParcelCard 
//         key={parcel.id}
//         parcelId={parcel.id}
//         customerName={parcel.customerName}
//         trackingNo={parcel.trackingNo}
//         address={parcel.address}
//         isPickup={true}
//         navigation={navigation}
//         paymentMethod={parcel.paymentMethod}
//       />
      
//     ))}
//   </ScrollView>
// );

// const DeliverTab = ({ parcels = [], navigation }) => (
//   <ScrollView contentContainerStyle={styles.scrollContainer}>
//     <View style={styles.statusCardsContainer}>
//       <StatusCard title="Assigned" count={parcels.length} />
//       <StatusCard 
//         title="Delivered" 
//         count={parcels.filter(p => p.status === 'Delivered').length} 
//       />
//       <StatusCard 
//         title="Pending" 
//         count={parcels.filter(p => p.status !== 'Delivered').length} 
//       />
//     </View>

//     <View style={styles.pendingParcelsContainer}>
//       <Text style={styles.pendingParcelsText}>Parcels To Deliver</Text>
//     </View>

//     {parcels.map(parcel => (
//       <ParcelCard 
//         key={parcel.id}
//         parcelId={parcel.id}
//         customerName={parcel.customerName}
//         trackingNo={parcel.trackingNo}
//         address={parcel.address}
//         isPickup={false}
//         navigation={navigation}
//         paymentMethod={parcel.paymentMethod}
//         amountToBePaid={parcel.amountToBePaid}
//       />
//     ))}
//   </ScrollView>
// );

// const HomeScreen = ({ navigation, route }) => {
//   const [selectedTripId, setSelectedTripId] = useState(mockVehicleData.bookedTime[0]?.tripId);
  
//   // Get parcels for the selected trip
//   const selectedTripParcels = selectedTripId ? mockParcelTrips[selectedTripId]?.parcels || [] : [];
//   const pickupParcels = selectedTripParcels.filter(p => p.type === 'pickup');
//   const deliveryParcels = selectedTripParcels.filter(p => p.type === 'delivery');

//   return (
//     <View style={styles.container}>
//       {/* Header with Vehicle Info */}
//       <LinearGradient colors={['#1F818C', '#2AA3B1']} style={styles.header}>
//         <View style={styles.vehicleInfo}>
//           <MaterialIcons name="directions-car" size={24} color="white" />
//           <View style={styles.vehicleTextContainer}>
//             <Text style={styles.vehicleModel}>{mockVehicleData.model}</Text>
//             <Text style={styles.vehiclePlate}>{mockVehicleData.licensePlate}</Text>
//           </View>
//         </View>
//       </LinearGradient>

//       {/* Trip Selection */}
//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false}
//         style={styles.tripScroll}
//         contentContainerStyle={styles.tripScrollContent}
//       >
//         {mockVehicleData.bookedTime.map((trip) => (
//           <TripCard
//             key={trip.tripId}
//             trip={trip}
//             isSelected={selectedTripId === trip.tripId}
//             onPress={() => setSelectedTripId(trip.tripId)}
//           />
//         ))}
//       </ScrollView>

//       {/* Tab Navigator */}
//       <Tab.Navigator
//         screenOptions={{
//           tabBarActiveTintColor: '#1F818C',
//           tabBarInactiveTintColor: '#888',
//           tabBarLabelStyle: { 
//             fontSize: 14, 
//             fontWeight: 'bold'
//           },
//           tabBarStyle: { 
//             backgroundColor: 'white',
//             elevation: 0,
//             shadowOpacity: 0,
//             borderBottomWidth: 1,
//             borderBottomColor: '#eee'
//           },
//           tabBarIndicatorStyle: { 
//             backgroundColor: '#1F818C', 
//             height: 3,
//           },
//         }}
//       >
//         <Tab.Screen name="Pickups">
//           {() => <PickupTab parcels={pickupParcels} navigation={navigation} />}
//         </Tab.Screen>
//         <Tab.Screen name="Deliveries">
//           {() => <DeliverTab parcels={deliveryParcels} navigation={navigation} />}
//         </Tab.Screen>
//       </Tab.Navigator>

//       <Footer navigation={navigation} driverDetails={route.params?.driverDetails} />

//     </View>

    
//   );
// };

// export default HomeScreen;



//HomeScreen.js
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';
import styles from '../styles/HomeScreenStyles';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Footer from '../components/Footer';
import axios from 'axios';
import API_BASE_URL from '../../config';
import * as Location from 'expo-location';
import { DriverContext } from '../context/DriverContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

const Tab = createMaterialTopTabNavigator();

// Reusable Status Card component
const StatusCard = ({ title, count }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardCount}>{count}</Text>
  </View>
);
//PArcelcard

const ParcelCard = ({ parcel, isPickup, navigation, refreshCounts }) => {
  // Debugging logs
  console.log('Rendering ParcelCard with:', {
    parcelId: parcel.parcelId,
    status: parcel.status,
    isPickup,
    populatedFields: {
      sender: !!parcel.senderId,
      receiver: !!parcel.receiverId,
      payment: !!parcel.paymentId
    }
  });



  // Data extraction with fallbacks
  const parcelId = parcel.parcelId || 'N/A';
  const trackingNo = parcel.trackingNo || 'N/A';

  const customerInfo = isPickup
    ? {
        name: [
        parcel.customerName,
        ].filter(Boolean).join(' ') || 'Sender not specified',
        phone: parcel.phone  || 'No phone'
      }
    : {
        name: [
         // parcel.receiverName,
          parcel.customerName,
          //parcel.receiverId?.receiverFullName
        ].filter(Boolean).join(' ') || 'Recipient not specified',
        phone:  [parcel.receiverPhone,
                parcel.phone,
                parcel.receiverId?.receiverContact,
                parcel.receiverId?.contact 
              ].filter(Boolean)[0] || 'No phone'
      };

  const address = isPickup
    ? parcel.pickupInformation?.address || parcel.address
    : parcel.deliveryInformation?.deliveryAddress || parcel.address;



  const paymentData = parcel.paymentId || parcel.payment || {};
  const paymentMethod = (
    paymentData.paymentMethod || 
    (isPickup ? 'Online' : 'COD')
  ).toUpperCase();




  const amountToBePaid = Number(paymentData.amount || 0);

  const { driverDetails } = useContext(DriverContext);
  const [isPaid, setIsPaid] = useState(paymentMethod === 'Online');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [parcels, setParcels] = useState([]); // Import useState from 'react'

  

  const handleStatusUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      // For COD deliveries that aren't paid yet
      if (!isPickup && paymentMethod === 'COD' && !isPaid) {
        setShowPaymentModal(false);
        return;
      }
  
      // Determine the new status based on parcel type
      const newStatus = isPickup ? 'PickedUp' : 'Delivered';
  
      // Prepare the request data
      const requestData = {
        parcelId,
        status: newStatus,
        paymentMethod,
        isPaid: paymentMethod === 'COD' ? isPaid : true, // Pickups are always paid
        amount: paymentMethod === 'COD' ? parseFloat(amount) || amountToBePaid : 0
      };
  
      console.log('Updating parcel status with:', requestData);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/mobile/updateParcelStatus`, 
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Parcel status updated:', response.data);
      
      // Remove the parcel from the displayed list
      setParcels(prevParcels => prevParcels.filter(parcel => parcel.parcelId !== parcelId));
  
      // Show appropriate success message
      let successMessage = `Parcel ${isPickup ? 'picked up' : 'delivered'} successfully`;
      if (!isPickup && paymentMethod === 'COD') {
        successMessage += ` and collected LKR ${amount || amountToBePaid}`;
      }
  
      Alert.alert(
        "Success", 
        successMessage,
        [{ text: "OK", onPress: () => refreshCounts() }]
      );
      
    } catch (error) {
      console.error('Error updating parcel status:', error);
      
      let errorMessage = "Failed to update parcel status";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
  
      Alert.alert(
        "Error", 
        errorMessage,
        [{ text: "OK" }]
      );
    }
  };
  

  const confirmPayment = () => {
    if (!amount || parseFloat(amount) < amountToBePaid) {
      Alert.alert("Invalid Amount", `Please enter at least LKR ${amountToBePaid}`);
      return;
    }
  
    setIsPaid(true);
    
  // Show confirmation dialog
  Alert.alert(
    "Confirm Payment",
    `Are you sure you want to pay LKR ${amount}?`,
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { 
        text: "Confirm", 
        onPress: () => {
          setIsPaid(true);
          setShowPaymentModal(false);
          
          // Optional: delay for smooth modal dismissal
          setTimeout(() => {
            //showConfirmationDialog();
          }, 300);
        } 
      }
    ]
  );
};
  

  const handleViewOnMap = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to access the map.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      navigation.navigate('Map', {
        address,
        currentLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });
    } catch (error) {
      console.warn('Error getting location:', error);
      Alert.alert('Error', 'Unable to get current location.');
    }
  };

  const showConfirmationDialog = () => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to mark this parcel as ${isPickup ? 'Picked Up' : 'Delivered'}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Confirm", 
          onPress: () => handleStatusUpdate(),
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };
  
  return (
    <View style={[
      styles.parcelCard,
      isPickup ? styles.pickupCard : styles.deliveryCard,
      isPressed && styles.cardPressed
    ]}
    onTouchStart={() => setIsPressed(true)}
    onTouchEnd={() => setIsPressed(false)}>
      
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.parcelId}>{parcelId}</Text>
        <View style={[
          styles.statusBadge,
          isPickup ? styles.pickupBadge : styles.deliveryBadge
        ]}>
          <Text style={styles.badgeText}>
            {isPickup ? 'PICKUP' : 'DELIVERY'}
          </Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={18} color="#555" />
          <Text style={styles.infoText}>{customerInfo.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MaterialIcons name="confirmation-number" size={18} color="#555" />
          <Text style={styles.infoText}>{trackingNo}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="phone" size={18} color="#555" />
          <Text style={styles.infoText}>{customerInfo.phone || 'No phone'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={18} color="#555" />
          <Text style={styles.infoText}>{address}</Text>
        </View>
      </View>

      {/* Payment Info */}
      <View style={styles.paymentSection}>
        <View style={styles.infoRow}>
          <MaterialIcons 
            name={paymentMethod === 'COD' ? 'attach-money' : 'credit-card'} 
            size={18} 
            color={paymentMethod === 'COD' ? '#E53935' : '#43A047'} 
          />
          <Text style={[
            styles.paymentText,
            paymentMethod === 'COD' ? styles.codText : styles.onlineText
          ]}>
            {paymentMethod === 'COD' ? 
              `COD - LKR ${amountToBePaid} ${isPaid ? '(Paid)' : '(Pending)'}` : 
              'Online (Paid)'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
<View style={styles.actionButtons}>
  <TouchableOpacity 
    style={styles.mapButton}
    onPress={handleViewOnMap}
    activeOpacity={0.8}
  >
    <MaterialIcons name="map" size={16} color="white" />
    <Text style={styles.mapButtonText}> Map</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={[
      styles.actionButton,
      !isPickup && paymentMethod === 'COD' && !isPaid && styles.codButton,
      isPickup ? styles.pickupButton : styles.deliverButton
    ]}
    onPress={() => {
      if (!isPickup && paymentMethod === 'COD' && !isPaid) {
        setShowPaymentModal(true); // Show COD modal first
      } else {
        showConfirmationDialog(); // Directly show confirmation for pickups or paid deliveries
      }
    }}
    
    activeOpacity={0.8}
  >
    <MaterialIcons 
      name={isPickup ? 'local-shipping' : 'check-circle'} 
      size={16} 
      color="white" 
    />
    <Text style={styles.actionButtonText}>
      {isPickup ? ' Picked Up' : 
        (paymentMethod === 'COD' ? 
          (isPaid ? ' Delivered' : ' Collect COD') : 
          ' Delivered')}
    </Text>
  </TouchableOpacity>
</View>

      {/* Payment Modal for COD */}
      {showPaymentModal && (
        <View style={styles.paymentModal}>
          <View style={styles.paymentModalContent}>
            <Text style={styles.modalTitle}>Collect COD Payment</Text>
            <Text style={styles.modalText}>Amount Due: LKR {amountToBePaid}</Text>
            
            <TextInput
              style={styles.paymentInput}
              placeholder={`Enter collected amount (min LKR ${amountToBePaid})`}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmPayment}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const PickupTab = ({ refreshCounts, navigation, morningParcels, eveningParcels, isPickupTab }) => {
  const [activeTimeSlot, setActiveTimeSlot] = useState('morning');
  const [scheduleDate, setScheduleDate] = useState(moment().format('YYYY-MM-DD'));
  const [isLoading, setIsLoading] = useState(true);

  // Memoized parcel processing
  const { assignedCount, completedCount, pendingCount, pendingParcels } = useMemo(() => {
    const timeSlotParcels = activeTimeSlot === 'morning' 
      ? morningParcels 
      : eveningParcels;

    console.log('Processing parcels:', timeSlotParcels);

    let pending = 0;
    let completed = 0;
    const pendingItems = [];

    timeSlotParcels.forEach(p => {
      const isMatchingDate = moment(p.scheduleDate).isSame(scheduleDate, 'day');
      if (!isMatchingDate) return;

      if (isPickupTab) {
        if (p.status === 'PendingPickup'){
          pending++;
          pendingItems.push(p);
        } 
        if (p.status === 'PickedUp') completed++;
      } else {
        if (p.status === 'DeliveryDispatched') {
          pending++;
          pendingItems.push(p);
        }
        if (p.status === 'Delivered') completed++;
      }
    });

    return {
      assignedCount: pending + completed,
      completedCount: completed,
      pendingCount: pending,
      pendingParcels: pendingItems
    };

  }, [morningParcels, eveningParcels, activeTimeSlot, scheduleDate, isPickupTab]);

  useEffect(() => {
    if (morningParcels.length > 0 || eveningParcels.length > 0) {
      setIsLoading(false);
    }
  }, [morningParcels, eveningParcels]);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  console.log('Final counts:', {
    assigned: assignedCount,
    completed: completedCount,
    pending: pendingCount
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusCard title="Parcels Assigned" count={assignedCount} />
      <StatusCard title={isPickupTab ? "Picked Up" : "Delivered"} count={completedCount} />
      <StatusCard title="Pending" count={pendingCount} />

      {/* Date Picker */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Schedule Date:</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => {
            // Implement date picker modal here
            // For now, just toggle between today and tomorrow
            setScheduleDate(prev => 
              prev === moment().format('YYYY-MM-DD') 
                ? moment().add(1, 'days').format('YYYY-MM-DD') 
                : moment().format('YYYY-MM-DD')
            );
          }}
        >
          <Text style={styles.dateText}>
            {moment(scheduleDate).format('MMM D, YYYY')}
          </Text>
          <MaterialIcons name="calendar-today" size={18} color="#1F818C" />
        </TouchableOpacity>
      </View>

      {/* Time Slot Selector */}
      <View style={styles.timeSlotContainer}>
        <TouchableOpacity 
          style={[
            styles.timeSlotButton, 
            activeTimeSlot === 'morning' && styles.activeTimeSlot
          ]}
          onPress={() => setActiveTimeSlot('morning')}
        >
          <Text style={[
            styles.timeSlotText,
            activeTimeSlot === 'morning' && styles.activeTimeSlotText
          ]}>
            8AM - 12PM
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.timeSlotButton, 
            activeTimeSlot === 'evening' && styles.activeTimeSlot
          ]}
          onPress={() => setActiveTimeSlot('evening')}
        >
          <Text style={[
            styles.timeSlotText,
            activeTimeSlot === 'evening' && styles.activeTimeSlotText
          ]}>
            1PM - 5PM
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pendingParcelsContainer}>
        <Text style={styles.pendingParcelsText}>
          {isPickupTab ? 'Pending Parcels to Pick Up' : 'Pending Parcels to Deliver'} 
          ({activeTimeSlot === 'morning' ? 'Morning' : 'Evening'}) on {moment(scheduleDate).format('MMM D')}
        </Text>
      </View>

      {pendingParcels.length > 0 ? (
        pendingParcels.map(parcel => (
       
          <ParcelCard 
            key={parcel._id}
            parcel={parcel} // Pass full parcel object
            isPickup={isPickupTab}
            refreshCounts={refreshCounts}
            navigation={navigation}
          />

        ))
      ) : (
        <View style={styles.noParcelsContainer}>
          <Text style={styles.noParcelsText}>
            No {isPickupTab ? 'pickups' : 'deliveries'} scheduled for {activeTimeSlot === 'morning' ? 'morning' : 'evening'} slot on {moment(scheduleDate).format('MMM D')}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const HomeScreen = ({ navigation, route }) => {
  const { driverDetails } = route.params || {};
  const [headerTitle, setHeaderTitle] = useState('Deliveries');
  const [morningParcels, setMorningParcels] = useState([]);
  const [eveningParcels, setEveningParcels] = useState([]);
  const [loading, setLoading] = useState(true);
 


  const fetchDriverParcels = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const today = moment().format('YYYY-MM-DD');
      
      // Get vehicle
      const vehicleResponse = await axios.get(`${API_BASE_URL}/api/mobile/driver_vehicle`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { driverId: driverDetails.driverId }
      });
      
      console.log('Full vehicle response:', JSON.stringify(vehicleResponse.data, null, 2));
      
      const vehicleId = vehicleResponse.data.data.vehicle.id;
      console.log('Vehicle ID:', vehicleId);
      
      
 // Get parcels
console.log('Fetching parcels for vehicle:', vehicleId, 'on', today);
const parcelsResponse = await axios.get(`${API_BASE_URL}/api/mobile/vehicle-parcels`, {
  headers: { Authorization: `Bearer ${token}` },
  params: { vehicleId, scheduleDate: today }
});

//console.log('Raw API data structure:', parcelsResponse.data);

// Try accessing data at different levels
const morning = parcelsResponse.data?.data?.morningParcels || 
               parcelsResponse.data?.morningParcels || 
               [];
const evening = parcelsResponse.data?.data?.eveningParcels || 
               parcelsResponse.data?.eveningParcels || 
               [];

console.log('After extraction - morning:', morning);
console.log('After extraction - evening:', evening);

setMorningParcels(morning);
setEveningParcels(evening);
setLoading(false);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      console.error('Error in fetchDriverParcels:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      Alert.alert("Error", `Failed to load parcel data: ${errorMessage}`);
      setLoading(false);
    }
  };
  


  useEffect(() => {
    fetchDriverParcels();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F818C" />
        <Text style={styles.loadingText}>Loading your parcels...</Text>
      </View>
    );
  }

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
          children={() => (
            <PickupTab 
              refreshCounts={fetchDriverParcels} 
              navigation={navigation}
              morningParcels={morningParcels}
              eveningParcels={eveningParcels}
              isPickupTab={true}
            />
          )}
          listeners={{
            focus: () => setHeaderTitle('Pickups'),
          }}
        />
        <Tab.Screen
          name="Deliver"
          children={() => (
            <PickupTab 
              refreshCounts={fetchDriverParcels} 
              navigation={navigation}
              morningParcels={morningParcels}
              eveningParcels={eveningParcels}
              isPickupTab={false}
            />
          )}
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



export default HomeScreen;