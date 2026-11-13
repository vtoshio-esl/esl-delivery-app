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
    width: '100%',
    gap: 5,
  },
  datesView: {
    width: '100%',
    gap: 5,
  },
  dateContainer: {
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
    justifyContent: 'space-between'
  },
  tabContent: {
    width: '100%'
  }
})