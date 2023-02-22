import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
    root: {
        '& .bgio-client': {
            height: 'calc(100vh - 64px)' // The header is 64px
        }
    },
})
export default function Board({runningMatch}) {

    const navigate = useNavigate()
    const classes = useStyles()

    useEffect(() => {
        if (!runningMatch) {
            navigate('/')
        }
    })

    if (runningMatch) {
        return (
            <div className={classes.root}>
                <runningMatch.app 
                    matchID={runningMatch.matchID}
                    playerID={runningMatch.playerID}
                    credentials={runningMatch.credentials}
                />
            </div>
        )
    } else {
        return null
    }
}