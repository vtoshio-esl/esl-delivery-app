import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  confirmationTabContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    gap: 10,
  },
  confirmationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  confirmationBodyContainer: {
    flex: 1,
    gap: 15,
    paddingHorizontal: 5,
  },
  validationWarningText: {
    fontSize: 12,
  },
  confirmationFooter: {
    gap: 5,
    marginBottom: 10,
  }
})