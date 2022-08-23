import React from 'react';
import ScreenName from "./screenName";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home, LogIn, SignUp } from "../screens"
import stackNavigation from './stackNavigation';

const Stack = createNativeStackNavigator();

function RouteNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {stackNavigation(Stack)}
                {/* <Stack.Screen name={ScreenName.LOGIN} component={LogIn} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RouteNavigation