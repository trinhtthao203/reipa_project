import React, { useEffect, useState } from "react"
import styles from "./style"
import { View, Button } from "react-native"
import HeaderComp from "@app/components/HeaderComp";
import ScreenName from "@app/navigation/screenName";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "@app/store";

//interface
import { IUserInfo } from "../../commons/interfaces";

import {
    storeUserInfo
} from "../../store/slice/user.slice";

const Profile = ({ navigation }: any) => {
    const dispatch = useDispatch();

    const { userInfo } = useSelector(
        (state: RootState) => state.user
    );
    const [pnStorage, setPnStorage] = useState();
    const [pwStorage, setPwStorage] = useState();
    AsyncStorage.getItem("phonenumber").then((val: any) => {
        setPnStorage(val);
    })

    AsyncStorage.getItem("password").then((val: any) => {
        setPwStorage(val);
    })

    const handleLogOut = async () => {
        dispatch(storeUserInfo({
            id: "",
            phonenumber: "",
            fullname: "",
            avatar: "",
            street_id: "",
            ward_id: "",
            role_id: ""
        }))
        navigation.navigate(ScreenName.HOME)
    }

    return (
        <View style={styles.container}>
            <HeaderComp text="Home" height={17} />
            <Button onPress={handleLogOut} title="Đăng xuất" />
        </View>
    )
}

export default Profile

