import React, { useEffect, useState } from 'react';
import useNotificationStore from '../../lib/notificationStore';
import './notification.scss';
import apiRequest from '../../lib/apiRequest';
import { FaTimes } from 'react-icons/fa';

const Notification = ({ onChannelClick }) => {
    const notifications = useNotificationStore((state) => state.notifications);
    const clearNotifications = useNotificationStore((state) => state.clearNotifications);
    const [validNotifications, setValidNotifications] = useState([]);

    console.log("All notifications: ", notifications);

    useEffect(() => {
        const isChannelMember = async (channelId) => {
            try {
                const response = await apiRequest.get(`/channel/check/${channelId}`);
                if (response.status === 200) {
                    return { isMember: true, channelName: response.data.channelName };
                }
            } catch (err) {
                console.log("Error checking membership:", err);
            }
            return { isMember: false };
        };

        const checkNotifications = async () => {
            const validNotifs = [];

            for (let notification of notifications) {
                const { isMember, channelName } = await isChannelMember(notification.channelId);
                if (isMember) {
                    validNotifs.push({ ...notification, channelName });
                }
            }

            setValidNotifications(validNotifs);

        };

        if (notifications.length > 0) {
            checkNotifications();
        }
    }, [notifications]);

    const handleClearNotifications = () => {
        clearNotifications();
        setValidNotifications([])
    };

    const checkNoti = (channelId) => {
        onChannelClick(channelId)
        handleClearNotifications();
    }

    return (
        <div className="notification-container">
            {
                validNotifications.length > 0 &&
                <button onClick={handleClearNotifications} className="clear-button">
                    <FaTimes className="clear-icon" />
                </button>

            }
            {validNotifications.length > 0 ? (
                validNotifications.map((notification, index) => (
                    <div key={index} className="notification" onClick={() => checkNoti(notification.channelId)}>
                        {`${notification.sender} sent a new message in ${notification.channelName}"`}
                    </div>
                ))
            ) : (
                <div>No new notifications</div>
            )}
        </div>
    );
};

export default Notification;
