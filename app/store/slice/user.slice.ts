import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserInfo } from "../../commons/interfaces"
export interface UserState {
    userInfo: IUserInfo;
    signUpInfo: IUserInfo;
}

const initialState: UserState = {
    userInfo: {
        id: "",
        phonenumber: "",
        fullname: "",
        role_id: 3,
    },
    signUpInfo: {
        phonenumber: "",
        password: "",
        fullname: "",
        address: "",
        street_id: "",
        ward_id: "",
        role_id: 2,
    }
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        storeUserInfo: (state, action: PayloadAction<any>) => {
            state.userInfo = action.payload;
        },
        setUserRole: (state, action: PayloadAction<any>) => {
            state.userInfo.role_id = action.payload;
        },
        storeSignUpInfo: (state, action: PayloadAction<any>) => {
            state.signUpInfo = action.payload;
        },
        setSignUpRole: (state, action: PayloadAction<any>) => {
            state.signUpInfo.role_id = action.payload;
        },
    },
});

export const {
    storeUserInfo, setUserRole, storeSignUpInfo, setSignUpRole
} = userSlice.actions;

export default userSlice.reducer;
