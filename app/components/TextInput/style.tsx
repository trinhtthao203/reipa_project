import { StyleSheet } from "react-native";
import Constants from "@app/constants";

const styles = StyleSheet.create({
    text_container: {
        width: "100%",
        paddingHorizontal: 0
    },
    label_style: {
        fontWeight: "bold",
        fontSize: 14,
        color: Constants.Styles.COLOR_BLACK,
    },
    input_container: {
        backgroundColor: Constants.Styles.COLOR_ATHENSGRAY,
        borderRadius: 5,
        borderBottomWidth: 0,
        paddingLeft: 10
    },
    input_style: {
        fontSize: 16
    }
})

export default styles