import {
    FETCH_ALBUMS_REQUEST,
    FETCH_ALBUMS_SUCCESS,
    FETCH_ALBUMS_FAIL
} from '../constants/albumConstants';
import { Album } from '../actions/albumActionTypes';

export interface AlbumState {
    loading: boolean;
    albums: Album[];
    error: string;
}


interface FetchAlbumsRequest {
    type: typeof FETCH_ALBUMS_REQUEST;
}

interface FetchAlbumsSuccess {
    type: typeof FETCH_ALBUMS_SUCCESS;
    payload: Album[] | Album; // Check the payload type to handle both single and multiple albums
}

interface FetchAlbumsFail {
    type: typeof FETCH_ALBUMS_FAIL;
    payload: string; // Error message
}

type AlbumActionTypes = FetchAlbumsRequest | FetchAlbumsSuccess | FetchAlbumsFail;

// Initial state
interface InitialState {
    loading: boolean;
    albums: Album[];
    error: string;
}

const initialState: InitialState = {
    loading: false,
    albums: [],
    error: ''
};

// Album reducer
export const albumReducer = (state = initialState, action: AlbumActionTypes): InitialState => {
    switch(action.type) {
        case FETCH_ALBUMS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_ALBUMS_SUCCESS:
            return {
                loading: false,
                albums: Array.isArray(action.payload) ? action.payload : [action.payload], // Ensure payload is always an array
                error: '',
            };
        case FETCH_ALBUMS_FAIL:
            return {
                loading: false,
                albums: [],
                error: action.payload
            }
        default:
            return state;
    }
};

export default albumReducer;