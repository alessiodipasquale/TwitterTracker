import React, { Component } from 'react';
import Chart from "react-google-charts";
import { Row, Col, Tabs, Tab, Card, Container, ListGroup, ListGroupItem } from 'react-bootstrap';
import { socketConnection } from '../services/socket-service';


class ContestView extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      literaryContestData: [],
      triviaGamesData: [],
      customStreamsData: [],
      formattedTriviaGameData: [],
      formattedLiteraryContestData: []
    }

    socketConnection.instance.emit("/readyToReceiveData", (data) => {
      this.setState({ literaryContestData: JSON.parse(JSON.stringify(data.dataFromLiteraryContests)) });
      this.setState({ triviaGamesData: JSON.parse(JSON.stringify(data.dataFromTriviaGames)) });
      this.setState({ customStreamsData: JSON.parse(JSON.stringify(data.dataFromCustomStreams)) });

      const formattedTrivia = [];
      for (let game of data.dataFromTriviaGames) {
        const questions = [];
        for (let question of game.questions) {
          const answers = [];
          for (let participant of question.participants) {
            let found = false;
            for (let answer of answers) {
              if (participant.answer.toLowerCase() === answer[0]) {
                answer[1] = answer[1] + 1;
                found = true;
              }
            }
            if (!found) {
              answers.push([participant.answer.toLowerCase(), 1])
            }
          }
          answers.unshift(['Answer', 'Occurrences'])
          questions.push({ number: question.number, formattedAnswers: answers })
        }
        formattedTrivia.push({ name: game.name, questions: questions })
      }
      this.setState({ formattedTriviaGameData: formattedTrivia });

      const formattedLits = [];
      for (let contest of data.dataFromLiteraryContests) {
        const formattedVotes = [];
        for(let book of contest.books){
          formattedVotes.push([book.bookName, book.votes])
        }
        formattedVotes.unshift(['Book', 'Votes'])
        formattedLits.push({ name: contest.name, formattedVotes: formattedVotes })
      }
      this.setState({ formattedLiteraryContestData: formattedLits });

    });

    this.handleCandidatura = this.handleCandidatura.bind(this);
    this.handleNewVote = this.handleNewVote.bind(this);
    this.handleNewAnswer = this.handleNewAnswer.bind(this);
    this.handleNewCustom = this.handleNewCustom.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    socketConnection.instance.on("newCandidateInLiteraryContest", (data) => { if (this._isMounted) this.handleCandidatura(data) });
    socketConnection.instance.on("newVoteInLiteraryContest", (data) => { if (this._isMounted) this.handleNewVote(data) });
    socketConnection.instance.on("newAnswerInTriviaGame", (data) => { if (this._isMounted) this.handleNewAnswer(data) });
    socketConnection.instance.on("newElementInCustomStream", (data) => { if (this._isMounted) this.handleNewCustom(data) });
    socketConnection.instance.on("elementShiftedInCustomStream", (data) => { if (this._isMounted) this.handleNewShift(data.hashtag) });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleCandidatura(data) {
    const newLiteraryContestData = JSON.parse(JSON.stringify(this.state.literaryContestData));
    const contest = newLiteraryContestData.find((contest, i) => {
      if (contest.name === data.contestName) {
        newLiteraryContestData[i].books.push({
          "candidatedBy": data.candidatedBy,
          "bookName": data.bookName,
          "votes": 0,
          "votedBy": []
        });
        return true;
      }
      return false;
    });
    if (contest){
      this.updateFormattedLiteraryContestData(data, "candidacy")
      this.setState({ literaryContestData: newLiteraryContestData });
    }
  }

  handleNewVote(data) {
    const newLiteraryContestData = JSON.parse(JSON.stringify(this.state.literaryContestData));
    for (var i in newLiteraryContestData) {
      if (newLiteraryContestData[i].name === data.contestName) {
        for (var j in newLiteraryContestData[i].books) {
          if (newLiteraryContestData[i].books[j].bookName === data.bookName) {
            newLiteraryContestData[i].books[j].votes += 1;
            break;
          }
        }
        break;
      }
    }
    this.updateFormattedLiteraryContestData(data,"vote")
    this.setState({ literaryContestData: newLiteraryContestData });
  }

  handleNewAnswer(data) {
    let newTriviaGameData = JSON.parse(JSON.stringify(this.state.triviaGamesData));
    for (let game of newTriviaGameData) {
      if (game.name === data.triviaName) {
        for (let question of game.questions) {
          if ((question.number).toString() === data.answerNumber) {
            question.participants.push({
              userId: data.userId,
              username: data.username,
              answeredTo: data.answerNumber,
              answer: data.answer,
              isCorrect: data.isCorrect,
            })
            break;
          }
        }
      }
    }
    this.updateFormattedTriviaGameData(data);
    this.setState({ triviaGamesData: newTriviaGameData });
  }

  handleNewCustom(data){
    let newCustomData = JSON.parse(JSON.stringify(this.state.customStreamsData));
    for(let stream of newCustomData){
      if(stream.name === data.customName){
        stream.totalCount = stream.totalCount + 1;
        stream.tweets.push({username:data.username, id:data.id, text:data.text})
      }
    }
    this.setState({ customStreamsData: newCustomData });
  }

  handleNewShift(hashtag){
    let newCustomData = JSON.parse(JSON.stringify(this.state.customStreamsData));
    for(let stream of newCustomData){
      if(stream.name === hashtag){
        stream.tweets.shift()
      }
    }
    this.setState({ customStreamsData: newCustomData });
  }

  updateFormattedTriviaGameData(data) {
    let newFormattedTriviaGameData = JSON.parse(JSON.stringify(this.state.formattedTriviaGameData));
    for (let game of newFormattedTriviaGameData) {
      if (game.name === data.triviaName) {
        for (let question of game.questions) {
          if ((question.number).toString() === (data.answerNumber).toString()) {
            let found = false;
            for (let i = 1; i < question.formattedAnswers.length; i++) {
              if ((question.formattedAnswers[i])[0] == data.answer.toLowerCase()) {
                (question.formattedAnswers[i])[1] = (question.formattedAnswers[i])[1] + 1;
                found = true;
              }
            }
            if (!found) question.formattedAnswers.push([data.answer.toLowerCase(), 1])
          }
        }
      }
    }
    this.setState({ formattedTriviaGameData: newFormattedTriviaGameData });
  }

  updateFormattedLiteraryContestData(data, type) {
    let newFormattedLiteraryContestData = JSON.parse(JSON.stringify(this.state.formattedLiteraryContestData));
    for (let contest of newFormattedLiteraryContestData) {
      if(contest.name === data.contestName){
        if(type === "candidacy"){
          contest.formattedVotes.push([data.bookName, 0]);
        }
        if(type === "vote"){
          for(let i = 1; i < contest.formattedVotes.length; i++){
            if((contest.formattedVotes[i])[0] === data.bookName){
              (contest.formattedVotes[i])[1] = (contest.formattedVotes[i])[1] + 1;
            }
          }
        }
      }
    }
    this.setState({ formattedLiteraryContestData: newFormattedLiteraryContestData });
  }

  getFormattedDataFromTrivias(game, question) {
    const data = this.state.formattedTriviaGameData;
    for (let g of data) {
      if (g.name === game.name) {
        for (let q of g.questions) {
          if (q.number === question.number) {
            return q.formattedAnswers;
          }
        }
      }
    }
  }

  getFormattedDataForLiteraryContests(name) {
    const data = this.state.formattedLiteraryContestData;
    for (let contest of data) {
      if (contest.name === name) {
        return contest.formattedVotes;
      }
    }
  }

  render() {
    return (
      <>
        <Container fluid style={{ padding: '2%' }} >
          <Tabs>
            <Tab eventKey="literaryContest" title="Literary Contests">
              {this.state.literaryContestData.map((contestData) => {
                return (
                  <>
                    <Card>
                      <Card.Body>
                        <Card.Title>{contestData.name}</Card.Title>
                        <ListGroup>
                          {contestData.books.map((book) => {
                            return (<>
                              <ListGroupItem>
                                <strong>{book.bookName}</strong>: {book.votes} votes
                              </ListGroupItem>
                            </>);
                          })}
                        </ListGroup>
                        <Row >
                          <Col >
                            <Chart
                              style={{}}
                              width={"800px"}
                              height={'500px'}
                              chartType="PieChart"
                              loader={<div>Loading Chart</div>}
                              data={this.getFormattedDataForLiteraryContests(contestData.name)}
                              options={{
                                title: 'Votes diagram',
                                sliceVisibilityThreshold: 0, // 0%
                              }}
                              rootProps={{ 'data-testid': '7' }}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </>
                );
              })
              }
            </Tab>
            <Tab eventKey="triviaGame" title="Trivia Games">
              <ListGroup className="list-group-flush">
                {this.state.triviaGamesData.map((gameData) => {
                  return (
                    <>
                      <Card>
                        <Card.Body>
                          <Card.Title>{gameData.name}</Card.Title>
                          <ListGroup as="ol" numbered>
                            {gameData.questions.map(question => {
                              return (
                                <>
                                  <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                  >
                                    <div className="ms-2 me-auto">
                                      <div className="fw-bold">{question.text}</div>
                                      <ListGroup variant="flush">
                                        {question.participants.map((answerData) => {
                                          return (
                                            <>
                                              <ListGroup.Item>
                                                <strong>{answerData.username}</strong>: {answerData.answer}
                                              </ListGroup.Item>
                                            </>
                                          );
                                        })
                                        }
                                      </ListGroup>
                                    </div>
                                  </ListGroup.Item>
                                  <Row >
                                    <Col >
                                      <Chart
                                        style={{}}
                                        width={"800px"}
                                        height={'500px'}
                                        chartType="PieChart"
                                        loader={<div>Loading Chart</div>}
                                        data={[
                                          ["answer", "percentage"],
                                          ["correct", question.participants.filter((participant) => {
                                            return participant.isCorrect === true;
                                          }).length],
                                          ["wrong", question.participants.filter((participant) => {
                                            return participant.isCorrect === false;
                                          }).length]
                                        ]}
                                        options={{
                                          title: 'Answers percentages',
                                          sliceVisibilityThreshold: 0, // 0%
                                        }}
                                        rootProps={{ 'data-testid': '7' }}
                                      />
                                    </Col>
                                    <Col>
                                      <Chart
                                        style={{ marginTop: "5%" }}
                                        width={'500px'}
                                        height={'300px'}
                                        chartType="Bar" // or BarChart
                                        loader={<div>Loading Chart</div>}
                                        data={this.getFormattedDataFromTrivias(gameData, question)}
                                        options={{
                                          chart: {
                                            title: 'Given answers:',
                                          },
                                          colors: ['green'],
                                          legend: { position: 'none' },
                                        }}
                                        // For tests
                                        rootProps={{ 'data-testid': '2' }}
                                      />
                                    </Col>
                                  </Row>
                                </>
                              );
                            })}
                          </ListGroup>
                        </Card.Body>
                      </Card>
                    </>
                  );
                })
                }
              </ListGroup>
            </Tab>
            <Tab eventKey="customStream" title="Custom streams">
              <ListGroup className="list-group-flush">
                {this.state.customStreamsData.map((data) => {
                  return (
                    <>
                      <Card>
                        <Card.Body>
                          <Card.Title>{data.name}</Card.Title>
                          <Card.Subtitle style={{marginTop:"1%"}}>Total count: {data.totalCount}</Card.Subtitle>
                          <ListGroup style={{marginTop:"1%"}}>
                            {data.tweets.map((tweet) => {
                              return (<>
                                <ListGroupItem>
                                  <p><strong>from: {tweet.username}</strong></p>
                                  <p> Text: {tweet.text}</p>
                                </ListGroupItem>
                              </>);
                            })}
                          </ListGroup>
                        </Card.Body>
                      </Card>
                    </>
                  );
                })
                }
              </ListGroup>
            </Tab>
          </Tabs>
        </Container>
      </>
    );
  }

}

export default ContestView;
