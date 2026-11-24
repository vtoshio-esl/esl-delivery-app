import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  imagesTabContainer: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    gap: 10
  },
  imageSectionContainer: {
    gap: 5,
    padding: 20,
    elevation: 3,
    borderRadius: 15,
  },
  photoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  imageSize: {
    height: 150,
    width: '100%',
    borderRadius: 10,
  },
  noImageContainer: {
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,

    padding: 20,
    borderRadius: 10,
  },
  noImageText: {
    fontSize: 16,
    textAlign: 'center'
  },
  buttonGroupContainer: {
    flexDirection: 'row',
    gap: 5
  },
  unloadingRecipientsContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 10,
  },
  unloadingRecipientsText: { 
    width: '80%', 
    textAlign: 'center',
    fontSize: 16,
  }
});