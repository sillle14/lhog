import { getPlayerOrder } from "../moves/playerOrder"

export const edges = [
    {source: 'Seattle', target: 'Portland', type: 'edge', handleText: 3},
    {source: 'Seattle', target: 'Boise', type: 'edge', handleText: 12},
    {source: 'Portland', target: 'Boise', type: 'edge', handleText: 13},
    {source: 'Seattle', target: 'Billings', type: 'edge', handleText: 9},
    {source: 'Boise', target: 'Billings', type: 'edge', handleText: 12},
    {source: 'Seattle', target: 'Billings', type: 'edge', handleText: 9},
    {source: 'Boise', target: 'Billings', type: 'edge', handleText: 12},
    {source: 'Billings', target: 'Cheyenne', type: 'edge', handleText: 9},
    {source: 'Boise', target: 'Cheyenne', type: 'edge', handleText: 24},
    {source: 'Cheyenne', target: 'Omaha', type: 'edge', handleText: 14},
    {source: 'Cheyenne', target: 'Denver'},
    {source: 'San Francisco', target: 'Portland', type: 'edge', handleText: 24},
    {source: 'San Francisco', target: 'Boise', type: 'edge', handleText: 23},
    {source: 'San Francisco', target: 'Salt Lake City', type: 'edge', handleText: 27},
    {source: 'San Francisco', target: 'Las Vegas', type: 'edge', handleText: 14},
    {source: 'San Francisco', target: 'Los Angeles', type: 'edge', handleText: 9},
    {source: 'Los Angeles', target: 'Las Vegas', type: 'edge', handleText: 9},
    {source: 'Los Angeles', target: 'San Diego', type: 'edge', handleText: 3},
    {source: 'San Diego', target: 'Las Vegas', type: 'edge', handleText: 9},
    {source: 'San Diego', target: 'Phoenix', type: 'edge', handleText: 14},
    {source: 'Las Vegas', target: 'Salt Lake City', type: 'edge', handleText: 18},
    {source: 'Las Vegas', target: 'Santa Fe', type: 'edge', handleText: 27},
    {source: 'Las Vegas', target: 'Phoenix', type: 'edge', handleText: 15},
    {source: 'Salt Lake City', target: 'Boise', type: 'edge', handleText: 8},
    {source: 'Salt Lake City', target: 'Denver', type: 'edge', handleText: 21},
    {source: 'Salt Lake City', target: 'Santa Fe', type: 'edge', handleText: 28},
    {source: 'Phoenix', target: 'Santa Fe', type: 'edge', handleText: 18},
    {source: 'Santa Fe', target: 'Denver', type: 'edge', handleText: 13},
    {source: 'Santa Fe', target: 'Kansas City', type: 'edge', handleText: 16},
    {source: 'Santa Fe', target: 'Oklahoma City', type: 'edge', handleText: 15},
    {source: 'Santa Fe', target: 'Dallas', type: 'edge', handleText: 16},
    {source: 'Santa Fe', target: 'Houston', type: 'edge', handleText: 21},
    {source: 'Kansas City', target: 'Omaha', type: 'edge', handleText: 5},
    {source: 'Kansas City', target: 'Chicago', type: 'edge', handleText: 8},
    {source: 'Kansas City', target: 'St. Louis', type: 'edge', handleText: 6},
    {source: 'Kansas City', target: 'Memphis', type: 'edge', handleText: 12},
    {source: 'Kansas City', target: 'Oklahoma City', type: 'edge', handleText: 8},
    {source: 'Kansas City', target: 'Denver', type: 'edge', handleText: 16},
    {source: 'Oklahoma City', target: 'Memphis', type: 'edge', handleText: 14},
    {source: 'Oklahoma City', target: 'Dallas', type: 'edge', handleText: 3},
    {source: 'Dallas', target: 'Memphis', type: 'edge', handleText: 12},
    {source: 'Dallas', target: 'New Orleans', type: 'edge', handleText: 12},
    {source: 'Dallas', target: 'Houston', type: 'edge', handleText: 5},
    {source: 'Houston', target: 'New Orleans', type: 'edge', handleText: 8},
    {source: 'Memphis', target: 'St. Louis', type: 'edge', handleText: 7},
    {source: 'Memphis', target: 'Birmingham', type: 'edge', handleText: 6},
    {source: 'Memphis', target: 'New Orleans', type: 'edge', handleText: 7},
    {source: 'New Orleans', target: 'Birmingham', type: 'edge', handleText: 11},
    {source: 'New Orleans', target: 'Jacksonville', type: 'edge', handleText: 16},
    {source: 'Birmingham', target: 'Atlanta', type: 'edge', handleText: 3},
    {source: 'Birmingham', target: 'Jacksonville', type: 'edge', handleText: 9},
    {source: 'Fargo', target: 'Billings', type: 'edge', handleText: 17},
    {source: 'Fargo', target: 'Duluth', type: 'edge', handleText: 6},
    {source: 'Fargo', target: 'Minneapolis', type: 'edge', handleText: 6},
    {source: 'Duluth', target: 'Minneapolis', type: 'edge', handleText: 5},
    {source: 'Duluth', target: 'Detroit', type: 'edge', handleText: 15},
    {source: 'Duluth', target: 'Chicago', type: 'edge', handleText: 12},
    {source: 'Minneapolis', target: 'Chicago', type: 'edge', handleText: 8},
    {source: 'Minneapolis', target: 'Omaha', type: 'edge', handleText: 8},
    {source: 'Minneapolis', target: 'Cheyenne', type: 'edge', handleText: 18},
    {source: 'Minneapolis', target: 'Billings', type: 'edge', handleText: 18},
    {source: 'Chicago', target: 'Omaha', type: 'edge', handleText: 13},
    {source: 'Chicago', target: 'Detroit', type: 'edge', handleText: 7},
    {source: 'Chicago', target: 'Cincinnati', type: 'edge', handleText: 7},
    {source: 'Chicago', target: 'St. Louis', type: 'edge', handleText: 10},
    {source: 'St. Louis', target: 'Cincinnati', type: 'edge', handleText: 12},
    {source: 'St. Louis', target: 'Atlanta', type: 'edge', handleText: 12},
    {source: 'Cincinnati', target: 'Detroit', type: 'edge', handleText: 4},
    {source: 'Cincinnati', target: 'Raleigh', type: 'edge', handleText: 15},
    {source: 'Cincinnati', target: 'Knoxville', type: 'edge', handleText: 6},
    {source: 'Knoxville', target: 'Atlanta', type: 'edge', handleText: 5},
    {source: 'Atlanta', target: 'Raleigh', type: 'edge', handleText: 7},
    {source: 'Atlanta', target: 'Savannah', type: 'edge', handleText: 7},
    {source: 'Savannah', target: 'Raleigh', type: 'edge', handleText: 7},
    {source: 'Savannah', target: 'Jacksonville'},
    {source: 'Jacksonville', target: 'Tampa', type: 'edge', handleText: 4},
    {source: 'Miami', target: 'Tampa', type: 'edge', handleText: 4},
    {source: 'Raleigh', target: 'Norfolk', type: 'edge', handleText: 3},
    {source: 'Raleigh', target: 'Pittsburgh', type: 'edge', handleText: 7},
    {source: 'Detroit', target: 'Buffalo', type: 'edge', handleText: 7},
    {source: 'Detroit', target: 'Pittsburgh', type: 'edge', handleText: 6},
    {source: 'Pittsburgh', target: 'Cincinnati', type: 'edge', handleText: 7},
    {source: 'Pittsburgh', target: 'Washington', type: 'edge', handleText: 6},
    {source: 'Pittsburgh', target: 'Buffalo', type: 'edge', handleText: 7},
    {source: 'Washington', target: 'Norfolk', type: 'edge', handleText: 5},
    {source: 'Washington', target: 'Philadelphia', type: 'edge', handleText: 3},
    {source: 'Philadelphia', target: 'New York'},
    {source: 'New York', target: 'Boston', type: 'edge', handleText: 3},
    {source: 'New York', target: 'Buffalo', type: 'edge', handleText: 8},
]

export function getEdgeLookup(edges) {
    let edgeLookup = {}
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i]
        if (!(edge.source in edgeLookup)) {
            edgeLookup[edge.source] = {}
        } 
        if (!(edge.target in edgeLookup)) {
            edgeLookup[edge.target] = {}
        } 
        edgeLookup[edge.source][edge.target] = edge.handleText || 0
        edgeLookup[edge.target][edge.source] = edge.handleText || 0
    }
    return edgeLookup
}

export const edgeLookup = getEdgeLookup(edges)