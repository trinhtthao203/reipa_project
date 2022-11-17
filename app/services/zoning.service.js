import Constants from "../constants";
import * as apiProcessor from "./apiProcessor";
import axios from 'axios';

class Zoning {
    handleGetAllZoning = async () => {
        try {
            const result = apiProcessor.get(Constants.ApiPath.GET_ALL_ZONING);
            return result;
        } catch (err) {
            console.log("get all zoning:", JSON.stringify(err));
        }
    }

    handleGetAllZoningGeoJSON = async (status_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_ALL_ZONING_GEOJSON, {
                status_id: status_id
            });
            return result;
        } catch (err) {
            console.log("zoning geojson:", JSON.stringify(err));
        }
    }

    handleGetAllZoningGeoJSONPolygon = async (status_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_ALL_ZONING_GEOJSON_POLYGON, {
                status_id: status_id
            });
            return result;
        } catch (err) {
            console.log("zoning geojson polygon:", JSON.stringify(err));
        }
    }

    handleGetAllZoningGeoJSONPolyline = async (status_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_ALL_ZONING_GEOJSON_POLYLINE, {
                status_id: status_id
            });
            return result;
        } catch (err) {
            console.log("zoning geojson polyline:", JSON.stringify(err));
        }
    }

    handleAddZoning = async (formData) => {
        const result = await axios.post(Constants.Api.BASE_URL + Constants.ApiPath.ADD_ZONING, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return result;
    }

    handleGetAllInvestor = async () => {
        try {
            const result = apiProcessor.get(Constants.ApiPath.GET_ALL_INVESTOR);
            return result;
        } catch (err) {
            console.log("investor :", JSON.stringify(err));
        }

    }

    handleGetAllTypeZoning = async () => {
        try {
            const result = apiProcessor.get(Constants.ApiPath.GET_ALL_TYPE_ZONING);
            return result;
        } catch (err) {
            console.log("type of zoning:", JSON.stringify(err));
        }
    }

    handleGetPolygonByID = async (id, status_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_ALL_ZONING_POLYGON_BY_ID, {
                id: id,
                status_id: status_id
            });
            return result;
        } catch (err) {
            console.log("polygon zoning by id:", JSON.stringify(err));
        }
    }

    handleGetPolylineByLatLngWithDistance = async (lat, lng, status_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_ALL_ZONING_POLYLINE_LATLNG_DISTANCE, {
                lat: lat,
                lng: lng,
                status_id: status_id
            });
            return result;
        } catch (err) {
            console.log("polyline zoning by distance:", JSON.stringify(err));
        }
    }

    handleGetOneImageByZoningID = async (zoning_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_ONE_IMAGE_BY_ZONING_ID, {
                zoning_id: zoning_id
            });
            return result;
        } catch (err) {
            console.log("one image zoning by zoning id:", JSON.stringify(err));
        }
    }
    handleGetZoningByID = async (zoning_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_ZONING_BY_ID, {
                zoning_id: zoning_id
            });
            return result;
        } catch (err) {
            console.log("GetZoningByID:", JSON.stringify(err));
        }
    }

    handleGetImagesByID = async (zoning_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_ALL_IMAGE_BY_ZONING_ID, {
                zoning_id: zoning_id
            });
            return result;
        } catch (err) {
            console.log("GetZoningByID:", JSON.stringify(err));
        }
    }

    handleGetZoningByUserID = async (user_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_ALL_ZONING_BY_USER_ID, {
                user_id: user_id
            });
            return result;
        } catch (err) {
            console.log("GetZoningByUserID:", JSON.stringify(err));
        }
    }
    handleDeleteZoning = async (zoning_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.DELETE_ZONING, {
                zoning_id: zoning_id
            });
            return result;
        } catch (err) {
            console.log("handleDeleteZoning :", JSON.stringify(err));
        }
    }
}

export default Zoning;