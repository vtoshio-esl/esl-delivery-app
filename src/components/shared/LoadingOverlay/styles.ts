import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 30,
        alignItems: 'center',
        gap: 12,
    },
    text: {
        fontWeight: 'bold',
    }
});
