import React, { useState } from "react";

import styles from "./style";

import { View } from "react-native"
import { Input, Icon, InputProps } from '@rneui/themed';
import Constants from "@app/constants";
import Helpers from "@app/commons/helpers";

interface IProps extends InputProps {
    secure?: boolean;
    radiusType?: string;
    onChangeText: (value: any) => void;
    placeholder?: string;
    type?: string;
    value?: string;
    label?: string;
}

const Inputt = (props: IProps) => {
    // strip out unnecessary props for MUI input
    const {
        onChangeText,
        placeholder,
        secure,
        radiusType,
        type,
        value,
        label,
        ...muiInputProps
    } = props;
    return <Input {...muiInputProps} />
}

const TextInput: React.FC<IProps> = (props: IProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleChangeValue = (event: any) => {
        if (props.onChangeText && Helpers.isFunction(props.onChangeText)) {
            props.onChangeText(event.target.value);
        }
    }

    const onShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const inputInstance = () => {
        if (props.secure) {
            return (
                <Input
                    {...props}
                    onChange={handleChangeValue}
                    label={props.value ? props.label : ""}
                    containerStyle={styles.text_input}
                    secureTextEntry={showPassword ? false : true}
                    labelStyle={{ fontWeight: "100", fontSize: 13 }}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    errorStyle={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                    rightIcon={
                        <Icon
                            name={showPassword ? "eye-slash" : "eye"}
                            size={24}
                            color='black'
                            type="font-awesome"
                            onPress={onShowPassword}
                        />
                    }
                    autoComplete="off"
                />
            )
        }
        if (props.radiusType === "top") {
            return (
                <Input
                    {...props}
                    onChange={handleChangeValue}
                    label={props.value ? props.label : ""}
                    containerStyle={styles.text_input_top}
                    secureTextEntry={false}
                    labelStyle={{ fontWeight: "100", fontSize: 13 }}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    errorStyle={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                    autoComplete="off"
                />
            )
        }
        if (props.radiusType === "full") {
            return (
                <Input
                    {...props}
                    onChange={handleChangeValue}
                    label={props.value ? props.label : ""}
                    containerStyle={styles.text_input_full}
                    secureTextEntry={false}
                    labelStyle={{ fontWeight: "100", fontSize: 13 }}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    errorStyle={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                    autoComplete="off"
                />
            )
        }
        return (
            <Input
                {...props}
                onChange={handleChangeValue}
                label={props.value ? props.label : ""}
                containerStyle={styles.text_input}
                secureTextEntry={false}
                labelStyle={{ fontWeight: "100", fontSize: 13 }}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                errorStyle={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                autoComplete="off"
            />
        );
    }

    return (
        <View>
            {inputInstance()}
        </View>
    )
}

export default TextInput