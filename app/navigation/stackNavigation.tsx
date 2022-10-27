import React from 'react';
import ScreenName from './screenName';
import TabNavigation from './tabNavigation';
import { LogIn, SignUp, PostDetail, ForgetPassword, OptionRole, AddPlanningArea, AddPost } from '../screens';

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
                name={ScreenName.ADDPLANNINGAREA}
                component={AddPlanningArea}
            />

            <Stack.Screen
                name={ScreenName.ADDPOST}
                component={AddPost}
            />
        </>
    )
}