import { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");
function App() {
  const [message, setMessage] = useState({
    name: "",
    message: "",
  });
  const [showMessage, setShowMessage] = useState([]);
  const trackMessage = (e) => {
    setMessage({ ...message, message: e.target.value });
  };
  const trackName = (e) => { 
    setMessage({ ...message, name: e.target.value });
  };
  const sendMessage = () => {
    console.log(message);
    socket.emit("send_message", message);
    setMessage({ ...message, message: "" });
  };
  socket.on("receive_message", (msg) => {
    console.log(msg);
    setShowMessage([...showMessage, msg]);
  });

  console.log(showMessage);
  return (
    <div>
      <ul>
        {showMessage.map((el) => (
          <li>{ el.name} => {el.message}</li>
        ))}
      </ul>
      <div>
        <input onChange={trackName} type="text" placeholder="Your name" value={message.name} />
      </div>
      <input onChange={trackMessage} type="text" placeholder="message" value = {message.message} />
      <button onClick={sendMessage} type="button">
        Send message
      </button>
    </div>
  );
}

export default App;
