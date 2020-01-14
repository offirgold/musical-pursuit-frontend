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
            correctness: 0,
            bodekMode: false,
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
            this.setState({
                score: score + 10, correctness: 1,
            });
        } else {
            if (this.state.score >= 5) {
                this.setState({
                    score: score - 5, correctness: 2,
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

    bodekMode = (boolean) => {
        if (this.state.bodekMode !== boolean) {
            this.setState({bodekMode: boolean});
        }
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
                            <table className="ui striped table">
                                <tbody>
                                <tr className="center aligned" key={index}>
                                    <td>{item.question}</td>
                                    <td>{item.answer}</td>
                                    <td className="right aligned"></td>
                                </tr>
                                </tbody>
                            </table>
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
                <div className="result">
                    <button className="ui left attached button" onClick={() => this.bodekMode(false)}>Player mode</button>
                    <button className="right attached ui button"onClick={() => this.bodekMode(true)}>Bodek mode</button>
                    <h1>{this.state.question} </h1>
                    <h3>Score: {this.state.score} points </h3>
                    <span>{`Questions ${currentQuestion + 1}  out of ${this.state.data.length} remaining `}</span>
                    {options.map(this.bodekChecker)}
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

    bodekChecker = option =>{
        if (this.state.bodekMode === true){
            return (<p
                    key={option.id}
                    className={this.state.data[this.state.currentQuestion].answer === option ? "ui floating message selected_right": "ui floating message"}
                    onClick={() => this.checkAnswer(option)}>
                    {option}
                </p>)
        } else {
            return (<p
                    key={option.id}
                    className={`ui floating message options ${this.state.myAnswer === option ? "selected" : null}`}
                    onClick={() => this.checkAnswer(option)}>
                    {option}
                </p>
            )
        }
    }


        render()
        {
            const {options, myAnswer, currentQuestion, isEnd} = this.state;
            return (
                <div>
                    {this.state && this.state.data &&
                    <div>{this.renderLevels(options, myAnswer, currentQuestion, isEnd)}</div>
                    }
                </div>
            )
        }
    }

    export default MusicalPursuit;