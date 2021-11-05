import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayerGroup, Circle} from 'react-leaflet'
import L, { LatLng } from "leaflet";
import icon from "../constants";

import { Col, Row, Container, Form, Button} from "react-bootstrap";
import { GeoSearchControl, MapBoxProvider } from "leaflet-geosearch";

import { OpenStreetMapProvider } from 'leaflet-geosearch';
const provider = new OpenStreetMapProvider();
// add to leaflet


function GeographicFilter() {

  let center = [41.8933203,12.4829321];

  const [data, setData] = useState({
    city:"",
    radius: 3000,
  });

  const [circ,setCirc] = useState({
    circ: null
  });

  const [map, setMap] = useState(null);


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
        <Col style={{display: 'flex', alignItems: 'flex-end', marginBottom: '1rem'}}>
          <Button onClick={() => SearchField()} variant="primary">Search Tweets</Button>{' '}
        </Col>
      </Row>
    </Form>
  <MapContainer
    center={center}
    zoom={13}
    scrollWheelZoom={false}
    style={{ height: "80vh", width: '50%', borderRadius: '3%'}}
    whenCreated={setMap}
  >

    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

  </MapContainer>
    
</Container>

  );
}

export default GeographicFilter;

