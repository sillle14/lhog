import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Box, Button, Toolbar, Tooltip, Typography } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
    bar: {justifyContent: 'space-between'},
    icon: {cursor: 'default', marginLeft: theme.spacing(1)},
    message: {marginRight: theme.spacing(2), alignSelf: 'center'},
    offset: theme.mixins.toolbar,
    defs: {
        display: 'block',
        position: 'absolute',
        height: 0,
        width:0,
        margin: 0,
        padding: 0,
        border: 'none',
        overflow: 'hidden'
    },
}))

export default function Header({playerName, logout, loading, runningMatch, leave}) {

    const classes = useStyles()

    const hog = <svg xmlns="http://www.w3.org/2000/svg" className={classes.defs}>
        <symbol id="hog">
            <path d="M 20 38 q -12 -8, -10 -20 q 15 -5, 25 10" fill="#f06292"/>
            <path d="M 25 41 q -12 -8, -12 -20 q 13 -5, 23 10" fill="#ec407a"/>
            <path d="M 80 38 q 12 -8, 10 -20 q -15 -5, -25 10" fill="#f06292"/>
            <path d="M 75 41 q 12 -8, 12 -20 q -13 -5, -23 10" fill="#ec407a"/>
            <ellipse cx="50" cy="50" rx="40" ry="35" fill="#f06292" strokeWidth="0"/>
            <ellipse cx="50" cy="60" rx="15" ry="10" fill="transparent" stroke="black"></ellipse>
            <ellipse cx="44" cy="60" rx="3" ry="5"/>
            <ellipse cx="56" cy="60" rx="3" ry="5"/>
            <circle cx="38" cy="40" r="3"/>
            <circle cx="62" cy="40" r="3"/>
        </symbol> 
    </svg>

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
            {hog}
            <AppBar color="primary" position="sticky">
                <Toolbar className={classes.bar}>
                    <Box display="flex">
                        <svg viewBox="0 0 100 100" height="56px"><use xlinkHref="#hog"/></svg> 
                        <Tooltip title="Lewis' House of Games">
                            <Typography variant="h3" className={classes.icon}>LHoG</Typography>
                        </Tooltip>               
                    </Box>
                    <Typography variant="h4">{runningMatch}</Typography>
                    <Box display="flex">
                        <Typography className={classes.message}>
                            {showHeaderComponents ? '' : `Welcome ${playerName}`}
                        </Typography>
                        {getButton()}
                    </Box>
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