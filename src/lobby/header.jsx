import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core'


const useStyles = makeStyles({
    message: {flex: 1},
    hidden: {display: 'none'}
})

export default function Header({playerName, logout, loading}) {

    const classes = useStyles()

    const showHeaderComponents = loading || !playerName

    return (
        <AppBar color="primary">
            <Toolbar>
                <Typography className={classes.message}>
                    {showHeaderComponents ? '' : `Welcome ${playerName}`}
                </Typography>
                <Button 
                    className={showHeaderComponents ? classes.hidden : ''} 
                    variant="contained" 
                    onClick={logout}
                >Logout</Button>
            </Toolbar>
        </AppBar>
    )
}

Header.propTypes = {
    playerName: PropTypes.string,
    logout: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}