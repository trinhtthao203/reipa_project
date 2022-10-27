//import
import React, { useState, useRef, useEffect } from "react"
import styles from "./style";
import Strings from "@app/commons/strings";
import ScreenName from "@app/navigation/screenName";
import HeaderComp from "@app/components/HeaderComp";
import { WebView } from "react-native-webview";
import Geolocation from '@react-native-community/geolocation';
import html_script from "@app/html_script/html_script_mapscreen";

//element
import { View, Button } from "react-native"

//function
import Loading from "../loading";
import {
    _showLocationGPS,
    _showGEOJSONFILE,
    _showMapScreen,
} from "@app/Utils/Common";

import PlanningAreaService from "@app/services/planningArea.service";
import { Text } from "@rneui/base";
const planningAreaService = new PlanningAreaService();

const Home = ({ navigation }: any) => {

    const Map_Ref = useRef();
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);

    setInterval(() => {
        handleGetLocation()
    }, 5000);

    const handleGetLocation = () => {
        Geolocation.getCurrentPosition(info => {
            setLat(info.coords.latitude);
            setLng(info.coords.longitude);
        });
    }

    const [planningAreaData, setPlanningAreaData] = React.useState([]);
    const handleGetPlanningAreaList = async () => {
        try {
            const result = await planningAreaService.handleGetAllPlanningArea();
            setPlanningAreaData(result.data.planningArea);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleGetLocation();
        handleGetPlanningAreaList();
    }, []);

    const goPostDetail = () => {
        navigation.navigate(ScreenName.POSTDETAIL)
    }

    if (isLoading) {
        return (
            <Loading />
        )
    } else {
        return (
            <View style={styles.container}>
                <HeaderComp title={Strings.Home.TITLE} height={17} />
                <WebView
                    originWhitelist={['*']}
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
                                <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.css" />
                            </head>
                            <body style="padding: 0; margin: 0">
                            <div id="mapid" style="width: 100%; height: 100vh;"></div>
                            <script>
                                var mymap = L.map('mapid').setView([${lat}, ${lng}], 14);
                                var osm = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                                        maxZoom: 18,
                                        attribution: 'Map data &copy; OpenStreetMap contributors, ',
                                        id: 'mapbox/streets-v11'
                                })
                                osm.addTo(mymap);
                                L.marker([${lat}, ${lng}]).addTo(mymap);
                            </script>
                            </body>
                            </html>
                    `}}
                />
            </View>
        )
    }
}

export default Home

