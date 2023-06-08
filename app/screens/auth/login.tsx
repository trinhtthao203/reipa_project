//import
import React, {useState, useEffect} from 'react';
import styles from './style';
import Constants from '@app/constants';
import Strings from '@app/commons/strings';
import ScreenName from '@app/navigation/screenName';
import {useDispatch, useSelector} from 'react-redux';

//interface
import {IUserInfo} from '../../commons/interfaces';

//commponent
import InputCustom from '@app/components/Input';
import DialogCustom from '@app/components/Dialog';
import {Button, Text, CheckBox} from '@rneui/themed';
import {View, Image, ImageBackground, BackHandler} from 'react-native';

//image
import {House, Logo} from '@app/assets/images';

//function
import AsyncStorage from '@react-native-async-storage/async-storage';
import {storeUserInfo} from '../../store/slice/user.slice';

import UserService from '@app/services/user.service';
const userService = new UserService();
interface IData {
  phonenumber?: string;
  password?: string;
  showPassword?: boolean;
}
interface IErrorUserInfo {
  error?: boolean;
  errorPhoneNumberMsg?: string;
  errorPasswordMsg?: string;
}

const LogIn = ({navigation}: any) => {
  const dispatch = useDispatch();

  const [checked, setChecked] = useState(false);
  const [pnStorage, setPnStorage] = useState();
  const [pwStorage, setPwStorage] = useState();

  const [showDialog, setShowDialog] = useState(false);
  const [typeDialog, setTypeDialog] = useState('');
  const [contentDialog, setContentDialog] = useState('');

  AsyncStorage.getItem('phonenumber')
    .then((val: any) => {
      setPnStorage(val);
    })
    .catch(error => {
      throw error;
    });
  AsyncStorage.getItem('password')
    .then((val: any) => {
      setPwStorage(val);
    })
    .catch(error => {
      throw error;
    });

  useEffect(() => {
    updateUserInfo({phonenumber: pnStorage});
    updateUserInfo({password: pwStorage});
    setChecked(true);
  }, [pnStorage, pwStorage]);

  const [userInfo, setUserInfo] = React.useState<IData>({
    phonenumber: pnStorage,
    password: pwStorage,
    showPassword: false,
  });

  const updateUserInfo = (newState: IData) => {
    setUserInfo(prevState => ({
      ...prevState,
      ...newState,
    }));
  };

  const [errorUserInfo, setErrorUserInfo] = React.useState<IErrorUserInfo>({
    error: false,
    errorPasswordMsg: '',
    errorPhoneNumberMsg: '',
  });

  const updateErrorUserInfo = (newState: IErrorUserInfo) => {
    setErrorUserInfo(prevState => ({
      ...prevState,
      ...newState,
    }));
  };

  const isNull = (val: any) => {
    if (val === null || val === undefined || val === '') return true;
    else return false;
  };

  const handleLogIn = async () => {
    let flatPW,
      flatPN = true;

    if (isNull(userInfo.phonenumber)) {
      flatPN = true;
      updateErrorUserInfo({
        error: true,
        errorPhoneNumberMsg: Strings.Auth.PHONENUMBER_REQUIRED_MESSAGE,
      });
    } else if (
      Constants.RegExp.PHONE_NUMBER.test(userInfo.phonenumber || '') == false
    ) {
      flatPN = true;
      updateErrorUserInfo({
        error: true,
        errorPhoneNumberMsg: Strings.Auth.PHONE_NUMBER_INVALID_MESSAGE,
      });
    } else {
      flatPN = false;
      updateErrorUserInfo({
        error: false,
        errorPhoneNumberMsg: '',
      });
    }

    if (isNull(userInfo.password)) {
      flatPW = true;
      updateErrorUserInfo({
        error: true,
        errorPasswordMsg: Strings.Auth.PASSWORD_REQUIRED_MESSAGE,
      });
    } else {
      flatPW = false;
      updateErrorUserInfo({
        error: false,
        errorPasswordMsg: '',
      });
    }

    if (flatPW == false && flatPN == false && errorUserInfo.error == false) {
      setShowDialog(true);
      setTypeDialog(Strings.System.LOADNING);
      setContentDialog(Strings.Message.WAITTING_MESSAGE);
      try {
        const result = await userService.handleLogIn(
          userInfo.phonenumber,
          userInfo.password,
        );
        if (result.code !== 200) {
          setShowDialog(true);
          setTypeDialog(Strings.System.WARNING);
          setContentDialog(result.data.userInfo.message);
        }
        console.log(result);
        if (result.data && result.data.accessToken) {
          if (checked === true) {
            AsyncStorage.setItem('phonenumber', userInfo.phonenumber || '');
            AsyncStorage.setItem('password', userInfo.password || '');
          }
          const userData: IUserInfo = {
            id: result.data.userInfo.id,
            phonenumber: result.data.userInfo.phonenumber,
            fullname: result.data.userInfo.fullname,
            address: result.data.userInfo.address,
            avatar: result.data.userInfo.avatar,
            street_id: result.data.userInfo.street_id,
            ward_id: result.data.userInfo.ward_id,
            ward_name: result.data.userInfo.ward_name,
            district_name: result.data.userInfo.district_name,
            province_name: result.data.userInfo.province_name,
            role_id: result.data.userInfo.role_id,
            createdAt: result.data.userInfo.createdAt,
            updatedAt: result.data.userInfo.updatedAt,
          };
          dispatch(storeUserInfo(userData));
          navigation.navigate(ScreenName.PROFILE);
        }
      } catch (e) {
        setShowDialog(true);
        setTypeDialog('server');
        setContentDialog(Strings.Message.COMMON_ERROR);
        console.log('login ', JSON.stringify(e));
      }
    }
  };

  const handleLogOut = async () => {
    dispatch(
      storeUserInfo({
        id: '',
        phonenumber: '',
        fullname: '',
        avatar: '',
        street_id: '',
        ward_id: '',
        role_id: '',
      }),
    );
    navigation.navigate(ScreenName.HOME);
  };

  return (
    <ImageBackground source={House} resizeMode="cover" style={styles.container}>
      <View style={styles.overlay}>
        <Image source={Logo} resizeMode="contain" style={styles.logo} />
        <Text style={styles.text_logo}>{Strings.Common.APP_NAME}</Text>
        <InputCustom
          secure={false}
          radiusType={'top'}
          keyboardType="numeric"
          value={userInfo.phonenumber}
          label={Strings.Auth.PHONENUMBER}
          placeholder={Strings.Auth.PHONENUMBER}
          errorMessage={errorUserInfo.errorPhoneNumberMsg}
          secureTextEntry={userInfo.showPassword ? false : true}
          onChangeText={(val: any) => {
            updateUserInfo({phonenumber: val});
          }}
        />
        <InputCustom
          secure={true}
          value={userInfo.password}
          label={Strings.Auth.PASSWORD}
          placeholder={Strings.Auth.PASSWORD}
          errorMessage={errorUserInfo.errorPasswordMsg}
          secureTextEntry={userInfo.showPassword ? false : true}
          onChangeText={(val: any) => {
            updateUserInfo({password: val});
          }}
        />
        <Button
          title={Strings.Auth.LOGIN}
          iconRight={true}
          icon={styles.btn_icon}
          titleStyle={styles.btn_title}
          buttonStyle={styles.btn_style}
          containerStyle={styles.btn_container}
          onPress={() => handleLogIn()}
        />
        <CheckBox
          checked={checked || false}
          size={30}
          title="Lưu mật khẩu"
          onIconPress={() => setChecked(!checked)}
          onPress={() => setChecked(!checked)}
          containerStyle={{
            marginLeft: 22,
            backgroundColor: 'rgba(0, 0, 0,0.0)',
            width: '70%',
          }}
          checkedColor={Constants.Styles.COLOR_AMBER}
        />
        <Button
          type="clear"
          title={Strings.Auth.FORGET_PASSWORD}
          titleStyle={styles.text_isaccount}
          onPress={() => {
            navigation.navigate(ScreenName.FORGETPASSWORD);
          }}
        />
        <Button
          type="clear"
          title={Strings.Auth.NOTACCOUNT}
          titleStyle={styles.text_isaccount}
          onPress={() => {
            navigation.navigate(ScreenName.SIGNUP);
          }}
        />
      </View>
      <DialogCustom
        show={showDialog}
        type={typeDialog}
        content={contentDialog}
        onPressIn={() => setShowDialog(false)}
      />
    </ImageBackground>
  );
};

export default LogIn;
