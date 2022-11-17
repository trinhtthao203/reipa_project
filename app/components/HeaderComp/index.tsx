import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { Icon } from "@rneui/base";
import Constants from "@app/constants";

const HeaderComp = ({ goBack, title, height, refresh, func, isDetail }: any) => {
    const navigation = useNavigation()
    return (
        <View
            style={{
                paddingBottom: height,
                flexDirection: "row",
                justifyContent: 'space-between',
                backgroundColor: isDetail ? Constants.Styles.CORLOR_WHITE : Constants.Styles.COLOR_CHETWODE_BLUE,
            }}>
            <StatusBar backgroundColor={Constants.Styles.COLOR_CHETWODE_BLUE} />
            {!!goBack ? <TouchableOpacity
                onPress={!!goBack ? goBack : () => navigation.goBack()}
            >
                <Icon name="arrow-back" type={Constants.Styles.ICON_STYLE_FONT_IONICON} iconStyle={{ color: isDetail ? Constants.Styles.COLOR_CHETWODE_BLUE : Constants.Styles.CORLOR_WHITE, marginTop: 20, marginBottom: 5 }} />
            </TouchableOpacity> : <Text />}
            <Text
                style={{
                    color: isDetail ? Constants.Styles.COLOR_CHETWODE_BLUE : Constants.Styles.CORLOR_WHITE,
                    fontWeight: "500",
                    textTransform: "uppercase",
                    marginTop: 20,
                    marginHorizontal: 20,
                    fontSize: 16
                }}
            >
                {title}
            </Text>
            {!!refresh ? <TouchableOpacity
                onPress={func}
            >
                <Icon name="refresh" type={Constants.Styles.ICON_STYLE_FONT_IONICON} iconStyle={{ color: Constants.Styles.CORLOR_WHITE, marginTop: 20, marginBottom: 5 }} />
            </TouchableOpacity> : <Text />}
        </View>
    )
}

export default HeaderComp