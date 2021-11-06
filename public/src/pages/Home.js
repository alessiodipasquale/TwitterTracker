import React, { Component, useImperativeHandle, useState } from 'react';
import Axios from 'axios';
import { Card } from 'react-bootstrap';
function Home() {
    const url="http://localhost:3000/searchTweetsByKeyword";
    const [data, setData] = useState({
        text:"",
        count:""
    });
    
    const [tweets,setTweets]=useState([])


    function handle(e) {
        const newdata = {...data};
        newdata[e.target.id] = e.target.value;
        setData(newdata);
        console.log(newdata)
    }

    function submit(e) {
        e.preventDefault();
        Axios.post(url, {
            text: data.text,
            count: parseInt(data.count)
        })
        .then(res => {
            console.log(res.data.data.statuses)
            setTweets(res.data.data.statuses)
        });
    }
    
    return(
        <div>
            <form onSubmit={(e)=> submit(e)}>
                <input onChange={(e)=>handle(e)} value={data.text} id="text" placeholder="Inserisci Keyword da cercare su Twitter" type="text"></input>
                <input onChange={(e)=>handle(e)} value={data.count} id="count" placeholder="Inserisci numero di elementi massimo" type="number"></input>
                <button>Invia</button>
            </form>
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
            
        </div>
    );
}

export default Home