import React from 'react'

const Forex = () => {
    return (
        <>
            <div className="forex-feed">
                <table>
                    <thead>
                        <tr>
                            <th>Pair</th>
                            <th>Bid</th>
                            <th>Ask</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="pair-row">
                            <td>EUR/USD</td>
                            <td>1.05</td>
                            <td>1.06</td>
                        </tr>
                        <tr className="pair-row">
                            <td>GBP/USD</td>
                            <td>1.25</td>
                            <td>1.26</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Forex;