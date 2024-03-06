import React, { useEffect, useState, useMemo } from "react";
import {io} from "socket.io-client";
import sentMusic from '../assets/music/sent.mp3';
import recvMusic from '../assets/music/rece.mp3'; 

const Home = () => {
  const socket = useMemo(() => io("http://localhost:3000",{withCredentials: true,}), []);
  
  const messages_talk = document.getElementById('messages_talk');
  const user_msg = document.createElement('div');
  const other_msg = document.createElement('div');
  user_msg.classList.add('user_msg');
  other_msg.classList.add('other_msg');
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientMsg, setClientMsg] = useState("");
  const [callFunc, setCallFunc] = useState(false);
  let user;
  let client;
  const submitHandler = (e) => {
    e.preventDefault();
    socket.emit("user-message", {msg, name});
    user = `<h4> ${name} </h4>
                <p>${msg}</p>
                `;
    user_msg.innerHTML = user;
    console.log('In user: ', messages_talk);
    messages_talk.appendChild(user_msg);
    let sentMusicPlay = new Audio(sentMusic);
    sentMusicPlay.play();
    setMsg("");
  };

  useEffect(() => {
    setName(prompt('Enter your name: '));
    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("all-user-message", (data) => {
        console.log(data.name, data.msg);
        setClientName(data.name);
        setClientMsg(data.msg);
        setCallFunc(true);
        setMessages((messages) => [...messages, data]);
      });

    return () => {  
      socket.on("disconnet", () => {
        console.log("User Got Disconnect");
      });
    };
  }, []);

  const appendClientMsg = () => {
    client = `<h4> ${clientName} </h4>
    <p> ${clientMsg} </p>
    <br/>`;
      other_msg.innerHTML = client;
      console.log('In fucn: ', other_msg);
      console.log('Append tag: ', messages_talk)
      messages_talk.appendChild(other_msg);
      const recvMusicPlay = new Audio(recvMusic);
      recvMusicPlay.play();
  }


  if(callFunc){
    appendClientMsg();
    setCallFunc(false);
  }
  
  return (
    <>
      <div className="head">
        <h2>Kuch baate 💕</h2>
      </div>

      <div className="container">
        <div id="messages_talk">

        </div>

        <form onSubmit={submitHandler} className="input_form">
          <input type="text" value={msg} placeholder="Bol do jo bolna h...." onChange={(e) => setMsg(e.target.value)}/>
          <button type="submit" className="btn">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Home;
