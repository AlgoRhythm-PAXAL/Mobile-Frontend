// app/styles/LoginScreenStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
     justifyContent: 'flex-start',
  },
  header: {
    height: '33%', // Top 1/3 of the screen
    backgroundColor: '#1F818C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    color: 'white',
  },
  welcomeText: {
    fontSize: 20,
    color: 'black',
    marginTop: 10,
    textAlign: 'center',

  },
  form: {
    flex: 1,
    padding: 20,
       marginBottom: 100, 
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 40,
    marginBottom: 15,
    paddingLeft: 20,
    
  },
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  animationText: {
    fontSize: 18,
    color: 'blue',
  },
  button: {
    
    backgroundColor: '#1F818C',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '50%',  // Adjust the width for a smaller button
    alignSelf: 'center',  // Center the button horizontally
  },
  buttonText: {
    fontSize: 16,
    color: 'white',  // Default text color for the button
    textAlign: 'center',
  },
  lorryContainer: {
    width: '100%',
    height: 300,  // Adjust height to control the size of the animation
    justifyContent: 'center',
    alignItems: 'center',
   position: 'absolute',  // Position it at the bottom of the screen
    bottom: 0,  // Make sure it stays at the bottom
  },
  lorryAnimation: {
    width: 600,  // Adjust width to control the size of the animation
    height: 300, // Adjust height accordingly
  },

  logoImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default styles;
