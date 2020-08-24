import React, {useState, useEffect} from 'react'; //useState and useEffect are Hooks
import queryString from 'query-string'; // this help us to retrive data from URL 
import io from 'socket.io-client';

import './Chat.css';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';


let socket;

const Chat = ({location})=>{                                        //chat component start
   const [name, setName] = useState('');
   const [room, setRoom] = useState('');
   const [users, setUsers] = useState('');
   const [message, setMessage] = useState('');
   const [messages, setMessages] = useState([]);
   const ENDPOINT = 'localhost:5000';

   useEffect(()=>{
      const { name, room } = queryString.parse(location.search);    //reading user data from URL
      
      socket = io(ENDPOINT);

      setName(name);
      setRoom(room);
      socket.emit('join',{name, room}, (error)=>{
         if(error) {
            alert(error);
          }
      });
      
   },[ENDPOINT,location.search]);

   useEffect(()=>{
      socket.on('message',message=>{
         setMessages(messages => [...messages, message]);
      });
      socket.on("roomData", ({ users }) => {
         setUsers(users);
       });
      
   }, []);

   //Function for sending messages...
   const sendMessage = (event)=>{
      event.preventDefault();
      if(message){
         socket.emit('sendMessage', message, ()=> setMessage('')); //send the message than input field clear
      }
   }

   return (
   <div className='outerContainer'>
      <div className='container'>
       <div className='heading'>Group Chat</div>
       <InfoBar room={room} />
       <Messages messages={messages} name ={name} />
       <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
   </div>
   ) 
}

export default Chat;