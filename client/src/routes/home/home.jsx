import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './home.scss';
import Channel from '../../components/channel/channel';
import apiRequest from '../../lib/apiRequest';
import Forex from '../../components/forex/forex';
import Chat from '../../components/chat/chat';

const Home = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [channels, setChannels] = useState([])
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const navigate = useNavigate();

  const handleChannelClick = (channelId) => {
    setSelectedChannelId(channelId);
  };

  return (
    <>
      {
        currentUser ? <div className="main-layout">
          < Channel onChannelClick={handleChannelClick} />
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