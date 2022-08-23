import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { Icon } from "@rneui/base";
import Constants from "@app/constants";


const HeaderComp = ({ goBack, title, height }: any) => {
    const navigation = useNavigation()
    return (
        <View
            style={{
                paddingBottom: height,
                flexDirection: "row",
                justifyContent: 'space-between',
                backgroundColor: Constants.Styles.COLOR_CHETWODE_BLUE,
            }}>
            <StatusBar backgroundColor={Constants.Styles.COLOR_CHETWODE_BLUE} />
            {!!goBack ? <TouchableOpacity
                onPress={!!goBack ? goBack : () => navigation.goBack()}
            >
                <Icon name="arrow-back" type={Constants.Styles.ICON_STYLE_FONT_IONICON} iconStyle={{ color: Constants.Styles.CORLOR_WHITE, marginBottom: 10, marginHorizontal: 10 }} />
            </TouchableOpacity> : <Text />}
            <Text
                style={{
                    color: Constants.Styles.CORLOR_WHITE,
                    fontWeight: "500",
                    textTransform: "uppercase",
                    marginHorizontal: 20,
                    fontSize: Constants.Styles.FONT_SIZE_MEDIUM
                }}
            >
                {title}
            </Text>
            <Text />
        </View>
    )
}

export default HeaderComp