//import
import React, { useEffect, useState } from 'react'

//Elements
import HeaderComp from '@app/components/HeaderComp'
import { ScrollView, Text, View } from 'react-native'
import styles from './style';
import { ImageSlider } from "react-native-image-slider-banner";
import { IDataZoning } from "@app/commons/interfaces";
import Loading from "@app/screens/loading";
//function
import zoningService from "@app/services/zoning.service";
import Constants from '@app/constants';
import { Icon } from '@rneui/themed';
const ZoningService = new zoningService();

const ZoningDetail = ({ route, navigation }: any) => {
    const { zoning_id } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [zoning, setZoning] = React.useState<IDataZoning>();
    const [images, setImages] = React.useState<any>();
    const handleGetData = async () => {
        try {
            const result = await ZoningService.handleGetZoningByID(zoning_id);
            setZoning(result.data[0]);
            const resultImage = await ZoningService.handleGetImagesByID(zoning_id);
            var arrImage = resultImage.data.map((image: any, ind: any) => {
                return { img: `${Constants.Api.IMAGES_URL}/${image.name}` }
            })
            setImages(arrImage);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleGetData();
    }, [])

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
                    <Text style={styles.title}>{zoning?.name}</Text>
                </View>
                <ImageSlider
                    data={images}
                    autoPlay={false}
                    closeIconColor="#fff"
                />
                <View style={styles.container_info}>
                    <Icon type={Constants.Styles.ICON_STYLE_FONT_IONICON} name="location-outline" color={Constants.Styles.COLOR_AMBER} size={25} />
                    <Text style={styles.text_info}>{zoning?.ward_name}{zoning?.ward_name && zoning.district_id ? `,` : ""}{zoning?.district_name}{zoning?.district_id && zoning.province_id ? `,` : ""}{zoning?.province_name}</Text>
                </View>
                <View style={styles.box_info}>
                    <View style={styles.box_info_item}>
                        <Icon type={Constants.Styles.ICON_STYLE_FONT_IONICON} name="map-outline" color={Constants.Styles.COLOR_AMBER} size={25} />
                        <Text style={styles.text_info}>{zoning?.area} m2</Text>
                    </View>
                </View>
                <View style={styles.text_description}>
                    <Text style={styles.text_info_money}>Chi tiết</Text>
                    <Text>Chiều rộng: {zoning?.width}</Text>
                    <Text>Chiều dài: {zoning?.length}</Text>
                    <Text style={styles.text_info_money}>Mô tả:</Text>
                    <Text>{zoning?.description == undefined ? zoning?.description : ""}</Text>
                    <Text style={styles.text_info_money}>Liên hệ</Text>
                    <Text style={styles.text_info}>Họ tên:{zoning?.user_name}</Text>
                    <Text style={styles.text_info}>Số điện thoại:{zoning?.phonenumber}</Text>
                </View>
            </View>
        </ScrollView >
    )
}

export default ZoningDetail

