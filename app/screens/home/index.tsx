//import
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import styles from "./style";
import Strings from "@app/commons/strings";
import HeaderComp from "@app/components/HeaderComp";
import Geolocation from '@react-native-community/geolocation';

//element
import { ScrollView, View } from "react-native"
import { WebView } from "react-native-webview";
import DialogCustom from "@app/components/Dialog";
import { BottomSheet, Button, ListItem, Avatar } from "@rneui/themed";
import { IDataZoningSelect, IDataPost, IDataPostSelect } from "@app/commons/interfaces";

//function
import Loading from "../loading";
import ZoningService from "@app/services/zoning.service";
import PostService from "@app/services/post.service";
import Constants from "@app/constants";
import { Image } from "@rneui/base";
import { Text } from "react-native-paper";
import Zoning from "@app/services/zoning.service";
const zoningService = new ZoningService();
const postService = new PostService();

type BottomSheetComponentProps = {};

const Home: React.FunctionComponent<BottomSheetComponentProps> = ({ navigation }: any) => {
    const [isLoading, setIsLoading] = useState(false);
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
        }, (err) => {
            setShowDialog(true);
            setTypeDialog("warning");
            setContentDialog(Strings.Message.ACCESS_FINE_LOCATION_MESSAGE);
        });
    }

    const [zoningDataGeoJSONPolygon, setZoningDataGeoJSONPolygon] = React.useState();
    const handleGetZoningPolygonList = async () => {
        try {
            const result = await zoningService.handleGetAllZoningGeoJSONPolygon(1);
            setZoningDataGeoJSONPolygon(result.data.zoning[0].json_build_object);
        } catch (err) {
            console.log(err);
        }
    }

    const [zoningDataGeoJSONPolyline, setZoningDataGeoJSONPolyline] = React.useState();
    const handleGetZoningPolylineList = async () => {
        try {
            const result = await zoningService.handleGetAllZoningGeoJSONPolyline(1);
            setZoningDataGeoJSONPolyline(result.data.zoning[0].json_build_object);
        } catch (err) {
            console.log(err);
        }
    }

    const [zoningSelect, setZoningSelect] = React.useState<IDataZoningSelect>({
        lat: "",
        lng: ""
    });
    const updateZoningSelect = (newState: IDataZoningSelect) => {
        setZoningSelect((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const [postSelect, setPostSelect] = React.useState<IDataZoningSelect>();
    const updatePostSelect = (newState: IDataZoningSelect) => {
        setZoningSelect((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const onMessage = async (payload: any) => {
        let dataPayload;
        try {
            dataPayload = JSON.parse(payload.nativeEvent.data);
        } catch (e) {
            console.log(e);
        }
        if (typeof dataPayload == "number") {
            const result = await zoningService.handleGetPolygonByID(dataPayload, 1);
            const resultImage = await zoningService.handleGetOneImageByZoningID(dataPayload);
            setIsVisible(true);
            updateZoningSelect({
                name: result.data[0].name,
                dataImage: resultImage.data[0].name,
                province_name: result.data[0].province_name,
                district_name: result.data[0].district_name,
                ward_name: result.data[0].ward_name,
                user_name: result.data[0].user_name,
                phonenumber: result.data[0].phonenumber,
            })
        } else {
            const result = await zoningService.handleGetPolylineByLatLngWithDistance(dataPayload.lat, dataPayload.lng, 1);
            setIsVisible(true);
            if (result.data[0] == undefined) {
                updateZoningSelect({
                    name: "Bạn đang ở",
                    dataImage: undefined,
                    province_name: undefined,
                    district_name: undefined,
                    ward_name: undefined,
                    user_name: undefined,
                    phonenumber: undefined
                })
            } else {
                const resultImage = await zoningService.handleGetOneImageByZoningID(result.data[0].id);
                updateZoningSelect({
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
    }

    const [postList, setPostList] = useState<IDataPostSelect>({
        listDataPost: new Array<IDataPost>(),
        // listImage: new Array<any>(),
    });
    const updatePost = (newState: any) => {
        setPostList((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };
    const handleUpdatePostList = (e: any) => {
        updatePost({
            // listImage: [...postList.listImage, ...Array.from(e)],
            listDataPost: [...Array.from(e).map((post: any, ind: any) => (
                {
                    id: post.id,
                    title: post.title,
                    price: post.price,
                    address: post.address,
                    area: post.area,
                    dis_m: post.dis_m
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
    const getPostByDistance = async () => {
        setIsVisible(false);
        setIsVisiblePost(true);
        const result = await postService.handleGetPostByDistance(zoningSelect.lat, zoningSelect.lng, 500, 1);
        handleUpdatePostList(result.data);
        result.data.map(async (post: any, ind: any) => {
            const resultImage = await postService.handleGetOneImageByPostID(post.id);
            arr[post.id] = resultImage.data[0].name;
            updateArr(arr);
        })
    }

    useEffect(() => {
        handleGetLocation();
        handleGetZoningPolygonList();
        handleGetZoningPolylineList();
    }, []);

    if (isLoading) {
        return (
            <Loading />
        )
    } else {
        return (
            <View style={styles.container} >
                <HeaderComp title={Strings.Home.TITLE} height={17} refresh={true} func={handleGetZoningPolylineList} />
                <BottomSheet modalProps={{}} isVisible={isVisible} onBackdropPress={() => setIsVisible(!isVisible)}>
                    <View style={{ backgroundColor: Constants.Styles.CORLOR_WHITE, padding: 10, flex: 1, flexWrap: 'wrap', flexDirection: "row", }}>
                        {zoningSelect?.dataImage && <Image source={{ uri: `${Constants.Api.IMAGES_URL}/${zoningSelect?.dataImage}` }} style={{ height: 120, width: 120 }} />}
                        {zoningSelect?.name && zoningSelect?.user_name && (
                            <View style={{ marginLeft: 10, justifyContent: "center" }}>
                                <Text style={{ fontWeight: "bold", fontSize: 15, maxWidth: 200 }}> {zoningSelect.name}</Text>
                                <Text>{zoningSelect.ward_name ? zoningSelect.ward_name : ''} {zoningSelect.district_name} {zoningSelect.province_name} </Text>
                                {zoningSelect.user_name ? <Text>〄{zoningSelect.user_name}</Text> : ''}
                                {zoningSelect.phonenumber ? <Text>📞{zoningSelect.phonenumber}</Text> : ''}
                                <Button title={"Xem chi tiết"} type="clear" titleStyle={{ color: Constants.Styles.COLOR_CHETWODE_BLUE, fontSize: 15 }} />
                            </View>
                        )}
                        {zoningSelect?.lat && zoningSelect?.lng && zoningSelect.name && (
                            <View>
                                <Text style={{ fontWeight: "bold", fontSize: 15 }}> {zoningSelect.name}</Text>
                                <Text> {zoningSelect.lat},{zoningSelect.lng} </Text>
                            </View>
                        )}
                        <Button title={"Tìm kiếm các Bất động sản trong vòng 500m"} type="clear" titleStyle={{ color: Constants.Styles.COLOR_CHETWODE_BLUE, fontSize: 15 }} onPress={getPostByDistance} />
                    </View>
                </BottomSheet>
                <BottomSheet modalProps={{}} isVisible={isVisiblePost} onBackdropPress={() => setIsVisiblePost(!isVisiblePost)}>
                    <ScrollView style={{ maxHeight: 300 }}>
                        {postList.listDataPost.map((post: any, i: any) => {
                            return (
                                <ListItem containerStyle={{ borderWidth: 1, borderColor: Constants.Styles.COLOR_ATHENSGRAY }} key={i} onPress={() => console.log(post.id)}>
                                    <ListItem.Content style={{ flexDirection: 'row', paddingLeft: 24 }}>
                                        <View>
                                            <Image source={{ uri: `${Constants.Api.IMAGES_URL}/${arr[post.id]}` }} style={{ height: 85, width: 85, marginHorizontal: 10 }} />
                                            <Text style={{ fontWeight: "bold", fontSize: 12, position: "absolute", color: Constants.Styles.COLOR_CHETWODE_BLUE, backgroundColor: Constants.Styles.CORLOR_WHITE, borderRadius: 5 }}>{post.dis_m} (m)</Text>
                                        </View>
                                        <ListItem.Title>
                                            <View style={{ width: 270, justifyContent: "center" }}>
                                                <Text style={{ fontWeight: "bold", fontSize: 13 }}>{post.title}</Text>
                                                <Text style={{ fontSize: 12 }}>🪙~{Math.abs(post.price * post.area / 1000).toFixed()} tỷ</Text>
                                                <Text style={{ fontSize: 12 }}>📍{post.address} tỷ</Text>
                                            </View>
                                        </ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            )
                        })}
                    </ScrollView>
                </BottomSheet>
                <WebView
                    originWhitelist={['*']}
                    onMessage={onMessage}
                    source={{
                        html: `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <meta name="viewport" content="initial-scale=1.0">
                                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin=""/>
                                <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
                                <script src="https://unpkg.com/jquery@3.6.0/dist/jquery.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
                                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
                                <script src="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.js"></script>
                                <script src="http://localhost:8080/files/leaflet-corridor.js"></script>
                                <script src="${Constants.Api.FILES_URL}/leaflet-corridor.js"></script>
                                <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.css" />
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
                            </style>
                            <body style="padding: 0; margin: 0">
                            <div id="mapid" style="width: 100%; height: 100vh;"></div>
                            <script>
                                var mymap = L.map('mapid').setView([${lat}, ${lng}], 20);
                                var osm = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                                        maxZoom: 18,
                                        attribution: 'Map data &copy; OpenStreetMap contributors, ',
                                        id: 'mapbox/streets-v11'
                                })
                                // https://api.mapbox.com/styles/v1/trinhtthao203/clactgwqy000415pgmc7covz8/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHJpbmh0dGhhbzIwMyIsImEiOiJja3VneDVyOWYyOGhoMnZubmtnZjVuZWZ3In0.sQaNoVu6uUvh2EXk5WbXMw
                                osm.addTo(mymap);
 
                                //Định các style cho point, line và polygon
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
                                var markerOnMap = L.marker([${lat}, ${lng}]);

                                var id, name ="", area="";
                                mymap.on('click', function (e) {
                                    if (markerOnMap !== null) {
                                        mymap.removeLayer(markerOnMap);
                                    }
                                    showMarker(L.marker(e.latlng));
                                    var latlng={lat:e.latlng.lng, lng:e.latlng.lat};
                                    mymap.panTo(new L.LatLng(e.latlng.lat, e.latlng.lng));
                                    sendLatLng(latlng);
                                    markerOnMap = L.marker(e.latlng).addTo(mymap);
                                });
                                
                                function showMarker(marker){
                                    name ="", purpose="", length=0, width=0;
                                    geoPolygon.features.forEach((feature) => {
                                        if(isMarkerInsidePolygon(marker,feature.geometry.coordinates[0]) || isMarkerInsidePolygon(marker,feature.geometry.coordinates[0][0])){
                                            id = feature.properties.id;
                                            sendZoningID(id);                                         
                                        }
                                    })
                                }

                                function onEachFeaturePolygon(feature, layer) {
                                    if(isMarkerInsidePolygon(markerOnMap,feature.geometry.coordinates[0])){
                                        id = feature.properties.id;
                                        name = feature.properties.name;
                                    }
                                }
                                
                                markerOnMap.addTo(mymap);    
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
                                }}).addTo(mymap)          
                                
                                //................................>> Show Polyline <<.........................
                                var geoPolylineLayer = L.geoJSON(geoPolyline,{
                                    onEachFeature:onEachFeaturePolyline
                                })
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
                                    var corridor = L.corridor([arrLatlngGeoPolyline], options);
                                    mymap.fitBounds(corridor.getBounds());
                                    corridor.addTo(mymap);
                
                                    var optionsShadow = { 
                                        corridor:feature.properties.width*10, // meters
                                        className: 'route-corridor-shadow', 
                                    };
                                    var corridorShadow = L.corridor([arrLatlngGeoPolyline], optionsShadow)
                                    corridorShadow.addTo(mymap);
                                }
                                
                                const sendLatLng = async (latlng) => {
                                    window.ReactNativeWebView.postMessage(JSON.stringify(latlng));
                                };
                                const sendZoningID = async (zoning_id) => {
                                    window.ReactNativeWebView.postMessage(JSON.stringify(zoning_id));
                                };
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

            </View>
        )
    }
}

export default Home

