import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Skeleton,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    useGetCombatDataMutation,
    useGetMonstersMutation,
} from "../storage/combatApiSlice";
import {
    selectCombatData,
    selectMonsters,
    setCombatData,
    setMonsters,
} from "../storage/combatSlice";

const Combat = ({ csrf }) => {
    /*Hp display*/
    const [hpValues, setHpValues] = useState([]); //0. monster 1. player
    const [turn, setTurn] = useState(1);

    /*Button to start combat*/
    async function startBattle(e, index) {
        //Send monster data to /api/combat patch
        //setSpinner(true);
        try {
            let headers = {
                "X-CSRF-Token": csrf,
                monsterData: JSON.stringify(monsterData[index]),
            };
            const result = await getCombatData(headers);
            //console.log(result.data);
            if (result.data) {
                dispatch(setCombatData(result.data));
                console.log(result.data.combat_data);
                setHpValues([
                    result.data.combat_data["monster_data"].hp,
                    result.data.combat_data["player_data"].hp,
                ]);
                startCombat(result.data.combat_data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            //setSpinner(false);
        }
    }
    /*Loading indicator */

    /*Api handling */
    const dispatch = useDispatch();
    const [getMonsters] = useGetMonstersMutation();
    const [getCombatData] = useGetCombatDataMutation();
    const monsterData = useSelector(selectMonsters);
    const combatData = useSelector(selectCombatData);

    async function load() {
        //setSpinner(true);
        try {
            const result = await getMonsters();
            //console.log(result.data);
            if (result.data) {
                dispatch(setMonsters(result.data));
            }
        } catch (err) {
            console.log(err);
        } finally {
            //setSpinner(false);
        }
    }

    const attackEffect = () => {
        return <></>;
    };

    const attack = (attacker, hps, hpsIndex) => {
        hps[hpsIndex] -= attacker.damage;
        console.log(hps);
        setHpValues([...hps]);
    };
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const startCombat = async (data) => {
        let tempHps = [data["monster_data"].hp, data["player_data"].hp];
        let tempTurn = turn;

        //ciklus
        while (tempTurn <= data["turn_count"]) {
            await sleep(2000);
            if (data[tempTurn].turn_order == "monster") {
                attack(
                    data[tempTurn].monster ? data[tempTurn].monster : 0,
                    tempHps,
                    1
                ); //monster->player
                attack(
                    data[tempTurn].player ? data[tempTurn].player : 0,
                    tempHps,
                    0
                ); //player->monster
            } else {
                attack(
                    data[tempTurn].player ? data[tempTurn].player : 0,
                    tempHps,
                    0
                ); //player->monster
                attack(
                    data[tempTurn].monster ? data[tempTurn].monster : 0,
                    tempHps,
                    1
                ); //monster->player
            }
            tempTurn++;
            setTurn(tempTurn);
        }
    };
    const cardDisplay = (cardData, hpIndex) => {
        return (
            <Card sx={{ maxWidth: 345, m: "16px" }} elevation={10}>
                <CardContent>
                    <Typography>
                        {cardData.name} - level: {cardData.level}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={Math.round(
                            (hpValues[hpIndex] / cardData.maxHp) * 100
                        )}
                        color="error"
                    />
                    <List>
                        <ListItem disablePadding>
                            <ListItemText
                                primary={"Strength: " + cardData.strength}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText
                                primary={"Dexterity: " + cardData.dexterity}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText
                                primary={"Magic: " + cardData.magic}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText
                                primary={"Vitality: " + cardData.vitality}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText
                                primary={"Speed: " + cardData.speed}
                            />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
        );
    };

    useEffect(() => {
        load();
    }, [dispatch, getMonsters]);

    return (
        <>
            {combatData ? (
                <Grid container>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={10}
                        sx={{ mt: "36px", mx: "auto" }}
                    >
                        <Grid item xs={3}>
                            {cardDisplay(combatData["monster_data"], 0)}
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>Turn: {turn}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            {cardDisplay(combatData["player_data"], 1)}
                        </Grid>
                    </Grid>

                    <Grid></Grid>
                </Grid>
            ) : monsterData ? (
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    direction="row"
                    sx={{ mt: "36px", mx: "auto" }}
                >
                    {/*<div class="slide-right">
                        <img
                            className="rotate-center"
                            width="200px"
                            heigth="300px"
                            src="https://freepngimg.com/thumb/axe/131290-ax-medieval-photos-free-download-image.png"
                        ></img>
            </div>*/}
                    {monsterData.map((i, index) => (
                        <Card
                            sx={{ maxWidth: 345, m: "16px" }}
                            elevation={10}
                            key={index}
                        >
                            <CardMedia
                                component="img"
                                height="90"
                                image="https://w7.pngwing.com/pngs/626/707/png-transparent-brown-character-eye-of-the-beholder-dungeons-dragons-dungeon-master-role-playing-game-dungeons-and-dragons-monster-game-dragon-roleplaying-thumbnail.png"
                                alt={i.name.replace("_", " ")}
                            />
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                >
                                    Level {i.level} - {i.name.replace("_", " ")}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Enemy lore text jöhetne ide vagy reward list
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: "center" }}>
                                <Button
                                    onClick={(event) => {
                                        startBattle(event, index);
                                    }}
                                    size="Large"
                                >
                                    Fight
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Grid>
            ) : (
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    direction="row"
                    sx={{ mt: "36px", mx: "auto" }}
                >
                    {[0, 0, 0].map((i, index) => {
                        return (
                            <Skeleton
                                key={index}
                                variant="rectangular"
                                width={345}
                                height={200}
                                sx={{ m: "16px" }}
                            />
                        );
                    })}
                </Grid>
            )}
        </>
    );
};

export default Combat;
