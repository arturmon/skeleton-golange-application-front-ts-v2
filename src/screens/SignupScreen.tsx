import React, {SyntheticEvent, useState} from "react";
import FormContainer from "../components/FormContainer";
import {Button, Form} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';


const SignupScreen = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const submitHandler = async(e: SyntheticEvent) => {
        e.preventDefault()
        //if (!name || !email) return;
        //setName({name: name, email: email})

        // interact with the backend
        await fetch('http://localhost:10000/v1/register',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: name,
                email: email,
                password
            })
        })
        navigate('/login')
    }

    return(
        <FormContainer>
            <h1>Sing Up</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="name" placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="my-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="my-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password"
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

export default SignupScreen