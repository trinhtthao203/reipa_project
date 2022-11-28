//import
import React, { useState, useEffect } from "react";
import Strings from "@app/commons/strings";
import ScreenName from "@app/navigation/screenName";
import { RootState } from "@app/store";
import HeaderComp from '@app/components/HeaderComp'

//component
import DialogCustom from "@app/components/Dialog";
import Loading from "@app/screens/loading";
import { Button, Dialog, Icon, Card, FAB } from "@rneui/themed";
import { Text, View, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { IDataPost, IDataPostSelect } from "@app/commons/interfaces";
//image
import Constants from "@app/constants";

//function
import zoningService from "@app/services/zoning.service";
import postService from "@app/services/post.service";
import styles from "./style";
const ZoningService = new zoningService();
const PostService = new postService();

const PostList = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(
        (state: RootState) => state.user
    );
    const [isLoading, setIsLoading] = useState(true);
    const [visible2, setVisible2] = useState(false);
    const [id, setID] = useState();
    const [showDialog, setShowDialog] = useState(false);
    const [typeDialog, setTypeDialog] = useState("");
    const [contentDialog, setContentDialog] = useState("");

    const toggleDialog2 = () => {
        setVisible2(!visible2);
    };
    const [postList, setPostList] = useState<IDataPostSelect>({
        listDataPost: new Array<IDataPost>(),
    });
    const updatePost = (newState: any) => {
        setPostList((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };
    const handleUpdatePostList = (e: any) => {
        updatePost({
            listDataPost: [...Array.from(e).map((post: any, ind: any) => (
                {
                    id: post.id,
                    title: post.title,
                    status_id: post.status_id,
                    status_name: post.status_name,
                    typeof_posts_id: post.typeof_posts_id,
                    description: post.description,
                }
            ))]
        })
    }
    var [arr, setArr] = useState(new Array<any>());
    const updateArr = (newState: any) => {
        setArr((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };
    const getPostByUserID = async (user_id: any) => {
        const result = await PostService.handleGetByUserID(user_id);
        setIsLoading(false);
        handleUpdatePostList(result.data);
        result.data.map(async (post: any, ind: any) => {
            const resultImage = await PostService.handleGetOneImageByPostID(post.id);
            if (resultImage.data[0] != undefined) {
                arr[post.id] = resultImage.data[0].name;
            }
            updateArr(arr);
        })
    }
    const goPostDetailScreen = async (post_id: any) => {
        navigation.navigate(ScreenName.POSTDETAIL, {
            post_id: post_id
        })
    }
    const handleDelete = async (post_id: any) => {
        const result = await PostService.handleDeletePost(post_id);
        setShowDialog(true);
        setTypeDialog("success");
        setContentDialog(result.data.message);
        setTimeout(() => {
            setShowDialog(false);
            setTypeDialog("");
            setContentDialog("");
            getPostByUserID(userInfo.id);
        }, 1500);
        toggleDialog2();
    }
    const goPostUpdateScreen = async (post_id: any) => {
        navigation.navigate(ScreenName.ADDPOST, {
            post_id: post_id
        })
    }
    useEffect(() => {
        getPostByUserID(userInfo.id);
    }, [])

    const arrColor = [Constants.Styles.CORLOR_BLUE, Constants.Styles.CORLOR_GREEN, Constants.Styles.CORLOR_RED]
    const arrImage = ["", "canmua.jpg", "", "canthue.jpg"]

    if (!userInfo.id) {
        return (
            <View style={{ flex: 1 }}>
                <HeaderComp title={Strings.Zoning.LIST_ZONING} height={17} />
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
    } else {
        if (isLoading) {
            return (
                <Loading />
            )
        } else {
            return (
                <ScrollView style={{ flex: 1 }}>
                    <HeaderComp title={Strings.Zoning.LIST_ZONING} height={17} />
                    {postList.listDataPost.length > 0 && postList.listDataPost.map((post: any, ind: any) => (
                        <Card key={post.id}>
                            <Card.Title style={{ fontSize: 18 }}>{post.title}</Card.Title>
                            <Card.Divider />
                            <Card.Image
                                onPress={() => goPostDetailScreen(post.id)}
                                style={{ padding: 0 }}
                                source={{ uri: (post.typeof_posts_id === 1 || post.typeof_posts_id === 3) ? `${Constants.Api.IMAGES_URL}/${arr[post.id]}` : `${Constants.Api.IMAGES_URL}/${arrImage[post.typeof_posts_id - 1]}` }}
                            />
                            <FAB
                                size="small"
                                visible={true}
                                title={post.status_name}
                                titleStyle={{ fontSize: 13, fontWeight: "800", color: Constants.Styles.CORLOR_WHITE }}
                                color={arrColor[post.status_id - 1]}
                                style={{ position: "absolute", top: 35, left: -30 }}
                            />
                            <Text style={{ marginVertical: 15 }}>{post.description == "undefined" ? "" : post.description}</Text>
                            <View style={{ flexDirection: "row", display: "flex", justifyContent: "center" }}>
                                <Button
                                    containerStyle={styles.btn_step1_container}
                                    type={"clear"}
                                    icon={
                                        <Icon name="create" color={Constants.Styles.COLOR_CHETWODE_BLUE} iconStyle={{ marginRight: 10 }} />
                                    }
                                    titleStyle={{ color: Constants.Styles.COLOR_CHETWODE_BLUE }}
                                    buttonStyle={{
                                        borderRadius: 0,
                                        marginLeft: 0,
                                        marginRight: 0,
                                        marginBottom: 0,
                                    }}
                                    title={Strings.Common.UPDATE}
                                    onPress={() => goPostUpdateScreen(post.id)}
                                />
                                <Button
                                    containerStyle={styles.btn_step1_container_delete}
                                    type={"clear"}
                                    icon={
                                        <Icon name="delete" color={Constants.Styles.COLOR_DARKGRAY} iconStyle={{ marginRight: 10 }} />
                                    }
                                    titleStyle={{ color: Constants.Styles.COLOR_DARKGRAY }}
                                    buttonStyle={{
                                        borderRadius: 0,
                                        marginLeft: 0,
                                        marginRight: 0,
                                        marginBottom: 0,
                                    }}
                                    title={Strings.Common.DELETE}
                                    onPress={() => {
                                        toggleDialog2();
                                        setID(post.id);
                                    }}
                                />
                            </View>
                        </Card>
                    ))}
                    <DialogCustom
                        show={showDialog}
                        type={typeDialog}
                        content={contentDialog}
                        onPressIn={() => setShowDialog(false)}
                    />
                    <Dialog
                        isVisible={visible2}
                        onBackdropPress={toggleDialog2}
                    >
                        <Dialog.Title title={Strings.Zoning.CONFIRM_DELETE} />
                        <Dialog.Actions>
                            <Dialog.Button title={Strings.Common.DELETE} onPress={() => handleDelete(id)} />
                            <Dialog.Button title={Strings.Common.CANCEL} onPress={toggleDialog2} />
                        </Dialog.Actions>
                    </Dialog>
                </ScrollView >
            )
        }

    }
}

export default PostList;