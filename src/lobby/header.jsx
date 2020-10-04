import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
    bar: {boxShadow: "none"},
    message: {flex: 1},
    offset: theme.mixins.toolbar
}))

export default function Header({playerName, logout, loading, runningMatch, leave}) {

    const classes = useStyles()

    const showHeaderComponents = loading || !playerName

    const getButton = () => {
        if (loading || !playerName) {
            return null
        } else {
            let text
            let onClick
            if (runningMatch) {
                text = 'Leave'
                onClick = leave
            } else {
                text = 'Logout'
                onClick = logout
            }
            return <Button 
                variant="contained" 
                onClick={onClick}
            >{text}</Button>
        }
    }

    return (
        <>
            <AppBar className={classes.bar} color="primary">
                <Toolbar>
                    <Typography className={classes.message}>
                        {showHeaderComponents ? '' : `Welcome ${playerName}`}
                    </Typography>
                    {getButton()}
                </Toolbar>
            </AppBar>
            <div className={classes.offset}></div>
        </>
    )
}

Header.propTypes = {
    playerName: PropTypes.string,
    logout: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    runningMatch: PropTypes.bool.isRequired,
    leave: PropTypes.func.isRequired
}