import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import NavBar from './NavBar';
import Stash from "./Stash";
import Sheet from "./Sheet";

const Site = () => {
    const [csrf, setCsrf] = useState(null);



    const fetchCsrf = async () => {
        await fetch('/api/csrf')
            .then(response => {
                return response.json();
            })
            .then(csrf => {
                setCsrf(csrf.csrf)
                //console.log(csrf.csrf);
            });
    }

    useEffect(() => {
        fetchCsrf();
    }, []);

    return (
        <Router>
            <NavBar csrf={csrf}></NavBar>
            <Routes>
                <Route exact path="/stash" element={<Stash csrf={csrf} />} />
                <Route exact path="/character" element={<Sheet />} />
            </Routes>
        </Router>
    );
}

export default Site;
