import React, { Component } from 'react';
import { Row, Col, Tabs, Tab, Card, Container, ListGroup, ListGroupItem } from 'react-bootstrap';
import {socketConnection} from '../services/socket-service';


class ContestView extends Component {

  _isMounted = false;

  constructor(props){
    super(props);

    this.state = {
      literaryContestData: [],
      triviaGamesData: [],
      customStreamsData: []
    }

    socketConnection.instance.emit("/readyToReceiveData", (data) => {
      this.setState({literaryContestData: JSON.parse(JSON.stringify(data.dataFromLiteraryContests))});
      this.setState({triviaGamesData:data.dataFromTriviaGames});
    });

    this.handleCandidatura = this.handleCandidatura.bind(this);
    this.handleNewVote = this.handleNewVote.bind(this);
    this.handleNewAnswer = this.handleNewAnswer.bind(this);
  }

  componentDidMount(){ 
    this._isMounted = true;
    socketConnection.instance.on("newCandidateInLiteraryContest", (data)=>{if(this._isMounted) this.handleCandidatura(data)});
    socketConnection.instance.on("newVoteInLiteraryContest", (data)=>{if(this._isMounted) this.handleNewVote(data)});
    socketConnection.instance.on("newAnswerInTriviaGame", (data)=>{if(this._isMounted) this.handleNewAnswer(data)});
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleCandidatura(data) {
    console.log(`recieved data: ${data}`);
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
    if (contest)
      this.setState({literaryContestData:newLiteraryContestData});
  }

  handleNewVote(data) {
    // {contestName:hashtag, bookName:value, votedBy: tweet.data.author_id }
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
    this.setState({literaryContestData:newLiteraryContestData});
  }

  handleNewAnswer(data) {
    // {triviaName:hashtag, answerNumber:answerNumber, answer:value, isCorrect:done, userId:tweet.data.author_id,}
    const newTriviaGameData = JSON.parse(JSON.stringify(this.state.triviaGamesData));
    for (var i in newTriviaGameData) {
      if (newTriviaGameData[i].name === data.triviaName) {
        for (var j in newTriviaGameData[i].questions) {
          if (newTriviaGameData[i].questions[j].number === data.answerNumber) {
            newTriviaGameData[i].questions[j].participants.push({
              userId: data.userId,
              answeredTo: data.answerNumber,
              answer: data.answer,
              isCorrect: data.isCorrect,
            });
            break;
          }
        }
        break;
      }
    }
    this.setState({triviaGamesData:newTriviaGameData});
  }
  
  render(){
    return (
      <>
      <Container fluid  style={{padding: '2%'}} >
        <Tabs>
          <Tab eventKey="literaryContest" title="Literary Contests">
              { this.state.literaryContestData.map(this.displayLiteraryContest) }
          </Tab>
          <Tab eventKey="triviaGame" title="Trivia Games">
            <ListGroup className="list-group-flush">
              { this.state.triviaGamesData.map(this.displayTriviaGame) }
            </ListGroup>
          </Tab>
          <Tab eventKey="customStream" title="Custom streams">
            <ListGroup className="list-group-flush">
              { this.state.customStreamsData.map(this.displayCustomStream) }
            </ListGroup>
          </Tab>
        </Tabs>
      </Container>
      </>
    );
  }

  displayLiteraryContest(contestData) {
    return (
      <>
      <Card>
      <Card.Body>
        <Card.Title>{contestData.name}</Card.Title>
          <ListGroup>
            { contestData.books.map((book) => {
              return (<>
              <ListGroupItem>
              <strong>{book.bookName}</strong>: { book.votes } votes
              </ListGroupItem>
              </>);
            }) }
          </ListGroup>
        </Card.Body>
      </Card>
      </>
    );
  }

  displayTriviaGame(gameData) {
    return (
      <>
      <Card>
      <Card.Body>
        <Card.Title>{gameData.name}</Card.Title>
          <ListGroup as="ol" numbered>
            { gameData.questions.map(question => {
              return (
                <>
                <ListGroup.Item
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{question.text}</div>
                    <ListGroup variant="flush">
                    { question.participants.map((answerData) => {
                        return (
                          <>
                            <ListGroup.Item>
                              <strong>{answerData.userId}</strong>: {answerData.answer}
                            </ListGroup.Item>
                          </>
                        );
                      }) 
                    }
                    </ListGroup>
                  </div>
                </ListGroup.Item>
                </>
              );
            }) }
          </ListGroup>
        </Card.Body>
      </Card>
      </>
    );
  }

  displayCustomStream(data) {
    return (
      <>
      </>
    );
  }

}

export default ContestView;
