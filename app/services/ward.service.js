import Constants from "../constants";
import * as apiProcessor from "./apiProcessor";

class Ward {
    handleGetBorderWard = async (id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_GEOJSON_BORDER_WARD_BY_ID, {
                id: id
            });
            return result;
        } catch (err) {
            console.log("border ward:", JSON.stringify(err));
        }

    }
}

export default Ward;