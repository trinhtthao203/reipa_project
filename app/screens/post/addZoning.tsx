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
import { IImage, IDataZoning, IErrorDataZoning } from "@app/commons/interfaces";
import { View, ScrollView, TouchableOpacity, ImageBackground, PermissionsAndroid, FlatList, SafeAreaView, StyleSheet, ActivityIndicator } from "react-native"

//function
import Loading from "@app/screens/loading";
import UserService from "@app/services/user.service";
import ProvinceService from "@app/services/province.service";
import WardService from "@app/services/ward.service";
import DistrictService from "@app/services/district.service";
import zoningService from "@app/services/zoning.service";

const ZoningService = new zoningService();
const userService = new UserService();
const provinceService = new ProvinceService();
const districtService = new DistrictService();
const wardService = new WardService();

const AddZoning = ({ route, navigation }: any) => {
    const dispatch = useDispatch();

    const [updateID, setUpdateID] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [countText, setCountText] = useState();
    const [visible1, setVisible1] = useState(false);
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

    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const { userInfo } = useSelector(
        (state: RootState) => state.user
    );

    const [Zoning, setZoning] = React.useState<IDataZoning>({
        user_id: userInfo.id || "",
        name: "Chung cư SpringOut",
        purpose: "Đất phức hợp",
        address: "hẻm 3/2",
        dataImage: [],
        area: 0.0000,
        width: 0.0000,
        length: 0.0000,
        description: "Không có"
    });

    const updateZoningInfo = (newState: IDataZoning) => {
        setZoning((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const [errorInfo, setErrorInfo] = React.useState<IErrorDataZoning>({
        error: false,
    });

    const updateErrorInfo = (newState: IErrorDataZoning) => {
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

    const [typeZoningData, setTypeZoningData] = React.useState([]);
    const handleGetTypeZoningList = async () => {
        try {
            const result = await ZoningService.handleGetAllTypeZoning();
            setTypeZoningData(result.data);
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


    const handleClickProvince = (selected: any) => {
        if (selected == 0) {
            updateZoningInfo({ province_id: "", district_id: "", ward_id: "" });
            setGeoJSONBorder(undefined);
            setDistrictData([]);
            setWardData([]);
        } else {
            updateZoningInfo({ province_id: selected, district_id: "", ward_id: "" });
            handleGetDistrict(selected);
            handleBorderProvince(JSON.stringify(selected));
        }
        updateZoningInfo({ coordinates: "", length: 0, width: 0, area: 0 });
    }

    const handleClickDistrict = (province_id: any, selected: any) => {
        if (selected == 0) {
            updateZoningInfo({ district_id: "", ward_id: "" });
            handleBorderProvince(province_id);
            setWardData([]);
        } else {
            updateZoningInfo({ district_id: selected, ward_id: "" });
            handleGetWard(province_id, selected);
            handleBorderDistrict(JSON.stringify(selected));
        }
        updateZoningInfo({ coordinates: "", length: 0, width: 0, area: 0 });
    }

    const handleClickWard = (selected: any) => {
        if (selected == 0) {
            updateZoningInfo({ ward_id: "" });
            handleBorderDistrict(Zoning.district_id);
        } else {
            updateZoningInfo({ ward_id: selected });
            handleBorderWard(JSON.stringify(selected));
        }
        updateZoningInfo({ coordinates: "", length: 0, width: 0, area: 0 });
    }

    const handleGetData = async (zoning_id: any) => {
        try {
            const result = await ZoningService.handleGetZoningByID(zoning_id);
            updateZoningInfo({
                id: result.data[0].id,
                name: result.data[0].name,
                purpose: result.data[0].purpose,
                address: result.data[0].address,
                description: result.data[0].description,
                province_id: result.data[0].province_id,
                district_id: result.data[0].district_id,
                ward_id: result.data[0].ward_id,
                typeof_zoning_id: result.data[0].typeof_zoning_id,
            });
            // console.log(JSON.stringify(result.data[0]))
            // console.log(JSON.stringify(result.data[0].province_id))
            if (result.data[0].province_id) {
                handleClickProvince(result.data[0].province_id);
            }
            if (result.data[0].district_id) {
                handleClickDistrict(result.data[0].province_id, result.data[0].district_id);
            }
            if (result.data[0].ward_id) {
                handleClickWard(result.data[0].ward_id);
            }
            handleChangeArea(result.data[0].area);
            handleChangeLength(result.data[0].length);
            handleChangeWidth(result.data[0].width);
            const resultImage = await ZoningService.handleGetImagesByID(zoning_id);
            var arrImage = resultImage.data.map((image: any, ind: any) => {
                return `${Constants.Api.IMAGES_URL}/${image.name}`
            })
            setImageList(arrImage);
            const resultGeoJSON = await ZoningService.handleGetGeoJSONByID(zoning_id);
            // console.log(resultGeoJSON.data.zoning[0].json_build_object.features[0].geometry);
            if (resultGeoJSON.data.zoning[0].json_build_object.features[0].geometry.type === "MultiLineString")
                setCoordinatesPolyline(resultGeoJSON.data.zoning[0].json_build_object.features[0].geometry.coordinates[0])
            updateZoningInfo({ coordinates: resultGeoJSON.data.zoning[0].json_build_object.features[0].geometry });
            setIsLoading(false);
            setIsPolygon(result.data[0].ispolygon);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleGetTypeZoningList();
        handleGetLocation();
        handleGetProvinceList();
        if (route.params) {
            const { zoning_id } = route.params;
            setUpdateID(zoning_id);
            handleGetData(zoning_id);
        }
    }, []);

    const isNull = (val: any) => {
        if (val === null || val === undefined || val === "")
            return true;
        else
            return false;
    }

    //Nhận data từ WebView
    const [isPolygon, setIsPolygon] = useState(true);
    const [coordinatesPolyline, setCoordinatesPolyline] = useState(true);
    function onMessage(payload: any) {
        let dataPayload;
        try {
            dataPayload = JSON.parse(payload.nativeEvent.data);
        } catch (e) {
            console.log(e);
        }
        if (typeof dataPayload === "number") {
            updateZoningInfo({ area: dataPayload });
            if (dataPayload != 0) {
                setIsPolygon(true)
            }
        }
        if (typeof dataPayload === "object") {
            if (dataPayload.features) {
                updateZoningInfo({ coordinates: dataPayload.features[0].geometry });
                setCoordinatesPolyline(dataPayload.features[0].geometry.coordinates[0])
            } else {
                if (dataPayload.width != 0) {
                    setIsPolygon(false)
                }
                updateZoningInfo({ width: dataPayload.width });
                updateZoningInfo({ length: dataPayload.length });
            }
        }
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
                    if (images.length > 10) {
                        setShowDialog(true);
                        setTypeDialog("warning");
                        setContentDialog(Strings.Zoning.WARNING_MAX_IMAGE);
                    } else {
                        updateZoningInfo({ dataImage: images });
                        let arrImages = images.map((i: any, ind: any) => { return i.path })
                        setImageList(arrImages);
                    }
                })
                .catch((e) => console.log(e));
        }
    }

    const checkError = () => {
        let flatN, flatF, flatP, flatL, flatAD, flatI = true;
        if (isNull(Zoning.name)) {
            flatN = true;
            updateErrorInfo({
                error: true,
                errorNameMsg: Strings.Zoning.NAME_REQUIRE_MESSAGE
            })
        } else {
            flatN = false;
            updateErrorInfo({
                error: false,
                errorNameMsg: ""
            })
        }

        if (isNull(Zoning.purpose)) {
            flatF = true;
            updateErrorInfo({
                error: true,
                errorPurposeMsg: Strings.Zoning.PURPOSE_REQUIRE_MESSAGE
            })
        } else {
            flatF = false;
            updateErrorInfo({
                error: false,
                errorPurposeMsg: ""
            })
        }

        if (isNull(Zoning.province_id)) {
            flatP = true;
            updateErrorInfo({
                error: true,
                errorProvinceMsg: Strings.Zoning.PROVINCE_REQUIRE_MESSAGE
            })
        } else {
            flatP = false;
            updateErrorInfo({
                error: false,
                errorProvinceMsg: ""
            })
        }

        if (Zoning.dataImage?.length == 0 && !Zoning.id) {
            flatI = true;
            updateErrorInfo({
                error: true,
                errorDataImageMsg: Strings.Zoning.DATA_IMAGE_REQUIRE_MESSAGE
            })
        } else {
            flatI = false;
            updateErrorInfo({
                error: false,
                errorDataImageMsg: ""
            })
        }

        if (isNull(Zoning.address)) {
            flatAD = true;
            updateErrorInfo({
                error: true,
                errorAddressMsg: Strings.Zoning.ADDRESS_REQUIRE_MESSAGE
            })
        } else {
            flatAD = false;
            updateErrorInfo({
                error: false,
                errorAddressMsg: ""
            })
        }

        if (isNull(Zoning.coordinates)) {
            flatL = true;
            updateErrorInfo({
                error: true,
                errorCoordinatesdMsg: Strings.Zoning.LOCATION_REQUIRE_MESSAGE
            })
        } else {
            flatL = false;
            updateErrorInfo({
                error: false,
                errorCoordinatesdMsg: ""
            })
        }
        if (flatF == false && flatL == false && flatN == false && flatP == false && flatAD == false && flatI == false && errorInfo.error == false)
            return true;
        else
            return false;
    }
    const handleSave = async () => {
        if (checkError()) {
            setShowDialog(true);
            setTypeDialog(Strings.System.LOADNING);
            setContentDialog(Strings.Message.WAITTING_MESSAGE);
            const formData = new FormData();
            formData.append("name", Zoning.name);
            formData.append("purpose", Zoning.purpose);
            formData.append("area", Zoning.area);
            formData.append("address", Zoning.address);
            formData.append("width", Zoning.width);
            formData.append("length", Zoning.length);
            formData.append("coordinates", JSON.stringify(Zoning.coordinates));
            formData.append("ispolygon", isPolygon);
            formData.append("description", Zoning.description);
            formData.append("user_id", JSON.stringify(Zoning.user_id));
            formData.append("province_id", Zoning.province_id ? Zoning.province_id : "");
            formData.append("district_id", Zoning.district_id ? Zoning.district_id : "");
            formData.append("ward_id", Zoning.ward_id ? Zoning.ward_id : "");
            formData.append("typeof_zoning_id", Zoning.typeof_zoning_id);
            formData.append("status_id", 1);
            Zoning.dataImage && Zoning.dataImage.forEach((image: any, index: any) => {
                formData.append("dataImage", {
                    uri: image.path,
                    name: image.filename || Math.floor(Math.random() * Math.floor(999999999)) + ".jpg",
                    type: image.mime || "image/jpeg"
                })
            })
            axios.post(Constants.Api.BASE_URL + Constants.ApiPath.ADD_ZONING, formData, {
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
    }

    const handleUpdate = async () => {
        if (checkError()) {
            setShowDialog(true);
            setTypeDialog(Strings.System.LOADNING);
            setContentDialog(Strings.Message.WAITTING_MESSAGE);
            const formData = new FormData();
            formData.append("id", Zoning.id);
            formData.append("name", Zoning.name);
            formData.append("purpose", Zoning.purpose);
            formData.append("area", Zoning.area);
            formData.append("address", Zoning.address);
            formData.append("width", Zoning.width);
            formData.append("length", Zoning.length);
            formData.append("coordinates", JSON.stringify(Zoning.coordinates));
            formData.append("ispolygon", isPolygon);
            formData.append("description", Zoning.description);
            formData.append("user_id", JSON.stringify(Zoning.user_id));
            formData.append("province_id", Zoning.province_id ? Zoning.province_id : "");
            formData.append("district_id", Zoning.district_id ? Zoning.district_id : "");
            formData.append("ward_id", Zoning.ward_id ? Zoning.ward_id : "");
            formData.append("typeof_zoning_id", Zoning.typeof_zoning_id);
            formData.append("status_id", 1);
            axios.post(Constants.Api.BASE_URL + Constants.ApiPath.UPDATE_ZONING, formData, {
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
                        navigation.navigate(ScreenName.MAINPOST)
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
    const handleChangeArea = (area: any) => {
        updateZoningInfo({ area: area })
    }

    const handleChangeLength = (length: any) => {
        updateZoningInfo({ length: length })
    }
    const handleChangeWidth = (width: any) => {
        updateZoningInfo({ width: width })
    }

    if (isLoading) {
        return (
            <Loading />
        )
    } else {
        return (
            <  SafeAreaView style={styles.container}>
                <HeaderComp title={Strings.Zoning.ADD_ZONING} goBack={() => navigation.goBack()} />
                <View style={styles.box_input}>
                    <ScrollView nestedScrollEnabled={true} style={{ width: "100%" }}>
                        <TextInput
                            secure={false}
                            value={Zoning.name}
                            label={Strings.Zoning.NAME}
                            errorMessage={errorInfo.errorNameMsg}
                            onChangeText={(val: any) => { updateZoningInfo({ name: val }) }}
                        />
                        <TextInput
                            secure={false}
                            value={Zoning.purpose}
                            label={Strings.Zoning.PURPOSE}
                            errorMessage={errorInfo.errorPurposeMsg}
                            onChangeText={(val: any) => { updateZoningInfo({ purpose: val }) }}
                        />
                        <Text style={styles.label_dropdown_style}>{Strings.Typeof_zoning.TITLE}</Text>
                        <View style={{ marginBottom: 7 }}>
                            <Picker
                                selectedValue={Zoning.typeof_zoning_id}
                                onValueChange={(itemValue, itemIndex) =>
                                    updateZoningInfo({ typeof_zoning_id: itemValue })
                                }
                            >
                                {typeZoningData &&
                                    typeZoningData.map((val: any, ind: any) => {
                                        return (
                                            <Picker.Item key={ind} label={val.name} value={val.id} />
                                        )
                                    })
                                }
                            </Picker>
                            {errorInfo.errorTypeOfZoningIDMsg != null && <Text style={styles.error_info}>{errorInfo.errorTypeOfZoningIDMsg}</Text>}
                        </View>
                        <Text style={styles.label_style}>Vị trí</Text>
                        <Picker
                            selectedValue={Zoning.province_id}
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
                            selectedValue={Zoning.district_id}
                            onValueChange={(itemValue, itemIndex) =>
                                handleClickDistrict(Zoning.province_id, itemValue)
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
                            selectedValue={Zoning.ward_id}
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
                        {errorInfo.errorCoordinatesdMsg != null && <Text style={styles.error_info}>{errorInfo.errorCoordinatesdMsg}</Text>}
                        <TextInput
                            secure={false}
                            value={Zoning.address}
                            label={Strings.Zoning.ADDRESS}
                            errorMessage={errorInfo.errorAddressMsg}
                            onChangeText={(val: any) => { updateZoningInfo({ address: val }) }}
                        />
                        <TextInput
                            secure={false}
                            keyboardType="numeric"
                            defaultValue={Zoning.area + ""}
                            label={Strings.Zoning.AREA}
                            onChangeText={(val: any) => { handleChangeArea(val) }}
                        />
                        <TextInput
                            secure={false}
                            keyboardType="numeric"
                            value={Zoning.length + ""}
                            label={Strings.Zoning.LENGTH}
                            onChangeText={(val: any) => { handleChangeLength(val) }}
                        />
                        <TextInput
                            secure={false}
                            keyboardType="numeric"
                            value={Zoning.width + ""}
                            label={Strings.Zoning.WIDTH}
                            onChangeText={(val: any) => { handleChangeWidth(val) }}
                        />
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
                        {errorInfo.errorDataImageMsg != null && <Text style={styles.error_info}>{errorInfo.errorDataImageMsg}</Text>}
                        <Text style={styles.label_style}>Mô tả {countText} </Text>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            maxLength={1000}
                            onChangeText={(text) => {
                                updateZoningInfo({ description: text })
                            }}
                            value={Zoning.description} />
                        {!Zoning.id ? <Button
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
                                <Dialog.Title title={Strings.Zoning.DEFINE_LOCATION} titleStyle={{ color: "black", fontWeight: "500", fontSize: 16, paddingTop: 10, paddingLeft: 10, width: "80%" }} />
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
        <script src="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.js"></script>
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
    <script src="https://unpkg.com/leaflet-draw@0.4.0/dist/leaflet.draw.js"></script> 
    <script src="https://leaflet.github.io/Leaflet.draw/src/Leaflet.Draw.Event.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@0.4.0/dist/leaflet.draw.css"> 
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
        var k=1, seeArea=0.0000, widthInMeters=${Zoning.width}, type, isPolygon=${isPolygon};
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
                marker:false,
                polygon: true,
                polyline: true,
                circle:false,
                rectangle:false
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
        
        //..................................>> Xử lý khi mở lại thêm quy hoạch<<..................................
        var geojsonDataRN = ${JSON.stringify(Zoning.coordinates)};
        if(geojsonDataRN){
            k++;
            if(isPolygon){
                type="polygon";
                var geoJsonGroup = L.geoJSON(${JSON.stringify(Zoning.coordinates)});
                mymap.fitBounds(geoJsonGroup.getBounds());
                addNonGroupLayers(geoJsonGroup, drawnItems);  
            }else{
                type="polyline";
                var dataFromZoning = ${JSON.stringify(coordinatesPolyline)};
                widthInMeters = ${Zoning.width};
                var arrLatlngGeoPolyline=[];
                dataFromZoning.forEach((item)=>{
                    arrLatlngGeoPolyline.push(L.latLng(item[1],item[0]))
                })             
                var options = { 
                    corridor: widthInMeters, // meters
                    className: 'route-corridor' 
                };
                var corridor = L.corridor([arrLatlngGeoPolyline], options);
                mymap.fitBounds(corridor.getBounds());
                corridor.addTo(drawnItems);
            }
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
                var obj = JSON.parse(event.target.result);
                var geojsonFeature = obj.features[0];
                var type = obj.features[0].geometry.type;
                if(type=="MultiLineString"|| type=="Polyline"){
                    geojsonUpload = obj.features[0].geometry.coordinates[0];
                }else{
                    geojsonUpload = obj.features[0].geometry.coordinates[0][0];
                }
                var flatInside = true;
                for(var i = 0 ; i < geojsonUpload.length; i++){
                    if(!isMarkerInsidePolygon(L.marker([geojsonUpload[i][1],geojsonUpload[i][0]]),${JSON.stringify(polygonBorder)})){
                        flatInside=false;
                    }
                }
                if(flatInside){
                    k++;
                    if(type=="MultiLineString"|| type=="Polyline"){
                        var latlng =[];
                        for(var i = 0 ; i < geojsonUpload.length; i++){
                            latlng.push(L.latLng([geojsonUpload[i][1],geojsonUpload[i][0]]));
                        }
                        while(!widthInMeters){
                            widthInMeters = parseFloat(prompt("${Strings.Zoning.INPUT_WIDTH_LINE}"),2); 
                        }
                        var coords = [latlng];               
                        var options = { 
                            corridor: widthInMeters, // meters
                            className: 'route-corridor' 
                        };
                        var corridor = L.corridor(coords, options)
                        mymap.fitBounds(corridor.getBounds());
                        corridor.addTo(drawnItems);
                    }else{
                        L.geoJSON(geojsonFeature).addTo(drawnItems);
                        var polygon = L.polygon(geojsonUpload)
                        var area = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]);
                        seeArea = area;
                    }                    
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
                    type = e.layerType;
                    if(type=="polyline" || type=="LineString" || type=="MultiLineString"){
                        for(var i=0; i<layer.getLatLngs().length; i++){
                            if(!isMarkerInsidePolygon(L.marker([layer.getLatLngs()[i].lat,layer.getLatLngs()[i].lng]), ${JSON.stringify(polygonBorder)})){
                                flatInside=false;
                            }
                        }
                    }else{
                        for(var i=0; i<layer.getLatLngs()[0].length; i++){
                            if(!isMarkerInsidePolygon(L.marker([layer.getLatLngs()[0][i].lat,layer.getLatLngs()[0][i].lng]), ${JSON.stringify(polygonBorder)})){
                                flatInside=false;
                            }
                        }
                    }
                    
                    if(!flatInside){
                        alert("${Strings.Zoning.REQUIRE_INSIDE_BORDER}");
                    }else{
                        k++;
                        if(type == "polyline"){
                            while(!widthInMeters){
                                widthInMeters = parseFloat(prompt("${Strings.Zoning.INPUT_WIDTH_LINE}"),2); 
                            }
                            var coords = [layer.getLatLngs()];                    
                                var options = { 
                                    corridor: widthInMeters, // meters
                                    className: 'route-corridor' 
                                };
                                var corridor = L.corridor(coords, options);
                                mymap.fitBounds(corridor.getBounds());
                                corridor.addTo(drawnItems);
                        }else{
                            layer.addTo(drawnItems);
                        }
                    }
                }
        }
        mymap.on(L.Draw.Event.CREATED, showText);	  

        //..................................>> Xử lý khi SỬA xong <<..................................
        function editText(e) {
            let flatInside=true;
            let layers = e.layers;
            layers.eachLayer(function(layer) {
                for(var i=0; i<layer.getLatLngs()[0].length; i++){
                    if(!isMarkerInsidePolygon(L.marker([layer.getLatLngs()[0][i].lat,layer.getLatLngs()[0][i].lng]), ${JSON.stringify(polygonBorder)})){
                        flatInside=false;
                    }
                }                             	
            });
            if(!flatInside){
                alert("${Strings.Zoning.REQUIRE_INSIDE_BORDER}");
                drawControl._toolbars["edit"].disable();
            }else{
                layers.eachLayer(function(layer) {                                                          
                    layer.addTo(drawnItems);			
                });
            }
        }
        mymap.on("draw:edited", editText);

        //..................................>> Xử lý khi XÓA xong <<..................................
        function delText(e) {
            var layers = e.layers;		
            widthInMeters=0;
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
                let ob;
                if(type=="MultiLineString"|| type=="polyline"){
                    var tempLatLng = null;
                    var totalDistance = 0.00000;
                    for (var i=0; i<countLayers; i++){
                        collection.features[i].geometry.coordinates[0].forEach(element => {
                            var latlng = L.latLng(element);
                            if(tempLatLng == null){
                            tempLatLng = latlng;
                            return;
                        }
                        totalDistance += tempLatLng.distanceTo(latlng);
                        tempLatLng = latlng;
                        });
                    } 
                    let ob={
                        length: totalDistance,
                        width: widthInMeters
                    }
                    window.ReactNativeWebView.postMessage(JSON.stringify(ob));
                    window.ReactNativeWebView.postMessage(0);
                }else{
                    //tính diện tích tất cả các quy hoạch trong map
                    for (var i=0; i<countLayers; i++){
                        seeArea += L.GeometryUtil.geodesicArea(L.polygon(collection.features[i].geometry.coordinates).getLatLngs()[0]);
                    } 
                    let ob={
                        length: 0,
                        width: 0
                    }
                    window.ReactNativeWebView.postMessage(JSON.stringify(ob));
                    window.ReactNativeWebView.postMessage(seeArea);
                }                
                var geojson1 = JSON.stringify(collection, null, 2);	
                window.ReactNativeWebView.postMessage(geojson1);
            }
        };
        $("#submit").on("click", sendDataToReactNativeApp);
        </script>
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
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

export default AddZoning;