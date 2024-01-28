import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    role: null,
    token: null,
    permissions: null
}

export const globalSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setName: (state, action) => {
            state.userData = action.payload;
            const {fullName} = action.payload;
            const matchedUser = userList.find((user) => user.fullName === fullName);
            state.role = matchedUser ? matchedUser.role : null;
        },
        setAuthToken: (state, action) => {
            state.token = action.payload
        },
        setUserData: (state, action) => {
            state.userData = action.payload 
            state.role = state.userData?.role
        },
        setPermissions: (state, action) => {
            state.permissions = action.payload;
        }
    }
})
export const {setName, setUserData, setAuthToken, setPermissions} = globalSlice.actions;
export default globalSlice.reducer;