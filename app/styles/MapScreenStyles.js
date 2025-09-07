import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  exitButtonContainer: {
    position: 'absolute',
    bottom: 30, // Position the button 30px from the bottom
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  exitButton: {
    backgroundColor: 'red',
    padding: 14,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  exitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default styles;
