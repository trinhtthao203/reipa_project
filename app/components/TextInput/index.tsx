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
    value?: any;
    label?: string;
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
        return (
            <Input
                {...props}
                onChange={handleChangeValue}
                secureTextEntry={false}
                label={props.label}
                labelStyle={styles.label_style}
                containerStyle={styles.text_container}
                inputContainerStyle={styles.input_container}
                inputStyle={styles.input_style}
                autoComplete="off"
                errorStyle={{ height: 18 }}
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