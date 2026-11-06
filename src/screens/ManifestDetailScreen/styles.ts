import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  loadingText: {
    fontSize: 22,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    width: '50%',
    textAlign: 'center',
  },
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: 10,
  },
  serviceInformationContainer: {
    marginBottom: 10,
  },
  datesContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    gap: 10, 
    marginBottom: 10
  },
  datesCardContainer: { 
    flex: 1, 
    alignItems: 'center', 
    padding: 5, 
    borderRadius: 10 
  },
  topDataContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  manifestDataContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  searchBar: {
    width: '95%',
    alignSelf: 'center',
    marginVertical: 5,
  }
});