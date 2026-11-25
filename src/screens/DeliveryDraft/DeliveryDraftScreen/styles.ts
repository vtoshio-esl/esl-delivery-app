import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 5,
  },
  dateContainer: {
    flex: 1,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    borderWidth: 1,
    borderRadius: 10,
  },
  dateTitle: {
    fontWeight: 'bold'
  },
  tabsContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10, 
  },
  tabContent: {
    width: '100%'
  }
})