import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import apiRequest from "../../lib/apiRequest";
import useNotificationStore from "../../lib/notificationStore";
import './chat.scss';
import { format } from 'timeago.js'

const Chat = ({ channelId, role }) => {
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState({});
  const messageEndRef = useRef();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channelDetails = async () => {
      try {
        const res = await apiRequest.get(`/channel/${channelId}`);
        console.log("This is res : ", res.data)
        setData(res.data);

        console.log("this is data :", data)

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
        console.log("This is messages : ", messages)
      } catch (err) {
        console.log(err);
      }
    };

    if (channelId) {
      fetchMessages();
    }
  }, [channelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
      const res = await apiRequest.post(`/messages/${channelId}`, { text });

      setMessages((prev) => [...prev, { ...res.data, senderId: currentUser.id }]);

      socket.emit("sendMessage", {
        channelId,
        message: { ...res.data, senderId: currentUser.id },
      });

      e.target.reset();
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    if (socket) {
      socket.on("getMessage", (data) => {
        if (data.channelId === channelId) {
          setMessages((prev) => [...prev, data.message]);
        }

        if (data.message.senderId !== currentUser.id) {

          console.log("this is data noti : ", data)
          addNotification({
            sender: data.message.sender,
            channelId: data.channelId
          });

        }
      });
    }

    return () => {
      if (socket) {
        socket.off("getMessage");
      }
    };
  }, [socket, channelId, addNotification]);

  return (
    <div className="chat-container">

      {data && data.channel ? (
        <div className="channel-header">
          <span className="channel-name">{data.channel.name}</span>
        </div>
      ) : (
        <div className="channel-header">
          <span className="default-room">Forex Room</span>
        </div>
      )}



      {
        channelId && <>
          <div className="messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.senderId === currentUser.id ? 'self' : ''}`}>
                <div><span className="sender">{msg?.sender} </span><span className="time">{format(msg.timestamp)}</span></div>
                <div>{msg.message}</div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          {
            data.isMember && <form className="message-form" onSubmit={handleSubmit}>
              <input type="text" name="text" className="input-message" placeholder="Type a message..." />
              <button type="submit">Send</button>
            </form>
          }
        </>
      }
    </div>
  );
};

export default Chat;

