import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { auto } from "@popperjs/core";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";


const CharacterViewer = ({ character, stash, equiped_ids, temp_e_ids, temp }) => {
    const [currentStats, setCurrentStats] = useState([
        parseInt(character.strength) + getStats('str'),
        parseInt(character.dexterity) + getStats('dex'),
        parseInt(character.magic) + getStats('mag')]);

    const arrowRender = (upOrDown) => {
        if (upOrDown)
            return (<>
                <div style={{ float: 'left' }}>
                    <div className='g-triangle slide-top' />
                    <div className='g-triangle slide-top' style={{ marginTop: "1px", marginBottom: "1px" }} />
                    <div className='g-triangle slide-top' />
                </div>

            </>)
        else
            return (<>
                <div style={{ float: 'left' }}>
                    <div className='r-triangle slide-bot' />
                    <div className='r-triangle slide-bot' style={{ marginTop: "1px", marginBottom: "1px" }} />
                    <div className='r-triangle slide-bot' />
                </div>

            </>)
    }

    const compareStats = (stat_type, temp) => {
        let newStats;
        if (temp)
            switch (stat_type) {
                case 'str':
                    newStats = parseInt(character.strength) + getStats(stat_type);
                    if (newStats == currentStats[1])
                        return { color: "grey" }
                    if (newStats > currentStats[0])
                        return { color: "green" }
                    else
                        return { color: "red" }
                case 'dex':
                    newStats = parseInt(character.dexterity) + getStats(stat_type);
                    if (newStats == currentStats[1])
                        return { color: "grey" }
                    if (newStats > currentStats[1])
                        return { color: "green" }
                    else
                        return { color: "red" }
                case 'mag':
                    newStats = parseInt(character.magic) + getStats(stat_type);
                    if (newStats == currentStats[2])
                        return { color: "grey" }
                    if (newStats > currentStats[2])
                        return { color: "green" }
                    else
                        return { color: "red" }
                default:
                    return { color: "black" }
            }
        return { color: "black" }
    }

    function getStats(stat_type) {
        let ids = temp_e_ids;
        ids.forEach((e, i) => {
            if (e === null) {
                ids[i] = equiped_ids[i]
            }
        });

        let value = 0
        switch (stat_type) {
            case 'str':
                for (const e of ids) {
                    if (e !== null) {
                        value += parseInt(stash[e - 1].bonus_s)
                    }
                };
                break;
            case 'dex':
                for (const e of ids) {
                    if (e !== null) {
                        value += parseInt(stash[e - 1].bonus_d)
                    }
                };
                break;
            case 'mag':
                for (const e of ids) {
                    if (e !== null) {
                        value += parseInt(stash[e - 1].bonus_m)
                    }
                };
                break;

            default:
                return 0;
                break;
        }
        return value;
    };

    return (
        <Paper>
            <img width={200} src="https://previews.123rf.com/images/byronwmoore/byronwmoore0712/byronwmoore071200012/2272083-3d-render-of-a-stick-man.jpg" />
            <List>
                <ListItem>
                    <Typography style={compareStats('str', temp)} >{"Strength:" + (parseInt(character.strength) + getStats('str'))}</Typography>
                    {JSON.stringify(compareStats('str', temp)) == JSON.stringify({ color: 'green' }) ?
                        arrowRender(true) :
                        (JSON.stringify(compareStats('str', temp)) == JSON.stringify({ color: 'red' }) ?
                            arrowRender(false) :
                            <></>)}
                </ListItem>
                <ListItem>
                    <Typography style={compareStats('dex', temp)} >{"Dexterity:" + (parseInt(character.dexterity) + getStats('dex'))}</Typography>
                    {JSON.stringify(compareStats('dex', temp)) == JSON.stringify({ color: 'green' }) ?
                        arrowRender(true) :
                        (JSON.stringify(compareStats('dex', temp)) == JSON.stringify({ color: 'red' }) ?
                            arrowRender(false) :
                            <></>)}
                </ListItem>
                <ListItem>
                    <Typography style={compareStats('mag', temp)} >{"Magic:" + (parseInt(character.magic) + getStats('mag'))}</Typography>
                    {JSON.stringify(compareStats('mag', temp)) == JSON.stringify({ color: 'green' }) ?
                        arrowRender(true) :
                        (JSON.stringify(compareStats('mag', temp)) == JSON.stringify({ color: 'red' }) ?
                            arrowRender(false) :
                            <></>)}

                </ListItem>
                <ListItem>
                    <ListItemText //primaryTypographyProps={checkIfBetter(temp)} >
                    >
                        {"Gold: " + character.gold}
                    </ListItemText>
                </ListItem>
            </List >
        </Paper >
    );
}

export default CharacterViewer;