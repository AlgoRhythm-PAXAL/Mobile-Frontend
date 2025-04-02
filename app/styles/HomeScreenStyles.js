import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingBottom: 20, // Added paddingBottom to move the header up
        paddingTop: 60, // Added paddingTop to move the header down
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',
     
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
      
    },

    scrollContainer: {
        padding: 20,
        paddingBottom: 100, // Extra padding to prevent cut-off
        backgroundColor: '#fff',
    },

    content: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },

    card: {
        backgroundColor: '#EFEFEF', 
        marginBottom: 5,
        padding: 30,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
        width: '80%', // Adjusted width to make the card smaller
        alignSelf: 'center', // Center the card horizontally
        
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
  
       
    },
    cardCount: {
        fontSize: 18,
        marginTop: 6,
        color: '#333',
        textAlign: 'center',
       
    },

    pendingParcelsContainer: {
        marginTop: 20,
        alignItems: 'center',
  
    },
    pendingParcelsText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
 
    },

    // Parcel Card
    parcelCard: {
        backgroundColor: '#FFF',
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        elevation: 10,
        width: '100%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    parcelInfoTitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        fontWeight: 'bold',
        width:140,
        
    },
    parcelRow: {
        flexDirection: 'row', // Keep title and data in the same row
        justifyContent: 'space-between', // Push title and data apart
        alignItems: 'center', // Align items vertically
        marginBottom: 5,
    },
    parcelInfo: {
        fontSize: 16,
        color: '#333',
        flex: 1, // Takes remaining space to align properly
    },

    // Buttons
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
    },
    mapButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    deliveredButton: {
        backgroundColor: '#EFEFEF',
        paddingVertical: 10,
        paddingHorizontal: 35,
        borderRadius: 5,
    },

   
    
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
       
    },
});
export default styles;
