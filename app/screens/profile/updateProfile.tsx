import React, { useState } from 'react';
import Constants from '@app/constants';
import { RootState } from "@app/store";
import Strings from "@app/commons/strings";
import { useTheme } from 'react-native-paper';
import DialogCustom from "@app/components/Dialog";
import ImagePicker from "react-native-image-crop-picker";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { IUserInfo, IErrorUserInfo } from "@app/commons/interfaces";
import {
    View,
    TouchableOpacity,
    PermissionsAndroid,
    TextInput,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { Image, Icon, Button, Dialog, Text, Avatar } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
    const { colors } = useTheme();

    const [showDialog, setShowDialog] = useState(false);
    const [typeDialog, setTypeDialog] = useState("");
    const [contentDialog, setContentDialog] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const { userInfo } = useSelector(
        (state: RootState) => state.user
    );

    const [user, setUserInfo] = React.useState<IUserInfo>({
        fullname: userInfo.fullname,
        phonenumber: userInfo.phonenumber,
        address: userInfo.address,
        role_id: 2,
        showPassword: false,
        showConfirmPassword: false,
        // isUpdate: false,
    });

    const updateUserInfo = (newState: IUserInfo) => {
        setUserInfo((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const [errorUserInfo, setErrorUserInfo] = React.useState<IErrorUserInfo>({
        error: false,
        errorPasswordMsg: "",
        errorConfirmPasswordMsg: "",
        errorPhoneNumberMsg: "",
    });

    const updateErrorUserInfo = (newState: IErrorUserInfo) => {
        setErrorUserInfo((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const handleUploadImage = async () => {
        const result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (!result) {
            setShowDialog(true);
            setTypeDialog("warning");
            setContentDialog(Strings.Message.ACCESS_CAMERA_MESSAGE);
        } else {
            ImagePicker.openPicker({
                multiple: false,
                waitAnimationEnd: false,
                includeExif: true,
                forceJpg: true,
                maxFiles: 7,
                compressImageQuality: 0.8,
                mediaType: "photo",
                sortOrder: "desc",
            })
                .then((images: any) => {
                    updateUserInfo({ avatar: images.path });
                    // let arrImages = images.map((i: any, ind: any) => { return i.path })
                })
                .catch((e) => console.log(e));
        }
    }

    const handlUpdate = () => {
        updateUserInfo({ isUpdate: true })
    }

    return (
        <View style={styles.container}>
            <View
                style={{ alignItems: 'center', marginTop: 40, paddingHorizontal: 20 }}
            >
                <Avatar
                    containerStyle={{
                        width: 100,
                        height: 100,
                        backgroundColor: Constants.Styles.COLOR_ATHENSGRAY,
                    }}
                    source={{ uri: `${user.avatar}` }}
                />
                {!user.avatar && <Button
                    type="clear"
                    onPress={() => { handleUploadImage() }}
                    buttonStyle={{ borderRadius: 10, padding: 7 }}
                    titleStyle={{ color: Constants.Styles.COLOR_CHETWODE_BLUE, margin: 2 }}
                >
                    Tải ảnh
                    <Icon name="cloud-upload-outline" color={Constants.Styles.COLOR_CHETWODE_BLUE} type={Constants.Styles.ICON_STYLE_FONT_IONICON} />
                </Button>}
                <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
                    {user.fullname}
                </Text>
            </View>
            <Text >{user.address}</Text>
            <Text >{user.phonenumber}</Text>
            <View>
                <View style={styles.action}>
                    <FontAwesome name="user-o" color={colors.text} size={20} />
                    <TextInput
                        placeholder="Họ và tên"
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="map-marker" color={colors.text} size={20} />
                    <TextInput
                        placeholder="Địa chỉ"
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="phone" color={colors.text} size={20} />
                    <TextInput
                        placeholder="Số điện thoại"
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        style={styles.textInput}
                    />
                </View>
            </View>
            <DialogCustom
                show={showDialog}
                type={typeDialog}
                content={contentDialog}
                onPressIn={() => setShowDialog(false)}
            />
            <Button title={"Chỉnh sửa"} style={{ backgroundColor: Constants.Styles.COLOR_CHETWODE_BLUE }} />
        </View>
    );
};

export default Profile;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.Styles.CORLOR_WHITE,
    },
    panel: {
        padding: 20,
        backgroundColor: '#ffffff',
        paddingTop: 20,
    },
    avatar: {
        position: 'relative',
        width: 100,
        height: 100,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCamera: {
        position: 'absolute',
        color: '#A9A9A9',
        bottom: 0,
        right: 5,
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    header: {
        backgroundColor: '#ffffff',
        shadowColor: '#333333',
        textShadowOffset: { width: -1, height: -3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    btn_style: {
        backgroundColor: Constants.Styles.COLOR_CHETWODE_BLUE
    },
    textInput: {
        flex: 1,
        //marginTop: platform.OS === 'android' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
});
