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
import {PastTournamentsByVideogame2020} from "./Queries";
import SearchIcon from '@material-ui/icons/Search'
import Loader from 'react-loader-spinner'
import {FirebaseDB} from "../firebase/firebase";

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        width: '100%'
    }
}))
export function Tournaments(props) {
    const classes = useStyles()
    const [tournaments, setTournaments] = React.useState([])
    const [filtered, setFiltered] = React.useState([])
    const [search, setSearch] = React.useState('')

    const { loading, error, data } = useQuery(PastTournamentsByVideogame2020, {
        variables: {
            videogameId: 1,
            perPage: 100,
            date: 1577836800
        }
    })


    React.useEffect(() => {
        if (data) {
            console.log(data)
        }
        if (data  && data.tournaments && data.tournaments.nodes) {
            setTournaments(data.tournaments.nodes)
            setFiltered(data.tournaments.nodes)
        }
    },[data])

    React.useEffect(() => {
        tournaments.forEach(tournament => {
            FirebaseDB.collection('tournaments').add(tournament)
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })
        })
    }, [tournaments])


    //
/*    React.useEffect(() => {
        let arr = [...tournaments]
        arr = arr.filter(x => {
            return (x.entrant.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        })
        setFiltered(arr)

    }, [search])*/



    return(
        <Paper className={classes.paper}>
            <Grid container spacing={2} justify={'center'}>

                {loading && <Loader type={'Circles'} height={100} width={100} color={'black'}/>}
                {error && <h1>Error! SOMETHING IS WRONG</h1>}
                <Grid item xs={12}>
                    <TextField label='Search Tournaments' variant={'outlined'} fullWidth value={search} onChange={(e) => setSearch(e.target.value)}/>
                </Grid>
                {filtered.map(tournament => {
                    return (
                        <React.Fragment key={uuidv4()}>
                            <Grid item xs={12}>
                                <Typography align={'left'}>
                                    {tournament.name}
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

                <Grid item xs={12} md={10}>
                    <TextField fullWidth value={eventId} onChange={(e) => setEventId(e.target.value)} variant={'outlined'} label={'Event ID'}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Button onClick={() => setSubmit(!submit)} fullWidth size={'large'}><SearchIcon/></Button>
                </Grid>
                <Grid item xs={12}>
                    {React.useMemo( () => {
                        return (
                            <Tournaments/>
                        )
                    }, [submit])}
                </Grid>
            </Grid>
        </Paper>

    )
}
