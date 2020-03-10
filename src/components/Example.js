import React from 'react'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const FEED_QUERY = gql`
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

export default function Example(props) {
    const { loading, error, data } = useQuery(FEED_QUERY, {
        variables: {
            eventId: 10480,
            page: 1,
            perPage: 20
        }
    })

    if (loading) return 'LOADING!!!!!'

    if (error) return 'ERROR!' + error.message

    console.log(data)
    return(
        <div>
        </div>
    )
}
