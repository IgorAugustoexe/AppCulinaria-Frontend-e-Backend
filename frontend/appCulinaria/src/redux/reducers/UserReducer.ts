import { createSlice } from "@reduxjs/toolkit";

const initialStateUser = {
  userId: null,
  name: "",
  userName: "",
  authToken: "",
};

const UserReducer = createSlice({
  name: "user",
  initialState: initialStateUser,

  reducers: {
    setUserInfo(state: any, action: any) {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetUser: () => {
      return {
        ...initialStateUser,
      };
    },
  },
});

export const selectUserName = (state: any) => state.user.name;
export const selectUserAuthToken = (state: any) => state.user.authToken;

export const { setUserInfo, resetUser } = UserReducer.actions;

export default UserReducer.reducer;
