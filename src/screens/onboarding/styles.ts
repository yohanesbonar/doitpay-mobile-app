import { StyleSheet } from "react-native";

export const createStyles = (colors: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#FFFFFF",
        }, 
        text: {
            color: colors.textBlack,
        }
    });
}