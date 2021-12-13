import React, { Component, useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { Card, Form, Row, Col, Button, Container, Alert, Modal } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayerGroup, Circle} from 'react-leaflet'
import L, { LatLng } from "leaflet";
import TweetCard from '../components/TweetCard';
import { searchTweet } from '../services/searchTweet-service';
import { GeoSearchControl, MapBoxProvider } from "leaflet-geosearch";

import { httpPost } from "../services/http-service";

import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { text } from 'body-parser';
import GeneralWordCloud from '../components/GeneralWordCloud';

import {socketConnection} from '../services/socket-service';

function UserTracking() {

      const socket = socketConnection.instance;

      const [data, setData] = useState({
        name: "",
      })

      const [tweets,setTweets] = useState([]);

      const [map, setMap] = useState(null);
      const [markers, setMarkers] = useState([])

      let center = [41.8933203,12.4829321];

    useEffect(() => {

      socket.on("followedUserTweeted", (tweet) => {
        const newTweets = [...tweets];
        newTweets.unshift(tweet.data);

        setTweets(newTweets);
        if (map) addMarker(map, tweet.data);
      });

    }, [tweets, markers]);

    function addMarker(m, tweet) {
      const newMarkers = markers;

      let latlang = null;

      if (tweet.coordinates) {
        latlang = new LatLng(tweet.coordinates.coordinates[1], tweet.coordinates.coordinates[0]);

      } else if (tweet.place) {

         latlang = new LatLng(tweet.place.bounding_box.coordinates[0][3][1], tweet.place.bounding_box.coordinates[0][2][0]);

      }

      const marker = L.marker(latlang).bindTooltip("@"+tweet.user.name).on('click', (e) => console.log(e)).addTo(m);
      newMarkers.push(marker);

      m.flyTo(latlang, 12);
      setMarkers(newMarkers);
    }

      function handle(e) {
          const newdata = {...data};
          newdata[e.target.id] = e.target.value;
          setData(newdata);
      }

      async function submit(e) {
          e.preventDefault();

          httpPost('startFollowingUser', { follow: data.name }).then(res => {
            console.log(res);
            setTweets([]);

            markers.forEach((marker) => {
              marker.removeFrom(map);
            });

            setMarkers([]);

          }).catch(err => {console.log(err)});

      }

      return(
          <Container fluid  style={{padding: '2%'}} >
          <Row>
            <Col lg={6} style={{display: 'flex', flexDirection: 'column'}}>

              <Form style={{flex: '1 auto'}}>
                <Row >
                  <Col >
                    <Form.Group class="mb-3" controlId="name">
                      <Form.Control onChange={(e)=> handle(e)} type="text" placeholder="Enter user name" value={data.name}/>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Button disabled={data.name == ""} onClick={(e) => submit(e)} variant="primary">Follow User</Button>
                  </Col>
                </Row>

              </Form>

              <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                style={{ flex: "60", width: '100%', borderRadius: '4%'}}
                whenCreated={(m) => {setMap(m);}}
                >

                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

              </MapContainer>


            </Col>
            <Col >

              <Row></Row>

              <Row>
               <Card style={{ height: '80vh', overflow: 'scroll', marginTop: '14%'}}>

                {tweets.length == 0 ?
                  <Card.Body  style={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: 'center'}}>
                  <div >
                    <h3 className="text-muted">
                      Tweets from the user will appear here.
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
              </Row>

            </Col>

          </Row>

          </Container>
      );


}

export default UserTracking;
