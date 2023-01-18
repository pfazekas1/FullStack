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
    Modal,
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

    const [displayAnimations, setDisplayAnimations] = useState([]);
    const [damageNumbers, setDamageNumbers] = useState([]);
    const [damageNumbersAnimation, setDamageNumbersAnimation] = useState([]);

    const [openResults, setOpenResults] = useState(false);
    const [combatIsRunning, setCombatIsRunning] = useState(false);

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
                    setDisplayAnimations(["", ""]),
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
                setDamageNumbers(["0", "0"]);
                setDamageNumbersAnimation(["hidden", "hidden"]);
            }
        } catch (err) {
            console.log(err);
        } finally {
            //setSpinner(false);
        }
    }

    const attack = (attacker, hps, hpsIndex) => {
        hps[hpsIndex] -= attacker.damage;
        console.log(hps);
        setHpValues([...hps]);
    };
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const startCombat = async (data) => {
        setCombatIsRunning(true);
        setOpenResults(false);

        let temp = ["", ""];
        let tempDamage = [...damageNumbers];
        let tempAnimations = ["hidden", "hidden"];
        let shakenAnimationTimer = 800;
        let missAnimationTimer = 800;

        let tempHps = [data["monster_data"].hp, data["player_data"].hp];
        let tempTurn = turn;

        //ciklus
        while (tempTurn <= data["turn_count"]) {
            await sleep(2000);
            if (data[tempTurn].turn_order == "monster") {
                if (data[tempTurn].monster) {
                    attack(data[tempTurn].monster, tempHps, 1); //monster->player
                    if (!data[tempTurn].monster.miss) {
                        temp = ["", "taking_damage"];
                        if (!data[tempTurn].monster.crit) {
                            tempDamage[1] = String(
                                data[tempTurn].monster.damage
                            );
                        } else {
                            tempDamage[1] =
                                String(data[tempTurn].monster.damage) + "!";
                        }

                        tempAnimations[1] = "damage_numbers";
                        missAnimationTimer;

                        setDamageNumbers(tempDamage);
                        setDamageNumbersAnimation(tempAnimations);
                        setDisplayAnimations(temp);

                        await sleep(shakenAnimationTimer);

                        temp = ["", ""];
                        tempAnimations[1] = "hidden";

                        setDisplayAnimations(temp);
                        setDamageNumbersAnimation(tempAnimations);
                    } else {
                        //missed monster
                        console.log("missed");
                        tempDamage[1] = "Miss!";
                        tempAnimations[1] = "damage_numbers";

                        setDamageNumbers(tempDamage);
                        setDamageNumbersAnimation(tempAnimations);
                        await sleep(missAnimationTimer);

                        tempAnimations[1] = "hidden";
                        setDamageNumbersAnimation(tempAnimations);
                    }
                }
                if (data[tempTurn].player) {
                    attack(data[tempTurn].player, tempHps, 0); //player->monster
                    if (!data[tempTurn].player.miss) {
                        temp = ["taking_damage", ""];

                        if (!data[tempTurn].player.crit) {
                            tempDamage[0] = String(
                                data[tempTurn].player.damage
                            );
                        } else {
                            tempDamage[0] =
                                String(data[tempTurn].player.damage) + "!";
                        }

                        tempAnimations[0] = "damage_numbers";

                        setDamageNumbers(tempDamage);
                        setDamageNumbersAnimation(tempAnimations);
                        setDisplayAnimations(temp);

                        await sleep(shakenAnimationTimer);

                        temp = ["", ""];
                        tempAnimations[0] = "hidden";

                        setDisplayAnimations(temp);
                        setDamageNumbersAnimation(tempAnimations);
                    } else {
                        //missed player
                        console.log("missed");
                        tempDamage[0] = "Miss!";
                        tempAnimations[0] = "damage_numbers";

                        setDamageNumbers(tempDamage);
                        setDamageNumbersAnimation(tempAnimations);

                        await sleep(missAnimationTimer);
                        tempAnimations[0] = "hidden";
                        setDamageNumbersAnimation(tempAnimations);
                    }
                }
            } else {
                if (data[tempTurn].player) {
                    attack(data[tempTurn].player, tempHps, 0); //player->monster
                    if (!data[tempTurn].player.miss) {
                        temp = ["taking_damage", ""];
                        if (!data[tempTurn].player.crit) {
                            tempDamage[0] = String(
                                data[tempTurn].player.damage
                            );
                        } else {
                            tempDamage[0] =
                                String(data[tempTurn].player.damage) + "!";
                        }
                        tempAnimations[0] = "damage_numbers";

                        setDamageNumbers(tempDamage);
                        setDamageNumbersAnimation(tempAnimations);
                        setDisplayAnimations(temp);

                        await sleep(shakenAnimationTimer);

                        temp = ["", ""];
                        tempAnimations[0] = "hidden";

                        setDisplayAnimations(temp);
                        setDamageNumbersAnimation(tempAnimations);
                    } else {
                        //missed player
                        console.log("missed");
                        tempDamage[0] = "Miss!";
                        tempAnimations[0] = "damage_numbers";

                        setDamageNumbers(tempDamage);
                        setDamageNumbersAnimation(tempAnimations);

                        await sleep(missAnimationTimer);
                        tempAnimations[0] = "hidden";
                        setDamageNumbersAnimation(tempAnimations);
                    }
                }
                if (data[tempTurn].monster) {
                    attack(data[tempTurn].monster, tempHps, 1); //monster->player
                    if (!data[tempTurn].monster.miss) {
                        temp = ["", "taking_damage"];
                        if (!data[tempTurn].monster.crit) {
                            tempDamage[1] = String(
                                data[tempTurn].monster.damage
                            );
                        } else {
                            tempDamage[1] =
                                String(data[tempTurn].monster.damage) + "!";
                        }
                        tempAnimations[1] = "damage_numbers";

                        setDamageNumbers(tempDamage);
                        setDamageNumbersAnimation(tempAnimations);
                        setDisplayAnimations(temp);

                        await sleep(shakenAnimationTimer);

                        temp = ["", ""];
                        tempAnimations[1] = "hidden";

                        setDisplayAnimations(temp);
                        setDamageNumbersAnimation(tempAnimations);
                    } else {
                        //missed monster
                        console.log("missed");
                        tempDamage[1] = "Miss!";
                        tempAnimations[1] = "damage_numbers";

                        setDamageNumbers(tempDamage);
                        setDamageNumbersAnimation(tempAnimations);

                        await sleep(missAnimationTimer);
                        tempAnimations[1] = "hidden";
                        setDamageNumbersAnimation(tempAnimations);
                    }
                }
            }

            tempTurn++;
            setTurn(tempTurn);
        }
        if (data.won == "monster") {
            temp = ["", "death"];
            setDisplayAnimations(temp);
        } else {
            temp = ["death", ""];
            setDisplayAnimations(temp);
        }

        setOpenResults(true);
        setTurn(1);
    };
    const cardDisplay = (cardData, hpIndex) => {
        return (
            <>
                <Card
                    sx={{ maxWidth: 300, mx: "auto", mt: 2 }}
                    elevation={10}
                    className={displayAnimations[hpIndex]}
                >
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
                <div
                    style={{
                        position: "relative",
                    }}
                >
                    <p className={damageNumbersAnimation[hpIndex]}>
                        {damageNumbers[hpIndex]}
                    </p>
                </div>
            </>
        );
    };

    useEffect(() => {
        load();
    }, [dispatch, getMonsters]);

    return (
        <>
            {combatData && combatIsRunning ? (
                <>
                    <Modal
                        open={openResults}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 400,
                                bgcolor: "white",
                                border: "2px solid #000",
                                boxShadow: 24,
                                p: 4,
                            }}
                        >
                            <Grid
                                container
                                direction="column"
                                justifyContent="space-evenly"
                                alignItems="center"
                            >
                                <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    component="h2"
                                >
                                    {combatData.won == "player"
                                        ? "WON"
                                        : "LOST"}
                                </Typography>
                                {combatData.won == "player" ? (
                                    <Typography
                                        id="modal-modal-description"
                                        sx={{ mt: 2 }}
                                    >
                                        Gold: {combatData.gold}
                                        Exp: {combatData.exp}
                                    </Typography>
                                ) : (
                                    <></>
                                )}

                                <Button
                                    onClick={() => {
                                        setCombatIsRunning(false);
                                        setOpenResults(false);
                                    }}
                                >
                                    Close
                                </Button>
                            </Grid>
                        </Box>
                    </Modal>
                    <Grid container>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mt: "36px", ml: "16px", mr: "16px" }}
                        >
                            <Grid item>
                                {cardDisplay(combatData["monster_data"], 0)}
                            </Grid>
                            <Grid item xs={2}>
                                <Typography sx={{ alignItems: "center" }}>
                                    Turn: {turn}
                                </Typography>
                            </Grid>
                            <Grid item>
                                {cardDisplay(combatData["player_data"], 1)}
                            </Grid>
                        </Grid>

                        <Grid></Grid>
                    </Grid>
                </>
            ) : monsterData ? (
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    direction="row"
                    sx={{ mt: "36px" }}
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
                                height="120"
                                image={i.file_path}
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
