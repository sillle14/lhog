import { Box, Button, Container, Link, TextField, Typography } from '@mui/material'

import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useState } from 'react';

const StyledForm = styled('form')(({ theme }) => ({ marginTop: theme.spacing(10) }));
const StyledLink = styled(Link)({ cursor: 'pointer' });

export default function Form({signup, login}) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Errors
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [mainError, setMainError] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async event => {
        event.preventDefault()
        if (!username.trim()) {
            setUsernameError('Required.')
        }
        if (!password) {
            setPasswordError('Required.')
        }
        if (password && username.trim()) {
            if (signup) {
                if (password !== confirmPassword) {
                    setConfirmPasswordError("Passwords don't match.")
                } else {
                    const signupSuccess = await signup(username.trim(), password)
                    if (signupSuccess) {
                        navigate('/')
                    } else {
                        setMainError('Username taken.')
                    } 
                }
            } else {
                const loggedIn = await login(username.trim(), password)
                if (!loggedIn) {
                    setMainError('Incorrect username or password.')
                }
            }
        }
    }

    const swapMode = () => {
        if (signup) {
            navigate('/')
        } else {
            navigate('/signup')
        }
    }
    
    return (
        <Box height="calc(100vh - 64px)" display="flex" flexDirection="column" justifyContent="space-between">
            <Container component="main" maxWidth="xs"><StyledForm noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    error={usernameError !== ''}
                    helperText={usernameError}
                    required
                    fullWidth
                    label="Username"
                    value={username}
                    onFocus={() => { setUsernameError(''); setMainError('') }}
                    autoFocus
                    onChange={(e) => { setUsername(e.target.value) }}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    error={passwordError !== ''}
                    helperText={passwordError}
                    required
                    fullWidth
                    label="Password"
                    value={password}
                    type="password"
                    onFocus={() => { setPasswordError(''); setMainError('') }}
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    error={confirmPasswordError !== ''}
                    helperText={confirmPasswordError}
                    required
                    fullWidth
                    label="Confirm Password"
                    value={confirmPassword}
                    type="password"
                    onFocus={() => { setConfirmPasswordError(''); setMainError('') }}
                    onChange={(e) => { setConfirmPassword(e.target.value) }}
                    sx={signup ? {} : { display: 'none' }}
                />
                <Typography color="secondary" hidden={mainError === ''}>{mainError}</Typography>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ my: 1.5 }}
                    type="submit"
                    onClick={handleSubmit}
                    size="large"
                >
                    {signup ? 'Sign Up' : 'Log In'}
                </Button>
                <Box display="flex" justifyContent="flex-end"><Box display="flex" flexDirection="column" alignItems="flex-end">
                    <StyledLink
                        variant="body2"
                        onClick={() => { swapMode() }}
                        underline="hover">
                        {signup ? 'Have an account? Sign In' : 'No account? Sign up'}
                    </StyledLink>
                    <StyledLink
                        variant="body2"
                        onClick={() => { navigate('/about') }}
                        underline="hover">
                        About LHoG
                    </StyledLink>
                </Box></Box>
            </StyledForm></Container>
        </Box>
    );
}

Form.propTypes = {
    signup: PropTypes.func,
    login: PropTypes.func
}