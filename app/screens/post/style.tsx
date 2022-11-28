import { StyleSheet } from 'react-native'
import Constants from '@app/constants';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: Constants.Styles.CORLOR_WHITE,
    },
    box_input: {
        marginTop: 20,
        marginHorizontal: 30,
        marginBottom: 70,
    },
    label_style: {
        fontWeight: "bold",
        fontSize: 14,
        color: Constants.Styles.COLOR_BLACK,
    },
    label_dropdown_style: {
        fontWeight: "bold",
        fontSize: 12,
        color: Constants.Styles.COLOR_BLACK,
        marginTop: 10,
        marginLeft: 10
    },
    btn_step1_container: {
        margin: 10,
        borderRadius: 10,
        shadowOpacity: 0.7,
        backgroundColor: Constants.Styles.CORLOR_WHITE,
        borderColor: Constants.Styles.COLOR_CHETWODE_BLUE,
        borderWidth: 2,

    },
    btn_step1_container_delete: {
        margin: 10,
        borderRadius: 10,
        shadowOpacity: 0.7,
        backgroundColor: Constants.Styles.CORLOR_WHITE,
        borderColor: Constants.Styles.COLOR_DARKGRAY,
        borderWidth: 2,

    },
    text_step1_title: {
        color: Constants.Styles.COLOR_BLACK,
        fontSize: 17
    },
    error_info: {
        color: Constants.Styles.CORLOR_ERROR,
        marginHorizontal: 15,
        fontSize: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginHorizontal: 20,
        color: "black",
    },
    title_box: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    container_info: {
        paddingTop: 10,
        flexWrap: 'wrap',
        flexDirection: "row"
    },
    text_info_content: {
        fontSize: 17,
        color: Constants.Styles.COLOR_BLACK,
        fontWeight: "bold",
        paddingVertical: 10
    },
    text_info: {
        fontSize: 16,
    },
    text_info_detail: {
        fontSize: 16,
        padding: 5
    },
    text_info_money: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black"
    },
    box_info: {
        flexWrap: 'wrap',
        flexDirection: "row",
        width: "100%",
        marginTop: 25,
    },
    box_info_item: {
        width: "33.3%",
        padding: 10,
        borderColor: Constants.Styles.COLOR_ATHENSGRAY,
        borderWidth: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    text_description: {
        padding: 30,
    }
})

export default styles