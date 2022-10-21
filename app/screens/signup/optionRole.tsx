//import
import React from "react"
import styles from "./style"
import Strings from "@app/commons/strings";
import ScreenName from "@app/navigation/screenName";
import { useDispatch } from "react-redux";
//component
import { Button, Icon } from "@rneui/themed";
import { Text, View, Image, ImageBackground } from "react-native";

//image
import { House, Logo } from "@app/assets/images";
import Constants from "@app/constants";

//function
import UserService from "@app/services/user.service";
const userService = new UserService();
import {
    setSignUpRole
} from "../../store/slice/user.slice";


const OptionRole = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const [roleList, setRoleList] = React.useState<any[]>([]);

    const handleGetRoleList = async () => {
        try {
            const result = await userService.handleGetRole();
            setRoleList(result.data);
        } catch (err) {
            console.log(JSON.stringify(err));
        }
    }

    React.useEffect(() => {
        handleGetRoleList();
    }, [])

    return (
        <ImageBackground source={House} resizeMode="cover" style={styles.container}>
            <View style={styles.overlay}>
                <Image
                    source={Logo}
                    resizeMode="contain"
                    style={styles.logo}
                />
                <Text style={styles.text_logo}>{Strings.Common.APP_NAME}</Text>
                <View>
                    <Text style={{ fontSize: 17, marginLeft: 10, color: Constants.Styles.CORLOR_WHITE }}>Vui lòng chọn loại tài khoản</Text>
                    {roleList.map((val: any, index: number) => {
                        return (
                            <Button
                                key={index}
                                activeOpacity={0.6}
                                buttonStyle={styles.btn_step1_container}
                                title={val.name}
                                onPress={() => {
                                    dispatch(setSignUpRole(val.id));
                                    navigation.navigate(ScreenName.SIGNUP)
                                }}
                            >
                                <View>
                                    <Icon name={val.icon} color={Constants.Styles.COLOR_CHETWODE_BLUE} size={30} />
                                    <Text style={styles.text_step1_title} >{val.name}</Text>
                                    <Text style={styles.text_step1_description}>{val.description}</Text>
                                </View>
                            </Button>
                        );
                    })}
                </View>
            </View>
        </ImageBackground >
    )
}

export default OptionRole;

