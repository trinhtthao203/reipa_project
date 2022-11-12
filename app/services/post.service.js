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
}

export default Post;