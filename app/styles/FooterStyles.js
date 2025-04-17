import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#1F818C', // Same as header
        paddingVertical: 3,
        paddingBottom: 2, // Added paddingBottom to move the footer up
    },
    footerButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#fff',
    },
    activeFooterButton: {
        borderRadius: 100, // This creates a border under the active button
        backgroundColor: '#fff',  // White color for the active button
        padding:8,
        opacity: 0.4, 
      },
});

export default styles;
