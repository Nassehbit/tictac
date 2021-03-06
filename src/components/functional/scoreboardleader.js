import React from 'react'
import Scoreleader from './scoreleader'

export default function ScoreBoardleader({data}) {
    return (
        <div className='score-board'>
            <h1 className="score-title">leaderboard</h1>
            <Scoreleader name={data} />
        </div>
    )
}
