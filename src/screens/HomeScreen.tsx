import { ThunkDispatch } from 'redux-thunk';
import {AnyAction, applyMiddleware, combineReducers, createStore} from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {userLoginReducer, UserState} from '../reducers/userReducers';
import { fetchAlbums } from '../actions/albumActions';
import React, { useEffect } from 'react';
import {albumReducer, AlbumState} from '../reducers/albumReducers'; // Import the AlbumState interface
import { Album } from '../actions/albumActions';
import {composeWithDevTools} from "redux-devtools-extension";
import {AppThunkDispatch} from "../actions/userActions";



const HomeScreen = () => {
    const dispatch = useDispatch<ThunkDispatch<RootState, null, AnyAction>>();
    const userLogin = useSelector<RootState, UserState>((state) => state.userLogin);
    //const albumState = useSelector<RootState, AlbumState>((state) => state.albumState); // Access the album state
    const albumState = useSelector((state: RootState) => state.albumState);

    const { userInfo } = userLogin;
    const email = userInfo ? userInfo.email : null;


    useEffect(() => {
        const fetchAlbumsAction = async () => {
            try {
                await dispatch(fetchAlbums());
            } catch (error) {
                console.error(error); // Log the error
            }
        };
        if (email) {
            fetchAlbumsAction();
        }
    }, [dispatch, email]);

    console.log(albumState); // Log the albumState

    // Render a loading message, error message, or the albums table
    const renderContent = () => {
        console.log(albumState); // Log the albumState again here
        if (albumState.loading) {
            return <p>Loading albums...</p>;
        } else if (albumState.error) {
            return <p>Error: {albumState.error}</p>;
        } else {
            return (
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Price</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {albumState.albums.map((album: Album) => (
                        <tr key={album._id}>
                            <td>{album.title}</td>
                            <td>{album.artist}</td>
                            <td>{album.price}</td>
                            <td>{album.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            );
        }
    };

    return email ? (
        <>
            <h1>Welcome {email} to the Album App</h1>
            {renderContent()}
        </>
    ) : (
        <h1>Welcome to the Album App</h1>
    );
};

export default HomeScreen;
