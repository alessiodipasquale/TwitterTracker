import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayerGroup, Circle} from 'react-leaflet'
import L, { LatLng } from "leaflet";
import icon from "../constants";
import Axios from 'axios';

import { Col, Row, Container, Form, Button, Card} from "react-bootstrap";
import { GeoSearchControl, MapBoxProvider } from "leaflet-geosearch";

import { OpenStreetMapProvider } from 'leaflet-geosearch';
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
  

  map.flyTo(lat, map.getZoom());
  

  const circle = L.circle(lat, data.radius);
  console.log(data.radius)
  setCirc({circ: circle});

  circle.addTo(map);

  getTweetsByLocation(res.y, res.x, data.radius);
};

function getTweetsByLocation(latitude, longitude){
  const url="http://localhost:3000/searchTweetsByLocation";

  Axios.post(url, {latitude,longitude,radius: data.radius, text: data.keyword, count: data.count })
  .then(res => {
      console.log(res)
      setTweets(res.data.data.statuses)
  });
}

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
          <Button onClick={() => SearchField()} variant="primary">Search Tweets</Button>{' '}
        </Col>
      </Row>
    </Form>

    <Row>
      <Col>
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
      <Col>
      <div style={{ height: '85vh', overflow: 'scroll'}}>
        <Card.Body>
           {
        

                
                tweets && tweets.map(tweet=>{
                    return(
                      <Card key={tweet.id}>
                        <Card.Body>

                          <Card.Title  style={{display: 'flex'}}><strong>{tweet.user.name}</strong><div className="text-muted" style={{marginLeft: '6px'}}>@{tweet.user.screen_name} · {new Date(tweet.created_at).toLocaleDateString()}</div></Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">{tweet.place ? (tweet.place.full_name ? tweet.place.full_name : (tweet.place.name ? tweet.place.name : '')) : tweet.user.location}</Card.Subtitle>
                          <Card.Text>{tweet.text}</Card.Text>
                        </Card.Body> 
                      </Card>
                        
                    )
            
                    })
                }
            </Card.Body>
        </div>
    
      </Col>
    </Row>
  
  
</Container>

  );
}

export default GeographicFilter;

