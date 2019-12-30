import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import './App.css';
import axios from "axios";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { question: "", answer: "", option_1: "", option_2: "", option_3: "" };
    }

    componentDidMount() {
    axios
        .get("http://localhost:8080/musical_pursuit_backend/rest/pursuit")
        .then((response) =>  {
            this.setState({question: response.data.question,
                                answer: response.data.answer,
                                option_1: response.data.options[0],
                                option_2: response.data.options[1],
                                option_3: response.data.options[2]});
            console.log(response.data)
        })
        .catch(error => console.log(error));
  }

  render() {
      const my_style = {
          fontFamily: "Arial",
          fontSize: "30px",
          position: "relative",
      };
      const style = {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
      }

          return <div>
              <h1 block style={style}>{this.state.question}</h1>
                      <ButtonToolbar block style={style}>
                      <Button variant="primary" style={my_style}>{this.state.answer}</Button>
                      <Button variant="danger" style={my_style}>{this.state.option_1}</Button>
                      <Button variant="info" style={my_style}>{this.state.option_2}</Button>
                      <Button variant="warning" style={my_style}>{this.state.option_3}</Button>
                      </ButtonToolbar>
          </div>
      }
}
export default App;