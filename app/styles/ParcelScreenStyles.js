// ParcelScreenStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  // container: {
  //   flex: 1,
  //   paddingHorizontal: 5,
  //   paddingTop: 0,
  // },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
    fontSize: 16,
    paddingVertical: 8,
  },
  quickFilters: {
    marginBottom: 15,
  },
  quickFiltersContent: {
    paddingRight: 16,
    paddingLeft: 2,
  },
  quickFilterButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e8f4f5',
    marginRight: 8,
  },
  quickFilterButtonActive: {
    backgroundColor: '#1F818C',
    
  },
  quickFilterText: {
    color: 'black',
    fontWeight: '500',
  },
  quickFilterTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  filterSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 15,
  },

  dateFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  dateButtonText: {
    color: '#333',
  },

  dateSeparator: {
    marginHorizontal: 10,
    color: '#888',
    fontWeight: '500',
  },

  applyButton: {
    backgroundColor: '#1F818C',
    padding: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  resultsCount: {
    color: '#000',
    marginBottom: 10,
    fontSize: 14,
  },
  
  exportButton: {
    backgroundColor: '#4a7c8c',
    paddingVertical: 12,
    paddingHorizontal: 60,
    alignSelf:'center',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },

  exportButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  advancedToggleText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
},


  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  trackingNumber: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
  deliveredBadge: {
    backgroundColor: '#e3f7e6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveredText: {
    color: '#27ae60',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    color: '#555',
    fontSize: 15,
    flex: 1,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e9ecef',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paymentMethod: {
    color: '#1F818C',
    fontWeight: '600',
  },
  paymentAmount: {
    color: '#333',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 15,
    color: '#888',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 180, 
  },

  tabSwitcher: {
  flexDirection: 'row',
  alignSelf: 'center',
  backgroundColor: '#f5f5f5', // light gray background for the tab container
  borderRadius: 5,
  padding: 4,
  marginVertical: 10,
  width: '110%',
  justifyContent: 'center',
},

tabButton: {
  flex: 1,
  paddingVertical: 8,
  alignItems: 'center',
  borderRadius: 25,
},

tabButtonActive: {
  borderBottomWidth: 3,
  borderBottomColor: '#1F818C',
},

tabText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#718096', 
},

tabTextActive: {
  color: '#333',
  fontWeight: '600',
},
sectionTitle: {
  fontSize: 30,
  fontWeight: '700',
  color: '#333',
  marginTop: 30,
  marginLeft: 3,
  marginBottom: 6,
},

});

export default styles;
