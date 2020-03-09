import React from 'react'
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {fakeTournies} from '../MOCK_DATA'
import _ from 'lodash'



export default function Tournaments(props) {
    const [data, setData] = React.useState(fakeTournies)

    const sortEntrants = () => {
        let arr = [...data]
        arr = _.sortBy(arr, x => { return x.name})
        setData(arr)
    }

    return(
        <Grid container justify={'center'} item xs={12}>
            <Grid item xs={3}>
                <Typography variant={'h5'}>Tournament Name</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant={'h5'}>Winner</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant={'h5'} onClick={() => sortEntrants()}>Entrants</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant={'h5'}>Date</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider/>
            </Grid>
            {data.map(tourney => {
                return(
                    <>
                        <Grid item xs={3}>
                            {tourney.name}
                        </Grid>
                        <Grid item xs={3}>
                            {tourney.winner}
                        </Grid>
                        <Grid item xs={3}>
                            {tourney.entrants}
                        </Grid>
                        <Grid item xs={3}>
                            {tourney.date}
                        </Grid>
                        <Grid item xs={12}>
                            <Divider/>
                        </Grid>

                    </>
                )
            })}
        </Grid>
    )
}
