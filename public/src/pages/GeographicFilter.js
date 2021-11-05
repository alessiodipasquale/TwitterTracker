import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayerGroup, Circle} from 'react-leaflet'
import L from "leaflet";
import icon from "../constants";

import { Col, Row, Container, Form, Button} from "react-bootstrap";

let center = [49.1951, 16.6068];
const radius = 3000;
const fillBlueOptions = { fillColor: 'blue' }

function GeographicFilter() {
  function LocationMarker() {
    const [position, setPosition] = useState(null);
    const [bbox, setBbox] = useState([]);

    const map = useMap();

    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        const circle = L.circle(e.latlng, radius);
        circle.addTo(map);
        setBbox(e.bounds.toBBoxString().split(","));
      });
    }, [map]);
    center = position;
    return position === null ? null : (
      <Marker position={position} icon={icon}>
        <Popup>
          You are here. <br />
          Map bbox: <br />
          <b>Southwest lng</b>: {bbox[0]} <br />
          <b>Southwest lat</b>: {bbox[1]} <br />
          <b>Northeast lng</b>: {bbox[2]} <br />
          <b>Northeast lat</b>: {bbox[3]}
        </Popup>
      </Marker>
    );
  }
  return (
    <Container fluid  style={{padding: '2%'}} >
    <Form>
      <Row>
        <Col>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Insert city</Form.Label>
          <Form.Control type="text" placeholder="Enter city" />
        </Form.Group>
        </Col>
        <Col>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Insert radius</Form.Label>
          <Form.Control type="number" placeholder="Enter Radius" />
        </Form.Group>
        </Col>
        <Col style={{display: 'flex', alignItems: 'flex-end', marginBottom: '1rem'}}>
          <Button variant="primary">Search Tweets</Button>{' '}
        </Col>
      </Row>
    </Form>
  <MapContainer
    center={center}
    zoom={13}
    scrollWheelZoom={false}
    style={{ height: "80vh", width: '50%', borderRadius: '3%'}}
  >
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <LocationMarker />
  </MapContainer>
    
</Container>

  );
}

export default GeographicFilter;

