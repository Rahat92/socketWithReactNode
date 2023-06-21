import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { readableDate } from "./readableDate";
const socket = io.connect("http://localhost:3001");
function App() {
  const videoRef = useRef();
  const [message, setMessage] = useState({
    name: "",
    message: "",
    time: "",
  });
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const trackTime = (e) => {
    setMessage({ ...message, time: e.target.value });
  };
  const trackDate = (e) => {
    setDate(e.target.value);
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
    const inputYear = date?.split("-")[0];
    const inputMonth = date?.split("-")[1];
    const inputDay = date?.split("-")[2];
    let myDate = new Date(
      `${inputMonth} ${inputDay}, ${inputYear} ${message.time}`
    );
    // console.log(myDate);
    // myDate = readableDate(date);
    // console.log(myDate);
    // console.log(message);
    socket.emit("send_message", { ...message, time: myDate });
    setMessage({ ...message, message: "" });
  };
  console.log(videoRef);
  useEffect(() => {
    const currentVideo = videoRef.current;
    currentVideo.currentTime = 30;
  }, []);
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setShowMessage([...msg]);
    });
    socket.on("start_video", (msg) => {
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
      <div>
        <video
          ref={videoRef}
          width="320"
          height="240"
          controls
          muted
          style={{ display: `${time ? "block" : ""}` }}
          autoPlay
        >
          <source src="Assets/videos/parenting.mp4" type="video/mp4" />
        </video>
        <iframe
          width="100%"
          className="aspect-video"
          src="Assets/videos/parenting.mp4"
          title="parenting skill"
          frameborder="0"
          allow="accelerometer; allowFullScreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
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
        <div>
          <input onChange={trackDate} type="date" />
        </div>
        <div>
          <input onChange={trackTime} type="time" value={message.time} />
        </div>
        <div>
          <button type="submit">Send message</button>
        </div>
      </form>
    </div>
  );
}

export default App;
