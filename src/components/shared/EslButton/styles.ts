import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        padding: 10,
        borderRadius: 10,
    },
    titleTextContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontWeight: 'bold',
        letterSpacing: 1.3,
    },
    withIconContainer: {
        flexDirection: 'row',
        gap: 10
    },
    disabled: { 
        opacity: 0.5 
    }
});