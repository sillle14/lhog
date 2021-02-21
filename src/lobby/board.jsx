import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'

export default function Board({runningMatch}) {

    const navigate = useNavigate()

    useEffect(() => {
        if (!runningMatch) {
            navigate('/')
        }
    })

    if (runningMatch) {
        return (
            <runningMatch.app 
                matchID={runningMatch.matchID}
                playerID={runningMatch.playerID}
                credentials={runningMatch.credentials}
            />
        )
    } else {
        return null
    }
}