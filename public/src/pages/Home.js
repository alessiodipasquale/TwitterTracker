import React, { Component, useImperativeHandle, useState } from 'react';
import Axios from 'axios';
import { Card, Form, Row, Col, Button, Container, Alert, Modal } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayerGroup, Circle} from 'react-leaflet'
import L, { LatLng } from "leaflet";
import TweetCard from '../components/TweetCard';
import { searchTweet } from '../services/searchTweet-service';
import { GeoSearchControl, MapBoxProvider } from "leaflet-geosearch";

import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { text } from 'body-parser';
import GeneralWordCloud from '../components/GeneralWordCloud';

const provider = new OpenStreetMapProvider();




function Home() {

    const [data, setData] = useState({
        text:"",
        count: 100,
        author: "",
        remove: "",
        since: null,
        until: null,
        city:"",
        radius: 5,
    });

    const [since, setSince] = useState(null);
    const [until, setUntil] = useState(null);

    const [tweets,setTweets] = useState([])

    const [circ,setCirc] = useState({
      circ: null
    });

    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([])

    const [selectedMarker, setSelectedMarker] = useState([])

    const [dataRetrievingInfo, setDataRetrievingInfo] = useState(" ")

    const [showGeneralWordCloud, setShowGeneralWordCloud] = useState(false);

    let center = [41.8933203,12.4829321];

    function handle(e) {
        const newdata = {...data};
        newdata[e.target.id] = e.target.value;
        setData(newdata);
    }


    async function submit(e) {
        e.preventDefault();

        let geocode = null

        const provider = new OpenStreetMapProvider({
          params: {
            email: 'john@example.com', // auth for large number of requests
          },
        });

        console.log(data)
        if(circ.circ != null) {
          console.log('rimuovo')
          circ.circ.removeFrom(map);
        }

        markers.forEach(marker => {
          marker.removeFrom(map);
        })

        if (data.city !== ""){

        const results = await provider.search({ query: data.city });

        const res = results[0];
        const lat = new LatLng(res.y, res.x);

        center = [res.y, res.x]




        map.flyTo(lat, 12);


        const circle = L.circle(lat, data.radius*1000);
        console.log(data.radius)
        setCirc({circ: circle});

        circle.addTo(map);



        geocode = '['+res.x+' '+res.y+' '+data.radius+'km]';
      } else {
        map.flyTo(center, 5)
      }

      const markersList = [];

        searchTweet(data.text, parseInt(data.count),data.author,data.remove, data.since ? new Date(data.since).toISOString() : "" , data.until? new Date(data.until).toISOString() : "", geocode)
        .then(res => {
          setDataRetrievingInfo(res.data.dataRetrievingTime.result_count + " tweets were found in " + res.data.dataRetrievingTime.time / 1000 + " seconds");
          if (!res.data.meta) {
              res.data.tweets.forEach(tweet => {
                if (tweet.placeDetails) {
                  const lat = new LatLng(tweet.placeDetails.geo.bbox[3], tweet.placeDetails.geo.bbox[2]);
                  const marker = L.marker(lat).bindTooltip("@"+tweet.userDetails.username).addTo(map).on('click', (e) => {
                    console.log(e);
                    /*setSelectedMarker(e._latlng);
                    tweets.forEach(tweet => {

                    })*/
                  });
                  markersList.push(marker);
                }
              });
              setTweets(res.data.tweets)
              setMarkers(markersList);
          } else {
            setTweets([]);
          }
        }).catch(err => console.log(err));
    }

    return(
        <Container fluid  style={{padding: '2%'}} >
        <Row>
        <Col lg={6} style={{display: 'flex', flexDirection: 'column'}}>
        <Form style={{flex: '1 auto'}}>
          <Row >
            <Col >
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
            <Col>
            <Form.Group className="mb-3" controlId="city">
              <Form.Control onChange={(e)=>handle(e/*, e.target.value*/)} type="text" placeholder="Insert city" value={data.city}/>
            </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="radius">
                <Form.Control onChange={(e)=>{handle(e/*, parseInt(e.target.value)*/)}} type="number" placeholder="Insert Radius" value={data.radius}/>
              </Form.Group>
            </Col>
          </Row>

          {/*<Row>
            <Alert variant="warning">
              Because of how the twitter api works, the since and before date will only a week back.
            </Alert>
          </Row>*/}

          <Row>
            <Button disabled={data.text=="" && data.author =="" && data.city == ""} onClick={(e) => submit(e)} variant="primary">Search Tweets</Button>
          </Row>

          <Row>
            <Form.Text>{dataRetrievingInfo}</Form.Text>
          </Row>

        </Form>

        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          style={{ flex: "60", width: '100%', borderRadius: '4%', marginTop: '5%'}}
          whenCreated={setMap}
          >

          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

        </MapContainer>


        </Col>
        <Col lg={6}>

           <Card style={{ height: '86vh', overflow: 'scroll'}}>

          {tweets.length == 0 ?
            <Card.Body  style={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: 'center'}}>
            <div >
              <h3 className="text-muted">
                Your Tweets will appear here.<br/> Do a research.
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
          <Row>
              <Col xs={6}></Col>
              <Col xs={3} className="d-grid gap-2">
                <Button style={{marginTop:10, marginLeft:20}} size="lg" disabled variant="primary">General sentiment analysis</Button>
              </Col>
              <Col xs={3} className="d-grid gap-2">
                <Button style={{marginTop:10}} size="lg" onClick={() => setShowGeneralWordCloud(true)} variant="primary">General wordcloud</Button>
              </Col>
          </Row>
        </Row>

        <Modals />

        </Container>
    );

    function Modals() {

      return (
        <>
        <Modal
          size="md"
          show={showGeneralWordCloud}
          onHide={() => setShowGeneralWordCloud(false)}
          aria-labelledby="example-modal-sizes-title-md"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-md">
              General Word Cloud
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <GeneralWordCloud tweets={tweets}></GeneralWordCloud>
          </Modal.Body>
        </Modal>

        </>
      );

    }
}

export default Home
