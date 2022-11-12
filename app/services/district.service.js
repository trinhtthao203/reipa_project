import Constants from "../constants";
import * as apiProcessor from "./apiProcessor";

class District {
    handleGetBorderDistrict = async (id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_GEOJSON_BORDER_DISTRICT_BY_ID, {
                id: id
            });
            return result;
        } catch (err) {
            console.log("border district:", JSON.stringify(err));
        }

    }
}

export default District;