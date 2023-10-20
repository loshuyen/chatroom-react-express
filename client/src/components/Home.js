import '../css/Home.css';
import { useNavigate } from 'react-router-dom';

const Home = ({ username, setUsername, room, setRoom, socket }) => {
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!username || !room) {
      return console.log('Username and room are required!');
    }
    socket.emit('join_room', { room, username });
    navigate('/chat');
  };

  const handleUsernameChange = (e) => {
    setUsername(() => e.target.value);
  };
  const handleRoomChange = (e) => {
    setRoom(() => e.target.value);
  };

  return (
    <div className='container'>
      <div className='formContainer'>
        <h1>ChatHome</h1>
        <input
          className='input'
          placeholder='Username...'
          required
          onChange={handleUsernameChange}
        />

        <select className='input' onChange={handleRoomChange}>
          <option>-- Select Room --</option>
          <option value='ROOM 1'>ROOM 1</option>
          <option value='ROOM 2'>ROOM 2</option>
          <option value='ROOM 3'>ROOM 3</option>
          <option value='ROOM 4'>ROOM 4</option>
        </select>

        <button className='btn btn-secondary' onClick={handleJoin}>
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
