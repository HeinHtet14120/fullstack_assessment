import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import apiRequest from "../../lib/apiRequest";
import './chat.scss';

const Chat = ({ channelId, role }) => {
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState();
  const messageEndRef = useRef();

  console.log("This is channelID :", channelId)

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channelDetails = async () => {
      try {
        const res = await apiRequest.get(`/channel/${channelId}`);
        console.log("This is res : ", res)
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    channelDetails()
  }, [channelId])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await apiRequest.get(`/messages/${channelId}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (channelId) {
      console.log("From FEtch : ", channelId)
      fetchMessages();
    }
  }, [channelId]);

  // Handle new messages
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");

    console.log("this is text : ", text)

    if (!text) return;
    try {
      const res = await apiRequest.post(`/messages/${channelId}`, { text });
      console.log("this is res : ", res)
      setMessages((prev) => [...prev, res.data]);

      // Send the message in real-time via socket
      socket.emit("sendMessage", {
        channelId,
        message: res.data,
        sender: currentUser,
      });

      e.target.reset();
    } catch (err) {
      console.log(err);
    }
  };

  // Listening to incoming messages via socket
  useEffect(() => {
    if (socket) {
      socket.on("getMessage", (data) => {
        if (data.channelId === channelId) {
          setMessages((prev) => [...prev, data.message]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("getMessage"); // Only call off if socket exists
      }
    };
  }, [socket, channelId]);

  return (
    <div className="chat-container">

      {data ? <div>{data.name}</div> : <div>Forex Room</div>
      }

      {
        channelId && <>
          <div className="messages">
            {messages.map((msg) => (
              <div key={msg._id} className={`message ${msg.sender === currentUser.username ? 'self' : ''}`}>
                <span>{msg.sender}: </span>{msg.message}
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
            <form className="message-form" onSubmit={handleSubmit}>
              <input type="text" name="text" className="input-message" placeholder="Type a message..." />
              <button type="submit">Send</button>
            </form>

        </>

      }


    </div>
  );
};

export default Chat;

