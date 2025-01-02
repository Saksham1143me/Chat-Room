import { useEffect, useState, useRef } from "react";
import queryString from 'query-string';
import { useLocation } from "react-router-dom";
import io from 'socket.io-client';
import './chat.css';
import InfoBar from "../infobar/infoBar";
import Input from "../input/input";
import Messages from "../messages/messages";
import TextContainer from "../textContainer/textContainer";

function Chat() {
  const location = useLocation();
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users,setUsers] = useState([]);

  const socketRef = useRef(); // useRef for storing socket instance
  const ENDPOINT = 'https://chat-room-server-five.vercel.app'; // Include protocol

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    if (name && room) {
      socketRef.current = io(ENDPOINT, {
        withCredentials: true, // Send cookies with the request
        transports: ['websocket', 'polling'], // Use both WebSocket and polling
      });
// Set socket reference

      setName(name);
      setRoom(room);

      socketRef.current.emit("join", { name, room }, (response) => {
        if (response && response.error) {
          alert(response.error); // Display error message if it exists
        } else {
          console.log("Successfully joined!");
        }
      });
      socketRef.current.on('connect', () => {
        // console.log('Connected with socket ID:', socketRef.current.id);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off();
        socketRef.current.disconnect();
      }
    };
  }, [location.search]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
      socketRef.current.on("roomData", ({ users }) => {
        setUsers(users);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('message');
      }
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message && socketRef.current) {
      // console.log(message);
      socketRef.current.emit('sendMessage', message, () => setMessage(''));
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name}/>
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;
