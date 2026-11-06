import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'column',
    elevation: 3,
    width: '100%',
    padding: 10,
    marginBottom: 10,

    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 20,
  },
  manifestCardHeaderContainer: {
    marginTop: 10,
    alignSelf: 'center',
    width: '90%',
  },
  manifestTitleContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    padding: 15,
    borderWidth: 2,
    borderRadius: 15,
    width: 70,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: 'semibold',
  }, 
  mobileDatesContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 5,
    marginTop: 5,
  },
  mobileDateContainer: {
    flex: 1,
    borderRadius: 15,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  mobileDateTitleText: {
    fontWeight: 'bold'
  },
  volumesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 10,
    marginBottom: 5,
  },
  manifestDataContainer: {
    flex: 0,
    width: '33.33%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manifestItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    rowGap: 8,
  },
  progressData: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 10,
    
    marginTop: 5,
    paddingVertical: 10,
    width: '90%',
    borderTopWidth: 1,
  }
})