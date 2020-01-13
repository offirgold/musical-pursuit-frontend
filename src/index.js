import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import MusicalPursuit from "./components/MusicalPursuit";

function App() {
    return (
        <div className="App">
            <MusicalPursuit />
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
