import React from 'react'
import uuidv4 from 'uuid/v4'
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import { useQuery } from '@apollo/react-hooks'
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {TommiesFirstqueeere} from "./Queries";

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    }
}))
export function Example(props) {
    const classes = useStyles()
    const [standings, setStandings] = React.useState([])
    const [search, setSearch] = React.useState('')
    const { loading, error, data } = useQuery(TommiesFirstqueeere, {
        variables: {
            eventId: props.eventId ? props.eventId : 78790,
            page: 1,
            perPage: 100
        }
    })


    React.useEffect(() => {
        if (data && data.event && data.event.standings.nodes) {
            setStandings(data.event.standings.nodes)
            console.log(data.event.standings.nodes)
        }
    },[data])


    //
    React.useEffect(() => {
        let arr = [...standings]
        arr = arr.filter(x => {
            console.log(x.entrant.name)
            return (x.entrant.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        })
        setStandings(arr)

    }, [search])



    return(
        <Paper className={classes.paper}>
            <Grid container spacing={2}>
                <TextField variant={'outlined'} fullWidth value={search} onChange={(e) => setSearch(e.target.value)}/>
                {loading && <h1>LOADING...</h1>}
                {error && <h1>Error! SOMETHING IS WRONG</h1>}
                {standings.map(standing => {
                    return (
                        <React.Fragment key={uuidv4()}>
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
export default function ExampleWrapper(props) {
    const [eventId, setEventId] = React.useState(78790)
    const [submit, setSubmit] = React.useState(false)
    return (
        <>
        <TextField value={eventId} onChange={(e) => setEventId(e.target.value)} variant={'outlined'} label={'Event ID'}/>
            {React.useMemo( () => {
                return (
                    <div></div>
                )
            }, [submit])}
            <Button onClick={() => setSubmit(!submit)} fullWidth>CliCK ME</Button>
            <Example eventId={eventId}/>
        </>
    )
}
