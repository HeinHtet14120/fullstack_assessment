import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './channel.scss';
import { FaTrash } from 'react-icons/fa';
import apiRequest from '../../lib/apiRequest';
import { AuthContext } from '../../context/AuthContext';
import Notification from '../notification/notification';
import { FaLock, FaPlus } from 'react-icons/fa';
import useNotificationStore from '../../lib/notificationStore';

const Channel = ({ onChannelClick }) => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [create, setCreate] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privateChannels, setprivateChannels] = useState([])
  const addNotification = useNotificationStore((state) => state.addNotification);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChannels = async () => {

      setIsLoading(true);

      try {
        const publicChannelsResponse = await apiRequest.get("/channel/public");
        const userChannelsResponse = await apiRequest.get("/channel/user");
        const notmemberChannels = await apiRequest.get("/channel/user/not-member");

        console.log("this is notmemberChannels : ", notmemberChannels.data.channels)

        const mergedChannels = [...publicChannelsResponse.data, ...userChannelsResponse.data];
        setChannels(mergedChannels);
        setprivateChannels(notmemberChannels.data.channels);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to load channels");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, [currentUser]);

  const handleClick = (channelId) => {
    onChannelClick(channelId);
  };

  const handleDelete = async (id) => {
    try {
      const res = await apiRequest.delete(`/channel/delete/${id}`);
      console.log("This is deleted react : ", res)
      setChannels(prevChannels => prevChannels.filter(channel => channel.id !== id));
    } catch (error) {
      console.log("Error deleting the channel:", error);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await apiRequest.post("/auth/logout");
      localStorage.clear();
      updateUser(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateChannel = async (e) => {
    if (!newChannelName.trim()) {
      alert("Channel name cannot be empty");
      return;
    }
    setIsSubmitting(true);
    try {

      const response = await apiRequest.post('/channel', {
        name: newChannelName,
        isPrivate
      });
      setChannels([...channels, response.data]);
      setCreate(false);
      setNewChannelName("");
      setIsPrivate(false);
      navigate('/home')
    } catch (error) {
      console.log("Error creating the channel:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserChannelJoin = async (channelId) => {
    setIsLoading(true);
    try {
      const response = await apiRequest.post('/channel/user/join', {
        id: channelId,
      });
      if (response.status === 200) {
        setprivateChannels((prevChannels) =>
          prevChannels.filter((channel) => channel.id !== channelId)
        );

        console.log('this is checking memebrs : ', response.data.channel.members)
        setChannels([...channels, response.data.channel]);
        navigate('/home');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="channel-sidebar">
      {isLoading ? (
        <div>Loading channels...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <ul>
          {channels.map((channel) => (
            <li
              className="channel"
              key={channel.id}
              onClick={() => handleClick(channel.id)}
            >
              # {channel.name}

              {currentUser._id === channel.created_by && currentUser.role === 'admin' && (
                <span className="delete">
                  <FaTrash
                    className="delete-icon"
                    onClick={() => handleDelete(channel.id)}
                  />
                </span>
              )}
            </li>
          ))}

          {
            privateChannels.length > 0 && currentUser.role === "trader" && (
              <div>
                <ul>
                  {privateChannels.map((channel) => (
                    <li key={channel.id} className='private' >
                      <span className='lock'>{channel.name}<FaLock /></span>
                      <span className='add' onClick={(e) => handleUserChannelJoin(channel.id)}>
                        {isLoading ? <span>Joining...</span> : <FaPlus />}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }
          {currentUser.role === 'admin' && (
            <li className="create-channel" onClick={() => setCreate(true)}>
              Create New Channel
            </li>
          )}
        </ul>
      )}
      {create && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Channel</h2>
            <form onSubmit={handleCreateChannel}>
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="Channel Name"
                required
              />
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(!isPrivate)}
                  />
                  Private Channel
                </label>
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create"}
              </button>
              <button type="button" onClick={() => setCreate(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <Notification onChannelClick={onChannelClick} />
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Channel;
