import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%'
  },
  logoContainer: {
    top: 50,
    alignItems: 'center'
  },
  logoImage: {
    height: 200,
    width: 200
  },
  formContainer: {
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    
    paddingVertical: 50,
    width: '100%',
    height: '65%',
    gap: 25,

    alignItems: 'center',
    
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    
    backgroundColor: '#F2F2F2',
  },
  tenantInfoContainer: {
    alignItems: 'center'
  },
  tenantLabel: {
    fontWeight: 'bold'
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '80%',
  },
  inputGroup: {
    gap: 15,
  }
})