import { SyntheticEvent, useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useNavigate } from 'react-router-dom';
import { login, AppThunkDispatch } from "../actions/userActions"; // Import AppThunkDispatch
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "../store";
import { UserState } from '../reducers/userReducers'

const LoginScreen = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch<AppThunkDispatch>(); // Specify AppThunkDispatch type

    const userLogin = useSelector<RootState, UserState>(
        (state: RootState) => state.userLogin
    )
    const { userInfo } = userLogin

    useEffect(() => {
        if (userInfo?.email) {
            navigate('/')
        }
    }, [userInfo, navigate])

    const submitHandler = async (e: SyntheticEvent) => {
        e.preventDefault()

        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            <h1>Login</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="my-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </FormContainer>
    )
}

export default LoginScreen;
