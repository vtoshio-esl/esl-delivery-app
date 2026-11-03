import { Linking, Platform } from "react-native";

type GeolocationParams = {
    latitude: number | string;
    longitude: number | string;
    label: string;
}

export async function openMaps(params: GeolocationParams) {
    const coords = [params.latitude, params.longitude].join(',')
    const encodedLabel = encodeURIComponent(params.label);

    const url = Platform.select({
        ios: `maps:0,0?q=${encodedLabel}&ll=${coords}`,
        android: `geo:0,0?q=${coords}(${encodedLabel})`,
    })!;

    try {
        await Linking.openURL(url);
    } catch {
        await Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${coords}`
        );
    }
}   