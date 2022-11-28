import React, { useState, useEffect } from 'react';
import Constants from '@app/constants';
import { RootState } from "@app/store";
import { IUserInfo, IErrorUserInfo } from "@app/commons/interfaces";
import { View, StyleSheet, } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import ScreenName from "@app/navigation/screenName";
import { storeUserInfo } from "../../store/slice/user.slice";
import { Button, Text, Avatar, ListItem, Icon } from "@rneui/themed";

const Profile = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(
        (state: RootState) => state.user
    );

    const list = [
        {
            title: 'Bài đăng của tôi',
            icon: 'receipt',
            function: () => goToPostList(),
        },
        {
            title: 'Quy hoạch của tôi',
            icon: 'layers',
            function: () => goToZoningList(),
        },
        {
            title: 'Cập nhật hồ sơ',
            icon: 'person',
            function: () => handleLogOut,
        },
        {
            title: 'Đăng xuất',
            icon: 'log-out',
            function: async () => handleLogOut()
        },
    ]

    const listInfo = [
        {
            title: 'Số điện thoại',
            icon: 'call-outline',
            value: userInfo.phonenumber
        },
        {
            title: 'Địa chỉ',
            icon: 'location-outline',
            value: `${userInfo.ward_name ? userInfo.ward_name : ""}, ${userInfo.district_name ? userInfo.district_name : ""}, ${userInfo.province_name ? userInfo.province_name : ""}`
        },
        {
            title: 'Ngày tham gia',
            icon: 'calendar-outline',
            value: convertDate(userInfo.createdAt),
        },
    ]

    const handleLogOut = async () => {
        dispatch(storeUserInfo({
            id: "",
            phonenumber: "",
            fullname: "",
            avatar: "",
            street_id: "",
            ward_id: "",
            role_id: ""
        }))
        navigation.navigate(ScreenName.HOME)
    }

    function convertDate(str: any) {
        const dateStr = str, [yyyy, mm, dd, mi, hh] = dateStr.split(/[/:\-T]/)
        return `${dd}/${mm}/${yyyy}`
    }
    function goToPostList() {
        navigation.navigate(ScreenName.POSTLIST)
    }
    function goToZoningList() {
        navigation.navigate(ScreenName.ZONINGLIST)
    }

    return (
        <View style={styles.container}>
            <View
                style={{ alignItems: 'center', marginTop: 40, paddingHorizontal: 20, flexDirection: "row" }}
            >
                <Avatar
                    containerStyle={{
                        shadowColor: '#000',
                        shadowOffset: { width: -2, height: 4 },
                        shadowOpacity: 0.5,
                        shadowRadius: 50,
                        elevation: 10,
                        borderRadius: 30,
                        width: Constants.Styles.SIZE_AVATAR,
                        height: Constants.Styles.SIZE_AVATAR,
                        marginRight: 10,
                    }}
                    avatarStyle={{
                        borderRadius: 50,
                    }}
                    source={{ uri: `${userInfo.avatar ? Constants.Api.IMAGES_URL + "/" + userInfo.avatar : Constants.Api.IMAGES_URL + "/user.png"}` }}
                />
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{userInfo.fullname}</Text>
            </View>
            <View style={{ paddingVertical: 30, paddingHorizontal: 10 }}>
                {
                    listInfo.map((item, i) => (
                        <ListItem key={i} containerStyle={{ padding: 0 }}>
                            <Icon type={Constants.Styles.ICON_STYLE_FONT_IONICON} name={item.icon} size={20} />
                            <ListItem.Title><Text style={{ fontWeight: "bold" }}>{item.title}:</Text> {item.value}</ListItem.Title>
                        </ListItem>
                    ))
                }
            </View>
            {
                list.map((item, i) => (
                    <Button key={i} onPress={item.function} type={"clear"} containerStyle={{ borderBottomWidth: 1.5, borderBottomColor: Constants.Styles.COLOR_ATHENSGRAY }}>
                        <Icon type={Constants.Styles.ICON_STYLE_FONT_IONICON} name={item.icon} color={Constants.Styles.COLOR_CHETWODE_BLUE} />
                        <ListItem.Content>
                            <ListItem.Title>   {item.title}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </Button>
                ))
            }
        </View>
    );
};

export default Profile;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.Styles.CORLOR_WHITE,
    }
});
