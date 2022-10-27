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
    btn_icon: {
        name: 'angle-right',
        type: Constants.Styles.ICON_STYLE_FONT_AWESOME,
        size: Constants.Styles.ICON_SIZE_SMALL,
        color: Constants.Styles.COLOR_BLACK,
    },
    btn_title: {
        fontWeight: "600",
        fontSize: 18,
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
        fontSize: Constants.Styles.FONT_SIZE_DEFAULT,
    },
    text_msg_from_server: {
        textAlign: "center",
        color: Constants.Styles.CORLOR_ERROR,
        fontSize: Constants.Styles.FONT_SIZE_MEDIUM,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        textAlign: "center"
    },
    modalView: {
        height: "50%",
        width: "90%",
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonClose: {
        display: "flex",
        paddingLeft: "80%",
        backgroundColor: "rgba(0, 0, 0, 0.0)"
    },
    textStyle: {
        color: Constants.Styles.COLOR_GHOST,
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    text_step1_title: {
        color: Constants.Styles.COLOR_BLACK,
        fontSize: 17
    },
    text_step1_description: {
        color: Constants.Styles.COLOR_GHOST
    },
    btn_step1_container: {
        backgroundColor: Constants.Styles.CORLOR_WHITE,
        margin: 10,
        borderRadius: 10,
        shadowOpacity: 0.7,

    },
    list_container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    error_info: {
        color: Constants.Styles.CORLOR_ERROR,
        marginHorizontal: 15,
        fontSize: 12
    }
})

export default styles