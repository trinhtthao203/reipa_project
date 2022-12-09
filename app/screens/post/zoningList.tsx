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
import { IDataZoning, IDataZoningList } from "@app/commons/interfaces";
//image
import Constants from "@app/constants";

//function
import zoningService from "@app/services/zoning.service";
import styles from "./style";
const ZoningService = new zoningService();

const ZoningList = ({ navigation }: any) => {
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
    const [zoningList, setZoningList] = useState<IDataZoningList>({
        listDataZoning: new Array<IDataZoning>(),
    });
    const updateZoning = (newState: any) => {
        setZoningList((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };
    const handleUpdateZoningList = (e: any) => {
        updateZoning({
            listDataZoning: [...Array.from(e).map((zoning: any, ind: any) => (
                {
                    id: zoning.id,
                    name: zoning.name,
                    status_id: zoning.status_id,
                    status_name: zoning.status_name,
                    description: zoning.description,
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
    const getZoningByUserID = async (user_id: any) => {
        const result = await ZoningService.handleGetZoningByUserID(user_id);
        setIsLoading(false);
        handleUpdateZoningList(result.data);
        result.data.map(async (zoning: any, ind: any) => {
            const resultImage = await ZoningService.handleGetOneImageByZoningID(zoning.id);
            arr[zoning.id] = resultImage.data[0].name;
            updateArr(arr);
        })
    }
    const goZoningDetailScreen = async (zoning_id: any) => {
        navigation.navigate(ScreenName.ZONINGDETAIL, {
            zoning_id: zoning_id
        })
    }
    const handleDelete = async (zoning_id: any) => {
        const result = await ZoningService.handleDeleteZoning(zoning_id);
        setShowDialog(true);
        setTypeDialog("success");
        setContentDialog(result.data.message);
        setTimeout(() => {
            setShowDialog(false);
            setTypeDialog("");
            setContentDialog("");
            getZoningByUserID(userInfo.id);
        }, 1500);
        toggleDialog2();
    }
    const goZoningUpdateScreen = async (zoning_id: any) => {
        navigation.navigate(ScreenName.ADDZONING, {
            zoning_id: zoning_id
        })
    }
    useEffect(() => {
        getZoningByUserID(userInfo.id);
    }, [])

    const arrColor = [Constants.Styles.CORLOR_BLUE, Constants.Styles.CORLOR_GREEN, Constants.Styles.CORLOR_RED]

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
                    {zoningList.listDataZoning.length > 0 && zoningList.listDataZoning.map((zoning: any, ind: any) => (
                        <Card key={zoning.id}>
                            <Card.Title style={{ fontSize: 18 }}>{zoning.name}</Card.Title>
                            <Card.Divider />
                            <Card.Image
                                onPress={() => goZoningDetailScreen(zoning.id)}
                                style={{ padding: 0 }}
                                source={{ uri: `${Constants.Api.IMAGES_URL}/${arr[zoning.id]}`, }}
                            />
                            <FAB
                                size="small"
                                visible={true}
                                title={zoning.status_name}
                                titleStyle={{ fontSize: 13, fontWeight: "800", color: Constants.Styles.CORLOR_WHITE }}
                                color={arrColor[zoning.status_id - 1]}
                                style={{ position: "absolute", top: 35, left: -30 }}
                            />
                            {/* <Text style={{ marginVertical: 15 }}>{zoning.description == "undefined" ? "" : zoning.description}</Text> */}
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
                                    onPress={() => goZoningUpdateScreen(zoning.id)}
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
                                        setID(zoning.id);
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

export default ZoningList;