import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
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
