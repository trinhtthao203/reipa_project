import React from 'react';
import ScreenName from './screenName';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from "react-native"

import { Home, AddPost, Profile } from "../screens"
import { Icon } from '@rneui/base';
import Constants from '@app/constants';

const Tab = createBottomTabNavigator();

function TabNavigation() {
    return (
        <Tab.Navigator initialRouteName={ScreenName.HOME}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name={ScreenName.HOME} component={Home}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Icon
                                name={focused ? "home" : 'home-outline'} size={Constants.Styles.ICON_SIZE_MEDIUM}
                                type={Constants.Styles.ICON_STYLE_FONT_IONICON}
                                color={focused ? Constants.Styles.COLOR_CHETWODE_BLUE : Constants.Styles.COLOR_GHOST}
                            />
                        )
                    }
                }}
            />
            <Tab.Screen
                name={ScreenName.ADDPOST} component={AddPost}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Icon
                                name={focused ? "add-circle" : "add-circle-outline"} size={Constants.Styles.ICON_SIZE_LARGE}
                                type={Constants.Styles.ICON_STYLE_FONT_IONICON}
                                color={focused ? Constants.Styles.COLOR_CHETWODE_BLUE : Constants.Styles.COLOR_GHOST}

                            />
                        )
                    }
                }}
            />
            <Tab.Screen
                name={ScreenName.PROFILE} component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Icon
                                name={focused ? "person" : 'person-outline'} size={Constants.Styles.ICON_SIZE_MEDIUM}
                                type={Constants.Styles.ICON_STYLE_FONT_IONICON}
                                color={focused ? Constants.Styles.COLOR_CHETWODE_BLUE : Constants.Styles.COLOR_GHOST}
                            />
                        )
                    }
                }}
            />

        </Tab.Navigator>
    )
}

export default TabNavigation