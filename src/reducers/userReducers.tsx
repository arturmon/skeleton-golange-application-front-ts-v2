import {USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT} from "../constants/userConstants";
import { AnyAction } from 'redux';

export interface UserState {
    loading?: boolean,
    error?: string,
    userInfo: { email?: string } | null // Make sure userInfo can be null
    userData?: UserData;
}

interface UserData {
    name: string;
    email: string;
}

interface Action {
    type: string,
    payload?: string
}

const initialState: UserState = {
    userInfo: null,
    userData: undefined,
    loading: false,
    error: undefined,
};

export const userLoginReducer = (state: UserState = { userInfo: {} }, action: Action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true };
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload };
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
};

export const userLogoutReducer = (state: UserState = { userInfo: null }, action: AnyAction): UserState => {
    switch (action.type) {
        case USER_LOGOUT:
            return { userInfo: null };
        default:
            return state;
    }
};

// New reducer to handle fetched user data
export const userFetchReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case 'FETCH_USER_SUCCESS':
            return {
                ...state,
                userData: action.payload,
            };
        case 'FETCH_USER_FAIL':
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};