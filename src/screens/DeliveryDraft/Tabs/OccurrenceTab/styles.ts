import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  tabContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
  },
  occurrenceFormContainer: {
    flexDirection: 'column',
    padding: 5,
    gap: 10,
  },
  occurrenceKindContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  occurrenceKindOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 10,
  },
  mainFormDataContainer: {
    alignSelf: 'center',
    width: '95%',
    gap: 10,
  }
})