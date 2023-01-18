import { createTheme, ThemeProvider } from "@mui/material";
import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "../storage/store";
import Site from "./Site";

/*const darkTheme = createTheme({
    palette: {
        type: "dark",
        primary: {
            main: "#000000",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#7f646e",
        },
        success: {
            main: "#9ec3a0",
        },
    },
});
*/
class Main extends Component {
    render() {
        return (
            <Provider store={store}>
                <Site></Site>
            </Provider>
        );
    }
}

export default Main;

if (document.getElementById("main")) {
    ReactDOM.render(<Main />, document.getElementById("main"));
}
