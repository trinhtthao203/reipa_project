import axios from "axios";
import Constants from "../constants";

const APIProcessor = axios.create({
    baseURL: Constants.Api.BASE_URL
})

export const get = async (path: string, options = {}) => {
    const response = await APIProcessor.get(path, options);
    return response.data;
}

export const post = async (path: string, options = {}) => {
    const response = await APIProcessor.post(path, options);
    return response.data;

}

export default APIProcessor; 