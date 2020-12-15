import { useNavigate } from 'react-router-dom'
import React from 'react'

export default function Board({runningMatch}) {

    const navigate = useNavigate()

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