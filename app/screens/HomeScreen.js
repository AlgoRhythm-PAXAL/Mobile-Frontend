//HomeScreen.js
import React, { useEffect, useState, useContext, useMemo, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  Linking
} from 'react-native';
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

//Parcelcard
const ParcelCard = ({ parcel, isPickup, navigation, refreshCounts }) => {
  console.log('Rendering ParcelCard with:', {
    parcelId: parcel.parcelId,
    status: parcel.status,
    isPickup,
    populatedFields: {
      sender: !!parcel.senderId,
      receiver: !!parcel.receiverId,
      payment: !!parcel.paymentId,
    },
  });

  // Data extraction
  const parcelId = parcel.parcelId || 'N/A';
  const trackingNo = parcel.trackingNo || 'N/A';

  const customerInfo = isPickup
    ? {
        name:
          [parcel.customerName].filter(Boolean).join(' ') ||
          'Sender not specified',
        phone: parcel.phone || 'No phone',
      }
    : {
        name:
          [parcel.customerName].filter(Boolean).join(' ') ||
          'Recipient not specified',
        phone:
          [
            parcel.receiverPhone,
            parcel.phone,
            parcel.receiverId?.receiverContact,
            parcel.receiverId?.contact,
          ].filter(Boolean)[0] || 'No phone',
      };

  const address = isPickup
    ? parcel.pickupInformation?.address || parcel.address
    : parcel.deliveryInformation?.deliveryAddress || parcel.address;

  const paymentData = parcel.paymentId || parcel.payment || {};
  const paymentMethod = (
    paymentData.paymentMethod || (isPickup ? 'Online' : 'COD')
  ).toUpperCase();

  const amountToBePaid = Number(paymentData.amount || 0);

  const { driverDetails } = useContext(DriverContext);
  const [isPaid, setIsPaid] = useState(paymentMethod === 'Online');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [parcels, setParcels] = useState([]);

  const handleStatusUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      
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
        isPaid: paymentMethod === 'COD' ? isPaid : true, 
        amount:
          paymentMethod === 'COD' ? parseFloat(amount) || amountToBePaid : 0,
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

      // Remove the parcel from the displayed list(refreshing)
      setParcels((prevParcels) =>
        prevParcels.filter((parcel) => parcel.parcelId !== parcelId)
      );

      let successMessage = `Parcel ${isPickup ? 'picked up' : 'delivered'} successfully`;
      if (!isPickup && paymentMethod === 'COD') {
        successMessage += ` and collected LKR ${amount || amountToBePaid}`;
      }

      Alert.alert('Success', successMessage, [
        { text: 'OK', onPress: () => refreshCounts() },
      ]);
    } catch (error) {
      console.error('Error updating parcel status:', error);

      let errorMessage = 'Failed to update parcel status';
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    }
  };

  const confirmPayment = () => {
    if (!amount || parseFloat(amount) < amountToBePaid) {
      Alert.alert(
        'Invalid Amount',
        `Please enter at least LKR ${amountToBePaid}`
      );
      return;
    }

    setIsPaid(true);

    // Show confirmation dialog
    Alert.alert(
      'Confirm Payment',
      `Are you sure you want to pay LKR ${amount}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            setIsPaid(true);
            setShowPaymentModal(false);

            setTimeout(() => {}, 300);
          },
        },
      ]
    );
  };

  const handleViewOnMap = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to access the map.'
        );
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
      'Confirm Action',
      `Are you sure you want to mark this parcel as ${isPickup ? 'Picked Up' : 'Delivered'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => handleStatusUpdate(),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View
      style={[
        styles.parcelCard,
        isPickup ? styles.pickupCard : styles.deliveryCard,
        isPressed && styles.cardPressed,
      ]}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.parcelId}>{parcelId}</Text>
        <View
          style={[
            styles.statusBadge,
            isPickup ? styles.pickupBadge : styles.deliveryBadge,
          ]}
        >
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
          <Text style={[styles.infoText, { flex: 1 }]}>
            {customerInfo.phone || 'No phone'}
          </Text>
          {customerInfo.phone ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${customerInfo.phone}`)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ paddingLeft: 10 }}
            >
              <MaterialIcons name="call" size={22} color="#555" />
            </TouchableOpacity>
          ) : null}
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
          <Text
            style={[
              styles.paymentText,
              paymentMethod === 'COD' ? styles.codText : styles.onlineText,
            ]}
          >
            {paymentMethod === 'COD'
              ? `COD - LKR ${amountToBePaid} ${isPaid ? '(Paid)' : '(Pending)'}`
              : 'Online (Paid)'}
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
            isPickup ? styles.pickupButton : styles.deliverButton,
          ]}
          onPress={() => {
            if (!isPickup && paymentMethod === 'COD' && !isPaid) {
              setShowPaymentModal(true); 
            } else {
              showConfirmationDialog();
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
            {isPickup
              ? ' Picked Up'
              : paymentMethod === 'COD'
                ? isPaid
                  ? ' Delivered'
                  : ' Collect COD'
                : ' Delivered'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment Modal for COD */}
      {showPaymentModal && (
        <View style={styles.paymentModal}>
          <View style={styles.paymentModalContent}>
            <Text style={styles.modalTitle}>Collect COD Payment</Text>
            <Text style={styles.modalText}>
              Amount Due: LKR {amountToBePaid}
            </Text>

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

const PickupTab = ({
  refreshCounts,
  navigation,
  morningParcels,
  eveningParcels,
  isPickupTab,
}) => {
  const [activeTimeSlot, setActiveTimeSlot] = useState('morning');
  const [scheduleDate, setScheduleDate] = useState(
    moment().format('YYYY-MM-DD')
  );
  const [isLoading, setIsLoading] = useState(true);

  // Memoized parcel processing
  const { assignedCount, completedCount, pendingCount, pendingParcels } =
    useMemo(() => {
      const timeSlotParcels =
        activeTimeSlot === 'morning' ? morningParcels : eveningParcels;

      console.log('Processing parcels:', timeSlotParcels);

      let pending = 0;
      let completed = 0;
      const pendingItems = [];

      timeSlotParcels.forEach((p) => {
        const isMatchingDate = moment(p.scheduleDate).isSame(
          scheduleDate,
          'day'
        );
        if (!isMatchingDate) return;

        if (isPickupTab) {
          if (p.status === 'PendingPickup') {
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
        pendingParcels: pendingItems,
      };
    }, [
      morningParcels,
      eveningParcels,
      activeTimeSlot,
      scheduleDate,
      isPickupTab,
    ]);

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
    pending: pendingCount,
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusCard title="Parcels Assigned" count={assignedCount} />
      <StatusCard
        title={isPickupTab ? 'Picked Up' : 'Delivered'}
        count={completedCount}
      />
      <StatusCard title="Pending" count={pendingCount} />

      {/* Date Picker */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Schedule Date:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            // Toggle between today and tomorrow
            setScheduleDate((prev) =>
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
            activeTimeSlot === 'morning' && styles.activeTimeSlot,
          ]}
          onPress={() => setActiveTimeSlot('morning')}
        >
          <Text
            style={[
              styles.timeSlotText,
              activeTimeSlot === 'morning' && styles.activeTimeSlotText,
            ]}
          >
            8AM - 12PM
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.timeSlotButton,
            activeTimeSlot === 'evening' && styles.activeTimeSlot,
          ]}
          onPress={() => setActiveTimeSlot('evening')}
        >
          <Text
            style={[
              styles.timeSlotText,
              activeTimeSlot === 'evening' && styles.activeTimeSlotText,
            ]}
          >
            1PM - 5PM
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pendingParcelsContainer}>
        <Text style={styles.pendingParcelsText}>
          {isPickupTab
            ? 'Pending Parcels to Pick Up'
            : 'Pending Parcels to Deliver'}
          ({activeTimeSlot === 'morning' ? 'Morning' : 'Evening'}) on{' '}
          {moment(scheduleDate).format('MMM D')}
        </Text>
      </View>

      {pendingParcels.length > 0 ? (
        pendingParcels.map((parcel) => (
          <ParcelCard
            key={parcel._id}
            parcel={parcel} 
            isPickup={isPickupTab}
            refreshCounts={refreshCounts}
            navigation={navigation}
          />
        ))
      ) : (
        <View style={styles.noParcelsContainer}>
          <Text style={styles.noParcelsText}>
            No {isPickupTab ? 'pickups' : 'deliveries'} scheduled for{' '}
            {activeTimeSlot === 'morning' ? 'morning' : 'evening'} slot on{' '}
            {moment(scheduleDate).format('MMM D')}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const HomeScreen = ({ navigation, route }) => {
  const { driverDetails } = useContext(DriverContext);
  const [headerTitle, setHeaderTitle] = useState('Pickups');
  const [morningParcels, setMorningParcels] = useState([]);
  const [eveningParcels, setEveningParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Pickup Assignment',
      message: '',
      read: false,
      time: 'Today',
    },
    {
      id: 2,
      title: 'Delivery Assignment',
      message: '',
      read: false,
      time: 'Today',
    },
  ]);
  const [parcelCounts, setParcelCounts] = useState({
    pickup: 0,
    delivery: 0,
  });

  const updateNotifications = (pickupCount, deliveryCount) => {
    const newNotifications = notifications.map((notification) => {
      if (notification.id === 1) {
        return {
          ...notification,
          message: `You have ${pickupCount} parcels to pickup`,
          read: pickupCount === 0, // Mark as read if no pickups
        };
      } else if (notification.id === 2) {
        return {
          ...notification,
          message: `You have ${deliveryCount} parcels to deliver`,
          read: deliveryCount === 0, // Mark as read if no deliveries
        };
      }
      return notification;
    });

    setNotifications(newNotifications);

    // Calculate unread count 
    const unread = newNotifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  };

  const fetchDriverParcels = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const today = moment().format('YYYY-MM-DD');

      const vehicleResponse = await axios.get(
        `${API_BASE_URL}/api/mobile/driver_vehicle`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { driverId: driverDetails.driverId },
        }
      );

      const vehicleId = vehicleResponse.data.data.vehicle.id;

      const parcelsResponse = await axios.get(
        `${API_BASE_URL}/api/mobile/vehicle-parcels`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { vehicleId, scheduleDate: today },
        }
      );

      const morning = parcelsResponse.data?.data?.morningParcels || [];
      const evening = parcelsResponse.data?.data?.eveningParcels || [];

      setMorningParcels(morning);
      setEveningParcels(evening);

      // Calculate counts AFTER setting state
      const pickupCount = morning.filter(
        (p) => p.status === 'PendingPickup'
      ).length;
      const deliveryCount = evening.filter(
        (p) => p.status === 'DeliveryDispatched'
      ).length;

      setParcelCounts({
        pickup: pickupCount,
        delivery: deliveryCount,
      });

      updateNotifications(pickupCount, deliveryCount);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred';
      Alert.alert('Error', `Failed to load parcel data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverParcels();
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Text style={styles.headerText}>{headerTitle}</Text>

          <TouchableOpacity onPress={toggleNotifications}>
            <View style={{ position: 'relative' }}>
              <MaterialIcons name="notifications" size={24} color="#1F818C" />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12 }}>
                    {unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Modal */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleNotifications}
        onShow={() => {
          // Mark all notifications as read when modal opens
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          setUnreadCount(0);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Parcel Summary</Text>
              <TouchableOpacity onPress={toggleNotifications}>
                <MaterialIcons name="close" size={24} color="#1F818C" />
              </TouchableOpacity>
            </View>

            <View style={styles.notificationItem}>
              <Text style={styles.notificationTitle}>
                <MaterialIcons
                  name="local-shipping"
                  size={18}
                  color="#1F818C"
                />{' '}
                Parcels to Pick Up
              </Text>
              <Text style={styles.notificationMessage}>
                You have {parcelCounts.pickup} parcels waiting for pickup
              </Text>
            </View>

            <View style={styles.notificationItem}>
              <Text style={styles.notificationTitle}>
                <MaterialIcons name="check-circle" size={18} color="#4CAF50" />{' '}
                Parcels to Deliver
              </Text>
              <Text style={styles.notificationMessage}>
                You have {parcelCounts.delivery} parcels ready for delivery
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      <Tab.Navigator
        initialRouteName="Pickup"
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
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

      <Footer navigation={navigation} driverDetails={driverDetails} />
    </View>
  );
};

export default HomeScreen;
