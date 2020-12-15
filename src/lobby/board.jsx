import { navigate } from '@reach/router'
import React from 'react'

export default function Board({runningMatch}) {
    if (runningMatch) {
        return (
            <runningMatch.app 
                matchID={runningMatch.matchID}
                playerID={runningMatch.playerID}
                credentials={runningMatch.credentials}
            />
        )
    } else {
        navigate('/')
        return null
    }
}