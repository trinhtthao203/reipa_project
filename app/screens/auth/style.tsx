import { StyleSheet } from "react-native";
import Constants from "@app/constants";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    overlay: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        backgroundColor: "rgba(135,141,225,0.85)",
    },
    logo: {
        width: "100%",
        height: Constants.Styles.LOGO_HEIGHT,
        marginVertical: Constants.Styles.VERTICAL_SPACE_SIZE_SMALL
    },
    text_logo: {
        color: "white",
        fontSize: Constants.Styles.FONT_SIZE_LARGE,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: Constants.Styles.HORIZONTAL_SPACE_SIZE_LARGE
    },
    text_input_top: {
        height: Constants.Styles.TEXT_INPUT_HEIGHT,
        marginHorizontal: Constants.Styles.HORIZONTAL_SPACE_SIZE_LARGE,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: Constants.Styles.CORLOR_WHITE,
        width: "85%"
    },
    text_input: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        height: Constants.Styles.TEXT_INPUT_HEIGHT,
        marginHorizontal: Constants.Styles.HORIZONTAL_SPACE_SIZE_LARGE,
        backgroundColor: Constants.Styles.CORLOR_WHITE,
        width: "85%"
    },
    btn_icon: {
        name: 'angle-right',
        type: Constants.Styles.ICON_STYLE_FONT_AWESOME,
        size: Constants.Styles.ICON_SIZE_SMALL,
        color: Constants.Styles.COLOR_BLACK,
    },
    btn_icon_container: {

    },
    btn_title: {
        fontWeight: "500",
        color: Constants.Styles.COLOR_BLACK,
        textTransform: "uppercase",
        width: "90%",
        display: "flex",
        textAlign: "left"
    },
    btn_style: {
        backgroundColor: Constants.Styles.COLOR_AMBER,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        height: Constants.Styles.TEXT_INPUT_HEIGHT,
    },
    btn_container: {
        width: "85%",
        marginHorizontal: Constants.Styles.HORIZONTAL_SPACE_SIZE_LARGE,
    },
    text_isaccount: {
        textAlign: "center",
        color: Constants.Styles.CORLOR_WHITE,
        fontSize: Constants.Styles.FONT_SIZE_MEDIUM,
    },
    text_isaccount_container: {
        marginVertical: Constants.Styles.VERTICAL_SPACE_SIZE_LARGE,
    }

})

export default styles