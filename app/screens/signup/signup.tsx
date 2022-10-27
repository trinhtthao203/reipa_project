//import
import React from "react"
import styles from "./style"
import Constants from "@app/constants";
import Strings from "@app/commons/strings";
import ScreenName from "@app/navigation/screenName";
import { useDispatch, useSelector } from "react-redux";

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
    errorProvinceMsg?: string,
    errorDistrictMsg?: string,
    errorWardMsg?: string,
    errorStreetMsg?: string,
    errorRoleMsg?: string,
    errorPasswordMsg?: string,
    errorConfirmPasswordMsg?: string,
}

const SignUp = ({ navigation }: any) => {
    const dispatch = useDispatch();

    const [showDialog, setShowDialog] = React.useState(false);
    const [typeDialog, setTypeDialog] = React.useState("");
    const [contentDialog, setContentDialog] = React.useState("");

    const [selected, setSelected] = React.useState("");
    const [userInfo, setUserInfo] = React.useState<IData>({
        phonenumber: "",
        password: "",
        fullname: "",
        address: "",
        confirmPassword: "",
        province_id: "",
        district_id: "",
        street_id: "",
        ward_id: "",
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

    const handleSignUp = async () => {
        let flatFN, flatPR, flatDI, flatWA, flatAD, flatPW, flatPN = true;

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

        if (isNull(userInfo.province_id)) {
            flatPR = true;
            updateErrorUserInfo({
                error: true,
                errorProvinceMsg: Strings.Message.PROVINCE_REQUIRED_MESSAGE
            })
        } else {
            flatPR = false;
            updateErrorUserInfo({
                error: false,
                errorProvinceMsg: ""
            })
        }

        if (isNull(userInfo.district_id)) {
            flatDI = true;
            updateErrorUserInfo({
                error: true,
                errorDistrictMsg: Strings.Message.DISTRICT_REQUIRED_MESSAGE
            })
        } else {
            flatDI = false;
            updateErrorUserInfo({
                error: false,
                errorDistrictMsg: ""
            })
        }

        if (isNull(userInfo.ward_id)) {
            flatWA = true;
            updateErrorUserInfo({
                error: true,
                errorWardMsg: Strings.Message.WARD_REQUIRED_MESSAGE
            })
        } else {
            flatWA = false;
            updateErrorUserInfo({
                error: false,
                errorWardMsg: ""
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

        if (flatPW == false && flatPN == false && flatFN == false && flatPR == false && flatDI == false && flatWA == false && flatAD == false && errorUserInfo.error == false) {
            setShowDialog(true);
            setTypeDialog(Strings.System.LOADNING);
            setContentDialog(Strings.Message.WAITTING_MESSAGE);
            try {
                const result = await userService.handleRegister(userInfo.phonenumber, userInfo.password, userInfo.fullname, userInfo.address, userInfo.street_id, userInfo.ward_id, userInfo.role_id,);
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

    const [provinceData, setProvinceData] = React.useState([]);
    const handleGetProvinceList = async () => {
        try {
            const result = await userService.handleGetProvinceList();
            let newArray = result.data.provinces.map((item: any) => {
                return { key: item.id, value: item.name }
            })
            setProvinceData(newArray)
        } catch (err) {
            console.log(err);
        }
    }

    const [districtData, setDistrictData] = React.useState([]);
    const handleGetDistrict = async (province_id: any) => {
        console.log(userInfo.province_id);
        try {
            const result = await userService.handleGetDistrictByProvince(province_id);
            let newArray = result.data.district.map((item: any) => {
                return { key: item.id, value: item.name }
            })
            setDistrictData(newArray);
        } catch (err) {
            console.log(err);
        }
    }

    const [wardData, setWardData] = React.useState([]);
    const handleGetWard = async (province_id: any, district_id: any) => {
        try {
            const result = await userService.handleGetWardList(province_id, district_id);
            let newArray = result.data.ward.map((item: any) => {
                return { key: item.id, value: item.name }
            })
            setWardData(newArray);
        } catch (err) {
            console.log(err);
        }
    }

    const [streetData, setStreetData] = React.useState([]);
    const handleGetStreet = async (province_id: any, district_id: any) => {
        try {
            const result = await userService.handleGetStreetList(province_id, district_id);
            let newArray = result.data.streets.map((item: any) => {
                return { key: item.id, value: item.name }
            })
            setStreetData(newArray);
        } catch (err) {
            console.log(err);
        }
    }

    React.useEffect(() => {
        handleGetProvinceList();
    }, [])

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
                    <View style={{ width: "85%", marginHorizontal: 32, backgroundColor: Constants.Styles.CORLOR_WHITE }}>
                        <SelectList
                            maxHeight={250}
                            placeholder={"Chọn Tỉnh/ Thành phố *"}
                            dropdownStyles={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                            dropdownTextStyles={{ color: Constants.Styles.COLOR_BLACK }}
                            inputStyles={{ color: Constants.Styles.COLOR_BLACK }}
                            setSelected={setSelected}
                            data={provinceData}
                            onSelect={() => {
                                updateUserInfo({ province_id: selected, district_id: "", ward_id: "", street_id: "" });
                                handleGetDistrict(selected);
                            }}
                        />
                        {errorUserInfo.errorProvinceMsg != null && <Text style={styles.error_info}>{errorUserInfo.errorProvinceMsg}</Text>}
                        {userInfo.province_id !== "" && <SelectList
                            maxHeight={250}
                            placeholder={"Chọn Quận/Huyện *"}
                            boxStyles={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                            dropdownStyles={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                            dropdownTextStyles={{ color: Constants.Styles.COLOR_BLACK }}
                            inputStyles={{ color: Constants.Styles.COLOR_BLACK }}
                            setSelected={setSelected}
                            data={districtData}
                            onSelect={() => {
                                updateUserInfo({ district_id: selected });
                                handleGetWard(userInfo.province_id, selected);
                                handleGetStreet(userInfo.province_id, selected)

                            }}
                        />}
                        {userInfo.province_id != "" && errorUserInfo.errorDistrictMsg != null && <Text style={styles.error_info}>{errorUserInfo.errorDistrictMsg}</Text>}
                        {userInfo.province_id != "" && userInfo.district_id != "" && <SelectList
                            maxHeight={250}
                            placeholder={"Chọn Xã/ Phường *"}
                            boxStyles={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                            dropdownStyles={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                            dropdownTextStyles={{ color: Constants.Styles.COLOR_BLACK }}
                            inputStyles={{ color: Constants.Styles.COLOR_BLACK }}
                            setSelected={setSelected}
                            data={wardData}
                            onSelect={() => {
                                updateUserInfo({ ward_id: selected });
                            }}
                        />
                        }
                        {userInfo.province_id != "" && userInfo.district_id != "" && errorUserInfo.errorWardMsg != null && <Text style={styles.error_info}>{errorUserInfo.errorWardMsg}</Text>}
                        {userInfo.province_id != "" && userInfo.district_id != "" && <SelectList
                            maxHeight={250}
                            placeholder={"Chọn Đường"}
                            boxStyles={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                            dropdownStyles={{ backgroundColor: Constants.Styles.CORLOR_WHITE }}
                            dropdownTextStyles={{ color: Constants.Styles.COLOR_BLACK }}
                            inputStyles={{ color: Constants.Styles.COLOR_BLACK }}
                            setSelected={setSelected}
                            data={streetData}
                            onSelect={() => {
                                updateUserInfo({ street_id: selected });
                            }}
                        />}
                    </View>
                    <InputCustom
                        secure={false}
                        value={userInfo.address}
                        label={Strings.Auth.ADDRESS}
                        placeholder={Strings.Auth.ADDRESS}
                        errorMessage={errorUserInfo.errorAddressMsg}
                        onChangeText={(val: any) => { updateUserInfo({ address: val }) }}
                    />
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
            </View>
        </ImageBackground >
    )
}

export default SignUp

