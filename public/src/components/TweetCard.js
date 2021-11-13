import { useState } from 'react';
import { Card, Col, Dropdown, DropdownButton, Modal, Row } from 'react-bootstrap';
import { getRetweetersByTweetId, getRetweetsByTweetId } from '../services/retweet-service';
import { getSentimentFromTweet } from '../services/sentiment-analysis';
import positiveImg from '../images/happy.png';
import neutralImg from '../images/neutral.png';
import negativeImg from '../images/sad.png';



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
            <strong>{tweet.user.name}</strong><div className="text-muted" style={{marginLeft: '6px'}}>@{tweet.user.screen_name} · {new Date(tweet.created_at).toLocaleString()}</div>
          </div>
          <div>
          { showOptions ?
            <DropdownButton id="dropdown-basic-button" title="Azioni">
              <Dropdown.Item disabled={tweet.retweeted_status} onClick={() => showRetweetModal(tweet)}>Show Retweets</Dropdown.Item>
              <Dropdown.Item disabled={tweet.retweeted_status} onClick={() => showRetweeterModal(tweet)}>Show Retweeters account</Dropdown.Item>
              <Dropdown.Item onClick={() => showSearchableTextModal(tweet)}>Search tweet text</Dropdown.Item>
              <Dropdown.Item onClick={() => showSentimentModal(tweet)}>Show Sentiment Analysis</Dropdown.Item>
            </DropdownButton>
            : null
          }
          </div>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{tweet.place ? (tweet.place.full_name ? tweet.place.full_name : (tweet.place.name ? tweet.place.name : '')) : tweet.user.location}</Card.Subtitle>
        <Card.Text>{tweet.text}</Card.Text>
      </Card.Body>
    </Card>

    <Modals />
    </>
  );

  function showRetweetModal() {
    getRetweetsByTweetId(tweet.id_str)
    .then((res) => {
      console.log(res);
      setRetweets(res.data.data);
      setRetweetModalShow(true)
    });
  }
  
  function showSentimentModal() {
    getSentimentFromTweet(tweet.id_str)
    .then((res) => {
      console.log(res);
      setSentiments(res.data);
      setSentimentModalShow(true);
    });
  }

  function showRetweeterModal() {
    getRetweetersByTweetId(tweet.id_str)
    .then(res => {
      console.log(res);

      setRetweeters(res.data)
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

    const searchWord = (word) => {
      return (() => {
        if(word.startsWith('http')) 
          openInNewTab(word)
        else
          openInNewTab(`https://www.google.com/search?q=${word}`);
      });
    };

    function makeClickable(paragraph) {
      const words = paragraph.split(/ /g);
      return words.map(w =>
        <Card name="searchButton" id="searchButton" role="button" style={{margin: '6px', cursor: 'pointer'}}onClick={searchWord(w)}> 
          <Card.Body style= {{padding: '9px'}}> {w}</Card.Body> 
        </Card>
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
                        <strong>{retweeter.name}</strong><div className="text-muted" style={{marginLeft: '6px'}}>@{retweeter.screen_name}</div>
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
              retweets && retweets.map(tweet=>{
                  return(
                    <TweetCard tweet={tweet} showOptions={false}/>
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
          <Modal.Body style={{display: 'flex', flexFlow: 'wrap'}}>
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

              {sentiments ?
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
              }
          </Modal.Body>
        </Modal>
      </>
    );
  }


}


export default TweetCard;
