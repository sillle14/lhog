import { Box, CircularProgress, Container, Tab, Tabs, Typography } from '@material-ui/core'
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles'
import { DataGrid } from '@material-ui/data-grid'
import React, { useContext, useEffect, useState } from 'react'

import AuthContext from './authContext'

const useStyles = makeStyles((theme) => ({
    tabs: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(1)
    },
    self: {
        background: theme.palette.grey[400]
    },
    container: {
        width: '750px'
    }
}))

// Remove the default focus behavior.
const gridTheme = createMuiTheme({
    overrides: {
        MuiDataGrid: {
            root: {
                '& .MuiDataGrid-colCell:focus, & .MuiDataGrid-cell:focus': {
                    outline: 'none'
                }
            },
        },
    },
})

export default function Leaderboard({getLeaderboard}) {

    const [leaderboard, setLeaderboard] = useState(null)
    const [init, setInit] = useState(true)
    const [tab, setTab] = useState('Gembalaya')

    const classes = useStyles()

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const setUp = async () => {
            getLeaderboard().then((l) => {
                const allRows = {}
                for (const game in l) {
                    const gameRows = []
                    let id = 0
                    for (const player in l[game]) {
                        gameRows.push({id: id, username: player, ...l[game][player]})
                        id++
                    }
                    allRows[game] = gameRows
                }
                setLeaderboard(allRows)
                setTab(Object.keys(allRows)[0])
            })
        }
        // Only need to init once.
        if (init) {
            setLeaderboard(null)
            setUp()
            setInit(false)
        }
    }, [init, getLeaderboard])

    const switchTab = (e, newValue) => {
        setTab(newValue);
    }

    let columns = [
        { field: 'username', headerName: 'Username', flex: 1 },
        { field: 'wins', headerName: 'Wins', type: 'number', valueFormatter: ({value}) =>  value || '0' },
        { field: 'matches', headerName: 'Matches', type: 'number', width: 150 },
        { 
            field: 'ratio', 
            headerName: 'Win Rate', 
            type: 'number', 
            valueFormatter: ({value}) => (value * 100).toFixed(1) + '%',
            width: 150
        },
        { 
            field: 'wscore', 
            headerName: 'Rating*',
            type: 'number', 
            valueFormatter: ({value}) => (value * 100).toFixed(2),
            width: 150,
            description: 'Based on the Wilson Score confidence interval.'
        },
    ]

    // Shade cells for the current user. 
    columns = columns.map((c) => ({
        ...c, cellClassName: (params) => user && params.row.username === user.username ? classes.self : ''
    }))

    const sortModel = [{ field: 'wscore', sort: 'desc'}]
    
    if (leaderboard) {
        let tabs = []
        for (const game in leaderboard) {
            tabs.push(<Tab label={game} key={game} value={game}/>)
        }
        return (
            <Container maxWidth={false} className={classes.container}>
                <Tabs value={tab} onChange={switchTab} key="tabs" centered className={classes.tabs}>
                    {tabs}
                </Tabs>
                <Box display="flex" flexDirection="column" justifyContent="space-between" height="75vh">
                    {/* NOTE: autoHeight prevents row virtualization, so may need to be changed if the dataset grows too large.
                        See https://material-ui.com/components/data-grid/rendering/#auto-height */}
                    <ThemeProvider theme={gridTheme}><DataGrid 
                        rows={leaderboard[tab]} 
                        columns={columns} 
                        pageSize={5} 
                        autoHeight 
                        disableSelectionOnClick
                        sortModel={sortModel}
                    /></ThemeProvider>
                </Box>
            </Container>
        )
    } else {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress/>
                <Box mt={2}><Typography>loading...</Typography></Box>
            </Box>
        )
    }
}
    