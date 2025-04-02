import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 60,
        paddingTop: 100,
        paddingHorizontal: 40,
        backgroundColor: '#f8f8f8',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 20,
    },
    userInfo: {
        justifyContent: 'center',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 16,
        color: '#888',
    },
    formContainer: {
        marginTop: 0,
        paddingHorizontal: 40,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    saveButtonContainer: {
      
        paddingVertical: 14,
        paddingHorizontal: 0,
        paddingBottom: 15,
        borderRadius: 15,
        backgroundColor: '#1F818C',
        alignItems: 'center',
        width: 150, // Set a fixed width for the button
        alignSelf: 'center', // Center the button horizontally
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;
