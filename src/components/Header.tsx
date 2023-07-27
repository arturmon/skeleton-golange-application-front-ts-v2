import { SyntheticEvent } from "react";
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { logout } from "../actions/userActions";
import { UserState } from '../reducers/userReducers'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { AppThunkDispatch } from "../actions/userActions"; // Import AppThunkDispatch
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Header = () => {
    const dispatch = useDispatch<AppThunkDispatch>(); // Use AppThunkDispatch type
    const navigate = useNavigate(); // Initialize useNavigate

    const userLogin = useSelector<RootState, UserState>(
        (state: RootState) => state.userLogin
    );
    const { userInfo } = userLogin;

    const logoutHandler = async (e: SyntheticEvent) => {
        e.preventDefault();
        await dispatch(logout()); // Await the logout action creator
    };

    const navigateToHome = () => {
        navigate('/'); // Navigate to the home page
    };

    const navigateToCreateAlbum = () => {
        navigate('/albums');
    };

    const navigateToNewPage = () => {
        navigate('/users');
    };


    return (
        <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
            <Container>
                <Navbar.Brand onClick={navigateToHome}>Albums</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {userInfo ? (
                        <Nav className="ms-auto">
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Menu
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={navigateToCreateAlbum}>Albums</Dropdown.Item>
                                    <Dropdown.Item onClick={navigateToNewPage}>Users</Dropdown.Item>
                                    <Dropdown.Item onClick={logoutHandler}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    ) : (
                        <Nav className="ms-auto">
                            <Nav.Link href="/signup">Sign Up</Nav.Link>
                            <Nav.Link href="/login">Login</Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
