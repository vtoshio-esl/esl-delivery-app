import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  inputGroup: {
    width: '100%',
    flexDirection: 'column',
    gap: 5,
    margin: 0,
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    width: '100%'
  },
  labelWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  textInput: {
    elevation: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,

    fontSize: 14,
    
    padding: 10,
    width: '100%'
  },
  disabled: {
    opacity: 0.5
  }
})