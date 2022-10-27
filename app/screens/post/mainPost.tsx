//import
import React from "react"
import styles from "./style"
import Strings from "@app/commons/strings";
import ScreenName from "@app/navigation/screenName";
import { RootState } from "@app/store";
import HeaderComp from '@app/components/HeaderComp'

//component
import { Button, Icon } from "@rneui/themed";
import { Text, View, Image, ImageBackground } from "react-native";
import { useDispatch, useSelector } from "react-redux";

//image
import { House, Logo } from "@app/assets/images";
import Constants from "@app/constants";

//function

const MainPost = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(
        (state: RootState) => state.user
    );
    React.useEffect(() => {

    }, [])

    if (!userInfo.id) {
        return (
            <View style={{ flex: 1 }}>
                <HeaderComp title={Strings.Post.TITLE} height={17} />
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                    <Button
                        title="Đăng nhập"
                        onPress={() => {
                            navigation.navigate(ScreenName.LOGIN)
                        }}
                        type="outline"
                    />
                    <Text style={{ color: Constants.Styles.COLOR_BLACK }}>Vui lòng đăng nhập để tiếp tục</Text>
                </View>
            </View>
        )
    } else
        return (
            <View style={{ flex: 1 }}>
                <HeaderComp title={Strings.Post.TITLE} height={17} />
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View>
                        <Button
                            activeOpacity={0.6}
                            buttonStyle={styles.btn_step1_container}
                            onPress={() => {
                                navigation.navigate(ScreenName.ADDPOST)
                            }}
                        >
                            <View>
                                <Icon type={Constants.Styles.ICON_STYLE_FONT_IONICON} name="receipt-outline" color={Constants.Styles.COLOR_CHETWODE_BLUE} size={30} />
                                <Text style={styles.text_step1_title} >Tạo bài đăng mới</Text>
                            </View>
                        </Button>
                        <Button
                            activeOpacity={0.6}
                            buttonStyle={styles.btn_step1_container}
                            onPress={() => {
                                navigation.navigate(ScreenName.ADDPLANNINGAREA)
                            }}
                        >
                            <View>
                                <Icon type={Constants.Styles.ICON_STYLE_FONT_IONICON} name="layers-outline" color={Constants.Styles.COLOR_CHETWODE_BLUE} size={30} />
                                <Text style={styles.text_step1_title} >Tạo vùng quy hoạch mới</Text>
                            </View>
                        </Button>
                    </View>
                </View >
            </View >
        )
}

export default MainPost;

