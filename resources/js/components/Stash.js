import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Paper,
    Typography,
    Button,
    ListItem,
    ListItemText,
    List,
    Box,
    LinearProgress,
    IconButton,
    Popover,
    Stack,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    FormGroup,
    Tabs,
    Tab,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CharacterViewer from "./CharacterViewer";
import { selectCurrentData, setAll } from "../storage/stashSlice";
import {
    useEquipOneMutation,
    useGetAllMutation,
    useSellOneMutation,
} from "../storage/stashApiSlice";
import { useDispatch, useSelector } from "react-redux";

const Stash = ({ csrf }) => {
    /*const [character, setCharacter] = useState(null);
    const [types, setTypes] = useState(null);
    const [equiped_ids, setEquiped_ids] = useState(null);*/
    const [temp_e_ids, setTemp_e_ids] = useState([null, null, null, null]);
    const [temp, setTemp] = useState(false);
    const [spinner, setSpinner] = useState(false);

    /*Handling the stash api */
    const data = useSelector(selectCurrentData);
    const [getAll] = useGetAllMutation();
    const [sellOne] = useSellOneMutation();
    const [equipOne] = useEquipOneMutation();
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);

    const [filter, setFilter] = useState([false, false, false, false]);
    const [sort, setSort] = useState("gold");

    /*For handling the tabs*/
    const [tab, setTab] = useState(0);

    /*For handling the popover*/
    const openPopover = Boolean(anchorEl);
    const id = openPopover ? "simple-popover" : undefined;

    const changeFilter = (event) => {
        let f = [...filter];
        f[event.currentTarget.id] = !f[event.currentTarget.id];
        setFilter(f);
    };

    const tabFilter = (type, tempStash) => {
        let tabsFilterIds = data.types
            .filter(function (el) {
                return el.placementType == type;
            })
            .map((s) => s.id);

        tempStash = tempStash.filter(function (el) {
            return tabsFilterIds.includes(el.type_id);
        });
        return tempStash;
    };

    //TODO:Kicsit taxing lehet, meg kell nézni nagyobb datasettel
    const filterStash = () => {
        let tempStash = [...data.stash];

        //Tab filtering
        switch (tab) {
            case 0:
                //Itt minden van ezért nem kell filter
                break;
            case 1:
                tempStash = tabFilter("head", tempStash);
                break;
            case 2:
                tempStash = tabFilter("body", tempStash);
                break;
            case 3:
                tempStash = tabFilter("legs", tempStash);
                break;
            case 4:
                tempStash = tabFilter("weapon", tempStash);
                break;
            default:
                break;
        }

        //Rarity filtering
        let rarities = ["normal", "rare", "epic", "legendary"];
        let tempFilter = filter
            .map((v, i) => {
                if (v == true) {
                    return rarities[i];
                }
            })
            .filter(function (e) {
                return e !== undefined;
            });

        if (tempFilter.length != 0) {
            tempStash = tempStash.filter(function (el) {
                return tempFilter.includes(el.rarity);
            });
        }

        //Sorting
        switch (sort) {
            case "str":
                tempStash = tempStash.sort((a, b) => b.bonus_s - a.bonus_s);
                break;
            case "mag":
                tempStash = tempStash.sort((a, b) => b.bonus_m - a.bonus_m);
                break;
            case "dex":
                tempStash = tempStash.sort((a, b) => b.bonus_d - a.bonus_d);
                break;
            case "gold":
                tempStash = tempStash.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        return tempStash;
    };

    const temp_equip = (id, placementType) => {
        let placementId = null;
        switch (placementType) {
            case "head":
                placementId = 0;
                break;
            case "body":
                placementId = 1;
                break;
            case "legs":
                placementId = 2;
                break;
            case "weapon":
                placementId = 3;
                break;

            default:
                break;
        }
        let temp = new Array(4).fill(null);
        temp[placementId] = id.toString();
        setTemp_e_ids(temp);
        console.log(temp);
    };

    /*
    Handling the api
    */

    async function load() {
        setSpinner(true);
        try {
            const result = await getAll();
            //console.log(result.data);
            if (result.data) {
                dispatch(setAll(result.data));
            }
        } catch (err) {
            console.log(err);
        } finally {
            setSpinner(false);
        }
    }

    useEffect(() => {
        load();
    }, [dispatch, getAll]);

    async function equip(id, unequip, placementType) {
        setSpinner(true);
        try {
            let headers = {
                unequip: unequip,
                id: id,
                placementType: placementType,
                "X-CSRF-Token": csrf,
            };
            const result = await equipOne(headers);
            //console.log(result.data);
            if (result.data) {
                dispatch(setAll(result.data));
            }
        } catch (err) {
            console.log(err);
        } finally {
            setSpinner(false);
        }
    }
    async function sell(id, unequip) {
        setSpinner(true);
        try {
            let headers = {
                unequip: unequip,
                id: id,
                "X-CSRF-Token": csrf,
            };
            const result = await sellOne(headers);
            console.log(result.data);
            if (result.data) {
                dispatch(setAll(result.data));
            }
        } catch (err) {
            console.log(err);
        } finally {
            setSpinner(false);
        }
    }

    return (
        <>
            {spinner && <LinearProgress sx={{ width: "100%" }} />}
            <Box sx={{ ml: "32px", bgcolor: "background.paper" }}>
                {data ? (
                    <Box sx={{ mt: "8px" }}>
                        <Tabs
                            value={tab}
                            onChange={(e, value) => {
                                setTab(value);
                            }}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            <Tab label="All" />
                            <Tab label="Head" />
                            <Tab label="Body" />
                            <Tab label="Legs" />
                            <Tab label="Weapons" />
                        </Tabs>
                        <Grid container spacing={1} sx={{ mt: "12px" }}>
                            <Grid item xs={8}>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={5}
                                >
                                    {filterStash().map((i, index) => {
                                        if (i.store_item != "1")
                                            return (
                                                <Card
                                                    key={index}
                                                    sx={{
                                                        maxWidth: 200,
                                                        mx: "auto",
                                                        mt: 2,
                                                        ml: 0.5,
                                                    }}
                                                    elevation={5}
                                                    onMouseEnter={() => {
                                                        temp_equip(
                                                            i.id,
                                                            data.types[
                                                                i.type_id - 1
                                                            ].placementType
                                                        );
                                                        setTemp(true);
                                                    }}
                                                    onMouseLeave={() => {
                                                        setTemp_e_ids([
                                                            null,
                                                            null,
                                                            null,
                                                            null,
                                                        ]);
                                                        setTemp(false);
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        image={
                                                            data.types[
                                                                i.type_id - 1
                                                            ].file_path
                                                        }
                                                        alt={
                                                            data.types[
                                                                i.type_id - 1
                                                            ].name
                                                        }
                                                    />
                                                    <CardContent>
                                                        <Typography
                                                            gutterBottom
                                                            variant="h5"
                                                            component="div"
                                                        >
                                                            {i.name +
                                                                " " +
                                                                data.types[
                                                                    i.type_id -
                                                                        1
                                                                ].name}
                                                        </Typography>
                                                        <Typography
                                                            component={"span"}
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            STATS:
                                                            <List>
                                                                <ListItem>
                                                                    <ListItemText>
                                                                        {"Strength: " +
                                                                            parseInt(
                                                                                i.bonus_s
                                                                            )}
                                                                    </ListItemText>
                                                                </ListItem>
                                                                <ListItem>
                                                                    <ListItemText>
                                                                        {"Dexterity: " +
                                                                            parseInt(
                                                                                i.bonus_d
                                                                            )}
                                                                    </ListItemText>
                                                                </ListItem>
                                                                <ListItem>
                                                                    <ListItemText>
                                                                        {"Magic: " +
                                                                            parseInt(
                                                                                i.bonus_m
                                                                            )}
                                                                    </ListItemText>
                                                                </ListItem>

                                                                <ListItem>
                                                                    <ListItemText>
                                                                        {"Price: " +
                                                                            i.price +
                                                                            "G"}
                                                                    </ListItemText>
                                                                </ListItem>
                                                            </List>
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        <Button
                                                            size="small"
                                                            onClick={() =>
                                                                sell(
                                                                    i.id,
                                                                    data.equiped_ids.indexOf(
                                                                        i.id
                                                                    ) != -1
                                                                )
                                                            }
                                                        >
                                                            Sell
                                                        </Button>
                                                        {data.equiped_ids.indexOf(
                                                            i.id
                                                        ) != -1 ? (
                                                            <Button
                                                                size="small"
                                                                onClick={() =>
                                                                    equip(
                                                                        i.id,
                                                                        data.equiped_ids.indexOf(
                                                                            i.id
                                                                        ) != -1,
                                                                        data
                                                                            .types[
                                                                            i.type_id -
                                                                                1
                                                                        ]
                                                                            .placementType
                                                                    )
                                                                }
                                                            >
                                                                Unequip
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="small"
                                                                onClick={() =>
                                                                    equip(
                                                                        i.id,
                                                                        data.equiped_ids.indexOf(
                                                                            i.id
                                                                        ) != -1,
                                                                        data
                                                                            .types[
                                                                            i.type_id -
                                                                                1
                                                                        ]
                                                                            .placementType
                                                                    )
                                                                }
                                                            >
                                                                Equip
                                                            </Button>
                                                        )}
                                                    </CardActions>
                                                </Card>
                                            );
                                    })}
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <div
                                    style={{ position: "sticky", top: "1rem" }}
                                >
                                    <CharacterViewer
                                        character={data.character}
                                        stash={data.stash}
                                        equiped_ids={data.equiped_ids}
                                        temp_e_ids={temp_e_ids}
                                        temp={temp}
                                        types={data.types}
                                    />
                                    <IconButton
                                        size="large"
                                        sx={{ float: "right" }}
                                        onClick={(event) =>
                                            setAnchorEl(event.currentTarget)
                                        }
                                        aria-describedby={id}
                                    >
                                        <FilterAltIcon />
                                    </IconButton>
                                    <Popover
                                        id={id}
                                        open={openPopover}
                                        anchorEl={anchorEl}
                                        onClose={() => setAnchorEl(null)}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "left",
                                        }}
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                    >
                                        <Paper sx={{ margin: "16px" }}>
                                            <Stack
                                                spacing={2}
                                                sx={{ float: "left" }}
                                            >
                                                <Typography>Sort by</Typography>
                                                <RadioGroup
                                                    value={sort}
                                                    onChange={(event) =>
                                                        setSort(
                                                            event.currentTarget
                                                                .value
                                                        )
                                                    }
                                                >
                                                    <FormControlLabel
                                                        value="str"
                                                        control={<Radio />}
                                                        label="Strength"
                                                    />
                                                    <FormControlLabel
                                                        value="dex"
                                                        control={<Radio />}
                                                        label="Dexterity"
                                                    />
                                                    <FormControlLabel
                                                        value="mag"
                                                        control={<Radio />}
                                                        label="Magic"
                                                    />
                                                    <FormControlLabel
                                                        value="gold"
                                                        control={<Radio />}
                                                        label="Price"
                                                    />
                                                </RadioGroup>

                                                <Typography>Filter</Typography>
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                id="0"
                                                                checked={
                                                                    filter[0]
                                                                }
                                                                onChange={
                                                                    changeFilter
                                                                }
                                                            />
                                                        }
                                                        label="Normal"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                id="1"
                                                                checked={
                                                                    filter[1]
                                                                }
                                                                onChange={
                                                                    changeFilter
                                                                }
                                                            />
                                                        }
                                                        label="Rare"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                id="2"
                                                                checked={
                                                                    filter[2]
                                                                }
                                                                onChange={
                                                                    changeFilter
                                                                }
                                                            />
                                                        }
                                                        label="Epic"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                id="3"
                                                                checked={
                                                                    filter[3]
                                                                }
                                                                onChange={
                                                                    changeFilter
                                                                }
                                                            />
                                                        }
                                                        label="Legendary"
                                                    />
                                                </FormGroup>
                                            </Stack>
                                        </Paper>
                                    </Popover>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    <></>
                )}
            </Box>
        </>
    );
};

export default Stash;
