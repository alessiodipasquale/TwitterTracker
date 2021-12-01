import React, { Component, useImperativeHandle, useState } from 'react';
import { Card, Form, Row, Col, Button, Container, Alert, ListGroup, ListGroupItem, Accordion } from 'react-bootstrap';
import {addContest} from '../services/addContest-service';

function ContestHandler() {

    const [data, setData] = useState({
      hashtag: "",
      startDate: "",
      value: "",
      tag: "",
    });

    const [rules, setRules] = useState([]);

    function handle(e) {
        const newdata = {...data};
        newdata[e.target.id] = e.target.value;
        setData(newdata);
    }

    function clearNext() {
      const newdata = {...data};
      newdata.value = "";
      newdata.tag = "";
      setData(newdata);
    }


    function addRule(e) {
      const newrules = rules.concat({value: data.value, tag: data.tag});
      setRules(newrules);
      clearNext();
    }

    function clearRules() {
      setRules([]);
      clearNext();
    }

    function ruleItem(r) {
      return (
        <Accordion.Item eventKey={rules.indexOf(r)}>
          <Accordion.Header> Rule #{rules.indexOf(r) + 1}</Accordion.Header>
          <Accordion.Body>
            <ListGroup variant="flush">
              <ListGroupItem> Value: {r.value}</ListGroupItem>
              <ListGroupItem> Tag: {r.tag}</ListGroupItem>
            </ListGroup>
          </Accordion.Body>

        </Accordion.Item>
      );
    }


    function submit(e) {
        e.preventDefault();
        addContest(data.hashtag, data.startDate, rules);
    }

    return(
        <Container fluid  style={{padding: '2%'}} >

        <Row></Row>
        <Col></Col>

        <Row>
          <Col>
          <Card>
          <Card.Body>
          <Card.Title>Contest Specs</Card.Title>
          <Card.Text>
            <Form>
              <Row>
                <Form.Group class="mb-3" controlId="hashtag">
                  <Form.Control onChange={(e)=>handle(e)} type="text" placeholder="Contest hashtag" value={data.hashtag}/>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group class="mb-3" controlId="startDate">

                  <Form.Control
                  onChange={(e)=>handle(e)}
                  placeholder="Contest starting date"
                  type="date"
                  value={data.startDate}/>

                </Form.Group>
              </Row>
              <Row>
                <Col>
                  <Button disabled={data.hashtag=="" || data.startDate =="" } onClick={(e) => submit(e)} variant="primary">Create Contest</Button>
                </Col>
              </Row>
            </Form>
            </Card.Text>
          </Card.Body>
          </Card>
          </Col>
          <Col>
          <Card>
            <Card.Body>
              <Card.Title>Add Rules</Card.Title>
              <Card.Text>
                <Form>
                  <Row>
                    <Form.Group class="mb-3" controlId="value">
                      <Form.Control onChange={(e)=>handle(e)} type="text" placeholder="Rule value" value={data.value}/>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group class="mb-3" controlId="tag">
                      <Form.Control onChange={(e)=>handle(e)} type="text" placeholder="Rule Tag" value={data.tag}/>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Col>
                      <Button disabled={data.value=="" || data.tag =="" } onClick={(e) => addRule(e)} variant="primary">Add Rule</Button>
                    </Col>
                    <Col>
                      <Button disabled={rules?.length == 0} onClick={(e) => clearRules(e)} variant="primary">Clear Rules</Button>
                    </Col>

                  </Row>
                </Form>
              </Card.Text>
            </Card.Body>
            <Accordion flush>
              {
                rules?.length == 0 ? null : rules.map(ruleItem)
              }
            </Accordion>


          </Card>
          </Col>
        </Row>



        </Container>
    );
}

export default ContestHandler;
