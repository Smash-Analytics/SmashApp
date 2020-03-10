import React from 'react'
import uuidv4 from 'uuid/v4'
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
            eventId: 78790,
            page: 1,
            perPage: 20
        }
    })

    const [standings, setStandings] = React.useState([])

    React.useEffect(() => {
        if (data && data.event && data.event.standings.nodes) {
            setStandings(data.event.standings.nodes)
            console.log(data.event.standings.nodes)
        }
    },[data])


    return(
        <div>
            {standings.map(standing => {
                return (
                    <div key={uuidv4()}>
                        {standing.placement} - {standing.entrant.name}<br/>
                    </div>
                )
            })}
        </div>
    )
}
