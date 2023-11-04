import '../css/Chat.css';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import SendFile from './SendFile';

const Chat = ({ username, room, socket }) => {
  const [message, setMessage] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    //scroll to bottom every time message changes
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [message]);

  useEffect(() => {
    socket.on('message', (msg) => {
      console.log(msg);
      setMessage((state) => [...state, msg]);
    });
    return () => socket.off('message');
  });

  useEffect(() => {
    socket.on('room_users', (users) => {
      console.log(users);
      setUsers(users);
    });
    return () => socket.off('room_users');
  });

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    const text = e.target.message.value;
    socket.emit('sendMessage', { text, username, room });
    e.target.message.value = '';
  };

  const handleLeave = () => {
    navigate('/');
  };

  const renderMessages = (messages) => {
    const createdAt = moment().format('h:mm a');
    const arr = messages.map((element, i) => {
      return (
        <div key={i} ref={bottomRef}>
          <p>
            <span className='message__name'>{element.username}</span>
            <span className='message__meta'>{createdAt}</span>
          </p>
          <p>{element.text}</p>
          <img src={element.imageSrc}></img>
        </div>
      );
    });
    return arr;
  };

  return (
    <div className='chat'>
      <div className='chat__sidebar'>
        <h2 className='room-title'>{room}</h2>
        <h3 className='list-title'>Users:</h3>
        <ul className='users'>
          {users.map((user, i) => (
            <li key={i}>{user.username}</li>
          ))}
        </ul>
        <div className='compose'>
          <button onClick={handleLeave}>Leave</button>
        </div>
      </div>
      <div className='chat__main'>
        <div id='messages' className='chat__messages'>
          <div className='message'>{renderMessages(message)}</div>
        </div>
        <div className='compose'>
          <form id='message-form' onSubmit={handleMessageSubmit}>
            <input
              name='message'
              placeholder='Message'
              autoComplete='off'
              required
            />
            <button>Send</button>
          </form>
          <SendFile username={username} room={room} socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
