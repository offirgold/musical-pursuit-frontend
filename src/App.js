import React, { Component } from "react";
import './App.css';
import axios from "axios";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { data: "" };
    }

    componentDidMount() {
    axios
        .get("http://localhost:8080/musical_pursuit_backend/rest/pursuit")
        .then((response) =>  {
            this.setState({data: JSON.stringify(response.data)});
            console.log(response.data)
        })
        .catch(error => console.log(error));
  }

  render() {
      if(this.state.data === ''){
          return <div>Loading</div>;
      }
      else {
          return <div>{this.state.data}</div>
      }
    }
}

export default App;