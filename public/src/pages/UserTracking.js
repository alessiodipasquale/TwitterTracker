import React, { Component, useState, useEffect } from 'react';
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

const provider = new OpenStreetMapProvider();

function UserTracking() {

  

      const socket = socketConnection.instance;


      const [data, setData] = useState(localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : {name: ""})

      const [tweets,setTweets] = useState([]);

      const [usernameSelected, setUsernameSelected] = useState(data.name == "" ? false : true);

      const [lastLatLng, setLastLatLng] = useState(null);

      const [map, setMap] = useState(null);
      const [markers, setMarkers] = useState([]);

      const [showUserNotFound, setShowUserNotFound] = useState(false);

      let center = [41.8933203,12.4829321];

    useEffect(() => {
      
      socket.on("followedUserTweeted", (tweet) => {
        const newTweets = [...tweets];
        
        newTweets.unshift(tweet.data);

        setTweets(newTweets);
        if (map) {

          const waitForAdd = async (m, data) => { 
            await addMarker(m, data); 
            await addRoute(m, data)
          };

           

          waitForAdd(map, tweet.data);
        }
      });

    }, [tweets, markers, map]);

    async function addRoute(m, tweet) {
      if (lastLatLng) {
        console.log(lastLatLng, latlang)
        let latlang = null;

        if (tweet.coordinates) {
          latlang = new LatLng(tweet.coordinates.coordinates[1], tweet.coordinates.coordinates[0]);

        } else if (tweet.place) {

            if (tweet.place.place_type == "city") {
              latlang = await searchCity(tweet.place.name);
            } else {
              latlang = new LatLng(tweet.place.bounding_box.coordinates[0][3][1], tweet.place.bounding_box.coordinates[0][2][0]);
            }
        }

        if (latlang) {
          const route = L.Polyline([lastLatLng, latlang]).addTo(m)
        }
      } else {
        console.log('no latlang')
      }
    }

    async function addMarker(m, tweet) {
      const newMarkers = markers;

      let latlang = null;

      if (tweet.coordinates) {
        latlang = new LatLng(tweet.coordinates.coordinates[1], tweet.coordinates.coordinates[0]);

      } else if (tweet.place) {

          if (tweet.place.place_type == "city") {
            latlang = await searchCity(tweet.place.name);
          } else {
            latlang = new LatLng(tweet.place.bounding_box.coordinates[0][3][1], tweet.place.bounding_box.coordinates[0][2][0]);
          }
      }

      if (latlang) {
        setLastLatLng(latlang);
        const marker = L.marker(latlang).bindTooltip(tweet.text).on('click', (e) => console.log(e)).addTo(m);
        newMarkers.push(marker);
        m.flyTo(latlang, 12);
        setMarkers(newMarkers);
      }
    }

      function handle(e) {
          const newdata = {...data};
          newdata[e.target.id] = e.target.value;
          setData(newdata);
      }

      function clean(clearname) {

        setTweets([]);
        markers.forEach((marker) => {
          marker.removeFrom(map);
        });

        if(clearname){
          localStorage.setItem("data","");
          setData({name: ""});
          setUsernameSelected(false);
        }
      }

      async function submit(e) {
          e.preventDefault();
          setUsernameSelected(true);
          localStorage.setItem('data', JSON.stringify(data))

          httpPost('startFollowingUser', { follow: data.name }).then(res => {
            console.log(res);
            setShowUserNotFound(false);

            clean(false);

          }).catch(err => {
              setShowUserNotFound(true);
              clean();
          });

      }

      async function searchCity(name) {
        const results = await provider.search({ query: name });

        const res = results[0];
        const lat = new LatLng(res.y, res.x);

        return lat;
      }

      return(
          <Container fluid  style={{padding: '2%'}} >
          <Row style={{height: '100%'}}>
            <Col lg={6} style={{display: 'flex', flexDirection: 'column'}}>

              <Form style={{flex: '1 auto'}} hidden={usernameSelected}>
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

              <Row hidden={!usernameSelected}>
                <Col style={{marginBottom: '2%'}}>
                  You are following: <b>{data.name}</b>
                </Col>
                <Col>
                <a href="#" onClick={() => clean(true)}>Stop following</a>
                </Col>
              </Row>

              <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                style={{ flex: "70", width: '100%', borderRadius: '4%', height: '80vh'}}
                whenCreated={(m) => {setMap(m);}}
                >

                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

              </MapContainer>


            </Col>
            <Col >

              <Row>
              {
                  showUserNotFound ? <Alert variant="danger">User could not be found.</Alert> : null
              }
              </Row>

              <Row style={{height: '100%'}}>
               <Card style={{ height: '100%', overflow: 'scroll'}}>

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
                            <TweetCard tweet={tweet} showOptions={false} />
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
