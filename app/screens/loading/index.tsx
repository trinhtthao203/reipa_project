import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Constants from "@app/constants";
import Strings from "@app/commons/strings";
import HeaderComp from "@app/components/HeaderComp";
const Loading = () => (
    <View style={styles.container}>
        <HeaderComp title={Strings.Home.TITLE} height={17} />
        <View style={styles.content}>
            <ActivityIndicator size="large" color={Constants.Styles.COLOR_AMBER} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default Loading;