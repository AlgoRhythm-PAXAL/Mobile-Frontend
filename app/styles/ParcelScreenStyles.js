// ParcelScreenStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  dropdownContainer: {
    width: 50,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    position: 'absolute',
    right: 15,
    top: 40,
  },
  picker: {
    height: 60,
    width: '100%',
  },

  scrollContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3, // Shadow on Android
    shadowOpacity: 0.1, // Shadow for iOS
    shadowRadius: 5, // Shadow for iOS
    shadowOffset: { width: 0, height: 3 }, // Shadow for iOS
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardCount: {
    fontSize: 16,
    color: '#333',
  },
  parcelCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  parcelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  parcelInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  parcelInfo: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  mapButton: {
    backgroundColor: '#1F818C',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deliveredButton: {
    backgroundColor: '#EFEFEF',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pendingParcelsContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  pendingParcelsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default styles;
