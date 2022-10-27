//import
import React, { useState, useRef, useEffect } from "react"
import styles from "@app/screens/post/style";
import Strings from "@app/commons/strings";
import HeaderComp from "@app/components/HeaderComp";
import { WebView } from "react-native-webview";
import Geolocation from '@react-native-community/geolocation';
import html_script from "@app/html_script/html_script_mapscreen";
import TextInput from "@app/components/TextInput";
import { RootState } from "@app/store";
import { useDispatch, useSelector } from "react-redux";
const AddPlanningAreaHTML = require('./addPlanningArea.html');
//Image
import { Map } from "@app/assets/images"

//element
import SelectList from "react-native-dropdown-select-list";
import { View, ScrollView, TouchableOpacity, ImageBackground } from "react-native"
import { Input, Icon, Button, Dialog, Text } from '@rneui/themed';

//function
import Loading from "@app/screens/loading";
import {
    _showLocationGPS,
    _showGEOJSONFILE,
    _showMapScreen,
} from "@app/Utils/Common";

import Constants from "@app/constants";
import PlanningAreaService from "@app/services/planningArea.service";
import UserService from "@app/services/user.service";
import ProvinceService from "@app/services/province.service";
const planningAreaService = new PlanningAreaService();
const provinceService = new ProvinceService();
const userService = new UserService();

interface IData {
    name?: string;
    functions?: string;
    area?: string;
    address?: string;
    province_id?: string;
    province_border?: string;
    district_id?: string;
    ward_id?: string;
    user_id?: string;
    coordinates?: string;
}

interface IErrorData {
    error?: boolean,
    errorNameMsg?: string,
    errorFunctionMsg?: string,
    errorProvinceMsg?: string,
    errorDistrictMsg?: string,
    errorWardMsg?: string,
    errorUserIDMsg?: string,
    errorCoordinatesdMsg?: string,
    errorAreaMsg?: string,
}

const AddPlanningArea = ({ navigation }: any) => {

    const Map_Ref = useRef();
    const [isLoading, setIsLoading] = useState(false);

    const [visible1, setVisible1] = useState(false);
    const toggleDialog1 = () => {
        setVisible1(!visible1);
    };
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const { userInfo } = useSelector(
        (state: RootState) => state.user
    );

    const [planningArea, setPlanningArea] = React.useState<IData>({
        user_id: userInfo.id || "",
        name: "KDC",
        functions: "Đất phức hợp",
        province_id: "12",
        district_id: "166",
        ward_id: "2375",
    });

    const updatePlanningAreaInfo = (newState: IData) => {
        setPlanningArea((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const [errorInfo, setErrorInfo] = React.useState<IErrorData>({
        error: false,
    });

    const updateErrorInfo = (newState: IErrorData) => {
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

    const [provinceData, setProvinceData] = React.useState([]);
    const handleGetProvinceList = async () => {
        try {
            const result = await userService.handleGetProvinceList();
            let newArray = result.data.provinces.map((item: any) => {
                return { key: item.id, value: item.name }
            })
            setProvinceData(newArray);
        } catch (err) {
            console.log(err);
        }
    }

    const [districtData, setDistrictData] = React.useState([]);
    const handleGetDistrict = async (province_id: any) => {
        try {
            const result = await userService.handleGetDistrictByProvince(province_id);
            let newArray = result.data.district.map((item: any) => {
                return { key: item.id, value: item.name }
            })
            setDistrictData(newArray);
        } catch (err) {
            console.log(err);
        }
    }

    const [wardData, setWardData] = React.useState([]);
    const handleGetWard = async (province_id: any, district_id: any) => {
        try {
            const result = await userService.handleGetWardList(province_id, district_id);
            let newArray = result.data.ward.map((item: any) => {
                return { key: item.id, value: item.name }
            })
            setWardData(newArray);
        } catch (err) {
            console.log(err);
        }
    }

    const [borderProvince, setBorderProvince] = React.useState();
    const handleBorderProvince = async (province_id: any) => {
        try {
            var result = await provinceService.handleGetBorderProvinces(province_id);
            if (result.data && result.data[0].json_build_object) {
                setBorderProvince(result.data[0].json_build_object);
            }
            console.log(result.data[0].json_build_object);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleGetLocation();
        handleGetProvinceList();
    }, []);

    const handleClickProvince = (selected: any) => {
        updatePlanningAreaInfo({ province_id: selected });
        handleBorderProvince(JSON.stringify(selected));
        handleGetDistrict(selected);
    }

    const handleClickDistrict = (selected: any) => {
        updatePlanningAreaInfo({ district_id: selected });
        handleGetWard(planningArea.province_id, selected);
    }

    const handleClickWard = (selected: any) => {
        updatePlanningAreaInfo({ ward_id: selected });
    }
    const isNull = (val: any) => {
        if (val === null || val === undefined || val === "")
            return true;
        else
            return false;
    }

    const handleSave = () => {
        console.log(borderProvince);
        let flatN, flatF, flatP, flatD, flatW, flatL, flatA = true;
        if (isNull(planningArea.name)) {
            flatN = true;
            updateErrorInfo({
                error: true,
                errorNameMsg: Strings.PlanningArea.NAME_REQUIRE_MESSAGE
            })
        } else {
            flatN = false;
            updateErrorInfo({
                error: false,
                errorNameMsg: ""
            })
        }

        if (isNull(planningArea.functions)) {
            flatF = true;
            updateErrorInfo({
                error: true,
                errorFunctionMsg: Strings.PlanningArea.FUNCTION_REQUIRE_MESSAGE
            })
        } else {
            flatF = false;
            updateErrorInfo({
                error: false,
                errorFunctionMsg: ""
            })
        }

        if (isNull(planningArea.province_id)) {
            flatP = true;
            updateErrorInfo({
                error: true,
                errorProvinceMsg: Strings.PlanningArea.PROVINCE_REQUIRE_MESSAGE
            })
        } else {
            flatP = false;
            updateErrorInfo({
                error: false,
                errorProvinceMsg: ""
            })
        }

        if (isNull(planningArea.district_id)) {
            flatD = true;
            updateErrorInfo({
                error: true,
                errorDistrictMsg: Strings.PlanningArea.DISTRICT_REQUIRE_MESSAGE
            })
        } else {
            flatD = false;
            updateErrorInfo({
                error: false,
                errorDistrictMsg: ""
            })
        }
        if (isNull(planningArea.ward_id)) {
            flatW = true;
            updateErrorInfo({
                error: true,
                errorWardMsg: Strings.PlanningArea.WARD_REQUIRE_MESSAGE
            })
        } else {
            flatW = false;
            updateErrorInfo({
                error: false,
                errorWardMsg: ""
            })
        }
        if (isNull(planningArea.coordinates)) {
            flatL = true;
            updateErrorInfo({
                error: true,
                errorCoordinatesdMsg: Strings.PlanningArea.LOCATION_REQUIRE_MESSAGE
            })
        } else {
            flatL = false;
            updateErrorInfo({
                error: false,
                errorCoordinatesdMsg: ""
            })
        }
        if (isNull(planningArea.area)) {
            flatA = true;
            updateErrorInfo({
                error: true,
                errorAreaMsg: Strings.PlanningArea.AREA_REQUIRE_MESSAGE
            })
        } else {
            flatA = false;
            updateErrorInfo({
                error: false,
                errorAreaMsg: ""
            })
        }

        console.log(planningArea);
        if (flatA == false && flatD == false && flatF == false && flatL == false && flatN == false && flatP == false && flatW == false && errorInfo.error == false) {
        }

    }

    //Nhận data từ WebView
    function onMessage(payload: any) {
        let dataPayload;
        try {
            dataPayload = JSON.parse(payload.nativeEvent.data);
        } catch (e) {
            console.log(e);
        }
        // if (typeof dataPayload === "number") {
        //   _delItems(dataPayload);
        //   console.log(dataPayload);
        // } else if (typeof dataPayload === "string") {
        //   console.log(dataPayload);
        //   setShowModalUpdate(true);
        //   setID(dataPayload.substring(7, 5));
        // } else {
        //   setViTri(dataPayload);
        // }
    }
    if (isLoading) {
        return (
            <Loading />
        )
    } else {
        return (
            <View style={styles.container}>
                <HeaderComp title={Strings.PlanningArea.ADD_PLANNING_AREA} goBack={() => navigation.goBack()} />
                <View style={styles.box_input}>
                    <ScrollView>
                        <TextInput
                            secure={false}
                            value={planningArea.name}
                            label={Strings.PlanningArea.NAME}
                            errorMessage={errorInfo.errorNameMsg}
                            onChangeText={(val: any) => { updatePlanningAreaInfo({ name: val }) }}
                        />
                        <TextInput
                            secure={false}
                            value={planningArea.functions}
                            label={Strings.PlanningArea.FUNCTION}
                            errorMessage={errorInfo.errorFunctionMsg}
                            onChangeText={(val: any) => { updatePlanningAreaInfo({ functions: val }) }}
                        />
                        <Text style={styles.label_style}>Vị trí</Text>
                        <View style={{ marginBottom: 7 }}>
                            <SelectList
                                maxHeight={250}
                                data={provinceData}
                                option={planningArea.province_id}
                                placeholder={"Chọn Tỉnh/ Thành phố *"}
                                inputStyles={{ color: Constants.Styles.COLOR_BLACK }}
                                dropdownTextStyles={{ color: Constants.Styles.COLOR_BLACK }}
                                dropdownStyles={{ backgroundColor: Constants.Styles.COLOR_ATHENSGRAY }}
                                setSelected={(key: any) => { handleClickProvince(key) }}
                            />
                            {errorInfo.errorProvinceMsg != null && <Text style={styles.error_info}>{errorInfo.errorProvinceMsg}</Text>}
                        </View>
                        <View style={{ marginBottom: 7 }}>
                            <SelectList
                                maxHeight={250}
                                placeholder={"Chọn Quận/Huyện *"}
                                boxStyles={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                                dropdownStyles={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                                dropdownTextStyles={{ color: Constants.Styles.COLOR_BLACK }}
                                inputStyles={{ color: Constants.Styles.COLOR_BLACK }}
                                setSelected={(key: any) => { handleClickDistrict(key) }}
                                data={districtData}
                            />
                            {errorInfo.errorDistrictMsg != null && <Text style={styles.error_info}>{errorInfo.errorDistrictMsg}</Text>}
                        </View>
                        <View style={{ marginBottom: 7 }}>
                            <SelectList
                                maxHeight={250}
                                placeholder={"Chọn Xã/ Phường *"}
                                boxStyles={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                                dropdownStyles={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                                dropdownTextStyles={{ color: Constants.Styles.COLOR_BLACK }}
                                inputStyles={{ color: Constants.Styles.COLOR_BLACK }}
                                setSelected={(key: any) => { handleClickWard(key) }}
                                data={wardData}
                            />
                            {errorInfo.errorWardMsg != null && <Text style={styles.error_info}>{errorInfo.errorWardMsg}</Text>}
                        </View>
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
                                <Text style={{ color: Constants.Styles.CORLOR_WHITE, fontSize: 15, fontWeight: '600' }}>{Strings.PlanningArea.BUTTON_DEFINE_LOCATION}</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        {errorInfo.errorCoordinatesdMsg != null && <Text style={styles.error_info}>{errorInfo.errorCoordinatesdMsg}</Text>}
                        <TextInput
                            secure={false}
                            value={planningArea.area}
                            label={Strings.PlanningArea.AREA}
                            errorMessage={errorInfo.errorAreaMsg}
                            onChangeText={(val: any) => { updatePlanningAreaInfo({ area: val }) }}
                        />
                        <Button
                            title={Strings.Common.CONFIRM}
                            buttonStyle={{ backgroundColor: Constants.Styles.COLOR_AMBER, borderRadius: Constants.Styles.BORDER_RADIUS, height: Constants.Styles.TEXT_INPUT_HEIGHT }}
                            titleStyle={{ color: Constants.Styles.COLOR_BLACK, fontSize: Constants.Styles.TEXT_INPUT_FONTSIZE }}
                            onPress={() => { handleSave() }}
                        />
                        <Dialog
                            isVisible={visible1}
                            onBackdropPress={toggleDialog1}
                            overlayStyle={{ width: "90%", padding: 10 }}
                        >
                            <Dialog.Title title={Strings.PlanningArea.DEFINE_LOCATION} titleStyle={{ color: "black", fontWeight: '500', fontSize: 16, paddingTop: 10 }} />
                            <Dialog.Actions>
                                <View style={{ flex: 1, height: 500, width: "100%" }}>
                                    <WebView
                                        originWhitelist={['*']}
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
                                                    <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.css" />
                                                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
                                                </head>
                                                <style>										<!--tạo style cho trang web-->
                                                    html, body {
                                                        height: 100%;
                                                        width: 100%;
                                                        margin: 0;
                                                        padding: 0;
                                                    }
                                                    #map { 
                                                        height: 100%;
                                                        width: 100%;
                                                    }
                                                    html {
                                                        height: 100%;
                                                    }
                                                </style>
                                                <body style="padding: 0; margin: 0">
                                                <script src="https://unpkg.com/leaflet-draw@0.4.0/dist/leaflet.draw.js"></script> 
                                                <script src="https://leaflet.github.io/Leaflet.draw/src/Leaflet.Draw.Event.js"></script> 
                                                <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@0.4.0/dist/leaflet.draw.css"> 
                                                <div id="mapid" style="width: 100%; height: 100%;"></div>
                                                    <script>
                                                    var mymap = L.map('mapid').setView([${lat},${lng}], 15);
                                                    var osm = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                                                        maxZoom: 18,
                                                        attribution: 'Map data &copy; OpenStreetMap contributors, ',
                                                        id: 'mapbox/streets-v11'
                                                    })
                                                    osm.addTo(mymap);
                                                    
                                                    //Định các style cho point, line và polygon
                                                    var lineStyle={color: "blue", weight: 5};
                                                    var polygonStyle={color: "pink", fillColor: "black", weight: 4};
                                                    var geojsonMarkerOptions = {
                                                        radius: 8,
                                                        fillColor: "#ff7800",
                                                        color: "#000",
                                                        weight: 1,
                                                        opacity: 1,
                                                        fillOpacity: 0.8
                                                    };

                                                    function onEachFeature(feature, layer) {
                                                        if (feature.properties && feature.properties.name ) {
                                                            layer.bindPopup('<h5>'+feature.properties.name+'</h5>');
                                                        }
                                                    }
                                                    var Geo=${JSON.stringify(borderProvince)}
                                                    L.geoJSON(Geo).addTo(mymap);
                                                    
                                                    //Draw
                                                    var drawnItems;
                                                    var drawControl;
                                                    if(drawnItems){
                                                        mymap.removeLayer(drawnItems);
                                                    }
                                                    if(drawControl){
                                                        mymap.removeControl(drawControl);
                                                    }
                                                    //khai báo featuregroup để vẽ
                                                    drawnItems = L.featureGroup().addTo(mymap);	
                                                        
                                                    //Các option cho công cụ vẽ
                                                    var options = {
                                                        position: 'topleft',
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
                                                    drawControl = new L.Control.Draw(options).addTo(mymap);
                                                    var area=0;
                                                    var length=0;
                                                    //Khi vẽ thì thêm vào lớp drawnItems
                                                    function showText(e) {	
                                                            var layer = e.layer;
                                                            layer.addTo(drawnItems);
                                                            sendDataToReactNativeApp();
                                                    }
                                                    mymap.on(L.Draw.Event.CREATED, showText);	  
                                                    
                                                    //Khi xóa thì bớt vào lớp drawnItems
                                                    function editText(e) {
                                                        let layers = e.layers;
                                                        layers.eachLayer(function(layer) {
                                                            layer.addTo(drawnItems);			
                                                        });
                                                        sendDataToReactNativeApp();
                                                    }
                                                    mymap.on('draw:edited', editText);

                                                    //Khi xóa thì bớt lớp drawnItems
                                                    function delText(e) {
                                                        var layers = e.layers;		
                                                        layers.eachLayer(function (layer) {
                                                            drawnItems.removeLayer(layer);
                                                        });
                                                        sendDataToReactNativeApp();
                                                    }
                                                    mymap.on('draw:deleted', delText);

                                                    const sendDataToReactNativeApp = async () => {
                                                        var collection = drawnItems.toGeoJSON();
                                                        var geojson1 = JSON.stringify(collection, null, 2);	
                                                        drawnItems.eachLayer(function(player){
                                                            alert(player);
                                                            // if (player.layerType === 'polygon') {
                                                            //     var seeArea = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
                                                            //       area+=seeArea;  
                                                            //   }
                                                            //   if (player.layerType = 'polyline') {
                                                            //       var coords = layer.getLatLngs();
                                                            //       for (var i = 0; i < coords.length - 1; i++) {
                                                            //         length += coords[i].distanceTo(coords[i + 1]);
                                                            //       }
                                                            //     }
                                                        })
                                                        window.ReactNativeWebView.postMessage(geojson1);
                                                        window.ReactNativeWebView.postMessage(area);
                                                        window.ReactNativeWebView.postMessage(length);
                                                    };

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
            </View >
        )
    }
}

export default AddPlanningArea

