import { SyntheticEvent, useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { getUserData, AppThunkDispatch, register, deleteUser } from '../actions/userActions';

const UsersScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [createUserResponse, setCreateUserResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);



    const dispatch = useDispatch<AppThunkDispatch>();

    // Selector to get user data from the Redux store
    const userFetchData = useSelector((state: RootState) => state.userFetch);
    const { userData, error } = userFetchData;

    const [deleteEmail, setDeleteEmail] = useState('');

    const handleDeleteEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeleteEmail(e.target.value);
    };


    useEffect(() => {
        // Fetch user data when the component mounts
        dispatch(getUserData());
    }, [dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'name') {
            setName(value);
        } else if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        } else if (name === 'role') {
            setRole(value);
        }
    };

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        setIsLoading(true);

        dispatch(register(email, name, password, role))
            .then(response => {
                //console.log(response.json());
                    return response.json();
                    setShowModal(true);
            })
            .then(data => {
                setCreateUserResponse(data.message);
                setShowModal(true);
            })
            .catch(error => {
                setCreateUserResponse('' + error);
                setShowModal(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };




    const handleCloseModal = () => {
        // Close the modal and reset the response message
        setShowModal(false);
        setCreateUserResponse('');
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };


    const handleDeleteUser = async () => {
        try {
            // Call the deleteUser action with the entered email
            await dispatch(deleteUser(deleteEmail));

            // Clear the form input values and refresh user data
            setDeleteEmail('');
            dispatch(getUserData());
        } catch (error) {
            // Set the error message and open the error modal
            setErrorModalMessage('Error deleting user: ' + error.message); // Renamed
            setShowErrorModal(true);
        }
    };


    return (
        <div>
            {!userData ? (
                <p>Please log in or sign up to view this page.</p>
            ) : (
                <div>
                    {error && <p>Error: {error}</p>}
                    {userData && (
                        <div>
                            <h1>User current Information</h1>
                            <p>Name: {userData.name}</p>
                            <p>Email: {userData.email}</p>
                            <p>Role: {userData.role}</p>
                        </div>
                    )}
                    {userData.role === 'admin' && ( // Check if role is admin
                    <div>
                    <div>
                        <h1>Create New User</h1>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="role">
                                <Form.Label>Role</Form.Label>
                                <Form.Control as="select" name="role" value={role} onChange={handleInputChange}>
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <p></p>
                            <Button variant="primary" type="submit">
                                Create User
                            </Button>
                        </Form>
                        <p></p>
                        {createUserResponse !== null && (
                            <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        {/^Error:/.test(createUserResponse) ? 'Registration Failed' : 'Registration Success'}
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {/^Error:/.test(createUserResponse) ? (
                                        // Display error message
                                        <div>{createUserResponse}</div>
                                    ) : (
                                        // Display success message
                                        <div>
                                            User with email <strong>{email}</strong> has been successfully registered!
                                        </div>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                        )}

                    </div>

                    <div>
                        <h2>Delete User</h2>
                        <Form>
                            <Form.Group controlId="deleteEmail">
                                <Form.Label>Enter Email to Delete User</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="deleteEmail"
                                    value={deleteEmail}
                                    onChange={handleDeleteEmailChange}
                                />
                            </Form.Group>
                            <p></p>
                            <Button variant="danger" onClick={handleDeleteUser}>
                                Delete User
                            </Button>
                        </Form>
                        {errorModalMessage && (
                            <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Error</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {errorModalMessage}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseErrorModal}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        )}
                    </div>
                    </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UsersScreen;
