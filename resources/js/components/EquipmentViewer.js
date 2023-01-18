import {
    Avatar,
    Card,
    CardContent,
    CardMedia,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.css";
import { styled } from "@mui/material/styles";
import * as React from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const EquipmentViewer = ({
    types,
    character,
    stash,
    equiped_ids,
    stashSearch,
}) => {
    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "#f5f5f9",
            color: "rgba(0, 0, 0, 0.87)",
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
            border: "1px solid #dadde9",
        },
    }));

    const item = (i, index) => {
        return (
            <HtmlTooltip
                key={index}
                placement="right"
                title={
                    <React.Fragment>
                        <Card
                            sx={{
                                maxWidth: 200,
                                mx: "auto",
                                mt: 2,
                                ml: 0.5,
                            }}
                            elevation={5}
                        >
                            <CardMedia
                                component="img"
                                height="140"
                                image={types[i.type_id - 1].file_path}
                                alt={types[i.type_id - 1].name}
                            />
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                >
                                    {i.name + " " + types[i.type_id - 1].name}
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
                                                    parseInt(i.bonus_s)}
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText>
                                                {"Dexterity: " +
                                                    parseInt(i.bonus_d)}
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText>
                                                {"Magic: " +
                                                    parseInt(i.bonus_m)}
                                            </ListItemText>
                                        </ListItem>

                                        <ListItem>
                                            <ListItemText>
                                                {"Price: " + i.price + "G"}
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                </Typography>
                            </CardContent>
                        </Card>
                    </React.Fragment>
                }
                followCursor
            >
                <Paper>
                    <Avatar
                        variant="square"
                        sx={{ margin: "16px" }}
                        src={types[i.type_id - 1].file_path}
                    />
                </Paper>
            </HtmlTooltip>
        );
    };

    return (
        <Grid>
            {equiped_ids.map((el, index) => {
                if (stashSearch(el) != -1) {
                    return item(stash[stashSearch(el)], index);
                } else {
                    return (
                        <Card key={index}>
                            <CardContent>No Item Here</CardContent>
                        </Card>
                    );
                }
            })}
        </Grid>
    );
};

export default EquipmentViewer;
