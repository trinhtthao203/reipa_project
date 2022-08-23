import React from "react"

import styles from "./style"
import image from '@app/constants/image';
import Strings from "@app/commons/strings";
import ScreenName from "@app/navigation/screenName";

import { Text, View, Image, ImageBackground } from "react-native"
import { Button } from "@rneui/themed";
import { TextInput } from 'react-native-paper';

const SignUp = ({ navigation }: any) => {
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [fullname, setFullname] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    return (
        <ImageBackground source={image.house_image} resizeMode="cover" style={styles.container}>
            <View style={styles.overlay}>
                <Image
                    source={image.logo}
                    resizeMode="contain"
                    style={styles.logo}
                />
                <Text style={styles.text_logo}>{Strings.Common.APP_NAME}</Text>
                <TextInput
                    label={Strings.Auth.PHONENUMBER}
                    value={phoneNumber}
                    style={styles.text_input_top}
                    onChangeText={val => setPhoneNumber(val)}
                />
                <TextInput
                    value={fullname}
                    label={Strings.Auth.FULLNAME}
                    style={styles.text_input}
                    onChangeText={val => setFullname(val)}
                />
                <TextInput
                    label={Strings.Auth.PASSWORD}
                    secureTextEntry={true}
                    value={password}
                    style={styles.text_input}
                    onChangeText={val => setPassword(val)}
                />
                <TextInput
                    label={Strings.Auth.CONFIRM_PASSWORD}
                    secureTextEntry={true}
                    value={confirmPassword}
                    style={styles.text_input}
                    onChangeText={val => setConfirmPassword(val)}
                />
                <Button
                    title={Strings.Auth.SIGNUP}
                    iconRight={true}
                    icon={styles.btn_icon}
                    iconContainerStyle={styles.btn_icon_container}
                    titleStyle={styles.btn_title}
                    buttonStyle={styles.btn_style}
                    containerStyle={styles.btn_container}
                />
                <Button
                    title={Strings.Auth.ISACCOUNT}
                    type="clear"
                    titleStyle={styles.text_isaccount}
                    containerStyle={styles.text_isaccount_container}
                    onPress={() => { navigation.navigate(ScreenName.LOGIN) }}
                />
            </View>
        </ImageBackground>
    )
}

export default SignUp

