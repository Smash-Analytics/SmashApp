import React from 'react'
import uuidv4 from 'uuid/v4'
import gql from 'graphql-tag'
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import { useQuery } from '@apollo/react-hooks'
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
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

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    }
}))
export default function Example(props) {
    const classes = useStyles()
    const [standings, setStandings] = React.useState([])
    const [eventId, setEventId] = React.useState(0)
    const { loading, error, data } = useQuery(FEED_QUERY, {
        variables: {
            eventId: eventId,
            page: 1,
            perPage: 100
        }
    })
    console.log(error)


    React.useEffect(() => {
        if (data && data.event && data.event.standings.nodes) {
            setStandings(data.event.standings.nodes)
            console.log(data.event.standings.nodes)
        }
    },[data])


    return(
        <Paper className={classes.paper}>
            <Grid container spacing={2}>
                {loading && <h1>LOADING...</h1>}
                {error && <h1>Error! SOMETHING IS WRONG</h1>}
                {standings.map(standing => {
                    return (
                        <React.Fragment key={uuidv4()}>
                            <TextField fullWidth value={eventId} onChange={(e) => setEventId(e.target.value)}/>
                            <Grid item xs={6}>
                                <Typography align={'center'}>{standing.placement}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography align={'left'}>
                                    {standing.entrant.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider/>
                            </Grid>
                        </React.Fragment>
                    )
                })}
            </Grid>
        </Paper>
    )
}
