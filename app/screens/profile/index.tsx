import React from "react"
import styles from "./style"
import ScreenName from "@app/navigation/screenName";
import HeaderComp from "@app/components/HeaderComp";

import { Text, View, Button } from "react-native"

const Profile = ({ navigation, route }: any) => {
    const goLogInScreen = () => {
        navigation.navigate(ScreenName.LOGIN)
    }

    const goProfile = () => {
        navigation.navigate(ScreenName.PROFILE)
    }
    return (
        <View style={styles.container}>
            <HeaderComp text="Home" height={17} />
            <Button onPress={goLogInScreen} title="Đăng nhập" />
        </View>
    )
}

export default Profile

