import gql from 'graphql-tag'


export const EventStandings = gql`
query EventStandings($eventId: ID!, $page: Int!, $perPage: Int!) {
    event(id: $eventId) {
      id
      name
      standings(query: {
        perPage: $perPage,
        page: $page
      }){
        nodes {
          placement
          entrant {
            id
            name
          }
        }
      }
    }
  }
  `

  export const TournamentsByVideogame = gql`
  query TournamentsByVideogame($perPage: Int!, $videogameId: ID!) {
    tournaments(query: {
      perPage: $perPage
      page: 1
      sortBy: "startAt desc"
      filter: {
        past: false
        videogameIds: [
          $videogameId
        ]
      }
    }) {
      nodes {
        id
        name
        slug
        startAt
        events {
          name
          id
          videogame {
            id
          }
        }
      }
    }
  }`  

  export const PastTournamentsByVideogame2020 = gql`
  query PastTournamentsByVideogame2020($perPage: Int!, $videogameId: ID!) {
    tournaments(query: {
      perPage: $perPage
      page: 1
      sortBy: "startAt asc"
      filter: {
        past: true
        afterDate: 1577836800
        videogameIds: [
          $videogameId
        ]
      }
    }) {
      nodes {
        id
        name
        slug
        startAt
        events {
          name
          id
          videogame {
            id
          }
        }
      }
    }
  }
  `