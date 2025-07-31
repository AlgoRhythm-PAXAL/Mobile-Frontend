// ParcelScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  RefreshControl,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
  Alert,
  ScrollView,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../../config';
import Footer from '../components/Footer';
import { DriverContext } from '../context/DriverContext';
import styles from '../styles/ParcelScreenStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const ParcelScreen = ({ navigation }) => {
  const { driverDetails } = useContext(DriverContext);

  const [completedParcels, setCompletedParcels] = useState([]);
  const [completedPickups, setCompletedPickups] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [appliedStartDate, setAppliedStartDate] = useState(null);
  const [appliedEndDate, setAppliedEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [activeTab, setActiveTab] = useState('pickups'); // 'deliveries' or 'pickups'

  const fetchCompletedParcels = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/mobile/driver/${driverDetails._id}/completed-deliveries`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCompletedParcels(response.data.data);
        if (activeTab === 'deliveries') setFilteredParcels(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching completed parcels:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCompletedPickups = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/mobile/driver/${driverDetails._id}/completed-pickups`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCompletedPickups(response.data.data);
        if (activeTab === 'pickups') setFilteredParcels(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching completed pickups:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCompletedParcels();
    fetchCompletedPickups();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const sourceData =
      tab === 'deliveries' ? completedParcels : completedPickups;
    setFilteredParcels(sourceData);
  };

  const applySearchPaymentFilter = () => {
    const query = searchQuery.toLowerCase();
    const baseData =
      activeTab === 'pickups' ? completedPickups : completedParcels;

    if (
      query === '' &&
      paymentFilter === 'All' &&
      !appliedStartDate &&
      !appliedEndDate
    ) {
      setFilteredParcels(baseData);
      return;
    }

    let results = baseData.filter((parcel) => {
      const matchesQuery =
        parcel.parcelId?.toLowerCase().includes(query) ||
        parcel.customerName?.toLowerCase().includes(query);

      const matchesPayment =
        paymentFilter === 'All' || parcel.payment.method === paymentFilter;

      return matchesQuery && matchesPayment;
    });

    if (appliedStartDate || appliedEndDate) {
      results = results.filter((parcel) => {
        const deliveredDate = new Date(
          activeTab === 'deliveries' ? parcel.deliveredAt : parcel.pickedUpAt
        );
        let matchesStart = true;
        let matchesEnd = true;
        if (appliedStartDate) {
          const start = new Date(
            appliedStartDate.getFullYear(),
            appliedStartDate.getMonth(),
            appliedStartDate.getDate()
          );
          const delivered = new Date(
            deliveredDate.getFullYear(),
            deliveredDate.getMonth(),
            deliveredDate.getDate()
          );
          matchesStart = delivered >= start;
        }
        if (appliedEndDate) {
          const end = new Date(
            appliedEndDate.getFullYear(),
            appliedEndDate.getMonth(),
            appliedEndDate.getDate(),
            23,
            59,
            59,
            999
          );
          const delivered = new Date(
            deliveredDate.getFullYear(),
            deliveredDate.getMonth(),
            deliveredDate.getDate(),
            deliveredDate.getHours(),
            deliveredDate.getMinutes(),
            deliveredDate.getSeconds(),
            deliveredDate.getMilliseconds()
          );
          matchesEnd = delivered <= end;
        }
        return matchesStart && matchesEnd;
      });
    }

    setFilteredParcels(results);
  };

  // Run filter when appliedStartDate or appliedEndDate changes
  useEffect(() => {
    applySearchPaymentFilter();
  }, [appliedStartDate, appliedEndDate]);

  useEffect(() => {
    applySearchPaymentFilter();
  }, [
    searchQuery,
    paymentFilter,
    completedParcels,
    completedPickups,
    activeTab,
  ]);

  useEffect(() => {
    if (driverDetails?._id) {
      fetchCompletedParcels();
      fetchCompletedPickups();
    }
  }, [driverDetails]);

  const onStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Card Header: show Parcel ID */}
      <View style={styles.cardHeader}>
        <Text style={styles.parcelId}>{item.parcelId}</Text>
        <View style={styles.deliveredBadge}>
          <Text style={styles.deliveredText}>
            {activeTab === 'deliveries' ? 'DELIVERED' : 'PICKED UP'}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        {/* Tracking Number inside card body */}
        <View style={styles.infoRow}>
          <MaterialIcons name="confirmation-number" size={18} color="#1F818C" />
          <Text style={styles.infoText}>{item.trackingNo}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={18} color="#1F818C" />
          <Text style={styles.infoText}>{item.customerName}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="place" size={18} color="#1F818C" />
          <Text style={styles.infoText}>{item.address}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="phone" size={18} color="#1F818C" />
          <Text style={[styles.infoText, { flex: 1 }]}>{item.phone}</Text>
          <TouchableOpacity
            onPress={() => {
              if (item.phone) {
                Linking.openURL(`tel:${item.phone}`);
              }
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ paddingLeft: 10 }}
          >
            <MaterialIcons name="call" size={22} color="#1F818C" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={18} color="#1F818C" />
          <Text style={styles.infoText}>
            {new Date(
              activeTab === 'deliveries' ? item.deliveredAt : item.pickedUpAt
            ).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.paymentRow}>
        <Text style={styles.paymentMethod}>{item.payment.method}</Text>
        <Text style={styles.paymentAmount}>Rs. {item.payment.amount}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1F818C" />
      </View>
    );
  }

  const generateCSV = (data) => {
    const header = [
      'parcelId',
      'TrackingNo',
      'CustomerName',
      'Address',
      'Phone',
      'DeliveredAt',
      'PaymentMethod',
      'Amount',
    ];
    const rows = data.map((p) => [
      p.parcelId,
      p.trackingNo,
      p.customerName,
      p.address,
      p.phone,
      new Date(p.deliveredAt).toLocaleString(),
      p.payment.method,
      p.payment.amount,
    ]);
    const csvString = [header, ...rows].map((e) => e.join(',')).join('\n');
    return csvString;
  };

  const exportCSV = async () => {
    if (filteredParcels.length === 0) {
      Alert.alert('No Data', 'There are no parcels to export.');
      return;
    }
    const csv = generateCSV(filteredParcels);
    const fileName = `${FileSystem.documentDirectory}parcels_${Date.now()}.csv`;

    try {
      await FileSystem.writeAsStringAsync(fileName, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileName);
    } catch (error) {
      Alert.alert('Error', 'Failed to export CSV file.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainContainer}>
          <FlatList
            data={filteredParcels}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            scrollEnabled={true}
            contentContainerStyle={{ paddingBottom: 80 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#1F818C']}
              />
            }
            ListHeaderComponent={
              <>
                {/* Section Title */}
                <Text style={styles.sectionTitle}>
                  {activeTab === 'pickups'
                    ? 'Completed Pickups'
                    : 'Completed Deliveries'}
                </Text>

                {/* Tabs */}
                <View style={styles.tabSwitcher}>
                  <TouchableOpacity
                    onPress={() => handleTabChange('pickups')}
                    style={[
                      styles.tabButton,
                      activeTab === 'pickups' && styles.tabButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === 'pickups' && styles.tabTextActive,
                      ]}
                    >
                      Pickups
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleTabChange('deliveries')}
                    style={[
                      styles.tabButton,
                      activeTab === 'deliveries' && styles.tabButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === 'deliveries' && styles.tabTextActive,
                      ]}
                    >
                      Deliveries
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Search Section */}
                <View style={styles.searchContainer}>
                  <MaterialIcons
                    name="search"
                    size={20}
                    color="#888"
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search by parcel Id or customer"
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                  />
                </View>

                {/* Quick Filters */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.quickFilters}
                  contentContainerStyle={styles.quickFiltersContent}
                >
                  {['Today', 'Yesterday', 'Last 7 Days', 'All'].map((label) => (
                    <TouchableOpacity
                      key={label}
                      onPress={() => {
                        const now = new Date();
                        let start = null;
                        let end = null;
                        if (label === 'Today') {
                          start = new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            now.getDate()
                          );
                          end = new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            now.getDate(),
                            23,
                            59,
                            59,
                            999
                          );
                        } else if (label === 'Yesterday') {
                          const yest = new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            now.getDate() - 1
                          );
                          start = yest;
                          end = new Date(
                            yest.getFullYear(),
                            yest.getMonth(),
                            yest.getDate(),
                            23,
                            59,
                            59,
                            999
                          );
                        } else if (label === 'Last 7 Days') {
                          start = new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            now.getDate() - 6
                          );
                          end = new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            now.getDate(),
                            23,
                            59,
                            59,
                            999
                          );
                        }
                        setStartDate(start);
                        setEndDate(end);
                        setAppliedStartDate(start);
                        setAppliedEndDate(end);
                      }}
                      style={[
                        styles.quickFilterButton,
                        (label === 'All' && !appliedStartDate) ||
                        (label === 'Today' &&
                          appliedStartDate &&
                          appliedEndDate &&
                          appliedStartDate.toDateString() ===
                            new Date().toDateString() &&
                          appliedEndDate.toDateString() ===
                            new Date().toDateString()) ||
                        (label === 'Yesterday' &&
                          appliedStartDate &&
                          appliedEndDate &&
                          appliedStartDate.toDateString() ===
                            new Date(
                              new Date().setDate(new Date().getDate() - 1)
                            ).toDateString() &&
                          appliedEndDate.toDateString() ===
                            new Date(
                              new Date().setDate(new Date().getDate() - 1)
                            ).toDateString()) ||
                        (label === 'Last 7 Days' &&
                          appliedStartDate &&
                          appliedEndDate &&
                          appliedStartDate.toDateString() ===
                            new Date(
                              new Date().setDate(new Date().getDate() - 6)
                            ).toDateString() &&
                          appliedEndDate.toDateString() ===
                            new Date().toDateString())
                          ? styles.quickFilterButtonActive
                          : null,
                      ]}
                    >
                      <Text style={styles.quickFilterText}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Advanced Filters */}
                <TouchableOpacity
                  onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  style={styles.advancedToggle}
                >
                  <Text style={styles.advancedToggleText}>
                    {showAdvancedFilters
                      ? 'Hide Advanced Filters'
                      : 'Show Advanced Filters'}
                  </Text>
                  <MaterialIcons
                    name={showAdvancedFilters ? 'expand-less' : 'expand-more'}
                    size={20}
                    color="#1F818C"
                  />
                </TouchableOpacity>

                {showAdvancedFilters && (
                  <View style={styles.filterSection}>
                    <Picker
                      selectedValue={paymentFilter}
                      onValueChange={setPaymentFilter}
                      style={styles.picker}
                      dropdownIconColor="#1F818C"
                    >
                      <Picker.Item label="All Payment Methods" value="All" />
                      <Picker.Item label="Cash on Delivery" value="COD" />
                      <Picker.Item label="Online Payment" value="online" />
                    </Picker>

                    <View style={styles.dateFilterContainer}>
                      <TouchableOpacity
                        onPress={() => setShowStartPicker(true)}
                        style={styles.dateButton}
                      >
                        <Text style={styles.dateButtonText}>
                          {startDate
                            ? startDate.toLocaleDateString()
                            : 'Start Date'}
                        </Text>
                        <MaterialIcons
                          name="calendar-today"
                          size={18}
                          color="#1F818C"
                        />
                      </TouchableOpacity>

                      <Text style={styles.dateSeparator}>to</Text>

                      <TouchableOpacity
                        onPress={() => setShowEndPicker(true)}
                        style={styles.dateButton}
                      >
                        <Text style={styles.dateButtonText}>
                          {endDate ? endDate.toLocaleDateString() : 'End Date'}
                        </Text>
                        <MaterialIcons
                          name="calendar-today"
                          size={18}
                          color="#1F818C"
                        />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setAppliedStartDate(startDate);
                        setAppliedEndDate(endDate);
                        applySearchPaymentFilter();
                      }}
                      style={styles.applyButton}
                    >
                      <Text style={styles.applyButtonText}>Apply Filters</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Export Button */}
                <TouchableOpacity
                  onPress={exportCSV}
                  style={styles.exportButton}
                >
                  <MaterialIcons name="file-download" size={18} color="#fff" />
                  <Text style={styles.exportButtonText}>Export CSV</Text>
                </TouchableOpacity>

                {/* Results Count */}
                <Text style={styles.resultsCount}>
                  {filteredParcels.length}{' '}
                  {filteredParcels.length === 1 ? 'Parcel' : 'Parcels'} Found
                </Text>

                {/* Empty message */}
                {filteredParcels.length === 0 && (
                  <View style={styles.emptyContainer}>
                    <MaterialIcons name="inbox" size={50} color="#ccc" />
                    <Text style={styles.emptyText}>
                      {activeTab === 'pickups'
                        ? 'No pickups found'
                        : 'No deliveries found'}
                    </Text>
                  </View>
                )}
              </>
            }
          />

          <Footer navigation={navigation} driverDetails={driverDetails} />

          {/* Date Pickers */}
          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={onStartDateChange}
              maximumDate={endDate || undefined}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={onEndDateChange}
              minimumDate={startDate || undefined}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ParcelScreen;
