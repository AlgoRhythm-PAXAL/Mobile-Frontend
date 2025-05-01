import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from '../styles/ParcelCardStyles'; // Import styles

const ParcelCard = ({
  parcelId,
  trackingNo,
  receiverName,
  receiverAddress,
}) => {
  return (
    <View style={styles.parcelCard}>
      {/* Parcel Information */}
      <View style={styles.parcelRow}>
        <Text style={styles.parcelInfoTitle}>Parcel ID:</Text>
        <Text style={styles.parcelInfo}>{parcelId}</Text>
      </View>
      <View style={styles.parcelRow}>
        <Text style={styles.parcelInfoTitle}>Receiver Name:</Text>
        <Text style={styles.parcelInfo}>{receiverName}</Text>
      </View>
      <View style={styles.parcelRow}>
        <Text style={styles.parcelInfoTitle}>Tracking No:</Text>
        <Text style={styles.parcelInfo}>{trackingNo}</Text>
      </View>
      <View style={styles.parcelRow}>
        <Text style={styles.parcelInfoTitle}>Receiver Address:</Text>
        <Text style={styles.parcelInfo}>{receiverAddress}</Text>
      </View>
    </View>
  );
};

export default ParcelCard;
