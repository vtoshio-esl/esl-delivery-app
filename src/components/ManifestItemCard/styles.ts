import { disabled } from "@expo/ui/swift-ui/modifiers";
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
    flex: 1, 
    flexDirection: 'row', 
    gap: 10
  },
  recipientName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  pickDataContainer: { 
    flex: 1, 
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