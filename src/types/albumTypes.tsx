import { Action } from 'redux';

export interface Album {
    // Define the properties of an album
}

export interface FetchAlbumsAction extends Action {
    type: string;
    payload?: Album[];
}

export const FETCH_ALBUMS_SUCCESS = 'FETCH_ALBUMS_SUCCESS';
export const FETCH_ALBUMS_FAILURE = 'FETCH_ALBUMS_FAILURE';

export interface FetchAlbumsSuccessAction {
    type: typeof FETCH_ALBUMS_SUCCESS;
    payload: Album[];
}

export interface FetchAlbumsFailureAction {
    type: typeof FETCH_ALBUMS_FAILURE;
    payload: string;
}

export type AlbumActionTypes = FetchAlbumsSuccessAction | FetchAlbumsFailureAction;
