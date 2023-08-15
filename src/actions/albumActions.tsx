import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { RootState } from '../store';
import axios from 'axios';
import {
    FETCH_ALBUMS_REQUEST,
    FETCH_ALBUMS_SUCCESS,
    FETCH_ALBUMS_FAIL
} from '../constants/albumConstants';

export interface Album {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    title: string;
    artist: string;
    price: number;
    code: string;
    description: string;
    completed: boolean;
}


export const fetchAlbums = () => async (dispatch: ThunkDispatch<RootState, unknown, AnyAction>) => {
    console.log('fetchAlbumsAction running');
    try {
        dispatch({ type: FETCH_ALBUMS_REQUEST });

        const response = await axios.get('http://localhost:10000/v1/albums', { withCredentials: true });
        console.log(response.data);
        const { data } = response;


        dispatch({
            type: FETCH_ALBUMS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: FETCH_ALBUMS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
};

export const addAlbum = (albumData: Album) => async (
    dispatch: ThunkDispatch<RootState, unknown, AnyAction>
) => {
    console.log('addAlbumAction running');
    try {
        dispatch({ type: FETCH_ALBUMS_REQUEST });

        const response = await axios.post('http://localhost:10000/v1/album', albumData, {
            withCredentials: true,
        });
        console.log(response.data);
        const { data } = response;

        const { _id, created_at, updated_at, ...rest } = data; // Destructure the unnecessary fields

        dispatch({
            type: FETCH_ALBUMS_SUCCESS,
            payload: rest, // Use the rest of the data for payload
        });
    } catch (error) {
        dispatch({
            type: FETCH_ALBUMS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const updateAlbums = (updatedAlbumData: Album | null) => async (dispatch: ThunkDispatch<RootState, unknown, AnyAction>) => {
    console.log('updateAlbums action running');
    try {
        dispatch({ type: FETCH_ALBUMS_REQUEST });

        const response = await axios.post('http://localhost:10000/v1/album/update', updatedAlbumData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const { data } = response;

        dispatch({
            type: FETCH_ALBUMS_SUCCESS,
            payload: data, // Update state with the updated album data
        });
    } catch (error) {
        dispatch({
            type: FETCH_ALBUMS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};


export const findAlbumByCode = (code: string) => async (dispatch: ThunkDispatch<RootState, unknown, AnyAction>) => {
    console.log('findAlbumByCode action running');
    try {
        dispatch({ type: FETCH_ALBUMS_REQUEST });

        const response = await axios.get(`http://localhost:10000/v1/albums/${code}`, { withCredentials: true });
        console.log(response.data);
        const { data } = response;

        dispatch({
            type: FETCH_ALBUMS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_ALBUMS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};


export const deleteAlbumByCode = (code: string) => async (
    dispatch: ThunkDispatch<RootState, unknown, AnyAction>
) => {
    console.log('deleteAlbumByCode action running');
    try {
        dispatch({ type: FETCH_ALBUMS_REQUEST });

        const response = await axios.delete(`http://localhost:10000/v1/albums/delete/${code}`, { withCredentials: true });
        console.log(response.data);
//        const { data } = response;


    } catch (error) {
        dispatch({
            type: FETCH_ALBUMS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const deleteAllAlbums = () => async (dispatch: ThunkDispatch<RootState, unknown, AnyAction>) => {
    console.log('deleteAllAlbums action running');
    try {
        dispatch({ type: FETCH_ALBUMS_REQUEST });

        const response = await axios.delete('http://localhost:10000/v1/albums/deleteAll', { withCredentials: true });
        console.log(response.data);
        const { data } = response;

        dispatch({
            type: FETCH_ALBUMS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_ALBUMS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

