import React from "react";

class MusicalPursuit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            currentQuestion: 0,
            myAnswer: null,
            options: [],
            score: 0,
            disabled: true,
            isEnd: false,
            isLoaded: false,
        };
    }

    componentDidMount() {
        const self = this;
        this.fetchData(self);
    }

    fetchData = (self) => {
        fetch("http://localhost:8080/musical_pursuit_backend/rest/pursuit/Play")
            .then(
                function (response) {
                    if (response.status !== 200) {
                        window.alert('Looks like there was a problem. Status Code: ' + response.status);
                        return;
                    }
                    response.json().then(function (data) {
                        self.setState({data: data});
                    });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
    };

    loadData = () => {
        if (this.state.isLoaded === false) {
            this.setState(() => {
                return {
                    question: this.state.data[this.state.currentQuestion].question,
                    answer: this.state.data[this.state.currentQuestion].answer,
                    options: this.state.data[this.state.currentQuestion].options,
                    isLoaded: true,
                };
            });
        }
    };

    handleScore = () => {
        const {myAnswer, answer, score} = this.state;

        if (myAnswer === answer) {
            window.alert("Nice! The answer was correct");
            this.setState({
                score: score + 10
            });
        } else {
            window.alert("The answer was wrong");
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
                    question: this.state.data[this.state.currentQuestion].question,
                    options: this.state.data[this.state.currentQuestion].options,
                    answer: this.state.data[this.state.currentQuestion].answer
                };
            });
        }
    }

    checkAnswer = answer => {
        this.setState({myAnswer: answer, disabled: false});
    };

    finishHandler = () => {
        if (this.state.currentQuestion === this.state.data.length - 1) {
            this.setState({
                isEnd: true
            });
            this.handleScore();
        }
    };

    startOver = () => {
        window.location.reload();
    }

    renderFinishPage = () => {
        return (
            <div className="result">
                <h1> GAME OVER</h1>
                <h3>Your FINAL SCORE is {this.state.score} points </h3>
                <p>
                    The correct answers for the questions were:
                    <ul>
                        {this.state.data.map((item, index) => (
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
    }

    renderLevels = (options, myAnswer, currentQuestion, isEnd) => {
        this.loadData();
        if (isEnd) {
            return this.renderFinishPage();
        } else {
            return (
                <div className="App">
                    <h1>{this.state.question} </h1>
                    <h3>Score: {this.state.score} points </h3>
                    <span>{`Questions ${currentQuestion + 1}  out of ${this.state.data.length} remaining `}</span>
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
                    {currentQuestion < this.state.data.length - 1 && (
                        <button
                            className="ui inverted button"
                            disabled={this.state.disabled}
                            onClick={this.nextQuestionHandler}
                        >
                            Next
                        </button>
                    )}
                    {currentQuestion === this.state.data.length - 1 && (
                        <button className="ui inverted button" onClick={this.finishHandler}>
                            Finish
                        </button>
                    )}
                </div>
            );
        }
    }

        render()
        {
            const {options, myAnswer, currentQuestion, isEnd} = this.state;
            return (
                <div>
                    <h1>{'Loading...'}</h1>
                    {this.state && this.state.data &&
                    <div>{this.renderLevels(options, myAnswer, currentQuestion, isEnd)}</div>
                    }
                </div>
            )
        }
    }

    export default MusicalPursuit;