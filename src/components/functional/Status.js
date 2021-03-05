import React from 'react'

export default function Status({message}) {
    return (
        <div className='status'>
            <h3 className="status-message">{message}</h3>
        </div>
    )
}
