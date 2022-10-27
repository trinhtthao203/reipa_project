import Strings from '@app/commons/strings'
import HeaderComp from '@app/components/HeaderComp'
import React from 'react'
import { Text, View } from 'react-native'
import styles from './style'
const AddPost = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <HeaderComp goBack={() => navigation.goBack()} />
            <Text>Thêm bài đăng mới</Text>
        </View>
    )
}

export default AddPost;