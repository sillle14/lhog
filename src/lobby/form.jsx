import { Box, Button, Container, Link, TextField, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

const useStyles = makeStyles((theme) => ({
    form: {
      marginTop: theme.spacing(10)
    },
    submit: {
        margin: theme.spacing(1.5, 'auto')
    },
    link: {
        cursor: 'pointer'
    },
    hidden: {
        display: 'none'
    }
}))

export default function Form({signup, login}) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Errors
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [mainError, setMainError] = useState('')

    const classes = useStyles()

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
            <Container component="main" maxWidth="xs"><form className={classes.form} noValidate>
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
                    className={signup? '' : classes.hidden}
                />
                <Typography color="secondary" hidden={mainError === ''}>{mainError}</Typography>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    type="submit"
                    onClick={handleSubmit}
                    size="large"
                >
                    {signup ? 'Sign Up' : 'Log In'}
                </Button>
                <Box display="flex" justifyContent="flex-end"><Box display="flex" flexDirection="column" alignItems="flex-end">
                    <Link
                        className={classes.link}
                        variant="body2"
                        onClick={() => { swapMode() }}
                        underline="hover">
                        {signup ? 'Have an account? Sign In' : 'No account? Sign up'}
                    </Link>
                    <Link
                        className={classes.link}
                        variant="body2"
                        onClick={() => { navigate('/about') }}
                        underline="hover">
                        About LHoG
                    </Link>
                </Box></Box>
            </form></Container>
        </Box>
    );
}

Form.propTypes = {
    signup: PropTypes.func,
    login: PropTypes.func
}