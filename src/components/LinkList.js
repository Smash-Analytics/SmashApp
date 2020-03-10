import React, { Component, Fragment } from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { LINKS_PER_PAGE } from '../constants'

export const FEED_QUERY = gql`
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
  
  class LinkList extends Component {
    render() {
      const linksToRender = [
      ]
  
      return (
        <Query query={FEED_QUERY}>
          {() => linksToRender.map(link => <Link key={link.id} link={link} />)}
        </Query>
      )
    }
  }
  
  export default LinkList