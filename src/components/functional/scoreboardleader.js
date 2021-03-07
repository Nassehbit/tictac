import React from 'react'
import Scoreleader from './scoreleader'

export default function ScoreBoardleader({data}) {
    return (
        <div className='score-board-leader'>
            <h1 className="score-title">LEADERBOARD</h1>
            <Scoreleader name={data} />
        </div>
    )
}
