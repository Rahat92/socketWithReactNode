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
  const [timer, setTimer] = useState();
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

    socket.emit("send_message", { ...message, time: myDate });
    setMessage({ ...message, message: "" });
  };
  useEffect(() => {
    let myTime = localStorage.getItem("timer");
    const currentVideo = videoRef.current;

    console.log(myTime);
    console.log(currentVideo.currentTime);
    currentVideo.currentTime = Number(myTime);
  }, []);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setShowMessage([...msg]);
    });
    socket.on("start_video", (msg) => {
      setTime(msg);
    });
    socket.on("count", (msg) => {
      setTimer(msg);
      if (msg === "00:00:00") {
        localStorage.removeItem("timer");
        const currentVideo = videoRef.current;
        currentVideo.currentTime = 0;
        return
      }
      localStorage.setItem("timer", msg.split(":")[2].slice(0, 2));
    });
  }, [socket]);
  // useEffect(() => {
  //   if (!time) {
  //     localStorage.removeItem("timer");
  //   }
  // }, [time]);
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
      {/* {timer ? <h1> {timer}</h1> : "no time"} */}
      <div>
        <video
          ref={videoRef}
          width="520"
          height="540"
          controls
          muted
          style={{ display: `${time ? "block" : "none"}` }}
          autoPlay
        >
          <source src="Assets/videos/parenting.mp4" type="video/mp4" />
        </video>
        {/* <iframe
          width="100%"
          className="aspect-video"
          src="Assets/videos/parenting.mp4"
          title="parenting skill"
          frameborder="0"
          allow="accelerometer; allowFullScreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe> */}
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
