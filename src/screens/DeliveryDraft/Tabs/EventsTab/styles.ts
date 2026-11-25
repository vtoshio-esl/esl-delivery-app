import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10, 
        gap: 10 
  },
  list: { 
      flex: 1,
  },
  event: {
      gap: 2,
      paddingLeft: 15,
      paddingVertical: 8,       
      marginBottom: 10,
      borderLeftWidth: 2,
  },
  eventTitle: { 
    fontWeight: 'bold' 
  },
});