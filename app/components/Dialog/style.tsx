import { StyleSheet } from "react-native";
import Constants from "@app/constants";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "90%"
    },
    text_content: {
        color: Constants.Styles.CORLOR_ERROR,
        fontWeight: 'bold',
    },
    img_style: {
        height: 150,
        width: 150
    }
})

export default styles