//import
import React, { useEffect, useState } from 'react'

//Elements
import styles from './style';
import Loading from "@app/screens/loading";
import HeaderComp from '@app/components/HeaderComp'
import { IDataPost } from "@app/commons/interfaces";
import { ScrollView, Text, View } from 'react-native'
import { ImageSlider } from "react-native-image-slider-banner";
//function
import Constants from '@app/constants';
import { ListItem, Icon } from '@rneui/themed';
import postService from "@app/services/post.service";
const PostService = new postService();

const PostDetail = ({ route, navigation }: any) => {
    const { post_id } = route.params;
    const [isLoading, setIsLoading] = useState(true);

    const [post, setPost] = React.useState<IDataPost>();
    const [images, setImages] = React.useState<any>();
    const handleGetData = async () => {
        try {
            const result = await PostService.handleGetPostByID(post_id);
            setPost(result.data[0]);
            if (result.data[0].typeof_posts_id == 2) {
                setImages([{ img: `${Constants.Api.IMAGES_URL}/canmua.jpg` }])
            } else if (result.data[0].typeof_posts_id == 4) {
                setImages([{ img: `${Constants.Api.IMAGES_URL}/canthue.jpg` }])
            } else {
                const resultImage = await PostService.handleGetAllImageByID(post_id);
                var arrImage = resultImage.data.map((image: any, ind: any) => {
                    return { img: `${Constants.Api.IMAGES_URL}/${image.name}` }
                })
                setImages(arrImage);
            }
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleGetData();
    }, [])

    const listDetail = [
        {
            title: 'Số phòng',
            icon: 'call-outline',
            value: post?.bedroom
        },
        {
            title: 'Số phòng vệ sinh',
            icon: 'location-outline',
            value: post?.toilet
        },
        {
            title: 'Vị trí tầng',
            icon: 'calendar-outline',
            value: post?.structure
        },
    ]

    const listInfo = [
        {
            title: 'Họ tên',
            icon: 'calendar-outline',
            value: post?.user_name
        },
        {
            title: 'Số điện thoại',
            icon: 'call-outline',
            value: post?.phonenumber,
        },
    ]

    const listInfoBox = [
        {
            icon: 'bed-outline',
            value: post?.furniture_name
        },
        {
            icon: 'book-outline',
            value: post?.juridical_name
        },
        {
            icon: 'map-outline',
            value: `${post?.area} m2`
        },
    ]


    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <HeaderComp goBack={() => navigation.goBack()} isDetail={true} height={0} />
                <View style={styles.title_box}>
                    <Text style={styles.title}>{post?.title}</Text>
                </View>
                <ImageSlider
                    data={images}
                    autoPlay={false}
                    closeIconColor="#fff"
                />
                <View style={styles.container_info}>
                    <Icon type={"MaterialIcons"} name="attach-money" color={Constants.Styles.COLOR_AMBER} size={25} />
                    <Text style={styles.text_info_money}>{(post?.typeof_posts_id == "2" || post?.typeof_posts_id == "4") ? post?.price : Math.abs((post?.price || 0) * (post?.area || 0) / 1000).toFixed(3)} tỷ</Text>
                </View>
                <View style={styles.container_info}>
                    <Icon type={Constants.Styles.ICON_STYLE_FONT_IONICON} name="location-outline" color={Constants.Styles.COLOR_AMBER} size={25} />
                    <Text style={styles.text_info}>{post?.street_name}{post?.ward_name && post.street_id ? `, ` : ""}{post?.ward_name}{post?.ward_name && post.district_id ? `,` : ""}{post?.district_name}{post?.district_id && post.province_id ? `,` : ""}{post?.province_name}</Text>
                </View>
                <View style={styles.box_info}>
                    {
                        listInfoBox.map((item, i) => (
                            <View key={i} style={styles.box_info_item}>
                                <ListItem containerStyle={{ padding: 0, marginVertical: 10 }}>
                                    <Icon style={{ padding: 0, margin: 0 }} type={Constants.Styles.ICON_STYLE_FONT_IONICON} name={item.icon} color={Constants.Styles.COLOR_AMBER} size={25} />
                                    <ListItem.Title>{item.value}</ListItem.Title>
                                </ListItem>
                            </View>
                        ))
                    }
                </View>
                <View style={{ paddingVertical: 30, paddingHorizontal: 10 }}>
                    <Text style={styles.text_info_content}>Chi tiết</Text>
                    {
                        listDetail.map((item, i) => (
                            <ListItem key={i} containerStyle={{ padding: 0 }}>
                                <Icon type={Constants.Styles.ICON_STYLE_FONT_IONICON} name={item.icon} size={20} />
                                <ListItem.Title><Text style={{ fontWeight: "bold" }}>{item.title}:</Text> {item.value}</ListItem.Title>
                            </ListItem>
                        ))
                    }
                    <Text style={styles.text_info_content}>Mô tả:</Text>
                    <ListItem.Title><Text>{post?.description == null ? post?.description : "Chưa có mô tả"}</Text></ListItem.Title>
                    <Text style={styles.text_info_content}>Liên hệ</Text>
                    {
                        listInfo.map((item, i) => (
                            <ListItem key={i} containerStyle={{ padding: 0 }}>
                                <Icon type={Constants.Styles.ICON_STYLE_FONT_IONICON} name={item.icon} size={20} />
                                <ListItem.Title><Text style={{ fontWeight: "bold" }}>{item.title}:</Text> {item.value}</ListItem.Title>
                            </ListItem>
                        ))
                    }
                </View>
            </View>
        </ScrollView >
    )
}

export default PostDetail

