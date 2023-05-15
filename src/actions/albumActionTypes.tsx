import {
    FETCH_ALBUMS_REQUEST,
    FETCH_ALBUMS_SUCCESS,
    FETCH_ALBUMS_FAIL
} from '../constants/albumConstants';

// Assuming you have a type or interface for Album
export interface Album {
    _id: string;
    created_at: string;
    updated_at: string;
    title: string;
    artist: string;
    price: number;
    code: string;
    description: string;
    completed: boolean;
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
