import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles';
import React, { useEffect } from 'react'

// TODO: Refine the styles here.
const PREFIX = 'board';

const classes = {
    root: `${PREFIX}-root`
};

const Root = styled('div')({
    [`&.${classes.root}`]: {
        '& .bgio-client': {
            height: 'calc(100vh - 64px)' // The header is 64px
        }
    },
});

export default function Board({runningMatch}) {

    const navigate = useNavigate()


    useEffect(() => {
        if (!runningMatch) {
            navigate('/')
        }
    })

    if (runningMatch) {
        return (
            <Root className={classes.root}>
                <runningMatch.app 
                    matchID={runningMatch.matchID}
                    playerID={runningMatch.playerID}
                    credentials={runningMatch.credentials}
                />
            </Root>
        );
    } else {
        return null
    }
}