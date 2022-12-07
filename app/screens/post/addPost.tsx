//import
import React, { useState, useEffect } from "react"
import { RootState } from "@app/store";
import Constants from "@app/constants";
import Strings from "@app/commons/strings";
import styles from "@app/screens/post/style";
import { WebView } from "react-native-webview";
import HeaderComp from "@app/components/HeaderComp";
import ScreenName from "@app/navigation/screenName";
import { useDispatch, useSelector } from "react-redux";
import Geolocation from "@react-native-community/geolocation";
import axios from "axios";

//Image
import { Map } from "@app/assets/images"

//element
import TextInput from "@app/components/TextInput";
import DialogCustom from "@app/components/Dialog";
import { Picker } from "@react-native-picker/picker";
import ImagePicker from "react-native-image-crop-picker";
import { Image, Icon, Button, Dialog, Text } from "@rneui/themed";
import { IDataPost, IErrorDataPost } from "@app/commons/interfaces";
import { View, ScrollView, TouchableOpacity, ImageBackground, PermissionsAndroid, FlatList, SafeAreaView, StyleSheet, ActivityIndicator } from "react-native"
import {
    storeAddressInfo
} from "../../store/slice/post.slice";
//function
import Loading from "@app/screens/loading";
import UserService from "@app/services/user.service";
import ProvinceService from "@app/services/province.service";
import WardService from "@app/services/ward.service";
import DistrictService from "@app/services/district.service";
import postService from "@app/services/post.service";

const PostService = new postService();
const userService = new UserService();
const provinceService = new ProvinceService();
const districtService = new DistrictService();
const wardService = new WardService();

const AddPost = ({ route, navigation }: any) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [visible1, setVisible1] = useState(false);
    const [typeof_post, setTypeof_post] = useState();
    const toggleDialog1 = () => {
        if (geojsonBorder) {
            setVisible1(!visible1);
            updateErrorInfo({
                errorProvinceMsg: "",
                errorDistrictMsg: "",
                errorWardMsg: "",
            })
        } else {
            updateErrorInfo({
                errorProvinceMsg: Strings.Zoning.PROVINCE_REQUIRE_MESSAGE,
                errorDistrictMsg: Strings.Zoning.DISTRICT_REQUIRE_MESSAGE,
                errorWardMsg: Strings.Zoning.WARD_REQUIRE_MESSAGE
            })
        }
    };
    const [showDialog, setShowDialog] = useState(false);
    const [typeDialog, setTypeDialog] = useState("");
    const [contentDialog, setContentDialog] = useState("");

    const [lat, setLat] = useState<any>();
    const [lng, setLng] = useState<any>();
    const { userInfo } = useSelector(
        (state: RootState) => state.user
    );
    const { addressStoreInfo } = useSelector(
        (state: RootState) => state.post
    );

    const [Post, setPost] = React.useState<IDataPost>({
        user_id: userInfo.id || "",
        title: "Nhà trệt 2 lầu và lửng",
        address: "Đường Số 3, Phường An Khánh, Quận Ninh Kiều, Cần Thơ",
        description: "Nhà có mặt tiền hướng ra công viên, có giấy tờ đầy đủ, giá cả thương lượng",
        area: 99.4,
        price: 155.94,
        bedroom: 3,
        toilet: 3,
        structure: 0,
        typeof_posts_id: typeof_post,
        typeof_real_estate_id: "10",
        furniture_id: "2",
        juridical_id: "4",
    });

    const updatePostInfo = (newState: IDataPost) => {
        setPost((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const [errorInfo, setErrorInfo] = React.useState<IErrorDataPost>({
    });

    const updateErrorInfo = (newState: IErrorDataPost) => {
        setErrorInfo((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const handleGetLocation = () => {
        Geolocation.getCurrentPosition(info => {
            setLat(info.coords.latitude);
            setLng(info.coords.longitude);
        });
    }

    const [typeRealEstateData, setRealEstateData] = React.useState([]);
    const handleGetTypeRealEstateList = async () => {
        try {
            const result = await PostService.handleGetTypeofRealEstate();
            setRealEstateData(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    const [juridicalData, setJuridicalData] = React.useState([]);
    const handleGetJuridicalData = async () => {
        try {
            const result = await PostService.handleGetJuridical();
            setJuridicalData(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    const [furnitureData, setFurnitureData] = React.useState([]);
    const handleGetFurnitureDataList = async () => {
        try {
            const result = await PostService.handleGetFurniture();
            setFurnitureData(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    const [provinceData, setProvinceData] = React.useState([]);
    const handleGetProvinceList = async () => {
        try {
            const result = await userService.handleGetProvinceList();
            setProvinceData(result.data.provinces);
        } catch (err) {
            console.log(err);
        }
    }

    const [districtData, setDistrictData] = React.useState([]);
    const handleGetDistrict = async (province_id: any) => {
        try {
            const result = await userService.handleGetDistrictByProvince(province_id);
            setDistrictData(result.data.district);
        } catch (err) {
            console.log(err);
        }
    }

    const [wardData, setWardData] = React.useState([]);
    const handleGetWard = async (province_id: any, district_id: any) => {
        try {
            const result = await userService.handleGetWardList(province_id, district_id);
            setWardData(result.data.ward);
        } catch (err) {
            console.log(err);
        }
    }

    const [streetData, setStreetData] = React.useState([]);
    const handleGetStreet = async (province_id: any, district_id: any) => {
        try {
            const result = await userService.handleGetStreetList(province_id, district_id);
            setStreetData(result.data.streets);
        } catch (err) {
            console.log(err);
        }
    }

    const [polygonBorder, setPolygonBorder] = React.useState();
    const [geojsonBorder, setGeoJSONBorder] = React.useState();
    //lấy ranh giới tỉnh
    const handleBorderProvince = async (province_id: any) => {
        try {
            var result = await provinceService.handleGetBorderProvince(province_id);
            if (result.data && result.data[0].json_build_object) {
                setPolygonBorder(result.data[0].json_build_object.features[0].geometry.coordinates[0]);
                setGeoJSONBorder(result.data[0].json_build_object);
            }
        } catch (err) {
            console.log(err);
        }
    }
    //lấy ranh giới huyện
    const handleBorderDistrict = async (district_id: any) => {
        try {
            var result = await districtService.handleGetBorderDistrict(district_id);
            if (result.data && result.data[0].json_build_object) {
                setPolygonBorder(result.data[0].json_build_object.features[0].geometry.coordinates[0]);
                setGeoJSONBorder(result.data[0].json_build_object);
            }
        } catch (err) {
            console.log(err);
        }
    }
    //lấy ranh giới xã
    const handleBorderWard = async (ward_id: any) => {
        try {
            var result = await wardService.handleGetBorderWard(ward_id);
            if (result.data && result.data[0].json_build_object) {
                setPolygonBorder(result.data[0].json_build_object.features[0].geometry.coordinates[0]);
                setGeoJSONBorder(result.data[0].json_build_object);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleClickProvince = (province_id: any) => {
        if (province_id == 0) {
            updatePostInfo({ province_id: "", district_id: "", ward_id: "", street_id: "" });
            setGeoJSONBorder(undefined);
            setDistrictData([]);
            setWardData([]);
        } else {
            updatePostInfo({ province_id: province_id, district_id: "", ward_id: "", street_id: "" });
            handleGetDistrict(province_id);
            handleBorderProvince(JSON.stringify(province_id));
        }
        updatePostInfo({ coordinates: "", area: 0 });
    }

    const handleClickDistrict = (province_id: any, district_id: any) => {
        if (district_id == 0) {
            updatePostInfo({ district_id: "", ward_id: "", street_id: "" });
            handleBorderProvince(province_id);
            setWardData([]);
        } else {
            updatePostInfo({ district_id: district_id, ward_id: "", street_id: "" });
            handleGetWard(province_id, district_id);
            handleGetStreet(province_id, district_id);
            handleBorderDistrict(JSON.stringify(district_id));
        }
        updatePostInfo({ coordinates: "", area: 0 });
    }

    const handleClickWard = (ward_id: any) => {
        if (ward_id == 0) {
            updatePostInfo({ ward_id: "" });
            handleBorderDistrict(Post.district_id);
        } else {
            updatePostInfo({ ward_id: ward_id });
            handleBorderWard(JSON.stringify(ward_id));
        }
        updatePostInfo({ coordinates: "", area: 0 });
    }

    const handleClickStreet = (street_id: any) => {
        if (street_id == 0) {
            updatePostInfo({ street_id: "" });
            handleBorderDistrict(Post.district_id);
        } else {
            updatePostInfo({ street_id: street_id });
        }
        updatePostInfo({ coordinates: "", area: 0 });
    }

    const handleGetData = async (post_id: any) => {
        try {
            const result = await PostService.getGeoJSON(post_id);
            const data = result.data[0].json_build_object.features[0];
            updatePostInfo({
                id: data.properties.id,
                title: data.properties.title,
                price: data.properties.price,
                address: data.properties.address,
                area: data.properties.area,
                juridical_id: data.properties.juridical_id,
                furniture_id: data.properties.furniture_id,
                structure: data.properties.structure,
                bedroom: data.properties.bedroom,
                toilet: data.properties.toilet,
                street_id: data.properties.street_id,
                description: data.properties.description,
                typeof_real_estate_id: data.properties.typeof_real_estate_id,
                typeof_posts_id: data.properties.typeof_posts_id,
            });
            updateInfoAddress(data.properties.province_id, data.properties.district_id, data.properties.ward_id);
            updatePostInfo({ coordinates: data.geometry })
            handleChangeArea(data.properties.area);
            const resultImage = await PostService.getImages(data.properties.id);
            var arrImage = resultImage.data.map((image: any, ind: any) => {
                return `${Constants.Api.IMAGES_URL}/${image.name}`
            })
            setImageList(arrImage);
            setTypeof_post(data.properties.typeof_posts_id);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    const updateInfoAddress = (province_id: any, district_id: any, ward_id: any) => {
        if (province_id) {
            handleClickProvince(province_id);
        }
        if (district_id) {
            handleClickDistrict(province_id, district_id);
        }
        if (ward_id) {
            handleClickWard(ward_id);
            handleBorderWard(ward_id);
        }
        updatePostInfo({
            province_id: province_id, district_id: district_id, ward_id: ward_id
        });
    }
    const handleChangeArea = (area: any) => {
        updatePostInfo({ area: area })
    }

    useEffect(() => {
        const { typeof_post } = route.params;
        if (typeof_post) {
            setTypeof_post(typeof_post);
        }
        handleGetTypeRealEstateList();
        handleGetFurnitureDataList();
        handleGetJuridicalData();
        handleGetProvinceList();
        const { post_id } = route.params;
        if (post_id) {
            handleGetData(post_id);
        }
        if (addressStoreInfo.lat_store !== undefined) {
            updateInfoAddress(addressStoreInfo.province_id, addressStoreInfo.district_id, addressStoreInfo.ward_id);
            setLat(addressStoreInfo.lat_store);
            setLng(addressStoreInfo.lng_store);
            updatePostInfo({ coordinates: JSON.stringify({ "coordinates": [addressStoreInfo.lat_store, addressStoreInfo.lng_store], "type": "Point" }) })
        } else {
            handleGetLocation();
        }
        handleRemoveAddressStore();
    }, [typeof_post]);

    const handleRemoveAddressStore = () => {
        dispatch(storeAddressInfo({}));
    }

    const isNull = (val: any) => {
        if (val === null || val === undefined || val === "")
            return true;
        else
            return false;
    }

    //Nhận data từ WebView
    function onMessage(payload: any) {
        let dataPayload;
        try {
            dataPayload = JSON.parse(payload.nativeEvent.data);
        } catch (e) {
            console.log(e);
        }
        if (typeof dataPayload === "number") {
            updatePostInfo({ area: dataPayload });
        }
        updatePostInfo({ coordinates: JSON.stringify(dataPayload.features[0].geometry) });
        toggleDialog1();
    }

    const [imageList, setImageList] = useState([]);
    const handleUploadImage = async () => {
        const result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (!result) {
            setShowDialog(true);
            setTypeDialog("warning");
            setContentDialog(Strings.Message.ACCESS_CAMERA_MESSAGE);
        } else {
            ImagePicker.openPicker({
                multiple: true,
                waitAnimationEnd: false,
                includeExif: true,
                forceJpg: true,
                maxFiles: 7,
                compressImageQuality: 0.8,
                mediaType: "photo",
                sortOrder: "desc",
            })
                .then((images: any) => {
                    if (images.length > 20) {
                        setShowDialog(true);
                        setTypeDialog("warning");
                        setContentDialog(Strings.Zoning.WARNING_MAX_IMAGE);
                    } else {
                        updatePostInfo({ dataImage: images });
                        let arrImages = images.map((i: any, ind: any) => { return i.path })
                        setImageList(arrImages);
                    }
                })
                .catch((e) => console.log(e));
        }
    }

    const checkError = () => {
        let flatTitle, flatP, flatCoor, flatAD, flatI, flatPrice, flatArea = true;
        if (isNull(Post.title)) {
            flatTitle = true;
            updateErrorInfo({
                errorTitleMsg: Strings.Zoning.NAME_REQUIRE_MESSAGE
            })
        } else {
            flatTitle = false;
            updateErrorInfo({
                errorTitleMsg: ""
            })
        }

        if (!Post.price || Post.price <= 0) {
            flatPrice = true;
            updateErrorInfo({
                errorPriceMsg: Strings.Post.PRICE_REQUIRE_MESSAGE
            })
        } else {
            flatPrice = false;
            updateErrorInfo({
                errorPriceMsg: ""
            })
        }

        if (!Post.area || Post.area <= 0) {
            flatArea = true;
            updateErrorInfo({
                errorAreaMsg: Strings.Post.AREA_REQUIRE_MESSAGE
            })
        } else {
            flatArea = false;
            updateErrorInfo({
                errorAreaMsg: ""
            })
        }

        if (isNull(Post.province_id)) {
            flatP = true;
            updateErrorInfo({
                errorProvinceMsg: Strings.Zoning.PROVINCE_REQUIRE_MESSAGE
            })
        } else {
            flatP = false;
            updateErrorInfo({
                errorProvinceMsg: ""
            })
        }

        if ((typeof_post == 1 || typeof_post == 3) && !Post.dataImage?.length && !Post.id) {
            flatI = true;
            updateErrorInfo({
                errorDataImageMsg: Strings.Zoning.DATA_IMAGE_REQUIRE_MESSAGE
            })
        } else {
            flatI = false;
            updateErrorInfo({
                errorDataImageMsg: ""
            })
        }

        if ((typeof_post == 1 || typeof_post == 3) && isNull(Post.address)) {
            flatAD = true;
            updateErrorInfo({
                errorAddressMsg: Strings.Zoning.ADDRESS_REQUIRE_MESSAGE
            })
        } else {
            flatAD = false;
            updateErrorInfo({
                errorAddressMsg: ""
            })
        }

        if (isNull(Post.coordinates)) {
            flatCoor = true;
            updateErrorInfo({
                errorCoordinatesMsg: Strings.Zoning.LOCATION_REQUIRE_MESSAGE
            })
        } else {
            flatCoor = false;
            updateErrorInfo({
                errorCoordinatesMsg: ""
            })
        }
        if (flatPrice == false && flatCoor == false && flatTitle == false && flatP == false && flatAD == false && flatI == false && flatArea == false)
            return true;
        else
            return false;
    }

    const handleSave = async () => {
        if (checkError()) {
            console.log(Post)
            setShowDialog(true);
            setTypeDialog(Strings.System.LOADNING);
            setContentDialog(Strings.Message.WAITTING_MESSAGE);
            const formData = new FormData();
            formData.append("title", Post.title);
            formData.append("area", Post.area);
            formData.append("price", Post.price);
            formData.append("furniture_id", Post.furniture_id);
            formData.append("juridical_id", Post.juridical_id);
            formData.append("bedroom", Post.bedroom);
            formData.append("toilet", Post.toilet);
            formData.append("structure", Post.structure);
            formData.append("address", Post.address);
            formData.append("coordinates", Post.coordinates ? JSON.stringify(Post.coordinates) : null);
            formData.append("description", Post.description ? Post.description : " ");
            formData.append("user_id", Post.user_id);
            formData.append("province_id", Post.province_id ? Post.province_id : "");
            formData.append("district_id", Post.district_id ? Post.district_id : "");
            formData.append("ward_id", Post.ward_id ? Post.ward_id : "");
            formData.append("street_id", Post.street_id ? Post.street_id : "");
            formData.append("typeof_posts_id", Post.typeof_posts_id);
            formData.append("typeof_real_estate_id", Post.typeof_real_estate_id);
            formData.append("status_id", 1);
            Post.dataImage && Post.dataImage.forEach((image: any, index: any) => {
                formData.append("dataImage", {
                    uri: image.path,
                    name: image.filename || Math.floor(Math.random() * Math.floor(999999999)) + ".jpg",
                    type: image.mime || "image/jpeg"
                })
            })
            axios.post(Constants.Api.BASE_URL + Constants.ApiPath.ADD_POST, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then(function (res) {
                    setShowDialog(true);
                    setTypeDialog(Strings.System.SUCCESS);
                    setContentDialog(res.data.data.message);
                    setTimeout(() => {
                        setShowDialog(false);
                        setTypeDialog("");
                        setContentDialog("");
                        navigation.navigate(ScreenName.HOME)
                    }, 1500);
                })
                .catch(function (error) {
                    if (error.response.status !== 200) {
                        console.log(error)
                        setShowDialog(true);
                        setTypeDialog(Strings.System.WARNING);
                        setContentDialog(error.response.data.data.message);
                    } else {
                        setShowDialog(true);
                        setTypeDialog(Strings.System.WARNING);
                        setContentDialog(error.message);
                    }

                });
        }
        handleRemoveAddressStore();
    }
    const handleUpdate = async () => {
        if (checkError()) {
            console.log(Post);
            setShowDialog(true);
            setTypeDialog(Strings.System.LOADNING);
            setContentDialog(Strings.Message.WAITTING_MESSAGE);
            const formData = new FormData();
            formData.append("id", Post.id);
            formData.append("title", Post.title);
            formData.append("area", Post.area);
            formData.append("price", Post.price);
            formData.append("furniture_id", Post.furniture_id);
            formData.append("juridical_id", Post.juridical_id);
            formData.append("bedroom", Post.bedroom);
            formData.append("toilet", Post.toilet);
            formData.append("structure", Post.structure);
            formData.append("address", Post.address);
            formData.append("coordinates", Post.coordinates ? JSON.stringify(Post.coordinates) : null);
            formData.append("description", Post.description ? Post.description : " ");
            formData.append("user_id", Post.user_id);
            formData.append("province_id", Post.province_id ? Post.province_id : "");
            formData.append("district_id", Post.district_id ? Post.district_id : "");
            formData.append("ward_id", Post.ward_id ? Post.ward_id : "");
            formData.append("street_id", Post.street_id ? Post.street_id : "");
            formData.append("typeof_posts_id", Post.typeof_posts_id);
            formData.append("typeof_real_estate_id", Post.typeof_real_estate_id);
            formData.append("status_id", 1);
            axios.post(Constants.Api.BASE_URL + Constants.ApiPath.UPDATE_POST, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then(function (res) {
                    setShowDialog(true);
                    setTypeDialog(Strings.System.SUCCESS);
                    setContentDialog(res.data.data.message);
                    setTimeout(() => {
                        setShowDialog(false);
                        setTypeDialog("");
                        setContentDialog("");
                        navigation.navigate(ScreenName.POSTLIST)
                    }, 1500);
                })
                .catch(function (error) {
                    if (error.response.status !== 200) {
                        console.log(error)
                        setShowDialog(true);
                        setTypeDialog(Strings.System.WARNING);
                        setContentDialog(error.response.data.data.message);
                    } else {
                        setShowDialog(true);
                        setTypeDialog(Strings.System.WARNING);
                        setContentDialog(error.message);
                    }
                });
        }
    }

    if (isLoading) {
        return (
            <Loading />
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <HeaderComp title={Strings.Post.ADD_POST} goBack={() => navigation.goBack()} />
                <View style={styles.box_input}>
                    <ScrollView nestedScrollEnabled={true} style={{ width: "100%" }}>
                        <TextInput
                            secure={false}
                            value={Post.title}
                            label={Strings.Post.NAME}
                            errorMessage={errorInfo.errorTitleMsg}
                            onChangeText={(val: any) => { updatePostInfo({ title: val }) }}
                        />
                        <Text style={styles.label_dropdown_style}>{Strings.Post.TYPEOF_REAL_ESTATE}</Text>
                        <View style={{ marginBottom: 7 }}>
                            <Picker
                                selectedValue={Post.typeof_real_estate_id}
                                onValueChange={(itemValue, itemIndex) =>
                                    updatePostInfo({ typeof_real_estate_id: itemValue })
                                }
                            >
                                {typeRealEstateData &&
                                    typeRealEstateData.map((val: any, ind: any) => {
                                        return (
                                            <Picker.Item key={ind} label={val.name} value={val.id} />
                                        )
                                    })
                                }
                            </Picker>
                            {errorInfo.errorTypeof_real_estate_idMsg != null && <Text style={styles.error_info}>{errorInfo.errorTypeof_real_estate_idMsg}</Text>}
                        </View>
                        <Text style={styles.label_dropdown_style}>{Strings.Post.JURIDICAL}</Text>
                        <View style={{ marginBottom: 7 }}>
                            <Picker
                                selectedValue={Post.juridical_id}
                                onValueChange={(itemValue, itemIndex) =>
                                    updatePostInfo({ juridical_id: itemValue })
                                }
                            >
                                {juridicalData &&
                                    juridicalData.map((val: any, ind: any) => {
                                        return (
                                            <Picker.Item key={ind} label={val.name} value={val.id} />
                                        )
                                    })
                                }
                            </Picker>
                            {errorInfo.errorJuridical_idMsg != null && <Text style={styles.error_info}>{errorInfo.errorJuridical_idMsg}</Text>}
                        </View>
                        <Text style={styles.label_dropdown_style}>{Strings.Post.FURNITURE}</Text>
                        <View style={{ marginBottom: 7 }}>
                            <Picker
                                selectedValue={Post.furniture_id}
                                onValueChange={(itemValue, itemIndex) =>
                                    updatePostInfo({ furniture_id: itemValue })
                                }
                            >
                                {furnitureData &&
                                    furnitureData.map((val: any, ind: any) => {
                                        return (
                                            <Picker.Item key={ind} label={val.name} value={val.id} />
                                        )
                                    })
                                }
                            </Picker>
                            {errorInfo.errorFurniture_idMsg != null && <Text style={styles.error_info}>{errorInfo.errorFurniture_idMsg}</Text>}
                        </View>
                        <Text style={styles.label_style}>Vị trí</Text>
                        <Picker
                            selectedValue={Post.province_id}
                            onValueChange={(itemValue, itemIndex) =>
                                handleClickProvince(itemValue)
                            }
                        >
                            <Picker.Item label={Strings.Zoning.PROVINCE} value={0} />
                            {provinceData &&
                                provinceData.map((val: any, ind: any) => {
                                    return (
                                        <Picker.Item key={ind} label={val.name} value={val.id} />
                                    )
                                })
                            }
                        </Picker>
                        {errorInfo.errorProvinceMsg != null && <Text style={styles.error_info}>{errorInfo.errorProvinceMsg}</Text>}
                        <Picker
                            selectedValue={Post.district_id}
                            onValueChange={(itemValue, itemIndex) =>
                                handleClickDistrict(Post.province_id, itemValue)
                            }
                        >
                            <Picker.Item label={Strings.Zoning.DISTRICT} value={0} />
                            {districtData &&
                                districtData.map((val: any, ind: any) => {
                                    return (
                                        <Picker.Item key={ind} label={val.name} value={val.id} />
                                    )
                                })
                            }
                        </Picker>
                        {errorInfo.errorDistrictMsg != null && <Text style={styles.error_info}>{errorInfo.errorDistrictMsg}</Text>}
                        <Picker
                            selectedValue={Post.ward_id}
                            onValueChange={(itemValue, itemIndex) =>
                                handleClickWard(itemValue)}
                        >
                            <Picker.Item label={Strings.Zoning.WARD} value={0} />
                            {wardData &&
                                wardData.map((val: any, ind: any) => {
                                    return (
                                        <Picker.Item key={ind} label={val.name} value={val.id} />
                                    )
                                })
                            }
                        </Picker>
                        {errorInfo.errorWardMsg != null && <Text style={styles.error_info}>{errorInfo.errorWardMsg}</Text>}
                        <Picker
                            selectedValue={Post.street_id}
                            onValueChange={(itemValue, itemIndex) =>
                                handleClickStreet(itemValue)}
                        >
                            <Picker.Item label={Strings.Post.SELECT_STREET} value={0} />
                            {streetData &&
                                streetData.map((val: any, ind: any) => {
                                    return (
                                        <Picker.Item key={ind} label={val.name} value={val.id} />
                                    )
                                })
                            }
                        </Picker>
                        {errorInfo.errorStreet_idMsg != null && <Text style={styles.error_info}>{errorInfo.errorStreet_idMsg}</Text>}

                        <TouchableOpacity
                            onPress={toggleDialog1}
                        >
                            <ImageBackground
                                source={Map}
                                resizeMode="cover"
                                style={{
                                    height: 100,
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: Constants.Styles.COLOR_BLACK,
                                    marginBottom: 5
                                }}
                                imageStyle={{ opacity: 0.5 }}
                            >
                                <Text style={{ color: Constants.Styles.CORLOR_WHITE, fontSize: 15, fontWeight: "600" }}>{Strings.Zoning.BUTTON_DEFINE_LOCATION}</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        {errorInfo.errorCoordinatesMsg != null && <Text style={styles.error_info}>{errorInfo.errorCoordinatesMsg}</Text>}
                        {(typeof_post == 1 || typeof_post == 3) &&
                            <TextInput
                                secure={false}
                                value={Post.address}
                                label={Strings.Zoning.ADDRESS}
                                errorMessage={errorInfo.errorAddressMsg}
                                onChangeText={(val: any) => { updatePostInfo({ address: val }) }}
                            />}
                        <TextInput
                            secure={false}
                            keyboardType="numeric"
                            value={Post.area + ""}
                            label={Strings.Zoning.AREA}
                            onChangeText={(val: any) => { handleChangeArea(val) }}
                        />
                        {errorInfo.errorAreaMsg != null && <Text style={styles.error_info}>{errorInfo.errorAreaMsg}</Text>}
                        <TextInput
                            secure={false}
                            keyboardType="numeric"
                            value={Post.price + ""}
                            label={(Post.typeof_posts_id == "3" || Post.typeof_posts_id == "4") ? "Mức giá" : Strings.Post.PRICE}
                            onChangeText={(val: any) => { updatePostInfo({ price: val }) }}
                        />
                        {errorInfo.errorPriceMsg != null && <Text style={styles.error_info}>{errorInfo.errorPriceMsg}</Text>}
                        <TextInput
                            secure={false}
                            keyboardType="numeric"
                            value={Post.bedroom + ""}
                            label={Strings.Post.BEDROOM}
                            onChangeText={(val: any) => { updatePostInfo({ bedroom: val }) }}
                        />
                        <TextInput
                            secure={false}
                            keyboardType="numeric"
                            value={Post.toilet + ""}
                            label={Strings.Post.TOILET}
                            onChangeText={(val: any) => { updatePostInfo({ toilet: val }) }}
                        />
                        <TextInput
                            secure={false}
                            keyboardType="numeric"
                            value={Post.structure + ""}
                            label={Strings.Post.STRUCTURE}
                            onChangeText={(val: any) => { updatePostInfo({ structure: val }) }}
                        />
                        {(typeof_post == 1 || typeof_post == 3) && (
                            <>
                                <Text style={styles.label_style}>Hình ảnh</Text>
                                <ScrollView horizontal={true} style={{ width: "100%", height: "100%" }}>
                                    <FlatList
                                        data={imageList.map((i) => i)}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor: Constants.Styles.COLOR_ATHENSGRAY,
                                        }}
                                        numColumns={2}
                                        keyExtractor={(e) => e}
                                        renderItem={({ item }) => (
                                            <Image
                                                source={{ uri: item }}
                                                containerStyle={{
                                                    aspectRatio: 1,
                                                    width: 143,
                                                    height: 143,
                                                    flex: 1,
                                                    margin: 3,
                                                    borderRadius: 7
                                                }
                                                }
                                                PlaceholderContent={<ActivityIndicator />}
                                            />
                                        )}
                                    />
                                </ScrollView>
                                <Button
                                    type="clear"
                                    onPress={() => { handleUploadImage() }}
                                    buttonStyle={{ borderRadius: 10, padding: 7 }}
                                    titleStyle={{ color: Constants.Styles.COLOR_CHETWODE_BLUE, margin: 2 }}
                                >
                                    Tải ảnh
                                    <Icon name="cloud-upload-outline" color={Constants.Styles.COLOR_CHETWODE_BLUE} type={Constants.Styles.ICON_STYLE_FONT_IONICON} />
                                </Button>
                            </>
                        )}
                        {errorInfo.errorDataImageMsg != null && <Text style={styles.error_info}>{errorInfo.errorDataImageMsg}</Text>}
                        <Text style={styles.label_style}>Mô tả</Text>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            maxLength={1000}
                            onChangeText={(text) => {
                                updatePostInfo({ description: text })
                            }}
                            value={Post.description} />
                        {!Post.id ? <Button
                            title={Strings.Common.CONFIRM}
                            buttonStyle={{ backgroundColor: Constants.Styles.COLOR_AMBER, borderRadius: Constants.Styles.BORDER_RADIUS, height: Constants.Styles.TEXT_INPUT_HEIGHT }}
                            titleStyle={{ color: Constants.Styles.COLOR_BLACK, fontSize: Constants.Styles.TEXT_INPUT_FONTSIZE }}
                            onPress={() => { handleSave() }}
                        /> :
                            <Button
                                title={Strings.Common.UPDATE}
                                buttonStyle={{ backgroundColor: Constants.Styles.COLOR_AMBER, borderRadius: Constants.Styles.BORDER_RADIUS, height: Constants.Styles.TEXT_INPUT_HEIGHT }}
                                titleStyle={{ color: Constants.Styles.COLOR_BLACK, fontSize: Constants.Styles.TEXT_INPUT_FONTSIZE }}
                                onPress={() => { handleUpdate() }}
                            />}
                        <DialogCustom
                            show={showDialog}
                            type={typeDialog}
                            content={contentDialog}
                            onPressIn={() => setShowDialog(false)}
                        />
                        <Dialog
                            isVisible={visible1}
                            onBackdropPress={toggleDialog1}
                            overlayStyle={{ width: "95%", padding: 0 }}
                        >
                            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                                <Dialog.Title title={Strings.Post.DEFINE_LOCATION} titleStyle={{ color: "black", fontWeight: "500", fontSize: 16, paddingTop: 10, paddingLeft: 10, width: "80%" }} />
                                <Dialog.Actions>
                                    <Dialog.Button onPress={toggleDialog1} ><Icon reverse name="close" type={Constants.Styles.ICON_STYLE_FONT_IONICON} color={Constants.Styles.COLOR_GHOST} size={10} /></Dialog.Button>
                                </Dialog.Actions>
                            </View>
                            <Dialog.Actions>
                                <View style={{ flex: 1, height: 620, width: "100%", padding: 0 }}>
                                    <WebView
                                        originWhitelist={["*"]}
                                        onMessage={onMessage}
                                        source={{
                                            html: `
<!DOCTYPE html>
    <html>
    <head>
        <title>Quick Start - Leaflet</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="initial-scale=1.0">
        <link rel="shortcut icon" type="image/x-icon" href="docs/images/favicon.ico" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin=""/>
        <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
        <script src="https://unpkg.com/jquery@3.6.0/dist/jquery.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>        
        <script src="${Constants.Api.FILES_URL}/leaflet-corridor.js"></script>
        <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    </head>
    <style>										<!--tạo style cho trang web-->
        html, body {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        #mapid { 
            display: inline-block;
            height: 90%;
            width: 90%;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        }
        #file {
            margin-top: 5px;
        }
        #submit {
            color: white;
            border:none;
            border-radius: 10px;
            background-color: #82ccdd;
            margin: 10px 0px 10px 30px;
            padding: 7px 24px;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        }
        #sample{
            text-align: left;
        }
        #text_sample{
            margin: 5px 0px 0px 15px;
        }
        html {
            height: 100%;
        }
    </style>
    <body style="padding: 0; margin: 0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.css" />
    <script src="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.js"></script> 
    <script src="https://leaflet.github.io/Leaflet.draw/src/Leaflet.Draw.Event.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@0.4.0/dist/leaflet.draw.css"/> 
    <div id="mapid"></div>
    <input id="file" type="file" value="Upload file GeoJSON">
    <input type="button" id="submit" value="Xác nhận">
        <script>
        var mymap = L.map("mapid").setView([${lat},${lng}], 17);
        var osm = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", {
            maxZoom: 18,
            attribution: "Map data &copy; OpenStreetMap contributors, ",
            id: "mapbox/streets-v11"
        })
        osm.addTo(mymap);        
        //..................................>> Định các style cho point, line và polygon <<..................................
        var lineStyle={color: "blue", weight: 5};
        var polygonStyleBorder={color: "red",weight: '1.5', dashArray: '2', dashOffset: '20', fillColor: "white", fillOpacity: 0.1};
        var polygonStyle={color: "yellow", fillColor: "purple", weight: 1.5, fillOpacity: 0.1};
        
        //..................................>> Khai báo <<..................................
        var k=1;
        var drawnItems, drawControl;
        if(drawnItems){
            mymap.removeLayer(drawnItems);
        }
        if(drawControl){
            mymap.removeControl(drawControl);
        }
        //khai báo featuregroup để vẽ
        drawnItems = L.featureGroup().addTo(mymap);	

        //Option của công cụ vẽ
        var optionTools = {
            position: "topleft",
            draw: {
                marker:true,
                polygon: false,
                polyline: false,
                circle:false,
                rectangle:false,
                circlemarker:false
            },
            edit: {
                featureGroup: drawnItems,	//REQUIRED!!
                delete:true,
                edit:true
            }
        };
        drawControl = new L.Control.Draw(optionTools).addTo(mymap);

        //..................................>> Thêm ranh giới <<..................................
        var Geo=${JSON.stringify(geojsonBorder)}
        var provincePlayer = L.geoJSON(Geo,{
            style: polygonStyleBorder
        });
        provincePlayer.addTo(mymap);
        mymap.fitBounds(provincePlayer.getBounds());

        //..................................>> Hàm kiểm tra marker có nằm trong trong ranh giới không??? có = true <<..................................
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
        //..................................>> Hiển thị POLYGON <<..................................
        //Cho phép sửa item sau khi đã thêm
        function addNonGroupLayers(sourceLayer, targetGroup) {
            if (sourceLayer instanceof L.LayerGroup) {
                sourceLayer.eachLayer(function (layer) {
                    addNonGroupLayers(layer, targetGroup);
                });
            } else {
                targetGroup.addLayer(sourceLayer);
            }
        }
        //..................................>> Xử lý khi mở lại thêm bai dang<<..................................
        var geojsonDataRN = ${JSON.stringify(Post.coordinates)};
        if(geojsonDataRN){
            k++;
            var geoJsonGroup = L.geoJSON([${Post.coordinates}]);
            addNonGroupLayers(geoJsonGroup, drawnItems);  
        }

        //..................................>> Xử lý sau khi UPLOAD FILE <<..................................
        var geojsonUpload;
        (function(){
            function onChange(event) {
                if(k>=2) alert('${Strings.Zoning.REQUIRE_SAVE_PREVIOUS_ZONING_DRAW}')
                else if(geojsonDataRN){
                    alert('${Strings.Zoning.REQUIRE_SAVE_PREVIOUS_ZONING}')
                }else{
                    var reader = new FileReader();
                    reader.onload = onReaderLoad;
                    reader.readAsText(event.target.files[0]);
                }
            }
            function onReaderLoad(event){                
                var flatInside = true;
                var obj = JSON.parse(event.target.result);
                var type = obj.features[0].geometry.type;
                if(type !=="Point"){
                    alert("Vui lòng chọn file geojson của điểm");
                }
                geojsonUpload = obj.features[0].geometry.coordinates;
                if(!isMarkerInsidePolygon(L.marker([geojsonUpload[1],geojsonUpload[0]]),${JSON.stringify(polygonBorder)})){
                    flatInside=false;
                }
                if(flatInside){
                        k++;
                        var geojsonFeature = L.geoJSON(obj.features[0].geometry);
                        addNonGroupLayers(geojsonFeature, drawnItems); 
                        var area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]);
                        seeArea = area;                 
                }else{
                    alert("${Strings.Zoning.REQUIRE_INSIDE_BORDER}")
                }
            }
            document.getElementById('file').addEventListener('change', onChange);
        }());
        //..................................>> Xử lý khi VẼ xong <<..................................
        function showText(e) {
            if(k>=2) alert("${Strings.Zoning.REQUIRE_SAVE_PREVIOUS_ZONING_DRAW}");	
            else{
                let flatInside=true;
                var layer = e.layer;
                if(!isMarkerInsidePolygon(L.marker([layer.getLatLng().lat,layer.getLatLng().lng]), ${JSON.stringify(polygonBorder)})){
                    flatInside=false;
                }
                if(flatInside){
                    k++;
                    var layer = e.layer;
                    layer.addTo(drawnItems);
                }else{
                    alert("${Strings.Zoning.REQUIRE_INSIDE_BORDER}");
                }
            }
    }
    mymap.on(L.Draw.Event.CREATED, showText);	  
        //..................................>> Xử lý khi SỬA xong <<..................................
        function editText(e) {
            let flatInside=true;
            let layers = e.layers;
            layers.eachLayer(function(layer) {
                if(!isMarkerInsidePolygon(L.marker([layer.getLatLng().lat,layer.getLatLng().lng]), ${JSON.stringify(polygonBorder)})){
                    flatInside=false;
                }
            });
            if(flatInside){
                layers.eachLayer(function(layer) {                                                          
                    layer.addTo(drawnItems);			
                });
            }else{
                alert("${Strings.Zoning.REQUIRE_INSIDE_BORDER}");
                drawControl._toolbars["edit"].disable();
            }
        }
        mymap.on("draw:edited", editText);
        //..................................>> Xử lý khi XÓA xong <<..................................
        function delText(e) {
            var layers = e.layers;		
            layers.eachLayer(function (layer) {
                drawnItems.removeLayer(layer);
                k--;
            });
            geojsonDataRN=null;
        }
        mymap.on("draw:deleted", delText);
        //..................................>> GỬI dữ liệu cho React Native <<..................................
        const sendDataToReactNativeApp = async () => {
            var collection = drawnItems.toGeoJSON();
            var countLayers = collection.features.length;
            if(countLayers==0){
                alert("${Strings.Zoning.LOCATION_REQUIRE_MESSAGE}")
            }else{
                var geojson1 = JSON.stringify(collection, null, 2);	
                window.ReactNativeWebView.postMessage(geojson1);
            }
        };
        $("#submit").on("click", sendDataToReactNativeApp);
        </script>
    </body>
    </html>
` }}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                    />
                                </View>
                            </Dialog.Actions>
                        </Dialog>
                    </ScrollView>
                </View>
            </SafeAreaView >
        )
    }
}

export default AddPost;