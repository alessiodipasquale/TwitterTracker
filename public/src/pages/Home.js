import React, { Component, useImperativeHandle, useState } from 'react';
import Axios from 'axios';
import { Card, Form, Row, Col, Button, Container } from 'react-bootstrap';

import TweetCard from '../components/TweetCard';

function Home() {
    const url="http://localhost:3000/searchTweetsByKeyword";
    const [data, setData] = useState({
        text:"",
        count:"",
        author: "",
        remove: "",
    });

    const [tweets,setTweets]=useState([])


    function handle(e) {
        const newdata = {...data};
        newdata[e.target.id] = e.target.value;
        setData(newdata);
        console.log(newdata)
    }

    function submit(e) {
        e.preventDefault();
        Axios.post(url, {
            text: data.text,
            count: parseInt(data.count),
            author: data.author,
            remove: data.remove,
        })
        .then(res => {
            console.log(res.data.data.statuses)
            setTweets(res.data.data.statuses)
        });
    }

    return(
        <Container fluid  style={{padding: '2%'}} >
        <Row>
        <Col>
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
            <Button onClick={(e) => submit(e)} variant="primary">Search Tweets</Button>
          </Row>
        </Form>
        </Col>
        <Col>

            <div style={{ height: '85vh', overflow: 'scroll'}}>
        <Card.Body>
           {
                tweets && tweets.map(tweet=>{
                    return <TweetCard tweet={tweet} />;
                })
            }
            </Card.Body>
        </div>

        </Col>

        </Row>

        </Container>
    );
}

export default Home
