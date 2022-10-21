import React, { useState, useEffect } from "react";

import styles from "./style";
import { Image, View, Text } from "react-native"
import { Input, InputProps, Dialog } from '@rneui/themed';
import Constants from "@app/constants";
import { Server, Warning, Success } from "@app/assets/images";
import Helpers from "@app/commons/helpers";

interface IProps extends InputProps {
    type?: string;
    title?: string;
    content?: string;
    show?: boolean;
}

const Dialogg = (props: IProps) => {
    // strip out unnecessary props for MUI input
    var {
        type,
        title,
        content,
        show,
        ...muiInputProps
    } = props;
    return <Dialog {...muiInputProps} />
}

const DialogCustom: React.FC<IProps> = (props: IProps) => {
    const [visible, setVisible] = useState(props.show);
    useEffect(() => {
        toggleDialog();
    }, [props.show]);

    const toggleDialog = () => {
        if (props.show) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };
    const inputInstance = () => {
        if (props.type === "loading") {
            return (
                <Dialog
                    {...props}
                    isVisible={visible}
                    onBackdropPress={toggleDialog}
                    overlayStyle={styles.container}

                >
                    <Dialog.Loading />
                    <Text style={styles.text_content}>{props.content}</Text>
                </Dialog>
            )
        }
        if (props.type === "warning") {
            return (
                <Dialog
                    {...props}
                    isVisible={visible}
                    onBackdropPress={toggleDialog}
                    overlayStyle={styles.container}
                >
                    <Image
                        source={Warning}
                        style={styles.img_style}
                    />
                    <Text style={styles.text_content}>{props.content}</Text>
                </Dialog>
            )
        }
        if (props.type === "server") {
            return (
                <Dialog
                    {...props}
                    isVisible={visible}
                    onBackdropPress={toggleDialog}
                    overlayStyle={styles.container}
                >
                    <Image
                        source={Server}
                        style={styles.img_style}
                    />
                    <Text style={styles.text_content}>{props.content}</Text>
                </Dialog>
            )
        }
        if (props.type === "success") {
            return (
                <Dialog
                    {...props}
                    isVisible={visible}
                    onBackdropPress={toggleDialog}
                    overlayStyle={styles.container}
                >
                    <Image
                        source={Success}
                        style={styles.img_style}
                    />
                    <Text style={styles.text_content}>{props.content}</Text>
                </Dialog>
            )
        }
    }

    return (
        <View>
            {inputInstance()}
        </View>
    )
}

export default DialogCustom