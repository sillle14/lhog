import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';

const Root = styled('div')({
    '& .bgio-client': {
        height: 'calc(100vh - 64px)' // The header is 64px
    }
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
            <Root>
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