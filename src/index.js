import React from "react";
import ReactDOM from "react-dom";
import "./styles/Index.scss";
import App from "./app/main/App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
require("dotenv").config();

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById("root")
);

serviceWorker.unregister();
