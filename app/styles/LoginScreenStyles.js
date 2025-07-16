// app/styles/LoginScreenStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  header: {
    height: '33%',
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
    width: '50%', 
    alignSelf: 'center', 
  },
  buttonText: {
    fontSize: 16,
    color: 'white', 
    textAlign: 'center',
  },
  lorryContainer: {
    width: '100%',
    height: 300, 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', 
    bottom: 0, 
  },
  lorryAnimation: {
    width: 600, 
    height: 300, 
  },

  logoImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default styles;
