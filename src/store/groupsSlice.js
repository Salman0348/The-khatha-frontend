import { createSlice } from "@reduxjs/toolkit";

//currently I'm using it just for group info upadation,deletion: edit group //////////////
const initialState = {
  isGroupInfoUpdated: false,
  isGrpDeleted: false,
  deletedGrpId: null,
};
const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setIsGroupInfoUpdated: (state, action) => {
      state.isGroupInfoUpdated = action.payload;
    },
    setGrpDeleted: (state, action) => {
      state.deletedGrpId = action.payload;
      state.isGrpDeleted = true;
    },
    setGrpDeletedDefault: (state) => {
      state.isGrpDeleted = false;
      state.deletedGrpId = null;
    },
  },
});

export const { setIsGroupInfoUpdated, setGrpDeleted, setGrpDeletedDefault } =
  groupsSlice.actions;
export default groupsSlice.reducer;
