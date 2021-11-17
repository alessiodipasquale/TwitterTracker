import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayerGroup, Circle} from 'react-leaflet'
import L, { LatLng } from "leaflet";
import icon from "../constants";
import Axios from 'axios';

import { Col, Row, Container, Form, Button, Card} from "react-bootstrap";
import { GeoSearchControl, MapBoxProvider } from "leaflet-geosearch";

import { OpenStreetMapProvider } from 'leaflet-geosearch';
import TweetCard from "../components/TweetCard";
import { getTweetsByLocation } from "../services/geographic-service";
const provider = new OpenStreetMapProvider();

// add to leaflet


function GeographicFilter() {

  let center = [41.8933203,12.4829321];

  const [data, setData] = useState({
    city:"",
    radius: 3000,
    keyword: "",
    count: 10
  });

  const [circ,setCirc] = useState({
    circ: null
  });

  const [map, setMap] = useState(null);

  const [tweets,setTweets]=useState([])

  const [markers, setMarkers] = useState([])


  function handle(e, value) {
    const newdata = {...data};
    newdata[e.target.id] = value;
    setData(newdata);
}

async function  SearchField  ( ) {
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

  const results = await provider.search({ query: data.city });

  const res = results[0];
  const lat = new LatLng(res.y, res.x);

  center = [res.y, res.x]

  markers.forEach(marker => {
    marker.removeFrom(map);
  })
  

  map.flyTo(lat, map.getZoom());
  

  const circle = L.circle(lat, data.radius);
  console.log(data.radius)
  setCirc({circ: circle});

  circle.addTo(map);

  const markersList = [];

  getTweetsByLocation(res.y, res.x, data.radius, data.keyword, data.count)
  .then(res => {
    setTweets(res.data.data.statuses);

    console.log(res)
    res.data.data.statuses.forEach(tweet => {
      if(tweet.geo) {
        const lat = new LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]);
        const marker = L.marker(lat).bindTooltip("@"+tweet.user.screen_name).addTo(map)/*.on('click', (e) => {
          console.log(e);
          console.log(tweet);

          tweets.find(tw => tw == tweet)
        });*/
        markersList.push(marker);      
      } else {
        if(tweet.place) {
          console.log("Aggiungo place");
          const lat = new LatLng(tweet.place.bounding_box.coordinates[0][0][0],tweet.place.bounding_box.coordinates[0][0][1]);
          const marker = L.marker(lat).bindTooltip("@"+tweet.user.screen_name).addTo(map)/*.on('click', (e) => {
            console.log(tweet);
          });  */
          markersList.push(marker);            
        }
      }
      setMarkers(markersList);
    })
   })
  .catch(err => console.log(err));
};


  return (
    <Container fluid  style={{padding: '2%'}} >
    <Form>
      <Row>
        <Col>
        <Form.Group className="mb-3" controlId="city">
          <Form.Label>Insert city</Form.Label>
          <Form.Control onChange={(e)=>handle(e, e.target.value)} type="text" placeholder="Enter city" value={data.city}/>
        </Form.Group>
        </Col>
        <Col>
        <Form.Group className="mb-3" controlId="radius">
          <Form.Label>Insert radius</Form.Label>
          <Form.Control onChange={(e)=>{handle(e, parseInt(e.target.value))}} type="number" placeholder="Enter Radius" value={data.radius}/>
        </Form.Group>
        </Col>
        <Col>
        <Form.Group className="mb-3" controlId="keyword">
          <Form.Label>Insert Keyword</Form.Label>
          <Form.Control onChange={(e)=>{handle(e, e.target.value)}} type="text" placeholder="Enter Keyword" value={data.keyword}/>
        </Form.Group>
        </Col>
        <Col>
        <Form.Group className="mb-3" controlId="count">
          <Form.Label>Insert count</Form.Label>
          <Form.Control onChange={(e)=>{handle(e, parseInt(e.target.value))}} type="number" placeholder="Enter Number of elements" value={data.count}/>
        </Form.Group>
        </Col>
        <Col style={{display: 'flex', alignItems: 'flex-end', marginBottom: '1rem'}}>
          <Button disabled={data.city == ""} onClick={() => SearchField()} variant="primary">Search Tweets</Button>{' '}
        </Col>
      </Row>
    </Form>

    <Row>
      <Col lg={6}>
          <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "85vh", width: '100%', borderRadius: '4%'}}
          whenCreated={setMap}
          >

          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

        </MapContainer>

      </Col>
      <Col lg={6}>
      <Card style={{ height: '85vh', overflow: 'scroll'}}>
        
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
                   <TweetCard tweet = {tweet} showOptions={true}/>
                     
                 )
         
                 })
             }
         </Card.Body>
          }
            
        </Card>
    
      </Col>
    </Row>
  
  
</Container>

  );
}

export default GeographicFilter;

