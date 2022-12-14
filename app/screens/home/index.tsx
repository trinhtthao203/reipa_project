//import
import React, { useState, useEffect, useRef } from "react"
import styles from "./style";
import Strings from "@app/commons/strings";
import HeaderComp from "@app/components/HeaderComp";
import Geolocation from '@react-native-community/geolocation';
import ScreenName from "@app/navigation/screenName";
import { useDispatch, useSelector } from "react-redux";
//element
import TextInput from "@app/components/TextInput";
import { Picker } from "@react-native-picker/picker";
import { ScrollView, View } from "react-native"
import { WebView } from "react-native-webview";
import DialogCustom from "@app/components/Dialog";
import { BottomSheet, Button, Input, ListItem } from "@rneui/themed";
import { IDataZoning, IDataPost, IDataPostSelect, IPostFilter } from "@app/commons/interfaces";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    storeAddressInfo
} from "../../store/slice/post.slice";
//function
import Loading from "../loading";
import ZoningService from "@app/services/zoning.service";
import PostService from "@app/services/post.service";
import Constants from "@app/constants";
import { Image } from "@rneui/base";
import { Text } from "react-native-paper";
const zoningService = new ZoningService();
const postService = new PostService();

type BottomSheetComponentProps = {};

const Home: React.FunctionComponent<BottomSheetComponentProps> = ({ navigation }: any) => {
    const Map_Ref = useRef<any>(null);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);

    const [showDialog, setShowDialog] = useState(false);
    const [typeDialog, setTypeDialog] = useState("");
    const [contentDialog, setContentDialog] = useState("");

    const [isVisible, setIsVisible] = useState(false);
    const [isVisiblePost, setIsVisiblePost] = useState(false);

    const handleGetLocation = async () => {
        Geolocation.getCurrentPosition(info => {
            setLat(info.coords.latitude);
            setLng(info.coords.longitude);
            updateZoningSelect({ lat: info.coords.longitude + '', lng: info.coords.latitude + '' })
        }, (err) => {
            setShowDialog(true);
            setTypeDialog("warning");
            setContentDialog(Strings.Message.ACCESS_FINE_LOCATION_MESSAGE);
        });
    }

    const [zoningDataGeoJSONPolygon, setZoningDataGeoJSONPolygon] = React.useState();
    const handleGetZoningPolygonList = async () => {
        try {
            const result = await zoningService.handleGetAllZoningGeoJSONPolygon(2);
            setZoningDataGeoJSONPolygon(result.data.zoning[0].json_build_object);
        } catch (err) {
            console.log(err);
        }
    }

    const [zoningDataGeoJSONPolyline, setZoningDataGeoJSONPolyline] = React.useState();
    const handleGetZoningPolylineList = async () => {
        try {
            const result = await zoningService.handleGetAllZoningGeoJSONPolyline(2);
            setZoningDataGeoJSONPolyline(result.data.zoning[0].json_build_object);
        } catch (err) {
            console.log(err);
        }
    }

    const [postDataGeoJSON, setPostDataGeoJSON] = React.useState();
    const handleGetPostGeoJSONList = async () => {
        try {
            const result = await postService.handleGetGeoJSONPost(2);
            setPostDataGeoJSON(result.data.post[0].json_build_object);
        } catch (err) {
            console.log(err);
        }
    }

    const [zoningSelect, setZoningSelect] = React.useState<IDataZoning>({
        lat: "",
        lng: ""
    });
    const updateZoningSelect = (newState: IDataZoning) => {
        setZoningSelect((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const showPolygonFromClick = async (dataPayload: any) => {
        setIsVisible(true);
        const result = await zoningService.handleGetPolygonByID(dataPayload, 2);
        const resultImage = await zoningService.handleGetOneImageByZoningID(dataPayload);
        updateZoningSelect({
            id: result.data[0].id,
            name: result.data[0].name,
            dataImage: resultImage.data[0].name,
            province_name: result.data[0].province_name,
            district_name: result.data[0].district_name,
            ward_name: result.data[0].ward_name,
            user_name: result.data[0].user_name,
            phonenumber: result.data[0].phonenumber,
        })
    }

    const showPolyLineFromClick = async (dataPayload: any) => {
        setIsVisible(true);
        const result = await zoningService.handleGetPolylineByLatLngWithDistance(dataPayload.lat, dataPayload.lng, 2);
        if (result.data[0] == undefined) {
            const result = await postService.handleGetAddressByLatLng(dataPayload.lat, dataPayload.lng);
            if (result.data.post[0] == undefined) {
                setShowDialog(true);
                setTypeDialog("warning");
                setContentDialog(Strings.Message.APOLOGY_MESSAGE);
            } else {
                var addressTemp = {
                    lat_store: zoningSelect.lat,
                    lng_strore: zoningSelect.lng,
                    province_id: result.data.post[0].province_id,
                    province_name: result.data.post[0].province_name,
                    district_id: result.data.post[0].district_id,
                    district_name: result.data.post[0].district_name,
                    ward_id: result.data.post[0].id,
                    ward_name: result.data.post[0].name,
                }
                updateZoningSelect({
                    id: undefined,
                    name: `Bạn đang ở`,
                    dataImage: undefined,
                    province_name: addressTemp.province_name,
                    district_name: addressTemp.district_name,
                    ward_name: addressTemp.ward_name,
                    user_name: undefined,
                    phonenumber: undefined
                })
            }
        } else {
            const resultImage = await zoningService.handleGetOneImageByZoningID(result.data[0].id);
            updateZoningSelect({
                id: result.data[0].id,
                name: result.data[0].name,
                dataImage: resultImage.data[0].name,
                province_name: result.data[0].province_name,
                district_name: result.data[0].district_name,
                ward_name: result.data[0].ward_name,
                user_name: result.data[0].user_name,
                phonenumber: result.data[0].phonenumber,
            })
        }
        updateZoningSelect({
            lat: dataPayload.lat,
            lng: dataPayload.lng
        })
    }

    const onMessage = (payload: any) => {
        let dataPayload;
        try {
            dataPayload = JSON.parse(payload.nativeEvent.data);
        } catch (e) {
            console.log(e);
        }
        if (typeof dataPayload == "string") {
            var stringImage = dataPayload.split("-");
            showPolygonFromClick(stringImage[0]);
            updateZoningSelect({
                lat: stringImage[1],
                lng: stringImage[2]
            })
        }
        if (typeof dataPayload == "number") {
            goPostDetailScreen(dataPayload);
        }
        if (typeof dataPayload == "object") {
            showPolyLineFromClick(dataPayload);
        }
    }

    const [postFilter, setPostFilter] = React.useState<IPostFilter>({
        price: 10000000000,
        area: 500,
        typeof_post: "0",
        typeof_real_estate: "0"
    });
    const updatePostFilter = (newState: IPostFilter) => {
        setPostFilter((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };


    const [postList, setPostList] = useState<IDataPostSelect>({
        listDataPost: new Array<IDataPost>(),
    });
    const updatePost = (newState: any) => {
        setPostList((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };
    const handleUpdatePostList = (e: any) => {
        updatePost({
            listDataPost: [...Array.from(e).map((post: any, ind: any) => (
                {
                    id: post.id,
                    title: post.title,
                    price: post.price,
                    address: post.address,
                    area: post.area,
                    dis_m: post.dis_m,
                    lat: post.geometry.coordinates[0],
                    lng: post.geometry.coordinates[1],
                    typeof_real_estate: post.typeof_real_estate_id,
                    typeof_post: post.typeof_posts_id,
                }
            ))]
        })
    }

    var [arr, setArr] = useState(new Array<any>());
    const updateArr = (newState: any) => {
        setArr((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };
    const getPostByDistance = async (lat: any, lng: any) => {
        setIsVisible(false);
        setIsVisiblePost(!isVisiblePost);
        const result = await postService.handleGetPostByDistance(lat, lng, 20000, 2, postFilter.price, postFilter.area, postFilter.typeof_post, postFilter.typeof_real_estate);
        handleUpdatePostList(result.data);
        result.data.map(async (post: any, ind: any) => {
            if (post.typeof_posts_id == 2) {
                arr[post.id] = "canmua.jpg"
            } else if (post.typeof_posts_id == 4) {
                arr[post.id] = "canthue.jpg"
            } else {
                const resultImage = await postService.handleGetOneImageByPostID(post.id);
                arr[post.id] = resultImage.data[0].name;
            }
            updateArr(arr);
        });
    }

    const [typeRealEstateData, setRealEstateData] = React.useState([]);
    const handleGetTypeRealEstateList = async () => {
        try {
            const result = await postService.handleGetTypeofRealEstate();
            setRealEstateData(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }
    const [typePostData, setTypePostData] = React.useState([]);
    const handleGetTypePostList = async () => {
        try {
            const result = await postService.handleGetTypeofPost();
            setTypePostData(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleGetTypePostList();
        handleGetTypeRealEstateList();
        handleGetLocation();
        handleGetZoningPolygonList();
        handleGetZoningPolylineList();
        handleGetPostGeoJSONList();
        setIsLoading(false);
        const unsubscribe = navigation.addListener('focus', () => {
            setIsVisible(false);
            setIsVisiblePost(false);
        });
        return unsubscribe;
    }, [navigation]);

    const [isAddRouting, setIsAddRouting] = useState(false);
    const handleAddRouting = (lat1: any, lng1: any, lat2: any, lng2: any) => {
        Map_Ref.current.injectJavaScript(`           
            addRoutingControl(${lat1}, ${lng1}, ${lat2}, ${lng2})
        `);
        setIsVisible(false);
        setIsVisiblePost(false);
        setIsAddRouting(true);
    }
    const handleRemoveRouting = () => {
        Map_Ref.current.injectJavaScript(`           
            removeRoutingControl();
        `);
        setIsAddRouting(false);
    }
    const goAddPostScreen = async () => {
        try {
            const result = await postService.handleGetAddressByLatLng(zoningSelect.lat, zoningSelect.lng);
            if (result.data.post[0] == undefined) {
                setShowDialog(true);
                setTypeDialog("warning");
                setContentDialog(Strings.Message.APOLOGY_MESSAGE);
            } else {
                var addressTemp = {
                    lat_store: zoningSelect.lat,
                    lng_store: zoningSelect.lng,
                    province_id: result.data.post[0].province_id,
                    district_id: result.data.post[0].district_id,
                    ward_id: result.data.post[0].id,
                }
                dispatch(storeAddressInfo(addressTemp));
                navigation.navigate(ScreenName.SELECTTYPEPOST)
            }
        } catch (err) {
            console.log(err);
        }
    }

    const goZoningDetailScreen = async () => {
        updatePostFilter({ price: 10000000000, area: 10000, typeof_post: "0", typeof_real_estate: "0" });
        navigation.navigate(ScreenName.ZONINGDETAIL, {
            zoning_id: zoningSelect.id
        })
        setIsVisible(false);
        setIsVisiblePost(false);
    }
    const goPostDetailScreen = async (id: any) => {
        navigation.navigate(ScreenName.POSTDETAIL, {
            post_id: id
        })
        setIsVisible(false);
        setIsVisiblePost(false);
    }

    const refresh = () => {
        handleGetZoningPolylineList();
        handleGetZoningPolygonList();
        handleGetPostGeoJSONList();
    }
    const handleClickTypeOfRealEstate = (typeof_real_estate: any) => {
        updatePostFilter({ typeof_real_estate: typeof_real_estate });
    }
    const handleClickTypeOfPost = (typeof_post: any) => {
        updatePostFilter({ typeof_post: typeof_post });
    }

    const handleFilter = async () => {
        const result = await postService.handleGetPostByDistance(zoningSelect.lat, zoningSelect.lng, 20000, 2, postFilter.price, postFilter.area, postFilter.typeof_post, postFilter.typeof_real_estate);
        handleUpdatePostList(result.data);
        result.data.map(async (post: any, ind: any) => {
            if (post.typeof_posts_id == 2) {
                arr[post.id] = "canmua.jpg"
            } else if (post.typeof_posts_id == 4) {
                arr[post.id] = "canthue.jpg"
            } else {
                const resultImage = await postService.handleGetOneImageByPostID(post.id);
                arr[post.id] = resultImage.data[0].name;
            }
            updateArr(arr);
        });
    }

    if (isLoading) {
        return (
            <Loading />
        )
    } else {
        return (
            <View style={styles.container} >
                <HeaderComp title={Strings.Home.TITLE} height={17} refresh={true} func={refresh} />
                {isAddRouting && <Button title={"Đóng tìm đường"} onPress={() => handleRemoveRouting()} />}
                <BottomSheet modalProps={{}} isVisible={isVisible} onBackdropPress={() => setIsVisible(!isVisible)}>
                    <View style={{ backgroundColor: Constants.Styles.CORLOR_WHITE, padding: 10, flex: 1, flexWrap: 'wrap', flexDirection: "row", }}>
                        {zoningSelect?.dataImage && <Image source={{ uri: `${Constants.Api.IMAGES_URL}/${zoningSelect?.dataImage}` }} style={{ height: 120, width: 120 }} />}
                        {zoningSelect?.name && zoningSelect?.user_name && (
                            <View style={{ marginLeft: 10, justifyContent: "center" }}>
                                <Text style={{ fontWeight: "bold", fontSize: 15, maxWidth: 200 }}> {zoningSelect.name}</Text>
                                <Text>{zoningSelect.ward_name ? zoningSelect.ward_name : ''} {zoningSelect.district_name} {zoningSelect.province_name} </Text>
                                {zoningSelect.user_name ? <Text>〄{zoningSelect.user_name}</Text> : ''}
                                {zoningSelect.phonenumber ? <Text>📞{zoningSelect.phonenumber}</Text> : ''}
                                <Button title={"Xem chi tiết"} type="clear" titleStyle={{ color: Constants.Styles.COLOR_CHETWODE_BLUE, fontSize: 15 }} onPress={goZoningDetailScreen} />
                            </View>
                        )}
                        {!zoningSelect?.id && (
                            <View>
                                <Text style={{ fontWeight: "bold", fontSize: 15 }}> {zoningSelect.ward_name}, {zoningSelect.district_name}, {zoningSelect.province_name}</Text>
                                <Text> {zoningSelect.lat},{zoningSelect.lng} </Text>
                            </View>
                        )}
                        <Button title={"Tìm kiếm các Bài đăng quanh đây"} type="clear" titleStyle={{ color: Constants.Styles.COLOR_CHETWODE_BLUE, fontSize: 15 }} onPress={() => getPostByDistance(zoningSelect.lat, zoningSelect.lng)} />
                        {!zoningSelect.phonenumber && (
                            <Button icon={
                                <Icon
                                    name="arrow-right"
                                    size={15}
                                    color="black"
                                />
                            } title={"Thêm bài đăng tại khu vực này"} type="clear" titleStyle={{ color: Constants.Styles.COLOR_CHETWODE_BLUE, fontSize: 15 }} onPress={goAddPostScreen} />
                        )}
                    </View>
                </BottomSheet>
                <BottomSheet modalProps={{}} isVisible={isVisiblePost} onBackdropPress={() => {
                    setIsVisiblePost(!isVisiblePost)
                    updatePostFilter({ price: 10000000000, area: 10000, typeof_post: "0", typeof_real_estate: "0" });
                }}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Picker
                            dropdownIconColor={Constants.Styles.COLOR_BLACK}
                            style={{ color: Constants.Styles.COLOR_BLACK, backgroundColor: Constants.Styles.CORLOR_WHITE, width: "50%" }}
                            selectedValue={postFilter.typeof_real_estate}
                            onValueChange={(itemValue, itemIndex) =>
                                handleClickTypeOfRealEstate(itemValue)
                            }
                        >
                            <Picker.Item style={{ fontSize: 14 }} label={"Loại bất động sản"} value={0} />
                            {typeRealEstateData &&
                                typeRealEstateData.map((val: any, ind: any) => {
                                    return (
                                        <Picker.Item style={{ fontSize: 14 }} key={ind} label={val.name} value={val.id} />
                                    )
                                })
                            }
                        </Picker>
                        <Picker
                            dropdownIconColor={Constants.Styles.COLOR_BLACK}
                            style={{ color: Constants.Styles.COLOR_BLACK, backgroundColor: Constants.Styles.CORLOR_WHITE, width: "50%" }}
                            selectedValue={postFilter.typeof_post}
                            onValueChange={(itemValue, itemIndex) =>
                                handleClickTypeOfPost(itemValue)
                            }
                        >
                            <Picker.Item style={{ fontSize: 14 }} label={"Loại bài đăng"} value={0} />
                            {typePostData &&
                                typePostData.map((val: any, ind: any) => {
                                    return (
                                        <Picker.Item style={{ fontSize: 14 }} key={ind} label={val.name} value={val.id} />
                                    )
                                })
                            }
                        </Picker>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <View style={{ width: "40%" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 13, backgroundColor: Constants.Styles.CORLOR_WHITE, paddingLeft: 15 }}>Giá (VND)</Text>
                            <Input
                                containerStyle={{ backgroundColor: Constants.Styles.CORLOR_WHITE, height: 30 }}
                                inputContainerStyle={{ borderBottomWidth: 0, margin: 0, height: 30 }}
                                inputStyle={{ fontSize: 14 }}
                                keyboardType="numeric"
                                value={postFilter.price + ""}
                                placeholder={"Giá (VND)"}
                                onChangeText={(val: any) => { updatePostFilter({ price: val }) }}
                            />
                        </View>
                        <View style={{ width: "40%" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 13, backgroundColor: Constants.Styles.CORLOR_WHITE, paddingLeft: 15 }}>Diện tích (m2)</Text>
                            <Input
                                containerStyle={{ backgroundColor: Constants.Styles.CORLOR_WHITE, height: 30 }}
                                inputContainerStyle={{ borderBottomWidth: 0, margin: 0, height: 30 }}
                                inputStyle={{ fontSize: 14 }}
                                keyboardType="numeric"
                                value={postFilter.area + ''}
                                placeholder={"Diện tích (m2)"}
                                onChangeText={(val: any) => { updatePostFilter({ area: val }) }}
                            />
                        </View>
                        <Button
                            containerStyle={{ width: "20%" }}
                            buttonStyle={{
                                height: 47.5,
                                backgroundColor: 'rgba(111, 202, 186, 1)',
                                borderRadius: 5,
                            }}
                            onPress={() => handleFilter()}
                        >Lọc</Button>
                    </View>
                    <ScrollView style={{ maxHeight: 400 }}>
                        {postList.listDataPost.length > 0 ? postList.listDataPost.map((post: any, i: any) => {
                            return (
                                <ListItem containerStyle={{ borderWidth: 1, borderColor: Constants.Styles.COLOR_ATHENSGRAY }} key={i} onPress={() => console.log(post.id)}>
                                    <ListItem.Content style={{ flexDirection: 'row', paddingLeft: 24 }}>
                                        <View>
                                            {arr[post.id] && <Image source={{ uri: `${Constants.Api.IMAGES_URL}/${arr[post.id]}` }} style={{ height: 85, width: 85, marginHorizontal: 10 }} />}
                                            {post.dis_m && <Text style={{ fontWeight: "bold", fontSize: 12, position: "absolute", color: Constants.Styles.COLOR_CHETWODE_BLUE, backgroundColor: Constants.Styles.CORLOR_WHITE, borderRadius: 5 }}>{post.dis_m} (m)</Text>}
                                        </View>
                                        <ListItem.Title>
                                            <View style={{ width: 270, justifyContent: "center" }}>
                                                <Text style={{ fontWeight: "bold", fontSize: 13 }}>{post.title}</Text>
                                                {post.price && <Text style={{ fontSize: 12 }}>🪙~{post.price} VND</Text>}
                                                {post.address && <Text style={{ fontSize: 12 }}>📍{post.address}</Text>}
                                                <View style={{ flexDirection: "row" }}>
                                                    <Button title={"Xem chi tiết"} type="clear" titleStyle={{ color: Constants.Styles.COLOR_CHETWODE_BLUE, fontSize: 15 }} onPress={() => goPostDetailScreen(post.id)} />
                                                    <Button title={"Chỉ đường"} type="clear" onPress={() => handleAddRouting(zoningSelect.lat, zoningSelect.lng, post.lat, post.lng)} titleStyle={{ color: Constants.Styles.COLOR_CHETWODE_BLUE, fontSize: 15 }} />
                                                </View>
                                            </View>
                                        </ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            )
                        }) :
                            <View style={{ backgroundColor: Constants.Styles.CORLOR_WHITE, height: 50, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontSize: 16 }}>⚠️{Strings.Post.NULL_POST_MESSAGE}</Text>
                            </View>
                        }
                    </ScrollView>
                </BottomSheet>
                <WebView
                    ref={Map_Ref}
                    originWhitelist={['*']}
                    onMessage={onMessage}
                    source={{
                        html: `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <meta name="viewport" content="initial-scale=1.0">
                                <link rel="stylesheet" href="https://unpkg.com/leaflet@latest/dist/leaflet.css" />
                                <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.css" />
                                <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> 
                                <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@0.4.0/dist/leaflet.draw.css"/> 
                            </head>
                            <style>
                                #mapid{
                                    position: relative;
                                    z-index:1;
                                }
                                #boxContainerid{
                                    position: absolute;
                                    bottom: 0px;
                                    right: 0;
                                    width: 100%;
                                    background-color: ${Constants.Styles.CORLOR_WHITE};
                                    z-index:2;
                                }
                                #boxContentContainerid{
                                    margin:3px;
                                    padding: 1px;
                                    background-color: ${Constants.Styles.COLOR_ATHENSGRAY};
                                }
                                .route-corridor { 
                                    stroke: green;
                                    fill: none;
                                }
                                .route-corridor-shadow{
                                    stroke: #999;stroke-opacity: 0.4;
                                }
                                #goButton {
                                    position: absolute;
                                    top: 10px;
                                    right: 60px;
                                    padding: 10px;
                                    z-index: 400;
                                }                                  
                                .button {
                                  width: 45px;
                                  height: 45px;
                                  font-family: 'Roboto', sans-serif;
                                  font-size: 22px;
                                  text-transform: uppercase;
                                  letter-spacing: 2.5px;
                                  font-weight: 500;
                                  color: #000;
                                  background-color: #fff;
                                  border: none;
                                  border-radius: 45px;
                                  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
                                  transition: all 0.3s ease 0s;
                                  cursor: pointer;
                                  outline: none;
                                }
                                
                                .button:hover {
                                  background-color: #2EE59D;
                                  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
                                  color: #fff;
                                  transform: translateY(-7px);
                                }
                            </style>
                            <body style="padding: 0; margin: 0">
                            <div id="mapid" style="width: 100%; height: 100vh;"></div>
                            <button id="goButton" class="button"><i class="fa fa-location-arrow" aria-hidden="true"></i></button>
                            <script src="https://unpkg.com/leaflet@latest/dist/leaflet-src.js"></script>
                            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
                            <script src="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.js"></script>
                            <script src="https://leaflet.github.io/Leaflet.draw/src/Leaflet.Draw.Event.js"></script>
                            <script src="${Constants.Api.FILES_URL}/leaflet-corridor.js"></script>
                            <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
                            <script>
                                var mymap = L.map('mapid').setView([${lat}, ${lng}], 15);
                                var osm = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                                        maxZoom: 18,
                                        attribution: 'Map data &copy; OpenStreetMap contributors, ',
                                        id: 'mapbox/streets-v11'
                                }).addTo(mymap)
                                
                                var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                                    subdomains: 'abcd',
                                        maxZoom: 19
                                    });
                                    CartoDB_DarkMatter.addTo(mymap);
                                    
                                    // Google Map Layer                                    
                                    googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
                                        maxZoom: 20,
                                        subdomains:['mt0','mt1','mt2','mt3']
                                     });
                                     googleStreets.addTo(mymap);
                                    
                                     // Satelite Layer
                                    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
                                       maxZoom: 20,
                                       subdomains:['mt0','mt1','mt2','mt3']
                                     });
                                    googleSat.addTo(mymap);
                                    
                                    var baseLayers = {
                                        "Satellite":googleSat,
                                        "Google Map":googleStreets,
                                        "OpenStreetMap": osm,
                                    };
                                    var optionIMG = {
                                        opacity: 0.5
                                    };

                                    var imageUrl = '${Constants.Api.IMAGES_URL}/qhct.jpg',
                                    imageBounds = [[10.078374, 105.694685], [9.988524, 105.823085]];
                                    L.imageOverlay(imageUrl, imageBounds,optionIMG).addTo(mymap);

                                var drawnItems, drawControl;
                                //khai báo featuregroup để vẽ
                                drawnItems = L.featureGroup().addTo(mymap);	
                            
                                //Option của công cụ vẽ
                                var optionTools = {
                                    position: "topleft",
                                    draw: {
                                        polyline: {
                                            shapeOptions: {
                                                color: "#eb2f06",
                                                weight: 3,
                                                opacity: 1
                                            },
                                            metric: true, //default true là met; false là foot
                                        },
                                        polygon: {
                                            shapeOptions: {
                                                color: "#eb2f06",
                                                opacity: 1
                                            },
                                            showArea: true, //default false
                                        },
                                        rectangle: false,
                                        marker: false,
                                        circle: false,
                                        circlemarker: false, // Turns off this drawing tool
                                    },
                                    edit: {
                                        featureGroup: drawnItems,	//REQUIRED!!
                                        delete:false,
                                        edit:false,
                                    }
                                };
                                drawControl = new L.Control.Draw(optionTools).addTo(mymap);

                                //Khi vẽ thì thêm vào lớp drawnItems
                                function showText(e) {
                                    drawnItems.clearLayers();
                                    var layer = e.layer;
                                    var type = e.layerType;
                                    layer.addTo(drawnItems);

                                        if (type === "polygon") {
                                            var seeArea = L.GeometryUtil.geodesicArea(
                                                layer.getLatLngs()[0]
                                            );
                                            e.layer.bindPopup ( "Diện tích: " + seeArea.toFixed(3) + " m2");
                                            e.layer.openPopup();
                                        }
                                            
                                        if (type === "polyline") {
                                            var tempLatLng = null;
                                            var totalDistance = 0.0;
                                            $.each(e.layer._latlngs, function (i, latlng) {
                                                if (tempLatLng == null) {
                                                    tempLatLng = latlng;
                                                    return;
                                                }

                                                totalDistance += tempLatLng.distanceTo(latlng);
                                                tempLatLng = latlng;
                                            });
                                            // e.layer.bindTooltip("Khoảng cách:" + totalDistance.toFixed(2) + " m", {permanent: true});
                                            e.layer.bindPopup("Khoảng cách:" + totalDistance.toFixed(2) + " m");
                                            e.layer.openPopup();
                                        }                                 
                                }

                                //Khi một đối tượng được vẽ
                                mymap.on(L.Draw.Event.CREATED, showText);	

                                //Định các style cho point, line và polygon
                                var redIcon = L.icon({
                                    iconUrl: '${Constants.Api.IMAGES_URL}/redIcon.png',
                                    shadowUrl: null,
                                    iconAnchor: new L.Point(13, 41),
                                    iconSize: [25, 41],	
                                });
                                var lineStyle={color: "blue", weight: 2};
                                var lineStylePA={color: "red", weight: 2};
                                var polygonStylePA={color: "black", fillColor: "#FDEAC0", weight: 1.5, fillOpacity: 0.4};
                                var geojsonMarkerOptions = {
                                  radius: 8,
                                  fillColor: "#ff7800",
                                  color: "#000",
                                  weight: 1,
                                  opacity: 1,
                                  fillOpacity: 0.8
                                };

                                if(layerControl){
                                    mymap.removeControl(layerControl);
                                    mymap.removeLayer(grpRE);
                                    mymap.removeLayer(grpPA);
                                  }
                                var layerControl ;
                                //data geojson planning area
                                var geoPolygon=${JSON.stringify(zoningDataGeoJSONPolygon)};
                                var geoPolyline=${JSON.stringify(zoningDataGeoJSONPolyline)};
                                var geoPoint=${JSON.stringify(postDataGeoJSON)};

                                //Hàm kiểm tra marker có nằm trong vùng không??? có = true
                                function isMarkerInsidePolygon(marker, poly) {
                                    var x = marker.getLatLng().lng, y = marker.getLatLng().lat;
                                    var inside = false;
                                    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
                                        var xi = poly[i][0], yi = poly[i][1];
                                        var xj = poly[j][0], yj = poly[j][1];
                                        var intersect = ((yi > y) != (yj > y))
                                            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                                        if (intersect) inside = !inside;
                                    }                                                        
                                    return inside;
                                };
                                
                                var routingControl = null;
                                var addRoutingControl = function (lat1, lng1, lat2, lng2) {
                                    if (routingControl != null)
                                    removeRoutingControl();
                                    routingControl = L.Routing.control({
                                        waypoints: [
                                            L.latLng(lng1, lat1),
                                            L.latLng(lng2, lat2)
                                        ]
                                    }).addTo(mymap);
                                };
                            
                                var removeRoutingControl = function () {
                                    if (routingControl != null) {
                                        mymap.removeControl(routingControl);
                                        routingControl = null;
                                    }
                                };

                                //...................................Show Point........................

                                var markerOnMap = L.marker([${lat}, ${lng}], {icon:redIcon}).addTo(mymap); 
                                var id;
                                mymap.on('contextmenu', function (e) {
                                    if (markerOnMap !== null) {
                                        mymap.removeLayer(markerOnMap);
                                    }
                                    showMarker(L.marker(e.latlng));
                                    var latlng={lat:e.latlng.lng, lng:e.latlng.lat};
                                    mymap.panTo(new L.LatLng(e.latlng.lat, e.latlng.lng));
                                    markerOnMap = L.marker(e.latlng,{icon: redIcon }).addTo(mymap);
                                });
                                
                                function showMarker(marker){
                                    var isNotFind = true;
                                    geoPolygon.features.forEach((feature) => {
                                        if(isMarkerInsidePolygon(marker,feature.geometry.coordinates[0]) || isMarkerInsidePolygon(marker,feature.geometry.coordinates[0][0])){
                                            id = feature.properties.id;
                                            sendZoningID(id+"-"+marker.getLatLng().lng+"-"+ marker.getLatLng().lat);   
                                            isNotFind=false;                       
                                        }
                                    })
                                    if(isNotFind){
                                        var latlng={lat:marker.getLatLng().lng, lng:marker.getLatLng().lat};
                                        sendLatLng(latlng);
                                    }
                                }     
                                      
                                //..........................Show Polygon...........................
                                function onEachFeaturePolygon(feature, layer) {
                                    if(isMarkerInsidePolygon(markerOnMap,feature.geometry.coordinates[0])){
                                        id = feature.properties.id;
                                    }
                                }

                                var geoPolygonLayer = L.geoJSON(geoPolygon,{
                                    onEachFeature:onEachFeaturePolygon,
                                    style: function (feature) {
                                        switch (feature.geometry.type) {
                                            case 'LineString':   return lineStylePA;
                                            case 'Polygon':   return polygonStylePA;
                                            case 'MultiPolygon':   return polygonStylePA;
                                        }
                                    },
                                    pointToLayer: function (feature, latlng) {
                                    return L.circleMarker(latlng, geojsonMarkerOptions);
                                }}).addTo(mymap);       
                                
                                //................................>> Show Popup Point <<.........................
                                var geoPointLayer = L.geoJSON(geoPoint,{
                                    onEachFeature:onEachFeaturePoint
                                }).addTo(mymap);

                                function onEachFeaturePoint(feature, layer) {   
                                    if (feature.properties && feature.properties.title ) {
                                        layer.bindPopup('<h3>Tiêu đề: '+feature.properties.title+'</h3>' +
                                        '<p>Diện tích: '+feature.properties.area+'(m2)</p>'+
                                        '<p>Mức giá: '+feature.properties.price+'(Triệu/m2)</p>'+
                                        '<button type="button" class="btn btn-primary sidebar-open-button" onclick="handleDetail('+feature.properties.id+')">Xem chi tiết</button>'
                                        );
                                      }
                                }
                                //....................................>>Show Polyline<<.................
                                var geoPolylineLayer = L.geoJSON(geoPolyline,{
                                    onEachFeature:onEachFeaturePolyline
                                })

                                var corridor; 
                                function onEachFeaturePolyline(feature, layer) {     
                                    var arrGeoPolyline;
                                    if(feature.geometry.type=="MultiLineString"){
                                        arrGeoPolyline= feature.geometry.coordinates[0];
                                    }else{
                                        arrGeoPolyline= feature.geometry.coordinates;
                                    }
                                    var arrLatlngGeoPolyline=[];
                                    arrGeoPolyline.forEach((item)=>{
                                        arrLatlngGeoPolyline.push(L.latLng(item[1],item[0]));
                                    })            
                                    var options = { 
                                        corridor: feature.properties.width, // meters
                                        className: 'route-corridor', 
                                    };
                                    corridor = L.corridor([arrLatlngGeoPolyline], options);
                                    corridor.addTo(mymap);
                                }
                                var overlays = {
                                    "Bài đăng":geoPointLayer,
                                    "Quy hoạch đường":corridor,
                                    "Quy hoạch vùng":geoPolygonLayer
                                };
                                L.control.layers(baseLayers, overlays).addTo(mymap);

                                function handleDetail(id){
                                    window.ReactNativeWebView.postMessage(JSON.stringify(id));
                                }
                                const sendLatLng = (latlng) => {
                                    window.ReactNativeWebView.postMessage(JSON.stringify(latlng));
                                };
                                const sendZoningID = async (zoning_id) => {
                                    window.ReactNativeWebView.postMessage(JSON.stringify(zoning_id));
                                };
                                if(${lat}){
                                    showMarker(L.marker([${lat},${lng}]));
                                }
                                const goLocation = () => {
                                    if(${lat}){
                                        showMarker(L.marker([${lat},${lng}]));
                                        if (markerOnMap !== null) {
                                            mymap.removeLayer(markerOnMap);
                                        }
                                        mymap.setView([${lat}, ${lng}], 15);
                                        markerOnMap = L.marker([${lat}, ${lng}], {icon:redIcon}).addTo(mymap); 
                                    }
                                };                                
                                $("#goButton").on("click", goLocation);
                            </script>
                            </body>
                            </html>
                    `}}
                />
                <DialogCustom
                    show={showDialog}
                    type={typeDialog}
                    content={contentDialog}
                    onPressIn={() => setShowDialog(false)}
                />

            </View >
        )
    }
}

export default Home

