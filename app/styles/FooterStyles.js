import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#1F818C',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  activeFooterButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeIcon: {
    color: '#fff', // Or any highlight color you prefer
  },
  activeText: {
    fontWeight: 'bold',
  },
});

export default styles;
