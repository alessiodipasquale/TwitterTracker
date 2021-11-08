import { Card } from 'react-bootstrap';

function TweetCard({tweet}) {
  return(

    <Card key={tweet.id} style={{marginBottom: "3px"}}>
      <Card.Body>

        <Card.Title  style={{display: 'flex'}}><strong>{tweet.user.name}</strong><div className="text-muted" style={{marginLeft: '6px'}}>@{tweet.user.screen_name} · {new Date(tweet.created_at).toLocaleDateString()}</div></Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{tweet.place ? (tweet.place.full_name ? tweet.place.full_name : (tweet.place.name ? tweet.place.name : '')) : tweet.user.location}</Card.Subtitle>
        <Card.Text>{tweet.text}</Card.Text>
      </Card.Body>
    </Card>

  );
}

export default TweetCard;
