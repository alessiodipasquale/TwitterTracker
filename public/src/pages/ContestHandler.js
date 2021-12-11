import e from 'cors';
import React, { Component, useImperativeHandle, useState } from 'react';
import { Modal, Card, Form, Row, Col, Button, Container, Alert, ListGroup, ListGroupItem, Accordion } from 'react-bootstrap';
import { createContest } from '../services/contest-service';
import {socketConnection} from '../services/socket-service'


class ContestHandler extends React.Component {


    constructor(props) {
        super(props);

        this.state=  { 
          showLiteraryModal: false,
          showTriviaModal: false,
          dataFromLiteraryContests: [],
          dataFromTriviaGames: [],
          contest: {
            name: '',
            startDate: new Date(),
            endDate: new Date(),
            type: '',
            rules: [],
            extras: []
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
  
    render() {
      return(
        <>
        <Container fluid  style={{padding: '2%'}} >
          <Row>
            <Col>
              <Button style={{marginRight: '2%'}} onClick={(e) => this.openCreateLiteraryContest(e)} variant="primary">Create Literary Contest</Button>
              <Button style={{marginRight: '2%'}} onClick={(e) => this.openCreateTriviaGame(e)} variant="primary">Create Trivia Game</Button>
              <Button onClick={(e) => this.openCreateCustomStream(e)} variant="primary">Create custom stream</Button>
            </Col>
          </Row>
        </Container>
        { this.literaryModal() }
        { this.triviaGameModal() }
        
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
                  <Form.Control value={this.state.contest.endDate} onChange={this.handleChange} type="date"/>
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
                  <Form.Control value={this.state.contest.name} onChange={this.handleChange} type="text" placeholder="Contest hashtag"/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="endDate">
                  <Form.Label>Insert End Date for the Trivia Game</Form.Label>
                  <Form.Control value={this.state.contest.endDate} onChange={this.handleChange} type="date"/>
              </Form.Group>
            </Row>
          } 
          </Modal.Body>
          </Modal>
        </>
      )
    }
    
}

export default ContestHandler;