import Constants from "../constants";
import * as apiProcessor from "./apiProcessor";

class UserService {
    handleLogIn = async (phonenumber, password) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.LOGIN, {
                phonenumber: phonenumber,
                password: password
            })
            return result;
        } catch (err) {
            console.log("service:", JSON.stringify(err));
        }

    }

    handleCheckPhoneNumber = async (phonenumber) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.CHECK_PHONENUMBER, {
                phonenumber: phonenumber,
            })
            return result;
        } catch (err) {
            console.log("service:", JSON.stringify(err));
        }

    }

    handleResetPassword = async (phonenumber, password) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.RESET_PASSWORD, {
                phonenumber: phonenumber,
                password: password
            })
            return result;
        } catch (err) {
            console.log("service:", JSON.stringify(err));
        }

    }

    handleGetRole = async () => {
        try {
            const result = apiProcessor.get(Constants.ApiPath.GET_ALL_ROLE);
            return result;
        } catch (err) {
            console.log("role:", JSON.stringify(err));
        }

    }
    handleGetProvinceList = async () => {
        try {
            const result = apiProcessor.get(Constants.ApiPath.GET_ALL_PROVINCE);
            return result;
        } catch (err) {
            console.log("role:", JSON.stringify(err));
        }

    }
    handleGetDistrictByProvince = async (province_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_DISTRICT_BY_PROVINCE, {
                province_id: province_id
            });
            return result;
        } catch (err) {
            console.log("districyByProvince:", JSON.stringify(err));
        }

    }
    handleGetWardList = async (province_id, district_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_WARD_SIGN_UP, {
                province_id: province_id,
                district_id: district_id
            });
            return result;
        } catch (err) {
            console.log("ward signup:", JSON.stringify(err));
        }

    }
    handleGetStreetList = async (province_id, district_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.GET_STREET_SIGN_UP, {
                province_id: province_id,
                district_id: district_id
            });
            return result;
        } catch (err) {
            console.log("streets sign up:", JSON.stringify(err));
        }

    }
    handleRegister = async (phonenumber, password, fullname, address, role_id) => {
        try {
            const result = apiProcessor.post(Constants.ApiPath.REGISTER, {
                phonenumber: phonenumber,
                password: password,
                fullname: fullname,
                address: address,
                role_id: role_id,
            });
            return result;
        } catch (err) {
            console.log("register", JSON.stringify(err));
        }

    }
}

export default UserService;