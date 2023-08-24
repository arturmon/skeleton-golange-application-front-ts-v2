import { SyntheticEvent, useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { getUserData, AppThunkDispatch, register, deleteUser } from '../actions/userActions';

const UsersScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

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

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        // Call the register action with the form data
        await dispatch(register(email, name, password, role));

        // Clear the form input values
        setName('');
        setEmail('');
        setPassword('');
        setRole('');
    };


    const handleDeleteUser = async () => {
        try {
            // Call the deleteUser action with the entered email
            await dispatch(deleteUser(deleteEmail));

            // Clear the form input values and refresh user data
            setDeleteEmail('');
            dispatch(getUserData());
        } catch (error) {
            // Handle the error (e.g., display an error message)
        }
    };


    return (
        <div>
            {!userData ? (
                <p>Please log in or sign up to view this page.</p>
            ) : (
        <div>
            {/* Display error message if there is an error fetching user data */}
            {error && <p>Error: {error}</p>}

            {/* Display user data if available */}
            {userData && (
                <div>
                    <h1>User current Information</h1>
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    <p>Role: {userData.role}</p>
                </div>
            )}

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
                    <Form.Control
                        type="text"
                        name="role"
                        value={role}
                        onChange={handleInputChange}
                    />
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
            <Form>
                <h2>delete user</h2>
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
        </div>
            )}
        </div>
    );
};

export default UsersScreen;
