import * as React from "react";
import * as ReactDOM from "react-dom";
import Button from "@mui/material/Button";

function MyApp() {
    return <h1>Hello World</h1>;
}

if (document.getElementById("app")) {
    ReactDOM.render(<MyApp />,document.getElementById('app2'));
}
