import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    elevation: 3,
    marginVertical: 7,
    
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  recipientDataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipientName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  footerContainer: { 
    flexDirection: 'row', 
    gap: 5, 
    borderTopWidth: 1, 
    paddingTop: 10
  },
  freightData: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  warningsSectionContainer: {
    flexDirection: 'column',
    gap: 5,
    borderTopWidth: 1,
    paddingTop: 3,
  },
  warning: { 
    marginVertical: 5, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 5 
  },
})