import React, { Component } from 'react';
import { Modal, Card, Form, Row, Button, Container } from 'react-bootstrap';
import { createContest, createTrivia, createCustom } from '../services/contest-service';
import {socketConnection} from '../services/socket-service'

/**
 * Component that permit creation of contests, trivia games and custom streams.
 */

class ContestHandler extends Component {

    /**
     * Set state for webpage
     * @param {*} props props for state initialization
     */

    constructor(props) {
        super(props);

        this.state= { 
          literaryCount: 0,
          triviaCount: 0,
          customCount: 0,
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
              keyword: "",
              username: ""
            }
          }
        };

        socketConnection.instance.emit("/readyToReceiveData", (data) => {
          this.setState({
            literaryCount: data.dataFromLiteraryContests.length,
            triviaCount: data.dataFromTriviaGames.length,
            customCount: data.dataFromCustomStreams.length
          })
        })
        
        this.handleChange = this.handleChange.bind(this);
    }

    /**
     * Change handling function for page autorefreshing
     * @param {*} e 
     */

    handleChange(e) {
      const newContest = {...this.state.contest}
      newContest[e.target.id] = e.target.value;
      this.setState({contest: newContest});
    }

    /**
     * Change handling function for page autorefreshing
     * @param {*} e 
     */

    handleNewQuestion(e){
      const newContest = {...this.state.contest}
      const num = Number(e.target.id)
      newContest.extras.questions[num][e.target.toWrite] = e.target.value;
      this.setState({contest: newContest});
    }

    /**
     * Change handling function for page autorefreshing
     * @param {*} e 
     */

    handleChangeCustom(e){
      const newContest = {...this.state.contest}
      newContest.extras[e.target.id] = e.target.value;
      this.setState({contest: newContest});
    }
  
    /**
     * Standard render function for react apps
     * @returns JSX code for the page
     */

    render() {
      return(
        <>
        <Container fluid  style={{padding: '2%'}} >
          <Row style={{height:"30vh"}}>
            <Card style={{borderColor:"#58595B", alignItems:"center"}}>
                <p style={{fontSize:20, marginTop:"5%"}} >Create a contest where it is possible to apply and vote for books. The result can be viewed in real time on the Contest View page.</p>
                <p style={{fontSize:20}} >Currently active: {this.state.literaryCount}</p>
                <Button style={{position: "absolute", top: "80%"}} onClick={(e) => this.openCreateLiteraryContest(e)} variant="primary">Create Literary Contest</Button>
            </Card>
          </Row>
          <Row style={{height:"30vh", marginTop:"1%"}}>
            <Card style={{borderColor:"#58595B", alignItems:"center"}}>
                <p style={{fontSize:20, marginTop:"5%"}} >Create a game where you can get points by correctly answering the proposed questions. The results are available in real time on the Contest View page.</p>
                <p style={{fontSize:20}} >Currently active: {this.state.triviaCount}</p>
                <Button style={{position: "absolute", top: "80%"}} onClick={(e) => this.openCreateTriviaGame(e)} variant="primary">Create Trivia Game</Button>
            </Card>
          </Row>
          <Row style={{height:"30vh", marginTop:"1%"}}>
            <Card style={{borderColor:"#58595B", alignItems:"center"}}>
                <p style={{fontSize:20, marginTop:"5%"}} >Create your own data streams using an identifier and associated keywords. You will receive Tweets that meet the requirements on the Contest View page.</p>
                <p style={{fontSize:20}} >Currently active: {this.state.customCount}</p>
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

    /**
     * Modal initilaizer for trivia creation
     * @param {*} e 
     */

    openCreateTriviaGame(e) {
      this.setState(prevState => ({
        showTriviaModal: true,
        contest: {                   // object that we want to update
            ...prevState.contest,    // keep all other key-value pairs
            type: 'triviaGame'       // update the value of specific key
        }
      }))
      
    } 

    /**
     * Modal initilaizer for contest creation
     * @param {*} e 
     */

    openCreateLiteraryContest(e) {
      this.setState(prevState => ({
        showLiteraryModal: true,
        contest: {                   // object that we want to update
            ...prevState.contest,    // keep all other key-value pairs
            type: 'literaryContest'       // update the value of specific key
        }
      }))
    }

    /**
     * Modal initilaizer for custom streams creation
     * @param {*} e 
     */

    openCreateCustomStream(e) {
      this.setState(prevState => ({
        showCustomModal: true,
        contest: {
          ...prevState.contest,
            type: 'custom'
        }
      }))  
    } 

    /**
     * Utility function for trivia creation modal
     * @param {*} e 
     */

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

    /**
     * Utility function for trivia creation modal
     */

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

    /**
     * Function that prepare data and interface with the server for contest creation
     */

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

    /**
     * Function that prepare data and interface with the server for trivia creation
     */

    createTriviaGame() {
      let object = this.state.contest;
      object.name = '#'+object.name;
      object.startDate = new Date (object.startDate);
      object.endDate = new Date (object.endDate);
      object.rules = []
      let num = 1;
      for(let question of object.extras.questions){
        question.number = num;
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

    /**
     * Function that prepare data and interface with the server for custom streams creation
     */

    createCustomStream() {
      let object = this.state.contest;
      object.name = '#'+object.name;
      object.startDate = new Date (object.startDate);
      object.endDate = new Date (object.endDate);
      object.rules = [{
        value: object.extras.keyword,
        tag: object.extras.keyword
      }]
      console.log(object)
      createCustom(object).then((res) => {
        this.setState({showCustomModal:false})
      }).catch(err => console.log(err))
    }

    /**
     * Function that verify if all fields are correctly filled
     * @returns a boolean
     */
    submitAvailableForContest() {
      return (this.state.contest.name != '' && this.state.contest.endDate != null)
    }
    
    /**
     * Function that verify if all fields are correctly filled
     * @returns a boolean
     */
    submitAvailableForTrivia() {
      return (this.state.contest.name != '' && this.state.contest.endDate != null)
    }

    /**
     * Function that verify if all fields are correctly filled
     * @returns a boolean
     */
    submitAvailableForCustom() {
      return (this.state.contest.name != '' && this.state.contest.endDate != null && this.state.contest.extras.keyword != '')
    }

    /**
     * JSX code for modal
     */
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
                  <Form.Control value={this.state.contest.name} onChange={this.handleChange} type="text" placeholder="Contest hashtag"/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="endDate">
                  <Form.Label>Insert End Date for the Literary Contest</Form.Label>
                  <Form.Control value={this.state.contest.endDate.toISOString().substring(0, 10)} onChange={this.handleChange} type="date"/>
              </Form.Group>
            </Row>
          } 
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({showLiteraryModal:false})} variant="secondary">Close</Button>
            <Button disabled={!this.submitAvailableForContest()} variant="primary" onClick={() => this.createLiteraryContest()}>Create contest</Button>
          </Modal.Footer>
          </Modal>
        </>
      )
    }

    /**
     * JSX code for modal
     */
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
                  <Form.Control value={this.state.contest.endDate.toISOString().substring(0, 10)} onChange={this.handleChange} type="date"/>
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
              <Button style ={{marginTop:"3px"}} hidden={this.state.contest.extras.questions.length <= 0} variant="danger" onClick={() => {this.removeQuestion()}}> remove question</Button>
            </Row>
          } 
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({showTriviaModal:false})} variant="secondary">Close</Button>
            <Button disabled={!this.submitAvailableForTrivia()} variant="primary" onClick={() => this.createTriviaGame()}>Create game</Button>
          </Modal.Footer>
          </Modal>
        </>
      )
    }

    /**
     * JSX code for modal
     */
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
                  <Form.Control value={this.state.contest.endDate.toISOString().substring(0, 10)} onChange={this.handleChange} type="date"/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="keyword">
                  <Form.Label>Insert Keyword for the Custom stream</Form.Label>
                  <p style={{color:"#444444"}}>(It can also be a whole sentence)</p>
                  <Form.Control value={this.state.contest.extras.keyword} onChange={(e)=>{this.handleChangeCustom(e)}} type="text" placeholder="Keyword"/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Insert username to filter (optional)</Form.Label>
                  <p style={{color:"#444444"}}>(Will be considered only Tweets from this username)</p>
                  <Form.Control value={this.state.contest.extras.username} onChange={(e)=>{this.handleChangeCustom(e)}} type="text" placeholder="Username"/>
              </Form.Group>  
            </Row>
          } 
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({showCustomModal:false})} variant="secondary">Close</Button>
            <Button disabled={!this.submitAvailableForCustom()} variant="primary" onClick={() => this.createCustomStream()}>Create stream</Button>
          </Modal.Footer>
          </Modal>
        </>
      );
    }
    
}

export default ContestHandler;