import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import Home from './Home';
import Chat from './Chat';

const socket = io('http://localhost:8000', {
  autoConnect: false,
});

const App = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <Home
              username={username}
              room={room}
              setUsername={setUsername}
              setRoom={setRoom}
              socket={socket}
            />
          }
        />
        <Route
          path='/chat'
          element={
            <Chat
              username={username}
              room={room}
              socket={socket}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
