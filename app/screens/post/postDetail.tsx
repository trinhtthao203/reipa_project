import Strings from '@app/commons/strings'
import HeaderComp from '@app/components/HeaderComp'
import React from 'react'
import { Text, View } from 'react-native'
import styles from './style'
const PostDetail = ({ navigation }: any) => {

    return (
        <View style={styles.container}>
            <HeaderComp goBack={() => navigation.goBack()} />
            <Text>post detail</Text>
        </View>
    )
}

export default PostDetail

