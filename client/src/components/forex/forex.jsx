import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../context/SocketContext';
import './forex.scss'
const Forex = () => {
    const [forexData, setForexData] = useState([]);
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        if (!socket) return;

        socket.on('forexUpdate', (data) => {
            setForexData(data);
            console.log(forexData)
        });

        return () => {
            socket.off('forexUpdate');
        };
    }, [socket]);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12 || 12; 

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
    };

    return (
        <div className="forex-feed">
            <table>
                <thead>
                    <tr className='heading'>
                        <th>Pair</th>
                        <th>Bid</th>
                        <th>Ask</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {forexData.map((pair, index) => (
                        <tr key={index} className="pair-row">
                            <td>{pair.pair}</td>
                            <td className="bid-price">{pair.bid}</td>
                            <td className="ask-price">{pair.ask}</td> 
                            <td className='time'>{formatTime(pair.timestamp)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Forex;

