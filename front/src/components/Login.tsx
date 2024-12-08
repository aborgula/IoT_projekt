import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Alert, Box } from '@mui/material';
import { isExpired } from 'react-jwt';

interface Account {
    username: string;
    password: string;
}

interface Errors {
    username?: string;
    password?: string;
}

const LogInForm: React.FC = () => {
    const [account, setAccount] = useState<Account>({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState<Errors>({});
    const [loginError, setLoginError] = useState<string>('');

    const navigate = useNavigate();

    const validate = (): Errors | null => {
        const validationErrors: Errors = {};

        if (account.username.trim() === '') {
            validationErrors.username = 'Username is required!';
        }
        if (account.password.trim() === '') {
            validationErrors.password = 'Password is required!';
        }

        return Object.keys(validationErrors).length === 0 ? null : validationErrors;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors || {});
        if (validationErrors) return;

        axios
            .post('http://localhost:3100/api/user/auth', {
                name: account.username,
                password: account.password
            })
            .then((response) => {
                
                const { token } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('login',account.username);
                navigate('/');
                window.location.reload();
            })
            .catch((error) => {
                setLoginError('Invalid username or password!');
                console.log(error);
            });


    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAccount((prevAccount) => ({
            ...prevAccount,
            [name]: value
        }));
    };

    return (
        <Container maxWidth="sm" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Log In
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box mb={2}>
                    <TextField
                        label="Username"
                        value={account.username}
                        name="username"
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Password"
                        value={account.password}
                        name="password"
                        onChange={handleChange}
                        type="password"
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Log In
                </Button>
                {loginError && (
                    <Box mt={2}>
                        <Alert severity="error">{loginError}</Alert>
                    </Box>
                )}
            </form>
        </Container>
    );
};

export default LogInForm;
