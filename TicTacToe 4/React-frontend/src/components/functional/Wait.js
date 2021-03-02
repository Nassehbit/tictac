import React from 'react';

const Wait = ({display}) => {
    return (
        <div className='wait' style={{display:display?'flex':'none'}}>
            <h1 className="wait-message">Waiting for player to connect...</h1>
        </div>
    );
}

export default Wait;
