import { SyntheticEvent, useEffect } from "react";
import { Container, Nav, Navbar } from 'react-bootstrap';
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

    useEffect(() => {
        if (userInfo) {
            navigate('/'); // Redirect to the home page
        }
    }, [userInfo, navigate]);

    const navigateToHome = () => {
        navigate('/'); // Navigate to the home page
    };

    return (
        <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
            <Container>
                <Navbar.Brand onClick={navigateToHome}>Albums</Navbar.Brand> {/* Use onClick to navigate to home */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {userInfo ? (
                        <Nav className="ms-auto">
                            <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
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
