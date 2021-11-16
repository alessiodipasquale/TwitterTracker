import React, { Component, useImperativeHandle, useState } from 'react';
import Axios from 'axios';
import { Card, Form, Row, Col, Button, Container, Alert } from 'react-bootstrap';

import TweetCard from '../components/TweetCard';
import { searchTweet } from '../services/searchTweet-service';

function Home() {
    const [data, setData] = useState({
        text:"",
        count:"",
        author: "",
        remove: "",
    });

    const [since, setSince] = useState(null);
    const [until, setUntil] = useState(null);

    const [tweets,setTweets]=useState([])


    function handle(e) {
        const newdata = {...data};
        newdata[e.target.id] = e.target.value;
        setData(newdata);
    }

    function submit(e) {
        e.preventDefault();
        searchTweet(data.text, parseInt(data.count),data.author,data.remove)
        .then(res => {
            setTweets(res.data.data.statuses)
        });
    }

    return(
        <Container fluid  style={{padding: '2%'}} >
        <Row>
        <Col lg={6}>
        <Form>
          <Row>
            <Col>
              <Form.Group class="mb-3" controlId="text">
                <Form.Control onChange={(e)=>handle(e)} type="text" placeholder="Enter Keywords to look for" value={data.text}/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group class="mb-3" controlId="count">
                <Form.Control onChange={(e)=>handle(e)} type="number" placeholder="Max number of tweets" value={data.count}/>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group class="mb-3" controlId="author">
                <Form.Control onChange={(e)=>handle(e)} type="text" placeholder="Enter Author" value={data.author}/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group class="mb-3" controlId="remove">
                <Form.Control onChange={(e)=>handle(e)} type="text" placeholder="List of words to exclude from search" value={data.remove}/>
              </Form.Group>
            </Col>
          </Row>

          <Row>
          <Col>


              <Form.Group class="mb-3" controlId="since">

                <Form.Control
                onChange={(e)=>handle(e)}
                placeholder="Only get tweets since..."
                type="date"
                selected={data.since}
                value={data.since}/>

              </Form.Group>

            </Col>
            <Col>

            <Form.Group class="mb-3" controlId="until">

              <Form.Control
              onChange={(e)=>handle(e)}
              type="date"
              selected={data.until}
              value={data.until}
              placeholder="Only get tweets up to..."
              />

            </Form.Group>

            </Col>
          </Row>

          <Row>
            <Alert variant="warning">
              Because of how the twitter api works, the since and before date will only a week back.
            </Alert>
          </Row>

          <Row>
            <Button disabled={data.text==""} onClick={(e) => submit(e)} variant="primary">Search Tweets</Button>
          </Row>
        </Form>


        </Col>
        <Col lg={6}>

           <Card style={{ height: '95vh', overflow: 'scroll'}}>

          {tweets.length == 0 ?
            <Card.Body  style={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: 'center'}}>
            <div >
              <h3 className="text-muted">
                I tuoi tweet compariranno qui.<br/> Esegui una rircerca
              </h3>
            </div>
            </Card.Body> :


        <Card.Body>
          {
              tweets && tweets.map(tweet=>{
                  return(
                    <TweetCard tweet={tweet} showOptions={true} />
              )})
          }
         </Card.Body>
          }

        </Card>

        </Col>

        </Row>

        </Container>
    );
}

export default Home
