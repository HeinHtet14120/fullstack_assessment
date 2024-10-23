import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './chat.scss';
import { FaTrash } from 'react-icons/fa';
import apiRequest from '../../lib/apiRequest';

const Chat = ({ channelId, role }) => {

  return (
    <div className="messages">
        <h1>{channelId}</h1>
    </div>
  );
}

export default Chat;
