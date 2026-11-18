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
    gap: 10
  },
  recipientName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  cardHeader: {
    marginBottom: 5,
  },
  manifestItemTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  itemRecipientDataContainer: {
    flex: 1,
    width: '100%',
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pickDataContainer: { 
    flexDirection: 'row', 
    width: '100%', 
    borderTopWidth: 1, 
    padding: 5, 
    marginTop: 5, 
  },
  footerContainer: { 
    flexDirection: 'row', 
    gap: 5, 
    borderTopWidth: 1, 
    paddingTop: 15 
  },
  freightData: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  }
})