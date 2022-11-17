import React from 'react';
import ScreenName from './screenName';
import TabNavigation from './tabNavigation';
import { LogIn, SignUp, PostDetail, ForgetPassword, OptionRole, SelectTypePost, AddPost, ZoningDetail, PostList, ZoningList } from '../screens';
import AddZoning from '@app/screens/post/addZoning';

export default function (Stack: any) {
    return (
        <>
            <Stack.Screen
                name={ScreenName.TABS}
                component={TabNavigation}
            />
            <Stack.Screen
                name={ScreenName.FORGETPASSWORD}
                component={ForgetPassword}
            />
            <Stack.Screen
                name={ScreenName.OPTIONROLE}
                component={OptionRole}
            />
            <Stack.Screen
                name={ScreenName.LOGIN}
                component={LogIn}
            />
            <Stack.Screen
                name={ScreenName.SIGNUP}
                component={SignUp}
            />
            <Stack.Screen
                name={ScreenName.POSTDETAIL}
                component={PostDetail}
            />
            <Stack.Screen
                name={ScreenName.ZONINGDETAIL}
                component={ZoningDetail}
            />
            <Stack.Screen
                name={ScreenName.ADDZONING}
                component={AddZoning}
            />
            <Stack.Screen
                name={ScreenName.ADDPOST}
                component={AddPost}
            />
            <Stack.Screen
                name={ScreenName.SELECTTYPEPOST}
                component={SelectTypePost}
            />
            <Stack.Screen
                name={ScreenName.POSTLIST}
                component={PostList}
            />
            <Stack.Screen
                name={ScreenName.ZONINGLIST}
                component={ZoningList}
            />
        </>
    )
}