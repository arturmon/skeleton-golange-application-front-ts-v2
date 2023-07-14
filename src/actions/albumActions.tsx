import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { RootState } from '../store';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
    FETCH_ALBUMS_REQUEST,
    FETCH_ALBUMS_SUCCESS,
    FETCH_ALBUMS_FAIL
} from '../constants/albumConstants';

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
