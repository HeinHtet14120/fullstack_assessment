import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './channel.scss';
import { FaTrash } from 'react-icons/fa';
import apiRequest from '../../lib/apiRequest';
import { AuthContext } from '../../context/AuthContext';

const Channel = ({ onChannelClick }) => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [create, setCreate] = useState(false);
  const [newChannelName, setNewChannelName] = useState(""); 
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChannels = async () => {
      setError("");
      setIsLoading(true);

      try {
        const publicChannelsResponse = await apiRequest.get("/channel/public");
        const userChannelsResponse = await apiRequest.get("/channel/user");

        const mergedChannels = [...publicChannelsResponse.data, ...userChannelsResponse.data];
        setChannels(mergedChannels);
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

  const handleDelete = async (e, id) => {
    try {
      const res = await apiRequest.delete(`/channel/${id}`);
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
                    onClick={(e) => handleDelete(e, channel.id)}
                  />
                </span>
              )}
            </li>
          ))}
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

      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Channel;
