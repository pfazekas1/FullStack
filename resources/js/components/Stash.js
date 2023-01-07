import { Card, CardActions, CardContent, CardMedia, Grid, Paper, Typography, Button, ListItem, ListItemText, List, Box, ListSubheader, ListItemIcon, CircularProgress, LinearProgress, IconButton, Popover, Stack, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup } from "@mui/material";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CharacterViewer from "./CharacterViewer";
import { selectCurrentData, setAll } from "../storage/stashSlice";
import { useGetAllMutation } from "../storage/stashApiSlice";
import { useDispatch, useSelector } from "react-redux";

//TODO:Típusonként legyen felostva az inventory és lehessen valami módon sortolni ezeket
//TODO:Store-old külön az adatokat és akkor nem kell talán mindig betölteni és akkor egy provider mindent át tudna mindenkinek adni és akkor max csak combatnál kellene változtatni

const Stash = ({ csrf }) => {

    /*//const [stash, setStash] = useState(null);
    const [character, setCharacter] = useState(null);
    const [types, setTypes] = useState(null);
    const [equiped_ids, setEquiped_ids] = useState(null);*/
    const [temp_e_ids, setTemp_e_ids] = useState([null, null, null, null]);
    const [temp, setTemp] = useState(false);
    const [spinner, setSpinner] = useState(false);

    /*Handling the stash api */
    const data = useSelector(selectCurrentData);
    const [getAll] = useGetAllMutation();
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);

    const [filter, setFilter] = useState([false, false, false, false]);
    const [sort, setSort] = useState('gold');


    /*For handling the popover*/
    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'simple-popover' : undefined;

    const sell = (id, unequip) => {
        let formData = new FormData();
        formData.append('_token', csrf);
        formData.append('_method', "DELETE");
        formData.append('unequip', unequip);
        formData.append('id', id);

        fetch('/api/stash', {
            method: 'POST',
            body: formData
        });

        getStash();
    }

    const changeFilter = (event) => {
        let f = [...filter];
        f[event.currentTarget.id] = !f[event.currentTarget.id];
        setFilter(f)
    }

    const equip = (id, unequip, placementType) => {
        let formData = new FormData();
        formData.append('_token', csrf);
        formData.append('_method', "PATCH");
        formData.append('placementType', placementType);
        formData.append('unequip', unequip);
        formData.append('id', id);

        fetch('/api/stash', {
            method: 'POST',
            body: formData
        });

        getStash();
    }

    const temp_equip = (id, placementType) => {
        let placementId = null;
        switch (placementType) {
            case 'head':
                placementId = 0;
                break;
            case 'body':
                placementId = 1;
                break;
            case 'legs':
                placementId = 2;
                break;
            case 'weapon':
                placementId = 3;
                break;

            default:
                break;
        }
        let temp = new Array(4).fill(null);
        temp[placementId] = id.toString();
        setTemp_e_ids(temp);
        console.log(temp)
    }


    /*
    Handling the api
    */


    const getStash = () => {
        setSpinner(true);
        fetch('/api/stash')
            .then(response => {
                return response.json();
            })
            .then(stash => {
                setSpinner(false);
                setStash(stash.data.stash);
                setTypes(stash.data.types);
                setCharacter(stash.data.character);
                setEquiped_ids(stash.data.equiped_ids);
                console.log(stash.data);
            });
    };
    useEffect(() => {
        async function load() {
            try {
                const result = await getAll();
                //console.log(result.data);
                if (result.data) {
                    dispatch(setAll(result.data));
                }
            } catch (err) {
                console.log(err);
            }
            finally {
            }
        }

        setSpinner(true);
        load()
        setSpinner(false);
    }, [dispatch, getAll]);

    /*useEffect(() => {
        getStash();
    }, []);*/

    return (<>
        {spinner && <LinearProgress sx={{ width: "100%" }} />}
        <Box sx={{ ml: '32px' }}>
            {data ?
                <Grid container spacing={1} sx={{ mt: '12px' }}>
                    <Grid container xs={8} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        {data.stash.map((i) => {
                            if (i.store_item != '1')
                                return (
                                    <Card sx={{ maxWidth: 200, mx: "auto", mt: 2, ml: 0.5, boxShadow: 3 }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image="IMAGE"
                                            alt={data.types[i.type_id - 1].name}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {i.name + " " + data.types[i.type_id - 1].name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                STATS:
                                                <List>
                                                    <ListItem>
                                                        <ListItemText>
                                                            {"Strength: " + parseInt(i.bonus_s)}
                                                        </ListItemText>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText>
                                                            {"Dexterity: " + parseInt(i.bonus_d)}
                                                        </ListItemText>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText>
                                                            {"Magic: " + parseInt(i.bonus_m)}
                                                        </ListItemText>
                                                    </ListItem>

                                                    <ListItem>
                                                        <ListItemText>
                                                            {"Price: " + i.price + 'G'}
                                                        </ListItemText>
                                                    </ListItem>
                                                </List>
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" onClick={() => sell(i.id, data.equiped_ids.indexOf(i.id.toString()) != -1)}>Sell</Button>
                                            {
                                                data.equiped_ids.indexOf(i.id.toString()) != -1 ?
                                                    <Button size="small" onClick={() => equip(i.id, data.equiped_ids.indexOf(i.id.toString()) != -1, data.types[i.type_id - 1].placementType)}>Unequip</Button>
                                                    :
                                                    <Button size="small" onClick={() => equip(i.id, data.equiped_ids.indexOf(i.id.toString()) != -1, data.types[i.type_id - 1].placementType)} onMouseEnter={() => { temp_equip(i.id, data.types[i.type_id - 1].placementType); setTemp(true) }} onMouseLeave={() => { setTemp_e_ids([null, null, null, null]); setTemp(false) }}>Equip</Button>
                                            }
                                        </CardActions>
                                    </Card>
                                );
                        })
                        }
                    </Grid >
                    <Grid item xs={4}>
                        <div style={{ position: 'sticky', top: '1rem' }}>
                            <CharacterViewer character={data.character} stash={data.stash} equiped_ids={data.equiped_ids} temp_e_ids={temp_e_ids} temp={temp} />
                            <IconButton size='large' sx={{ float: 'right' }} onClick={(event) => setAnchorEl(event.currentTarget)} aria-describedby={id}><FilterAltIcon /></IconButton>
                            <Popover
                                id={id}
                                open={openPopover}
                                anchorEl={anchorEl}
                                onClose={() => setAnchorEl(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <Paper sx={{ margin: '16px' }}>
                                    <Stack spacing={2} sx={{ float: 'left' }}>
                                        <Typography>Sort by</Typography>
                                        <RadioGroup
                                            value={sort}
                                            onChange={(event) => setSort(event.currentTarget.value)}
                                        >
                                            <FormControlLabel value="str" control={<Radio />} label="Strength" />
                                            <FormControlLabel value="dex" control={<Radio />} label="Dexterity" />
                                            <FormControlLabel value="mag" control={<Radio />} label="Magic" />
                                            <FormControlLabel value="gold" control={<Radio />} label="Price" />
                                        </RadioGroup>

                                        <Typography>Filter</Typography>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox id='0' checked={filter[0]}
                                                onChange={changeFilter} />} label="Normal" />
                                            <FormControlLabel control={<Checkbox id='1' checked={filter[1]}
                                                onChange={changeFilter} />} label="Rare" />
                                            <FormControlLabel control={<Checkbox id='2' checked={filter[2]}
                                                onChange={changeFilter} />} label="Epic" />
                                            <FormControlLabel control={<Checkbox id='3' checked={filter[3]}
                                                onChange={changeFilter} />} label="Legendary" />
                                        </FormGroup>
                                    </Stack>
                                </Paper>
                            </Popover>
                        </div>
                    </Grid>
                </Grid>
                : <></>}
        </Box >
    </>
    );
}

export default Stash;
