import React, { Component } from 'react';
import { Modal, Card, Form, Row, Button, Container } from 'react-bootstrap';
import { createContest, createTrivia, createCustom } from '../services/contest-service';
import {socketConnection} from '../services/socket-service'


class ContestHandler extends Component {

    constructor(props) {
        super(props);

        this.state=  { 
          showLiteraryModal: false,
          showTriviaModal: false,
          showCustomModal: false,
          dataFromLiteraryContests: [],
          dataFromTriviaGames: [],
          contest: {
            name: '',
            startDate: new Date(),
            endDate: new Date(),
            type: '',
            rules: [],
            extras: {
              questions: [],
              keyword: '',
              username: ''
            }
          }
        };

        socketConnection.instance.emit("/readyToReceiveData", (data) => {
          console.log(data);
        })
        
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
      const newContest = {...this.state.contest}
      newContest[e.target.id] = e.target.value;
      this.setState({contest: newContest});
    }

    handleNewQuestion(e){
      const newContest = {...this.state.contest}
      const num = Number(e.target.id)
      newContest.extras.questions[num][e.target.toWrite] = e.target.value;
      this.setState({contest: newContest});
    }

  
    render() {
      return(
        <>
        <Container fluid  style={{padding: '2%'}} >
          <Row style={{height:"30vh"}}>
            <Card style={{borderColor:"#58595B", alignItems:"center"}}>
                <p style={{fontSize:20, marginTop:"5%"}} >Create a contest where it is possible to apply and vote for books. The result can be viewed in real time on the Contest View page.</p>
                <p style={{fontSize:20}} >Currently active: 123</p>
                <Button style={{position: "absolute", top: "80%"}} onClick={(e) => this.openCreateLiteraryContest(e)} variant="primary">Create Literary Contest</Button>
            </Card>
          </Row>
          <Row style={{height:"30vh", marginTop:"1%"}}>
            <Card style={{borderColor:"#58595B", alignItems:"center"}}>
                <p style={{fontSize:20, marginTop:"5%"}} >Create a game where you can get points by correctly answering the proposed questions. The results are available in real time on the Contest View page.</p>
                <p style={{fontSize:20}} >Currently active: 123</p>
                <Button style={{position: "absolute", top: "80%"}} onClick={(e) => this.openCreateTriviaGame(e)} variant="primary">Create Trivia Game</Button>
            </Card>
          </Row>
          <Row style={{height:"30vh", marginTop:"1%"}}>
            <Card style={{borderColor:"#58595B", alignItems:"center"}}>
                <p style={{fontSize:20, marginTop:"5%"}} >Create your own data streams using an identifier and associated keywords. You will receive Tweets that meet the requirements on the Contest View page.</p>
                <p style={{fontSize:20}} >Currently active: 123</p>
                <Button style={{position: "absolute", top: "80%"}} onClick={(e) => this.openCreateCustomStream(e)} variant="primary">Create custom stream</Button>
            </Card>
          </Row>
        </Container>
        { this.literaryModal() }
        { this.triviaGameModal() }
        { this.customStreamModal() }
        
        </>
      )
    }

    openCreateTriviaGame(e) {
      this.setState(prevState => ({
        showTriviaModal: true,
        contest: {                   // object that we want to update
            ...prevState.contest,    // keep all other key-value pairs
            type: 'triviaGame'       // update the value of specific key
        }
      }))
      
    } 

    openCreateLiteraryContest(e) {
      this.setState(prevState => ({
        showLiteraryModal: true,
        contest: {                   // object that we want to update
            ...prevState.contest,    // keep all other key-value pairs
            type: 'literaryContest'       // update the value of specific key
        }
      }))
    }

    openCreateCustomStream(e) {
      this.setState(prevState => ({
        showCustomModal: true,
        contest: {
          ...prevState.contest,
            type: 'custom'
        }
      }))  
    } 

    addQuestion(e) {
      let newQuestions = this.state.contest.extras.questions
      newQuestions.push({
        text: '',
        correctAnswers: "'example1' 'example2'"
      })
      this.setState(prevState => ({
        contest: {
          ...prevState.contest,
          extras: {
            ...prevState.contest.extras,
            questions: newQuestions 
          }
        }
      }))
    }

    removeQuestion(){
      const last = this.state.contest.extras.questions.length - 1;
      let newQuestions = this.state.contest.extras.questions.slice(0,last)
      this.setState(prevState => ({
        contest: {
          ...prevState.contest,
          extras: {
            ...prevState.contest.extras,
            questions: newQuestions 
          }
        }
      }))
    }

    createLiteraryContest() {
      let object = this.state.contest;
      object.name = '#'+object.name;
      object.startDate = new Date (object.startDate);
      object.endDate = new Date (object.endDate);
      object.rules = [
        {
          value: object.name+' (candido OR candidare)',
          tag: 'candidatura'
        },
        {
          value: object.name+' voto',
          tag: 'voto'
        },
      ]
      createContest(object).then((res) => {
        this.setState({showLiteraryModal:false})
      }).catch(err => console.log(err))
    }

    createTriviaGame() {
      let object = this.state.contest;
      object.name = '#'+object.name;
      object.startDate = new Date (object.startDate);
      object.endDate = new Date (object.endDate);
      object.rules = []
      let num = 1;
      for(let question of object.extras.questions){
        let array = question.correctAnswers.split("'").filter((element)=>{
          return element !== " " && element !== '';
        });
        question.correctAnswers = array;
        object.rules.push({
          value: object.name+' risposta_'+num,
          tag: 'risposta_'+num
        })
        num = num + 1;
      }
      createTrivia(object).then((res) => {
        this.setState({showTriviaModal:false})
      }).catch(err => console.log(err))
    }

    createCustomStream() {
      let object = this.state.contest;
      object.name = '#'+object.name;
      object.startDate = new Date (object.startDate);
      object.endDate = new Date (object.endDate);
      object.rules = [{
        value: object.keyword,
        tag: object.keyword
      }]
      createCustom(object).then((res) => {
        this.setState({showCustomModal:false})
      }).catch(err => console.log(err))
    }

    literaryModal() {
      return (
        <>
        <Modal
          show={this.state.showLiteraryModal}
          size="md"
          aria-labelledby="example-modal-sizes-title-md"
          onHide={() => this.setState({showLiteraryModal:false})}

        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-md">
              Create Literary Contest
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {
            <Row>
              <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Insert Hashtag for the Literary Contest</Form.Label>
                  <Form.Control value={this.state.contest.name} onChange={this.handleNewQuestion} type="text" placeholder="Contest hashtag"/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="endDate">
                  <Form.Label>Insert End Date for the Literary Contest</Form.Label>
                  <Form.Control value={this.state.contest.endDate} onChange={this.handleNewQuestion} type="date"/>
              </Form.Group>
            </Row>
          } 
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({showLiteraryModal:false})} variant="secondary">Close</Button>
            <Button variant="primary" onClick={() => this.createLiteraryContest()}>Create contest</Button>
          </Modal.Footer>
          </Modal>
        </>
      )
    }

    triviaGameModal() {
      return (
        <>
        <Modal
          show={this.state.showTriviaModal}
          size="md"
          aria-labelledby="example-modal-sizes-title-md"
          onHide={() => this.setState({showTriviaModal:false})}

        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-md">
              Create Trivia Game
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {
            <Row>
              <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Insert Hashtag for the Trivia Game</Form.Label>
                  <Form.Control value={this.state.contest.name} onChange={(e)=>{this.handleChange(e)}} type="text" placeholder="Contest hashtag"/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="endDate">
                  <Form.Label>Insert End Date for the Trivia Game</Form.Label>
                  <Form.Control value={this.state.contest.endDate} onChange={this.handleChange} type="date"/>
              </Form.Group>
              
              {
                this.state.contest.extras.questions.length !== 0 ?
                this.state.contest.extras.questions && this.state.contest.extras.questions.map(question => {
                  let num = this.state.contest.extras.questions.indexOf(question);
                  return (
                    <Card className='mb-3'>
                      <Card.Body>
                        <Form.Group>
                          <Form.Label>Insert Question</Form.Label>
                          <Form.Control value={question.text} onChange={(e)=>{e.target.id = num; e.target.toWrite = "text"; this.handleNewQuestion(e)}} type="text" placeholder="Insert question" className='mb-3'/>
                          <Form.Label>Insert Correct Answers</Form.Label>
                          <p style={{color:"#444444"}}>(List of statements enclosed in single quotation marks)</p>
                          <Form.Control value={question.correctAnswers} onChange={(e)=>{e.target.id = num; e.target.toWrite = "correctAnswers"; this.handleNewQuestion(e)}} type="text" placeholder="Insert correct answers"/>
                        </Form.Group>
                      </Card.Body>
                    </Card>                    
                  )
                }) : null
              }

              <Button onClick={() => {this.addQuestion()}}> Add question</Button>
              <Button style ={{marginTop:"3px"}} hidden={!(this.state.contest.extras.questions.length > 0)} variant="danger" onClick={() => {this.removeQuestion()}}> remove question</Button>
            </Row>
          } 
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({showTriviaModal:false})} variant="secondary">Close</Button>
            <Button variant="primary" onClick={() => this.createTriviaGame()}>Create game</Button>
          </Modal.Footer>
          </Modal>
        </>
      )
    }

    customStreamModal(){
      return  (
        <>
        <Modal
          show={this.state.showCustomModal}
          size="md"
          aria-labelledby="example-modal-sizes-title-md"
          onHide={() => this.setState({showCustomModal:false})}

        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-md">
              Create Custom stream
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {
            <Row>
              <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Insert a name for the stream</Form.Label>
                  <Form.Control value={this.state.contest.name} onChange={(e)=>{this.handleChange(e)}} type="text" placeholder="Name"/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="endDate">
                  <Form.Label>Insert End Date for the custom stream</Form.Label>
                  <Form.Control value={this.state.contest.endDate} onChange={this.handleChange} type="date"/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Insert Keyword for the Custom stream</Form.Label>
                  <p style={{color:"#444444"}}>(It can also be a whole sentence)</p>
                  <Form.Control value={this.state.contest.extras.keyword} onChange={(e)=>{this.handleChange(e)}} type="text" placeholder="Keyword"/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Insert username to filter (optional)</Form.Label>
                  <Form.Control value={this.state.contest.extras.username} onChange={(e)=>{this.handleChange(e)}} type="text" placeholder="Contest hashtag"/>
              </Form.Group>  
            </Row>
          } 
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({showCustomModal:false})} variant="secondary">Close</Button>
            <Button variant="primary" onClick={() => this.createCustomStream()}>Create stream</Button>
          </Modal.Footer>
          </Modal>
        </>
      );
    }
    
}

export default ContestHandler;