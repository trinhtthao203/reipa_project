import React from 'react';
import ScreenName from './screenName';
import TabNavigation from './tabNavigation';
import { LogIn, SignUp, PostDetail, ForgetPassword, OptionRole } from '../screens';

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
        </>
    )
}