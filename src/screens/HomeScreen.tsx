import { ThunkDispatch } from 'redux-thunk';
import {AnyAction} from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { UserState} from '../reducers/userReducers';
import { fetchAlbums } from '../actions/albumActions';
import React, { useEffect } from 'react';
import { Album } from '../actions/albumActions';


const HomeScreen = () => {
    const dispatch = useDispatch<ThunkDispatch<RootState, null, AnyAction>>();
    const userLogin = useSelector<RootState, UserState>((state) => state.userLogin);
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
                <table className="table">
                    <thead>
                    <tr>
                        <th>Code</th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Price</th>
                        <th>completed</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {albumState.albums.map((album: Album) => (
                        <tr key={album._id}>
                            <td>{album.code}</td>
                            <td>{album.title}</td>
                            <td>{album.artist}</td>
                            <td>{album.price}</td>
                            <td>{album.completed ? 'true' : 'false'}</td>
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
