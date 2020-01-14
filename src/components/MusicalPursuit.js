import React from "react";

class MusicalPursuit extends React.Component {
    state = {
        data: null,
        currentQuestion: 0,
        myAnswer: null,
        options: [],
        score: 0,
        disabled: true,
        isEnd: false
    };

    loadData = () => {

        this.setState(() => {
            return {
                questions: this.loadFromBackendandStoreInSession()[this.state.currentQuestion].question,
                answer: this.loadFromBackendandStoreInSession()[this.state.currentQuestion].answer,
                options: this.loadFromBackendandStoreInSession()[this.state.currentQuestion].options
            };
        });
    };

    loadFromBackendandStoreInSession = () => {
        if (window.sessionStorage.getItem('Data') == null) {
            console.log("FETCHING FROM BACKEND...");
            this.getDataFromBackend();
        }
        console.log("LOADING FROM SESSION STORAGE...")
        const data = JSON.parse(window.sessionStorage.getItem('Data'));
        return data;

    }
    componentDidMount() {
        this.loadData();
    }

    handleScore = () => {
        const {myAnswer, answer, score} = this.state;

        if (myAnswer === answer) {
            this.setState({
                score: score + 10
            });
        } else {
            if (this.state.score >= 5) {
                this.setState({
                    score: score - 5
                });
            }
        }
    }
    nextQuestionHandler = () => {
        this.handleScore();
        this.setState({
            currentQuestion: this.state.currentQuestion + 1
        });
        console.log(this.state.currentQuestion);
    };


    componentDidUpdate(prevProps, prevState) {
        if (this.state.currentQuestion !== prevState.currentQuestion) {
            this.setState(() => {
                return {
                    disabled: true,
                    questions: this.loadFromBackendandStoreInSession()[this.state.currentQuestion].question,
                    options: this.loadFromBackendandStoreInSession()[this.state.currentQuestion].options,
                    answer: this.loadFromBackendandStoreInSession()[this.state.currentQuestion].answer
                };
            });
        }
    }

    //check answer
    checkAnswer = answer => {
        this.setState({myAnswer: answer, disabled: false});
    };
    finishHandler = () => {
        if (this.state.currentQuestion === this.loadFromBackendandStoreInSession().length - 1) {
            this.setState({
                isEnd: true
            });
            this.handleScore();
        }
    };

    startOver = () => {
        window.location.reload();
    }

    render() {
        const {options, myAnswer, currentQuestion, isEnd} = this.state;

        if (isEnd) {
            return (
                <div className="result">
                    <h1> GAME OVER</h1>
                    <h3>Your FINAL SCORE is {this.state.score} points </h3>
                    <p>
                        The correct answers for the questions were:
                        <ul>
                            {this.loadFromBackendandStoreInSession().map((item, index) => (
                                <li className="ui floating message options" key={index}>
                                    {item.answer}
                                </li>
                            ))}
                        </ul>
                    </p>
                        <button
                            className="ui inverted button"
                            onClick={this.startOver}
                        >
                            Start Over
                        </button>
                </div>
            );
        } else {
            return (
                <div className="App">
                    <h1>{this.state.questions} </h1>
                    <h3>Score: {this.state.score} points </h3>
                    <span>{`Questions ${currentQuestion+1}  out of ${this.loadFromBackendandStoreInSession().length} remaining `}</span>
                    {options.map(option => (
                        <p
                            key={option.id}
                            className={`ui floating message options
         ${myAnswer === option ? "selected" : null}
         `}
                            onClick={() => this.checkAnswer(option)}
                        >
                            {option}
                        </p>
                    ))}
                    {currentQuestion < this.loadFromBackendandStoreInSession().length - 1 && (
                        <button
                            className="ui inverted button"
                            disabled={this.state.disabled}
                            onClick={this.nextQuestionHandler}
                        >
                            Next
                        </button>
                    )}
                    {currentQuestion === this.loadFromBackendandStoreInSession().length - 1 && (
                        <button className="ui inverted button" onClick={this.finishHandler}>
                            Finish
                        </button>
                    )}
                </div>
            );
        }
    }

    getDataFromBackend = () => {
        // fetch("http://localhost:8080/musical_pursuit_backend/rest/pursuit/Play")
        //     .then(
        //         function(response) {
        //             if (response.status !== 200) {
        //                 window.alert('Looks like there was a problem. Status Code: ' + response.status);
        //                 return;
        //             }
        //             response.json().then(function(data) {
        //                 window.sessionStorage.setItem("Data", JSON.stringify(response.data));
        //                 console.log("PRINnsdjknfsjdkfnjskd")
        //             });
        //         }
        //     )
        //     .catch(function(err) {
        //         console.log('Fetch Error :-S', err);
        //     });

        window.sessionStorage.setItem("Data", JSON.stringify([{"id":0,"question":"In 000000, Billy Talent release the song __.","answer":"Red Flag","options":["Alive & Amplified","Permanent","Dance Dance","Red Flag"]},{"id":1,"question":"In 111111, Foster the People release the song __.","answer":"Houdini","options":["Sick Boy","Radioactive","Young Blood","Houdini"]}]))
        const data = window.sessionStorage.getItem("Data")
        if (data == null){
            window.alert("Failed fetching the data");
        }
    }
}
    export default MusicalPursuit;