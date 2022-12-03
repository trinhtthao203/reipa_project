//import
import React from "react"
import styles from "./style"
import Constants from "@app/constants";
import Strings from "@app/commons/strings";
import ScreenName from "@app/navigation/screenName";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
//component
import { Button, Icon, ListItem, Avatar } from "@rneui/themed";
import InputCustom from "@app/components/Input";
import DialogCustom from "@app/components/Dialog";
import { Text, View, Image, ImageBackground, ScrollView } from "react-native";

//image
import { House, Logo } from "@app/assets/images";

//function
import SelectList from "react-native-dropdown-select-list";
import UserService from "@app/services/user.service";
const userService = new UserService();

interface IData {
    phonenumber?: string;
    fullname?: string;
    password?: string;
    confirmPassword?: string;
    address?: string;
    role_id?: number;
    showPassword?: boolean;
    showConfirmPassword?: boolean;
}

interface IErrorUserInfo {
    error?: boolean,
    errorPhoneNumberMsg?: string,
    errorFullNameMsg?: string,
    errorAddressMsg?: string,
    errorRoleMsg?: string,
    errorPasswordMsg?: string,
    errorConfirmPasswordMsg?: string,
}

const SignUp = ({ navigation }: any) => {
    const dispatch = useDispatch();

    const [showDialog, setShowDialog] = React.useState(false);
    const [typeDialog, setTypeDialog] = React.useState("");
    const [contentDialog, setContentDialog] = React.useState("");

    const [userInfo, setUserInfo] = React.useState<IData>({
        role_id: 2,
        showPassword: false,
        showConfirmPassword: false
    });

    const updateUserInfo = (newState: IData) => {
        setUserInfo((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const [errorUserInfo, setErrorUserInfo] = React.useState<IErrorUserInfo>({
        error: false,
        errorPasswordMsg: "",
        errorConfirmPasswordMsg: "",
        errorPhoneNumberMsg: "",
    });

    const updateErrorUserInfo = (newState: IErrorUserInfo) => {
        setErrorUserInfo((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const isNull = (val: any) => {
        if (val === null || val === undefined || val === "")
            return true;
        else
            return false;
    }

    const handleSignUp = async () => {
        let flatFN, flatAD, flatPW, flatPN = true;

        if (isNull(userInfo.phonenumber)) {
            flatPN = true;
            updateErrorUserInfo({
                error: true,
                errorPhoneNumberMsg: Strings.Auth.PHONENUMBER_REQUIRED_MESSAGE
            })
        } else if (Constants.RegExp.PHONE_NUMBER.test(userInfo.phonenumber || "") == false) {
            flatPN = true;
            updateErrorUserInfo({
                error: true,
                errorPhoneNumberMsg: Strings.Auth.PHONE_NUMBER_INVALID_MESSAGE
            })
        } else {
            flatPN = false;
            updateErrorUserInfo({
                error: false,
                errorPhoneNumberMsg: ""
            })
        }

        if (isNull(userInfo.fullname)) {
            flatFN = true;
            updateErrorUserInfo({
                error: true,
                errorFullNameMsg: Strings.Auth.FULLNAME_REQUIRED
            })
        } else {
            flatFN = false;
            updateErrorUserInfo({
                error: false,
                errorFullNameMsg: ""
            })
        }

        if (isNull(userInfo.address)) {
            flatAD = true;
            updateErrorUserInfo({
                error: true,
                errorAddressMsg: Strings.Message.ADDRESS_REQUIRED_MESSAGE
            })
        } else {
            flatAD = false;
            updateErrorUserInfo({
                error: false,
                errorAddressMsg: ""
            })
        }

        if (isNull(userInfo.password)) {
            flatPW = true;
            updateErrorUserInfo({
                error: true,
                errorPasswordMsg: Strings.Auth.PASSWORD_REQUIRED_MESSAGE
            })
        } else if (userInfo.password && userInfo.password?.length < 8) {
            flatPW = true;
            updateErrorUserInfo({
                error: true,
                errorPasswordMsg: Strings.Auth.PASSWORD_LENGTH_MESSAGE
            })
        }
        else {
            flatPW = false;
            updateErrorUserInfo({
                error: false,
                errorPasswordMsg: ""
            })
        }

        if (isNull(userInfo.confirmPassword)) {
            flatPW = true;
            updateErrorUserInfo({
                error: true,
                errorConfirmPasswordMsg: Strings.Auth.CONFIRM_PASSWORD_REQUIRED_MESSAGE
            })
        } else if (userInfo.confirmPassword !== userInfo.password) {
            flatPW = true;
            updateErrorUserInfo({
                error: true,
                errorConfirmPasswordMsg: Strings.Auth.CONFIRM_PASSWORD_INCORRECTED_MESSAGE
            })
        } else {
            flatPW = false;
            updateErrorUserInfo({
                error: false,
                errorConfirmPasswordMsg: ""
            })
        }

        if (flatPW == false && flatPN == false && flatFN == false && flatAD == false && errorUserInfo.error == false) {
            setShowDialog(true);
            setTypeDialog(Strings.System.LOADNING);
            setContentDialog(Strings.Message.WAITTING_MESSAGE);
            try {
                const result = await userService.handleRegister(userInfo.phonenumber, userInfo.password, userInfo.fullname, userInfo.address, userInfo.role_id,);
                if (result.code !== 200) {
                    setShowDialog(true);
                    setTypeDialog(Strings.System.WARNING);
                    setContentDialog(result.data.message);
                }
                if (result.data) {
                    setShowDialog(true);
                    setTypeDialog("success");
                    setContentDialog(Strings.Message.REGISTER_SUCCESS_MESSAGE);
                    setTimeout(() => {
                        setShowDialog(false);
                        setTypeDialog("");
                        setContentDialog("");
                        navigation.navigate(ScreenName.LOGIN)
                    }, 1500);
                }
            } catch (e) {
                setShowDialog(true);
                setTypeDialog("server");
                setContentDialog(Strings.Message.COMMON_ERROR);
                console.log("register ", JSON.stringify(e));
            }
        }
    }

    return (
        <ImageBackground source={House} resizeMode="cover" style={styles.container}>
            <View style={styles.overlay}>
                <ScrollView>
                    <Image
                        source={Logo}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                    <Text style={styles.text_logo}>{Strings.Common.APP_NAME}</Text>
                    <InputCustom
                        secure={false}
                        radiusType={"top"}
                        keyboardType='numeric'
                        value={userInfo.phonenumber}
                        label={Strings.Auth.PHONENUMBER}
                        placeholder={Strings.Auth.PHONENUMBER}
                        errorMessage={errorUserInfo.errorPhoneNumberMsg}
                        secureTextEntry={userInfo.showPassword ? false : true}
                        onChangeText={(val: any) => {
                            updateUserInfo({ phonenumber: val });
                        }}
                    />
                    <InputCustom
                        secure={false}
                        value={userInfo.fullname}
                        label={Strings.Auth.FULLNAME}
                        placeholder={Strings.Auth.FULLNAME}
                        errorMessage={errorUserInfo.errorFullNameMsg}
                        onChangeText={(val: any) => { updateUserInfo({ fullname: val }) }}
                    />
                    <InputCustom
                        secure={false}
                        value={userInfo.address}
                        label={Strings.Auth.ADDRESS}
                        placeholder={Strings.Auth.ADDRESS}
                        errorMessage={errorUserInfo.errorAddressMsg}
                        onChangeText={(val: any) => { updateUserInfo({ address: val }) }}
                    />
                    <InputCustom
                        secure={true}
                        value={userInfo.password}
                        label={Strings.Auth.PASSWORD}
                        placeholder={Strings.Auth.PASSWORD}
                        errorMessage={errorUserInfo.errorPasswordMsg}
                        secureTextEntry={userInfo.showPassword ? false : true}
                        onChangeText={(val: any) => { updateUserInfo({ password: val }) }}
                    />
                    <InputCustom
                        secure={true}
                        value={userInfo.confirmPassword}
                        label={Strings.Auth.CONFIRM_PASSWORD}
                        placeholder={Strings.Auth.CONFIRM_PASSWORD}
                        errorMessage={errorUserInfo.errorConfirmPasswordMsg}
                        secureTextEntry={userInfo.showConfirmPassword ? false : true}
                        onChangeText={(val: any) => { updateUserInfo({ confirmPassword: val }) }}
                    />
                    <Button
                        title={Strings.Auth.SIGNUP}
                        iconRight={true}
                        icon={styles.btn_icon}
                        titleStyle={styles.btn_title}
                        buttonStyle={styles.btn_style}
                        containerStyle={styles.btn_container}
                        onPress={() => handleSignUp()}
                    />
                    <Button
                        title={Strings.Auth.ISACCOUNT}
                        type="clear"
                        titleStyle={styles.text_isaccount}
                        onPress={() => { navigation.navigate(ScreenName.LOGIN) }}
                    />
                </ScrollView>
                <DialogCustom
                    show={showDialog}
                    type={typeDialog}
                    content={contentDialog}
                    onPressIn={() => setShowDialog(false)}
                />
            </View >
        </ImageBackground >
    )
}

export default SignUp

