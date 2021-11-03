import React, { Component, useImperativeHandle, useState } from 'react';
import Axios from 'axios';
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
            {
                
            tweets && tweets.map(tweet=>{
                return(
                    <div key={tweet.id} style={{alignItems:'center',margin:'20px 60px'}}>
                    <h4>{tweet.text}</h4>
                    <p>{tweet.user.name}</p>
                    <br></br>
                </div>
                )
        
                })
            }
            
        </div>
    );
}

export default Home