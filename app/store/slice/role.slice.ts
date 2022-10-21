import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRole } from "../../commons/interfaces"
export interface RoleState {
    role: IRole;
}

const initialState: RoleState = {
    role: {
        id: "",
        name: "",
        description: "",
    },
};

export const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {
        storeRoleData: (state, action: PayloadAction<any>) => {
            state.role = action.payload;
        },
    },
});

export const {
    storeRoleData
} = roleSlice.actions;

export default roleSlice.reducer;
