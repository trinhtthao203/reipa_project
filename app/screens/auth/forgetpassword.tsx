//import
import React, { useState, useEffect } from "react";
import Constants from "@app/constants";
import { useDispatch, useSelector } from "react-redux";
import Strings from "@app/commons/strings";
import ScreenName from "@app/navigation/screenName";

//style
import styles from "./style";

//image
import { House, Logo } from "@app/assets/images";

//component
import { View, Image, ImageBackground, } from "react-native"
import InputCustom from "@app/components/Input";
import DialogCustom from "@app/components/Dialog";
import { Button, Text } from "@rneui/themed";

//funtion
import UserService from "@app/services/user.service";
const userService = new UserService();

interface IData {
    phonenumber?: string;
    password?: string;
    confirmPassword?: string;
    showPassword?: boolean;
    showConfirmPassword?: boolean;
}
interface IErrorUserInfo {
    error?: boolean,
    errorPhoneNumberMsg?: string,
    errorPasswordMsg?: string,
    errorConfirmPasswordMsg?: string,
}

const ForgetPassword = ({ navigation }: any) => {

    const [showDialog, setShowDialog] = useState(false);
    const [typeDialog, setTypeDialog] = useState("");
    const [contentDialog, setContentDialog] = useState("");
    const [checkPN, setCheckPN] = useState(false);


    const [userInfo, setUserInfo] = React.useState<IData>({
        phonenumber: "",
        password: "",
        confirmPassword: "",
        showPassword: false,
        showConfirmPassword: false,
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
        errorPhoneNumberMsg: "",
        errorConfirmPasswordMsg: "",
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

    const handlCheckPhoneNumber = async () => {
        let flat = true;
        if (isNull(userInfo.phonenumber)) {
            flat = true;
            updateErrorUserInfo({
                error: true,
                errorPhoneNumberMsg: Strings.Auth.PHONENUMBER_REQUIRED_MESSAGE
            })
        } else if (Constants.RegExp.PHONE_NUMBER.test(userInfo.phonenumber || "") == false) {
            flat = true;
            updateErrorUserInfo({
                error: true,
                errorPhoneNumberMsg: Strings.Auth.PHONE_NUMBER_INVALID_MESSAGE
            })
        } else {
            flat = false;
            updateErrorUserInfo({
                error: false,
                errorPhoneNumberMsg: ""
            })
        }

        if (flat !== true) {
            setShowDialog(true);
            setTypeDialog("loading");
            setContentDialog(Strings.Message.WAITTING_MESSAGE);
            try {
                const result = await userService.handleCheckPhoneNumber(userInfo.phonenumber);
                console.log(result.code)
                if (result.code != 200) {
                    setShowDialog(true);
                    setTypeDialog("warning");
                    setContentDialog(result.data.message);
                }
                if (result.code == 200) {
                    setShowDialog(true);
                    setTypeDialog("success");
                    setContentDialog("");
                    setCheckPN(true);
                    setTimeout(() => {
                        setShowDialog(false);
                        setTypeDialog("");
                        setContentDialog("");
                    }, 1400);
                }
            } catch (e) {
                setShowDialog(true);
                setTypeDialog("server");
                setContentDialog(Strings.Message.COMMON_ERROR);
                console.log("forget ", JSON.stringify(e));
            }
        }
    }
    const goLogin = () => {
        navigation.navigate(ScreenName.LOGIN);
    }
    const handleResetPassword = async () => {
        let flat = true;
        if (isNull(userInfo.password)) {
            flat = true;
            updateErrorUserInfo({
                error: true,
                errorPasswordMsg: Strings.Auth.NEW_PASSWORD_REQUIRED_MESSAGE
            })
        } else if (userInfo.password !== undefined && userInfo.password.length < 8) {
            flat = true;
            updateErrorUserInfo({
                error: true,
                errorPasswordMsg: Strings.Auth.PASSWORD_LENGTH_MESSAGE
            })
        }
        else {
            flat = false;
            updateErrorUserInfo({
                error: false,
                errorPasswordMsg: ""
            })
        }

        if (isNull(userInfo.confirmPassword)) {
            flat = true;
            updateErrorUserInfo({
                error: true,
                errorConfirmPasswordMsg: Strings.Auth.CONFIRM_PASSWORD_REQUIRED_MESSAGE
            })
        } else if (userInfo.password != userInfo.confirmPassword) {
            flat = true;
            updateErrorUserInfo({
                error: true,
                errorConfirmPasswordMsg: Strings.Auth.CONFIRM_PASSWORD_INCORRECTED_MESSAGE
            })
        }
        else {
            flat = false;
            updateErrorUserInfo({
                error: false,
                errorConfirmPasswordMsg: ""
            })
        }

        if (flat != true) {
            setShowDialog(true);
            setTypeDialog("loading");
            setContentDialog(Strings.Message.WAITTING_MESSAGE);
            try {
                const result = await userService.handleResetPassword(userInfo.phonenumber, userInfo.password);
                if (result.code != 200) {
                    setShowDialog(true);
                    setTypeDialog("warning");
                    setContentDialog(result.data.message);
                }
                if (result.code == 200) {
                    setShowDialog(true);
                    setTypeDialog("success");
                    setContentDialog("");
                    setTimeout(() => {
                        setShowDialog(false);
                        setTypeDialog("");
                        setContentDialog("");
                    }, 1400)
                    goLogin();
                }
            } catch (e) {
                setShowDialog(true);
                setTypeDialog("server");
                setContentDialog(Strings.Message.COMMON_ERROR);
                console.log("forget ", JSON.stringify(e));
            }
        }

    }

    return (
        <ImageBackground source={House} resizeMode="cover" style={styles.container}>
            <View style={styles.overlay}>
                <Image
                    source={Logo}
                    resizeMode="contain"
                    style={styles.logo}
                />
                <Text style={styles.text_logo}>{Strings.Common.APP_NAME}</Text>
                <View style={{ display: "flex", alignItems: "center", margin: 10 }}>
                    <Text style={{ color: Constants.Styles.CORLOR_WHITE, fontSize: 17 }}>Nhập số điện thoại để lấy lại mật khẩu</Text>
                </View>
                <InputCustom
                    secure={false}
                    editable={!checkPN}
                    radiusType={"top"}
                    keyboardType='numeric'
                    value={userInfo.phonenumber}
                    label={Strings.Auth.PHONENUMBER}
                    placeholder={Strings.Auth.PHONENUMBER}
                    errorMessage={errorUserInfo.errorPhoneNumberMsg}
                    secureTextEntry={userInfo.showPassword ? false : true}
                    onChangeText={(val: any) => { updateUserInfo({ phonenumber: val }) }}
                />
                {userInfo && checkPN &&
                    <View>
                        <InputCustom
                            secure={true}
                            value={userInfo.password}
                            label={Strings.Auth.NEW_PASSWORD}
                            placeholder={Strings.Auth.NEW_PASSWORD}
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
                            title={Strings.Common.CONFIRM}
                            iconRight={true}
                            icon={styles.btn_icon}
                            titleStyle={styles.btn_title}
                            buttonStyle={styles.btn_style}
                            containerStyle={styles.btn_container}
                            onPress={() => { handleResetPassword() }}
                        />
                    </View>
                }
                {!checkPN && <Button
                    title={Strings.Common.CONFIRM}
                    iconRight={true}
                    icon={styles.btn_icon}
                    titleStyle={styles.btn_title}
                    buttonStyle={styles.btn_style}
                    containerStyle={styles.btn_container}
                    onPress={() => { handlCheckPhoneNumber() }}
                />}
            </View>
            <DialogCustom
                show={showDialog}
                type={typeDialog}
                content={contentDialog}
                onPressIn={() => setShowDialog(false)}
            />
        </ImageBackground>
    )
}

export default ForgetPassword