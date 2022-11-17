import Constants from "../constants";
import * as apiProcessor from "./apiProcessor";

class Post {
    handleGetPostByDistance = async (lat, lng, distance, status_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_POST_BY_DISTANCE, {
                lat: lat,
                lng: lng,
                distance: distance,
                status_id: status_id
            });
            return result;
        } catch (err) {
            console.log("border province:", JSON.stringify(err));
        }

    }

    handleGetOneImageByPostID = async (post_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_ONE_IMAGE_BY_POST_ID, {
                post_id: post_id
            });
            return result;
        } catch (err) {
            console.log("one image post by zoning id:", JSON.stringify(err));
        }
    }

    handleGetGeoJSONPost = async (status_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_GEOJSON_POST, {
                status_id: status_id
            });
            return result;
        } catch (err) {
            console.log("geojson:", JSON.stringify(err));
        }
    }

    handleGetAddressByLatLng = async (lat, lng) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_ADDRESS_BY_LATLNG, {
                lat: lat,
                lng: lng
            });
            return result;
        } catch (err) {
            console.log("address:", JSON.stringify(err));
        }
    }

    handleGetTypeofPost = async () => {
        try {
            const result = apiProcessor.get(Constants.ApiPath.GET_TYPEOF_POST);
            return result;
        } catch (err) {
            console.log("address:", JSON.stringify(err));
        }
    }
    handleGetTypeofRealEstate = async () => {
        try {
            const result = apiProcessor.get(Constants.ApiPath.GET_TYPEOF_REAL_ESTATE);
            return result;
        } catch (err) {
            console.log("address:", JSON.stringify(err));
        }
    }
    handleGetJuridical = async () => {
        try {
            const result = apiProcessor.get(Constants.ApiPath.GET_JURIDICAL);
            return result;
        } catch (err) {
            console.log("Juridical:", JSON.stringify(err));
        }
    }
    handleGetFurniture = async () => {
        try {
            const result = apiProcessor.get(Constants.ApiPath.GET_FURNITURE);
            return result;
        } catch (err) {
            console.log("Furniture:", JSON.stringify(err));
        }
    }
    handleGetPostByID = async (post_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_POST_BY_ID, {
                post_id: post_id
            });
            return result;
        } catch (err) {
            console.log("Furniture:", JSON.stringify(err));
        }
    }

    handleGetAllImageByID = async (post_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_ALL_IMAGE_BY_POST_ID, {
                post_id: post_id
            });
            return result;
        } catch (err) {
            console.log("Furniture:", JSON.stringify(err));
        }
    }
}

export default Post;