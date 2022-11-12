import Constants from "../constants";
import * as apiProcessor from "./apiProcessor";

class Province {
    handleGetBorderProvince = async (id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_GEOJSON_BORDER_PROVINCE_BY_ID, {
                id: id
            });
            return result;
        } catch (err) {
            console.log("border province:", JSON.stringify(err));
        }

    }
}

export default Province;