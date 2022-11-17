//import
import React, { useState, useEffect } from "react";
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
import Constants from "@app/constants";

//function
import postService from "@app/services/post.service";
import { post } from "@app/services/apiProcessor";
const PostService = new postService();

const SelectTypeofPost = ({ route, navigation }: any) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    const { userInfo } = useSelector(
        (state: RootState) => state.user
    );
    const [typePostData, setTypePostData] = React.useState([]);
    const handleGetTypePostList = async () => {
        try {
            const result = await PostService.handleGetTypeofPost();
            setTypePostData(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleGetTypePostList();
    })
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
                    {typePostData.length > 0 && typePostData.map((type: any, ind: any) => (
                        <Button
                            key={type.id}
                            activeOpacity={0.6}
                            buttonStyle={styles.btn_step1_container}
                            onPress={() => {
                                navigation.navigate(ScreenName.ADDPOST, {
                                    typeof_post: type.id
                                })
                            }}
                        >
                            <View>
                                <Text style={styles.text_step1_title} >{type.name}</Text>
                            </View>
                        </Button>
                    ))}
                </View >
            </View >
        )
}

export default SelectTypeofPost;

