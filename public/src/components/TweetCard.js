import { useState } from 'react';
import { Card, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { getRetweetersByTweetId, getRetweetsByTweetId } from '../services/retweet-service';




function TweetCard({tweet, showOptions}) {
  const [retweetModalShow, setRetweetModalShow] = useState(false);
  const [retweeterModalShow, setRetweeterModalShow] = useState(false);

  const [retweets, setRetweets] = useState(false);
  const [retweeters, setRetweeters] = useState(false);

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
            <DropdownButton disabled={tweet.retweeted_status} id="dropdown-basic-button" title="Azioni">
              <Dropdown.Item onClick={() => showRetweetModal(tweet)}>Show Retweets</Dropdown.Item>
              <Dropdown.Item onClick={() => showRetweeterModal(tweet)}>Show Retweeters account</Dropdown.Item>
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

  function showRetweeterModal() {
    getRetweetersByTweetId(tweet.id_str)
    .then(res => {
      console.log(res);

      setRetweeters(res.data)
      setRetweeterModalShow(true)
    })
  }

  function Modals() {

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
      </>
    );
  }
  
  
}


export default TweetCard;
