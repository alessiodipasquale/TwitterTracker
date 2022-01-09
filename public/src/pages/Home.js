import React, { Component } from 'react';
import { Card, Form, Row, Col, Button, Container, Modal } from 'react-bootstrap';
import { MapContainer, TileLayer  } from 'react-leaflet'
import L, { LatLng } from "leaflet";
import TweetCard from '../components/TweetCard';
import { searchTweet } from '../services/searchTweet-service';

import Sentiment from 'sentiment';
import Chart from "react-google-charts";

import { OpenStreetMapProvider } from 'leaflet-geosearch';

import GeneralWordCloud from '../components/GeneralWordCloud';

import positiveImg from '../images/happy.png';
import neutralImg from '../images/neutral.png';
import negativeImg from '../images/sad.png';

/**
 * Component that implements visualization and interactions withe the home page, including filtered 
 * research and geolocalization for tweets.
 */

class Home extends Component {

/**
 * Set state for webpage
 * @param {*} props props for state initialization
 */
  constructor(props) {
    super(props);

    this.center = [41.8933203, 12.4829321];

    this.provider = new OpenStreetMapProvider({
      params: { email: 'john@example.com' },
    });

    this.state = {
      data: {
        text: "",
        count: 100,
        author: "",
        remove: "",
        since: null,
        until: null,
        city: "",
        radius: 5,
      },
      tweets: [],
      circ: { circ: null },
      map: null,
      markers: [],
      selectedMarker: [],
      dataRetrievingInfo: " ",
      showGeneralWordCloud: false,
      showGeneralSentimentAnalysis: false,
      generalSentimentData: {}
    }

    this.handle = this.handle.bind(this);
  }

  /**
   * Standard event handles
   * @param {*} e event
   */
  handle(e) {
    const newdata = { ...this.state.data };
    newdata[e.target.id] = e.target.value;
    this.setState({ data: newdata });
  }

  /**
   * Function that permit to interact with the server at the moment of a research
   * @param {*} e event
   */
  async submit(e) {
    e.preventDefault();
    let geocode = null;
    const data = this.state.data;
    const map = this.state.map;

    if (this.state.circ.circ != null) {
      console.log('rimuovo')
      this.state.circ.circ.removeFrom(map);
    }

    this.state.markers.forEach(marker => {
      marker.removeFrom(map);
    })

    if (data.city !== "") {
      const results = await this.provider.search({ query: data.city });
      const res = results[0];
      const lat = new LatLng(res.y, res.x);

      this.center = [res.y, res.x]
      map.flyTo(lat, 12);
      const circle = L.circle(lat, data.radius * 1000);
      this.setState({ circ: { circ: circle } });
      circle.addTo(map);
      geocode = '[' + res.x + ' ' + res.y + ' ' + data.radius + 'km]';
    } else map.flyTo(this.center, 5)

    const markersList = [];
    searchTweet(data.text, parseInt(data.count), data.author, data.remove, data.since ? new Date(data.since).toISOString() : "", data.until ? new Date(data.until).toISOString() : "", geocode)
      .then(res => {
        this.setState({ dataRetrievingInfo: res.data.dataRetrievingTime.result_count + " tweets were found in " + res.data.dataRetrievingTime.time / 1000 + " seconds" });
        if (res.data.dataRetrievingTime.result_count != 0) {
          res.data.tweets.forEach(tweet => {
            if (tweet.placeDetails) {
              const lat = new LatLng(tweet.placeDetails.geo.bbox[3], tweet.placeDetails.geo.bbox[2]);
              const marker = L.marker(lat).bindTooltip("@" + tweet.userDetails.username).addTo(map).on('click', (event) => {
                console.log(event) //insert operations to do on click
              });
              markersList.push(marker);
            }
          });
          this.setState({ tweets: res.data.tweets })
          this.setState({ marksers: markersList });
        } else {
          this.setState({ tweets: [] })
        }
      }).catch(err => console.log(err));
  }

  /**
   * Wrapper for sentiment analysis visualization
   */
  async doGeneralSentimentAnalysis() {
    let toAnalize = "";
    for (let tweet of this.state.tweets) {
      toAnalize = toAnalize.concat(" ").concat(tweet.text)
    }
    var sentiment = new Sentiment();
    let result = sentiment.analyze(toAnalize, {});
    this.setState({ generalSentimentData: result })
    this.setState({ showGeneralSentimentAnalysis: true })
  }

  /**
   * Function that select the appropriate emoticon based on sentiment analysis result
   * @returns an image from assets
   */
  selectSentimentImg() {

      if (this.state.generalSentimentData !== {}) {
        return '';
      } else if (this.state.generalSentimentData.score === 0) {
        return <img src={neutralImg} alt="neutral" />;
      } else if (this.state.generalSentimentData.score > 0) {
        return <img src={positiveImg} alt="postive" />;
      } else {
        return <img src={negativeImg} alt="negative" />;
      }

  }

  /**
   * Standard renderer function for React Apps
   * @returns JSX code for the page
   */
  render() {
    return (
      <Container fluid style={{ padding: '2%' }} >
        <Row>
          <Col lg={6} style={{ display: 'flex', flexDirection: 'column' }}>
            <Form style={{ flex: '1 auto' }}>
              <Row >
                <Col >
                  <Form.Group class="mb-3" controlId="text">
                    <Form.Control onChange={(e) => this.handle(e)} type="text" placeholder="Enter Keywords to look for" value={this.state.data.text} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group class="mb-3" controlId="count">
                    <Form.Control onChange={(e) => this.handle(e)} type="number" placeholder="Max number of tweets" value={this.state.data.count} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group class="mb-3" controlId="author">
                    <Form.Control onChange={(e) => this.handle(e)} type="text" placeholder="Enter Author" value={this.state.data.author} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group class="mb-3" controlId="remove">
                    <Form.Control onChange={(e) => this.handle(e)} type="text" placeholder="List of words to exclude from search" value={this.state.data.remove} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>


                  <Form.Group class="mb-3" controlId="since">

                    <Form.Control
                      onChange={(e) => this.handle(e)}
                      placeholder="Only get tweets since..."
                      type="date"
                      selected={this.state.data.since}
                      value={this.state.data.since} />

                  </Form.Group>

                </Col>
                <Col>

                  <Form.Group class="mb-3" controlId="until">

                    <Form.Control
                      onChange={(e) => this.handle(e)}
                      type="date"
                      selected={this.state.data.until}
                      value={this.state.data.until}
                      placeholder="Only get tweets up to..."
                    />

                  </Form.Group>

                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="city">
                    <Form.Control onChange={(e) => this.handle(e)} type="text" placeholder="Insert city" value={this.state.data.city} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="radius">
                    <Form.Control onChange={(e) => { this.handle(e) }} type="number" placeholder="Insert Radius" value={this.state.data.radius} />
                  </Form.Group>
                </Col>
              </Row>

              {/*<Row>
              <Alert variant="warning">
                Because of how the twitter api works, the since and before date will only a week back.
              </Alert>
            </Row>*/}

              <Row>
                <Button disabled={this.state.data.text == "" && this.state.data.author == "" && this.state.data.city == ""} onClick={(e) => this.submit(e)} variant="primary">Search Tweets</Button>
              </Row>

              <Row>
                <Form.Text>{this.state.dataRetrievingInfo}</Form.Text>
              </Row>

            </Form>

            <MapContainer
              center={this.center}
              zoom={13}
              scrollWheelZoom={false}
              style={{ flex: "60", width: '100%', borderRadius: '4%', marginTop: '5%' }}
              whenCreated={(map)=>this.setState({map})}
            >

              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

            </MapContainer>
          </Col>
          <Col lg={6}>
            <Row>
              <Card style={{ height: '84vh', overflow: 'scroll' }}>
                {this.state.tweets.length == 0 ?
                  <Card.Body style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: 'center' }}>
                    <div >
                      <h3 className="text-muted">
                        Your Tweets will appear here.<br /> Do a research.
                      </h3>
                    </div>
                  </Card.Body> :
                  <Card.Body>
                    {
                      this.state.tweets && this.state.tweets.slice(0, 150).map(tweet => {
                        return (<TweetCard tweet={tweet} showOptions={true} />)
                      })
                    }
                  </Card.Body>
                }

              </Card>
            </Row>
            <Row>
              <Col className="d-grid gap-2">
                <Button style={{ marginTop: 10, marginLeft: 20 }} size="lg" disabled={this.state.tweets.length === 0} onClick={() => this.doGeneralSentimentAnalysis()} variant="primary">General sentiment analysis</Button>
              </Col>
              <Col className="d-grid gap-2">
                <Button style={{ marginTop: 10 }} size="lg" disabled={this.state.tweets.length === 0} onClick={() => this.setState({showGeneralWordCloud:true})} variant="primary">General wordcloud</Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <>
        <Modal
          size="lg"
          show={this.state.showGeneralWordCloud}
          onHide={() => this.setState({ showGeneralWordCloud: false })}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-md">
              General Word Cloud
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <GeneralWordCloud tweets={this.state.tweets}></GeneralWordCloud>
          </Modal.Body>
        </Modal>

        <Modal
          size="lg"
          show={this.state.showGeneralSentimentAnalysis}
          onHide={() => this.setState({ showGeneralSentimentAnalysis: false })}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-md">
              General Sentiment analysis
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col lg={12} style={{ display: 'flex', justifyContent: 'center' }}>
                {
                  /*this.state.generalSentimentData !== {} ?
                  this.state.generalSentimentData.score === 0 ?
                      <img src={neutralImg} alt="neutral" />
                      :
                      this.state.generalSentimentData.score > 0 ?
                        <img src={positiveImg} alt="postive" />
                        :
                        <img src={negativeImg} alt="negative" />
                    : ''*/
                    this.selectSentimentImg()
                }
              </Col>
            </Row>
            {
              this.state.tweets.length !== 0 && this.state.showGeneralSentimentAnalysis ?
                <Row>
                  <p style={{ fontSize: 20, marginTop: "6%" }}>Analyzed words: {this.state.generalSentimentData.tokens.length}</p>
                  <p style={{ fontSize: 20 }}>Resulting pie chart:</p>
                  <Chart
                    style={{ marginLeft: "10%" }}
                    width={"90%"}
                    height={'400px'}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={[["type", "occurrences"], ["negative", this.state.generalSentimentData.negative.length], ["positive", this.state.generalSentimentData.positive.length]]}
                    options={{
                      title: 'Sentiment analysis result:',
                      sliceVisibilityThreshold: 0, // 0%
                    }}
                    rootProps={{ 'data-testid': '7' }}
                  />
                </Row> : null
            }
          </Modal.Body>
        </Modal>
      </>
      </Container>
    );
  }
}
export default Home;
