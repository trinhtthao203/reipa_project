import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserSetting } from "../../commons/interfaces"
export interface ProfileState {
  userSetting: IUserSetting;
}

const initialState: ProfileState = {
  userSetting: {
    id: "",
    teamId: "",
    teamName: "",
    organizationId: "",
    organizationName: "",
  },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserSetting: (state, action: PayloadAction<any>) => {
      state.userSetting = action.payload;
    },
    setTeamId: (state, action: PayloadAction<string>) => {
      state.userSetting.teamId = action.payload;
    },
    setOrganizationId: (state, action: PayloadAction<string>) => {
      state.userSetting.organizationId = action.payload;
    },
  },
});

export const {
  setTeamId,
  setUserSetting,
  setOrganizationId,
} = profileSlice.actions;

export default profileSlice.reducer;
