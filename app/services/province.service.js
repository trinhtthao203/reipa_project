import Constants from "../constants";
import * as apiProcessor from "./apiProcessor";

class Province {
    handleGetBorderProvinces = async (id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_BORDER_PROVINCE, {
                id: id
            });
            return result;
        } catch (err) {
            console.log("border province:", JSON.stringify(err));
        }

    }
}

export default Province;