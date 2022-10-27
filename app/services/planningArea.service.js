import Constants from "../constants";
import * as apiProcessor from "./apiProcessor";

class PlanningArea {
    handleGetAllPlanningArea = async () => {
        try {
            const result = apiProcessor.get(Constants.ApiPath.GET_ALL_PLANNING_AREA);
            return result;
        } catch (err) {
            console.log("planning area:", JSON.stringify(err));
        }

    }
}

export default PlanningArea;