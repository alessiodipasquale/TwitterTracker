import L, { LatLng } from "leaflet";
import TweetCard from '../components/TweetCard';
import React, { Component} from 'react';
import { Card, Form, Row, Col, Button, Container, Alert} from 'react-bootstrap';
import {socketConnection} from '../services/socket-service'
import { MapContainer, TileLayer} from 'react-leaflet'
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { httpPost } from "../services/http-service";

const provider = new OpenStreetMapProvider();

class UserTracking extends Component {

    constructor(props) {
        super(props);

        this.center = [41.8933203, 12.4829321];

        this.state=  { 
          data: {
            name: ""
          },
          tweets: [],
          usernameSelected: false,
          lastLatLng: {
            lat: "",
            lng: ""
          },
          map: null,
          markers: [],
          showUserNotFound: false
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){ 
      socketConnection.instance.on("followedUserTweeted",async (tweet) => {
        const newTweets = [...this.state.tweets];
        newTweets.unshift(tweet.data);
        this.setState({tweets:newTweets})
        if(this.state.map != null){
          const coordinates = await this.addMarker(this.state.map, tweet.data);
          await this.addRoute(this.state.map, tweet.data, coordinates);
        }
      });
    }

    handleChange(ev) {
      const newContest = {...this.state.contest}
      newContest[ev.target.id] = ev.target.value;
      this.setState({contest: newContest});
    }

    async addMarker(map, tweet) {
      const newMarkers = this.state.markers;
      let latlang = null;

      if (tweet.coordinates) { 
        latlang = new LatLng(tweet.coordinates.coordinates[1], tweet.coordinates.coordinates[0]);
      }else{
        if (tweet.place.place_type == "city") latlang = await this.searchCity(tweet.place.name);
        else latlang = new LatLng(tweet.place.bounding_box.coordinates[0][3][1], tweet.place.bounding_box.coordinates[0][2][0]);
      }
      if (latlang) {
        const marker = L.marker(latlang).bindTooltip(tweet.text).on('click', (event) => console.log(event)).addTo(map);
        newMarkers.push(marker);
        map.flyTo(latlang, 12);
        this.setState({markers: newMarkers});
        return latlang;
      }
    }

    async addRoute(map, tweet, coordinates) {
      const last = this.state.lastLatLng;
      console.log("a",last)

      if (last.lat !== "") {
          const convertedOld = [last.lat, last.lng]
          const convertedNew = [coordinates.lat, coordinates.lng]
          console.log([convertedOld, convertedNew]);
          const route = new L.Polyline([convertedOld, convertedNew],{color: 'red'})
          route.addTo(map);
      } else {
        console.log('no latlang')
      }
      this.setState({lastLatLng: {lat: coordinates.lat,lng: coordinates.lng} });
    }

    async searchCity(name) {
      const results = await provider.search({ query: name });
      const res = results[0];
      return (new LatLng(res.y, res.x));
    }

    handle(ev) {
      const newdata = { ...this.state.data };
      newdata[ev.target.id] = ev.target.value;
      this.setState({data: newdata});
    }

    clean(clearname) {

      this.setState({tweets: []});
      this.state.markers.forEach((marker) => {
        marker.removeFrom(this.state.map);
      });
  
      if (clearname) {
        localStorage.setItem("data", "");
        this.setState({data:{ name: "" }});
        this.setState({usernameSelected:false});
      }
    }
  
    async submit(ev) {
      ev.preventDefault();
      this.setState({usernameSelected:true});
      localStorage.setItem('data', JSON.stringify(this.state.data))
  
      httpPost('startFollowingUser', { follow: this.state.data.name }).then(res => {
        console.log(res);
        this.setState({showUserNotFound:false});
  
        this.clean(false);
  
      }).catch(err => {
        this.setState({showUserNotFound:true});
        this.clean();
      });
  
    }
  
    render() {
      return (
        <Container fluid style={{ padding: '2%' }} >
          <Row style={{ height: '100%' }}>
            <Col lg={6} style={{ display: 'flex', flexDirection: 'column' }}>
              <Form style={{ flex: '1 auto' }} hidden={this.state.usernameSelected}>
                <Row >
                  <Col >
                    <Form.Group class="mb-3" controlId="name">
                      <Form.Control onChange={(e) => this.handle(e)} type="text" placeholder="Enter user name" value={this.state.data.name} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Button disabled={this.state.data.name == ""} onClick={(e) => this.submit(e)} variant="primary">Follow User</Button>
                  </Col>
                </Row>
              </Form>
              <Row hidden={!this.state.usernameSelected}>
                <Col style={{ marginBottom: '2%' }}>
                  You are following: <b>{this.state.data.name}</b>
                </Col>
                <Col>
                  <a href="#" onClick={() => this.clean(true)}>Stop following</a>
                </Col>
              </Row>
              <MapContainer
                center={this.center}
                zoom={13}
                scrollWheelZoom={false}
                style={{ flex: "70", width: '100%', borderRadius: '4%', height: '80vh' }}
                whenCreated={(m) => { this.setState({map:m}); }}
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
                  this.state.showUserNotFound ? <Alert variant="danger">User could not be found.</Alert> : null
                }
              </Row>
              <Row style={{ height: '100%' }}>
                <Card style={{ height: '100%', overflow: 'scroll' }}>
                  {this.state.tweets.length == 0 ?
                    <Card.Body style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: 'center' }}>
                      <div >
                        <h3 className="text-muted">
                          Tweets from the user will appear here.
                        </h3>
                      </div>
                    </Card.Body> :
                    <Card.Body>
                      {
                        this.state.tweets && this.state.tweets.map(tweet => {
                          return (
                            <TweetCard tweet={tweet} showOptions={false} />
                          )
                        })
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

    
    
}

export default UserTracking;