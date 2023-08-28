import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../store";
import { fetchAlbums, updateAlbums } from "../actions/albumActions";
import { Album, Price } from "../actions/albumActionTypes";
import { UserState } from "../reducers/userReducers";

const HomeScreen = () => {
    const dispatch = useDispatch<ThunkDispatch<RootState, null, AnyAction>>();
    const userLogin = useSelector<RootState, UserState>((state) => state.userLogin);
    const albumState = useSelector((state: RootState) => state.albumState);

    const { userInfo } = userLogin;
    const email = userInfo ? userInfo.email : null;

    const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [sortCriteria, setSortCriteria] = useState<string>('code'); // Set default sort by code
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Default: ascending

    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [currentPage, setCurrentPage] = useState(1); // Initialize to 1


    useEffect(() => {
        if (email) {
            dispatch(fetchAlbums());
        }
    }, [dispatch, email]);

    const openModal = (album: Album) => {
        setEditingAlbum({ ...album });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAlbum(null);
        setErrorMessage(null);
    };

    const validateAlbum = (albumData: Album | null): boolean => {
        console.log(albumData);
        if (!albumData) {
            return false; // Return false for null albums
        }
        if (!albumData.title || !albumData.artist || !albumData.code) {
            // Check for required fields: title, artist, and code
            return false;
        }
        if (typeof albumData.price.number !== 'number' || albumData.price.number <= 0) {
            // Check if price is a valid positive number
            return false;
        }
        // Other validation checks for your album data
        // ...
        return true; // All validation checks passed
    };

    const updateAlbum = async (updatedAlbum: Album | null) => {
        try {
            if (validateAlbum(updatedAlbum)) {
                await dispatch(updateAlbums(updatedAlbum));
                closeModal();

                // Fetch albums again after updating to refresh the list
                await dispatch(fetchAlbums());
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateAlbumField = (field: string, value: number | string | boolean) => {
        if (editingAlbum) {
            setEditingAlbum((prevEditingAlbum) => {
                if (prevEditingAlbum) {
                    if (field === 'price') {
                        return {
                            ...prevEditingAlbum,
                            price: {
                                number: typeof value === 'number' ? value : prevEditingAlbum.price.number,
                                currency: prevEditingAlbum.price.currency,
                            },
                        };
                    }
                    if (field === 'currency') {
                        return {
                            ...prevEditingAlbum,
                            price: {
                                number: prevEditingAlbum.price.number,
                                currency: value as string,
                            },
                        };
                    }
                    return {
                        ...prevEditingAlbum,
                        [field]: value,
                    };
                }
                return prevEditingAlbum;
            });
        }
    };




    const handleSort = (criteria: string) => {
        if (sortCriteria === criteria) {
            // Toggle sort order if same criteria clicked again
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new criteria and default ascending order
            setSortCriteria(criteria);
            setSortOrder('asc');
        }
    };


    // Filtered and sorted albums
    const sortedAlbums = [...albumState.albums].sort((a, b) => {
        if (sortCriteria === 'title') {
            return a.title.localeCompare(b.title) * (sortOrder === 'asc' ? 1 : -1);
        }
        if (sortCriteria === 'artist') {
            return a.artist.localeCompare(b.artist) * (sortOrder === 'asc' ? 1 : -1);
        }
        if (sortCriteria === 'price') {
            return (a.price.number - b.price.number) * (sortOrder === 'asc' ? 1 : -1);
        }
        // Add more criteria for other columns if needed
        return 0;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, sortedAlbums.length);
    const displayedAlbums = sortedAlbums.slice(startIndex, endIndex);

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(event.target.value, 10);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset current page to 1 when items per page changes
    };

    return (
        <div>
            {email ? (
                <>
                    <h1 className="text-center">Welcome {email} to the Album App</h1>
                    {/* Dropdown to select items per page */}
                    <div className="container table-container">
                        <div className="row">
                            <div className="col-md-12">
                                {albumState.loading ? (
                                    <p>Loading albums...</p>
                                ) : albumState.error ? (
                                    <p>Error: {albumState.error}</p>
                                ) : albumState.albums.length === 0 ? (
                                    <p>No albums available.</p>
                                ) : (
                                    <Table striped bordered hover className="table  table-sm">
                                        <thead>
                                        <tr>
                                            <th onClick={() => handleSort('code')}>
                                                Code
                                                {sortCriteria === 'code' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                            </th>
                                            <th onClick={() => handleSort('title')}>
                                                Title
                                                {sortCriteria === 'title' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                            </th>
                                            <th onClick={() => handleSort('artist')}>
                                                Artist
                                                {sortCriteria === 'artist' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                            </th>
                                            <th onClick={() => handleSort('price')}>
                                                Price
                                                {sortCriteria === 'price' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                            </th>
                                            <th>Description</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {displayedAlbums.map((album: Album) => (
                                            <tr key={album._id}>
                                                <td>{album.code}</td>
                                                <td>{album.title}</td>
                                                <td>{album.artist}</td>
                                                <td>{`${album.price.number} ${album.price.currency}`}</td>
                                                <td>{album.description}</td>
                                                <td>
                                                    <Button variant="info" onClick={() => openModal(album)}>
                                                        Edit
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                )}
                            </div>
                            <div className="row">
                                <div className="col-md-6"> {/* Adjust the column width here */}
                                    <div className="form-group">
                                        <select className="form-control" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                            <option value={10}>10 per page</option>
                                            <option value={20}>20 per page</option>
                                            <option value={50}>50 per page</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6"> {/* Adjust the column width here */}
                                    <div className="d-flex justify-content-end">
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <button
                                                className="btn btn-primary"
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                            >
                                                Previous Page
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                disabled={startIndex + itemsPerPage >= sortedAlbums.length}
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                            >
                                                Next Page
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal show={showModal} onHide={closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Album</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {errorMessage && <p className="text-danger">{errorMessage}</p>}
                            <Form>
                                <Form.Group controlId="title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editingAlbum?.title || ""}
                                        onChange={(e) => updateAlbumField("title", e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="artist">
                                    <Form.Label>Artist</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editingAlbum?.artist || ""}
                                        onChange={(e) => updateAlbumField("artist", e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="price">
                                    <Form.Label>Price</Form.Label>
                                    <div className="input-group">
                                        <Form.Control
                                            type="number"
                                            className="form-control"
                                            value={editingAlbum?.price.number.toString() || ""}
                                            onChange={(e) => updateAlbumField("price", parseFloat(e.target.value))}
                                        />
                                        <div className="input-group-append">
                                            <span className="input-group-text">{editingAlbum?.price.currency}</span>
                                        </div>
                                    </div>
                                </Form.Group>
                                <Form.Group controlId="currency">
                                    <Form.Label>Currency</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={editingAlbum?.price.currency || ""}
                                        onChange={(e) => updateAlbumField("currency", e.target.value)}
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                        {/* Add other currency options as needed */}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="code">
                                    <Form.Label>Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editingAlbum?.code || ""}
                                        onChange={(e) => updateAlbumField("code", e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={editingAlbum?.description || ""}
                                        onChange={(e) => updateAlbumField("description", e.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="button" onClick={(e) => {
                                e.preventDefault(); // Prevent the default form submission
                                updateAlbum(editingAlbum);
                            }}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : (
                <h1 className="text-center">Welcome to the Album App</h1>
            )}
        </div>
    );
};

export default HomeScreen;
