import "bootstrap/dist/css/bootstrap.css";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { AppBar, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { useState } from "react";

const NavBar = ({ csrf }) => {
    const navigate = useNavigate();

    function navigateTo(path) {
        navigate(path);
    }

    const logout = async () => {


        let formData = new FormData();
        formData.append('_token', csrf);

        fetch('/logout', {
            method: 'POST',
            body: formData
        });
        //navigateTo('/');
    }

    return (
        <AppBar position='static'>
            <Toolbar>
                <IconButton size='large' edge='start' color='inherit' aria-label='loog' onClick={() => navigateTo('/')}>
                    <AllInclusiveIcon />
                </IconButton>
                <Typography variant="h6" component='div' sx={{ flexGrow: 1 }}>
                    Alma
                </Typography>

                <Stack direction='row' spacing={2}>
                    <Button color='inherit' onClick={() => navigateTo('/stash')}>Stash</Button>
                    <Button color='inherit'onClick={() => navigateTo('/store')}>Store</Button>
                    <Button color='inherit'onClick={() => navigateTo('/combat')}>Combat</Button>
                    <Button color='inherit'onClick={() => navigateTo('/sheet')}>Character</Button>
                    <Button color='inherit' onClick={logout} >Logout</Button>
                </Stack>
            </Toolbar >
        </AppBar >
    );
}

export default NavBar;
