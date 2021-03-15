import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(3, 'auto'),
        fontSize: 'smaller',
        opacity: 0.5
    }
}))

export default function Copyright() {

    const classes = useStyles()

    return <Typography align="center" className={classes.root}>{`© ${new Date().getFullYear()} Lewis Silletto`}</Typography>
}
