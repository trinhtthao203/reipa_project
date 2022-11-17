import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAddressStore } from "../../commons/interfaces"
export interface PostState {
    addressStoreInfo: IAddressStore;
}

const initialState: PostState = {
    addressStoreInfo: {
        lat_store: "",
        lng_store: "",
        province_id: "",
        district_id: "",
        ward_id: "",
    },
};

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        storeAddressInfo: (state, action: PayloadAction<any>) => {
            state.addressStoreInfo = action.payload;
        },
    },
});

export const {
    storeAddressInfo
} = postSlice.actions;

export default postSlice.reducer;
