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
import SearchIcon from '@material-ui/icons/Search'
import Loader from 'react-loader-spinner'
const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        width: '100%'
    }
}))
export function Tournaments(props) {
    const classes = useStyles()
    const [standings, setStandings] = React.useState([])
    const [filtered, setFiltered] = React.useState([])
    const [search, setSearch] = React.useState('')

    const { loading, error, data } = useQuery(TommiesFirstqueeere, {
        variables: {
            eventId: props.eventId ? props.eventId : 78790,
            page: 1,
            perPage: 100
        }
    })


    React.useEffect(() => {
        if (data) {
            console.log(data)
        }
        if (data && data.event &&   data.event.standings && data.event.standings.nodes) {
            setStandings(data.event.standings.nodes)
            console.log(data.event.standings.nodes)
            setFiltered(data.event.standings.nodes)
        }
    },[data])


    //
    React.useEffect(() => {
        let arr = [...standings]
        arr = arr.filter(x => {
            return (x.entrant.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        })
        setFiltered(arr)

    }, [search])



    return(
        <Paper className={classes.paper}>
            <Grid container spacing={2} justify={'center'}>

                {loading && <Loader type={'Circles'} height={100} width={100} color={'black'}/>}
                {error && <h1>Error! SOMETHING IS WRONG</h1>}
                <Grid item xs={12}>
                    <TextField label='Search Player' variant={'outlined'} fullWidth value={search} onChange={(e) => setSearch(e.target.value)}/>
                </Grid>
                {filtered.map(standing => {
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
export default function TourneyWrapper(props) {
    const classes = useStyles()
    const [eventId, setEventId] = React.useState(78790)
    const [submit, setSubmit] = React.useState(false)
    return (
        <Paper className={classes.paper}>
            <Grid container item xs={12} justify={'center'} spacing={2} alignItems={'center'}>

                <Grid item xs={12} md={6}>
                    <TextField fullWidth value={eventId} onChange={(e) => setEventId(e.target.value)} variant={'outlined'} label={'Event ID'}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button onClick={() => setSubmit(!submit)} fullWidth size={'large'}><SearchIcon/></Button>
                </Grid>
                <Grid item xs={12}>
                    {React.useMemo( () => {
                        return (
                            <Tournaments eventId={eventId}/>
                        )
                    }, [submit])}
                </Grid>
            </Grid>
        </Paper>

    )
}
