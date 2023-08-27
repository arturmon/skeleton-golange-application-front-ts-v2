import {
    FETCH_ALBUMS_REQUEST,
    FETCH_ALBUMS_SUCCESS,
    FETCH_ALBUMS_FAIL
} from '../constants/albumConstants';

// Assuming you have a type or interface for Album
export interface Price {
    number: number;
    currency: string;
};

export interface Album {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    title: string;
    artist: string;
    price: Price;
    code: string;
    description: string;
    _creator_user?: string;
}

interface FetchAlbumsRequestAction {
    type: typeof FETCH_ALBUMS_REQUEST;
}

interface FetchAlbumsSuccessAction {
    type: typeof FETCH_ALBUMS_SUCCESS;
    payload: Album[];
}

interface FetchAlbumsFailAction {
    type: typeof FETCH_ALBUMS_FAIL;
    payload: string; // assuming the payload is an error message
}

type AlbumActionTypes = FetchAlbumsRequestAction | FetchAlbumsSuccessAction | FetchAlbumsFailAction;
