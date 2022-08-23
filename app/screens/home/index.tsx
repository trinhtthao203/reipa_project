import React from "react"
import { Text, View, Button, StatusBar } from "react-native"
import styles from "./style"
import ScreenName from "@app/navigation/screenName";
import HeaderComp from "@app/components/HeaderComp";
import Constants from "@app/constants";
import Strings from "@app/commons/strings";

const Home = ({ navigation }: any) => {


    const goPostDetail = () => {
        navigation.navigate(ScreenName.POSTDETAIL)
    }

    return (
        <View style={styles.container}>
            <HeaderComp title={Strings.Home.TITLE} height={17} />
            <Button onPress={goPostDetail} title={Strings.Post.DETAIL} />
        </View>
    )
}

export default Home

