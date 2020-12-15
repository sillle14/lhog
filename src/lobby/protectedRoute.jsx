import React, { useContext } from 'react'

import AuthContext from './authContext'
import Form from './form'

export default function PrivateRoute(props) {
    const { user, loading, login } = useContext(AuthContext);
    if (loading) {
        return null
    } else {
        let { as: Comp, ...compProps } = props
        return user ? <Comp {...compProps} /> : <Form login={login}/>
    }
}