import React, { Component, useImperativeHandle, useState } from 'react';
import { Card, Form, Row, Col, Button, Container, Alert } from 'react-bootstrap';
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

    function ruleCard(r) {
      return (
        <Row>
        <Card>
        <ul>
          <li>Rule Value: {r.value}</li>
          <li>Rule Tag: {r.tag}</li>
        </ul>
        </Card>
        </Row>
      );
    }


    function submit(e) {
        e.preventDefault();
        addContest(data.hashtag, data.startDate, rules);
    }

    return(
        <Container fluid  style={{padding: '2%'}} >

        <Row>
          <Form>

            <Row>

              <Col>
                <Form.Group class="mb-3" controlId="hashtag">
                  <Form.Control onChange={(e)=>handle(e)} type="text" placeholder="Contest hashtag" value={data.hashtag}/>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group class="mb-3" controlId="value">
                  <Form.Control onChange={(e)=>handle(e)} type="text" placeholder="Rule value" value={data.value}/>
                </Form.Group>
              </Col>

            </Row>

            <Row>

              <Col>

                <Form.Group class="mb-3" controlId="startDate">

                  <Form.Control
                  onChange={(e)=>handle(e)}
                  placeholder="Contest starting date"
                  type="date"
                  selected={data.startDate}
                  value={data.startDate}/>

                </Form.Group>
              </Col>
              <Col>
                <Form.Group class="mb-3" controlId="tag">
                  <Form.Control onChange={(e)=>handle(e)} type="text" placeholder="Rule Tag" value={data.tag}/>
                </Form.Group>
              </Col>

            </Row>

            <Row>

              <Col>
                <Button disabled={data.hashtag=="" || data.startDate =="" } onClick={(e) => submit(e)} variant="primary">Create Contest</Button>
              </Col>
              <Col>

                <Row>

                  <Col>
                    <Button disabled={data.value=="" || data.tag =="" } onClick={(e) => addRule(e)} variant="primary">Add Rule</Button>
                  </Col>
                  <Col>
                    <Button disabled={rules == []} onClick={(e) => clearRules(e)} variant="primary">Clear Rules</Button>
                  </Col>

                </Row>

              </Col>

            </Row>

          </Form>
        </Row>

        </Container>
    );
}

export default ContestHandler;
