import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    Box,
    ListItemButton,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    useGetAllMutation,
    useLevelUpStatMutation,
    useRespecAllMutation,
} from "../storage/stashApiSlice";
import { selectCurrentData, setAll } from "../storage/stashSlice";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ImageIcon from "@mui/icons-material/Image";
import EquipmentViewer from "./EquipmentViewer";

const Sheet = ({ csrf }) => {
    /*Api functions */
    const data = useSelector(selectCurrentData);
    const [getAll] = useGetAllMutation();
    const [levelUpStat] = useLevelUpStatMutation();
    const [respecAll] = useRespecAllMutation();
    const dispatch = useDispatch();

    const [attackChange, setAttackChange] = useState();
    const [healthChange, setHealthChange] = useState();

    console.log(data);

    const upgradeButton = (statMod) => {
        if (data.character.talent_points != 0) {
            return (
                <ListItemButton
                    component="button"
                    onClick={() => levelUp(statMod)}
                    onMouseEnter={() => {
                        if (statMod == "vitality") {
                            //healthChange
                            setHealthChange(true);
                        }
                        if (
                            ["strength", "dexterity", "magic"].includes(statMod)
                        ) {
                            if (stashSearch(data.character.weaponId) != -1) {
                                let weapon =
                                    data.stash[
                                        stashSearch(data.character.weaponId)
                                    ];

                                let type =
                                    data.types[
                                        data.types.findIndex((el) => {
                                            return el.id == weapon.type_id;
                                        })
                                    ];
                                if (type.key_ability == statMod) {
                                    setAttackChange(true);
                                }
                            }
                        }
                    }}
                    onMouseLeave={() => {
                        setHealthChange(false);
                        setAttackChange(false);
                    }}
                >
                    <ListItemText primary="+" />
                </ListItemButton>
            );
        } else {
            return <></>;
        }
    };
    async function respec() {
        //setSpinner(true);
        try {
            let headers = {
                "X-CSRF-Token": csrf,
            };
            const result = await respecAll(headers);
            if (result.data) {
                dispatch(setAll(result.data));
            }
        } catch (err) {
            console.log(err);
        } finally {
            //setSpinner(false);
        }
    }
    async function levelUp(stat) {
        //TODO: Inkább storeolja a changeket és egybe küldje ki, mert így hammerelni fogja a szervert valaki, ha 40. szinten respecceli a karakterét
        //setSpinner(true);
        try {
            let headers = {
                stat: stat,
                "X-CSRF-Token": csrf,
            };
            const result = await levelUpStat(headers);
            if (result.data) {
                dispatch(setAll(result.data));

                setHealthChange(false);
                setAttackChange(false);
            }
        } catch (err) {
            console.log(err);
        } finally {
            //setSpinner(false);
        }
    }

    const nextLevel = (level) => {
        let previous_level = 0;
        let next_level = 0;
        let level_gap = 250;
        for (let e = 0; e < level; e++) {
            previous_level = next_level;

            if (e % 10 == 0 && e != 0) {
                level_gap =
                    level_gap +
                    Math.round((300 * 1.5) ^ Math.floor(level / 10));
            }
            next_level = next_level + level_gap;
        }
        return next_level;
    };

    const stashSearch = (searchedId) => {
        return data.stash.findIndex((el) => {
            return el.id == searchedId;
        });
    };

    const defenseCalc = () => {
        let head, body, legs;

        if (stashSearch(data.equiped_ids[0]) != -1)
            head = data.stash[stashSearch(data.equiped_ids[0])];

        if (stashSearch(data.equiped_ids[1]) != -1)
            body = data.stash[stashSearch(data.equiped_ids[1])];

        if (stashSearch(data.equiped_ids[2]) != -1)
            legs = data.stash[stashSearch(data.equiped_ids[2])];

        return (
            (head ? head.armor : 0) +
            (body ? body.armor : 0) +
            (legs ? legs.armor : 0)
        );
    };

    const keyAbility = (weaponId, upgraded) => {
        let weapon = data.stash[stashSearch(weaponId)];

        let type =
            data.types[
                data.types.findIndex((el) => {
                    return el.id == weapon.type_id;
                })
            ];
        switch (type.key_ability) {
            case "strength":
                return upgraded
                    ? data.character.strength + 1
                    : data.character.strength;
            case "dexterity":
                return upgraded
                    ? data.character.dexterity + 1
                    : data.character.dexterity;
            case "magic":
                return upgraded
                    ? data.character.magic + 1
                    : data.character.magic;
            default:
                return 1;
        }
    };

    /*Maybe usefull to check growth */
    const healthCalc = (vitality) => {
        let character = data.character;

        let maxHealth = 200;
        let bonus = 10;
        let vit_bonus = 10;
        let vit_health = 0;
        for (let h = 1; h < character.level; h++) {
            if (h % 10 == 0) {
                bonus = Math.round(bonus * 1.5);
            }
            maxHealth = maxHealth + bonus;
        }
        for (let v = 0; v < vitality; v++) {
            vit_health = vit_health + vit_bonus;
            if (v < 40) {
                vit_bonus = Math.round(vit_bonus * 1.02);
            } else {
                vit_bonus = Math.round(vit_bonus * 0.9);
            }
        }
        return maxHealth + vit_health;
    };

    async function load() {
        //setSpinner(true);
        try {
            const result = await getAll();
            //console.log(result.data);
            if (result.data) {
                dispatch(setAll(result.data));
            }
        } catch (err) {
            console.log(err);
        } finally {
            //setSpinner(false);
        }
    }

    useEffect(() => {
        load();
    }, [dispatch, getAll]);

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="top"
            sx={{ mt: "16px" }}
            spacing={2}
        >
            <Grid item xs={4}>
                {data ? (
                    <List className="sketchy">
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <ImageIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={"Name: " + data.character.name}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={"Level: " + data.character.level}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={
                                    "Exp: " +
                                    data.character.exp +
                                    " / " +
                                    nextLevel(data.character.level)
                                }
                            />
                        </ListItem>
                        <ListItem divider>
                            <ListItemText
                                primary={"Gold: " + data.character.gold}
                            />
                            {data.character.talent_points != 0 ? (
                                <ListItemText
                                    primary={
                                        "Talent Points: " +
                                        data.character.talent_points
                                    }
                                />
                            ) : (
                                <ListItemButton
                                    component="button"
                                    onClick={() => respec()}
                                >
                                    <ListItemText
                                        primary={
                                            "Respec cost:" +
                                            Math.round(
                                                data.character.level *
                                                    100 *
                                                    1.35
                                            )
                                        }
                                    />
                                </ListItemButton>
                            )}
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={"Strength: " + data.character.strength}
                            />
                            {upgradeButton("strength")}
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={
                                    "Dexterity: " + data.character.dexterity
                                }
                            />
                            {upgradeButton("dexterity")}
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={"Magic: " + data.character.magic}
                            />
                            {upgradeButton("magic")}
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={"Vitality: " + data.character.vitality}
                            />
                            {upgradeButton("vitality")}
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={"Speed: " + data.character.speed}
                            />
                            {upgradeButton("speed")}
                        </ListItem>
                    </List>
                ) : (
                    <></>
                )}
            </Grid>
            <Grid item xs={4} className="sketchy">
                {data ? (
                    <EquipmentViewer
                        stashSearch={stashSearch}
                        character={data.character}
                        stash={data.stash}
                        equiped_ids={data.equiped_ids}
                        types={data.types}
                    ></EquipmentViewer>
                ) : (
                    <></>
                )}
            </Grid>
            <Grid item xs={4} className="sketchy">
                {data ? (
                    <>
                        <Accordion defaultExpanded={true}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Derived Stats</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            "Health: " +
                                            healthCalc(
                                                data.character.vitality
                                            ) +
                                            (healthChange
                                                ? " > " +
                                                  healthCalc(
                                                      data.character.vitality +
                                                          1
                                                  )
                                                : "")
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            "Attack Rating: " +
                                            (data.character.weaponId
                                                ? stashSearch(
                                                      data.character.weaponId
                                                  ) != -1
                                                    ? data.stash[
                                                          stashSearch(
                                                              data.character
                                                                  .weaponId
                                                          )
                                                      ].damage
                                                    : "No weapon found!!!"
                                                : "No weapon equiped")
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            "Average Damage: " +
                                            (data.character.weaponId
                                                ? stashSearch(
                                                      data.character.weaponId
                                                  ) != -1
                                                    ? Math.round(
                                                          data.stash[
                                                              stashSearch(
                                                                  data.character
                                                                      .weaponId
                                                              )
                                                          ].damage *
                                                              (1.4 *
                                                                  keyAbility(
                                                                      data
                                                                          .character
                                                                          .weaponId,
                                                                      false
                                                                  ))
                                                      ) +
                                                      (attackChange
                                                          ? " > " +
                                                            Math.round(
                                                                data.stash[
                                                                    stashSearch(
                                                                        data
                                                                            .character
                                                                            .weaponId
                                                                    )
                                                                ].damage *
                                                                    (1.4 *
                                                                        keyAbility(
                                                                            data
                                                                                .character
                                                                                .weaponId,
                                                                            true
                                                                        ))
                                                            )
                                                          : "")
                                                    : "No weapon found!!!"
                                                : "No weapon equiped")
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary={"Defense: " + defenseCalc()}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            "Damage Reduction: " +
                                            Math.round(
                                                (defenseCalc() / 4 / 100) * 100,
                                                2
                                            ) +
                                            "%"
                                        }
                                    />
                                </ListItem>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Accomplishments</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            "Total gold earned: " +
                                            data.character.totalGold
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            "Battles fought: " +
                                            data.character.totalBattles
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            "Battles Won: " +
                                            data.character.totalBattlesWon +
                                            " (" +
                                            Math.round(
                                                (data.character
                                                    .totalBattlesWon /
                                                    data.character
                                                        .totalBattles) *
                                                    100
                                            ) +
                                            "%)"
                                        }
                                    />
                                </ListItem>
                            </AccordionDetails>
                        </Accordion>
                    </>
                ) : (
                    <></>
                )}
            </Grid>
        </Grid>
    );
};

export default Sheet;
