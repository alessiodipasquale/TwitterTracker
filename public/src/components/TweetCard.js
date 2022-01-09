/**
 * File that contains style and standard functionalities of a single tweets in a group of tweets
 */

import { useState } from 'react';
import { Card, Col, Dropdown, DropdownButton, Modal, Row } from 'react-bootstrap';

import WordCloud from 'react-d3-cloud';

import { getRetweetersByTweetId, getRetweetsByTweetId } from '../services/retweet-service';
import { getSentimentFromTweet } from '../services/sentiment-analysis';
import positiveImg from '../images/happy.png';
import neutralImg from '../images/neutral.png';
import negativeImg from '../images/sad.png';

/**
 * Returns standard characteristics of a single tweet's visualization
 * @param {*} param0 object containing a list of tweets and some options
 * @returns formatted tweets card
 */

function TweetCard({tweet, showOptions}) {
  const [retweetModalShow, setRetweetModalShow] = useState(false);
  const [retweeterModalShow, setRetweeterModalShow] = useState(false);
  const [sentimentModalShow, setSentimentModalShow] = useState(false);

  const [searchableModalShow, setSearchableTextModal] = useState(false);

  const [retweets, setRetweets] = useState(false);
  const [retweeters, setRetweeters] = useState(false);

  const [sentiments, setSentiments] = useState(false);

  return(
    <>
    <Card key={tweet.id} style={{marginBottom: "3px"}}>
      <Card.Body>

        <Card.Title  style={{display: 'flex', justifyContent:"space-between", marginBottom: "15px"}}>
          <div style={{display: 'flex'}}>
            <strong>{tweet.userDetails? tweet.userDetails.name : tweet.user.name}</strong><div className="text-muted" style={{marginLeft: '6px'}}>@{tweet.userDetails? tweet.userDetails.username : tweet.user.screen_name} · {new Date(tweet.created_at).toLocaleString()}</div>
          </div>
          <div>
          { showOptions ?
            <DropdownButton id="dropdown-basic-button" title="Azioni">
              <Dropdown.Item disabled={tweet.text.startsWith('RT')} onClick={() => showRetweetModal()}>Show Retweets</Dropdown.Item>
              <Dropdown.Item disabled={tweet.text.startsWith('RT')} onClick={() => showRetweeterModal()}>Show Retweeters account</Dropdown.Item>
              <Dropdown.Item onClick={() => showSearchableTextModal()}>Search tweet text</Dropdown.Item>
              <Dropdown.Item onClick={() => showSentimentModal()}>Show Sentiment Analysis</Dropdown.Item>
            </DropdownButton>
            : null
          }
          </div>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{tweet.placeDetails ? tweet.placeDetails.full_name : null} </Card.Subtitle>
        <Card.Text>{tweet.text}</Card.Text>
      </Card.Body>
    </Card>

    <Modals />
    </>
  );

  function showRetweetModal() {
    getRetweetsByTweetId(tweet.id)
    .then((res) => {
      console.log(res);
      setRetweets(res.data);
      setRetweetModalShow(true)
    });
  }

  function showSentimentModal() {
    getSentimentFromTweet(tweet.id)
    .then((res) => {
      console.log(res);
      setSentiments(res.data);
      setSentimentModalShow(true);
    });
  }

  function showRetweeterModal() {
    getRetweetersByTweetId(tweet.id)
    .then(res => {
      console.log(res);

      setRetweeters(res.data.data)
      setRetweeterModalShow(true)
    })
  }

  function showSearchableTextModal() {
      setSearchableTextModal(true)
  }

  function Modals() {

    const openInNewTab = (url) => {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
    };

    function searchWord(word) {
        if(word.startsWith('http'))
          openInNewTab(word)
        else
          openInNewTab(`https://www.google.com/search?q=${word}`);
    }

    function makeClickable(paragraph) {

      const words = paragraph.split(/ /g);

      return (
      <WordCloud
        data={words.map(function(w) { return {text:w, value:30}; })}
        fontSize={(word)=> 25}
        onWordClick={(event, d) => {
          console.log(`onWordClick: ${d.text}`);
          searchWord(d.text);
        }}
        />
      );
    }

    return (
      <>
        <Modal
          size="md"
          show={retweeterModalShow}
          onHide={() => setRetweeterModalShow(false)}
          aria-labelledby="example-modal-sizes-title-md"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-md">
              Retweeters
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {
              retweeters && retweeters.map(retweeter=>{
                return(
                  <Card key={retweeter.id} style={{marginBottom: "3px"}}>
                    <Card.Body>
                    <Card.Title>
                      <div style={{display: 'flex', justifyContent: "space-between"}}>
                        <strong>{retweeter.name}</strong><div className="text-muted" style={{marginLeft: '6px'}}>@{retweeter.username}</div>
                      </div>
                  </Card.Title>
                    </Card.Body>
                  </Card>
                );
            })

          }
          </Modal.Body>
        </Modal>

        <Modal
          size="lg"
          show={retweetModalShow}
          onHide={() => setRetweetModalShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Retweets
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {
              retweets && retweets.map(tw=>{
                  return(
                    <TweetCard tweet={tw} showOptions={false}/>
              )})

          }
          </Modal.Body>
        </Modal>

        <Modal
          size="lg"
          show={searchableModalShow}
          onHide={() => setSearchableTextModal(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Click on a word to search it.
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {
            makeClickable(tweet.text)
          }
          </Modal.Body>
        </Modal>

        <Modal
          size="lg"
          show={sentimentModalShow}
          onHide={() => setSentimentModalShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Sentiment Analysis
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col lg={12} style={{display: 'flex', justifyContent: 'center'}}>
                {
                  sentiments ?
                      sentiments.score === 0 ?
                      <img src={neutralImg} alt="neutral" />
                      :
                      sentiments.score > 0 ?
                        <img src={positiveImg} alt="postive" />
                        :
                        <img src={negativeImg} alt="negative" />
                    : ''
                }
              </Col>
              </Row>

              { /*sentiments ?
                sentiments.negative.length != 0 || sentiments.positive.length != 0 ?
                  <Row style={{marginTop: '3%'}}>
                  <Col lg={6}>
                    <Card>
                      <Card.Header>
                        Negative
                      </Card.Header>
                      <Card.Body style= {{display: 'flex', flexFlow: 'wrap'}}>
                      {
                        sentiments.negative && sentiments.negative.map(negativeText=>{
                          return(
                            <Card name="negativeText" id="negativeText" role="text" style={{margin: '6px'}}>
                              <Card.Body style= {{padding: '9px'}}> {negativeText}</Card.Body>
                            </Card>
                          )})
                      }
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={6}>
                  <Card>
                      <Card.Header>
                        Positive
                      </Card.Header>
                      <Card.Body style= {{display: 'flex', flexFlow: 'wrap'}}>
                      {
                        sentiments.positive && sentiments.positive.map(positiveText=>{
                          return(
                            <Card name="positiveText" id="positiveText" role="text" style={{margin: '6px'}}>
                              <Card.Body style= {{padding: '9px'}}> {positiveText}</Card.Body>
                            </Card>
                      )})
                      }
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                :
                <h3 style={{textAlign: 'center'}}>It wasn't possible to make Sentiment Analysis on this tweet.</h3>
                : null
                    */}
          </Modal.Body>
        </Modal>
      </>
    );
  }


}


export default TweetCard;
