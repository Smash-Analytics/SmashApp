import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import HomeIcon from '@material-ui/icons/Home';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import PersonIcon from '@material-ui/icons/Person'
import Divider from "@material-ui/core/Divider";
import Tournaments from "./Tournaments";
import Gamers from "./Gamers";
import MyProfile from "./MyProfile";
import Rankings from "./Rankings";
import Title from "./Title";
import Tooltip from "@material-ui/core/Tooltip";
import uuidv4 from 'uuid/v4'
const list = [
    {name: 'Home', icon: <HomeIcon/>, component: <Title/>},
    {name: 'Gamers', icon: <SportsEsportsIcon/>, component: <Gamers/>},
    {name: 'Tournaments', icon: <PeopleIcon/>, component: <Tournaments/>},
    {name: 'Rankings', icon: <BarChartIcon/>, component: <Rankings/>},
    {name: 'My Profile', icon: <PersonIcon/>, component: <MyProfile/>},
]
export default function Menu(props) {
    return (
        <>
            {list.map(item => {
                return (
                    <>
                        <MenuItem key={uuidv4()} setPage={props.setPage} component={item.component} icon={item.icon} name={item.name}/>
                    </>
                )
            })}
        </>
    );
}


const MenuItem = props => {
    return(
        <>
            <Tooltip placement={'right'} title={props.name}>
                <ListItem button onClick={() => props.setPage(props.component)}>
                    <ListItemIcon>
                        {props.icon}
                    </ListItemIcon>
                    <ListItemText primary={props.name}/>
                </ListItem>
            </Tooltip>
            <Divider/>
            </>
    )
}
