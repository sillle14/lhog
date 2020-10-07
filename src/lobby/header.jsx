import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar, Tooltip, Typography } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
    bar: {justifyContent: 'flex-end'},
    icon: {marginRight: 'auto', cursor: 'default'},
    message: {marginRight: theme.spacing(2)},
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
            <AppBar color="primary" position="sticky">
                <Toolbar className={classes.bar}>
                    <Tooltip title="Lewis' House of Games">
                        <Typography variant="h3" className={classes.icon}>LHoG</Typography>
                    </Tooltip>               
                    <Typography className={classes.message}>
                        {showHeaderComponents ? '' : `Welcome ${playerName}`}
                    </Typography>
                    {getButton()}
                </Toolbar>
            </AppBar>
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