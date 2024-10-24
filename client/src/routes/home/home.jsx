import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './home.scss';
import Channel from '../../components/channel/channel';
import Forex from '../../components/forex/forex';
import Chat from '../../components/chat/chat';

const Home = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  const handleChannelClick = (channelId) => {
    setSelectedChannelId(channelId);
  };

  return (
    <>
      {
        currentUser ? <div className="main-layout">
          <Channel onChannelClick={handleChannelClick} />
          <div className="chat-area">
            <div className="user-info">User: {currentUser.username}</div>
            <Chat channelId={selectedChannelId} role={currentUser.role} />
          </div>
          <Forex />

        </div >
          :
          <Navigate to={'/login'} />
      }
    </>

  )
}

export default Home