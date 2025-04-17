//HomeScreenStyles.js

import { StyleSheet } from 'react-native';

// Color Constants (defined first for easy maintenance)
const Colors = {
  // Brand Colors
  primary: '#1F818C',
  primaryLight: '#E0F2F1',
  
  // Action Colors
  pickup: '#FF7A5C',
  pickupLight: '#FFF5F3',
  delivery: '#4DB6AC',
  deliveryLight: '#F0F9F8',
  cod: '#E57373',
  onlinePayment: '#81C784',
  
  // Neutral Colors
  textPrimary: '#2D3748',
  textSecondary: '#718096',
  white: '#FFFFFF',
  background: '#F8FAFC',
  shadow: '#000',
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingBottom: 20, 
        paddingTop: 60, 
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',
     
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.textPrimary,
      
    },

    scrollContainer: {
        padding: 20,
        paddingBottom: 100, 
        backgroundColor: Colors.white,
    },

    content: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },

  pendingParcelsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  pendingParcelsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },


    parcelCard: {
      backgroundColor: Colors.white,
      padding: 16,
      marginVertical: 8,
      borderRadius: 12,
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      borderLeftWidth: 4,
    },
    pickupCard: {
      borderLeftColor: Colors.pickup,
      backgroundColor: Colors.pickupLight, // Amber border for pickup
    },

    deliveryCard: {
         borderLeftColor: Colors.delivery,
         backgroundColor: Colors.deliveryLight, // Blue border for delivery
    },
    cardPressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.9,
    },
  
    // Card Header
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    parcelId: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.textPrimary,
    },
    statusBadge: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 12,
    },
    pickupBadge: {
      backgroundColor: Colors.pickupLight, // Light amber
    },
    deliveryBadge: {
      backgroundColor: Colors.deliveryLight, // Light blue
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
   
  
    // Info Sections
    infoSection: {
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    infoText: {
      fontSize: 14,
      color: Colors.textSecondary,
      marginLeft: 8,
      flex: 1,
    },
  
    // Payment Section
    paymentSection: {
      marginBottom: 16,
    },
    paymentText: {
      fontSize: 14,
      fontWeight: '500',
      marginLeft: 8,
    },
    codText: {
      color: Colors.cod, // Red for COD
    },
    onlineText: {
      color: Colors.onlinePayment, // Green for Online
    },
  
    // Action Buttons
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    mapButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      flex: 1,
      marginRight: 8,
      justifyContent: 'center',
    },
    mapButtonText: {
      color: Colors.white,
      fontWeight: '600',
      fontSize: 14,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      flex: 1,
      justifyContent: 'center',
    },
    pickupButton: {
      backgroundColor: Colors.pickup,
    },
    deliverButton: {
      backgroundColor: Colors.delivery,
    },
    codButton: {
      backgroundColor: Colors.cod,
    },
    actionButtonText: {
      color: Colors.white,
      fontWeight: '600',
      fontSize: 14,
    },
  
    // Status Cards
    card: {
      backgroundColor: Colors.white,
      marginBottom: 12,
      padding: 20,
      borderRadius: 12,
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      alignItems: 'center',
      width: '100%',
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.textSecondary,
      marginBottom: 4,
    },
    cardCount: {
      fontSize: 24,
      fontWeight: '700',
      color: Colors.primary,
    },
    paymentModal: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    paymentModalContent: {
      width: '87%',
      backgroundColor: Colors.white,
      borderRadius: 16,
      padding: 8,
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: Colors.primary, // Using your teal color
      textAlign: 'center',
      marginBottom: 8,
    },
    modalText: {
      fontSize: 16,
      color: Colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },

    paymentInput: {
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 12,
      padding: 10,
      marginBottom: 24,
      fontSize: 15,
      backgroundColor: Colors.white,
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,

    },
    modalButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cancelButton: {
      backgroundColor: Colors.white,
      paddingVertical: 10,
      paddingHorizontal: 34,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: Colors.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, 
      borderColor: Colors.textSecondary,
    },
    
    cancelButtonPressed: {
      backgroundColor: '#F5F5F5',
      transform: [{ scale: 0.98 }],
   
    },
    confirmButton: {
      backgroundColor: Colors.primary, // Your teal color
      shadowColor: Colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 34,
      borderRadius: 8,
      borderColor: Colors.primary, // Your teal color
      alignItems: 'center',
    },
    confirmButtonPressed: {
      backgroundColor: '#166974', // Darker teal
      transform: [{ scale: 0.98 }],
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: Colors.textPrimary,
    },
    confirmButtonText: {
      color: Colors.white,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.background,
    },
    loadingText: {
      marginTop: 20,
      fontSize: 16,
      color: Colors.textSecondary,
    },
    timeSlotContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 15,
      backgroundColor: Colors.white,
      borderRadius: 10,
      padding: 5,
    },
    timeSlotButton: {
      flex: 1,
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    activeTimeSlot: {
      backgroundColor: Colors.primary,
    },
    timeSlotText: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.textSecondary,
    },
    activeTimeSlotText: {
      color: Colors.white,
    },
    noParcelsContainer: {
      alignItems: 'center',
      padding: 20,
    },
    noParcelsText: {
      fontSize: 16,
      color: Colors.textSecondary,
      textAlign: 'center',
    },


    //df
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: '#fff',
      marginBottom: 10,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    dateLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#555',
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: '#f0f0f0',
      borderRadius: 20,
    },
    dateText: {
      fontSize: 14,
      color: '#1F818C',
      marginRight: 5,
    },


});
export default styles;




// export default StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     paddingTop: 50,
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerText: {
//     color: 'white',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   scrollContainer: {
//     paddingBottom: 20,
//   },
//   statusCardsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//     marginTop: 15,
//     marginBottom: 10,
//   },
//   card: {
//     width: '30%',
//     borderRadius: 10,
//     padding: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   cardTitle: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//     marginBottom: 5,
//     textAlign: 'center',
//   },
//   cardCount: {
//     color: 'white',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   pendingParcelsContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     backgroundColor: '#f8f9fa',
//   },
//   pendingParcelsText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#555',
//   },
//   parcelCard: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     marginHorizontal: 15,
//     marginVertical: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     overflow: 'hidden',
//   },
//   cardPressed: {
//     transform: [{ scale: 0.98 }],
//     opacity: 0.9,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     paddingBottom: 10,
//   },
//   pickupHeader: {
//     backgroundColor: '#1F818C',
//   },
//   deliveryHeader: {
//     backgroundColor: '#2AA3B1',
//   },
//   parcelIdContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   parcelId: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 5,
//   },
//   statusBadge: {
//     paddingVertical: 3,
//     paddingHorizontal: 10,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pickupBadge: {
//     backgroundColor: '#0D5D68',
//   },
//   deliveryBadge: {
//     backgroundColor: '#16818C',
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   infoSection: {
//     padding: 15,
//     paddingBottom: 10,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   infoText: {
//     marginLeft: 10,
//     fontSize: 14,
//     color: '#555',
//     flex: 1,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#eee',
//     marginHorizontal: 15,
//   },
//   paymentSection: {
//     padding: 15,
//     paddingTop: 10,
//     paddingBottom: 15,
//   },
//   paymentText: {
//     marginLeft: 10,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   codText: {
//     color: '#E53935',
//   },
//   onlineText: {
//     color: '#43A047',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     padding: 10,
//     paddingTop: 0,
//   },
//   mapButton: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: '#555',
//     padding: 12,
//     borderRadius: 6,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   mapButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 5,
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     padding: 12,
//     borderRadius: 6,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pickupButton: {
//     backgroundColor: '#1F818C',
//   },
//   deliverButton: {
//     backgroundColor: '#4CAF50',
//   },
//   actionButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 5,
//   },
//   paymentModal: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 100,
//   },
//   paymentModalContent: {
//     backgroundColor: 'white',
//     width: '85%',
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   modalText: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   paymentInput: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 6,
//     padding: 12,
//     marginBottom: 20,
//     fontSize: 16,
//   },
//   modalButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   cancelButton: {
//     backgroundColor: '#f44336',
//     padding: 12,
//     borderRadius: 6,
//     flex: 1,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   confirmButton: {
//     backgroundColor: '#4CAF50',
//     padding: 12,
//     borderRadius: 6,
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },

//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   vehicleInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   vehicleTextContainer: {
//     marginLeft: 10,
//   },
//   vehicleModel: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   vehiclePlate: {
//     color: 'white',
//     fontSize: 16,
//   },
//   tripScroll: {
//     maxHeight: 110,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   tripScrollContent: {
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//   },
//   tripCard: {
//     width: 160,
//     padding: 12,
//     marginRight: 10,
//     borderRadius: 8,
//     backgroundColor: '#f5f5f5',
//   },
//   selectedTripCard: {
//     backgroundColor: '#e1f5fe',
//     borderWidth: 1,
//     borderColor: '#1F818C',
//   },
//   tripTimeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   tripTime: {
//     fontSize: 14,
//     color: '#333',
//     marginLeft: 5,
//     fontWeight: 'bold',
//   },
//   tripDate: {
//     fontSize: 13,
//     color: '#555',
//     marginBottom: 8,
//   },
//   tripIdContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   tripId: {
//     fontSize: 13,
//     color: '#1F818C',
//     marginLeft: 5,
//     fontWeight: 'bold',
//   },
//   tripStatusBadge: {
//     alignSelf: 'flex-start',
//     paddingVertical: 3,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//   },
//   assignedBadge: {
//     backgroundColor: '#FFE0B2',
//   },
//   inProgressBadge: {
//     backgroundColor: '#C8E6C9',
//   },
//   tripStatusText: {
//     fontSize: 12,
//     color: '#333',
//   },
// });

