import React from 'react'
import "./test.scss";

const Test = () => {
    return (
        <div class="main-layout">
            <div class="channel-sidebar">
                <ul>
                    <li>General</li>
                    <li>Trading</li>
                    <li>Alerts</li>
                    <li class="create-channel">Create New Channel</li>
                </ul>
            </div>
            <div class="chat-area">
                <div class="user-info">User: You</div>
                <div class="messages">
                    <div class="message">[Messages...]</div>
                    <div class="message">[Messages...]</div>
                </div>
                <input type="text" class="input-message" placeholder="Input message..." />
            </div>
            <div class="forex-feed">
                <table>
                    <thead>
                        <tr>
                            <th>Pair</th>
                            <th>Bid</th>
                            <th>Ask</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="pair-row">
                            <td>EUR/USD</td>
                            <td>1.05</td>
                            <td>1.06</td>
                        </tr>
                        <tr class="pair-row">
                            <td>GBP/USD</td>
                            <td>1.25</td>
                            <td>1.26</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    )
}

export default Test