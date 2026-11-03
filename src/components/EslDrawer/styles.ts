import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1
  },
  logoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25,
  },
  logoImage: {
    width: 100,
    height: 100
  },
  userDataContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 14,
    fontWeight: 'light'
  },
  userPfp: {
    width: 70,
    height: 70,
    borderRadius: '100%',

    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

    gap: 15,
    width: '90%',
    padding: 20,
    marginBottom: 20,
  },
  appDataContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  appVersionLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1.3
  },
  appVersion: {
    fontWeight: 'light',
    fontSize: 12,
  }
})