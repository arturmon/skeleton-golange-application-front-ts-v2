import { SyntheticEvent, useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addAlbum, Album, fetchAlbums,deleteAlbumByCode } from '../actions/albumActions';
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

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [price, setPrice] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'title') {
            setTitle(value);
        } else if (name === 'artist') {
            setArtist(value);
        } else if (name === 'price') {
            setPrice(value);
        } else if (name === 'code') {
            setCode(value);
        } else if (name === 'description') {
            setDescription(value);
        } else if (name === 'completed') {
            setCompleted(e.target.checked);
        }
    };

    const handleCreateAlbum = async (e: SyntheticEvent) => {
        e.preventDefault();

        const newAlbum: Album = {
            title,
            artist,
            price: parseFloat(price),
            code,
            description,
            completed,
        };

        await dispatch(addAlbum(newAlbum));

        setTitle('');
        setArtist('');
        setPrice('');
        setCode('');
        setDescription('');
        setCompleted(false);

        // Navigate to HomeScreen after creating the album
        navigate('/');
    };

    const handleDeleteFormSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        handleDeleteAlbumByCode(code); // Call the delete function here
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
                    {/* Create Album button */}
                    <Button onClick={handleShowCreateModal}>Create Album</Button>
                    {/* Delete Album button */}
                    <Button variant="danger" onClick={handleShowDeleteModal}>Delete Album</Button>


                    {/* Create Album Modal */}
                    <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Album</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* ... other JSX ... */}
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
                                <Form.Group controlId="price">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="price"
                                        value={price}
                                        onChange={handleInputChange}
                                    />
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
                                <Form.Group controlId="completed">
                                    <Form.Check
                                        type="checkbox"
                                        label="Completed"
                                        name="completed"
                                        checked={completed}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseCreateModal}>
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
                            <Button variant="secondary" onClick={handleCloseDeleteModal}>
                                Close
                            </Button>
                            <Button variant="danger" onClick={handleDeleteFormSubmit}>
                                Delete
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
                </>
            ) : (
                <h1>Welcome to the Album App</h1>
            )}
        </div>
    );
};

export default AlbumsScreen;
