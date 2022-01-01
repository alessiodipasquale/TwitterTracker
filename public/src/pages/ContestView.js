import React, { Component } from 'react';
import Chart from "react-google-charts";
import { Row, Col, Tabs, Tab, Card, Container, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { socketConnection } from '../services/socket-service';
import { IoLogoTwitter } from 'react-icons/io';


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
  
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleCandidatura(data) {
    const newLiteraryContestData = JSON.parse(JSON.stringify(this.state.literaryContestData));
    const contest = newLiteraryContestData.find((cont, i) => {
      if (cont.name === data.contestName) {
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
        <Container fluid style={{ padding: '2%', overflow: 'scroll' }} >
          <Tabs>
            <Tab eventKey="literaryContest" title="Literary Contests">
              {this.state.literaryContestData.map((contestData) => {
                return (
                  <>
                    <Card style={{marginTop: "3px"}}>
                      <Card.Body>
                        <Row>
                          <Col>
                            <Card.Title>{contestData.name}</Card.Title>
                          </Col>
                          <Col style={{display:"flex", padding: "1%", alignItems: 'center', justifyContent: 'flex-end'}}>
                          <p style={{marginRight:"2%", marginBottom: '0'}}>Candidacy: </p>
                         { /*<a 
                              target="_blank" 
                              rel="noopener noreferrer"
                              href={hrefForCandidacy}
                              className="twitter-share-button" 
                              data-size="large"
                              data-show-count="false">
                                Candidacy for this contest
                         </a>
                         href="https://twitter.com/intent/tweet?text=optional%20promo%20text%20http://example.com/foo.htm?bar=123&baz=456" 
                         */}

                            <Button size="sm" variant="primary" onClick={()=> {
                              const link = "https://twitter.com/intent/tweet?text=%23"+(contestData.name.substring(1)).concat("%20candido%20").concat("\"nomeLibro\"")
                              window.open(link,"_blank")}
                            }  style={{display: 'flex', alignItems:'center'}}>
                              <IoLogoTwitter style={{marginRight: "3px"}}/>
                              Candidacy for this contest</Button>

                          </Col>
                        </Row>
                        <ListGroup>
                          {contestData.books.map((book) => {
                            const hrefForVote= "https://twitter.com/intent/tweet?text=%23"+(contestData.name.substring(1)).concat("%20voto%20").concat("\"").concat(book.bookName).concat("\"");
                            return (<>
                              <ListGroupItem>
                                <Row>
                                <Col>
                                  <strong style={{marginRight:"10px"}}>{book.bookName}:</strong> {book.votes} votes
                                </Col>  
                                <Col style={{display:"flex", padding: "1%", alignItems: 'center', justifyContent: 'flex-end'}}>
                                  <p style={{marginRight:"2%", marginBottom: '0'}}>Vote: </p>
                                 {/* <a 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      href={hrefForVote}
                                      className="twitter-share-button" 
                                      data-size="large"
                                      data-show-count="false">
                                        Vote for this book
                                 </a>*/}
                                  <Button size="sm" variant="primary" href={hrefForVote}  style={{display: 'flex', alignItems:'center'}}>
                                  <IoLogoTwitter style={{marginRight: "3px"}}/>
                                    Vote for this book</Button>

                                  </Col>
                                </Row>
                              </ListGroupItem>
                            </>);
                          })}
                        </ListGroup>
                        <Row >
                          <Col >
                            <Chart
                              style={{}}
                              width="100%"
                              height='300px'
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
                      <Card style={{marginTop: "3px"}}>
                        <Card.Body>
                          <Card.Title>{gameData.name}</Card.Title>
                          <ListGroup as="ol" numbered>
                            {gameData.questions.map(question => {
                              console.log(question);
                              const hrefForAnswer= "https://twitter.com/intent/tweet?text=%23"+(gameData.name.substring(1)).concat("%20risposta_").concat(question.number).concat("%20").concat("\"").concat("yourAnswer").concat("\"");

                              return (
                                <>
                                  <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                  >
                                      <div className="ms-2 me-auto" style={{width:"95%"}}>
                                      <Row >
                                        <Col style={{width:"30%"}}>
                                          <div className="fw-bold">{question.text}</div>
                                        </Col>
                                        <Col style={{display:"flex", padding: "1%", alignItems: 'center', justifyContent: 'flex-end'}}>
                                          <p style={{marginRight:"2%", marginBottom: '0'}}>Answer: </p>
                                          {/*<a 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              href={hrefForAnswer}
                                              className="twitter-share-button" 
                                              data-size="large"
                                              data-show-count="false">
                                                Answer the question
                                          </a>*/}
                                          <Button size="sm" variant="primary" href={hrefForAnswer} style={{display: 'flex', alignItems:'center'}}>
                                          <IoLogoTwitter style={{marginRight: "3px"}}/>
                                            Answer the question</Button>

                                        </Col>
                                      </Row>
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
                                  <Row style={{marginTop: "2%"}}>
                                    <Col>
                                      <Chart
                                        
                                        width="600px"
                                        height='300px'
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
                                        
                                        width="600px"
                                        height='300px'
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
                      <Card style={{marginTop: "3px"}}>
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

export default ContestView
