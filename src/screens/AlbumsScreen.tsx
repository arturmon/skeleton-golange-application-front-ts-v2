import React, { SyntheticEvent, useState, useEffect } from 'react';
import { Form, Button, Modal, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addAlbum, fetchAlbums,deleteAlbumByCode, deleteAllAlbums } from '../actions/albumActions';
import { Album, Price } from "../actions/albumActionTypes";
import { UserState } from '../reducers/userReducers';
import { AppThunkDispatch } from '../actions/userActions';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AlbumsScreen = () => {
    const dispatch = useDispatch<AppThunkDispatch>();
    const userLogin = useSelector<RootState, UserState | undefined>(
        (state: RootState) => state.userLogin
    );
    const userInfo = userLogin?.userInfo;
    const email = userInfo ? userInfo.email : null;

    const navigate = useNavigate(); // Initialize useNavigate

    const [error, setError] = useState<string | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [priceValue, setPriceValue] = useState('');
    const [currency, setCurrency] = useState('EUR');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'title') {
            setTitle(value);
        } else if (name === 'artist') {
            setArtist(value);
        } else if (name === 'priceNumber') { // Update to match the input name
            setPriceValue(value);
        } else if (name === 'priceCurrency') { // Update to match the input name
            setCurrency(value); // Update the currency state here
        } else if (name === 'code') {
            setCode(value);
        } else if (name === 'description') {
            setDescription(value);
        } // Add this closing curly brace
    };

    const handleCreateAlbum = async (e: SyntheticEvent) => {
        e.preventDefault();

        const newAlbum: Album = {
            title,
            artist,
            price: {
                number: parseFloat(priceValue),
                currency: 'USD', // Or whatever currency you're using
            },
            code,
            description,
        };

        await dispatch(addAlbum(newAlbum));

        setTitle('');
        setArtist('');
        setPriceValue('');
        setCode('');
        setDescription('');

        // Navigate to HomeScreen after creating the album
        navigate('/');
    };

    const handleDeleteFormSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        try {
            await handleDeleteAlbumByCode(code); // Call the delete function here
        } catch (error) {
            // Handle the error (e.g., display an error message)
            console.error('Error deleting album:', error.message);
            setError('Error deleting album: ' + error.message);
            setShowErrorModal(true);
        }
    };

    const handleDeleteAllAlbums = async () => {
        try {
            await dispatch(deleteAllAlbums()); // Call the delete all albums action
            // Fetch albums again after deletion to update the list
            await dispatch(fetchAlbums());
            handleCloseDeleteAllModal(); // Close the delete confirmation modal
            navigate('/'); // Navigate to HomeScreen after deleting all albums
        } catch (error) {
            // Handle the error (e.g., display an error message)
            console.error('Error deleting all albums:', error.message);
            setError('Error deleting all albums: ' + error.message);
            setShowErrorModal(true);
        }
    };

    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

    const handleShowDeleteAllModal = () => {
        setShowDeleteAllModal(true);
    };

    const handleCloseDeleteAllModal = () => {
        setShowDeleteAllModal(false);
    };


    const handleDeleteAlbumByCode = async (code: string) => {
        try {
            await dispatch(deleteAlbumByCode(code)); // Corrected action to dispatch
            // Fetch albums again after deletion to update the list
            await dispatch(fetchAlbums());
            navigate('/');
        } catch (error) {
            // Handle the error (e.g., display an error message)
            console.error('Error deleting album:', error.message);
            setError('Error deleting album: ' + error.message);
            setShowErrorModal(true);
        }
    };

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleShowCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleShowDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    useEffect(() => {
        const fetchAlbumsAction = async () => {
            try {
                await dispatch(fetchAlbums()); // Dispatch the fetchAlbums action to get all albums
            } catch (error) {
                console.error(error);
            }
        };

        if (email) {
            // Use async-await to handle the Promise returned by fetchAlbumsAction
            (async () => {
                try {
                    await fetchAlbumsAction();
                } catch (error) {
                    console.error(error);
                }
            })();
        }
    }, [dispatch, email]);


    return (
        <div>
            {email ? (
                <>
                    <h1>Welcome {email} to Create Albums</h1>
                    <p>basic album commands</p>

                    <div className="container table-container">
                        <Table striped bordered hover className="table  table-sm">
                            <thead>
                            <tr>
                                <th>Operation</th>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>
                                <td>
                                    <div className="col-md-5">
                                        {/* Create Album button */}
                                        <Button variant="success" className="btn-block" onClick={handleShowCreateModal}>
                                            Create New Album
                                        </Button>
                                    </div>
                                </td>
                                <td>Create Album button</td>
                            </tbody>
                            <tbody>
                                <td>
                                    <div className="col-md-5">
                                        {/* Delete Album button */}
                                        <Button variant="danger" className="btn-block" onClick={handleShowDeleteModal}>
                                            Delete Album
                                        </Button>
                                    </div>
                                </td>
                            <td>Delete Album button</td>
                            </tbody>
                            <tbody>
                            <td>
                                <div className="col-md-5">
                                    {/* Delete Album button */}
                                    <Button variant="danger" className="btn-block" onClick={handleShowDeleteAllModal}>
                                        Delete All Albums
                                    </Button>
                                </div>
                            </td>
                            <td>Delete All Albums button</td>
                            </tbody>
                        </Table>
                    </div>

                    {/* Create Album Modal */}
                    <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Album</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleCreateAlbum}>
                                <Form.Group controlId="title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={title}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="artist">
                                    <Form.Label>Artist</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="artist"
                                        value={artist}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="priceCurrency">
                                    <Form.Label>Price and Currency</Form.Label>
                                    <div className="input-group">
                                        <Form.Control
                                            type="number"
                                            className="form-control"
                                            placeholder="Price"
                                            value={priceValue}
                                            onChange={(e) => setPriceValue(e.target.value)}
                                        />
                                        <div className="input-group-append">
                                            <Form.Control
                                                as="select"
                                                className="currency-select"
                                                value={currency}
                                                onChange={(e) => setCurrency(e.target.value)}
                                            >
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                {/* Add more currency options here */}
                                            </Form.Control>
                                        </div>
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="code">
                                    <Form.Label>Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="code"
                                        value={code}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={description}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="success" type="submit">
                                Submit
                            </Button>
                            <Button variant="primary" onClick={handleCloseCreateModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Delete Album Modal */}
                    <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                        {/* ... (your existing code) ... */}
                        <Modal.Body>
                            <Form onSubmit={handleDeleteFormSubmit}>
                                <Form.Group controlId="code">
                                    <Form.Label>Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="code"
                                        value={code}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleDeleteFormSubmit}>
                                Delete
                            </Button>
                            <Button variant="primary" onClick={handleCloseDeleteModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Error</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {error}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseErrorModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showDeleteAllModal} onHide={handleCloseDeleteAllModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Deletion</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete all albums?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleDeleteAllAlbums}>
                                Delete All Albums
                            </Button>
                            <Button variant="primary" onClick={handleCloseDeleteAllModal}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </>
            ) : (
                <h1>Welcome to the Album App</h1>
            )}
        </div>
    );
};

export default AlbumsScreen;
