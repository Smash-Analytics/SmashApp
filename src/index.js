import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker';

//apollo
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

//link apollo client with API
const httpLink = createHttpLink({
  uri: 'https://api.smash.gg/gql/alpha'
})

//set header authorization
const authLink = setContext((_, { headers }) => {
    // token is auth token from smashgg
    const token = "0d07dd1dbafe6a5350dde1f97f20ddca";
    // return the headers to the context so httpLink can read them (no clue what I am doing)
    return {
      headers: {
        ...headers,
        authorization: Bearer [token],
      }
    }
  });
  
  //instantiate apollo client
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

  //renders root components
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('root')
  )
serviceWorker.unregister();