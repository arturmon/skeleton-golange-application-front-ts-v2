import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {UserState} from "../reducers/userReducers";

const HomeScreen = () => {

    const userLogin = useSelector<RootState, UserState>(
        state => state.userLogin
    )

    const { userInfo } = userLogin
    const email = userInfo ? userInfo.email : null

    return(
        email ? (
            <h1>Welcome {email} to the Album App</h1>
        ) : (
            <h1>Welcome to the Album App</h1>
        )
    )
}

export default HomeScreen