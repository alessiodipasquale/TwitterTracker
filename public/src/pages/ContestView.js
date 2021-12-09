import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Row, Col, Tabs, Tab, Card, Container, ListGroup, ListGroupItem } from 'react-bootstrap';
import {socketConnection} from '../services/socket-service';


function ContestView() {

  const socket = socketConnection.instance;

  const [literaryContestData, setLiteraryContestData] = useState([]);
  const [triviaGamesData, setTriviaGamesData] = useState([]);

  function handleCandidatura(data) {

    console.log(`recieved data: ${data}`);

    const newLiteraryContestData = JSON.parse(JSON.stringify(literaryContestData));

    let contest = newLiteraryContestData.find((contest, i) => {
      if (contest.name == data.contestName) {
        newLiteraryContestData[i].books.push({
          "candidatedBy": data.candidatedBy,
          "bookName": data.bookName,
          "votes": 0,
          "votedBy": []
        });
        return true;
      }
    });
    setLiteraryContestData(newLiteraryContestData);
  }

  function handleNewVote(data) {
    // {contestName:hashtag, bookName:value, votedBy: tweet.data.author_id }

    const newLiteraryContestData = JSON.parse(JSON.stringify(literaryContestData));

    for (var i in newLiteraryContestData) {
      if (newLiteraryContestData[i].name == data.contestName) {
        for (var j in newLiteraryContestData[i].books) {
          if (newLiteraryContestData[i].books[j].bookName == data.bookName) {
            newLiteraryContestData[i].books[j].votes += 1;
            break;
          }
        }
        break;
      }
    }

    setLiteraryContestData(newLiteraryContestData);
  }

  function handleNewAnswer(data) {
    // {triviaName:hashtag, answerNumber:answerNumber, answer:value, isCorrect:done, userId:tweet.data.author_id,}

    const newTriviaGameData = JSON.parse(JSON.stringify(triviaGamesData));

    for (var i in newTriviaGameData) {
      if (newTriviaGameData[i].name == data.triviaName) {

        for (var j in newTriviaGameData[i].questions) {

          if (newTriviaGameData[i].questions[j].number == data.answerNumber) {

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

    setTriviaGamesData(newTriviaGameData);
  }

  useEffect(() => {
    console.log(literaryContestData);  // rebind shit

    socket.on("newCandidateInLiteraryContest", handleCandidatura);
    socket.on("newVoteInLiteraryContest", handleNewVote);

  }, [literaryContestData]);

  useEffect(() => {
    console.log(triviaGamesData);

    socket.on("newAnswerInTriviaGame", handleNewAnswer);

  }, [triviaGamesData]);

  useEffect(()=>{

    socket.emit("/readyToReceiveData", (data) => {
          setLiteraryContestData(JSON.parse(JSON.stringify(data.dataFromLiteraryContests)));
          setTriviaGamesData(data.dataFromTriviaGames);
    });

    socket.on("newCandidateInLiteraryContest", handleCandidatura);

    socket.on("newVoteInLiteraryContest", handleNewVote);

    socket.on("newAnswerInTriviaGame", handleNewAnswer);

    //return () => {socket.disconnect()}
  }, []);

  return (
    <>

    <Container fluid  style={{padding: '2%'}} >


      <Tabs>
        <Tab eventKey="literaryContest" title="Literary Contests">

            { literaryContestData.map(displayLiteraryContest) }

        </Tab>
        <Tab eventKey="triviaGame" title="Trivia Games">
          <ListGroup className="list-group-flush">
            { triviaGamesData.map(displayTriviaGame) }
          </ListGroup>
        </Tab>
      </Tabs>

    </Container>
    </>
  );

  function displayLiteraryContest(contestData) {
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

  function displayTriviaGame(gameData) {

    function displayAnswer(answerData) {
      return (
        <>
          <ListGroup.Item>
            <strong>{answerData.userId}</strong>: {answerData.answer}
          </ListGroup.Item>

        </>
      );
    }

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
                    { question.participants.map(displayAnswer) }
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

}

export default ContestView;
