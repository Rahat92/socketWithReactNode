import { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");
function App() {
  const [message, setMessage] = useState({
    name: "",
    message: "",
    time: "",
  });
  const [time, setTime] = useState("");
  const trackTime = (e) => {
    setMessage({ ...message, time: e.target.value });
  };
  const [showMessage, setShowMessage] = useState([]);
  const trackMessage = (e) => {
    setMessage({ ...message, message: e.target.value });
  };
  const trackName = (e) => {
    setMessage({ ...message, name: e.target.value });
  };
  const sendMessage = (e) => {
    e.preventDefault();
    console.log(message);
    socket.emit("send_message", message);
    setMessage({ ...message, message: "" });
  };
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      console.log(msg);
      setShowMessage([...msg]);
    });
    socket.on("start_video", (msg) => {
      // alert(msg)
      setTime(msg);
    });
  }, [socket]);
  console.log(time);
  return (
    <div>
      <ul>
        {showMessage?.map((el) => (
          <li>
            {el.name} => {el.message}
          </li>
        ))}
      </ul>
      {time ? <h1> {time}</h1> : ""}
      <form onSubmit={sendMessage}>
        <div>
          <input
            onChange={trackName}
            type="text"
            placeholder="Your name"
            value={message.name}
          />
        </div>

        <input
          onChange={trackMessage}
          type="text"
          placeholder="message"
          value={message.message}
        />
        {/* <input onChange = {trackDate} type = 'date' value= {''} /> */}
        <input onChange={trackTime} type="time" value={message.time} />
        <button type="submit">Send message</button>
      </form>
    </div>
  );
}

export default App;
