import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core'


const useStyles = makeStyles({
    message: {flex: 1}
})

export default function Header(props) {

    const classes = useStyles()

    return (
        <AppBar color="primary">
            <Toolbar>
                <Typography className={classes.message}>{`Welcome ${props.playerName}`}</Typography>
                <Button variant="contained" onClick={props.logout}>Logout</Button>
            </Toolbar>
        </AppBar>
    )
}