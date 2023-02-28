import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles';
import React, { useEffect } from 'react'

const className = 'lhog-board'

const Root = styled('div')({
    [className]: {
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
            <Root className={className}>
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