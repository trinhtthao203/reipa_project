//import
import React from "react"
import styles from "./style"
import Constants from "@app/constants";
import Strings from "@app/commons/strings";
import ScreenName from "@app/navigation/screenName";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
//component
import { Button, Icon, ListItem, Avatar } from "@rneui/themed";
import InputCustom from "@app/components/Input";
import DialogCustom from "@app/components/Dialog";
import { Text, View, Image, ImageBackground, ScrollView } from "react-native";

//image
import { House, Logo } from "@app/assets/images";

//function
import SelectList from "react-native-dropdown-select-list";
import UserService from "@app/services/user.service";
const userService = new UserService();

interface IData {
    phonenumber?: string;
    fullname?: string;
    password?: string;
    confirmPassword?: string;
    address?: string;
    province_id?: string;
    district_id?: string;
    ward_id?: string;
    street_id?: string;
    role_id?: number;
    showPassword?: boolean;
    showConfirmPassword?: boolean;
}

interface IErrorUserInfo {
    error?: boolean,
    errorPhoneNumberMsg?: string,
    errorFullNameMsg?: string,
    errorAddressMsg?: string,
    errorRoleMsg?: string,
    errorPasswordMsg?: string,
    errorConfirmPasswordMsg?: string,
    errorProvinceMsg?: string,
    errorDistrictMsg?: string,
    errorWardMsg?: string,
    errorStreet_idMsg?: string,
}

const SignUp = ({ navigation }: any) => {
    const dispatch = useDispatch();

    const [showDialog, setShowDialog] = React.useState(false);
    const [typeDialog, setTypeDialog] = React.useState("");
    const [contentDialog, setContentDialog] = React.useState("");
    const [errorInfo, setErrorInfo] = React.useState<IErrorUserInfo>({
    });

    const updateErrorInfo = (newState: IErrorUserInfo) => {
        setErrorInfo((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const [userInfo, setUserInfo] = React.useState<IData>({
        role_id: 2,
        showPassword: false,
        showConfirmPassword: false
    });

    const updateUserInfo = (newState: IData) => {
        setUserInfo((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const [errorUserInfo, setErrorUserInfo] = React.useState<IErrorUserInfo>({
        error: false,
        errorPasswordMsg: "",
        errorConfirmPasswordMsg: "",
        errorPhoneNumberMsg: "",
    });

    const updateErrorUserInfo = (newState: IErrorUserInfo) => {
        setErrorUserInfo((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const isNull = (val: any) => {
        if (val === null || val === undefined || val === "")
            return true;
        else
            return false;
    }
    const [provinceData, setProvinceData] = React.useState([]);
    const handleGetProvinceList = async () => {
        try {
            const result = await userService.handleGetProvinceList();
            console.log(result);
            setProvinceData(result.data.provinces);
        } catch (err) {
            console.log(err);
        }
    }

    const [districtData, setDistrictData] = React.useState([]);
    const handleGetDistrict = async (province_id: any) => {
        try {
            const result = await userService.handleGetDistrictByProvince(province_id);
            setDistrictData(result.data.district);
        } catch (err) {
            console.log(err);
        }
    }

    const [wardData, setWardData] = React.useState([]);
    const handleGetWard = async (province_id: any, district_id: any) => {
        try {
            const result = await userService.handleGetWardList(province_id, district_id);
            setWardData(result.data.ward);
        } catch (err) {
            console.log(err);
        }
    }

    const [streetData, setStreetData] = React.useState([]);
    const handleGetStreet = async (province_id: any, district_id: any) => {
        try {
            const result = await userService.handleGetStreetList(province_id, district_id);
            setStreetData(result.data.streets);
        } catch (err) {
            console.log(err);
        }
    }
    const handleClickProvince = (province_id: any) => {
        if (province_id == 0) {
            updateUserInfo({ province_id: "", district_id: "", ward_id: "", street_id: "" });
            setDistrictData([]);
            setWardData([]);
        } else {
            updateUserInfo({ province_id: province_id, district_id: "", ward_id: "", street_id: "" });
            handleGetDistrict(province_id);
        }
    }

    const handleClickDistrict = (province_id: any, district_id: any) => {
        if (district_id == 0) {
            updateUserInfo({ district_id: "", ward_id: "", street_id: "" });
            setWardData([]);
        } else {
            updateUserInfo({ district_id: district_id, ward_id: "", street_id: "" });
            handleGetWard(province_id, district_id);
            handleGetStreet(province_id, district_id);
        }
    }

    const handleClickWard = (ward_id: any) => {
        if (ward_id == 0) {
            updateUserInfo({ ward_id: "" });
        } else {
            updateUserInfo({ ward_id: ward_id });
        }
    }
    const handleClickStreet = (street_id: any) => {
        if (street_id == 0) {
            updateUserInfo({ street_id: "" });
        } else {
            updateUserInfo({ street_id: street_id });
        }
    }

    const handleSignUp = async () => {
        let flatFN, flatAD, flatPW, flatPN, flatPR = true;

        if (isNull(userInfo.phonenumber)) {
            flatPN = true;
            updateErrorUserInfo({
                error: true,
                errorPhoneNumberMsg: Strings.Auth.PHONENUMBER_REQUIRED_MESSAGE
            })
        } else if (Constants.RegExp.PHONE_NUMBER.test(userInfo.phonenumber || "") == false) {
            flatPN = true;
            updateErrorUserInfo({
                error: true,
                errorPhoneNumberMsg: Strings.Auth.PHONE_NUMBER_INVALID_MESSAGE
            })
        } else {
            flatPN = false;
            updateErrorUserInfo({
                error: false,
                errorPhoneNumberMsg: ""
            })
        }

        if (isNull(userInfo.fullname)) {
            flatFN = true;
            updateErrorUserInfo({
                error: true,
                errorFullNameMsg: Strings.Auth.FULLNAME_REQUIRED
            })
        } else {
            flatFN = false;
            updateErrorUserInfo({
                error: false,
                errorFullNameMsg: ""
            })
        }

        if (isNull(userInfo.address)) {
            flatAD = true;
            updateErrorUserInfo({
                error: true,
                errorAddressMsg: Strings.Message.ADDRESS_REQUIRED_MESSAGE
            })
        } else {
            flatAD = false;
            updateErrorUserInfo({
                error: false,
                errorAddressMsg: ""
            })
        }

        if (isNull(userInfo.province_id)) {
            flatPR = true;
            updateErrorUserInfo({
                error: true,
                errorProvinceMsg: "Vui lòng chọn mã tỉnh"
            })
        } else {
            flatPR = false;
            updateErrorUserInfo({
                error: false,
                errorProvinceMsg: ""
            })
        }

        if (isNull(userInfo.password)) {
            flatPW = true;
            updateErrorUserInfo({
                error: true,
                errorPasswordMsg: Strings.Auth.PASSWORD_REQUIRED_MESSAGE
            })
        } else if (userInfo.password && userInfo.password?.length < 8) {
            flatPW = true;
            updateErrorUserInfo({
                error: true,
                errorPasswordMsg: Strings.Auth.PASSWORD_LENGTH_MESSAGE
            })
        }
        else {
            flatPW = false;
            updateErrorUserInfo({
                error: false,
                errorPasswordMsg: ""
            })
        }

        if (isNull(userInfo.confirmPassword)) {
            flatPW = true;
            updateErrorUserInfo({
                error: true,
                errorConfirmPasswordMsg: Strings.Auth.CONFIRM_PASSWORD_REQUIRED_MESSAGE
            })
        } else if (userInfo.confirmPassword !== userInfo.password) {
            flatPW = true;
            updateErrorUserInfo({
                error: true,
                errorConfirmPasswordMsg: Strings.Auth.CONFIRM_PASSWORD_INCORRECTED_MESSAGE
            })
        } else {
            flatPW = false;
            updateErrorUserInfo({
                error: false,
                errorConfirmPasswordMsg: ""
            })
        }

        if (flatPR == false && flatPW == false && flatPN == false && flatFN == false && flatAD == false && errorUserInfo.error == false) {
            setShowDialog(true);
            setTypeDialog(Strings.System.LOADNING);
            setContentDialog(Strings.Message.WAITTING_MESSAGE);
            try {
                const result = await userService.handleRegister(userInfo.phonenumber, userInfo.password, userInfo.fullname, userInfo.address, userInfo.role_id,);
                if (result.code !== 200) {
                    setShowDialog(true);
                    setTypeDialog(Strings.System.WARNING);
                    setContentDialog(result.data.message);
                }
                if (result.data) {
                    setShowDialog(true);
                    setTypeDialog("success");
                    setContentDialog(Strings.Message.REGISTER_SUCCESS_MESSAGE);
                    setTimeout(() => {
                        setShowDialog(false);
                        setTypeDialog("");
                        setContentDialog("");
                        navigation.navigate(ScreenName.LOGIN)
                    }, 1500);
                }
            } catch (e) {
                setShowDialog(true);
                setTypeDialog("server");
                setContentDialog(Strings.Message.COMMON_ERROR);
                console.log("register ", JSON.stringify(e));
            }
        }
    }
    React.useEffect(() => {
        console.log("akb")
        handleGetProvinceList();
    }, []);

    return (
        <ImageBackground source={House} resizeMode="cover" style={styles.container}>
            <View style={styles.overlay}>
                <ScrollView>
                    <Image
                        source={Logo}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                    <Text style={styles.text_logo}>{Strings.Common.APP_NAME}</Text>
                    <InputCustom
                        secure={false}
                        radiusType={"top"}
                        keyboardType='numeric'
                        value={userInfo.phonenumber}
                        label={Strings.Auth.PHONENUMBER}
                        placeholder={Strings.Auth.PHONENUMBER}
                        errorMessage={errorUserInfo.errorPhoneNumberMsg}
                        secureTextEntry={userInfo.showPassword ? false : true}
                        onChangeText={(val: any) => {
                            updateUserInfo({ phonenumber: val });
                        }}
                    />
                    <InputCustom
                        secure={false}
                        value={userInfo.fullname}
                        label={Strings.Auth.FULLNAME}
                        placeholder={Strings.Auth.FULLNAME}
                        errorMessage={errorUserInfo.errorFullNameMsg}
                        onChangeText={(val: any) => { updateUserInfo({ fullname: val }) }}
                    />
                    <InputCustom
                        secure={false}
                        value={userInfo.address}
                        label={Strings.Auth.ADDRESS}
                        placeholder={Strings.Auth.ADDRESS}
                        errorMessage={errorUserInfo.errorAddressMsg}
                        onChangeText={(val: any) => { updateUserInfo({ address: val }) }}
                    />
                    <Picker
                        style={{ width: "85%", backgroundColor: Constants.Styles.CORLOR_WHITE, color: Constants.Styles.COLOR_GHOST, marginHorizontal: 32 }}
                        selectedValue={userInfo.province_id}
                        onValueChange={(itemValue, itemIndex) =>
                            handleClickProvince(itemValue)
                        }
                    >
                        <Picker.Item label={Strings.Zoning.PROVINCE} value={0} />
                        {provinceData &&
                            provinceData.map((val: any, ind: any) => {
                                return (
                                    <Picker.Item key={ind} label={val.name} value={val.id} />
                                )
                            })
                        }
                    </Picker>
                    {errorInfo.errorProvinceMsg != null && <Text style={styles.error_info}>{errorInfo.errorProvinceMsg}</Text>}
                    <Picker
                        style={{ width: "85%", backgroundColor: Constants.Styles.CORLOR_WHITE, color: Constants.Styles.COLOR_GHOST, marginHorizontal: 32 }}
                        selectedValue={userInfo.district_id}
                        onValueChange={(itemValue, itemIndex) =>
                            handleClickDistrict(userInfo.province_id, itemValue)
                        }
                    >
                        <Picker.Item label={Strings.Zoning.DISTRICT} value={0} />
                        {districtData &&
                            districtData.map((val: any, ind: any) => {
                                return (
                                    <Picker.Item key={ind} label={val.name} value={val.id} />
                                )
                            })
                        }
                    </Picker>
                    {errorInfo.errorDistrictMsg != null && <Text style={styles.error_info}>{errorInfo.errorDistrictMsg}</Text>}
                    <Picker
                        style={{ width: "85%", backgroundColor: Constants.Styles.CORLOR_WHITE, color: Constants.Styles.COLOR_GHOST, marginHorizontal: 32 }}
                        selectedValue={userInfo.ward_id}
                        onValueChange={(itemValue, itemIndex) =>
                            handleClickWard(itemValue)}
                    >
                        <Picker.Item label={Strings.Zoning.WARD} value={0} />
                        {wardData &&
                            wardData.map((val: any, ind: any) => {
                                return (
                                    <Picker.Item key={ind} label={val.name} value={val.id} />
                                )
                            })
                        }
                    </Picker>
                    {errorInfo.errorWardMsg != null && <Text style={styles.error_info}>{errorInfo.errorWardMsg}</Text>}
                    <Picker
                        style={{ width: "85%", backgroundColor: Constants.Styles.CORLOR_WHITE, color: Constants.Styles.COLOR_GHOST, marginHorizontal: 32 }}
                        selectedValue={userInfo.street_id}
                        onValueChange={(itemValue, itemIndex) =>
                            handleClickStreet(itemValue)}
                    >
                        <Picker.Item label={Strings.Post.SELECT_STREET} value={0} />
                        {streetData &&
                            streetData.map((val: any, ind: any) => {
                                return (
                                    <Picker.Item key={ind} label={val.name} value={val.id} />
                                )
                            })
                        }
                    </Picker>
                    {errorInfo.errorStreet_idMsg != null && <Text style={styles.error_info}>{errorInfo.errorStreet_idMsg}</Text>}
                    <InputCustom
                        secure={true}
                        value={userInfo.password}
                        label={Strings.Auth.PASSWORD}
                        placeholder={Strings.Auth.PASSWORD}
                        errorMessage={errorUserInfo.errorPasswordMsg}
                        secureTextEntry={userInfo.showPassword ? false : true}
                        onChangeText={(val: any) => { updateUserInfo({ password: val }) }}
                    />
                    <InputCustom
                        secure={true}
                        value={userInfo.confirmPassword}
                        label={Strings.Auth.CONFIRM_PASSWORD}
                        placeholder={Strings.Auth.CONFIRM_PASSWORD}
                        errorMessage={errorUserInfo.errorConfirmPasswordMsg}
                        secureTextEntry={userInfo.showConfirmPassword ? false : true}
                        onChangeText={(val: any) => { updateUserInfo({ confirmPassword: val }) }}
                    />
                    <Button
                        title={Strings.Auth.SIGNUP}
                        iconRight={true}
                        icon={styles.btn_icon}
                        titleStyle={styles.btn_title}
                        buttonStyle={styles.btn_style}
                        containerStyle={styles.btn_container}
                        onPress={() => handleSignUp()}
                    />
                    <Button
                        title={Strings.Auth.ISACCOUNT}
                        type="clear"
                        titleStyle={styles.text_isaccount}
                        onPress={() => { navigation.navigate(ScreenName.LOGIN) }}
                    />
                </ScrollView>
                <DialogCustom
                    show={showDialog}
                    type={typeDialog}
                    content={contentDialog}
                    onPressIn={() => setShowDialog(false)}
                />
            </View >
        </ImageBackground >
    )
}

export default SignUp

