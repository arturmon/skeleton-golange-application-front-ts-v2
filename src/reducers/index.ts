import { combineReducers } from 'redux';
import { userLoginReducer, userLogoutReducer } from './userReducers';
import { userFetchReducer } from './userReducers';

const rootReducer = combineReducers({
    // ... other reducers ...
    userLogin: userLoginReducer,
    userLogout: userLogoutReducer,
    userFetch: userFetchReducer,
});

export default rootReducer;