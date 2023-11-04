import { useRef } from 'react';

const SendFile = ({ username, room, socket }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (event) => {
    const fileObj = event.target.files[0];
    if (!fileObj) {
      return;
    }
    const imgUrl = URL.createObjectURL(fileObj);
    socket.emit('sendMessage', { username, room, imageSrc: imgUrl });
    console.log('fileObj is', fileObj);

    event.target.value = null;
  };

  return (
    <button class='btn' onClick={handleClick}>
      <i class='fa fa-paperclip'></i>
      <input
        type={'file'}
        style={{ display: 'none' }}
        ref={inputRef}
        onChange={handleFileChange}
      />
    </button>
  );
};

export default SendFile;
