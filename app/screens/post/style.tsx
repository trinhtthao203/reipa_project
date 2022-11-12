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
    text_step1_title: {
        color: Constants.Styles.COLOR_BLACK,
        fontSize: 17
    },
    error_info: {
        color: Constants.Styles.CORLOR_ERROR,
        marginHorizontal: 15,
        fontSize: 12,
    },
})

export default styles