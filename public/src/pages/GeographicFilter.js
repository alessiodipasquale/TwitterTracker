import React, { Component} from "react";
import { MapContainer, TileLayer} from 'react-leaflet'
import L, { LatLng } from "leaflet";

import { Col, Row, Container, Form, Button, Card} from "react-bootstrap";

import { OpenStreetMapProvider } from 'leaflet-geosearch';
import TweetCard from "../components/TweetCard";
import { getTweetsByLocation } from "../services/geographic-service";

// add to leaflet

class GeographicFilter extends Component {

  center = [41.8933203,12.4829321];

  constructor(props) {
    super(props)
    this.state = {
      data: {
        city:"",
        radius: 3000,
        keyword: "",
        count: 10,
      },
      circ: null,
      map: null,
      tweets: [],
      markers: []
    }
  }



  handle(e, value) {
    const newdata = {...this.state.data};
    newdata[e.target.id] = value;
    this.setState({ data: newdata });
  }

  async SearchField  ( ) {
  const provider = new OpenStreetMapProvider({
    params: {
      email: 'john@example.com', // auth for large number of requests
    },
  });
  
  const circ = this.state.circ;
  const data = this.state.data;
  const map = this.state.map;
  const markers = this.state.markers;
  
  if(circ.circ != null) {
    console.log('rimuovo')
    circ.circ.removeFrom(map);
  }

  const results = await provider.search({ query: data.city });

  const res = results[0];
  const lat = new LatLng(res.y, res.x);

  this.center = [res.y, res.x]

  markers.forEach(marker => {
    marker.removeFrom(map);
  })
  

  map.flyTo(lat, map.getZoom());
  

  const circle = L.circle(lat, data.radius);
  console.log(data.radius)
  this.setState({circ: circle});

  circle.addTo(map);

  const markersList = [];

  getTweetsByLocation(res.y, res.x, data.radius, data.keyword, data.count)
  .then(response => {
    this.setState({tweets: response.data.data.statuses});

    console.log(response)
    response.data.data.statuses.forEach(tweet => {
      if(tweet.geo) {
        const latitude = new LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]);
        const marker = L.marker(latitude).bindTooltip("@"+tweet.user.screen_name).addTo(map)/*.on('click', (e) => {
          console.log(e);
          console.log(tweet);

          tweets.find(tw => tw == tweet)
        });*/
        markersList.push(marker);      
      } else {
        if(tweet.place) {
          console.log("Aggiungo place");
          const latitude = new LatLng(tweet.place.bounding_box.coordinates[0][0][0],tweet.place.bounding_box.coordinates[0][0][1]);
          const marker = L.marker(latitude).bindTooltip("@"+tweet.user.screen_name).addTo(map)/*.on('click', (e) => {
            console.log(tweet);
          });  */
          markersList.push(marker);            
        }
      }
      this.setState({markers: markersList});
    })
   })
  .catch(err => console.log(err));
}


  render() {
    return (
      <Container fluid  style={{padding: '2%'}} >
      <Form>
        <Row>
          <Col>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Insert city</Form.Label>
            <Form.Control onChange={(e)=>this.handle(e, e.target.value)} type="text" placeholder="Enter city" value={this.state.data.city}/>
          </Form.Group>
          </Col>
          <Col>
          <Form.Group className="mb-3" controlId="radius">
            <Form.Label>Insert radius</Form.Label>
            <Form.Control onChange={(e)=>{this.handle(e, parseInt(e.target.value))}} type="number" placeholder="Enter Radius" value={this.state.data.radius}/>
          </Form.Group>
          </Col>
          <Col>
          <Form.Group className="mb-3" controlId="keyword">
            <Form.Label>Insert Keyword</Form.Label>
            <Form.Control onChange={(e)=>{this.handle(e, e.target.value)}} type="text" placeholder="Enter Keyword" value={this.state.data.keyword}/>
          </Form.Group>
          </Col>
          <Col>
          <Form.Group className="mb-3" controlId="count">
            <Form.Label>Insert count</Form.Label>
            <Form.Control onChange={(e)=>{this.handle(e, parseInt(e.target.value))}} type="number" placeholder="Enter Number of elements" value={this.state.data.count}/>
          </Form.Group>
          </Col>
          <Col style={{display: 'flex', alignItems: 'flex-end', marginBottom: '1rem'}}>
            <Button disabled={this.data.city == ""} onClick={() => this.SearchField()} variant="primary">Search Tweets</Button>{' '}
          </Col>
        </Row>
      </Form>

      <Row>
        <Col lg={6}>
            <MapContainer
            center={this.center}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "85vh", width: '100%', borderRadius: '4%'}}
            whenCreated={(map) => this.setState({map: map})}
            >

            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

          </MapContainer>

        </Col>
        <Col lg={6}>
        <Card style={{ height: '85vh', overflow: 'scroll'}}>
          
            {this.state.tweets.length == 0 ?
              <Card.Body  style={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: 'center'}}>
              <div >
                <h3 className="text-muted">
                  Your Tweets will appear here.<br/> Do a research.
                </h3>
              </div>
              </Card.Body> :


          <Card.Body>
          {
      

              
              this.state.tweets && this.state.tweets.map(tweet=>{
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
}

export default GeographicFilter;

