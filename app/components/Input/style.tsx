import { StyleSheet } from "react-native";
import Constants from "@app/constants";

const styles = StyleSheet.create({
    text_input_top: {
        marginHorizontal: Constants.Styles.HORIZONTAL_SPACE_SIZE_LARGE,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: Constants.Styles.CORLOR_WHITE,
        width: "85%",
        paddingTop: 10,
    },
    text_input_full: {
        marginHorizontal: Constants.Styles.HORIZONTAL_SPACE_SIZE_LARGE,
        borderRadius: 10,
        backgroundColor: Constants.Styles.CORLOR_WHITE,
        width: "85%",
        paddingTop: 10,
    },
    text_input: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        marginHorizontal: Constants.Styles.HORIZONTAL_SPACE_SIZE_LARGE,
        backgroundColor: Constants.Styles.CORLOR_WHITE,
        width: "85%"
    },
})

export default styles